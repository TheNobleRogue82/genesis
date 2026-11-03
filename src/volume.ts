import * as THREE from 'three';
import { particleMotion } from './particles';

// GPU deposition from the same particle identities and deformation as the stars.
const GRID = 48, COLUMNS = 8, EXTENT = 12, SAMPLES = 6000;
const atlasGLSL = `
uniform sampler2D uDensity;
uniform float uMedium,uDust;
const float GRID=48., EXTENT=12.;
float sliceDensity(vec2 xy,float z){
 vec2 tile=vec2(mod(z,8.),floor(z/8.));
 vec2 pixel=clamp(xy,vec2(.5),vec2(GRID-.5));
 return texture2D(uDensity,(tile*GRID+pixel)/vec2(384.,288.)).r;
}
float densityAt(vec3 p){
 vec3 cell=(p/24.+.5)*GRID;
 if(any(lessThan(cell,vec3(.5)))||any(greaterThan(cell,vec3(GRID-.5))))return 0.;
 float z=cell.z-.5;
 return min(3.,mix(sliceDensity(cell.xy,floor(z)),sliceDensity(cell.xy,ceil(z)),fract(z)));
}
vec2 mediumInterval(vec3 ro,vec3 rd){
 // Componentwise safe reciprocals for slab intersection, including parallel rays.
 vec3 safe=vec3(rd.x<0.?-1.:1.,rd.y<0.?-1.:1.,rd.z<0.?-1.:1.)*max(abs(rd),vec3(.00001));
 vec3 a=(-vec3(EXTENT)-ro)/safe,b=(vec3(EXTENT)-ro)/safe;
 vec3 lo=min(a,b),hi=max(a,b);
 return vec2(max(0.,max(lo.x,max(lo.y,lo.z))),min(hi.x,min(hi.y,hi.z)));
}
float extinctionAt(float density){return density*uMedium*uDust*.10;}
`;
export const transmissionGLSL = `${atlasGLSL}
float mediumTransmission(vec3 p){
 if(uMedium<=0.)return 1.;
 vec3 delta=p-cameraPosition;float distanceToStar=length(delta);
 vec3 rd=delta/max(distanceToStar,.0001);vec2 interval=mediumInterval(cameraPosition,rd);
 float end=min(interval.y,distanceToStar);
 if(end<=interval.x)return 1.;
 float stepSize=(end-interval.x)/8.;float opticalDepth=0.;
 for(int i=0;i<8;i++)opticalDepth+=extinctionAt(densityAt(cameraPosition+rd*(interval.x+(float(i)+.5)*stepSize)))*stepSize;
 return exp(-opticalDepth);
}`;
const quadVertex = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
const volumeFragment = `
varying vec2 vUv;
uniform mat4 uInverseProjection,uCameraWorld;
uniform vec3 uEye;
uniform int uSteps;
uniform float uLight;
${atlasGLSL}
void main(){
 vec4 eye=uInverseProjection*vec4(vUv*2.-1.,-1.,1.);
 vec3 rd=normalize(mat3(uCameraWorld)*(eye.xyz/eye.w));
 vec2 interval=mediumInterval(uEye,rd);
 if(interval.y<=interval.x){gl_FragColor=vec4(0.);return;}
 float stepSize=(interval.y-interval.x)/float(uSteps);
 vec3 light=vec3(0.);float transmission=1.;
 for(int i=0;i<48;i++){
  if(i>=uSteps||transmission<.01)break;
  vec3 p=uEye+rd*(interval.x+(float(i)+.5)*stepSize);
  float density=densityAt(p)*uMedium;
  float extinction=density*uDust*.10;
  float attenuation=exp(-extinction*stepSize);
  float weight=extinction>.00001?(1.-attenuation)/extinction:stepSize;
  float radius=length(p);
  vec3 tint=mix(vec3(1.,.64,.32),vec3(.30,.49,.84),smoothstep(.35,4.,radius));
  // Density is the source of the filaments; no unrelated procedural galaxy.
  light+=transmission*tint*density*uLight*.08*weight;
  transmission*=attenuation;
 }
 gl_FragColor=vec4(light,1.-transmission);
}`;

export class ParticleVolume {
 readonly uniforms: Record<string, THREE.IUniform>;
 readonly available: boolean;
 enabled: boolean;
 steps = 16;
 scale = .25;
 private densityTarget: THREE.WebGLRenderTarget;
 private lightTarget: THREE.WebGLRenderTarget;
 private depositScene = new THREE.Scene();
 private passScene = new THREE.Scene();
 private passCamera = new THREE.Camera();
 private deposit: THREE.Points;
 private composite: THREE.Mesh;
 private cache = '';
 private generation = 0;
 private colorTarget = new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,depthBuffer:false});
 private outputScene = new THREE.Scene();
 constructor(private renderer:THREE.WebGLRenderer,scene:THREE.Scene,motion:Record<string,THREE.IUniform>,source:THREE.BufferGeometry){
  this.available=renderer.extensions.has('EXT_color_buffer_float');
  const gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');
  const device=debug?String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)):'';
  const software=/swiftshader|llvmpipe|software/i.test(device);
  this.enabled=this.available && innerWidth>=700 && !software;
  this.densityTarget=new THREE.WebGLRenderTarget(GRID*COLUMNS,GRID*6,{type:THREE.HalfFloatType,depthBuffer:false,minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});
  this.lightTarget=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,depthBuffer:false});
  this.uniforms={...motion,uDensity:{value:this.densityTarget.texture},uMedium:{value:0},uDust:{value:1},uLight:{value:.55},uSteps:{value:24},uInverseProjection:{value:new THREE.Matrix4()},uCameraWorld:{value:new THREE.Matrix4()},uEye:{value:new THREE.Vector3()}};
  const depositMaterial=new THREE.ShaderMaterial({uniforms:this.uniforms,depthTest:false,depthWrite:false,transparent:true,blending:THREE.AdditiveBlending,
   vertexShader:`${particleMotion}\nattribute float aSlice;varying float vZ;varying vec2 vTile;void main(){
    vec3 cell=(particlePosition()/24.+.5)*48.;
    float z=floor(cell.z-.5)+aSlice;vZ=(z+.5-cell.z)/1.1;
    vTile=vec2(mod(z,8.),floor(z/8.));
    vec2 pixel=vTile*48.+cell.xy;
    gl_Position=vec4(pixel/vec2(384.,288.)*2.-1.,0.,1.);gl_PointSize=4.;
    if(z<0.||z>=48.)gl_Position=vec4(3.,3.,0.,1.);
   }`,fragmentShader:`varying float vZ;varying vec2 vTile;void main(){
    if(any(notEqual(floor(gl_FragCoord.xy/48.),vTile)))discard;
    vec2 xy=(gl_PointCoord-.5)*4./1.1;
    float weight=exp(-1.5*(dot(xy,xy)+vZ*vZ))*.10;
    gl_FragColor=vec4(weight,0.,0.,1.);
   }`});
  this.deposit=new THREE.Points(new THREE.BufferGeometry(),depositMaterial);this.deposit.frustumCulled=false;this.depositScene.add(this.deposit);this.setSource(source);
  const material=new THREE.ShaderMaterial({uniforms:this.uniforms,vertexShader:quadVertex,fragmentShader:volumeFragment,depthTest:false,depthWrite:false});
  this.passScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),material));
  this.composite=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({uniforms:{uLightBuffer:{value:this.lightTarget.texture}},vertexShader:quadVertex,fragmentShader:'varying vec2 vUv;uniform sampler2D uLightBuffer;void main(){gl_FragColor=texture2D(uLightBuffer,vUv);}',transparent:true,depthTest:false,depthWrite:false,blending:THREE.CustomBlending,blendSrc:THREE.OneFactor,blendDst:THREE.OneMinusSrcAlphaFactor}));
  const outputMaterial=new THREE.ShaderMaterial({uniforms:{uScene:{value:this.colorTarget.texture}},vertexShader:quadVertex,fragmentShader:`varying vec2 vUv;uniform sampler2D uScene;void main(){
 gl_FragColor=texture2D(uScene,vUv);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`,depthTest:false,depthWrite:false});
  this.outputScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),outputMaterial));
  this.composite.renderOrder=-1;this.composite.frustumCulled=false;scene.add(this.composite);
 }
 setSource(source:THREE.BufferGeometry){
  const geometry=new THREE.BufferGeometry(),count=Math.min(SAMPLES,source.getAttribute('position').count);
  for(const name of ['position','aTarget','aMeta']){
   const attr=source.getAttribute(name),data=new Float32Array(count*4*attr.itemSize);
   for(let i=0;i<count;i++)for(let slice=0;slice<4;slice++)for(let k=0;k<attr.itemSize;k++)data[(i*4+slice)*attr.itemSize+k]=(attr.array as Float32Array)[i*attr.itemSize+k];
   geometry.setAttribute(name,new THREE.BufferAttribute(data,attr.itemSize));
  }
  const slices=new Float32Array(count*4);for(let i=0;i<slices.length;i++)slices[i]=i%4-1;
  geometry.setAttribute('aSlice',new THREE.BufferAttribute(slices,1));this.deposit.geometry.dispose();this.deposit.geometry=geometry;this.generation++;
 }
 drawScene(scene:THREE.Scene,camera:THREE.Camera){
  if(!this.available){this.renderer.render(scene,camera);return;}
  const size=this.renderer.getDrawingBufferSize(new THREE.Vector2());
  if(this.colorTarget.width!==size.x||this.colorTarget.height!==size.y)this.colorTarget.setSize(size.x,size.y);
  this.renderer.setRenderTarget(this.colorTarget);this.renderer.render(scene,camera);
  this.renderer.setRenderTarget(null);this.renderer.render(this.outputScene,this.passCamera);
 }
 render(camera:THREE.PerspectiveCamera,progress:number,reveal:number){
  const amount=this.enabled&&this.available?THREE.MathUtils.smoothstep(progress,.18,.7)*(1.-reveal*.6):0;
  this.uniforms.uMedium.value=amount;this.composite.visible=amount>0;
  if(amount===0)return;
  const size=this.renderer.getDrawingBufferSize(new THREE.Vector2());
  const width=Math.max(1,Math.floor(size.x*this.scale)),height=Math.max(1,Math.floor(size.y*this.scale));
  if(this.lightTarget.width!==width||this.lightTarget.height!==height)this.lightTarget.setSize(width,height);
  const oldColor=this.renderer.getClearColor(new THREE.Color()),oldAlpha=this.renderer.getClearAlpha();this.renderer.setClearColor(0,0);
  const key=[this.generation,progress,reveal,this.uniforms.uFlow.value,this.uniforms.uTime.value].join(':');
  if(key!==this.cache){this.renderer.setRenderTarget(this.densityTarget);this.renderer.render(this.depositScene,this.passCamera);this.cache=key;}
  camera.updateMatrixWorld();this.uniforms.uInverseProjection.value.copy(camera.projectionMatrixInverse);this.uniforms.uCameraWorld.value.copy(camera.matrixWorld);this.uniforms.uEye.value.copy(camera.position);this.uniforms.uSteps.value=this.steps;
  this.renderer.setRenderTarget(this.lightTarget);this.renderer.render(this.passScene,this.passCamera);
  this.renderer.setRenderTarget(null);this.renderer.setClearColor(oldColor,oldAlpha);
 }
}

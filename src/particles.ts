import * as THREE from 'three';
export const PHRASE = 'Everything is connected';
export interface LabConfig { seed: number; count: number; arms: number; spread: number }
export function randomSource(seed:number) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function createParticles(config:LabConfig) {
 const random=randomSource(config.seed), canvas=document.createElement('canvas'); canvas.width=1800; canvas.height=220;
 const ctx=canvas.getContext('2d')!; ctx.font='112px Georgia, serif'; ctx.textBaseline='middle';
 const width=ctx.measureText(PHRASE).width, start=(canvas.width-width)/2;
 ctx.fillStyle='white'; ctx.fillText(PHRASE,start,110);
 const pixels=ctx.getImageData(0,0,1800,220).data;
 const samples:number[][]=[];
 const boundaries=Array.from(PHRASE,(_,i)=>start+ctx.measureText(PHRASE.slice(0,i+1)).width);
 for(let y=25;y<190;y+=2)for(let x=0;x<1800;x+=2)if(pixels[(y*1800+x)*4+3]>100){
  const char=boundaries.findIndex(end=>x<end); const word=char<10?0:char<13?1:2;
  samples.push([(x-900)/90,(110-y)/90,char,word]);
 }
 const origin=new Float32Array(config.count*3), target=new Float32Array(config.count*3), meta=new Float32Array(config.count*4);
 for(let i=0;i<config.count;i++){
  const s=samples[Math.floor(random()*samples.length)]; origin.set([s[0]+(random()-.5)*.018,s[1]+(random()-.5)*.018,(random()-.5)*.035],i*3);
  const halo=random()<.12, radius=halo?2+random()*8:Math.pow(random(),1.65)*8.3;
  const arm=(s[3]+Math.floor(random()*config.arms))*Math.PI*2/config.arms;
  const angle=arm+radius*.63+(random()-.5)*(.22+config.spread/(radius+.4));
  const height=(random()+random()+random()-1.5)*(halo?3.5:.16+radius*.035);
  const x=Math.cos(angle)*radius, z=Math.sin(angle)*radius;
  target.set([x,height*.86-z*.51,height*.51+z*.86],i*3);
  meta.set([random(),random(),s[2],s[3]],i*4);
 }
 const geometry=new THREE.BufferGeometry(); geometry.setAttribute('position',new THREE.BufferAttribute(origin,3)); geometry.setAttribute('aTarget',new THREE.BufferAttribute(target,3)); geometry.setAttribute('aMeta',new THREE.BufferAttribute(meta,4));
 return geometry;
}
export const particleMotion=`
uniform float uProgress,uTime,uFlow,uReveal; attribute vec3 aTarget; attribute vec4 aMeta;
float particleTravel(){
 float activation=smoothstep(.17+aMeta.z*.004,.76+aMeta.x*.13,uProgress);
 return activation*activation*(3.-2.*activation);
}
vec3 particlePosition(){
 float travel=particleTravel();
 vec3 p=mix(position,aTarget,travel);
 float envelope=sin(travel*3.14159265);
 float phase=aMeta.x*6.28318;
 // Analytic swirling vector field: identical seed and timeline give identical paths.
 vec3 field=vec3(sin(p.y*1.2+phase+travel*5.),cos(p.x*.7+phase-travel*4.),sin(p.x*.5+p.y+phase));
 p+=field*envelope*uFlow;
 float angle=envelope*(.3+aMeta.y*.7);
 p.xy=mat2(cos(angle),-sin(angle),sin(angle),cos(angle))*p.xy;
 // Reorder the original matter, never a text overlay, in the discovery viewpoint.
 float reveal=uReveal*smoothstep(.75,1.,uProgress);
 float memory=(1.-step(.3,aMeta.x))*reveal;
 p=mix(p,position*.58,memory);
 p+=vec3(sin(uTime*.25+phase),cos(uTime*.2+phase),0.)*.012*travel*(1.-reveal);
 return p;
}
`;
export const vertexShader=`
uniform float uSize,uPixelRatio; varying vec3 vColor; varying float vAlpha;
${particleMotion}
#include <medium_transmission>
void main(){
 vec3 p=particlePosition();
 float travel=particleTravel();
 float reveal=uReveal*smoothstep(.75,1.,uProgress);
 vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv;
 gl_PointSize=clamp(uSize*uPixelRatio*(.65+aMeta.y*1.25)*22./max(3.,-mv.z),.6,7.);
 vec3 cool=vec3(.48,.67,1.); vec3 warm=vec3(1.,.76,.43);
 vColor=mix(cool,warm,smoothstep(.72,.99,aMeta.x)); vColor=mix(vec3(.83,.88,1.),vColor,travel);
 vAlpha=mix(.38,.55,travel)*(.55+aMeta.y*.7);
 vAlpha*=mix(1.,mix(.23,1.2,1.-smoothstep(.25,.35,aMeta.x)),reveal);
 vAlpha*=mediumTransmission(p);
}`;
export const fragmentShader=`
precision highp float; varying vec3 vColor; varying float vAlpha;
void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
float core=exp(-r*r*9.);float halo=exp(-r*r*3.)*.18;
gl_FragColor=vec4(vColor,(core+halo)*vAlpha);}`;

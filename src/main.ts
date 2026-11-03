import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createParticles, vertexShader, fragmentShader, PHRASE, randomSource } from './particles';
import { ParticleVolume, transmissionGLSL } from './volume';
import './style.css';
const app=document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML=`<header><div><h1>GENESIS</h1><p>Words are matter</p></div><div class="edition">An experiment in becoming<span>SHADER LAB · 001</span></div></header>
<section class="caption"><span class="eyebrow" id="phase">01 / ORIGIN</span><h2 id="title">Before the first star.</h2><p id="description">One phrase. A universe held within it.<br>Release the words and follow their matter.</p><p id="notice"></p></section>
<details><summary>Laboratory</summary><label>Flow strength <span id="flowValue">1.4</span><input id="flow" aria-label="Flow strength" type="range" min="0" max="3" value="1.4" step=".1"></label><label>Starlight <input id="size" aria-label="Particle size" type="range" min=".7" max="3" value="1.5" step=".1"></label><label>Quality<select id="quality"><option value="48000">High · 48,000 particles</option><option value="20000">Light · 20,000 particles</option></select></label><label>Atmosphere<select id="medium"><option value="on">Volume · on</option><option value="off">Particles only</option></select></label><label>Mist light<input id="mist" aria-label="Mist light" type="range" min="0" max="1.5" step=".05" value=".55"></label><label>Dust absorption<input id="dust" aria-label="Dust absorption" type="range" min="0" max="2" step=".1" value="1"></label><label>Volume quality<select id="volumeQuality"><option value="16">Light · 16 samples</option><option value="24">Balanced · 24 samples</option><option value="40">Fine · 40 samples</option></select></label><label>Camera<select id="camera"><option value="origin">Origin / face on</option><option value="overview">Galaxy / oblique</option><option value="edge">Galaxy / edge</option><option value="discovery">Discover the phrase</option></select></label><button id="capture">Capture frame</button><button id="record">Record transition</button><button id="presentation">Presentation · H</button><p class="stats" id="stats"></p></details>
<footer class="transport"><button class="primary" id="play">Release matter</button><button id="replay" aria-label="Replay from origin">↺ Replay</button><div class="timeline"><label for="progress"><span>TRANSFORMATION</span><output id="percent">000%</output></label><input id="progress" type="range" min="0" max="1" value="0" step=".001" aria-label="Transformation progress"></div><span class="hint">Drag to orbit · Scroll to approach · Space to pause</span></footer>`;
const byId=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer:THREE.WebGLRenderer;
try {renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,alpha:false});}catch{
 app.innerHTML=`<main class="fallback">${PHRASE}<p>GENESIS needs WebGL2 to turn words into matter. Try a browser with graphics acceleration enabled.</p></main>`;throw new Error('WebGL2 unavailable');
}
renderer.setClearColor(0x050810);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','Interactive particle artwork. Drag to orbit; use camera presets for keyboard navigation.');app.prepend(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,180);camera.position.set(0,0,23);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=!reduced;controls.dampingFactor=.065;controls.minDistance=6;controls.maxDistance=45;controls.enablePan=false;
const config={seed:731,count:innerWidth<700?20000:48000,arms:3,spread:.85};byId<HTMLSelectElement>('quality').value=String(config.count);
const uniforms={uProgress:{value:0},uTime:{value:0},uFlow:{value:1.4},uSize:{value:1.5},uPixelRatio:{value:renderer.getPixelRatio()},uReveal:{value:0}};
const geometry=createParticles(config);
const volume=new ParticleVolume(renderer,scene,uniforms,geometry);
byId<HTMLSelectElement>('medium').value=volume.enabled?'on':'off';
if(!volume.available){byId<HTMLSelectElement>('medium').disabled=true;byId('notice').textContent='Volume unavailable on this GPU. Particle rendering remains available.';}
const material=new THREE.ShaderMaterial({uniforms:volume.uniforms,vertexShader:vertexShader.replace('#include <medium_transmission>',transmissionGLSL),fragmentShader,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
const points=new THREE.Points(geometry,material);points.frustumCulled=false;scene.add(points);
const random=randomSource(918),background=new Float32Array(900*3);
for(let i=0;i<900;i++)background.set([(random()-.5)*120,(random()-.5)*90,-15-random()*60],i*3);
const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.BufferAttribute(background,3));const distantStars=new THREE.Points(starGeometry,new THREE.PointsMaterial({color:0x7386aa,size:.035,transparent:true,opacity:.36,depthWrite:false}));distantStars.renderOrder=-2;scene.add(distantStars);
let progress=0,playing=false,last=performance.now(),frames=0,statsStart=last,elapsed=0,reveal=0,recording:MediaRecorder|null=null;
const slider=byId<HTMLInputElement>('progress'),play=byId<HTMLButtonElement>('play');
const phases=[['01 / ORIGIN','Before the first star.','One phrase. A universe held within it.'],['02 / FILAMENT','Language loosens its edges.','Every point remembers where it began.'],['03 / RELEASE','Let there be distance.','Letters open into currents of light.'],['04 / FORMATION','A gravity of its own.','Streams gather into arms, a core, a halo.'],['05 / EXPLORATION','Everything is connected.','Orbit the galaxy. Approach to discover its origin.'],['06 / REDISCOVERY','The words were always here.','The same matter, remembering its first shape.']];
function updateUI(){slider.value=String(progress);byId('percent').textContent=String(Math.round(progress*100)).padStart(3,'0')+'%';const index=reveal>.35?5:progress<.1?0:progress<.32?1:progress<.6?2:progress<.9?3:4;const p=phases[index];byId('phase').textContent=p[0];byId('title').textContent=p[1];byId('description').textContent=p[2];play.textContent=playing?'Pause':progress===0?'Release matter':progress===1?'Replay':'Continue';}
play.onclick=()=>{if(progress===1)progress=0;playing=!playing;updateUI();};
function reset(){progress=0;elapsed=0;playing=!reduced;camera.position.set(0,0,23);controls.target.set(0,0,0);controls.update();updateUI();}
byId('replay').onclick=reset;slider.oninput=()=>{progress=Number(slider.value);playing=false;updateUI();};
byId<HTMLInputElement>('flow').oninput=e=>{uniforms.uFlow.value=Number((e.target as HTMLInputElement).value);byId('flowValue').textContent=uniforms.uFlow.value.toFixed(1);};
byId<HTMLInputElement>('size').oninput=e=>uniforms.uSize.value=Number((e.target as HTMLInputElement).value);
byId<HTMLSelectElement>('quality').onchange=e=>{config.count=Number((e.target as HTMLSelectElement).value);const old=points.geometry;points.geometry=createParticles(config);old.dispose();volume.setSource(points.geometry);};
byId<HTMLSelectElement>('medium').onchange=e=>volume.enabled=(e.target as HTMLSelectElement).value==='on';
byId<HTMLInputElement>('mist').oninput=e=>volume.uniforms.uLight.value=Number((e.target as HTMLInputElement).value);
byId<HTMLInputElement>('dust').oninput=e=>volume.uniforms.uDust.value=Number((e.target as HTMLInputElement).value);
byId<HTMLSelectElement>('volumeQuality').onchange=e=>{volume.steps=Number((e.target as HTMLSelectElement).value);volume.scale=volume.steps===16?.25:volume.steps===24?.35:.5;};
function preset(name:string){controls.target.set(0,0,0);if(name==='origin')camera.position.set(0,0,23);if(name==='overview')camera.position.set(3,7,22);if(name==='edge')camera.position.set(0,-11.22,18.92);if(name==='discovery'){progress=1;playing=false;camera.position.set(0,0,10);}controls.update();updateUI();}
byId<HTMLSelectElement>('camera').onchange=e=>preset((e.target as HTMLSelectElement).value);
const presentation=()=>document.body.classList.toggle('presentation');byId('presentation').onclick=presentation;
window.addEventListener('keydown',e=>{if((e.target as HTMLElement).matches('input,select,button,summary'))return;if(e.key.toLowerCase()==='h')presentation();if(e.code==='Space'){e.preventDefault();play.click();}if(e.key==='Escape')document.body.classList.remove('presentation');});
function download(blob:Blob,name:string){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
byId('capture').onclick=()=>renderer.domElement.toBlob(b=>{if(b)download(b,`genesis-731-${progress.toFixed(3)}.png`);});
byId('record').onclick=()=>{
 if(recording?.state==='recording'){recording.stop();return;}
 if(!('MediaRecorder' in window)||!renderer.domElement.captureStream){byId('notice').textContent='Video capture is unavailable in this browser.';return;}
 const stream=renderer.domElement.captureStream(30),chunks:BlobPart[]=[];
 try{recording=new MediaRecorder(stream);recording.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recording.onstop=()=>{download(new Blob(chunks,{type:recording!.mimeType}),'genesis-731-transition.webm');stream.getTracks().forEach(t=>t.stop());byId('record').textContent='Record transition';};recording.start();reset();playing=true;byId('record').textContent='Stop recording';}catch{stream.getTracks().forEach(t=>t.stop());byId('notice').textContent='Video encoder unavailable.';}
};
if(reduced)byId('notice').textContent='Reduced motion: use the timeline to inspect still compositions.';
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();playing=false;byId('notice').textContent='Graphics context lost. Reload to restore the artwork.';});
function resize(){camera.aspect=innerWidth/innerHeight;camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(43)/2)/Math.min(1,camera.aspect)));camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}window.addEventListener('resize',resize);resize();
document.addEventListener('visibilitychange',()=>{last=performance.now();});
function frame(now:number){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.25);last=now;if(document.hidden)return;
 if(playing){elapsed+=dt;progress=Math.min(1,progress+dt/22);if(progress===1){playing=false;if(recording?.state==='recording')recording.stop();}}
 controls.update();const distance=camera.position.distanceTo(controls.target);const alignment=Math.max(0,camera.position.clone().normalize().dot(new THREE.Vector3(0,0,1)));
 const desired=THREE.MathUtils.smoothstep(14-distance,0,4)*THREE.MathUtils.smoothstep(alignment,.94,.995);
 reveal=THREE.MathUtils.lerp(reveal,desired,reduced?1:1-Math.exp(-dt*2));if(Math.abs(desired-reveal)<.001)reveal=desired;uniforms.uReveal.value=reveal;uniforms.uProgress.value=progress;uniforms.uTime.value=elapsed;
 renderer.info.autoReset=false;renderer.info.reset();volume.render(camera,progress,reveal);volume.drawScene(scene,camera);updateUI();frames++;if(now-statsStart>1000){const fps=frames*1000/(now-statsStart);byId('stats').textContent=`SEED 731 · ${config.count.toLocaleString()} points\n${fps.toFixed(0)} FPS · ${renderer.info.render.calls} draw calls`;byId('stats').style.whiteSpace='pre-line';frames=0;statsStart=now;}
}
requestAnimationFrame(frame);
// Read-only metrics for reproducible capture and diagnostics.
Object.assign(window,{genesis:{get state(){return {progress,seed:config.seed,count:config.count,drawCalls:renderer.info.render.calls,reveal,volume:volume.enabled,medium:volume.uniforms.uMedium.value,volumeSteps:volume.steps,volumeScale:volume.scale};}}});

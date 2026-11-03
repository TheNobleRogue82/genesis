import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const out='artifacts';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('404'))errors.push(m.text());});
await page.goto('http://127.0.0.1:5173');await page.waitForFunction(()=>window.genesis?.state.drawCalls===2);
const scrub=async value=>{await page.locator('#progress').fill(String(value));await page.locator('#progress').dispatchEvent('input');await page.waitForTimeout(350);};
const metrics=[];
for(const [name,value] of [['origin',0],['filament',.23],['release',.43],['formation',.67],['exploration',1]]){await scrub(value);await page.screenshot({path:`${out}/${name}.png`});metrics.push({name,...await page.evaluate(()=>window.genesis.state)});}
await page.locator('details').evaluate(el=>el.open=true);await page.selectOption('#camera','discovery');await page.waitForFunction(()=>window.genesis.state.reveal>.999,{timeout:15000});await page.locator('details').evaluate(el=>el.open=false);await page.screenshot({path:`${out}/rediscovery.png`});metrics.push({name:'rediscovery',...await page.evaluate(()=>window.genesis.state)});
// Same seed, time and viewpoint must reproduce the same canvas after replay.
await page.locator('details').evaluate(el=>el.open=true);await page.selectOption('#camera','origin');await scrub(0);
const first=await page.evaluate(()=>document.querySelector('canvas').toDataURL());await page.click('#replay');await page.click('#play');await scrub(0);const second=await page.evaluate(()=>document.querySelector('canvas').toDataURL());if(first!==second)throw Error('Origin replay differed');
await page.selectOption('#quality','20000');await page.waitForTimeout(300);if((await page.evaluate(()=>window.genesis.state.count))!==20000)throw Error('Quality did not apply');
await page.selectOption('#quality','48000');await page.selectOption('#camera','overview');await scrub(1);await page.waitForTimeout(1200);metrics.push({name:'overview',stats:await page.locator('#stats').textContent()});
// Real-time canvas recording via the application's own capture control.
await page.selectOption('#camera','origin');const downloadPromise=page.waitForEvent('download',{timeout:120000});await page.click('#record');const download=await downloadPromise;await download.saveAs(`${out}/transition.webm`);
await page.locator('details').evaluate(el=>el.open=false);await page.setViewportSize({width:390,height:844});await scrub(0);await page.screenshot({path:`${out}/mobile-origin.png`});await scrub(1);await page.screenshot({path:`${out}/mobile-galaxy.png`});
// Mouse orbit changes viewpoint; keyboard controls toggle playback.
const before=await page.locator('canvas').screenshot();await page.mouse.move(190,300);await page.mouse.down();await page.mouse.move(280,380,{steps:12});await page.mouse.up();await page.waitForTimeout(500);const after=await page.locator('canvas').screenshot();if(before.equals(after))throw Error('Orbit did not change rendering');
const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto('http://127.0.0.1:5173');await reduced.waitForTimeout(500);if(!await reduced.locator('#notice').textContent())throw Error('Reduced motion notice missing');await reduced.waitForTimeout(500);if((await reduced.evaluate(()=>window.genesis.state.progress))!==0)throw Error('Reduced motion autoplay');await reduced.close();
await page.evaluate(()=>{const c=document.querySelector('canvas');c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext();});await page.waitForTimeout(300);if(!(await page.locator('#notice').textContent()).includes('context lost'))throw Error('Context loss message missing');
await writeFile(`${out}/review.json`,JSON.stringify({metrics,errors,checks:['six phase captures','desktop and mobile','deterministic origin replay','quality switch','mouse orbit','reduced motion initial state','context loss','real-time recording']},null,2));await browser.close();if(errors.length)throw Error(errors.join('\n'));console.log('Browser review passed; artifacts/ contains captures, video and metrics.');

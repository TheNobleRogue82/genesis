import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
await mkdir('artifacts/volume',{recursive:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const rows=[];
try{
await page.goto('http://127.0.0.1:5173');await page.waitForFunction(()=>window.genesis?.state.drawCalls>=2);
const scrub=async p=>{await page.locator('#progress').fill(String(p));await page.locator('#progress').dispatchEvent('input');await page.waitForTimeout(600);};
const medium=async on=>{await page.locator('details').evaluate(el=>el.open=true);await page.selectOption('#medium',on?'on':'off');await page.locator('details').evaluate(el=>el.open=false);await page.waitForTimeout(500);};
await scrub(0);await medium(false);const origin=await page.evaluate(()=>document.querySelector('canvas').toDataURL());await medium(true);if(origin!==await page.evaluate(()=>document.querySelector('canvas').toDataURL()))throw Error('Volume changed origin');
for(const [name,p] of [['origin',0],['filament',.23],['release',.43],['formation',.67],['exploration',1]]){
 await scrub(p);
 for(const on of [false,true]){await medium(on);await page.screenshot({path:`artifacts/volume/${name}-${on?'on':'off'}.png`});await page.waitForTimeout(1100);rows.push({name,on,...await page.evaluate(()=>window.genesis.state),stats:await page.locator('#stats').textContent()});}
}
// With no emission or absorption the medium must be an identity operation.
await medium(false);const bare=await page.evaluate(()=>document.querySelector('canvas').toDataURL());
await medium(true);await page.locator('details').evaluate(el=>el.open=true);
for(const [id,value] of [['mist','0'],['dust','0']]){await page.locator('#'+id).fill(value);await page.locator('#'+id).dispatchEvent('input');}
await page.waitForTimeout(400);if(bare!==await page.evaluate(()=>document.querySelector('canvas').toDataURL()))throw Error('Zero-density optical effect changed the image');
await page.locator('#dust').fill('2');await page.locator('#dust').dispatchEvent('input');await page.waitForTimeout(400);
if(bare===await page.evaluate(()=>document.querySelector('canvas').toDataURL()))throw Error('Absorption had no effect');
for(const [id,value] of [['mist','0.55'],['dust','1']]){await page.locator('#'+id).fill(value);await page.locator('#'+id).dispatchEvent('input');}
for(const camera of ['overview','edge','discovery']){
 await page.locator('details').evaluate(el=>el.open=true);await page.selectOption('#camera',camera);await page.locator('details').evaluate(el=>el.open=false);
 if(camera==='discovery')await page.waitForFunction(()=>window.genesis.state.reveal===1,{timeout:20000});
 await page.screenshot({path:`artifacts/volume/${camera}-on.png`});
}
await page.setViewportSize({width:390,height:844});await page.locator('details').evaluate(el=>el.open=true);await page.selectOption('#camera','origin');await page.selectOption('#volumeQuality','16');await page.selectOption('#quality','20000');await page.locator('details').evaluate(el=>el.open=false);await scrub(1);await page.screenshot({path:'artifacts/volume/mobile-on.png'});await medium(false);await page.screenshot({path:'artifacts/volume/mobile-off.png'});
await writeFile('artifacts/volume/review.json',JSON.stringify({rows,errors},null,2));if(errors.length)throw Error(errors.join('\n'));console.log('Volume comparison passed.');
}finally{await browser.close();}

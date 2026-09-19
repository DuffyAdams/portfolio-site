/** Record current FoodNotes and Traffic UIs in disposable demo contexts.
 * MEDIA_TOOLS_SOURCE=/path/to/FLEX-app node scripts/capture-app-showcases.mjs
 * FoodNotes must run in dev mode; Traffic must use its in-memory mock API.
 */
import {readFile, writeFile, mkdir, symlink} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const source=process.env.MEDIA_TOOLS_SOURCE;
if(!source) throw new Error('Set MEDIA_TOOLS_SOURCE to the checkout containing playwright and ffmpeg-static.');
const output=process.env.APP_CAPTURE_DIR || '/private/tmp/app-showcases';
await mkdir(output,{recursive:true});
process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(output,'browsers');
const {browsers}=JSON.parse(await readFile(path.join(source,'node_modules/playwright-core/browsers.json'),'utf8'));
const revision=browsers.find(b=>b.name==='ffmpeg').revision;
const recorder=path.join(process.env.PLAYWRIGHT_BROWSERS_PATH,`ffmpeg-${revision}`);
await mkdir(recorder,{recursive:true});
await symlink(path.join(source,'node_modules/ffmpeg-static/ffmpeg'),path.join(recorder,'ffmpeg-mac')).catch(e=>{if(e.code!=='EEXIST')throw e;});
const {chromium}=await import(pathToFileURL(path.join(source,'node_modules/playwright/index.mjs')));
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
for(const app of process.env.CAPTURE_APP ? [process.env.CAPTURE_APP] : ['foodnotes','traffic']) {
 for(const format of process.env.CAPTURE_FORMAT ? [process.env.CAPTURE_FORMAT] : ['desktop','mobile']) {
  const mobile=format==='mobile';
  const viewport=mobile?{width:390,height:846}:{width:800,height:900};
  const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile,colorScheme:'light',recordVideo:{dir:output,size:viewport}});
  // All data and writes stay in this disposable local demo environment.
  await context.route('**/*',route=>{
   const url=new URL(route.request().url());
   return ['127.0.0.1','localhost'].includes(url.hostname)||['data:','blob:'].includes(url.protocol)?route.continue():route.abort();
  });
  const beforePage=Date.now();
  const page=await context.newPage();
  page.setDefaultTimeout(15000);
  const url=app==='foodnotes'?(process.env.FOODNOTES_URL||'http://127.0.0.1:5175'):(process.env.TRAFFIC_URL||'http://127.0.0.1:4173');
  const chapters=[];
  const pause=ms=>page.waitForTimeout(ms);
  const home=async()=>{
   await page.goto(url);
   await page.getByRole('button',{name:app==='foodnotes'?'Today':'Stats',exact:true}).waitFor();
   await pause(1500);
   await page.addStyleTag({content:'*{caret-color:transparent!important}'});
   await page.mouse.move(0,0);
  };
  const chapter=async(id,action)=>{
   await pause(500);
   const start=(Date.now()-beforePage)/1000;
   await pause(1200);
   await action();
   await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur()});
   await page.mouse.move(0,0);
   await pause(2800);
   const end=(Date.now()-beforePage)/1000;
   await page.screenshot({path:path.join(output,`${app}-${format}-${id}.png`),timeout:60000});
   chapters.push({id,start,end});
   console.log(`${app} ${format}: ${id}`);
  };
  try {
   await home();
   if(app==='foodnotes') {
    await chapter('journal',async()=>{await page.evaluate(()=>window.scrollBy({top:260,behavior:'smooth'}));await pause(800);});
    await home();
    await chapter('nutrition',async()=>{await page.getByRole('button',{name:'Open Eggs, Bacon & Bagel',exact:true}).click();await pause(900);});
    await home();await page.getByRole('button',{name:'History',exact:true}).click();await pause(700);
    await chapter('history',async()=>{await page.getByRole('button',{name:'Calendar view'}).click();await pause(700);});
    await home();await page.getByRole('button',{name:'Insights',exact:true}).click();await pause(700);
    await chapter('insights',async()=>{await page.getByRole('button',{name:'Show Protein trend',exact:true}).click();await pause(800);});
   } else {
    await chapter('feed',async()=>{await page.evaluate(()=>window.scrollBy({top:230,behavior:'smooth'}));await pause(800);});
    await home();
    await chapter('filter',async()=>{await page.getByRole('button',{name:'SDPD',exact:true}).click();await pause(900);});
    await home();await page.getByRole('button',{name:'Map',exact:true}).click();await pause(3500);
    await page.locator('.maplibregl-canvas').last().waitFor();
    await page.locator('.map-status').waitFor({state:'hidden',timeout:30000});
    await pause(700);
    await chapter('map',async()=>{await page.mouse.move(viewport.width*.6,viewport.height*.55);await page.mouse.wheel(0,-180);await pause(900);});
    await home();
    await chapter('activity',async()=>{await page.getByRole('button',{name:'Stats',exact:true}).click();await pause(900);});
   }
  } finally {
   const elapsed=(Date.now()-beforePage)/1000;
   await context.close();
   await writeFile(path.join(output,`${app}-${format}.json`),JSON.stringify({app,format,viewport,raw:await page.video().path(),elapsed,chapters},null,2));
  }
 }
}
} finally {await browser.close();}

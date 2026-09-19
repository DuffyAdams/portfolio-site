/** Wide, app-only recordings for hover previews. Local demo apps only.
 * MEDIA_TOOLS_SOURCE=/path/to/FLEX-app node scripts/capture-project-previews.mjs
 */
import {readFile,writeFile,mkdir,symlink} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const source=process.env.MEDIA_TOOLS_SOURCE;
if(!source)throw new Error('Set MEDIA_TOOLS_SOURCE to the FLEX checkout containing media tools.');
const output=process.env.PROJECT_CAPTURE_DIR||'/private/tmp/project-previews';
await mkdir(output,{recursive:true});
process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(output,'browsers');
process.env.SCREENSHOT_BASE_URL=process.env.FLEX_URL||'http://127.0.0.1:5173';
const {browsers}=JSON.parse(await readFile(path.join(source,'node_modules/playwright-core/browsers.json'),'utf8'));
const recorder=path.join(process.env.PLAYWRIGHT_BROWSERS_PATH,`ffmpeg-${browsers.find(b=>b.name==='ffmpeg').revision}`);
await mkdir(recorder,{recursive:true});
await symlink(path.join(source,'node_modules/ffmpeg-static/ffmpeg'),path.join(recorder,'ffmpeg-mac')).catch(e=>{if(e.code!=='EEXIST')throw e});
let helpers=await readFile(path.join(source,'screenshot-system/take-screenshots.js'),'utf8');
helpers=helpers.slice(0,helpers.indexOf('main().catch(')).replace("from 'playwright'",`from '${pathToFileURL(path.join(source,'node_modules/playwright/index.mjs'))}'`).replace("new URL('../package.json', import.meta.url)",JSON.stringify(path.join(source,'package.json'))).replace("new URL('../docs-site/screenshot-map.json', import.meta.url)",JSON.stringify(path.join(source,'docs-site/screenshot-map.json')));
await writeFile(path.join(output,'flex-helpers.mjs'),helpers+'\nexport {unlockApp,seedDemoData,waitForAppIdle,openHistory,openExercises,openFirstRoutinePreview};');
const h=await import(pathToFileURL(path.join(output,'flex-helpers.mjs')));
const {version}=JSON.parse(await readFile(path.join(source,'package.json'),'utf8'));
const {chromium}=await import(pathToFileURL(path.join(source,'node_modules/playwright/index.mjs')));
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
for(const app of process.env.CAPTURE_APP?[process.env.CAPTURE_APP]:['foodnotes','traffic','flex']){
 const viewport={width:1200,height:750};
 const context=await browser.newContext({viewport,deviceScaleFactor:1,colorScheme:app==='flex'?'dark':'light',recordVideo:{dir:output,size:viewport}});
 await context.route('**/*',route=>{const u=new URL(route.request().url());return ['127.0.0.1','localhost'].includes(u.hostname)||['data:','blob:'].includes(u.protocol)?route.continue():route.abort()});
 if(app==='flex')await context.addInitScript(version=>{const u='dev@flex.local';for(const[k,v]of Object.entries({flex_username:u,flex_display_name:'Alex Morgan',[`flex_theme_${u}`]:'dark',flex_analytics_consent_v1:'denied',[`flex_release_notes_seen:${version}:${u}`]:'true',[`flex_onboarding_complete:2026-05:${u}`]:'true'}))localStorage.setItem(k,v)},version);
 const beforePage=Date.now(),page=await context.newPage(),chapters=[];
 const pause=ms=>page.waitForTimeout(ms);
 const url=app==='foodnotes'?(process.env.FOODNOTES_URL||'http://127.0.0.1:5175'):app==='traffic'?(process.env.TRAFFIC_URL||'http://127.0.0.1:4173'):process.env.SCREENSHOT_BASE_URL;
 const home=async()=>{await page.goto(url);await pause(2200);};
 // Find the actual scrolling surface: the page or a visible full-size app panel.
 const scroll=async(distance,duration=0)=>page.evaluate(async({distance,duration})=>{
  const doc=document.scrollingElement;
  const candidates=[doc,...document.querySelectorAll('main,section,div')].filter(el=>{
   if(!el||el.scrollHeight-el.clientHeight<30)return false;
   const r=el.getBoundingClientRect(),s=getComputedStyle(el);
   return r.width>400&&r.height>220&&r.top<innerHeight&&r.bottom>100&&(el===doc||['auto','scroll'].includes(s.overflowY));
  });
  const foreground=document.elementFromPoint(innerWidth/2,innerHeight/2);
  const visible=candidates.filter(el=>el.contains(foreground));
  // Prefer the foreground dialog's scroll surface over its obscured page.
  visible.sort((a,b)=>a.contains(b)?1:b.contains(a)?-1:b.clientWidth*b.clientHeight-a.clientWidth*a.clientHeight);
  const el=visible[0];if(!el)return {distance:0};
  const from=el.scrollTop,to=Math.max(0,Math.min(from+distance,el.scrollHeight-el.clientHeight));
  if(!duration){el.scrollTop=to;return {distance:to-from};}
  el.style.scrollBehavior='auto';
  await new Promise(resolve=>{const start=performance.now();function frame(now){const p=Math.min(1,(now-start)/duration),ease=(1-Math.cos(Math.PI*p))/2;el.scrollTop=from+(to-from)*ease;if(p<1)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)});
  return {distance:to-from,surface:el.className||el.tagName};
 },{distance,duration});
 const scene=async(id,distance=380)=>{
  await page.addStyleTag({content:'.internal-launcher{display:none!important} *{caret-color:transparent!important}'});
  if(app==='traffic'&&distance){
   // Preserve real, fully rendered map imagery while scrolling. The app normally
   // releases offscreen WebGL contexts, which can otherwise show tile reloads.
   const maps=page.locator('.mini-map-shell');
   for(let i=0;i<Math.min(await maps.count(),6);i++){
    const shell=maps.nth(i);
    await shell.scrollIntoViewIfNeeded();
    await shell.locator('.mini-map.ready').waitFor({timeout:30000});
    await pause(500);
    const snapshot=await shell.screenshot({animations:'disabled',timeout:30000});
    await shell.evaluate(async(el,src)=>{
     const image=new Image();image.src=src;await image.decode();
     image.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:20;pointer-events:none';
     el.appendChild(image);
    },`data:image/png;base64,${snapshot.toString('base64')}`);
   }
   await scroll(-10000);await pause(700);
  }
  // Warm images and map tiles throughout the exact scroll range before filming.
  if(distance){await scroll(distance);await pause(1800);await scroll(-10000);}
  await page.evaluate(async()=>{
   const visible=[...document.images].filter(i=>{const r=i.getBoundingClientRect();return i.currentSrc&&r.width&&r.height&&r.bottom>0&&r.top<innerHeight});
   await Promise.race([Promise.all(visible.map(i=>i.decode().catch(()=>{}))),new Promise(resolve=>setTimeout(resolve,5000))]);
   if(visible.some(i=>!i.complete||!i.naturalWidth))throw new Error('Visible app images have not loaded; refusing to capture.');
  });
  if(app==='traffic')await page.locator('.map-status').waitFor({state:'hidden',timeout:30000});
  await page.mouse.move(0,0);await pause(1700);
  await page.screenshot({path:path.join(output,`${app}-${id}-start.png`),animations:'disabled',timeout:60000});
  const start=(Date.now()-beforePage)/1000;
  await pause(1200);
  const motion=await scroll(distance,3800);
  await pause(1800);
  const end=(Date.now()-beforePage)/1000;
  await page.screenshot({path:path.join(output,`${app}-${id}-end.png`),animations:'disabled',timeout:60000});
  chapters.push({id,start,end,motion});console.log(app,id,motion);
  await pause(1500); // Keep subsequent navigation well beyond the rendered cut.
 };
 try{
  await home();
  if(app==='foodnotes'){
   await page.getByRole('button',{name:'Today',exact:true}).waitFor();
   await scene('journal',420);
   await home();await page.getByRole('button',{name:'Open Eggs, Bacon & Bagel',exact:true}).click();await pause(1200);
   await scene('meal',320);
   await home();await page.getByRole('button',{name:'Insights',exact:true}).click();await page.getByRole('button',{name:'Show Protein trend',exact:true}).click();await pause(1200);
   await scene('insights',240);
  }else if(app==='traffic'){
   await page.getByRole('button',{name:'Stats',exact:true}).waitFor();await scene('feed',430);
   await home();await page.getByRole('button',{name:'Map',exact:true}).click();await page.locator('.maplibregl-canvas').last().waitFor();await page.locator('.map-status').waitFor({state:'hidden',timeout:30000});await pause(2200);await scene('map',0);
   await home();await page.getByRole('button',{name:'Stats',exact:true}).click();await pause(1300);await scene('activity',260);
  }else{
   console.log('flex: opening demo');await h.unlockApp(page,'/');
   await page.evaluate(async()=>{const{db}=await import('/src/lib/db.ts');for(const t of [db.logs,db.bodyMetrics,db.aiWorkoutPlans])await t.clear();for(const t of [db.programs,db.templates,db.exercises]){const rows=await t.toArray();await t.bulkDelete(rows.filter(r=>r.syncId?.startsWith('flex-internal-fixture-v1')).map(r=>r.id))}});
   console.log('flex: seeding demo');await h.seedDemoData(page);await h.unlockApp(page,'/');await h.waitForAppIdle(page);await scene('routines',330);
   await h.unlockApp(page,'/');await h.openFirstRoutinePreview(page);await h.waitForAppIdle(page);await scene('routine',280);
   await h.unlockApp(page,'/');await h.openHistory(page);await h.waitForAppIdle(page);await scene('history',380);
  }
 }finally{
  const elapsed=(Date.now()-beforePage)/1000;await context.close();
  await writeFile(path.join(output,`${app}.json`),JSON.stringify({app,viewport,raw:await page.video().path(),elapsed,chapters},null,2));
 }
}
}finally{await browser.close()}

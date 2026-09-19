/** Capture the current local FLEX app in disposable demo browser contexts.
 * FLEX_SOURCE=/path/to/FLEX-app FLEX_URL=http://127.0.0.1:5173 node scripts/capture-flex-showcase.mjs
 * Requires FLEX's existing playwright, ffmpeg-static, and a local pro-mode dev server.
 * Outputs raw footage, chapter timings and QA stills to FLEX_CAPTURE_DIR (default /tmp/flex-showcase).
 */
import { readFile, writeFile, mkdir, symlink } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const source = process.env.FLEX_SOURCE;
if (!source) throw new Error('Set FLEX_SOURCE to the local FLEX-app checkout.');
const output = process.env.FLEX_CAPTURE_DIR || '/private/tmp/flex-showcase';
await mkdir(output, {recursive:true});
process.env.SCREENSHOT_BASE_URL = process.env.FLEX_URL || 'http://127.0.0.1:5173';
process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(output,'browsers');
const {version} = JSON.parse(await readFile(path.join(source,'package.json'),'utf8'));
const {browsers} = JSON.parse(await readFile(path.join(source,'node_modules/playwright-core/browsers.json'),'utf8'));
const ffmpeg = path.join(source,'node_modules/ffmpeg-static/ffmpeg');
const revision = browsers.find(b=>b.name==='ffmpeg').revision;
await mkdir(path.join(process.env.PLAYWRIGHT_BROWSERS_PATH,`ffmpeg-${revision}`),{recursive:true});
await symlink(ffmpeg,path.join(process.env.PLAYWRIGHT_BROWSERS_PATH,`ffmpeg-${revision}/ffmpeg-mac`)).catch(e=>{if(e.code!=='EEXIST')throw e;});
// Reuse FLEX's maintained capture helpers without running its complete screenshot catalog.
let helper = await readFile(path.join(source,'screenshot-system/take-screenshots.js'),'utf8');
helper = helper.slice(0,helper.indexOf('main().catch('))
 .replace("from 'playwright'",`from '${pathToFileURL(path.join(source,'node_modules/playwright/index.mjs'))}'`)
 .replace("new URL('../package.json', import.meta.url)",JSON.stringify(path.join(source,'package.json')))
 .replace("new URL('../docs-site/screenshot-map.json', import.meta.url)",JSON.stringify(path.join(source,'docs-site/screenshot-map.json')));
helper += '\nexport {unlockApp,seedDemoData,waitForAppIdle,applyScreenshotSafeArea,openHistory,openExercises,openFirstRoutinePreview,startFirstRoutineWorkout,openFirstHistoryWorkout};';
await writeFile(path.join(output,'helpers.mjs'),helper);
const h = await import(pathToFileURL(path.join(output,'helpers.mjs')));
const {chromium} = await import(pathToFileURL(path.join(source,'node_modules/playwright/index.mjs')));
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
for (const mobile of [false,true]) {
 const name=mobile?'mobile':'desktop';
 const viewport=mobile?{width:390,height:846}:{width:800,height:900};
 const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile,colorScheme:'dark',recordVideo:{dir:output,size:viewport}});
 await context.route('**/*',route=>{
   const url=new URL(route.request().url());
   if(url.hostname==='127.0.0.1'||url.hostname==='localhost'||url.protocol==='data:')return route.continue();
   return route.abort();
 });
 await context.addInitScript(({version})=>{
  const u='dev@flex.local';
  localStorage.setItem('flex_username',u);
  localStorage.setItem('flex_display_name','Alex Morgan');
  localStorage.setItem(`flex_theme_${u}`,'dark');
  localStorage.setItem('flex_analytics_consent_v1','denied');
  localStorage.setItem(`flex_release_notes_seen:${version}:${u}`,'true');
  localStorage.setItem(`flex_onboarding_complete:2026-05:${u}`,'true');
 },{version});
 const beforePage=Date.now();
 const page=await context.newPage();
 page.setDefaultTimeout(15000);
 const chapters=[];
 const pause=ms=>page.waitForTimeout(ms);
 const clean=async()=>{
  await h.waitForAppIdle(page);
  await page.addStyleTag({content:'.internal-launcher{display:none!important} *{caret-color:transparent!important}'});
  if(mobile)await h.applyScreenshotSafeArea(page,{name:'iphone-15-pro'});
  await page.mouse.move(0,0);
  await pause(600);
 };
 const chapter=async(id,action)=>{
  await clean();
  const start=(Date.now()-beforePage)/1000;
  await pause(1400);
  await action();
  await pause(2400);
  await page.mouse.move(0,0);
  await page.screenshot({path:path.join(output,`${name}-${id}.png`)});
  const end=(Date.now()-beforePage)/1000;
  chapters.push({id,start,end});
  console.log(`${name}: ${id} captured (${(end-start).toFixed(1)}s)`);
 };
 try {
  await h.unlockApp(page,'/');
  // Only this disposable browser's IndexedDB is edited. Remove built-in test fixtures
  // so the maintained demo seeder can populate realistic workout history.
  await page.evaluate(async()=>{
   const {db}=await import('/src/lib/db.ts');
   for(const table of [db.logs,db.bodyMetrics,db.aiWorkoutPlans])await table.clear();
   for(const table of [db.programs,db.templates,db.exercises]){
    const rows=await table.toArray();
    await table.bulkDelete(rows.filter(r=>r.syncId?.startsWith('flex-internal-fixture-v1')).map(r=>r.id));
   }
  });
  await h.seedDemoData(page);
  await h.unlockApp(page,'/');
  await chapter('plan',()=>h.openFirstRoutinePreview(page));
  await h.unlockApp(page,'/');
  await h.startFirstRoutineWorkout(page);
  await chapter('train',async()=>{
   const card=page.locator('.workout-sheet .exercise-card-shell').first();
   for(let i=0;i<2;i++){
    const row=card.locator('.set-row').nth(i);
    const inputs=row.locator('.inline-input');
    for(let n=0;n<await inputs.count();n++)await inputs.nth(n).fill(n===0?'135':i===0?'10':'8');
    await row.locator('.check-btn').click();
    await pause(650);
   }
   await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur()});
  });
  await h.unlockApp(page,'/');
  // Clear only the disposable workout draft before filming the library.
  await page.evaluate(()=>{for(const key of Object.keys(localStorage)){if(/draft/i.test(key))localStorage.removeItem(key)}});
  await h.unlockApp(page,'/');
  await h.openExercises(page);
  await chapter('explore',async()=>{
   await page.getByPlaceholder('Search exercises...').pressSequentially('Bench Press',{delay:100});
   await pause(650);
   await page.locator('.ex-card').first().click();
  });
  await h.unlockApp(page,'/');
  await h.openHistory(page);
  await chapter('progress',async()=>{
   await page.locator('.history-card').first().click();
   await page.locator('.history-preview-modal').waitFor();
  });
  await pause(600);
 } finally {
  const closedAt=Date.now();
  await context.close();
  const raw=await page.video().path();
  await writeFile(path.join(output,`${name}.json`),JSON.stringify({version,viewport,raw,chapters,elapsed:(closedAt-beforePage)/1000},null,2));
 }
}
} finally {await browser.close();}

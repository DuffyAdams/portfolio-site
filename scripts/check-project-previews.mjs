/** Interaction regression check. Requires the local portfolio server and Playwright. */
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdir} from 'node:fs/promises';
const root=process.env.MEDIA_TOOLS_SOURCE;
if(!root)throw new Error('Set MEDIA_TOOLS_SOURCE.');
const {chromium}=await import(pathToFileURL(path.join(root,'node_modules/playwright/index.mjs')));
const browser=await chromium.launch({channel:'chrome',headless:true});
const out='/private/tmp/project-preview-qa';await mkdir(out,{recursive:true});
const url=process.env.PORTFOLIO_URL||'http://127.0.0.1:5176';
const appNames=['FoodNotes','San Diego Traffic Watch','FLEX'];
async function state(button){return button.evaluate(el=>{const v=el.querySelector('video');return{requested:el.getAttribute('aria-pressed')==='true',paused:v.paused,time:v.currentTime,width:v.videoWidth,height:v.videoHeight,posterVisible:!el.querySelector('.preview-poster').classList.contains('playing')}})}
async function waitPlaying(button){await button.page().waitForFunction(el=>{const v=el.querySelector('video');return !v.paused&&v.currentTime>.2&&el.querySelector('.preview-poster').classList.contains('playing')},await button.elementHandle());}
async function waitStopped(button){await button.page().waitForFunction(el=>{const v=el.querySelector('video');return v.paused&&v.currentTime===0&&!el.querySelector('.preview-poster').classList.contains('playing')},await button.elementHandle());}
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
 await page.mouse.move(0,0);
 for(const [i,name] of appNames.entries()){
  const card=page.locator('#projects article').filter({has:page.getByRole('heading',{name,exact:true})});
  const button=card.locator('.project-video-preview');await button.scrollIntoViewIfNeeded();await page.waitForTimeout(500);
  assert.equal((await state(button)).paused,true,'Preloading must not autoplay');assert.equal((await state(button)).posterVisible,true);
  await button.screenshot({path:`${out}/${i}-poster.png`,animations:'disabled'});
  await button.hover();await waitPlaying(button);const s=await state(button);assert.equal(s.width,1200);assert.equal(s.height,750);
  await page.waitForTimeout(1000);assert((await state(button)).time>s.time);
  await button.screenshot({path:`${out}/${i}-playing.png`,animations:'disabled'});
  await page.mouse.move(0,0);await waitStopped(button);
  // Rapid exits must not let a pending play promise expose stale footage.
  for(let n=0;n<3;n++){await button.hover();await page.mouse.move(0,0);}
  await page.waitForTimeout(500);await waitStopped(button);
  await button.focus();assert.equal((await state(button)).paused,true);
  await button.press('Enter');await waitPlaying(button);await button.press('Escape');await waitStopped(button);
  await button.press('Space');await waitPlaying(button);await button.press('Tab');await waitStopped(button);
  console.log(name,': poster, hover, exit/reset, rapid re-entry, keyboard passed');
 }
 assert.deepEqual(errors,[]);await page.close();
 const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 await touch.goto(url);const preview=touch.locator('#projects .project-video-preview').first();await preview.scrollIntoViewIfNeeded();
 assert.equal((await state(preview)).paused,true);await preview.tap();await waitPlaying(preview);await preview.tap();await waitStopped(preview);
 await preview.tap();await waitPlaying(preview);await touch.locator('#top').scrollIntoViewIfNeeded();await waitStopped(preview);
 console.log('Touch: tap play/stop and offscreen pause passed');await touch.close();
 // Slow first load: the poster remains visible, even if the pointer leaves before data arrives.
 const slow=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 let release;const gate=new Promise(r=>release=r);
 await slow.route('**/foodnotes-project-preview-202609.mp4',async route=>{await gate;await route.continue()});
 await slow.goto(url);await slow.mouse.move(0,0);const slowPreview=slow.locator('#projects .project-video-preview').first();await slowPreview.scrollIntoViewIfNeeded();await slowPreview.hover();await slow.waitForTimeout(250);
 assert.equal((await state(slowPreview)).posterVisible,true);await slow.mouse.move(0,0);release();await slow.waitForTimeout(1200);await waitStopped(slowPreview);
 console.log('Delayed media: poster stays visible and cancelled hover stays stopped');await slow.close();
}finally{await browser.close()}

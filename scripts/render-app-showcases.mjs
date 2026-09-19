/** Render FoodNotes and Traffic recordings. Run capture-app-showcases.mjs first. */
import {readFile,mkdir} from 'node:fs/promises';
import {spawnSync,spawn} from 'node:child_process';
import path from 'node:path';
import {createRequire} from 'node:module';
const root=process.env.MEDIA_TOOLS_SOURCE;
if(!root)throw new Error('Set MEDIA_TOOLS_SOURCE to the local FLEX-app checkout.');
const require=createRequire(path.join(root,'package.json'));
const sharp=require('sharp');
const ffmpeg=require('ffmpeg-static');
const work=process.env.APP_CAPTURE_DIR||'/private/tmp/app-showcases';
const output=path.resolve('static/assets');
await mkdir(output,{recursive:true});
const run=args=>new Promise((resolve,reject)=>{
 const child=spawn(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{stdio:['ignore','ignore','pipe']});
 let error='';child.stderr.on('data',d=>error+=d);child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(error)));
});
const apps={
 foodnotes:{brand:'FoodNotes',bg:'#edf0e7',fg:'#263c30',muted:'#5d7161',chip:'#d6e2d0',accent:'#678467',track:'#cbd4c7',titles:[
  ['Your food journal','A little','daily picture.','Meals, photos, and notes.','All together in your journal.'],
  ['Meal details','See what','went into it.','Explore your meal’s','estimated nutrition.'],
  ['Your history','Find a day.','Revisit a meal.','A calendar that brings','your food journal together.'],
  ['Nutrition insights','Notice your','daily patterns.','Explore nutrient trends','over the days you log.']
 ]},
 traffic:{brand:'San Diego Watch',bg:'#17202c',fg:'#e9eff8',muted:'#b3c1d4',chip:'#293a51',accent:'#92baff',track:'#35445a',titles:[
  ['Incident feed','Around town.','At a glance.','Traffic and public safety,','in one place.'],
  ['Source filters','Focus on','what matters.','Switch sources to find','the updates you need.'],
  ['Incident map','Put it all','on the map.','See where incidents','are happening.'],
  ['Activity stats','See the','bigger picture.','Explore incident counts','and activity over time.']
 ]}
};
for(const app of process.env.RENDER_APP?[process.env.RENDER_APP]:Object.keys(apps)){
const theme=apps[app];
const titles=theme.titles;
const selectedFormats = process.env.APP_RENDER_FORMAT ? [process.env.APP_RENDER_FORMAT] : ['desktop', 'mobile'];
if (selectedFormats.some(name => !['desktop', 'mobile'].includes(name))) throw new Error('APP_RENDER_FORMAT must be desktop or mobile.');
for(const name of selectedFormats){
 const meta=JSON.parse(await readFile(path.join(work,`${app}-${name}.json`),'utf8'));
 if(meta.chapters.length!==4)throw new Error(`${name}: incomplete capture`);
 // Account for recorder startup lag. Extra duration is recorder tail padding,
 // not an offset to add to every chapter (which would include the next page).
 const info=spawnSync(ffmpeg,['-hide_banner','-i',meta.raw],{encoding:'utf8'}).stderr;
 const time=info.match(/Duration: (\d+):(\d+):([\d.]+)/);
 if(!time)throw new Error('Cannot read raw recording duration');
 const duration=+time[1]*3600 + +time[2]*60 + +time[3];
 const offset=Math.min(0,duration-meta.elapsed);
 for(let i=0;i<4;i++){
  const chapter=meta.chapters[i];
  const start=Math.max(0,chapter.start+offset+0.15);
  const length=Math.min(chapter.end-chapter.start-1,6);
  const clip=path.join(work,`${app}-${name}-${i}.mp4`);
  const inputs=['-ss',String(start),'-t',String(length),'-i',meta.raw];
  let filter=`[0:v]fps=30,setsar=1,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=6,trim=duration=6[v]`;
  if(name==='desktop'){
   const [eyebrow,line1,line2,sub1,sub2]=titles[i];
   // Flat tonal surfaces, quiet typography, and conversational copy.
   const chipWidth = [240, 220, 218, 248][i];
   const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900">
    <rect width="1440" height="900" fill="${theme.bg}"/>
    <rect x="64" y="65" width="48" height="48" rx="16" fill="${theme.accent}"/>
    <g stroke="${theme.bg}" stroke-width="4" stroke-linecap="round">
     ${app==='foodnotes'?'<path d="M88 99V80 M88 89C75 89 76 78 76 78C89 78 88 89 88 89 M88 94C102 94 102 81 102 81C89 81 88 94 88 94"/>':'<path d="M77 96h23 M81 96V85a8 8 0 0 1 16 0v11 M89 72v-3 M75 78l-3 -3 M103 78l3 -3"/>'}
    </g>
    <g font-family="Helvetica, Arial, sans-serif">
     <text x="128" y="102" fill="${theme.fg}" font-weight="500" font-size="38">${theme.brand}</text>
     <rect x="64" y="212" width="${chipWidth}" height="48" rx="24" fill="${theme.chip}"/>
     <text x="84" y="244" fill="${theme.fg}" font-size="24">${eyebrow}</text>
     <text x="60" y="358" fill="${theme.fg}" font-size="66" font-weight="400" letter-spacing="-2">${line1}</text>
     <text x="60" y="440" fill="${theme.fg}" font-size="66" font-weight="400" letter-spacing="-2">${line2}</text>
     <text x="64" y="525" fill="${theme.muted}" font-size="28">${sub1}</text>
     <text x="64" y="566" fill="${theme.muted}" font-size="28">${sub2}</text>
     <text x="64" y="775" fill="${theme.muted}" font-size="22">${i+1} of 4<tspan dx="20" fill="${theme.muted}">A quick look around</tspan></text>
     <text x="64" y="839" fill="${theme.muted}" font-size="22">Demo data · September 2026</text>
    </g>
    ${[0,1,2,3].map(n=>`<rect x="${64+n*118}" y="716" width="100" height="6" rx="3" fill="${n===i?theme.accent:theme.track}"/>`).join('')}
   </svg>`;
   const bg=path.join(work,`${app}-chapter-${i}.png`);
   await sharp(Buffer.from(svg)).png().toFile(bg);
   inputs.push('-loop','1','-i',bg);
   filter+=';[1:v]fps=30,setsar=1,trim=duration=6,setpts=PTS-STARTPTS[bg];[bg][v]overlay=640:0:shortest=1[out]';
  }else filter+=';[v]null[out]';
  await run([...inputs,'-filter_complex',filter,'-map','[out]','-an','-t','6','-c:v','libx264','-crf','17','-preset','fast','-pix_fmt','yuv420p',clip]);
 }
 // Four six-second chapters, with restrained 0.4s dissolves. Return to the
 // first frame at the end to avoid a hard jump when the portfolio loops.
 const inputs=[];
 for(let i=0;i<4;i++)inputs.push('-i',path.join(work,`${app}-${name}-${i}.mp4`));
 const startFrame=path.join(work,`${app}-${name}-start.png`);
 await run(['-i',path.join(work,`${app}-${name}-0.mp4`),'-frames:v','1',startFrame]);
 inputs.push('-loop','1','-framerate','30','-i',startFrame);
 const graph='[0:v]settb=AVTB[a];[1:v]settb=AVTB[b];[2:v]settb=AVTB[c];[3:v]settb=AVTB[d];[4:v]settb=AVTB,trim=duration=1[e];[a][b]xfade=transition=fade:duration=0.4:offset=5.6[ab];[ab][c]xfade=transition=fade:duration=0.4:offset=11.2[abc];[abc][d]xfade=transition=fade:duration=0.4:offset=16.8[abcd];[abcd][e]xfade=transition=fade:duration=0.4:offset=22.4[out]';
 const base=path.join(output,`${app}-showcase-${name}-202609`);
 await run([...inputs,'-filter_complex_threads','1','-filter_complex',graph,'-map','[out]','-an','-t','23.2','-c:v','libx264','-crf','21','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',`${base}.mp4`]);
 await run(['-i',`${base}.mp4`,'-an','-c:v','libvpx-vp9','-crf','33','-b:v','0','-deadline','good','-cpu-used','4','-row-mt','1',`${base}.webm`]);
 await sharp(startFrame).jpeg({quality:88}).toFile(`${base}.jpg`);
 console.log(`Rendered ${base}.{mp4,webm,jpg}`);
}
}

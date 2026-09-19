/** Compose captured FLEX chapters into looping portfolio videos and poster images.
 * FLEX_SOURCE=/path/to/FLEX-app node scripts/render-flex-showcase.mjs
 * Run capture-flex-showcase.mjs first. Uses FLEX's existing ffmpeg-static and sharp.
 */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync,spawn} from 'node:child_process';
import path from 'node:path';
import {createRequire} from 'node:module';
const root=process.env.FLEX_SOURCE;
if(!root)throw new Error('Set FLEX_SOURCE to the local FLEX-app checkout.');
const require=createRequire(path.join(root,'package.json'));
const sharp=require('sharp');
const ffmpeg=require('ffmpeg-static');
const work=process.env.FLEX_CAPTURE_DIR||'/private/tmp/flex-showcase';
const output=path.resolve('static/assets');
await mkdir(output,{recursive:true});
const run=args=>new Promise((resolve,reject)=>{
 const child=spawn(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{stdio:['ignore','ignore','pipe']});
 let error='';child.stderr.on('data',d=>error+=d);child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(new Error(error)));
});
const titles = [
 ['Your routines', 'Make it', 'your workout.', 'Pick a routine, then tweak it', 'to fit your day.'],
 ['During a workout', 'One set', 'at a time.', 'Add your weight and reps.', 'FLEX takes it from there.'],
 ['Exercise library', 'Trying', 'something new?', 'Find a move and see', 'how it’s done.'],
 ['Your progress', 'Look at', 'you go.', 'Your workouts are all here.', 'See what you’ve been up to.']
];
const selectedFormats = process.env.FLEX_RENDER_FORMAT ? [process.env.FLEX_RENDER_FORMAT] : ['desktop', 'mobile'];
if (selectedFormats.some(name => !['desktop', 'mobile'].includes(name))) throw new Error('FLEX_RENDER_FORMAT must be desktop or mobile.');
for(const name of selectedFormats){
 const meta=JSON.parse(await readFile(path.join(work,`${name}.json`),'utf8'));
 if(meta.chapters.length!==4)throw new Error(`${name}: incomplete capture`);
 // Align wall-clock chapter timestamps to the recorder's first frame.
 const info=spawnSync(ffmpeg,['-hide_banner','-i',meta.raw],{encoding:'utf8'}).stderr;
 const time=info.match(/Duration: (\d+):(\d+):([\d.]+)/);
 if(!time)throw new Error('Cannot read raw recording duration');
 const duration=+time[1]*3600 + +time[2]*60 + +time[3];
 const offset=duration-meta.elapsed;
 for(let i=0;i<4;i++){
  const chapter=meta.chapters[i];
  const start=Math.max(0,chapter.start+offset+0.15);
  const length=Math.min(chapter.end-chapter.start-0.25,6);
  const clip=path.join(work,`${name}-${i}.mp4`);
  const inputs=['-ss',String(start),'-t',String(length),'-i',meta.raw];
  let filter=`[0:v]fps=30,setsar=1,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=6,trim=duration=6[v]`;
  if(name==='desktop'){
   const [eyebrow,line1,line2,sub1,sub2]=titles[i];
   // Flat tonal surfaces, quiet typography, and conversational copy.
   const chipWidth = [188, 238, 220, 196][i];
   const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900">
    <rect width="1440" height="900" fill="#16181c"/>
    <rect x="64" y="65" width="48" height="48" rx="16" fill="#abc7ff"/>
    <g stroke="#18305a" stroke-width="4" stroke-linecap="round">
     <path d="M78 80v18 M98 80v18 M78 89h20 M72 85v8 M104 85v8"/>
    </g>
    <g font-family="Helvetica, Arial, sans-serif">
     <text x="128" y="102" fill="#e4e6eb" font-weight="500" font-size="38">FLEX</text>
     <rect x="64" y="212" width="${chipWidth}" height="48" rx="24" fill="#293344"/>
     <text x="84" y="244" fill="#c4d7fa" font-size="24">${eyebrow}</text>
     <text x="60" y="358" fill="#e4e6eb" font-size="70" font-weight="400" letter-spacing="-2">${line1}</text>
     <text x="60" y="440" fill="#e4e6eb" font-size="70" font-weight="400" letter-spacing="-2">${line2}</text>
     <text x="64" y="525" fill="#b9bdc7" font-size="28">${sub1}</text>
     <text x="64" y="566" fill="#b9bdc7" font-size="28">${sub2}</text>
     <text x="64" y="775" fill="#b9bdc7" font-size="22">${i+1} of 4<tspan dx="20" fill="#9299a6">A quick look around</tspan></text>
     <text x="64" y="839" fill="#9299a6" font-size="22">Made by Duffy</text>
    </g>
    ${[0,1,2,3].map(n=>`<rect x="${64+n*118}" y="716" width="100" height="6" rx="3" fill="${n===i?'#abc7ff':'#34383f'}"/>`).join('')}
   </svg>`;
   const bg=path.join(work,`chapter-${i}.png`);
   await sharp(Buffer.from(svg)).png().toFile(bg);
   inputs.push('-loop','1','-i',bg);
   filter+=';[1:v]fps=30,setsar=1,trim=duration=6,setpts=PTS-STARTPTS[bg];[bg][v]overlay=640:0:shortest=1[out]';
  }else filter+=';[v]null[out]';
  await run([...inputs,'-filter_complex',filter,'-map','[out]','-an','-t','6','-c:v','libx264','-crf','17','-preset','fast','-pix_fmt','yuv420p',clip]);
 }
 // Four six-second chapters, with restrained 0.4s dissolves. Return to the
 // first frame at the end to avoid a hard jump when the portfolio loops.
 const inputs=[];
 for(let i=0;i<4;i++)inputs.push('-i',path.join(work,`${name}-${i}.mp4`));
 const startFrame=path.join(work,`${name}-start.png`);
 await run(['-i',path.join(work,`${name}-0.mp4`),'-frames:v','1',startFrame]);
 inputs.push('-loop','1','-framerate','30','-i',startFrame);
 const graph='[0:v]settb=AVTB[a];[1:v]settb=AVTB[b];[2:v]settb=AVTB[c];[3:v]settb=AVTB[d];[4:v]settb=AVTB,trim=duration=1[e];[a][b]xfade=transition=fade:duration=0.4:offset=5.6[ab];[ab][c]xfade=transition=fade:duration=0.4:offset=11.2[abc];[abc][d]xfade=transition=fade:duration=0.4:offset=16.8[abcd];[abcd][e]xfade=transition=fade:duration=0.4:offset=22.4[out]';
 const base=path.join(output,`flex-showcase-${name}-v292${name === 'desktop' ? '-material' : ''}`);
 await run([...inputs,'-filter_complex_threads','1','-filter_complex',graph,'-map','[out]','-an','-t','23.2','-c:v','libx264','-crf','21','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',`${base}.mp4`]);
 await run(['-i',`${base}.mp4`,'-an','-c:v','libvpx-vp9','-crf','33','-b:v','0','-deadline','good','-cpu-used','3','-row-mt','1',`${base}.webm`]);
 await sharp(startFrame).jpeg({quality:88}).toFile(`${base}.jpg`);
 console.log(`Rendered ${base}.{mp4,webm,jpg}`);
}
await writeFile(path.join(work,'README.txt'),'FLEX 2.9.2 local-app showcase. Four chapters, 23.2 seconds, 30 fps, silent. Demo data only. Desktop 1440x900, mobile 390x846.\n');

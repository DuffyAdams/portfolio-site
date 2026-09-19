/** Render wide, app-only hover videos and matching posters from reviewed local captures. */
import {readFile,mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import path from 'node:path';
const source=process.env.MEDIA_TOOLS_SOURCE;
if(!source)throw new Error('Set MEDIA_TOOLS_SOURCE to the checkout containing ffmpeg-static and sharp.');
const require=createRequire(path.join(source,'package.json')),ffmpeg=require('ffmpeg-static'),sharp=require('sharp');
const work=process.env.PROJECT_CAPTURE_DIR||'/private/tmp/project-previews',output=path.resolve('static/assets');
await mkdir(output,{recursive:true});
const run=args=>new Promise((resolve,reject)=>{const p=spawn(ffmpeg,['-hide_banner','-loglevel','error','-y',...args],{stdio:['ignore','ignore','pipe']});let error='';p.stderr.on('data',d=>error+=d);p.on('error',reject);p.on('exit',c=>c===0?resolve():reject(new Error(error)))});
for(const app of process.env.RENDER_APP?[process.env.RENDER_APP]:['foodnotes','traffic','flex']){
 const meta=JSON.parse(await readFile(path.join(work,`${app}.json`),'utf8'));
 if(meta.chapters.length!==3)throw new Error(`${app}: expected three complete scenes`);
 for(const [i,chapter]of meta.chapters.entries()){
  // 1.2s lead + 3.8s eased scroll + a still hold. Exclude all navigation and setup.
  const length=Math.min(6.2,chapter.end-chapter.start-.4);
  await run(['-ss',String(chapter.start+.15),'-t',String(length),'-i',meta.raw,'-vf','fps=30,setsar=1,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=7,trim=duration=7','-an','-c:v','libx264','-crf','18','-preset','fast','-pix_fmt','yuv420p',path.join(work,`${app}-${i}.mp4`)]);
 }
 const first=path.join(work,`${app}-first.png`);
 await run(['-i',path.join(work,`${app}-0.mp4`),'-frames:v','1',first]);
 const inputs=[];for(let i=0;i<3;i++)inputs.push('-i',path.join(work,`${app}-${i}.mp4`));
 inputs.push('-loop','1','-framerate','30','-i',first);
 const graph='[0:v]settb=AVTB[a];[1:v]settb=AVTB[b];[2:v]settb=AVTB[c];[3:v]settb=AVTB,trim=duration=1[d];[a][b]xfade=transition=fade:duration=0.5:offset=6.5[ab];[ab][c]xfade=transition=fade:duration=0.5:offset=13[abc];[abc][d]xfade=transition=fade:duration=0.5:offset=19.5[out]';
 const base=path.join(output,`${app}-project-preview-202609`);
 await run([...inputs,'-filter_complex_threads','1','-filter_complex',graph,'-map','[out]','-an','-t','20.4','-c:v','libx264','-crf','20','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',`${base}.mp4`]);
 await sharp(first).jpeg({quality:90}).toFile(`${base}.jpg`);
 console.log(`Rendered ${base}.{mp4,jpg}`);
}

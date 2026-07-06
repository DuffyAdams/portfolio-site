<script lang="ts">
  import { ArrowDownRight, ChevronLeft, ChevronRight, FileDown, Github, Linkedin, Mail, Terminal } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { reveal } from '$lib/reveal';

  const baseTilt = { x: 0, y: -10, z: -2 };
  const phonePreviews = [
    {
      title: 'San Diego Traffic Watch',
      src: '/assets/traffic-app-iphone-capture-loop.webm',
      label: 'Mobile preview of the San Diego Traffic Watch app'
    },
    {
      title: 'FLEX',
      src: '/assets/flex-app-iphone-capture-loop.webm',
      label: 'Mobile preview of the FLEX fitness tracking app'
    }
  ] as const;

  let phoneTransform = $state(toPhoneTransform(baseTilt.x, baseTilt.y, baseTilt.z));
  let reduceMotion = $state(false);
  let activePhonePreviewIndex = $state(0);
  let swipeStartX = $state<number | null>(null);

  let activePhonePreview = $derived(phonePreviews[activePhonePreviewIndex]);

  function toPhoneTransform(x: number, y: number, z: number) {
    return `rotateX(${x.toFixed(2)}deg) rotateY(${y.toFixed(2)}deg) rotateZ(${z.toFixed(2)}deg)`;
  }

  function handlePhonePointerMove(event: PointerEvent) {
    if (reduceMotion || event.pointerType === 'touch') return;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    phoneTransform = toPhoneTransform(baseTilt.x - y * 8, baseTilt.y + x * 10, baseTilt.z + x * 1.5);
  }

  function resetPhoneTilt() {
    phoneTransform = toPhoneTransform(baseTilt.x, baseTilt.y, baseTilt.z);
  }

  function showPhonePreview(direction: number) {
    activePhonePreviewIndex = (activePhonePreviewIndex + direction + phonePreviews.length) % phonePreviews.length;
  }

  function handlePhonePointerDown(event: PointerEvent) {
    swipeStartX = event.clientX;
  }

  function handlePhonePointerUp(event: PointerEvent) {
    if (swipeStartX === null) return;

    const distance = event.clientX - swipeStartX;
    swipeStartX = null;

    if (Math.abs(distance) < 42) return;
    showPhonePreview(distance < 0 ? 1 : -1);
  }

  onMount(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotion = media.matches;

    const updateMotionPreference = () => {
      reduceMotion = media.matches;
      if (reduceMotion) resetPhoneTilt();
    };

    media.addEventListener('change', updateMotionPreference);

    return () => media.removeEventListener('change', updateMotionPreference);
  });
</script>

<section id="top" class="section-shell relative overflow-hidden pb-20 pt-24 sm:pt-28 lg:pb-28 lg:pt-32">
  <div class="absolute left-1/2 top-28 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-300/22 blur-3xl hero-orbit dark:bg-sky-500/12"></div>

  <div class="grid items-center gap-10 lg:grid-cols-[1.03fr_0.97fr]">
    <div class="reveal" use:reveal={0}>
      <p class="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-muted-foreground">Software Engineer / Full-Stack Developer</p>
      <h1 class="max-w-4xl text-5xl font-black leading-[0.95] tracking-normal text-foreground sm:text-7xl lg:text-8xl">
        Duffy Adams
      </h1>
      <p class="mt-7 max-w-2xl text-xl leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
        I build real-time web apps, data-driven dashboards, and polished user experiences.
      </p>

      <div class="mt-9 flex flex-col gap-3 sm:flex-row">
        <a class="button-primary group" href="#projects">
          View Projects
          <ArrowDownRight class="transition group-hover:translate-x-0.5 group-hover:translate-y-0.5" size={18} />
        </a>
        <a class="button-secondary" href="/assets/Resume_5_22_26.pdf" download="Duffy-Adams-Resume.pdf">
          <FileDown size={18} />
          Download Resume
        </a>
      </div>

      <div class="mt-7 flex flex-wrap gap-2">
        <!-- Replace profile/contact links here. -->
        <a class="button-secondary !px-4 !py-2.5" href="https://github.com/DuffyAdams" target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a>
        <a class="button-secondary !px-4 !py-2.5" href="https://www.linkedin.com/in/duffyadams/" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a>
        <a class="button-secondary !px-4 !py-2.5" href="mailto:duffyadams55@gmail.com"><Mail size={17} /> Email</a>
        <a class="button-secondary !px-4 !py-2.5" href="/terminal/index.html"><Terminal size={17} /> Terminal Mode</a>
      </div>
    </div>

    <div class="reveal lg:pl-6" use:reveal={140}>
      <div
        role="presentation"
        class="relative mx-auto flex justify-center [perspective:1200px] float-soft"
        onpointerdown={handlePhonePointerDown}
        onpointermove={handlePhonePointerMove}
        onpointerup={handlePhonePointerUp}
        onpointercancel={() => (swipeStartX = null)}
        onpointerleave={resetPhoneTilt}
      >
        <div
          class="surface iphone-shell relative w-full max-w-[17rem] rounded-[3rem] bg-slate-100 p-2 shadow-hover transition-transform duration-200 ease-out [transform-style:preserve-3d] dark:bg-slate-950 sm:max-w-[18.75rem]"
          style={`transform: ${phoneTransform};`}
        >
          <div class="iphone-screen relative overflow-hidden rounded-[2.6rem] border border-slate-300/60 bg-slate-50 p-1.5 dark:border-white/10 dark:bg-black">
            <div class="absolute left-1/2 top-3.5 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black shadow-sm">
              <div class="absolute left-1/2 top-1/2 h-1.5 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800"></div>
              <div class="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-slate-700"></div>
            </div>
            {#key activePhonePreview.src}
              <video
                class="aspect-[9/19.5] w-full rounded-[2.2rem] object-cover object-[50%_8%]"
                src={activePhonePreview.src}
                autoplay
                loop
                muted
                playsinline
                preload="metadata"
                aria-label={activePhonePreview.label}
              ></video>
            {/key}
            <div class="absolute inset-x-4 bottom-10 z-20 flex items-center justify-between">
              <button
                class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/48 text-white shadow-lg backdrop-blur transition hover:bg-black/62 focus-visible:outline-white/80"
                type="button"
                aria-label="Show previous app preview"
                onclick={(event) => {
                  event.stopPropagation();
                  showPhonePreview(-1);
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <div class="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1.5 backdrop-blur">
                {#each phonePreviews as preview, index}
                  <button
                    class={`h-1.5 rounded-full transition ${index === activePhonePreviewIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/48 hover:bg-white/75'}`}
                    type="button"
                    aria-label={`Show ${preview.title} preview`}
                    aria-current={index === activePhonePreviewIndex ? 'true' : undefined}
                    onclick={(event) => {
                      event.stopPropagation();
                      activePhonePreviewIndex = index;
                    }}
                  ></button>
                {/each}
              </div>
              <button
                class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/48 text-white shadow-lg backdrop-blur transition hover:bg-black/62 focus-visible:outline-white/80"
                type="button"
                aria-label="Show next app preview"
                onclick={(event) => {
                  event.stopPropagation();
                  showPhonePreview(1);
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div class="pointer-events-none absolute inset-1.5 rounded-[2.2rem] ring-1 ring-inset ring-white/15"></div>
            <div class="pointer-events-none absolute bottom-5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-white/70"></div>
          </div>
          <div class="absolute -right-1 top-24 h-16 w-1.5 rounded-r-full bg-slate-300 dark:bg-slate-800"></div>
          <div class="absolute -left-1 top-20 h-10 w-1.5 rounded-l-full bg-slate-300 dark:bg-slate-800"></div>
          <div class="absolute -left-1 top-36 h-14 w-1.5 rounded-l-full bg-slate-300 dark:bg-slate-800"></div>
        </div>
      </div>
    </div>
  </div>
</section>

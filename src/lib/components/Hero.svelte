<script lang="ts">
  import { ArrowDownRight, ArrowUp, ChevronLeft, ChevronRight, FileDown, Github, Linkedin, Mail } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { links } from '$lib/content';
  import { reveal } from '$lib/reveal';

  const baseTilt = { x: 0, y: -10, z: -2 };
  const phonePreviews = [
    {
      title: 'FoodNotes',
      src: '/assets/foodnotes-showcase-mobile-202609.mp4',
      poster: '/assets/foodnotes-showcase-mobile-202609.jpg',
      label: 'Mobile preview of the FoodNotes food journal',
      type: 'video'
    },
    {
      title: 'San Diego Traffic Watch',
      src: '/assets/traffic-showcase-mobile-202609.mp4',
      poster: '/assets/traffic-showcase-mobile-202609.jpg',
      label: 'Mobile preview of the San Diego Traffic Watch app',
      type: 'video'
    },
    {
      title: 'FLEX',
      src: '/assets/flex-showcase-mobile-v292.mp4',
      poster: '/assets/flex-showcase-mobile-v292.jpg',
      label: 'Mobile preview of the FLEX fitness tracking app',
      type: 'video'
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

<section id="top" class="section-shell relative overflow-hidden pb-6 pt-28 lg:flex lg:min-h-[100svh] lg:items-center lg:pb-10 lg:pt-28">
  <div class="absolute left-1/2 top-28 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-200/30 blur-3xl hero-orbit dark:bg-orange-700/15"></div>

  <div class="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
    <div class="reveal" use:reveal={0}>
      <h1 class="text-5xl font-black leading-[0.95] tracking-normal text-foreground sm:text-7xl lg:text-8xl xl:text-9xl">
        I&apos;m Duffy.
      </h1>
      <p class="mt-6 max-w-2xl text-lg leading-8 text-foreground/85 sm:text-xl sm:leading-9 lg:mt-8 lg:text-2xl lg:leading-10">
        I build things when little problems bug me enough. Traffic I can&apos;t explain, class files I have to download one by one, workout apps that are almost right. Most of my projects start like that.
      </p>
      <p class="mt-4 max-w-xl text-base leading-7 text-muted-foreground lg:text-lg lg:leading-8">
        I&apos;m a QA engineer at ICSolutions and an SDSU computer science grad, based in Chula Vista, CA.
      </p>

      <div class="mt-8 flex flex-wrap items-center gap-2 lg:mt-10">
        <a class="button-primary group" href="#projects">
          See what I&apos;ve built
          <ArrowDownRight class="transition group-hover:translate-x-0.5 group-hover:translate-y-0.5" size={18} />
        </a>
        <a class="button-secondary" href={links.resume} download={links.resumeFileName}>
          <FileDown size={18} />
          Resume
        </a>
        <a class="button-secondary !h-11 !w-11 !px-0" href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
        <a class="button-secondary !h-11 !w-11 !px-0" href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
        <a class="button-secondary !h-11 !w-11 !px-0" href={links.email} aria-label="Email"><Mail size={18} /></a>
      </div>
    </div>

    <div class="reveal hidden lg:block lg:pl-6" use:reveal={140}>
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
          class="surface iphone-shell relative w-full max-w-[18.5rem] rounded-[3rem] bg-slate-100 p-2 shadow-hover transition-transform duration-200 ease-out [transform-style:preserve-3d] dark:bg-slate-950 xl:max-w-[20rem]"
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
                  poster={activePhonePreview.poster}
                  loop
                  muted
                  playsinline
                  preload="metadata"
                  aria-label={activePhonePreview.label}
                ></video>
            {/key}
            <div class="absolute inset-x-4 bottom-10 z-20 flex items-center justify-between">
              <button
                class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur transition hover:bg-black/75 focus-visible:outline-white/80"
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
                    class={`h-1.5 rounded-full transition ${index === activePhonePreviewIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'}`}
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
                class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur transition hover:bg-black/75 focus-visible:outline-white/80"
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
      <div class="mx-auto mt-6 flex w-fit items-center gap-3 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-4 shadow-soft" aria-live="polite">
        <span class="phone-hint-arrow grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground" aria-hidden="true">
          <ArrowUp size={16} strokeWidth={2.5} />
        </span>
        <p class="text-sm leading-tight">
          <span class="font-bold">{activePhonePreview.title}</span>
          <span class="text-muted-foreground">· {activePhonePreviewIndex + 1} of {phonePreviews.length}, swipe for more</span>
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .phone-hint-arrow {
    animation: phone-hint 1.8s ease-in-out infinite;
  }

  @keyframes phone-hint {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }
</style>

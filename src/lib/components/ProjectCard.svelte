<script lang="ts">
  import { ExternalLink, Github, Volume2, Wifi } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { reveal } from '$lib/reveal';

  type Project = {
    title: string;
    description: string;
    tech: string[];
    highlights: string[];
    demoHref?: string;
    githubHref: string;
    preview?: string;
    previewFit?: 'cover' | 'contain';
    previewDemo?: 'volume-scroller';
    accent: string;
  };

  const techPillStyles: Record<string, string> = {
    Svelte:
      '--pill-border: #ff8f73; --pill-bg: rgba(255, 62, 0, 0.1); --pill-text: #a63d22; --pill-dark-bg: rgba(255, 62, 0, 0.14); --pill-dark-text: #ffd0c5;',
    Flask:
      '--pill-border: #8f98a3; --pill-bg: rgba(148, 163, 184, 0.12); --pill-text: #4a5562; --pill-dark-bg: rgba(148, 163, 184, 0.16); --pill-dark-text: #e4eaf2;',
    Python:
      '--pill-border: #ffd24d; --pill-bg: rgba(255, 210, 77, 0.16); --pill-text: #7a5a00; --pill-dark-bg: rgba(55, 118, 171, 0.22); --pill-dark-text: #ffe08a;',
    SQLite:
      '--pill-border: #6fc3ff; --pill-bg: rgba(111, 195, 255, 0.14); --pill-text: #0b5f95; --pill-dark-bg: rgba(0, 119, 181, 0.18); --pill-dark-text: #b8e3ff;',
    Playwright:
      '--pill-border: #88e17b; --pill-bg: rgba(136, 225, 123, 0.14); --pill-text: #2f6f26; --pill-dark-bg: rgba(45, 212, 191, 0.14); --pill-dark-text: #c7f7d1;',
    'OpenAI API':
      '--pill-border: #8df0cf; --pill-bg: rgba(141, 240, 207, 0.14); --pill-text: #1b7460; --pill-dark-bg: rgba(16, 185, 129, 0.14); --pill-dark-text: #cff9ea;',
    'Tailwind/CSS':
      '--pill-border: #6ee7f9; --pill-bg: rgba(110, 231, 249, 0.16); --pill-text: #0c6f86; --pill-dark-bg: rgba(34, 211, 238, 0.16); --pill-dark-text: #c8f8ff;',
    'Svelte 5':
      '--pill-border: #ff8f73; --pill-bg: rgba(255, 62, 0, 0.1); --pill-text: #a63d22; --pill-dark-bg: rgba(255, 62, 0, 0.14); --pill-dark-text: #ffd0c5;',
    Vite:
      '--pill-border: #c4a1ff; --pill-bg: rgba(196, 161, 255, 0.14); --pill-text: #6a3db3; --pill-dark-bg: rgba(139, 92, 246, 0.18); --pill-dark-text: #ecdeff;',
    'Dexie.js':
      '--pill-border: #f59e8b; --pill-bg: rgba(245, 158, 139, 0.14); --pill-text: #a3472e; --pill-dark-bg: rgba(249, 115, 22, 0.14); --pill-dark-text: #ffe0d2;',
    IndexedDB:
      '--pill-border: #facc15; --pill-bg: rgba(250, 204, 21, 0.16); --pill-text: #856100; --pill-dark-bg: rgba(234, 179, 8, 0.18); --pill-dark-text: #ffefad;',
    'Node.js':
      '--pill-border: #8bd87c; --pill-bg: rgba(139, 216, 124, 0.14); --pill-text: #376c2e; --pill-dark-bg: rgba(34, 197, 94, 0.14); --pill-dark-text: #d4f7c8;',
    Express:
      '--pill-border: #a1a1aa; --pill-bg: rgba(161, 161, 170, 0.12); --pill-text: #56565f; --pill-dark-bg: rgba(113, 113, 122, 0.18); --pill-dark-text: #f0f0f3;',
    SQLite3:
      '--pill-border: #6fc3ff; --pill-bg: rgba(111, 195, 255, 0.14); --pill-text: #0b5f95; --pill-dark-bg: rgba(0, 119, 181, 0.18); --pill-dark-text: #b8e3ff;',
    PWA:
      '--pill-border: #ff7b84; --pill-bg: rgba(255, 123, 132, 0.14); --pill-text: #a33a47; --pill-dark-bg: rgba(244, 63, 94, 0.14); --pill-dark-text: #ffd0d5;',
    ESP32:
      '--pill-border: #fca5a5; --pill-bg: rgba(252, 165, 165, 0.14); --pill-text: #a24343; --pill-dark-bg: rgba(239, 68, 68, 0.14); --pill-dark-text: #ffe0e0;',
    'C++':
      '--pill-border: #8fb5ff; --pill-bg: rgba(143, 181, 255, 0.14); --pill-text: #2e5ab3; --pill-dark-bg: rgba(59, 130, 246, 0.16); --pill-dark-text: #dce8ff;',
    HTTP:
      '--pill-border: #fdba74; --pill-bg: rgba(253, 186, 116, 0.14); --pill-text: #9a5718; --pill-dark-bg: rgba(251, 146, 60, 0.16); --pill-dark-text: #ffe3c7;',
    JavaScript:
      '--pill-border: #f7df5e; --pill-bg: rgba(247, 223, 94, 0.16); --pill-text: #735d00; --pill-dark-bg: rgba(250, 204, 21, 0.16); --pill-dark-text: #fff0a8;',
    'Distributed Systems':
      '--pill-border: #c7b3ff; --pill-bg: rgba(199, 179, 255, 0.14); --pill-text: #6942b0; --pill-dark-bg: rgba(168, 85, 247, 0.14); --pill-dark-text: #ede2ff;',
    'Tauri 2':
      '--pill-border: #ffc131; --pill-bg: rgba(255, 193, 49, 0.14); --pill-text: #8a5f00; --pill-dark-bg: rgba(36, 182, 255, 0.16); --pill-dark-text: #d6f1ff;',
    Rust:
      '--pill-border: #f59e7b; --pill-bg: rgba(245, 158, 123, 0.14); --pill-text: #974524; --pill-dark-bg: rgba(249, 115, 22, 0.14); --pill-dark-text: #ffd8c6;',
    React:
      '--pill-border: #61dafb; --pill-bg: rgba(97, 218, 251, 0.14); --pill-text: #08728b; --pill-dark-bg: rgba(97, 218, 251, 0.16); --pill-dark-text: #c7f5ff;',
    TypeScript:
      '--pill-border: #79a8ff; --pill-bg: rgba(121, 168, 255, 0.14); --pill-text: #285da8; --pill-dark-bg: rgba(59, 130, 246, 0.18); --pill-dark-text: #d9e8ff;',
    'Windows APIs':
      '--pill-border: #7dd3fc; --pill-bg: rgba(125, 211, 252, 0.14); --pill-text: #0d6c92; --pill-dark-bg: rgba(14, 165, 233, 0.16); --pill-dark-text: #d1f1ff;'
  };

  function getTechPillStyle(tech: string) {
    return (
      techPillStyles[tech] ??
      '--pill-border: rgba(148, 163, 184, 0.45); --pill-bg: rgba(148, 163, 184, 0.12); --pill-text: #4b5563; --pill-dark-bg: rgba(148, 163, 184, 0.16); --pill-dark-text: #e2e8f0;'
    );
  }

  let { project, delay = 0 }: { project: Project; delay?: number } = $props();
  let isVideo = $derived(project.preview?.endsWith('.webm') ?? false);
  let videoElement = $state<HTMLVideoElement>();
  let shouldLoadVideo = $state(false);
  const volumeBars = Array.from({ length: 13 }, (_, index) => index);
  let demoVolume = $state(100);
  let demoPulse = $state(0);
  let demoOverlayVisible = $state(true);
  let demoTaskbarTime = $state('');
  let demoHideTimeout: ReturnType<typeof setTimeout> | undefined;
  let demoActiveBars = $derived(Math.ceil((demoVolume / 100) * volumeBars.length));

  function formatTaskbarTime(date = new Date()) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  }

  function showDemoOverlay() {
    demoOverlayVisible = true;

    if (demoHideTimeout) {
      clearTimeout(demoHideTimeout);
    }

    demoHideTimeout = setTimeout(() => {
      demoOverlayVisible = false;
    }, 1700);
  }

  function setDemoVolume(nextVolume: number) {
    demoVolume = Math.max(0, Math.min(100, nextVolume));
    demoPulse += 1;
    showDemoOverlay();
  }

  function handleVolumeWheel(event: WheelEvent) {
    event.preventDefault();
    setDemoVolume(demoVolume + (event.deltaY < 0 ? 5 : -5));
  }

  function handleVolumeKeydown(event: KeyboardEvent) {
    if (!['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(event.key)) return;

    event.preventDefault();
    setDemoVolume(demoVolume + (event.key === 'ArrowUp' || event.key === 'ArrowRight' ? 5 : -5));
  }

  onMount(() => {
    if (!isVideo || !videoElement) return;

    if (!('IntersectionObserver' in window)) {
      shouldLoadVideo = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        shouldLoadVideo = true;
        observer.disconnect();
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(videoElement);

    return () => observer.disconnect();
  });

  onMount(() => {
    if (project.previewDemo !== 'volume-scroller') return;

    demoTaskbarTime = formatTaskbarTime();
    const timeInterval = setInterval(() => {
      demoTaskbarTime = formatTaskbarTime();
    }, 15_000);

    showDemoOverlay();

    return () => {
      clearInterval(timeInterval);

      if (demoHideTimeout) {
        clearTimeout(demoHideTimeout);
      }
    };
  });
</script>

<article class="reveal group flex h-full flex-col overflow-hidden rounded-apple border border-border bg-card p-3 shadow-soft transition duration-300 hover:-translate-y-2 hover:shadow-hover" use:reveal={delay}>
  <div class="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-muted">
    {#if project.previewDemo === 'volume-scroller'}
      <div class="volume-demo absolute inset-0 bg-[#121212] text-white">
        <div class="volume-wallpaper absolute inset-[-8%]"></div>

        <div
          class="volume-target absolute inset-x-2.5 bottom-2 h-[18%] rounded-[1rem] border border-white/10 bg-[#111827]/72 shadow-2xl outline-none backdrop-blur-xl transition duration-200 focus-visible:ring-2 focus-visible:ring-sky-300"
          role="slider"
          tabindex="0"
          aria-label="Volume Scroller taskbar demo"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={demoVolume}
          onwheel={handleVolumeWheel}
          onkeydown={handleVolumeKeydown}
        >
          <div class="flex h-full items-center justify-between px-3">
            <div class="flex min-w-0 items-center gap-2">
              <span class="taskbar-icon taskbar-start grid place-items-center" aria-hidden="true">
                <span class="windows-mark">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </span>

              <span class="taskbar-icon task-view-icon" aria-hidden="true">
                <span></span>
                <span></span>
              </span>

              <span class="taskbar-icon explorer-icon" aria-hidden="true"></span>
            </div>

            <div class="flex items-center gap-2 text-white/78">
              <Wifi size={15} />
              <Volume2 size={16} />
              <span class="min-w-14 text-right text-[0.68rem] font-semibold tabular-nums tracking-normal text-white/88">{demoTaskbarTime}</span>
            </div>
          </div>
        </div>

        <div
          class:visible={demoOverlayVisible}
          class="volume-overlay absolute left-1/2 flex items-center bg-[#0b1024]/78 shadow-[0_16px_42px_rgba(0,0,0,0.34)] backdrop-blur-md"
          style={`--volume-level: ${demoVolume}%;`}
          data-pulse={demoPulse}
        >
          <span class="volume-icon grid shrink-0 place-items-center text-white">
            <Volume2 size={42} strokeWidth={1.8} />
          </span>

          <div class="flex min-w-0 flex-1 items-center gap-2">
            {#each volumeBars as barIndex}
              <span class:active={barIndex < demoActiveBars} class="volume-bar rounded-full"></span>
            {/each}
          </div>

          <span class="volume-percent text-right font-black tabular-nums leading-none tracking-normal text-white">{demoVolume}%</span>
        </div>
      </div>
    {:else if project.preview}
      {#if isVideo}
        <video
          bind:this={videoElement}
          src={shouldLoadVideo ? project.preview : undefined}
          class="h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-[1.03]"
          autoplay={shouldLoadVideo}
          loop
          muted
          playsinline
          preload="none"
          aria-label={`${project.title} preview video`}
        ></video>
      {:else}
        <img
          src={project.preview}
          alt=""
          class={`h-full w-full ${project.previewFit === 'contain' ? 'object-contain p-5' : 'object-cover'} opacity-95 transition duration-500 group-hover:scale-[1.03]`}
        />
      {/if}
    {:else}
      <div class="absolute inset-0" style={`background: ${project.accent}`}></div>
      <div class="absolute inset-5 rounded-[1.5rem] border border-white/24 bg-white/16 dark:bg-black/16"></div>
      <div class="absolute bottom-5 left-5 right-5 rounded-[1.5rem] bg-[#fff7ed]/88 p-4 shadow-lg dark:bg-slate-950/82">
        <div class="mb-3 h-2 w-24 rounded-full bg-orange-200 dark:bg-slate-700"></div>
        <div class="grid grid-cols-4 gap-2">
          <span class="h-12 rounded-2xl bg-orange-50 dark:bg-slate-800"></span>
          <span class="h-12 rounded-2xl bg-orange-50 dark:bg-slate-800"></span>
          <span class="h-12 rounded-2xl bg-orange-50 dark:bg-slate-800"></span>
          <span class="h-12 rounded-2xl bg-orange-50 dark:bg-slate-800"></span>
        </div>
      </div>
    {/if}
    <div class="absolute right-4 top-4 rounded-full bg-[#fff7ed]/92 px-3 py-1 text-xs font-bold text-orange-950 shadow-sm dark:bg-slate-950/86 dark:text-white">
      Preview
    </div>
  </div>

  <div class="flex flex-1 flex-col p-5">
    <h3 class="text-2xl font-black tracking-normal">{project.title}</h3>
    <p class="mt-3 text-sm leading-6 text-muted-foreground">{project.description}</p>

    <div class="mt-5 flex flex-wrap gap-2">
      {#each project.tech as tech}
        <span class="tech-pill rounded-full px-3 py-1 text-xs font-semibold" style={getTechPillStyle(tech)}>
          {tech}
        </span>
      {/each}
    </div>

    <ul class="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
      {#each project.highlights as highlight}
        <li class="flex gap-3">
          <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
          <span>{highlight}</span>
        </li>
      {/each}
    </ul>

    <div class="mt-auto flex flex-wrap gap-2 pt-7">
      {#if project.demoHref}
        <a class="button-primary !px-4 !py-2.5" href={project.demoHref} target="_blank" rel="noreferrer"><ExternalLink size={16} /> Live Demo</a>
      {/if}
      <a class="button-secondary !px-4 !py-2.5" href={project.githubHref} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
    </div>
  </div>
</article>

<style>
  .tech-pill {
    border: 2px solid var(--pill-border);
    background: var(--pill-bg);
    color: var(--pill-text);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  :global(.dark) .tech-pill {
    border-color: var(--pill-dark-border, var(--pill-border));
    background: var(--pill-dark-bg, var(--pill-bg));
    color: var(--pill-dark-text, var(--pill-text));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .volume-demo {
    background:
      radial-gradient(circle at 74% 22%, rgba(56, 189, 248, 0.22), transparent 30%),
      linear-gradient(145deg, #0f172a 0%, #111827 46%, #18181b 100%);
  }

  .volume-demo::before {
    content: '';
    position: absolute;
    inset: 0 0 24%;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: linear-gradient(to bottom, black, transparent 74%);
    z-index: 1;
  }

  .volume-wallpaper {
    background:
      radial-gradient(ellipse at 52% 46%, rgba(92, 195, 255, 0.95) 0 7%, transparent 18%),
      radial-gradient(ellipse at 58% 30%, rgba(22, 93, 255, 0.95) 0 24%, transparent 47%),
      radial-gradient(ellipse at 37% 52%, rgba(38, 175, 255, 0.8) 0 18%, transparent 43%),
      radial-gradient(ellipse at 66% 67%, rgba(5, 43, 165, 0.92) 0 21%, transparent 48%),
      conic-gradient(from 218deg at 52% 46%, transparent 0 10deg, rgba(91, 196, 255, 0.8) 12deg 24deg, rgba(24, 75, 255, 0.88) 32deg 80deg, transparent 96deg 360deg),
      conic-gradient(from 31deg at 53% 48%, transparent 0 30deg, rgba(55, 148, 255, 0.7) 42deg 82deg, rgba(5, 28, 127, 0.88) 94deg 128deg, transparent 150deg 360deg),
      linear-gradient(145deg, #06101e 0%, #07172a 55%, #020712 100%);
    filter: blur(8px) saturate(1.25);
    opacity: 0.76;
    transform: scale(1.1) rotate(-7deg);
    z-index: 0;
  }

  .volume-wallpaper::before,
  .volume-wallpaper::after {
    content: '';
    position: absolute;
    inset: 8% 13% 2% 14%;
    border-radius: 48% 52% 45% 55% / 46% 42% 58% 54%;
    border: 0.42rem solid rgba(73, 169, 255, 0.46);
    border-left-color: rgba(91, 209, 255, 0.68);
    border-bottom-color: rgba(25, 78, 244, 0.42);
    box-shadow:
      0 0 28px rgba(59, 130, 246, 0.34),
      inset 0 0 30px rgba(25, 74, 255, 0.34);
    transform: rotate(22deg);
  }

  .volume-wallpaper::after {
    inset: 23% 22% 9% 24%;
    border-width: 0.32rem;
    opacity: 0.78;
    transform: rotate(-18deg);
  }

  .volume-target {
    cursor: ns-resize;
    z-index: 2;
  }

  .taskbar-icon {
    position: relative;
    z-index: 1;
    width: clamp(1.3rem, 3.9vw, 1.72rem);
    height: clamp(1.3rem, 3.9vw, 1.72rem);
    flex: 0 0 auto;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      0 8px 18px rgba(0, 0, 0, 0.16);
  }

  .taskbar-start {
    background: transparent;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
  }

  .windows-mark {
    display: grid;
    width: 1.42rem;
    height: 1.42rem;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.08rem;
  }

  .windows-mark span {
    background: linear-gradient(135deg, #6ee7ff, #1aa7ee);
    box-shadow: 0 0 7px rgba(56, 189, 248, 0.28);
  }

  .task-view-icon {
    border-radius: 0.45rem;
    background: transparent;
    box-shadow: none;
  }

  .task-view-icon span {
    position: absolute;
    width: 1.08rem;
    height: 1.08rem;
    border-radius: 0.18rem;
    background: linear-gradient(145deg, #f8fafc, #dbe4ee);
    box-shadow:
      0 0 0 1px rgba(15, 23, 42, 0.08),
      0 0.55rem 1rem rgba(0, 0, 0, 0.22);
  }

  .task-view-icon span:first-child {
    left: 0.1rem;
    bottom: 0.09rem;
    background: linear-gradient(145deg, #6b7280, #2f3540);
    opacity: 0.86;
  }

  .task-view-icon span:last-child {
    right: 0.03rem;
    top: 0.03rem;
  }

  .explorer-icon {
    border-radius: 0.18rem 0.18rem 0.32rem 0.32rem;
    background:
      linear-gradient(#e9a90e 0 28%, transparent 29%),
      linear-gradient(180deg, #ffd44f 0%, #f8b82e 58%, #e6a11f 100%);
  }

  .explorer-icon::before {
    content: '';
    position: absolute;
    left: 0.14rem;
    top: 0.04rem;
    width: 0.72rem;
    height: 0.32rem;
    border-radius: 0.18rem 0.18rem 0 0;
    background: #f4bd27;
  }

  .explorer-icon::after {
    content: '';
    position: absolute;
    left: 0.36rem;
    right: 0.28rem;
    bottom: 0.17rem;
    height: 0.28rem;
    border-radius: 0.12rem;
    background: linear-gradient(180deg, #38bdf8, #0369a1);
  }

  .volume-overlay {
    bottom: calc(18% + 1.15rem);
    width: min(64%, 15.5rem);
    height: clamp(2.15rem, 9.5vw, 3.7rem);
    gap: clamp(0.3rem, 1.15vw, 0.5rem);
    padding-inline: clamp(0.55rem, 2vw, 1rem);
    border-radius: 999px;
    opacity: 0;
    pointer-events: none;
    transform: translateX(-50%) translateY(0.9rem) scale(0.66);
    transition:
      opacity 180ms ease,
      transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 3;
  }

  .volume-overlay.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(0.7);
  }

  .volume-overlay::before {
    content: '';
    position: absolute;
    inset: 1px;
    pointer-events: none;
    border-radius: inherit;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent 58%);
  }

  .volume-icon {
    width: clamp(1.35rem, 4.7vw, 1.85rem);
    height: clamp(1.35rem, 4.7vw, 1.85rem);
  }

  .volume-icon :global(svg) {
    width: clamp(1.25rem, 4.35vw, 1.75rem);
    height: clamp(1.25rem, 4.35vw, 1.75rem);
  }

  .volume-icon,
  .volume-bar,
  .volume-percent {
    position: relative;
    z-index: 1;
  }

  .volume-bar {
    width: clamp(0.24rem, 1.25vw, 0.47rem);
    height: clamp(1.1rem, 5.25vw, 2rem);
    background: rgba(255, 255, 255, 0.28);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
    transition:
      background-color 120ms ease,
      box-shadow 120ms ease,
      transform 160ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .volume-bar.active {
    background: rgba(255, 255, 255, 0.96);
    box-shadow:
      0 0 8px rgba(255, 255, 255, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.35);
    transform: scaleY(1.03);
  }

  .volume-percent {
    min-width: clamp(1.75rem, 6.2vw, 2.75rem);
    font-size: clamp(0.75rem, 2.9vw, 1.05rem);
  }

  .volume-overlay[data-pulse] .volume-icon {
    animation: volume-pop 180ms ease-out;
  }

  @keyframes volume-pop {
    50% {
      transform: scale(1.08);
    }
  }
</style>

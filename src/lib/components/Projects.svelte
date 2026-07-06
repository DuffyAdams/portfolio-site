<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';
  import { reveal } from '$lib/reveal';

  const projects = [
    {
      title: 'San Diego Traffic Watch',
      description:
        'A real-time traffic and emergency incident dashboard that aggregates live public safety data across San Diego into one searchable web platform.',
      highlights: [
        'Python/Flask backend with background scraping workers',
        'SQLite data layer with pagination and analytics endpoints',
        'Geocoding and automatic map image generation',
        'LLM-based incident summaries',
        'Svelte frontend with search, filters, live stats, likes, comments, and responsive UI',
        'Built for real-time updates and efficient reads/writes'
      ],
      tech: ['Svelte', 'Flask', 'Python', 'SQLite', 'Playwright', 'OpenAI API', 'Tailwind/CSS'],
      demoHref: 'https://traffic-app.duffyadams.com/',
      githubHref: 'https://github.com/DuffyAdams',
      preview: '/assets/traffic-app-web-capture-loop.webm',
      accent: 'linear-gradient(135deg, #bae6fd, #38bdf8 48%, #0f172a)'
    },
    {
      title: 'FLEX',
      description:
        'A professional offline-first fitness tracker for building routines, logging workouts in real time, and syncing progress through a personal server.',
      highlights: [
        'IndexedDB local database with Dexie for fast offline access',
        'Real-time workout logging with timer and set completion logic',
        'Searchable exercise library with custom user additions',
        'Node, Express, and SQLite sync server for private backups'
      ],
      tech: ['Svelte', 'Vite', 'Dexie.js', 'IndexedDB', 'Node.js', 'Express', 'SQLite3', 'PWA'],
      demoHref: 'https://flex.duffyadams.com/',
      githubHref: 'https://github.com/DuffyAdams',
      preview: '/assets/flex-app-web-capture-loop.webm',
      accent: 'linear-gradient(135deg, #dcfce7, #22c55e 50%, #111827)'
    },
    {
      title: 'Volume Scroller',
      description:
        'A lightweight Windows desktop utility that lets you control system volume by scrolling over the taskbar, with a native Tauri backend and configurable React overlay.',
      highlights: [
        'Taskbar mouse-wheel hooks for immediate system volume control',
        'Rust backend for Windows audio endpoint control, tray actions, and startup preferences',
        'React settings UI for scroll speed, direction, overlay scale, position, and themes',
        'Always-on-top overlay with smooth animation and fullscreen-app pause mode'
      ],
      tech: ['Tauri 2', 'Rust', 'React', 'TypeScript', 'Vite', 'Windows APIs'],
      demoHref: 'https://scrolly.duffyadams.com/',
      githubHref: 'https://github.com/DuffyAdams/VolumeScroller',
      previewDemo: 'volume-scroller' as const,
      accent: 'linear-gradient(135deg, #dbeafe, #60a5fa 48%, #111827)'
    },
    {
      title: 'Pourtocol Smart Fountain',
      description:
        'A distributed systems project that uses NFC identity, ultrasonic cup detection, and an ESP32-controlled pour system connected to a web UI.',
      highlights: [
        'ESP32 firmware',
        'Web-controlled hardware interaction',
        'HTTP-based device communication',
        'Failure handling and mutual exclusion for physical actuator safety'
      ],
      tech: ['ESP32', 'C++', 'HTTP', 'JavaScript', 'Distributed Systems'],
      demoHref: '#',
      githubHref: 'https://github.com/DuffyAdams',
      accent: 'linear-gradient(135deg, #bbf7d0, #2dd4bf 48%, #083344)'
    }
  ];
</script>

<section id="projects" class="section-shell py-20 sm:py-28">
  <div class="reveal mb-10 flex flex-col justify-between gap-5 sm:mb-14 md:flex-row md:items-end" use:reveal={0}>
    <div>
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Selected Projects</p>
      <h2 class="mt-3 max-w-3xl text-4xl font-black tracking-normal sm:text-6xl">Projects I&apos;m proud of.</h2>
    </div>
  </div>

  <div class="grid gap-5 md:grid-cols-2">
    {#each projects.slice(0, 3) as project, index}
      <ProjectCard {project} delay={index * 110} />
    {/each}
  </div>
</section>

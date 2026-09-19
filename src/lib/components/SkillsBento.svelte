<script lang="ts">
  import { Bot, Braces, Database, Layers3, Server, Wrench } from 'lucide-svelte';
  import { reveal } from '$lib/reveal';

  const groups = [
    { title: 'Frontend', icon: Braces, skills: ['Svelte', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind'], span: 'lg:col-span-2' },
    { title: 'Backend', icon: Server, skills: ['Python', 'Flask', 'REST APIs', 'SQLite'], span: '' },
    { title: 'Systems/Data', icon: Database, skills: ['Scraping', 'Background workers', 'Geocoding', 'Real-time updates'], span: '' },
    { title: 'Tools', icon: Wrench, skills: ['Git', 'Playwright', 'Linux', 'Docker/Proxmox', 'Supabase'], span: 'lg:col-span-2' },
    { title: 'AI', icon: Bot, skills: ['OpenAI API', 'LLM summaries', 'AI image workflows'], span: '' }
  ];
</script>

<section id="skills" class="section-shell py-16 sm:py-20">
  <div class="reveal mb-8" use:reveal={{ kind: 'heading' }}>
    <p class="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Technical Range</p>
    <h2 class="mt-3 max-w-3xl text-4xl font-black tracking-normal sm:text-6xl">Tools and languages I use to ship projects</h2>
  </div>

  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each groups as group, index}
      <article class={`reveal surface rounded-apple p-5 sm:p-6 ${group.span}`} use:reveal={{ kind: 'tile', delay: (index % 3) * 100, direction: index % 2 === 0 ? -1 : 1 }}>
        <div class="mb-5 flex items-center justify-between">
          <div class="grid h-10 w-10 place-items-center rounded-xl bg-muted">
            <svelte:component this={group.icon} size={20} />
          </div>
          <Layers3 class="text-muted-foreground/35" size={18} />
        </div>
        <h3 class="text-xl font-black sm:text-2xl">{group.title}</h3>
        <div class="mt-4 flex flex-wrap gap-1.5">
          {#each group.skills as skill}
            <span class="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground/80 sm:text-sm">{skill}</span>
          {/each}
        </div>
      </article>
    {/each}
  </div>
</section>

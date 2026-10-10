<script lang="ts">
  import { ArrowUpRight, Github } from 'lucide-svelte';
  import ProjectCard from './ProjectCard.svelte';
  import { projects, sideProjects } from '$lib/content';
  import { reveal } from '$lib/reveal';

  const [featuredProject, ...otherProjects] = projects;
</script>

<section id="projects" class="section-shell py-10 sm:py-14">
  <div class="reveal mb-6 sm:mb-8" use:reveal={{ kind: 'heading' }}>
    <p class="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Projects</p>
    <h2 class="mt-2 max-w-4xl text-3xl font-black tracking-normal sm:text-5xl">Stuff I built because something bugged me.</h2>
    <p class="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
      Hover a preview (or tap it on your phone) to watch it run.
    </p>
  </div>

  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <!-- The featured card spans the full row; the rest sit three across. -->
    <ProjectCard project={featuredProject} featured />
    {#each otherProjects as project, index}
      <ProjectCard {project} delay={(index % 3) * 110} direction={index % 2 === 0 ? -1 : 1} />
    {/each}
  </div>

  <div class="reveal surface mt-4 rounded-card p-5 sm:p-6" use:reveal={{ kind: 'rise' }}>
    <h3 class="text-lg font-black">And some smaller stuff</h3>
    <ul class="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
      {#each sideProjects as item}
        <li>
          <p class="flex flex-wrap items-baseline gap-x-2">
            <span class="font-bold">{item.title}</span>
            <span class="text-xs font-semibold text-muted-foreground">{item.kind}</span>
          </p>
          <p class="mt-1 text-sm leading-6 text-muted-foreground">{item.blurb}</p>
          {#if item.href || item.githubHref}
            <div class="mt-1.5 flex flex-wrap gap-4 text-sm font-semibold">
              {#if item.href}
                <a class="inline-flex items-center gap-1 text-primary hover:underline" href={item.href} target="_blank" rel="noreferrer">
                  {item.hrefLabel} <ArrowUpRight size={14} />
                </a>
              {/if}
              {#if item.githubHref}
                <a class="link-quiet inline-flex items-center gap-1.5" href={item.githubHref} target="_blank" rel="noreferrer">
                  <Github size={14} /> Code
                </a>
              {/if}
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</section>

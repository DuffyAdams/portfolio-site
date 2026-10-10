<script lang="ts">
  import { GraduationCap } from 'lucide-svelte';
  import { education, jobs } from '$lib/content';
  import { reveal } from '$lib/reveal';
</script>

<section id="experience" class="section-shell py-10 sm:py-14">
  <div class="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:gap-10">
    <div class="lg:sticky lg:top-28">
      <div class="reveal" use:reveal={{ kind: 'heading' }}>
        <p class="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Experience</p>
        <h2 class="mt-2 text-3xl font-black tracking-normal sm:text-5xl">How I got here.</h2>
        <p class="mt-3 max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
          Not the straight path. Fast food, then on-site tech support, now QA, with school squeezed in along the way.
        </p>
      </div>

      <div class="reveal surface mt-5 rounded-card p-5" use:reveal={{ kind: 'rise', delay: 120 }}>
        <div class="flex items-center gap-2.5">
          <span class="grid h-8 w-8 place-items-center rounded-lg bg-muted">
            <GraduationCap size={16} />
          </span>
          <h3 class="font-black">School</h3>
        </div>
        <ul class="mt-3 space-y-2.5">
          {#each education as item}
            <li>
              <p class="text-sm font-bold">{item.degree}</p>
              <p class="text-sm text-muted-foreground">{item.school} · {item.dates}</p>
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <ol class="relative space-y-3 before:absolute before:bottom-6 before:left-[0.6rem] before:top-6 before:w-px before:bg-border">
      {#each jobs as job, index}
        <li class="relative pl-8">
          <span
            class={`absolute left-0 top-6 h-5 w-5 rounded-full border-4 border-background ${job.current ? 'bg-emerald-500' : 'bg-muted-foreground/50'}`}
            aria-hidden="true"
          ></span>
          <article class="reveal surface rounded-card p-5" use:reveal={{ kind: 'card', delay: index * 90, direction: 1 }}>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 class="text-lg font-black sm:text-xl">{job.role}</h3>
                <p class="text-sm font-semibold text-muted-foreground">{job.company} · {job.location}</p>
              </div>
              <span
                class={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold ${job.current ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200' : 'bg-muted text-muted-foreground'}`}
              >
                {job.dates}
              </span>
            </div>

            <p class="mt-3 text-sm leading-6 text-foreground/85 sm:text-[0.95rem]">{job.summary}</p>

            {#if job.bullets.length}
              <ul class="mt-2.5 space-y-1.5 text-sm leading-6 text-muted-foreground">
                {#each job.bullets as bullet}
                  <li class="flex gap-2.5">
                    <span class="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
                    <span>{bullet}</span>
                  </li>
                {/each}
              </ul>
            {/if}
          </article>
        </li>
      {/each}
    </ol>
  </div>
</section>

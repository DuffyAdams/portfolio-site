<script lang="ts">
  import { languages, skillGroups } from '$lib/content';
  import { reveal } from '$lib/reveal';
</script>

<section id="skills" class="section-shell py-10 sm:py-14">
  <div class="reveal mb-6" use:reveal={{ kind: 'heading' }}>
    <p class="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Toolbox</p>
    <h2 class="mt-2 max-w-3xl text-3xl font-black tracking-normal sm:text-5xl">What I build with.</h2>
    <p class="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
      Svelte and Python show up in most of my projects. The rest depends on what I&apos;m building.
    </p>
  </div>

  <div class="reveal surface rounded-card p-5 sm:p-7" use:reveal={{ kind: 'rise' }}>
    <div class="flex flex-wrap items-center gap-1.5 border-b border-border pb-5">
      <span class="mr-1 text-sm font-bold">Languages</span>
      {#each languages as language}
        <span class="rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-foreground/85 sm:text-sm">{language}</span>
      {/each}
    </div>

    <div class="mt-5 grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
      {#each skillGroups as group}
        <div>
          <div class="flex items-center gap-2.5">
            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted">
              <group.icon size={16} />
            </span>
            <h3 class="font-black">{group.title}</h3>
          </div>
          <p class="mt-2 hidden text-sm leading-6 text-muted-foreground sm:block">{group.note}</p>
          <div class="mt-2.5 flex flex-wrap gap-1.5">
            {#each group.skills as skill}
              <span class="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground/80">{skill}</span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

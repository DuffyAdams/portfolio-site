<script lang="ts">
  import { Code, Dumbbell, GraduationCap, MapPin } from 'lucide-svelte';
  import { reveal } from '$lib/reveal';

  const facts = [
    { icon: MapPin, label: 'Chula Vista, CA' },
    { icon: GraduationCap, label: "SDSU CS '26" },
    { icon: Dumbbell, label: '10+ years training' },
    { icon: Code, label: 'Svelte + Python' }
  ];
</script>

<section id="about" class="section-shell py-10 sm:py-14">
  <div class="surface grid gap-6 rounded-apple p-5 sm:p-7 md:grid-cols-[13rem_1fr] md:items-start lg:grid-cols-[15rem_1fr] lg:gap-10">
    <div class="flex items-center gap-4 md:block md:space-y-4">
      <div class="w-28 shrink-0 overflow-hidden rounded-[1.5rem] border border-border bg-muted shadow-soft md:w-full" use:reveal={{ kind: 'image' }}>
        <img
          src="/assets/sdsu-profile-pic.webp"
          alt="Duffy Adams in an SDSU graduation gown on campus"
          class="aspect-square w-full object-cover object-[50%_42%]"
        />
      </div>
      <ul class="flex flex-wrap gap-1.5">
        {#each facts as fact}
          <li class="pill !gap-1.5 !px-2.5 !py-1 !text-xs">
            <fact.icon size={13} />
            {fact.label}
          </li>
        {/each}
      </ul>
    </div>

    <div use:reveal={{ kind: 'rise', delay: 140 }}>
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">About</p>
      <h2 class="mt-2 text-3xl font-black tracking-normal sm:text-4xl">A little more about me.</h2>
      <div class="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
        <p>
          My family got me into tech when I was young, and it stuck. Part of why I do this is to keep that going.
        </p>
        <p>
          After six years at Chick-fil-A, I went into tech support at ICSolutions, fixing phones, tablets, and kiosks while I worked through school at Southwestern and then SDSU. The more I fixed other people&apos;s systems, the more I wanted to build my own tools.
        </p>
        <p>
          These days I&apos;m on the QA team at ICS, and I build stuff the rest of the time. I care more about useful than impressive. If it saves a few clicks or explains what&apos;s going on, that&apos;s enough for me. Outside of code, I&apos;ve been training for over ten years, which is pretty much how FLEX happened.
        </p>
      </div>
    </div>
  </div>
</section>

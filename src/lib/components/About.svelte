<script lang="ts">
  import { GraduationCap } from 'lucide-svelte';
  import { reveal } from '$lib/reveal';
</script>

<section id="about" class="section-shell py-20 sm:py-28">
  <div class="surface grid gap-8 rounded-apple p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
    <div class="space-y-5 max-w-md">
      <p class="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">About</p>
      <div class="max-w-sm overflow-hidden rounded-[2rem] border border-border bg-muted shadow-soft" use:reveal={{ kind: 'image' }}>
        <img
          src="/assets/sdsu-profile-pic.webp"
          alt="Duffy Adams profile photo"
          class="aspect-square w-full object-cover object-[50%_42%]"
        />
      </div>
    </div>

    <div class="space-y-5" use:reveal={{ kind: 'rise', delay: 140 }}>
      <div class="flex gap-4">
        <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-muted">
          <GraduationCap size={22} />
        </div>
        <div class="space-y-4 text-lg leading-8 text-muted-foreground">
          <p>
            My family introduced me to the world of technology at a young age, and that early interest eventually grew into a passion for building software and solving real-world problems.
          </p>
          <p>
            I started my career working in technical support and systems operations, where I gained hands-on experience troubleshooting hardware, software, and network systems in fast-paced environments. Over time, I became more interested in creating the tools behind the systems I worked with every day, which led me deeper into software development and full-stack engineering.
          </p>
          <p>
            Today, I enjoy building realtime applications, backend systems, and modern web experiences that turn complex information into simple, useful products. I&apos;m always looking to keep learning, improve my skills, and continue the legacy that first inspired me to get into tech.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

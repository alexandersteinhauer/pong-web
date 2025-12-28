<script lang="ts">
  import { goto } from "$app/navigation";
</script>

<div class="flex min-h-screen flex-col items-center gap-8 p-8">
  <header class="flex flex-1 items-center justify-center text-center">
    <h1
      class="font-geist text-6xl font-bold tracking-[0.3em] text-white [-webkit-text-fill-color:#262626] [-webkit-text-stroke:2px_currentColor]"
    >
      PONG
    </h1>
  </header>

  <main class="flex w-full max-w-md flex-none flex-col gap-5">
    <button
      class="flex cursor-pointer items-center gap-5 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-8 py-6 text-left transition-all hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
      onclick={() => goto("/local")}
    >
      <span class="text-3xl">🎮</span>
      <span class="flex flex-col gap-1">
        <span class="text-lg font-bold text-white">Local Multiplayer</span>
        <span class="text-xs text-neutral-500">Two players, one keyboard</span>
      </span>
    </button>

    <button
      class="flex cursor-pointer items-center gap-5 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-8 py-6 text-left transition-all hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
      onclick={() => goto("/online")}
    >
      <span class="text-3xl">🌐</span>
      <span class="flex flex-col gap-1">
        <span class="text-lg font-bold text-white">Online Multiplayer</span>
        <span class="text-xs text-neutral-500">Play with friends worldwide</span
        >
      </span>
    </button>
  </main>

  <footer class="flex flex-1 items-end justify-center">
    <a
      href="https://github.com/alexandersteinhauer/pong-web"
      rel="noopener noreferrer"
      class="text-sm text-neutral-500 transition-colors hover:text-cyan-400"
    >
      GitHub
    </a>
  </footer>
</div>

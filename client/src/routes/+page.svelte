<script lang="ts">
  import { goto } from "$app/navigation";
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-12 p-8">
  <header class="text-center">
    <h1
      class="bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-7xl font-bold tracking-[0.3em] text-transparent"
    >
      PONG
    </h1>
  </header>

  <main class="flex w-full max-w-md flex-col gap-5">
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

  <footer
    class="flex items-center gap-8 rounded-lg border border-neutral-800 bg-[#0a0a0a] px-8 py-4"
  >
    <div class="flex flex-col items-center gap-1">
      <span class="text-[10px] tracking-widest text-neutral-500 uppercase"
        >Player 1</span
      >
      <span class="font-bold text-cyan-400">W / S</span>
    </div>
    <div class="h-8 w-px bg-neutral-800"></div>
    <div class="flex flex-col items-center gap-1">
      <span class="text-[10px] tracking-widest text-neutral-500 uppercase"
        >Player 2</span
      >
      <span class="font-bold text-cyan-400">↑ / ↓</span>
    </div>
  </footer>
</div>

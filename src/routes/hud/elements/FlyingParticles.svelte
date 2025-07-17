<!-- FlyingParticles.svelte -->
<script lang="ts">
  import { onMount } from "svelte";

  interface Particle {
    id: number;
    x: number;
    delay: number;
    duration: number;
    size: number;
  }

  let particles: Particle[] = [];

  onMount(() => {
    particles = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: -Math.random() * 5,
      duration: 3 + Math.random() * 2,
      size: 4 + Math.random() * 4
    }));
  });
</script>

<div class="particles">
  {#each particles as particle (particle.id)}
    <div
      class="particle"
      style="
        left: {particle.x}%;
        width: {particle.size}px;
        height: {particle.size}px;
        animation-delay: {particle.delay}s;
        animation-duration: {particle.duration}s;
      "
    ></div>
  {/each}
</div>
<div class="screen-glow"></div>

<style lang="scss">
  @import "../../../colors.scss";
  .screen-glow {
    position: fixed;
    bottom: -100px;
    left: -10vw;
    width: 120vw;
    height: 300px;
    pointer-events: none;
    z-index: -999;
    background: radial-gradient(
      ellipse at bottom,
      rgba($accent-color, 0.5) 0%,
      rgba($accent-color, 0.6) 40%,
      transparent 90%
    );
    filter: blur(60px);
  }

  .particles {
    position: absolute;
    top: 0;
    left: -10vw;
    width: 120vw;
    height: 100%;
    pointer-events: none;
    z-index: -99;
    overflow: visible;
  }

  .particle {
    position: absolute;
    bottom: 0;
    border-radius: 50%;
    background: $healthprogress-particle;
    filter: blur(2px) drop-shadow(0 0 8px $healthprogress-particle);
    animation-name: float;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes float {
    0% {
      transform: translateY(0) scale(1) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(-200px) scale(0.8) rotate(360deg);
      opacity: 0;
    }
  }
</style>

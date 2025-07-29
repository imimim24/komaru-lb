<script lang="ts">
  import { fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  import { backIn, backOut } from "svelte/easing";
  import { Howl } from "howler";
  import hoverSound from "/sounds/hover.mp3";

  export let title: string;
  export let index: number;

  let hovered = false;
  const dispatch = createEventDispatcher();

  const hoverSfx = new Howl({
    src: [hoverSound],
    html5: true,
    preload: true
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="button"
  on:mouseenter={() => {
    hovered = true;
    hoverSfx.play();
  }}
  on:mouseleave={() => (hovered = false)}
  on:click={() => {
    hovered = false;
    dispatch("click");
  }}
  out:fly|global={{ duration: 400, x: -500, delay: index * 100, easing: backIn }}
  in:fly|global={{ duration: 400, x: -500, delay: index * 100, easing: backOut }}>

  <div class="inner">{title}</div>
  <div class="wrapped-content"><slot parentHovered={hovered} /></div>
</div>

<style lang="scss">
    @use "../../../../colors.scss" as *;
  /* cool buuttonn i made. very goood wooow*/
  .button {
    width: 300px;
    height: 45px;
    border: none;
    border-radius: 12px;
    background: radial-gradient(circle 100px at 50% -50%, #333333, #000000);
    box-shadow: inset 0 1px 0 #2a2a2a, 0 4px 10px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
    padding: 0;
  }

  .inner {
    color: #d0d0d0;
    font-size: 1.2rem;
    font-weight: 500;
    text-align: center;
    width: 100%;
    height: 100%;
    line-height: 45px;
    border-radius: 12px;
    user-select: none;
  }

  .button:hover {
    transform: scale(0.90);
  }

  .button:active {
    transform: scale(0.80);
  }
</style>

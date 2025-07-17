<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import { Howl } from "howler";
  import hoverSound from "/sounds/hover.mp3";

  export let title: string;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  const hoverSfx = new Howl({
    src: [hoverSound],
    html5: true,
    preload: true
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<button
  class="icon-text-button"
  on:mouseenter={() => {
    if (!disabled) hoverSfx.play();
  }}
  on:click={() => dispatch("click")}
  {disabled}
  transition:fly|global={{ duration: 350, y: 100 }}
>
  <div class="icon"></div>
  <div class="title">{title}</div>
</button>

<style lang="scss">
    @import "../../../../colors.scss";
    /* My cool button, yes yes, my button. I made it myself, please don’t steal this cool button. If you’re reading this, it means you want to modify or use it, so give credit if you do. So pls pls pls. */
    .icon-text-button {
      display: flex;
      border-radius: 12px;
      align-items: center;
      overflow: hidden;
      height: 45px;
      border: none;
      background: radial-gradient(circle 75px at 50% -50%, #333333, #000000);
      box-shadow: inset 0 1px 0 #2a2a2a, 0 4px 10px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      position: relative;
      padding: 0;

      &:not([disabled]):hover {
        transform: scale(0.90);
      }

      &:not([disabled]):active {
        transform: scale(0.80); 
      }

      &[disabled] {
        opacity: 0.6;
        cursor: default;
      }
    }


    .title {
      padding: 30px 30px;
			color: #d0d0d0;
	    font-size: 1.2rem;
	    font-weight: 500;
	    text-align: center;
      font-family: "redhattext";
	    line-height: 45px;
	    user-select: none;
  }
</style>
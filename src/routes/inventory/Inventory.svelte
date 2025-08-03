<script lang="ts">
  import { quintOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';
</script>

<div class="cat-container">
  <img class="watermark" src="img/hud/taco/cat.png" alt="watermark"
    in:scale={{ duration: 100, easing: t => t }}
    out:scale={{ duration: 400, easing: quintOut, start: 1.1 }}
  />
</div>

<style>
.watermark {
  position: absolute;
  bottom: 0px;
  left: -35px;
  width: 200px;
}
</style>

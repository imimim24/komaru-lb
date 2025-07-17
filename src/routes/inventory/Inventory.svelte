<script lang="ts">
      import FlyingParticles from "../hud/elements/FlyingParticles.svelte";
</script>

<div class="cat-container">
  <img class="watermark" src="img/hud/taco/cat.png" alt="watermark" />
  <div class="particles">
  <FlyingParticles />
  </div>
</div>
<style>
.watermark {
  position: absolute;
  bottom: 0px;
  left: -35px;
  width: 200px;
}
</style>

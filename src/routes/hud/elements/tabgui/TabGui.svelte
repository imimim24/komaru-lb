<script lang="ts">
import { onMount } from "svelte";
import { listen } from "../../../../integration/ws";
type ClientPlayerDataEvent = { playerData: { position: { x: number; y: number; z: number } } };

let playerData: any = null;

listen("clientPlayerData", (event: ClientPlayerDataEvent) => {
    playerData = event.playerData;
});
</script>

<div class="watermark">
    <div class="info-box group-box">
        {#if playerData}
            <div class="info-entry">
                <img src="img/watermark/coords.svg" alt="icon" />
                <span class="watermark-gradient">
                    X: {Math.floor(playerData.position.x)} Y: {Math.floor(playerData.position.y)} Z: {Math.floor(playerData.position.z)}
                </span>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
@import "../../../../colors.scss";

.watermark-gradient {
  animation: pulseColor 0.875s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
}

@keyframes pulseColor {
  0% {
    color: #{$txtshdw};
    text-shadow:
      0 0 6px rgba($txtshdw, 0.9),
      0 0 12px rgba($txtshdw, 0.8),
      0 0 24px rgba($txtshdw, 0.6);
  }
  50% {
    color: #{$txtshdw2};
    text-shadow:
      0 0 6px rgba($txtshdw2, 0.9),
      0 0 12px rgba($txtshdw2, 0.8),
      0 0 24px rgba($txtshdw2, 0.6);
  }
  100% {
    color: #{$txtshdw};
    text-shadow:
      0 0 6px rgba($txtshdw, 0.9),
      0 0 12px rgba($txtshdw, 0.8),
      0 0 24px rgba($txtshdw, 0.6);
  }
}

.watermark {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: transparent;
}

.info-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 14px;
  background: rgba($base, 0.6);
  font-size: 14px;
  color: $text;
  box-shadow: $shadow-arraylist;

  img {
    width: 14px;
    height: 14px;
    filter: drop-shadow(0px 0px 4px $text);
  }
}

.group-box {
  gap: 8px;
}

.info-entry {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>

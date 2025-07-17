<script lang="ts">
    import {listen} from "../../../../integration/ws";
    import type {KeyEvent} from "../../../../integration/events";
    import type {MinecraftKeybind} from "../../../../integration/types";

    export let gridArea: string;
    export let key: MinecraftKeybind | undefined;

    let active = false;

    listen("key", (e: KeyEvent) => {
        if (e.key !== key?.key.translationKey) {
            return;
        }

        active = e.action === 1 || e.action === 2;
    });
</script>

<div class="key" style="grid-area: {gridArea};" class:active>
    {key?.key.localized ?? "???"}
</div>

<style lang="scss">
  @import "../../../../colors.scss";

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

  .key {
    height: 40px;
    background-color: rgba($base, 0.6);
    color: $text;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    transition: ease scale 0.1s;
    position: relative;
    text-align: center;
    box-shadow: $shadow;
    animation: pulseColor 0.875s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;

    &.active {
      scale: 90%;
    }
  }
</style>
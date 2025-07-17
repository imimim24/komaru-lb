<script lang="ts">
    import {listen} from "../../../integration/ws";
    import type {ClientPlayerDataEvent} from "../../../integration/events";
    import type {StatusEffect} from "../../../integration/types";

    let effects: StatusEffect[] = [];

    listen("clientPlayerData", (event: ClientPlayerDataEvent) => {
        effects = event.playerData.effects;
    });

    function formatTime(duration: number): string {
        return new Date(((duration / 20) | 0) * 1000).toISOString().substring(14, 19);
    }

    function convertToRoman(n: number): string {
        switch (n) {
            case 0: return "I";
            case 1: return "II";
            case 2: return "III";
            case 3: return "IV";
            case 4: return "V";
            case 5: return "VI";
            case 6: return "VII";
            case 7: return "VIII";
            case 8: return "IX";
            case 9: return "X";
            default: return "X+";
        }
    }
</script>

<div class="effects-list">
    <div class="watermark-header info-box with-logo">
        <img src="img/watermark/potion.svg" alt="icon" />
        <div class="separator inline"></div>
        <span class="client-name watermark-gradient">Potions</span>
    </div>
    <div class="effects-container">
      {#each effects as e}
        <div class="effect-box">
          <span class="effect-name watermark-gradient">{e.localizedName} {convertToRoman(e.amplifier)}</span>
          <span
            class="effect-duration {formatTime(e.duration) <= '00:05' ? 'pulse-red' : ''}"
          >{formatTime(e.duration)}</span>
        </div>
      {/each}
    </div>
</div>

<style lang="scss">
@import "../../../colors.scss";

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

@keyframes pulseRed {
  0%, 49%, 100% {
    color: white;
    text-shadow: 0 0 8px white;
  }
  50% {
    color: #ff4343;
    text-shadow: 0 0 8px #ff4343;
  }
}

.effects-list {
  padding: 0;
  background: none;
  border-radius: 0;
  min-width: 120px;
  box-shadow: none;
}

.watermark-header {
  display: flex;
  align-items: center;
  padding: 3px 7px;
  border-radius: 5px;
  background: rgba($base, 0.6);
  font-size: 12px;
  color: $text;
  box-shadow: $shadow-arraylist;
  font-weight: 500;
  margin-bottom: 3px;
  min-width: 0;
}

.watermark-header img {
  width: 13px;
  height: 13px;
  filter: drop-shadow(0px 0px 4px white);
}

.separator.inline {
  width: 1px;
  height: 11px;
  background: rgba($text, 0.25);
  border-radius: 1px;
  margin: 0 3px;
}

.info-box {
  display: flex;
  align-items: center;
  gap: 4px;
}

.with-logo {
  padding-left: 4px;
}

.effects-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.effect-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba($base, 0.6);
  border-radius: 5px;
  box-shadow: $base-shadow;
  padding: 3px 7px;
}

.effect-name {
  font-weight: 500;
  font-size: 12px;
  color: $text;
}

.effect-duration {
  color: white;
  font-size: 12px;
  margin-left: 6px;
  min-width: 40px;
  text-align: right;
  transition: color 0.2s;
  position: relative;
  text-shadow: 0 0 8px white;
}

.pulse-red {
  animation: pulseRed 1s infinite;
  animation-timing-function: linear;
  text-shadow: 0 0 8px white;
}
</style>

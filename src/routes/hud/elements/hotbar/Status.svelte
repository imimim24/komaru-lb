<script lang="ts">
  export let max: number;
  export let value: number;
  export let color: string;
  export let alignRight: boolean;
  export let label: string | null = null;
  export let icon: string | null = null;
</script>

<div class="progress" class:align-right={alignRight}>
  {#if label}
    <div class="label">{label}</div>
  {/if}
  {#if icon}
    <img class="icon" src="img/hud/hotbar/icon-{icon}.svg" alt={icon} />
  {/if}
  <div
    class:align-right={alignRight}
    class="progress-bar"
    style="width: {Math.floor(
      (value / max) * 100,
    )}%; background-color: {color};"
  ></div>
</div>

<style lang="scss">
  @use "../../../../colors.scss" as *;

  .label {
    color: $text;
    position: absolute;
    font-size: 10px;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    scale: 110%;
    font-family: "inter";
  }

  .icon {
    position: absolute;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
    filter: drop-shadow($y-shadow);
  }

  .progress {
    position: relative;
    border-radius: 12px;
    background-color: rgba($base, 0.6);
    box-shadow: $y-shadow;
    //border: $border-thing;

    &.align-right {
      .label {
        left: 5px;
        right: unset;
      }

      .icon {
        right: 5px;
        left: unset;
      }
    }
  }

  .progress-bar {
    border-radius: 12px;
    height: 20px;
    will-change: width;
    transition: ease width 0.2s;

    &.align-right {
      margin-left: auto;
    }
  }
</style>
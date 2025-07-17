<script lang="ts">
  import { onMount } from "svelte";

  export let title: string;
  export let message: string;
  export let severity: string;

  let messageEl: HTMLSpanElement;
  let needsFade = false;

  onMount(() => {
    const checkFade = () =>
      (needsFade = messageEl && messageEl.scrollWidth > messageEl.offsetWidth);

    checkFade();
    const observer = new ResizeObserver(checkFade);
    observer.observe(messageEl);

    return () => observer.disconnect();
  });
</script>

<div class="notification">
  <div class="icon {severity.toLowerCase()}"></div>
  <div class="separator inline"></div>
  <div class="notification-text-row">
    <span class="title">{title}</span>
    <span class="message" class:fade={needsFade} bind:this={messageEl}>{message}</span>
  </div>
</div>

<style lang="scss">
@use "../../../../colors.scss" as *;

.notification {
  display: flex;
  align-items: center;
  background: rgba($base, 0.6);
  border-radius: 5px;
  box-shadow: $base-shadow;
  padding: 0 8px 0 4px;
  max-width: 270px;
  height: 28px;
  gap: 1px;
  overflow: hidden;
}

.icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
  margin-right: 4px;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  &.enabled::after,
  &.disabled::after {
    width: 1.25em;
    height: 1.25em;
    transform: translateX(2px);
  }

  &.success::after,
  &.error::after,
  &.info::after,
  &::after {
    width: 14px;
    height: 14px;
    transform: translateX(2px);
  }

  &.success::after {
    background-image: url("/img/hud/notification/icon-success.svg");
  }
  &.error::after {
    background-image: url("/img/hud/notification/icon-error.svg");
  }
  &.info::after {
    background-image: url("/img/hud/notification/icon-info.svg");
  }
  &.enabled::after {
    background-image: url("/img/hud/notification/icon-on.svg");
  }
  &.disabled::after {
    background-image: url("/img/hud/notification/icon-off.svg");
  }
}

.separator.inline {
  width: 1px;
  height: 16px;
  background: rgba($text, 0.25);
  border-radius: 1px;
  margin-left: 2px;
}

.notification-text-row {
  display: flex;
  align-items: center;
  flex: 1 1 0%;
  gap: 3px;
  overflow: hidden;
  margin-top: 2px;
  min-width: 0;
  margin-left: 4px;
}

.title, .message {
  font-size: 12px;
  font-family: "Inter";
  white-space: nowrap;
  line-height: 1.3;
  margin: 0;
  color: $text;
  text-align: left;
}

.title {
  max-width: 80px;
  flex-shrink: 0;
}

.message {
  overflow: hidden;
  text-overflow: clip;
  max-width: 100%;
  display: block;
  word-break: break-word;
}

.message.fade {
  mask-image: linear-gradient(to right, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%);
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
}
</style>

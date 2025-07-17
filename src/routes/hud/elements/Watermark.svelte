<script lang="ts">
  import { getClientInfo, getSession } from "../../../integration/rest";
  import type { ClientInfo, Session } from "../../../integration/types";
  import { onMount } from "svelte";
  import { listen } from "../../../integration/ws";
  import { getModules } from "../../../integration/rest";
  import type { ClientPlayerDataEvent } from "../../../integration/events";

  let clientInfo: ClientInfo | null = null;
  let session: Session | null = null;
  let time: string;

  let showUsername = false;
  let isNameProtected = false;

  async function updateClientInfo() {
    clientInfo = await getClientInfo();
  }

  async function updateSession() {
    session = await getSession();
  }

  async function updateNameProtect() {
    const modules = await getModules();
    const nameProtect = modules.find(module => module.name === "NameProtect");
    isNameProtected = !!(nameProtect && nameProtect.enabled);
    showUsername = !isNameProtected;
  }

  function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  onMount(async () => {
    updateClientInfo();
    updateTime();
    updateSession();
    await updateNameProtect();
    setInterval(async () => {
      updateClientInfo();
      updateTime();
      updateSession();
      await updateNameProtect();
    }, 1000);
  });

  listen("session", async () => {
    await updateSession();
  });

  let playerData: any = null;
  let lastX = 0;
  let lastZ = 0;

  listen("clientPlayerData", (event: ClientPlayerDataEvent) => {
    if (playerData) {
      lastX = playerData.position.x;
      lastZ = playerData.position.z;
    }
    playerData = event.playerData;
  });

  function roundToDecimal(value: number, decimal: number) {
    return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }

  function getBPS(
    lastX: number,
    currentX: number,
    lastZ: number,
    currentZ: number,
    tickrate: number
  ): number {
    const deltaX = currentX - lastX;
    const deltaZ = currentZ - lastZ;
    const distanceMoved = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
    return distanceMoved * tickrate;
  }
</script>

<div class="watermark">
  <div class="info-box with-logo">
    <div class="logo-wrapper">
      <img src="img/clickgui/icon-client.svg" alt="icon" />
    </div>
    <div class="separator inline"></div>
    <span class="client-name watermark-gradient">Nextgen</span>
  </div>

  <div class="info-box group-box">
    {#if session}
      <div class="info-entry">
        <img src="img/watermark/user.svg" alt="icon" />
        <span class="watermark-gradient">
          {isNameProtected ? 'liquidbounce.net' : session.username}
        </span>
      </div>
      <div class="separator inline"></div>
    {/if}

    <div class="info-entry">
      <img src="img/watermark/clock.svg" alt="icon" />
      <span class="watermark-gradient">{time}</span>
    </div>

    {#if clientInfo}
      <div class="separator inline"></div>
      <div class="info-entry">
        <img src="img/watermark/fps.svg" alt="icon" />
        <span class="watermark-gradient">{clientInfo.fps}fps</span>
        <div class="separator inline"></div>
        <img src="img/watermark/speed.svg" alt="speed" />
        <span class="watermark-gradient {playerData ? '' : 'speed-hidden'}">
          {#if playerData}
            {roundToDecimal(getBPS(lastX, playerData.position.x, lastZ, playerData.position.z, 20), 2)}m/s
          {/if}
        </span>
      </div>
    {/if}
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

.speed-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
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
    filter: drop-shadow(0px 0px 4px white);
  }
}

.info-box.with-logo {
  gap: 6px;
}

.logo-wrapper {
  width: 17px;
  height: 17.3px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 14px;
    height: 14px;
  }
}

.client-name {
  font-weight: 500;
  color: $text;
}

.group-box {
  gap: 8px;
}

.info-entry {
  display: flex;
  align-items: center;
  gap: 5px;
}

.separator.inline {
  width: 1px;
  height: 16px;
  background: rgba($text, 0.25);
  border-radius: 1px;
}
</style>

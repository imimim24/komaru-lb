<script lang="ts">
  import type { ItemStack } from "../../../../integration/types";
  import { listen } from "../../../../integration/ws";
  import type { PlayerInventory, PlayerInventoryEvent } from "../../../../integration/events";
  import ItemStackView from "./ItemStackView.svelte";
  import { onMount } from "svelte";
  import { getPlayerInventory } from "../../../../integration/rest";

  let stacks: ItemStack[] = [];

  function updateStacks(inventory: PlayerInventory) {
    stacks = inventory.main.slice(9);
  }

  listen("clientPlayerInventory", (data: PlayerInventoryEvent) => {
    updateStacks(data.inventory);
  });

  onMount(async () => {
    const inventory = await getPlayerInventory();
    updateStacks(inventory);
  });
</script>

<div class="watermark-header info-box with-logo">
  <img src="img/watermark/inv.svg" alt="icon" />
  <div class="slot-separator-inventory"></div>
  <span class="client-name watermark-gradient">Inventory</span>
</div>

<div class="inventory-watermark">
  <div class="container">
    {#each Array(3) as _, rowIdx}
      <div class="inventory-row">
        {#each stacks.slice(rowIdx * 9, rowIdx * 9 + 9) as stack, i (stack)}
          <div class="slot-wrapper">
            <ItemStackView {stack} />
            {#if i < 8}
              <div class="slot-separator"></div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
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
    text-shadow: 0 0 6px rgba($txtshdw, 0.9), 0 0 12px rgba($txtshdw, 0.8), 0 0 24px rgba($txtshdw, 0.6);
  }
  50% {
    color: #{$txtshdw2};
    text-shadow: 0 0 6px rgba($txtshdw2, 0.9), 0 0 12px rgba($txtshdw2, 0.8), 0 0 24px rgba($txtshdw2, 0.6);
  }
  100% {
    color: #{$txtshdw};
    text-shadow: 0 0 6px rgba($txtshdw, 0.9), 0 0 12px rgba($txtshdw, 0.8), 0 0 24px rgba($txtshdw, 0.6);
  }
}

.slot-separator-inventory {
  width: 1px;
  height: 11px;
  background: rgba($text, 0.25);
  border-radius: 1px;
  margin: 0 3px;
  flex-shrink: 0;
}

.inventory-watermark {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.info-box {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 7px;
  border-radius: 5px;
  background: rgba($base, 0.6);
  font-size: 12px;
  color: $text;
  box-shadow: $shadow-arraylist;
  font-weight: 500;
  position: relative;
  z-index: 2;
  margin-bottom: 3px;

  img {
    width: 13px;
    height: 13px;
    filter: drop-shadow(0px 0px 4px white);
  }
}

.client-name {
  font-weight: 500;
  color: $text;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0;
  background: none;
  box-shadow: none;
}

.inventory-row {
  display: flex;
  flex-direction: row;
  gap: 0.1rem;
  background-color: rgba($base, 0.6);
  border-radius: 5px;
  box-shadow: $shadow-arraylist;
  padding: 2px 0 2px 3px;
  min-width: 231px;
}

.slot-wrapper {
  display: flex;
  align-items: center;
  gap: 2px;
}

.slot-separator {
  width: 1px;
  height: 90%;
  background: rgba($text, 0.15);
  border-radius: 1px;
}
</style>
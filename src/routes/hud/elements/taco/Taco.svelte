<script lang="ts">
    import {listen} from "../../../../integration/ws";
    import type {PlayerInventory, PlayerInventoryEvent} from "../../../../integration/events";
    import type {ItemStack} from "../../../../integration/types";
    import {onMount} from "svelte";
    import {getPlayerInventory} from "../../../../integration/rest";
    import ItemStackView from "../inventory/ItemStackView.svelte";

    const TOTEM_ID = "minecraft:totem_of_undying";

    let totemStack: ItemStack = {
        identifier: TOTEM_ID,
        count: 0,
        damage: 0,
        maxDamage: 0,
        enchantments: {},
        displayName: "Totem of Undying",
        hasEnchantment: false
    };

    function updateTotemStack(inventory: PlayerInventory) {
        const allStacks = [
            ...(inventory.main ?? []),
            ...(inventory.crafting ?? [])
        ];
        const total = allStacks
            .filter(stack => stack && stack.identifier === TOTEM_ID)
            .reduce((sum, stack) => sum + (stack.count ?? 0), 0);
        totemStack = {
            identifier: TOTEM_ID,
            count: total,
            damage: 0,
            maxDamage: 0,
            enchantments: {},
            displayName: "Totem of Undying",
            hasEnchantment: false
        };
    
    }

    listen("clientPlayerInventory", (data: PlayerInventoryEvent) => {
        updateTotemStack(data.inventory);
    });

    onMount(async () => {
        const inventory = await getPlayerInventory();
        updateTotemStack(inventory);
    });
</script>

<div class="totem-counter">
    <ItemStackView stack={totemStack}/>
    <span class="totem-count pulse-color">{totemStack.count}</span>
</div>

<style lang="scss">
@use "../../../../colors.scss" as *;

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

.pulse-color {
  animation: pulseColor 0.875s cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite;
}

.totem-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.totem-count {
  font-size: 14px;
  font-family: "minecraft";
  margin-top: 1px;
  line-height: 1;
  pointer-events: none;
  text-align: center;
  width: 100%;
  display: block;

  @extend .pulse-color;
}
</style>

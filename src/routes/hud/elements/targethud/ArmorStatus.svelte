<script lang="ts">
    import {REST_BASE} from "../../../../integration/host";
    import type {ItemStack} from "../../../../integration/types";

    export let itemStack: ItemStack;

    // damage points: 10 = full durability, 0 = no durability
    let damage = Math.ceil(10 - (itemStack.damage / itemStack.maxDamage * 10));
    $: damage = Math.ceil(10 - (itemStack.damage / itemStack.maxDamage * 10));

    /**
     * Get the color for all points based on durability percent (smooth gradient from green -> yellow -> red)
     */
    function getDurabilityColor(damage: number, max: number): string {
        if (max === 0) return "hsl(0, 100%, 50%)";
        const percent = damage / max; // 1 = green, 0.5 = yellow, 0 = red

        // 0 (red) → 0.5 (yellow) → 1 (green)
        // Red:   hsl(0, 100%, 50%)
        // Yellow:hsl(60, 100%, 50%)
        // Green: hsl(120, 100%, 40%)
        let hue: number;
        let light = 50;
        if (percent <= 0.5) {
            // Red to Yellow (0 to 0.5)
            hue = percent * 2 * 60; // 0-60
        } else {
            // Yellow to Green (0.5 to 1)
            hue = 60 + ((percent - 0.5) * 2 * 60); // 60-120
            light = 40; // slightly darker green
        }
        return `hsl(${hue}, 100%, ${light}%)`;
    }
</script>

<div class="armor-status">
    <img class="icon" src="{REST_BASE}/api/v1/client/resource/itemTexture?id={itemStack.identifier}" alt={itemStack.identifier} />
    <div class="durability">
        {#each Array.from({ length: 10 }, (x, i) => 10 - i) as index}
            <div
                class="point"
                class:active={index <= damage}
                style={index <= damage ? `background-color: ${getDurabilityColor(damage, 10)}` : ""}
            ></div>
        {/each}
    </div>
</div>

<style lang="scss">
    @use "../../../../colors.scss" as *;

    .armor-status {
        display: flex;
        align-items: center;
        column-gap: 5px;
    }

    .icon {
        height: 10px;
        width: 10px;
        image-rendering: pixelated;
    }

    .durability {
        display: flex;
        flex-direction: column;
        row-gap: 0px;

        .point {
            //background-color: rgba(0, 0, 0, 0.5);
            height: 1px;
            width: 1px;
            border-radius: 1px;
            transition: background-color 0.7s ease;
        }
        .point.active {
            /* Color is set in style attr */
        }
    }
</style>

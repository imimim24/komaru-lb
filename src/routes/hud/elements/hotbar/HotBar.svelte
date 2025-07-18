<script lang="ts">
    import Status from "./Status.svelte";
    import { listen } from "../../../../integration/ws";
    import type {
        PlayerData,
        TextComponent as TTExtComponent,
    } from "../../../../integration/types";
    import { onMount } from "svelte";
    import { getPlayerData } from "../../../../integration/rest";
    import { fade, fly } from "svelte/transition";
    import TextComponent from "../../../menu/common/TextComponent.svelte";
    import type {
        ClientPlayerDataEvent,
        OverlayMessageEvent,
    } from "../../../../integration/events";
    import { expoOut } from "svelte/easing";

    let lastSlot = 0;
    let currentSlot = 0;
    let playerData: PlayerData | null = null;
    let maxAbsorption = 0;
    let slotsElement: HTMLElement | undefined;

    let showItemStackName = false;
    let showItemStackNameTimeout: any | null = null;
    let itemStackName: TTExtComponent | string | null = null;
    let overlayMessage: OverlayMessageEvent | null = null;
    let overlayMessageTimeout: any | null = null;

    function updatePlayerData(s: PlayerData) {
        playerData = s;
        if (playerData.absorption <= 0) {
            maxAbsorption = 0;
        }
        if (playerData.absorption > maxAbsorption) {
            maxAbsorption = playerData.absorption;
        }
        currentSlot = playerData.selectedSlot;
        if (currentSlot !== lastSlot) {
            lastSlot = currentSlot;
            if (playerData.mainHandStack.identifier !== "minecraft:air") {
                itemStackName = playerData.mainHandStack.displayName;
                if (showItemStackNameTimeout !== null) {
                    clearTimeout(showItemStackNameTimeout);
                }
                showItemStackName = true;
                showItemStackNameTimeout = setTimeout(() => {
                    showItemStackName = false;
                }, 2000);
            }
        }
    }

    listen("clientPlayerData", (event: ClientPlayerDataEvent) => {
        updatePlayerData(event.playerData);
    });

    listen("overlayMessage", (event: OverlayMessageEvent) => {
        overlayMessage = event;
        if (overlayMessageTimeout !== null) {
            clearTimeout(overlayMessageTimeout);
        }
        overlayMessageTimeout = setTimeout(() => {
            overlayMessage = null;
        }, 3000);
    });

    onMount(async () => {
        updatePlayerData(await getPlayerData());
    });
</script>

{#if playerData && playerData.gameMode !== "spectator"}
    <div
        class="hotbar"
        transition:fly={{ duration: 700, y: 50, easing: expoOut }}
    >
        {#if overlayMessage !== null}
            <div
                class="overlay-message"
                transition:fade|global={{ duration: 200 }}
                style="max-width: {slotsElement?.offsetWidth ?? 0}px"
            >
                <TextComponent
                    fontSize={14}
                    textComponent={overlayMessage.text}
                />
            </div>
        {/if}
        {#if showItemStackName && itemStackName !== null}
            <div class="item-name" transition:fade|global={{ duration: 200 }}>
                <TextComponent fontSize={14} textComponent={itemStackName} />
            </div>
        {/if}
        <div class="status">
            <div class="pair">
                {#if playerData.armor > 0}
                    <Status
                        max={20}
                        value={playerData.armor}
                        color="#163e7a"
                        alignRight={false}
                        icon="shield"
                    />
                {:else}
                    <div></div>
                {/if}

                {#if playerData.air < playerData.maxAir}
                    <Status
                        max={playerData.maxAir}
                        value={playerData.air}
                        color="#163e7a"
                        alignRight={true}
                    />
                {:else}
                    <div></div>
                {/if}
            </div>

            {#if playerData.gameMode !== "creative"}
                {#if playerData.absorption > 0}
                    <div class="pair">
                        <Status
                            max={maxAbsorption}
                            value={playerData.absorption}
                            color="#163e7a"
                            alignRight={false}
                            icon="heart"
                            label={`${Math.floor(playerData.absorption)}`}
                        />

                        <div></div>
                    </div>
                {/if}
                <div class="pair">
                    <Status
                        max={playerData.maxHealth}
                        value={playerData.health}
                        color="#2c5899"
                        alignRight={false}
                        icon="heart"
                        label={`${Math.floor(playerData.health)}`}
                    />
                    <Status
                        max={20}
                        value={playerData.food}
                        color="#2c5899"
                        alignRight={true}
                        icon="food"
                    />
                </div>
            {/if}
            {#if playerData.experienceLevel > 0}
                <Status
                    max={100}
                    value={playerData.experienceProgress * 100}
                    color="#4472b6"
                    alignRight={false}
                    label={playerData.experienceLevel.toString()}
                />
            {/if}
        </div>

        <div class="hotbar-elements">
            <div class="slider" style="left: {currentSlot * 45}px"></div>
            <div class="slots" bind:this={slotsElement}>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
            </div>
        </div>

        {#if playerData?.offHandStack.identifier !== "minecraft:air"}
            <div
                class="offhand-slot"
                transition:fade|global={{ duration: 150 }}
            ></div>
        {/if}
    </div>
{/if}

<style lang="scss">
    @use "../../../../colors.scss" as *;

    .pair {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 25px;
        border-radius: 12px;
    }

    .status {
        display: flex;
        flex-direction: column;
        margin-bottom: 5px;
        row-gap: 5px;
        column-gap: 20px;
    }

    .hotbar-elements {
        background-color: rgba($base, 0.5);
        position: relative;
        border-radius: 12px;
        box-shadow: $base-shadow;
        //border: $border-thing;

        .slider {
            height: 45px;
            width: 45px;
            padding-left: 10px;
            position: absolute;
            border-radius: 12px;
            transition: ease 0.15s;
            box-shadow: $y-shadow;
            background-color: rgba($base, 0.25);
            scale: 90%;
        }

        .slots {
            display: flex;
        }

        .slot {
            height: 45px;
            width: 45px;
        }
    }

    .offhand-slot {
        height: 45px;
        width: 45px;
        border-radius: 12px;
        background-color: rgba($base, 0.5);
        position: absolute;
        bottom: 0;
        left: -65px;
        box-shadow: $base-shadow;
        //border: $border-thing;
    }

    .item-name {
        color: white;
        scale: 110%;
        margin: 0 auto 15px;
        font-weight: 500;
        width: max-content;
        text-shadow: 0px 0px 10px rgba(black, 0.7);
    }

    .overlay-message {
        scale: 110%;
        text-align: center;
        color: white;
        margin-bottom: 22px;
        text-shadow: 0px 0px 10px rgba(black, 0.7);
    }
</style>

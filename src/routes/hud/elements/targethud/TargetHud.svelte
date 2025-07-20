<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { expoInOut } from "svelte/easing";
    import { listen } from "../../../../integration/ws.js";
    import type { PlayerData } from "../../../../integration/types";
    import { REST_BASE } from "../../../../integration/host";
    import type { TargetChangeEvent } from "../../../../integration/events";
    import type { ClientPlayerDataEvent } from "../../../../integration/events";
    import { getPlayerData } from "../../../../integration/rest";
    import HealthProgress from "./HealthProgress.svelte";
    import ArmorStatus from "./ArmorStatus.svelte";
    import { onMount, tick } from "svelte";

    let target: PlayerData | null = null;
    let visible = true;

    let playerData: PlayerData | null = null;
    let maxAbsorption = 0;

    let hideTimeout: number;
    let showDamageEffect = false;

    let previousHealth = 0;

    let particles: { id: number, x: number, y: number, dx: number, dy: number }[] = [];
    let particleId = 0;

    let wrapperEl: HTMLDivElement | null = null;
    let avatarEl: HTMLDivElement | null = null;

    function updatePlayerData(s: PlayerData) {
        playerData = s;
        if (playerData.absorption <= 0) {
            maxAbsorption = 0;
        }
        if (playerData.absorption > maxAbsorption) {
            maxAbsorption = playerData.absorption;
        }
    }

    listen("clientPlayerData", (event: ClientPlayerDataEvent) => {
        updatePlayerData(event.playerData);
    });

    onMount(async () => {
        updatePlayerData(await getPlayerData());
    });

    function startHideTimeout() {
        hideTimeout = setTimeout(() => {
            visible = false;
        }, 750);
    }

    async function spawnParticles(count = 12) {
        await tick();
        if (!wrapperEl || !avatarEl) return;
        const wrapperRect = wrapperEl.getBoundingClientRect();
        const avatarRect = avatarEl.getBoundingClientRect();
        const centerX = avatarRect.left + avatarRect.width / 2 - wrapperRect.left;
        const centerY = avatarRect.top + avatarRect.height / 2 - wrapperRect.top;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = 60 + Math.random() * 20;
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;
            particles = [
                ...particles,
                { id: particleId++, x: centerX, y: centerY, dx, dy }
            ];
        }
        setTimeout(() => {
            particles = [];
        }, 400);
    }

    listen("targetChange", (data: TargetChangeEvent) => {
        target = data.target;
        visible = true;
        clearTimeout(hideTimeout);
        startHideTimeout();

        const newHealth = target!.actualHealth + target!.absorption;
        if (previousHealth !== 0 && newHealth < previousHealth) {
            showDamageEffect = true;
            spawnParticles();
            setTimeout(() => (showDamageEffect = false), 250);
        }
        previousHealth = newHealth;
    });

    startHideTimeout();
</script>

{#if visible && target != null}
    <div class="targethud-wrapper" bind:this={wrapperEl}>
        <div class="particles-container">
            {#each particles as p (p.id)}
                <div class="particle" style="left: {p.x}px; top: {p.y}px; --dx: {p.dx}px; --dy: {p.dy}px;"></div>
            {/each}
        </div>
        <div
            class="armor-stats"
            in:scale={{ duration: 300, easing: expoInOut }}
            out:scale={{ duration: 300, easing: expoInOut }}
        >
            {#if target.armorItems[3].count > 0}
                <ArmorStatus itemStack={target.armorItems[3]} />
            {/if}
            {#if target.armorItems[2].count > 0}
                <ArmorStatus itemStack={target.armorItems[2]} />
            {/if}
            {#if target.armorItems[1].count > 0}
                <ArmorStatus itemStack={target.armorItems[1]} />
            {/if}
            {#if target.armorItems[0].count > 0}
                <ArmorStatus itemStack={target.armorItems[0]} />
            {/if}
        </div>

        <div
            class="targethud"
            in:scale={{ duration: 300, easing: expoInOut }}
            out:scale={{ duration: 300, easing: expoInOut }}
        >
            <div class="avatar" bind:this={avatarEl}>
                {#if showDamageEffect}
                    <div class="damage-effect" out:fade={{ duration: 200 }}></div>
                {/if}
                <img
                    src="{REST_BASE}/api/v1/client/resource/skin?uuid={target.uuid}"
                    alt="avatar"
                />
            </div>
            <div class="name">{target.username}</div>
            <div class="heart-icon"></div>
            <div class="stats">
                <div class="health">
                    {Math.floor(target.actualHealth + target.absorption)}
                </div>
                <span class="wl">
                    {#if playerData !== null && playerData.health !== null}
                        {#if playerData.health + playerData.absorption > target.actualHealth + target.absorption}
                            <div class="winning">W</div>
                        {:else if playerData.health + playerData.absorption < target.actualHealth + target.absorption}
                            <div class="losing">L</div>
                        {:else}
                            <div class="draw">D</div>
                        {/if}
                    {/if}
                </span>
            </div>
            <HealthProgress
                maxHealth={target.maxHealth + target.absorption}
                health={target.actualHealth + target.absorption}
            />
        </div>
    </div>
{/if}

<style lang="scss">
    @use "../../../../colors.scss" as *;

    .targethud-wrapper {
        position: relative;
        width: 220px;
        padding-top: 15px; // для места под броню
        overflow: visible;
    }

    .armor-stats {
        position: absolute;
        top: 0;
        left: 10px;
        display: flex;
        gap: 6px;
        background: none;
        z-index: 10;
    }

    .targethud {
        width: 220px;
        background-color: rgba($base, 0.5);
        box-shadow: $base-shadow;
        border-radius: 12px;
        overflow: visible;
        padding-top: 1px;
        height: 70px;
        position: relative;
    }

    .name {
        color: $text;
        font-family: "rubik";
        font-weight: 400;
        position: absolute;
        left: 72px;
        top: 5px;
        width: 140px;
        height: 22px;
        font-size: 20px;
        overflow: hidden;
        white-space: nowrap;
        -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%);
        mask-image: linear-gradient(to right, black 80%, transparent 100%);
    }

    .heart-icon {
        width: 18px;
        height: 16px;
        position: absolute;
        left: 70px;
        top: 28px;
        background-color: $text;
        mask-image: url("/img/hud/targethud/icon-health.svg");
        mask-repeat: no-repeat;
        mask-size: contain;
        mask-position: center;
        -webkit-mask-image: url("/img/hud/targethud/icon-health.svg");
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: contain;
        -webkit-mask-position: center;
    }

    .stats {
        width: 136px;
        position: absolute;
        left: 77px;
        top: 26px;
        color: $text;
        display: grid;
        grid-template-areas: "a b";

        .health {
            grid-area: a;
            overflow: hidden;
            font-size: 18px;
            font-family: "inter";
            margin-left: 10px;
        }

        .wl {
            grid-area: b;
            font-size: 15px;
            padding-top: 1px;
            text-align: right;
            font-family: "inter";

            .winning {
                color: green;
                filter: grayscale(50%);
            }

            .losing {
                color: red;
                filter: grayscale(50%);
            }

            .draw {
                color: orange;
                filter: grayscale(50%);
            }
        }
    }

    .avatar {
        margin: 7.16px;
        left: 3.25px;
        top: 2.5px;
        scale: 125.297%;
        height: 50px;
        width: 50px;
        position: relative;
        image-rendering: pixelated;
        background-image: url("/img/steve.png");
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 8px;
        padding-left: 11px;
        padding-top: 11px;
        pointer-events: none;
        overflow: hidden;

        img {
            position: absolute;
            scale: 6.5;
            left: 122.5px;
            top: 122.5px;
            z-index: 1;
        }

        .damage-effect {
            z-index: 10;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(red, 0.4);
            border-radius: 9px;
        }
    }

    .particles-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 30;
    }

    .particle {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: $particle;
        pointer-events: none;
        animation: particle-fly 0.4s linear forwards;
        z-index: 20;
        filter: blur(2px);
    }

    @keyframes particle-fly {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        80% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(0.5);
        }
    }
</style>

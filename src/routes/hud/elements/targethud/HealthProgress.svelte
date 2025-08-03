<script lang="ts">
    import thWidth from "./TargetHud.svelte";
    import { onMount, tick, onDestroy } from "svelte";

    export let maxHealth: number;
    export let health: number;

    let width = Math.ceil((health / maxHealth) * 100);
    $: width = Math.ceil((health / maxHealth) * 100);

    let prevWidth = width;
    let particles: { id: number, x: number, y: number, dx: number, dy: number, size: number, expiresAt: number }[] = [];
    let particleId = 0;

    $: if (width < prevWidth) {
        spawnHealthParticles(prevWidth - width);
        prevWidth = width;
    }

    function spawnHealthParticles(amount: number) {
        const count = 8 + Math.floor(Math.random() * 7);
        const now = Date.now();
        for (let i = 0; i < count; i++) {
            const angle = (Math.random() * (-Math.PI / 4));
            const speed = 22 + Math.random() * 175;
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;
            const size = 5 + Math.random() * 5;
            particles = [
                ...particles,
                {
                    id: particleId++,
                    x: width,
                    y: 0,
                    dx,
                    dy,
                    size,
                    expiresAt: now + 1500
                }
            ];
        }
    }

    const PARTICLE_INTERVAL = 50;
    let particleTimer: any;

    onMount(() => {
        particleTimer = setInterval(() => {
            const now = Date.now();
            particles = particles.filter(p => p.expiresAt > now);
        }, PARTICLE_INTERVAL);
    });

    onDestroy(() => {
        clearInterval(particleTimer);
    });
</script>

<div class="health-progress">
    <div class="thumb" style="width: {width}%;">
        <div class="thumb2" style="width: {width}%;"></div>
        <div class="thumb3" style="width: {width}%;"></div>
    </div>
    {#each particles as p (p.id)}
        <div class="hp-particle" style="left: calc({p.x}%); top: {p.y}px; --dx: {p.dx}px; --dy: {p.dy}px; width: {p.size}px; height: {p.size}px;"></div>
    {/each}
</div>

<style lang="scss">
    @use "../../../../colors.scss" as *;

    .health-progress {
        position: relative;
        border-radius: 6px;
        max-width: 141px;
        overflow: visible;
        background-color: rgba($base,0.2);
        box-shadow: $y-shadow;
        z-index: 20;
    }

    .thumb {
        height: 14.75px;
        background: linear-gradient(to right, $yo, $yo2);
        transition: ease-out width 0.3s;
        border-radius: 6px;
        z-index: 1;

        .thumb2 {
            position: absolute;
            height: 14.75px;
            transition: ease-out width 0.6s;
            border-radius: 6px;
            background-color: $yo2;
            z-index: -1;
        }

        .thumb3 {
            position: absolute;
            height: 14.75px;
            border-radius: 6px;
            background-color: $yo;
            z-index: -2;
        }
    }

    .hp-particle {
        position: absolute;
        border-radius: 50%;
        background: $healthprogress-particle;
        pointer-events: none;
        animation: hp-particle-fly 1.5s linear forwards;
        z-index: 30;
        filter: blur(2px) drop-shadow(0 0 8px $healthprogress-particle);
    }

    @keyframes hp-particle-fly {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        80% {
            opacity: 1;
            transform: translate(calc(var(--dx) * 0.8), calc(var(--dy) * 0.8)) scale(0.5);
        }
        100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(0);
        }
    }
</style>
<script lang="ts">
    import { onMount, tick } from "svelte";
    import type { Module } from "../../../integration/types";
    import { getModules } from "../../../integration/rest";
    import { listen } from "../../../integration/ws";
    import { getTextWidth } from "../../../integration/text_measurement";
    import { flip } from "svelte/animate";
    import { fly } from "svelte/transition";
    import { convertToSpacedString, spaceSeperatedNames } from "../../../theme/theme_config";

    let enabledModules: Module[] = [];

    async function updateEnabledModules() {
        const modules = await getModules();
        const visibleModules = modules.filter(m => m.enabled && !m.hidden);

        const modulesWithWidths = visibleModules.map(module => {
            let formattedName = $spaceSeperatedNames ? convertToSpacedString(module.name) : module.name;
            let fullName = module.tag == null ? formattedName : formattedName + " " + module.tag;

            return {
                ...module,
                width: getTextWidth(fullName, "500 14px redhattext")
            };
        });

        modulesWithWidths.sort((a, b) => b.width - a.width);

        enabledModules = modulesWithWidths;
        await tick();
    }

    spaceSeperatedNames.subscribe(async () => {
        await updateEnabledModules();
    });

    onMount(async () => {
        await updateEnabledModules();
        requestAnimationFrame(arraylistGradient);
    });

    listen("moduleToggle", async () => {
        await updateEnabledModules();
    });

    listen("refreshArrayList", async () => {
        await updateEnabledModules();
    });

    let progress = 0;
    const speed = 0.020;

    interface RGBColor {
        r: number;
        g: number;
        b: number;
    }

    function getRgb(color: string): RGBColor {
        const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) throw new Error(`Invalid color format: ${color}`);
        return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3])
        };
    }

    function colorInterpolate(colorA: string, colorB: string, interpolation: number): RGBColor {
        const rgbA = getRgb(colorA);
        const rgbB = getRgb(colorB);

        interpolation = Math.min(1, Math.max(0, interpolation));

        const interp = (key: keyof RGBColor) =>
            Math.round(rgbA[key] * (1 - interpolation) + rgbB[key] * interpolation);

        return {
            r: interp("r"),
            g: interp("g"),
            b: interp("b")
        };
    }

    function arraylistGradient() {
        const list = document.querySelector(".arraylist");
        if (!list) return;
        const colorTop = getComputedStyle(document.documentElement).getPropertyValue("--arraylist-color-top").trim();
        const colorBottom = getComputedStyle(document.documentElement).getPropertyValue("--arraylist-color-bottom").trim();
        const children = list.children as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < children.length; i++) {
            let percent = children.length === 1 ? 0 : i / (children.length - 1) - progress;
            percent = ((percent % 1) + 1) % 1;
            const rgb = colorInterpolate(colorTop, colorBottom, percent);
            const el = children[i];
            el.style.color = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            el.style.borderLeft = `2px solid rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            el.style.textShadow = `0 0 6px rgba(${rgb.r},${rgb.g},${rgb.b},0.9),0 0 12px rgba(${rgb.r},${rgb.g},${rgb.b},0.8),0 0 24px rgba(${rgb.r},${rgb.g},${rgb.b},0.6)`;
        }
        progress += speed;
        if (progress >= 1) progress = 0;
        requestAnimationFrame(arraylistGradient);
    }
</script>

<div class="arraylist">
    {#each enabledModules as { name, tag } (name)}
        <div class="module" animate:flip={{ duration: 200 }} transition:fly={{ x: 50, duration: 200 }}>
            {$spaceSeperatedNames ? convertToSpacedString(name) : name}
            {#if tag}
                <span class="tag"> {tag}</span>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
  @use "../../../colors.scss" as *;

  :root {
    --arraylist-color-top: #{$a1};
    --arraylist-color-bottom: #{$a2};
  }

  .arraylist {
    display: flex;
    flex-direction: column;
  }

  .module {
    background-color: rgba($base, 0.6);
    color: $text;
    font-size: 14px;
    border-radius: 0 12px 12px 0;
    padding: 5px 8px;
    width: max-content;
    font-weight: 500;
    font-family: "redhattext";
    margin-right: auto;
    transition: color 0.2s linear, border-left 0.2s linear, text-shadow 0.2s linear;
    border-left: 2px solid white;
    box-shadow: $shadow-arraylist;
  }

  .tag {
    color: #AAAAAA;
    text-shadow:
        0 0 6px rgba(#AAAAAA, 0.9),
        0 0 12px rgba(#AAAAAA, 0.8),
        0 0 24px rgba(#AAAAAA, 0.6);
    }
</style>

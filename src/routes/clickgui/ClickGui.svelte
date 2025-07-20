<script lang="ts">
    import {onMount} from "svelte";
    import FlyingParticles from "../hud/elements/FlyingParticles.svelte";
    import {getGameWindow, getModules, getModuleSettings, setTyping} from "../../integration/rest";
    import {groupByCategory} from "../../integration/util";
    import type {ConfigurableSetting, GroupedModules, Module, TogglableSetting} from "../../integration/types";
    import Panel from "./Panel.svelte";
    import Search from "./Search.svelte";
    import Description from "./Description.svelte";
    import {fade} from "svelte/transition";
    import {listen} from "../../integration/ws";
    import type {ClickGuiValueChangeEvent, ScaleFactorChangeEvent} from "../../integration/events";
    import {gridSize, scaleFactor, showGrid, snappingEnabled} from "./clickgui_store";

    let categories: GroupedModules = {};
    let modules: Module[] = [];
    let minecraftScaleFactor = 2;
    let clickGuiScaleFactor = 1;
    $: {
        scaleFactor.set(minecraftScaleFactor * clickGuiScaleFactor);
    }

    function applyValues(configurable: ConfigurableSetting) {
        clickGuiScaleFactor = configurable.value.find(v => v.name === "Scale")?.value as number ?? 1;

        const snappingValue = configurable.value.find(v => v.name === "Snapping") as TogglableSetting;

        $snappingEnabled = snappingValue?.value.find(v => v.name === "Enabled")?.value as boolean ?? true;
        $gridSize = snappingValue?.value.find(v => v.name === "GridSize")?.value as number ?? 10;
    }

    onMount(async () => {
        const gameWindow = await getGameWindow();
        minecraftScaleFactor = gameWindow.scaleFactor;

        modules = await getModules();
        categories = groupByCategory(modules);

        const clickGuiSettings = await getModuleSettings("ClickGUI");
        applyValues(clickGuiSettings);

        await setTyping(false);
    });

    listen("scaleFactorChange", (e: ScaleFactorChangeEvent) => {
        minecraftScaleFactor = e.scaleFactor;
    });

    listen("clickGuiValueChange", (e: ClickGuiValueChangeEvent) => {
        applyValues(e.configurable);
    });
</script>

<div class="clickgui" class:grid={$showGrid} transition:fade|global={{duration: 200}}
     style="transform: scale({$scaleFactor * 50}%); width: {2 / $scaleFactor * 100}vw; height: {2 / $scaleFactor * 100}vh;
     background-size: {$gridSize}px {$gridSize}px;">
    <Description/>
    <Search modules={structuredClone(modules)}/>

    {#each Object.entries(categories) as [category, modules], panelIndex}
        <Panel {category} {modules} {panelIndex}/>
    {/each}
</div>
<div class="cat-container">
  <img class="watermark" src="img/hud/taco/cat.png" alt="watermark" />
  <div class="particles">
  <FlyingParticles />
  </div>
</div>

<style lang="scss">
@use "../../colors.scss" as *;

.cat-container {
  position: absolute;
  bottom: 0;
  left: -35px;
  width: 200px;
  height: 200px;
  pointer-events: none;
}

.watermark {
  width: 100%;
  position: relative;
  z-index: 2;
}

$GRID_SIZE: 10px;

.clickgui {
    overflow: hidden;
    background-color: rgba($clickgui-base-color, 0.6);
    position: absolute;
    will-change: opacity;
    transform-origin: top left;
    left: 0;
    top: 0;
    z-index: -9999;

&.grid {
    background-image: linear-gradient(to right, rgba(100, 100, 100, 0.2) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(100, 100, 100, 0.2) 1px, transparent 1px);
}
}
</style>

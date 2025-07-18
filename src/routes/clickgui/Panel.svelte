<script lang="ts">
    import {onMount} from "svelte";
    import type {Module as TModule} from "../../integration/types";
    import {listen} from "../../integration/ws";
    import Module from "./Module.svelte";
    import type {ModuleToggleEvent} from "../../integration/events";
    import {fade} from "svelte/transition";
    import {quintOut} from "svelte/easing";
    import {
        gridSize,
        highlightModuleName,
        maxPanelZIndex,
        scaleFactor,
        showGrid,
        snappingEnabled
    } from "./clickgui_store";
    import {setItem} from "../../integration/persistent_storage";

    export let category: string;
    export let modules: TModule[];
    export let panelIndex: number;

    let panelElement: HTMLElement;
    let modulesElement: HTMLElement;

    let moving = false;
    let offsetX = 0;
    let offsetY = 0;

    let scrollPositionSaveTimeout: number | undefined;

    const panelConfig = loadPanelConfig();

    let ignoreGrid = false;

    interface PanelConfig {
        top: number;
        left: number;
        expanded: boolean;
        scrollTop: number;
        zIndex: number;
    }

    function clamp(number: number, min: number, max: number) {
        return Math.max(min, Math.min(number, max));
    }

    function loadPanelConfig(): PanelConfig {
        const localStorageItem = localStorage.getItem(
            `clickgui.panel.${category}`,
        );

        if (!localStorageItem) {
            return {
                top: panelIndex * 50 + 20,
                left: 20,
                expanded: false,
                scrollTop: 0,
                zIndex: 0
            };
        } else {
            const config: PanelConfig = JSON.parse(localStorageItem);

            // Migration
            if (!config.zIndex) {
                config.zIndex = 0;
            }

            if (config.zIndex > $maxPanelZIndex) {
                $maxPanelZIndex = config.zIndex;
            }

            return config;
        }
    }

    async function savePanelConfig() {
        await setItem(
            `clickgui.panel.${category}`,
            JSON.stringify(panelConfig),
        );
    }

    function fixPosition() {
        panelConfig.left = clamp(panelConfig.left, 0, document.documentElement.clientWidth * (2 / $scaleFactor) - panelElement.offsetWidth);
        panelConfig.top = clamp(panelConfig.top, 0, document.documentElement.clientHeight * (2 / $scaleFactor) - panelElement.offsetHeight);
    }

    function onMouseDown(e: MouseEvent) {
        if (e.button !== 0 && e.button !== 1) return;

        moving = true;
        offsetX = e.clientX * (2 / $scaleFactor) - panelConfig.left;
        offsetY = e.clientY * (2 / $scaleFactor) - panelConfig.top;
        panelConfig.zIndex = ++$maxPanelZIndex;
        $showGrid = $snappingEnabled;
    }

    function onMouseMove(e: MouseEvent) {
        if (moving) {
            const newLeft = (e.clientX * (2 / $scaleFactor) - offsetX);
            const newTop = (e.clientY * (2 / $scaleFactor) - offsetY);

            panelConfig.left = snapToGrid(newLeft);
            panelConfig.top = snapToGrid(newTop);

            fixPosition();
        }
    }

    function onMouseUp() {
        if (moving) {
            savePanelConfig();
        }
        moving = false;
        $showGrid = false;
    }

    function toggleExpanded() {
        panelConfig.expanded = !panelConfig.expanded;
        fixPosition();
        savePanelConfig();
    }

    function handleModulesScroll() {
        panelConfig.scrollTop = modulesElement.scrollTop;

        if (scrollPositionSaveTimeout !== undefined) {
            clearTimeout(scrollPositionSaveTimeout);
        }
        scrollPositionSaveTimeout = setTimeout(() => {
            savePanelConfig();
        }, 500)
    }

    highlightModuleName.subscribe((name) => {
        const highlightModule = modules.find(
            (m) => m.name === name,
        );
        if (highlightModule) {
            panelConfig.zIndex = ++$maxPanelZIndex;
            panelConfig.expanded = true;
            savePanelConfig();
        }
    });

    listen("moduleToggle", (e: ModuleToggleEvent) => {
        const moduleName = e.moduleName;
        const moduleEnabled = e.enabled;

        const mod = modules.find((m) => m.name === moduleName);
        if (!mod) return;

        mod.enabled = moduleEnabled;
        modules = modules;
    });

    onMount(() => {
        if (!modulesElement) {
            return;
        }

        modulesElement.scrollTo({
            top: panelConfig.scrollTop,
            behavior: "smooth"
        });
    });

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Shift") {
            ignoreGrid = true;
        }
    }

    function handleKeyup(e: KeyboardEvent) {
        if (e.key === "Shift") {
            ignoreGrid = false;
        }
    }

    function snapToGrid(value: number): number {
        if (ignoreGrid || !$snappingEnabled) return value;

        return Math.round(value / $gridSize) * $gridSize;
    }
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} on:keydown={handleKeydown} on:keyup={handleKeyup}/>

<div
        class="panel"
        style="left: {panelConfig.left}px; top: {panelConfig.top}px; z-index: {panelConfig.zIndex};"
        bind:this={panelElement}
        transition:fade|global={{duration: 200, easing: quintOut}}
>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
            class="title"
            on:mousedown={onMouseDown}
            on:contextmenu|preventDefault={toggleExpanded}
    >
        <img
                class="icon"
                src="img/clickgui/icon-{category.toLowerCase()}.svg"
                alt="icon"
        />
        <span class="category">{category}</span>
    </div>

    <div
            class="modules"
            style="max-height: {panelConfig.expanded ? '545px' : '0'}"
            on:scroll={handleModulesScroll}
            bind:this={modulesElement}
    >
        {#each modules as {name, enabled, description, aliases} (name)}
            <Module {name} {enabled} {description} {aliases}/>
        {/each}
    </div>
</div>

<style lang="scss">
  @use "../../colors.scss" as *;

  .panel {
    border-radius: 25px;
    width: 250px;
    position: absolute;
    overflow: hidden;
    box-shadow: 0 0 10px rgba($clickgui-base-color, 0.5);
    will-change: transform;
    transition: none;
    user-select: none;
    align-items: center;
  }

  .title {
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
    column-gap: 12px;
    background-color: rgba($clickgui-base-color, 0.8);
    padding: 10px 15px;
    text-align: center;
    height: 40px;
    cursor: grab;

    .category {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 18px;
        color: $clickgui-text-color;
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none; // чтобы не мешал drag
    }
  }

  .modules {
    transition: max-height 300ms ease-in-out;
    scroll-behavior: smooth;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: rgba($clickgui-base-color, 0.8);
  }

  .modules::-webkit-scrollbar {
    width: 0;
  }
</style>
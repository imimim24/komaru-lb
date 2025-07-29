<script lang="ts">
    import MainButton from "./buttons/MainButton.svelte";
    import ButtonContainer from "../common/buttons/ButtonContainer.svelte";
    import IconTextButton from "../common/buttons/IconTextButton.svelte";
    import {onDestroy} from 'svelte';
    import {
        exitClient,
        openScreen,
        toggleBackgroundShaderEnabled
    } from "../../../integration/rest";
    import Menu from "../common/Menu.svelte";
    import {fly} from "svelte/transition";

    let regularButtonsShown = true;
    let clientButtonsShown = false;

    function toggleButtons() {
        if (clientButtonsShown) {
            clientButtonsShown = false;
            setTimeout(() => {
                regularButtonsShown = true;
            }, 750);
        } else {
            regularButtonsShown = false;
            setTimeout(() => {
                clientButtonsShown = true;
            }, 750);
        }
    }
    //clock from jellobounce
    let currentTime: string;

    function updateTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    const interval = setInterval(updateTime, 10);

    onDestroy(() => {
        clearInterval(interval);
    });

    updateTime();
</script>

<Menu>
<div class="content">
    <div class="clock" transition:fly|global={{duration: 500, y: -100}}>{currentTime}</div>
    <div class="main-buttons">
        {#if regularButtonsShown}
            <MainButton title="Singleplayer" index={0}
                        on:click={() => openScreen("singleplayer")}/>

            <MainButton title="Multiplayer" index={1}
                        on:click={() => openScreen("multiplayer")}/>

            <MainButton title="Realms" index={2}
                        on:click={() => openScreen("multiplayer_realms")}/>

            <MainButton title="LiquidBounce" on:click={toggleButtons} index={3}/>

            <MainButton title="Options" on:click={() => openScreen("options")} index={4}/>

        {:else if clientButtonsShown}
            <MainButton title="Proxy Manager" on:click={() => openScreen("proxymanager")} index={0}/>
            <MainButton title="Click GUI" on:click={() => openScreen("clickgui")} index={1}/>
            <MainButton title="Back" on:click={toggleButtons} index={2}/>
        {/if}
    </div>

    <div class="additional-buttons" transition:fly|global={{duration: 700, y: 100}}>
        <ButtonContainer>
            <IconTextButton title="Exit" on:click={exitClient}/>
            <IconTextButton title="Click Me!"
                            on:click={toggleBackgroundShaderEnabled}/>
        </ButtonContainer>
    </div>
</div>
</Menu>

<style>
.clock {
    position: absolute;
    top: -0px;
    color: white;
    font-family: "inter";
    opacity: 0.8;
	text-shadow: 0 0 25px #000;
    font-size: 250px;
    font-weight: 800;
    text-align: center;
    z-index: 10;
    pointer-events: none;
}


.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 60px;
    position: relative;
    padding-bottom: 90px;
}

.main-buttons {
    display: flex;
    flex-direction: column;
    row-gap: 25px;
    align-items: center;
    margin-top: 40px;
}

.additional-buttons {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    pointer-events: auto;
}
</style>

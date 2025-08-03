<script lang="ts">
    export let maxHealth: number;
    export let absorption: number;

    let width = Math.ceil((absorption / maxHealth) * 100);
    $: width = Math.ceil((absorption / maxHealth) * 100);
</script>

<div class="absorption-progress overlay-bar">
    <div class="thumb" style="width: {width}%;">
        <div class="thumb2" style="width: {width}%;"></div>
        <div class="thumb3" style="width: {width}%;"></div>
    </div>
</div>

<style lang="scss">
    @use "../../../../colors.scss" as *;

    .absorption-progress {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 6px;
        pointer-events: none;
        z-index: 21;
    }

    .overlay-bar {
    }

    .thumb {
        height: 14.75px;
        background: linear-gradient(to right, #ffe066, #fffbe6);
        transition: ease-out width 0.3s;
        border-radius: 6px;
        z-index: 1;

        .thumb2 {
            position: absolute;
            height: 14.75px;
            transition: ease-out width 0.6s;
            border-radius: 6px;
            background-color: #fffbe6;
            z-index: -1;
        }

        .thumb3 {
            position: absolute;
            height: 14.75px;
            border-radius: 6px;
            background-color: #ffe066;
            z-index: -2;
        }
    }
</style>

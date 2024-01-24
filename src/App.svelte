<script lang="ts">
    import {Application} from "pixi.js";
    import WorldGrid from "./WorldGrid.svelte";
    import Slider from "./Slider";

    const screenWidth = 1200;
    const screenHeight = 800;

    const app = new Application<HTMLCanvasElement>({width: screenWidth, height: screenHeight});
    let worldGrid: WorldGrid;

    app.stage.addChild(Slider([0, 600], [600, 50], [1, 40]))
    app.stage.addChild(Slider([0, 700], [800, 50], [1, 20]))

    let appElement = document.getElementById("app");
    appElement!.appendChild(app.view);

    //setInterval(() => {update()}, 10000);
</script>

<div id="menu">
    <button on:click={() => worldGrid.createGrid(10, 10, "metal")}>Generate</button>
    <button on:click={() => worldGrid.update()}>Update</button>
</div>
<WorldGrid displayDimensions="{[screenWidth, screenHeight - 200]}" gridDimensions="{[20, 10]}"
           {app} bind:this={worldGrid}/>

<style>
    #menu {
        display: flex;
    }
</style>

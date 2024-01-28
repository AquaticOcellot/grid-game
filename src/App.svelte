<script lang="ts">
    import {Application} from "pixi.js";
    import WorldGrid from "./WorldGrid";
    import Slider from "./Slider";
    import World from "./world";
    import randomData from "./randomData";

    const screenWidth = 1200;
    const screenHeight = 800;

    const app = new Application<HTMLCanvasElement>({width: screenWidth, height: screenHeight});

    let world: World;
    let worldGrid: WorldGrid;

    let slider1 = {"value": 0};
    let slider2 = {"value": 0};
    app.stage.addChild(Slider([0, 600], [600, 50], [1, 40], slider1))
    app.stage.addChild(Slider([0, 700], [800, 50], [1, 20], slider2))

    let appElement = document.getElementById("app");
    appElement!.appendChild(app.view);

    //setInterval(() => {update()}, 10000);

    function createWorld() {
        if (worldGrid) {
            worldGrid.spriteGrid.removeFromParent();
        }
        world = new World(randomData([slider1.value, slider2.value]));
        worldGrid = new WorldGrid(world, [screenWidth, screenHeight - 200], "metal")
        app.stage.addChild(worldGrid.spriteGrid)
    }
</script>

<div id="menu">
    <button on:click={createWorld}>Generate</button>
</div>

<style>
    #menu {
        display: flex;
    }
</style>

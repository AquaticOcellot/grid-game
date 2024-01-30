<script lang="ts">
    import {Application, Container} from "pixi.js";
    import Slider from "./Slider";
    import World from "./world";
    import randomData from "./randomData";
    import {createWorld, update, test} from "./ecs";
    import * as PIXI from "pixi.js";

    const screenWidth = 1200;
    const screenHeight = 800;

    const app = new Application<HTMLCanvasElement>({width: screenWidth, height: screenHeight});

    let world: World;

    let slider1 = {"value": 0};
    let slider2 = {"value": 0};
    app.stage.addChild(Slider([0, 600], [600, 50], [1, 100], slider1))
    app.stage.addChild(Slider([0, 700], [800, 50], [1, 50], slider2))

    let appElement = document.getElementById("app");
    appElement!.appendChild(app.view);

    //setInterval(() => {update()}, 10000);

    let worldGraphic: Container
    function initialize() {
        world = new World(randomData([slider1.value, slider2.value]));

        setupAssets()
        if (worldGraphic) {
            worldGraphic.removeFromParent()
        }
        getAsset("metal").then((res) => {
            worldGraphic = createWorld(world, [screenWidth, screenHeight - 200], res)
            app.stage.addChild(worldGraphic)
            test()
        })
    }

    function setupAssets() {
        PIXI.Assets.add({
            alias: "metal",
            src: "/src/assets/metal.png"
        });
    }

    function getAsset(alias:string) {
        return PIXI.Assets.load(alias)
    }
</script>

<div id="menu">
    <button on:click={initialize}>Generate</button>
    <button on:click={update}>Update</button>
    <button on:click={() => {setInterval(update, 100)}}>Auto Update</button>
</div>

<style>
    #menu {
        display: flex;
    }
</style>

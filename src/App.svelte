<script lang="ts">
    import {Application, Container} from "pixi.js"
    import World from "./world"
    import randomData from "./randomData"
    import {createWorld, update, test} from "./ecs"
    import * as PIXI from "pixi.js"
    import Menu from "./Menu";

    const screenWidth = 1200
    const screenHeight = 800

    const app = new Application<HTMLCanvasElement>({width: screenWidth, height: screenHeight})

    let options = {
        gridWidth: {value: 20},
        gridHeight: {value: 10},
        generateFunction: initialize,
        manualUpdateFunction: update,
        autoUpdate: {value: false},
    }
    let menu = Menu([100, 600], options)
    app.stage.addChild(menu)

    let appElement = document.getElementById("app");
    appElement!.appendChild(app.view)

    let worldGraphic: Container
    setupAssets()
    function initialize() {
        let world = new World(randomData([options.gridWidth.value, options.gridHeight.value]))

        if (worldGraphic) {
            worldGraphic.removeFromParent()
        }
        getAsset("metal").then((res) => {
            worldGraphic = createWorld(world, [screenWidth, screenHeight - 200], res)
            app.stage.addChild(worldGraphic)
            test()
        })
    }
    setInterval(autoUpdate, 100)

    function setupAssets() {
        PIXI.Assets.add({
            alias: "metal",
            src: "metal.png"
        });
    }

    function getAsset(alias:string) {
        return PIXI.Assets.load(alias)
    }

    function autoUpdate() {
        if (options.autoUpdate) {
            update()
        }
    }
</script>

<style>

</style>

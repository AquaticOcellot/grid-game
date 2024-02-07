<script lang="ts">
    import {Application, Container} from "pixi.js"
    import World from "./world"
    import randomData from "./randomData"
    import {createWorld, update, test} from "./ecs"
    import * as PIXI from "pixi.js"
    import Menu from "./Menu";
    import Sidebar from "./Sidebar";

    const screenWidth = 1600
    const screenHeight = 900

    const app = new Application<HTMLCanvasElement>({width: screenWidth, height: screenHeight, resizeTo: window})

    let options = {
        gridWidth: {value: 20},
        gridHeight: {value: 10},
        generateFunction: initialize,
        manualUpdateFunction: update,
        autoUpdate: {value: false},
    }
    let menu = Menu([0, screenHeight - 200], options)
    app.stage.addChild(menu)

    let sidebar = Sidebar([1300, 0])
    app.stage.addChild(sidebar)

    let appElement = document.getElementById("app");
    appElement!.appendChild(app.view)

    let worldGraphic: Container
    setupAssets()

    window.onresize = () => {
        resize()
    }

    function initialize() {
        let world = new World(randomData([options.gridWidth.value, options.gridHeight.value]))

        if (worldGraphic) {
            worldGraphic.removeFromParent()
        }
        getAsset("metal").then((res) => {
            worldGraphic = createWorld(world, [screenWidth - 300, screenHeight - 200], res)
            app.stage.addChild(worldGraphic)
            test()
        })
        resize()
    }
    setInterval(autoUpdate, 100)

    function resize(): void {
        let scale = Math.min(app.view.width / screenWidth, app.view.height / screenHeight)
        app.stage.scale.set(scale)
    }

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
        if (options.autoUpdate.value) {
            update()
        }
    }
</script>

<style>

</style>

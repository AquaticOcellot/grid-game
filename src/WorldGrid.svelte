<script lang="ts">
    import * as PIXI from "pixi.js";
    import World from "./world";

    export let displayDimensions: number[];
    export let gridDimensions: number[];
    export let app: PIXI.Application;

    const worldData:string[][] = [
        ["heat", "wall", "wall"],
        ["wall", "    ", "wall"],
        ["    ", "sink", "wall"],
    ]
    let world: World = new World(worldData);

    setupAssets()
    createGrid(gridDimensions[0], gridDimensions[1], "metal");

    function setupAssets() {
        PIXI.Assets.add({
            alias: "metal",
            src: "src/assets/metal.png"
        });
    }

    function getAsset(alias:string) {
        return PIXI.Assets.load(alias)
    }

    async function createGrid(width: number, height: number, alias: string) {
        let scale = Math.min(
            (displayDimensions[0]) / (width * 256),
            (displayDimensions[1]) / (height * 256),
        );
        console.log(scale);
        let spriteGrid = new PIXI.Container();
        for (let rowIndex = 0; rowIndex < height; rowIndex++){
            let spriteRow = new PIXI.Container();
            for (let cellIndex = 0; cellIndex < width; cellIndex++){
                getAsset(alias).then((res) => {
                    const sprite = PIXI.Sprite.from(res);
                    sprite.x = cellIndex * 256 * scale;
                    sprite.y = rowIndex * 256 * scale;
                    sprite.scale.set(scale);
                    sprite.tint = "0x"
                        + generateHexPart(32, 255)
                        + generateHexPart(64, 128)
                        + generateHexPart(128, 255);

                    if (world.cells[rowIndex] && world.cells[rowIndex][cellIndex]) {
                        if (world.cells[rowIndex][cellIndex].name == "wall") {
                            sprite.tint = 0xFFFFFF;
                        }
                    }

                    spriteRow.addChild(sprite);
                });
            }
            spriteGrid.addChild(spriteRow);
        }
        app.stage.addChild(spriteGrid);
    }

    export function update() {
        world.update();
        updateRender();
    }

    function updateRender() {
        for (let rowIndex = 0; rowIndex < world.cells.length; rowIndex++) {
            for (let cellIndex = 0; cellIndex < world.cells[rowIndex].length; cellIndex++){
                let cell = world.cells[rowIndex][cellIndex];
                if (["wall", "heat", "sink"].includes(cell.name)) {
                    let cellSprite = app.stage.children[0].children![rowIndex].children![cellIndex];
                    (<PIXI.Sprite>cellSprite).tint = world.cells[rowIndex][cellIndex].heat / 256 * 0xFFFFFF;
                }
            }
        }
    }

    function generateHexPart(min: number, max: number) {
        let part = undefined;
        let generated = Math.floor(min + (max - min) * Math.random());
        if (generated == 0) {
            part = "00";
        }
        if (0 < generated && generated < 0x10) {
            part = "0" + generated.toString(16);
        }
        else {
            part = generated.toString(16);
        }
        return part;
    }
</script>
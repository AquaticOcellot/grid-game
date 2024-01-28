import * as PIXI from "pixi.js";
import World from "./world";

export default class WorldGrid {
    spriteGrid: PIXI.Container;
    scale: number;
    constructor(world: World, displayDimensions: number[], material: string) {
        this.spriteGrid = new PIXI.Container();
        setupAssets();

        this.scale = Math.min(
            (displayDimensions[0]) / (world.width * 256),
            (displayDimensions[1]) / (world.height * 256),
        );
        for (let rowIndex = 0; rowIndex < world.height; rowIndex++){
            let spriteRow = new PIXI.Container();
            for (let cellIndex = 0; cellIndex < world.width; cellIndex++){
                getAsset(material).then((res) => {
                    const sprite = PIXI.Sprite.from(res);
                    sprite.x = cellIndex * 256 * this.scale;
                    sprite.y = rowIndex * 256 * this.scale;
                    sprite.scale.set(this.scale);
                    sprite.tint = "0x"
                        + generateHexPart(32, 64)
                        + generateHexPart(32, 64)
                        + generateHexPart(32, 64);

                    if (world.cells[rowIndex] && world.cells[rowIndex][cellIndex]) {
                        switch (world.cells[rowIndex][cellIndex].name) {
                            case "wall": {
                                sprite.tint = 0x999999;
                                break;
                            }
                            case "heat": {
                                sprite.tint = 0xFF9999;
                                break
                            }
                            case "sink": {
                                sprite.tint = 0x00FFFF;
                            }
                        }
                    }

                    spriteRow.addChild(sprite);
                });
            }
            this.spriteGrid.addChild(spriteRow);
        }
    }

   update() {
        //updateRender();
    }
}

function setupAssets() {
    PIXI.Assets.add({
        alias: "metal",
        src: "src/assets/metal.png"
    });
}

function getAsset(alias:string) {
    return PIXI.Assets.load(alias)
}

function generateHexPart(min: number, max: number) {
    let part: string;
    let generated = Math.floor(min + (max - min) * Math.random());
    if (generated == 0) {
        return "00";
    }
    if (0 < generated && generated < 0x10) {
        part = "0" + generated.toString(16);
    }
    else {
        part = generated.toString(16);
    }
    return part;
}
/*
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
*/
import * as PIXI from "pixi.js"
import Slider from "./Slider";
import Button from "./Button";
import SwitchButton from "./SwitchButton";
export default ((coordinates: number[], options: any) : PIXI.Container => {
    let container = new PIXI.Container()
    container.position.set(coordinates[0], coordinates[1])

    let background = new PIXI.Graphics()
        .beginFill(0x111111).drawRect(0, 0, 100, 100)

    let widthSlider = Slider([0, 0], [600, 50], [1, 100], options.gridWidth)
    let heightSlider = Slider([0, 50], [800, 50], [1, 50], options.gridHeight)

    let generateButton = Button("Generate", options.generateFunction,[0, 100])
    let manualUpdate = Button("Manual update", options.manualUpdateFunction,
        [generateButton.x + generateButton.width + 10, generateButton.y])
    let autoUpdate = SwitchButton("Auto update", options.autoUpdate,
        [manualUpdate.x + manualUpdate.width + 10, manualUpdate.y])

    container.addChild(background, widthSlider, heightSlider, generateButton, manualUpdate, autoUpdate)



    return container
})
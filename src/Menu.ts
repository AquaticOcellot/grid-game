import * as PIXI from "pixi.js"
import Slider from "./Slider";
import Button from "./Button";
import SwitchButton from "./SwitchButton";

const margin = 10
const widthSliderDimensions = [600, 50]
const heightSliderDimensions = [800, 50]

export default ((coordinates: number[], options: any) : PIXI.Container => {
    let widthSlider = Slider([0, 0],
        widthSliderDimensions, [1, 100], options.gridWidth)
    let heightSlider = Slider([widthSlider.x, widthSlider.height + margin],
        heightSliderDimensions, [1, 50], options.gridHeight)

    let generateButton = Button("Generate", options.generateFunction,
        [heightSlider.x, heightSlider.y + heightSlider.height + margin])
    let manualUpdate = Button("Manual update", options.manualUpdateFunction,
        [generateButton.x + generateButton.width + margin, heightSlider.y + heightSlider.height + margin])
    let autoUpdate = SwitchButton("Auto update", options.autoUpdate,
        [manualUpdate.x + manualUpdate.width + margin, heightSlider.y + heightSlider.height + margin])

    let background = new PIXI.Graphics()

    let container = new PIXI.Container()
    container.position.set(coordinates[0], coordinates[1])
    container.addChild(background, widthSlider, heightSlider, generateButton, manualUpdate, autoUpdate)

    background.beginFill(0x111111).drawRect(0, 0, container.width, container.height )


    return container
})
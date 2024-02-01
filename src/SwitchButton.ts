import * as PIXI from "pixi.js"
export default ((text: string, toSwitch: {value: boolean}, coordinates: number[]) : PIXI.Container => {
    let button = new PIXI.Container()
    button.position.set(coordinates[0], coordinates[1])

    let textSprite = new PIXI.Text(text, {fill: 0xFFFFFF})

    let background = new PIXI.Graphics()
        .beginFill(0x999999).drawRect(0, 0, textSprite.width, textSprite.height)

    button.addChild(background, textSprite)

    background.eventMode = "static"
    background.on("pointerenter", () => background.tint = 0x999999)
    background.on("pointerleave", () => background.tint = 0xFFFFFF)

    background.on("pointertap", () => {
        toSwitch.value = !toSwitch.value
    })

    return button
})
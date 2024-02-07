import {Container, Graphics} from "pixi.js";

const dimensions = [300, 700]

export default ((coordinate: number[]) => {
    let background = new Graphics()
        .beginFill(0xFF0000).drawRect(0, 0, dimensions[0], dimensions[1])

    let container = new Container()
    container.position.set(coordinate[0], coordinate[1])
    container.addChild(background)

    return container
})
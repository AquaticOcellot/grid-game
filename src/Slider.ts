import {Container, Graphics} from "pixi.js"

export default ((coordinates: number[], dimensions: number[], valueRange: number[], link: {"value": number}) => {
    let valueDifference = valueRange[1] - valueRange[0]
    link.value = Math.round((valueRange[0] + valueRange[1]) / 10)
    let handleWidth: number = 50
    let minCoordinate: number = 0
    let maxCoordinate: number = dimensions[0] - handleWidth

    let slider: Container = new Container()
    slider.position.set(coordinates[0], coordinates[1])

    let body: Graphics = new Graphics()
        .beginFill(0x666666).drawRect(0, 0, dimensions[0], dimensions[1])
    slider.addChild(body)

    let handle: Graphics = new Graphics()
        .beginFill(0x444444).drawRect(0, 0, handleWidth, dimensions[1])
    slider.addChild(handle)
    handle.x = maxCoordinate * (link.value / (valueRange[0] + valueRange[1]))

    body.eventMode = "static"
    body.on("pointerdown", dragStart)
    body.on("pointerup", dragEnd)
    body.on("pointerupoutside", dragEnd)
    body.on("pointertap", onDrag)

    function dragStart(): void {
        body.addEventListener("globalpointermove", onDrag)
    }

    function dragEnd(): void {
        body.removeEventListener("globalpointermove", onDrag)
    }

    function onDrag(e: any) {
        handle.x = Math.max(
            Math.min(
                e.getLocalPosition(body).x - handleWidth / 2,
                maxCoordinate),
            minCoordinate)
        link.value = Math.round(valueRange[0] + valueDifference * (handle.x / maxCoordinate))
    }

    return slider;
})
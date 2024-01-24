import {Container, Graphics} from "pixi.js";

export default ((coordinates: number[], dimensions: number[], valueRange: number[]) => {
    let value: number = Math.round((valueRange[0] + valueRange[1]) / 2);
    let handleWidth: number = 50;
    let minCoordinate: number = 0;
    let maxCoordinate: number = Math.ceil(dimensions[0] - handleWidth);

    let slider: Container = new Container();
    slider.x = coordinates[0];
    slider.y = coordinates[1];

    let body: Graphics = new Graphics()
        .beginFill(0x666666).drawRect(0, 0, dimensions[0], dimensions[1]);
    slider.addChild(body);

    let handle: Graphics = new Graphics()
        .beginFill(0x444444).drawRect(0, 0, handleWidth, dimensions[1]);
    handle.pivot.set(0.5)
    handle.eventMode = "static";
    handle.on("pointerdown", () => {handle.addEventListener("pointermove", onDrag)});
    handle.on("pointerup", () => {handle.removeEventListener("pointermove", onDrag)});
    handle.on("pointerupoutside", () => {handle.removeEventListener("pointermove", onDrag)});
    slider.addChild(handle);

    function onDrag(e: any) {
        value = 0;
        handle.x = Math.max(
            Math.min(
                e.getLocalPosition(body).x - handleWidth / 2,
                maxCoordinate),
            minCoordinate);
        console.log(e.getLocalPosition(body).x);
    }

    return slider;
})
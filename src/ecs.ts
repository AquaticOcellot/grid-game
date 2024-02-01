import type World from "./world"
import {Container, Sprite, type Texture} from "pixi.js"

abstract class Component {}

abstract class System {
    public abstract componentsRequired: Set<Function>
    public abstract update(entities: Set<number>): void
    public ecs!: ECS
}
type ComponentClass<T extends Component> = new (...args: any[]) => T

class ComponentContainer {
    private map = new Map<Function, Component>()

    public add(component: Component): void {
        this.map.set(component.constructor, component)
    }

    public get<T extends Component>(
        componentClass: ComponentClass<T>
    ): T {
        return this.map.get(componentClass) as T
    }

    public has(componentClass: Function): boolean {
        return this.map.has(componentClass)
    }

    public hasAll(componentClasses: Iterable<Function>): boolean {
        for (let cls of componentClasses) {
            if (!this.map.has(cls)) {
                return false
            }
        }
        return true
    }

    public delete(componentClass: Function): void {
        this.map.delete(componentClass)
    }
}

class ECS {
    private entities = new Map<number, ComponentContainer>()
    private systems = new Map<System, Set<number>>()

    private nextEntityID = 0
    private entitiesToDestroy = new Array<number>()

    public addEntity(): number {
        let entity = this.nextEntityID
        this.nextEntityID++
        this.entities.set(entity, new ComponentContainer())
        return entity
    }
    public removeEntity(entity: number): void {
        this.entitiesToDestroy.push(entity);
    }
    public getIndices(): number[] {
        let indices: number[] = []
        for (const key of this.entities.keys()) {
            indices.push(key)
        }
        return indices
    }
    public clear() {
        for (let entity of this.entities.keys()) {
            this.destroyEntity(entity)
        }
        for (let system of this.systems.keys()) {
            this.systems.delete(system)
        }
        this.entitiesToDestroy = new Array<number>()
        this.nextEntityID = 0
    }
    public addComponent(entity: number, component: Component): void {
        this.entities.get(entity)!.add(component)
        this.checkE(entity)
    }

    public getComponents(entity: number): ComponentContainer {
        return this.entities.get(entity)!
    }

    public removeComponent(
        entity: number, componentClass: Function
    ): void {
        this.entities.get(entity)!.delete(componentClass)
        this.checkE(entity)
    }
    public addSystem(system: System): void {
        if (system.componentsRequired.size == 0) {
            console.warn("System not added: empty Components list.")
            console.warn(system)
            return
        }

        system.ecs = this

        this.systems.set(system, new Set())
        for (let entity of this.entities.keys()) {
            this.checkES(entity, system)
        }
    }

    public update(): void {
        for (let [system, entities] of this.systems.entries()) {
            system.update(entities)
        }

        while (this.entitiesToDestroy.length > 0) {
            this.destroyEntity(this.entitiesToDestroy.pop()!)
        }
    }

    private destroyEntity(entity: number): void {
        this.entities.delete(entity)
        for (let entities of this.systems.values()) {
            entities.delete(entity)
        }
    }

    private checkE(entity: number): void {
        for (let system of this.systems.keys()) {
            this.checkES(entity, system)
        }
    }

    private checkES(entity: number, system: System): void {
        let have = this.entities.get(entity)!
        let need = system.componentsRequired
        if (have.hasAll(need)) {
            this.systems.get(system)!.add(entity)
        } else {
            this.systems.get(system)!.delete(entity)
        }
    }
}

class Coordinate extends Component {
    constructor(public x: number, public y: number, public neighbors: number[] = []) {
        super()
    }
}

class Heat extends Component {
    constructor(public heat: number, public delta: number = 0) {
        super()
    }
}
class HeatChange extends Component {
    constructor(public ratio: number, public absolute: number) {
        super()
    }
}
class BoxSprite extends Component {
    public sprite!: Sprite
    constructor(public scale: number, position: number[], texture: Texture) {
        super()
        this.sprite = Sprite.from(texture)
        this.sprite.scale.set(scale)
        this.sprite.x = position[0]
        this.sprite.y = position[1]
    }
}

class UpdateHeat extends System {
    componentsRequired = new Set<Function>([Heat])
    update(entities: Set<number>) {
        for (const entity of entities) {
            let components = this.ecs.getComponents(entity)

            let heat = components.get(Heat).heat + components.get(Heat).delta
            if (components.has(HeatChange)) {
                heat += components.get(HeatChange).absolute
                heat *= components.get(HeatChange).ratio
            }
            components.get(Heat).delta = 0

            components.get(Heat).heat = Math.max(0, Math.min(256, heat))
        }
    }
}
class DistributeHeat extends System {
    componentsRequired = new Set<Function>([Coordinate, Heat])
    update(entities: Set<number>) {
        for (const entity of entities) {
            let components = this.ecs.getComponents(entity)
            for (const neighbor of components.get(Coordinate).neighbors) {
                components.get(Heat).delta +=
                    (ecs.getComponents(neighbor).get(Heat).heat - components.get(Heat).heat) * 0.01
            }
        }
    }
}
class Renderer extends System {
    componentsRequired = new Set<Function>([Coordinate, Heat, BoxSprite])
    container: Container
    constructor() {
        super()
        this.container = new Container()
    }
    update(entities: Set<number>) {
        for (const entity of entities) {
            let components = this.ecs.getComponents(entity)
            let sprite = components.get(BoxSprite).sprite
            sprite.tint = "0x" + normalizeHexPart(components.get(Heat).heat) + "9999"
        }
    }
}

let ecs = new ECS()


export function createWorld(world: World, displayDimensions: number[], texture: Texture): Container {
    ecs.clear()
    ecs.addSystem(new UpdateHeat())
    ecs.addSystem(new DistributeHeat())
    let renderer = new Renderer()
    ecs.addSystem(renderer)

    let scale = Math.min(
        (displayDimensions[0]) / (world.width * 256),
        (displayDimensions[1]) / (world.height * 256),
    );
    renderer.container.addChild(new Sprite())

    let entities: number[] = []
    for (let rowIndex = 0; rowIndex < world.height; rowIndex++) {
        for (let cellIndex = 0; cellIndex < world.width; cellIndex++) {
            if (world.cells[rowIndex] && world.cells[rowIndex][cellIndex]) {
                let cellName = world.cells[rowIndex][cellIndex].name
                if (["wall", "heat", "sink"].includes(cellName)) {
                    let entity = ecs.addEntity()
                    let coordinate = new Coordinate(cellIndex, rowIndex)
                    let boxSprite = new BoxSprite(scale,
                        [cellIndex * scale * 256, rowIndex * scale * 256], texture)
                    ecs.addComponent(entity, coordinate)
                    ecs.addComponent(entity, boxSprite)
                    if (cellName == "wall") {
                        ecs.addComponent(entity, new Heat(100))
                        ecs.addComponent(entity, new HeatChange(0.999, 0))
                    }
                    if (cellName == "heat") {
                        ecs.addComponent(entity, new Heat(200))
                        ecs.addComponent(entity, new HeatChange(1, 2))
                    }
                    if (cellName == "sink") {
                        ecs.addComponent(entity, new Heat(10))
                        ecs.addComponent(entity, new HeatChange(0.99, -1))
                    }
                    entities.push(entity)
                    renderer.container.addChild(boxSprite.sprite)
                }
            }
        }
    }

    for (const entity of entities) {
        let coordinate = ecs.getComponents(entity).get(Coordinate)
        for (const otherEntity of entities) {
            let otherCoordinate = ecs.getComponents(otherEntity).get(Coordinate)
            let difference = [coordinate.x - otherCoordinate.x, coordinate.y - otherCoordinate.y]
            if (difference[0] === -1 && difference[1] === 0 ||
                difference[0] === 1 && difference[1] === 0 ||
                difference[0] === 0 && difference[1] === -1 ||
                difference[0] === 0 && difference[1] === 1) {
                coordinate.neighbors.push(otherEntity)
            }
        }
    }
    return renderer.container
}

export function update(): void {
    ecs.update()
}

export function test(): void {
    console.log(ecs)
}

function normalizeHexPart(part: number): string {
    let floored = Math.max(0, Math.floor(part))
    if (part == 0) {
        return "00"
    }
    if (part < 16) {
        return "0" + floored.toString(16)
    }
    return Math.min(floored, 255).toString(16)
}
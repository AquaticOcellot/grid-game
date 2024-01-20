export class Cell {
    name: string;
    heat: number;
    constructor(name: string) {
        this.name = name;
        switch (name) {
            case "heat":
                this.heat = 200;
                break;
            case "sink":
                this.heat = 50;
                break;
            default:
                this.heat = 100;
        }
    }
}
import {Cell} from "./cell";

export default class World {
    cells: Cell[][];
    constructor(data: string[][]) {
        this.cells = [];
        data.forEach((dataRow) => {
            let cellRow:Cell[] = [];
            dataRow.forEach((dataCell) => {
                let cell:Cell = new Cell(dataCell);
                cellRow.push(cell);
            })
            this.cells.push(cellRow);
        })
    }
    update() {
        let gridDelta:number[][] = [];

        for (let rowIndex = 0; rowIndex < this.cells.length; rowIndex++) {
            let rowDelta:number[] = [];
            for (let cellIndex = 0; cellIndex < this.cells[rowIndex].length; cellIndex++) {
                let cellDelta: number = 0;
                rowDelta.push(cellDelta);
            }
            gridDelta.push(rowDelta);
        }
        console.log(gridDelta);

        for (let rowIndex = 0; rowIndex < this.cells.length; rowIndex++) {
            for (let cellIndex = 0; cellIndex < this.cells[rowIndex].length; cellIndex++) {
                this.cells[rowIndex][cellIndex].heat += gridDelta[rowIndex][cellIndex];
            }
        }
    }
}

const tiles: string[] = ["    ", "wall", "sink", "heat"];
export default (dimensions: number[]) => {
    let data: string[][] = [];
    for (let rowIndex = 0; rowIndex < dimensions[1]; rowIndex++) {
        let dataRow: string[] = [];
        for (let columnIndex = 0; columnIndex < dimensions[0]; columnIndex++) {
            let num = Math.floor(Math.random() * 1000);
            let dataCell = tiles[0];
            if (num < 300) {
                dataCell = tiles[0]
            } else if (num < 700) {
                dataCell = tiles[1]
            } else if (num < 800) {
                dataCell = tiles[2]
            } else if (num < 1000) {
                dataCell = tiles[3]
            }
            dataRow.push(dataCell);
        }
        data.push(dataRow);
    }
    return data;
}
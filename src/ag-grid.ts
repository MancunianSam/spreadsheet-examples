import {Grid, GridOptions, simpleHttpRequest} from "ag-grid-community"

const columnDefs = [
    {
        field: "make", sortable: true, filter: true, editable: true, cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['Toyota', 'Ford', 'Porsche'],
        }
    },
    {field: "model", sortable: true, filter: true},
    {
        field: "price", sortable: true, filter: true, editable: true,
        cellStyle: (params: any) => params.value < 10000 ? {'background-color': 'red' } : {},
        valueParser: numberParser,
    }
];

function numberParser(params: any) {
    const newValue = params.newValue;
    let valueAsNumber;
    if (newValue === null || newValue === undefined || newValue === '') {
        valueAsNumber = null;
    } else {
        valueAsNumber = parseInt(params.newValue);
    }
    return valueAsNumber;
}

// specify the data
const rowData = [
    {make: "Toyota", model: "Celica", price: 35000},
    {make: "Ford", model: "Mondeo", price: 32000},
    {make: "Porsche", model: "Boxter", price: 72000}
];

// let the grid know which columns and what data to use
const gridOptions: GridOptions = {
    columnDefs: columnDefs,
    rowData: rowData
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv: HTMLElement | null = document.querySelector('#myGrid');
    const loadData: HTMLButtonElement = document.querySelector("#load-data")!
    loadData.addEventListener("click", ev => {
        simpleHttpRequest({url: 'https://www.ag-grid.com/example-assets/row-data.json'})
            .then(data => {
                gridOptions.api!.setRowData(data);
            });
    })
    if (gridDiv) {
        new Grid(gridDiv, gridOptions)

    }
    const showData: HTMLButtonElement = document.querySelector("#show-data")!
    const results: HTMLDivElement = document.querySelector("#results")!
    showData.addEventListener("click", ev => {
        const resultsArr: any[] = []
        gridOptions.api!.forEachNode((rowNode, index) => {
            resultsArr.push({
                "make": rowNode.data.make,
                "model": rowNode.data.model,
                "price": rowNode.data.price
            })
        });
        results.innerHTML = JSON.stringify({"results": resultsArr}, null, 4)
    })
});
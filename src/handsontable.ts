import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import CellMeta = Handsontable.CellMeta;

document.addEventListener('DOMContentLoaded', () => {
    function lowValueRenderer(instance: any, td: any, row: any, col: any, prop: any, value: any, cellProperties: any) {
        // @ts-ignore
        Handsontable.renderers.TextRenderer.apply(this, arguments);

        if (col > 0 && parseInt(value, 10) < 10000) {
            td.style.background = 'red';
        }
    }

    const data = [
        ['Make', 'Model', 'Price'],
        ['Toyota', 'Celica', 35000],
        ['Ford', 'Mondeo', 32000],
        ['Porsche', 'Boxter', 72000],
    ];


    const container = document.getElementById('example')!;
    const hot = new Handsontable(container, {
        data: data,
        rowHeaders: true,
        colHeaders: true,
        licenseKey: 'non-commercial-and-evaluation', // for non-commercial use only
        width: '800px',
        height: '150px',
        colWidths: 100,
        columnSorting: true,
        dropdownMenu: true,
        filters: true,
        cells(row: any, col: any) {
            const cellProperties: CellMeta = {};
            cellProperties.renderer = lowValueRenderer
            return cellProperties
        },
        columns: [
            {
                type: 'dropdown',
                source: ['Toyota', 'Ford', 'Porsche']
            },
            {
                type: 'text'
            },
            {type: 'numeric'}
        ]
    });

    const showButton: HTMLButtonElement = document.querySelector("#handson-show-data")!
    showButton.addEventListener("click", () => {
        JSON.stringify({ data: hot.getData() })
        const results: HTMLDivElement = document.querySelector("#handson-results")!
        results.innerHTML = JSON.stringify({ data: hot.getData() })
    })
    const loadButton: HTMLButtonElement = document.querySelector("#handson-load-data")!
    loadButton.addEventListener("click", () => {
        fetch('https://www.ag-grid.com/example-assets/row-data.json').then(response => {
            response.json().then((data: [{make: string, model: string, price: number}]) => {
                const mappedData: string[][] = [['Make', 'Model', 'Price']]
                data.map(cars => {
                    mappedData.push([cars.make, cars.model, cars.price.toString()])
                })
                hot.loadData(mappedData)
            })
        })
    })

})

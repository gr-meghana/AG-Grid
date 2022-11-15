import { HttpClient } from '@angular/common/http';

import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, FirstDataRenderedEvent,  GridApi} from 'ag-grid-community';

import 'ag-grid-enterprise';
import { Book } from './book';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
   regex = new RegExp('^[a-z]');
  private gridApi!: GridApi<Book>;
  title = 'AG-Grid';
  complete =['true','false'];
 public colDefs: ColDef[] = [
  { 
    field: 'userId',
    headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      valueGetter: (params) => {
        return params.data.userId;
      },
      valueSetter: (params) => {
        var newValInt = parseInt(params.newValue);
        var valueChanged = params.data.userId !== newValInt;
        if (valueChanged) {
          params.data.userId = newValInt;
        }
        
        return valueChanged;
       
      },
  },
  {
    headerName:'Id',
    valueGetter: (params) => {
      return params.data.id;
    },
    valueSetter: (params) => {
      var newValInt = parseInt(params.newValue);
      var valueChanged = params.data.id !== newValInt;
      if (valueChanged) {
        params.data.id = newValInt;
      }
      return valueChanged;
    },

    
},
  { field:'title',
   
    cellEditor: 'agTextCellEditor',
    valueGetter: (params) => {
      return params.data.title;
    },
    valueSetter: (params) => {
     
     var newVal = params.newValue;
     
      var valueChanged = params.data.title !== newVal;
      
     if(valueChanged){
      if(this.regex.test(newVal)){
      params.data.title = newVal;
     }
     
    }
    return valueChanged;
      
    },
    cellStyle:(params)=>this.regex.test(params.value)==true?{background:''}:{background:'red'}
  },
  {
    field:'completed', 
    cellEditor:'agRichSelectCellEditor',
    cellEditorPopup: true,
    cellEditorParams: {
      values: this.complete, 
    },
  }
];


public defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  editable: true,
  enablePivot: true,
  resizable: true,
  onCellValueChanged:this.onCellValueChanged
};
onCellValueChanged(params:any) {
  if (params.oldValue !== params.newValue) {
      var column = params.column.colDef.field;
            params.column.colDef.cellStyle = { 'background-color': 'cyan' };
            params.api.refreshCells({
                force: true,
                columns: [column],
                rowNodes: [params.node]
        });
  }}

public rowSelection: 'single' | 'multiple' = 'multiple';

public rowData!: Book[];
onlyWhenGrouping: "onlyWhenGrouping"|"always"|"never"|undefined;

onQuickFilterChanged() {
  this.gridApi.setQuickFilter(
    (document.getElementById('quickFilter') as HTMLInputElement).value
  );
}



@ViewChild(AgGridAngular) agGrid!: AgGridAngular;

constructor(private http: HttpClient) {}

onBtExport() {
  this.gridApi.exportDataAsExcel();
  
}
onBtCVSExport(){
this.gridApi.exportDataAsCsv();
}

onGridReady(params: GridReadyEvent) {
  this.gridApi = params.api;
  this.http
    .get<Book[]>(' https://jsonplaceholder.typicode.com/todos').subscribe((data:any) => (this.rowData = data));
}



onFirstDataRendered(params: FirstDataRenderedEvent<Book>) {
  params.api.forEachNode((node) =>
    node.setSelected(!!node.data )
  );
}

clearSelection(): void {
  this.agGrid.api.deselectAll();
}

}




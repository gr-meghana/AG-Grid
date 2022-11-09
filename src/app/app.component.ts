import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, IsRowSelectable, RowNode, FirstDataRenderedEvent,  GridApi} from 'ag-grid-community';
import { CellComponent } from './app.cell-component';
import 'ag-grid-enterprise';
import { Book } from './book';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {

  private gridApi!: GridApi<Book>;
  title = 'AG-Grid';
  complete =['true','false'];
 public colDefs: ColDef[] = [
  { 
    field: 'userId',
    headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      
  },
  { field: 'id',
  enablePivot: true},
  { 
    field: 'title' , 
    cellEditor: 'agTextCellEditor' ,
  
  },
  {
    field:'completed', 
    cellRenderer:CellComponent,
    cellEditor:'agRichSelectCellEditor',
    cellEditorPopup: true,
    rowGroup:true,
    
    
    cellEditorParams: {
      values: this.complete,
      cellRenderer:CellComponent,
    },
  }
];


public defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  editable: true,
  enablePivot: true,
};

public rowSelection: 'single' | 'multiple' = 'multiple';

public rowData!: Book[];

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

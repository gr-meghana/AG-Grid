import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, CellClickedEvent, IsRowSelectable, RowNode, FirstDataRenderedEvent, CellEditingStartedEvent, CellEditingStoppedEvent, RowEditingStartedEvent, RowEditingStoppedEvent, ICellEditorParams } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { Book } from './book';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  title = 'AG-Grid';
  
 public colDefs: ColDef[] = [
  { 
    field: 'userId',
    headerCheckboxSelection: true,
    checkboxSelection: true,
    showDisabledCheckboxes: true,
  },
  { field: 'id'},
  { 
    field: 'title' , 
    editable: true, 
    cellEditor: 'agTextCellEditor' 
  },
  {
    field:'completed', 
    editable: true,
    cellEditor:'agSelectCellEditor',
    cellEditorPopup: true,
    cellEditorParams: {
      cellHeight: 50,
      values: ['true', 'false'],
    }
  }
];


public defaultColDef: ColDef = {
  sortable: true,
  filter: true,
};
public rowSelection: 'single' | 'multiple' = 'multiple';
public isRowSelectable: IsRowSelectable = (params: RowNode<Book>) => {
  return !!params.data 
};
public rowData!: Book[];




@ViewChild(AgGridAngular) agGrid!: AgGridAngular;

constructor(private http: HttpClient) {}


onGridReady(params: GridReadyEvent) {
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

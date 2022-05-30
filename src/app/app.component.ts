import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { DialogCoinComponent } from './dialogCoin/dialogCoin.component';
import { ApiService } from './services/api.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'AngularCrud';
  displayedColumns: string[] = ['id', 'name', 'acronym', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('sorter1') sorter1!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) {

  }

  ngOnInit(): void {
    this.getAllCoin();

  }

  openDialog() {
    this.dialog.open(DialogCoinComponent, {
      width: '30%'
    }).afterClosed().subscribe(value => {
      if (value === 'save') {
        this.getAllCoin();
      }
    });
  }

  getAllCoin() {
    this.api.getCoin().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sorter1;
      },
      error: () => {
        console.log('error getting coin');
      }
    });
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editCoin(row: any) {
    this.dialog.open(DialogCoinComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(value => {
      if (value === 'updated') {
        this.getAllCoin();
      }
    });
  }

  deleteCoin(id: number) {
    this.api.deleteCoin(id).subscribe({
      next: () => {
        this.getAllCoin();
      },
      error: () => {
         console.log("error deleting coin");
      }
    });
  }




}

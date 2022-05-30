import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogPortfolioComponent } from '../dialogPortfolio/dialogPortfolio.component';
import { DialogPortfolioLineComponent } from '../dialogPortfolioLine/dialogPortfolioLine.component';

export interface Coin {
  id: string;
  name: string;
  symbol: string;
}
@Component({
  selector: 'app-table-portafolio',
  templateUrl: './tablePortafolio.component.html',
  styleUrls: ['./tablePortafolio.component.scss']
})
export class TablePortafolioComponent implements OnInit {

  resultPortafolio: Array<any> = [];
  displayedColumnsPortFolio: string[] = ['id', 'name', 'lines', 'action'];
  dataSourcePortFolio!: MatTableDataSource<any>;

  @ViewChild('paginatorPortFolio') paginatorPortFolio!: MatPaginator;
  @ViewChild('sorter2') sorter2!: MatSort;

  constructor(private dialog: MatDialog,
    private api: ApiService) { }

  ngOnInit() {
    this.getAllPortfoliosAndLines();

  }

  getAllPortfoliosAndLines() {
    this.api.getPortfolios().subscribe({
      next: (res: any) => {
        let bar = new Promise<void>((resolve, reject) => {
          res.forEach(async (portfolio: any, index: any, array: any) => {
            await this.api.getPortfoliosWithLines(portfolio.id).then(response => {

              this.resultPortafolio.push(response);
            });
            if (index === array.length - 1) resolve();
          });
        });

        bar.then(() => {          
          this.dataSourcePortFolio = new MatTableDataSource(this.resultPortafolio);
          this.dataSourcePortFolio.paginator = this.paginatorPortFolio;
          this.dataSourcePortFolio.sort = this.sorter2;
          this.resultPortafolio = [];
        });
      },
      error: () => {
        console.log('error getting portfoliosLines');
      }
    });

  }

  openDialogPortFolio() {
    this.dialog.open(DialogPortfolioComponent, {
      width: '30%'
    }).afterClosed().subscribe(value => {
      if (value === 'save') {
        this.getAllPortfoliosAndLines();
      }
    });
  }

  deletePortFolio(id: number) {
    this.api.deletePortfolio(id).subscribe({
      next: () => {
        this.getAllPortfoliosAndLines();
      },
      error: () => {
        console.log("Error deleting portfolio");
      }
    });
  }

  editPortFolio(row: any) {
    this.dialog.open(DialogPortfolioComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(value => {
      if (value === 'updated') {
        this.getAllPortfoliosAndLines();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePortFolio.filter = filterValue.trim().toLowerCase();

    if (this.dataSourcePortFolio.paginator) {
      this.dataSourcePortFolio.paginator.firstPage();
    }
  }

  addPortFolioLine(row: any) {
    this.dialog.open(DialogPortfolioLineComponent, {
      width: '30%',
      data: { row, mode: 'add' }
    }).afterClosed().subscribe(value => {
      if (value === 'updated') {
        this.getAllPortfoliosAndLines();
      }
    });
  }

  deletePortFolioLine(rowId: string, lineId: number) {
    this.api.deletePortfolioLine(rowId, lineId).subscribe({
      next: () => {
        this.getAllPortfoliosAndLines();
      },
      error: () => {
        console.log("Error deleting portfolioLine");
      }
    });
  }

  editPortFolioLine(row: any, lineId: number) {
    this.dialog.open(DialogPortfolioLineComponent, {
      width: '30%',
      data: { row, mode: 'edit', lineId: lineId }
    }).afterClosed().subscribe(value => {
      if (value === 'updated') {
        this.getAllPortfoliosAndLines();
      }
    });
  }
}

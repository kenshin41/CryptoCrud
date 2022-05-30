import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-portfolio-line',
  templateUrl: './dialogPortfolioLine.component.html',
  styleUrls: ['./dialogPortfolioLine.component.scss']
})
export class DialogPortfolioLineComponent implements OnInit {

  portfolioLineForm !: FormGroup;
  actionBtn: string = "Save";

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private api: ApiService, private dialogRef: MatDialogRef<DialogPortfolioLineComponent>) { }

  ngOnInit(): void {
    this.portfolioLineForm = this.formBuilder.group({
      amount: ['', Validators.required],
      coinId: ['', Validators.required]
    })

    if (this.editData.mode !== 'add') {
      this.actionBtn = "Update";
      let line = this.editData.row.lines.find((x: any) => x.id === this.editData.lineId);
      this.portfolioLineForm.controls['amount'].setValue(line.amount);
      this.portfolioLineForm.controls['coinId'].setValue(line.coinId);
    }
  }

  addPortfolioLine() {

    if (this.editData.mode === 'add') {
      if (this.portfolioLineForm.valid) {
        this.api.postPortfolioLine(this.editData.row.id, this.portfolioLineForm.value)
          .subscribe({
            next: () => {
              this.portfolioLineForm.reset();
              this.dialogRef.close('save');
            },
            error: () => {
              console.log("error adding portfolioLine");
            }
          });
      }
    } else {
      this.updatePortfolioLine();
    }
  }

  updatePortfolioLine() {
    this.api.putPortfolioLine(this.editData.row.id, this.portfolioLineForm.value, this.editData.lineId)
      .subscribe({
        next: () => {
          this.portfolioLineForm.reset();
          this.dialogRef.close('updated');
        },
        error: () => {
          console.log("error updating portfolioLine");
        }
      });
  }
}

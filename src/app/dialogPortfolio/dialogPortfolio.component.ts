import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-portfolio',
  templateUrl: './dialogPortfolio.component.html',
  styleUrls: ['./dialogPortfolio.component.scss']
})
export class DialogPortfolioComponent implements OnInit {

  portfolioForm !: FormGroup;
  actionBtn: string = "Save";

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private api: ApiService, private dialogRef: MatDialogRef<DialogPortfolioComponent>) { }

  ngOnInit(): void {
    this.portfolioForm = this.formBuilder.group({
      name: ['', Validators.required]
    })

    if (this.editData) {
      this.actionBtn = "Update"
      this.portfolioForm.controls['name'].setValue(this.editData.name);
    }
  }

  addPortfolio() {
    if (!this.editData) {
      this.api.postPortfolio(this.portfolioForm.value)
        .subscribe({
          next: () => {
            this.portfolioForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
             console.log("error adding portfolio");
          }
        });
    } else {
      this.updatePortfolio();
    }
  }

  updatePortfolio() {
    this.api.putPortfolio(this.portfolioForm.value, this.editData.id)
      .subscribe({
        next: () => {
          this.portfolioForm.reset();
          this.dialogRef.close('updated');
        },
        error: () => {
          console.log("error updating portfolio");
        }
      });
  }
}

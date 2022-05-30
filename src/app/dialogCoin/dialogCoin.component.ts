import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface Coin {
  id: string;
  name: string;
  symbol: string;
}
@Component({
  selector: 'app-dialog-coin',
  templateUrl: './dialogCoin.component.html',
  styleUrls: ['./dialogCoin.component.scss']
})
export class DialogCoinComponent implements OnInit {

  coinForm !: FormGroup;
  actionBtn: string = "Save";

  coins: Coin[] = [];

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private api: ApiService, private dialogRef: MatDialogRef<DialogCoinComponent>) { }

  ngOnInit(): void {
    this.coinForm = this.formBuilder.group({
      name: ['', Validators.required],
      acronym: ['', Validators.required]
    })

    if (this.editData) {
      this.actionBtn = "Update"
      this.coinForm.controls['name'].setValue(this.editData.name);
      this.coinForm.controls['acronym'].setValue(this.editData.acronym);
    }
  }

  addCoin() {
    this.api.getListCoin().subscribe({
      next: (res: any) => {
        let resultCoins = Object.keys(res.Data).map(function (item) {
          let coin = res.Data[item];
          return coin;
        });

        if (!this.editData) {
          if (this.coinForm.valid && resultCoins.find((x: any) => x.Symbol === this.coinForm.controls['acronym'].value)) {
            this.api.postCoin(this.coinForm.value)
              .subscribe({
                next: () => {
                  this.coinForm.reset();
                  this.dialogRef.close('save');
                },
                error: () => {
                  console.log("error adding coin");
                }
              });
          }
          else {
            alert("The coin you are trying to add " + this.coinForm.controls['acronym'].value + " is not real, please check it");
          }
        } else {
          this.updateCoin();
        }

      },
      error: () => {
        console.log("error getting real list coin");
      }
    });


  }

  updateCoin() {
    this.api.putCoin(this.coinForm.value, this.editData.id)
      .subscribe({
        next: () => {
          this.coinForm.reset();
          this.dialogRef.close('updated');
        },
        error: () => {
          console.log("error updating coin");
        }
      });
  }
}

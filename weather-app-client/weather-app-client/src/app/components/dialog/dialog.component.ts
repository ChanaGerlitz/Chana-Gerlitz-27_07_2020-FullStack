import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
 
})
export class DialogComponent {
  public message:string;
  constructor(@Inject(MAT_DIALOG_DATA) public msg: any) {
    this.message=msg;
   }
}

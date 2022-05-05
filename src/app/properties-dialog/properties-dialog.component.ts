import { Component, Inject, Input, OnInit } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  name: string;
  content: any;
}

@Component({
  selector: 'properties-dialog',
  templateUrl: './properties-dialog.component.html',
  styleUrls: ['./properties-dialog.component.css']

})
export class PropertiesDialog implements OnInit{
  folderNameCreated = '';
  targetNameCreated = '';

  
  constructor(public dialogRef: MatDialogRef<PropertiesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log("data",data)
      console.log("dataFile",data.file)
    }

  confirmMessage: string = 'test';
  onClose(){
    this.dialogRef.close(this.folderNameCreated);
  }

  ngOnInit(): void {
    
  }
}
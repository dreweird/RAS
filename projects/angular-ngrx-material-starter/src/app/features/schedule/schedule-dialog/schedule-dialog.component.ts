import { Component, OnInit, Inject, ViewChild, ElementRef} from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, catchError } from 'rxjs/operators';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { PmisService } from '../../../core/services/pmis.service';

@Component({
  selector: 'anms-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.scss'],
})
export class ScheduleDialogComponent implements OnInit {
  rowData: any;
  beds: number;
  entryForm: FormGroup;
  //uploader:FileUploader;
  editData;
  edit: Boolean = false;
  delete: Boolean = false;
  add: Boolean = false;
  title;


  createForm(){
    this.entryForm = new FormGroup({
      title: new FormControl(''),
      start: new FormControl(''),
      end: new FormControl(''),
      color: new FormControl(''),
      allDay: new FormControl(''),
    
    });
 

  }

  createFormPatch(data){
    console.log(data);
    this.entryForm.patchValue({
      id: data.id,
      title: data.title,
      start: data.start,
      end: data.end,
      color: data.color,
      allDay: data.allDay
    });

  }



  constructor(
    public rafcService: PmisService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (this.data.add){ 
      this.add = true;
      this.createForm();
    }
    if (this.data.edit){ 
      this.edit = true;
      this.createForm();
      this.createFormPatch(this.data.data);
    }



    if (this.data.delete){
      this.delete = true;
      this.title = this.data.data.title;
    }
 


  }

  ngOnInit() {}

  insertSched() {
 
    console.log(this.entryForm.value)
      this.rafcService.insertSched(this.entryForm.value).subscribe(result => {
        if (result) {
          console.log(result);
          this.dialogRef.close();
          this._snackBar.open('New Schedule inserted', 'Ok', {duration: 2000});
          this.data.gridApi.applyTransaction({ add: [result] });
        }
      });

  }


  updateSched() {
    this.entryForm.value.id = this.data.data.id;
    this.entryForm.value.start = moment(this.entryForm.value.start).format('YYYY-MM-DD');
    this.entryForm.value.end = moment(this.entryForm.value.end).format('YYYY-MM-DD');
    this.rafcService.updateSched(this.entryForm.value).subscribe(result => {
      if (result) {
        console.log(result);
        this.dialogRef.close({success: true, data: this.entryForm.value});
        this._snackBar.open('Schedule updated', 'Ok', {duration: 2000});
        this.data.gridApi.applyTransaction({ update: [this.entryForm.value] });
        this.data.gridApi.redrawRows(); // create the row again from scratch
      }
    });
  }

  removeSched() {
    this.rafcService.removeSched(this.data.data.id).subscribe(result => {
      console.log(result);
      if (result) {
        this.dialogRef.close();
        this._snackBar.open('Schedule removed', 'Ok', {duration: 2000});
        this.data.gridApi.applyTransaction({ remove: [this.data.data] });
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


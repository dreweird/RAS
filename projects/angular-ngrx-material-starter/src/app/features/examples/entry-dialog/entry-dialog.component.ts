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
  selector: 'anms-entry-dialog',
  templateUrl: './entry-dialog.component.html',
  styleUrls: ['./entry-dialog.component.scss']
})
export class EntryDialogComponent implements OnInit {
  rowData: any;
  beds: number;
  entryForm: FormGroup;
  //uploader:FileUploader;
  editData;
  edit: Boolean = false;
  delete: Boolean = false;
  add: Boolean = false;
  upload: Boolean = false;


  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;
  files = [];
  isMoa: boolean;



  addFile(file) {
    this.rafcService.add_files(file).subscribe(resilt => {
      // console.log(resilt);
    });
  }

  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file.data);
    file.inProgress = true;
    this.rafcService
      .upload(formData)
      .pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              file.progress = Math.round((event.loaded * 100) / event.total);
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          file.inProgress = false;
          return of(`${file.data.name} upload failed.`);
        })
      )
      .subscribe((event: any) => {
        if (typeof event === 'object') {
          console.log(event);
          let file = {
            file_name: event.body.file_name,
            code: this.code
          };
          this.addFile(file);
          console.log(file);
        }
      });
  }

  private uploadFiles() {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  onUpload() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      console.log(fileUpload.files.length);
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0 });
      //  console.log(this.files);
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  createForm(){
    if(this.isMoa) {
      this.entryForm = new FormGroup({
        id: new FormControl(''),
        code: new FormControl(''),
        date: new FormControl(''),
        recipient: new FormControl(''),
        type: new FormControl(this.data.type),
        intervention: new FormControl(''),
        date_received: new FormControl(''),
        subject: new FormControl(''),
        classification: new FormControl('')
      });
    }else{
      this.entryForm = new FormGroup({
        id: new FormControl(''),
        code: new FormControl(''),
        date: new FormControl(''),
        subject: new FormControl(''),
        type: new FormControl(this.data.type),
        received_by: new FormControl(''),
        date_received: new FormControl('0000-00-00'),
        classification: new FormControl('')
      });
    }

  }

  createFormPatch(data){
    this.entryForm.patchValue({
      id: data.id,
      code: data.code,
      date: data.date,
      subject: data.subject,
      type: this.data.type,
      recipient: data.recipient,
      intervention: data.intervention,
      date_received: data.date_received,
      date_encoded: data.date_encoded,
      classification: data.classification,
      received_by: data.received_by
    });
  }

  code: any;
  labelSubject: string;
  labelCode: string;

  constructor(
    public rafcService: PmisService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if(this.data.type === "MOA" || this.data.type === "DOD"){
      this.isMoa = true;
    }
    if (this.data.add){ 
      this.add = true;
      this.createForm();
    }
    if (this.data.edit){ 
      this.edit = true;
      this.createForm();
      this.createFormPatch(this.data.data);
    }
    if (this.data.type === "Travel Order"){
      this.labelSubject = "Name";
      this.labelCode = "Travel Order Number"
    }else if(this.data.type === "Memorandum"){
      this.labelSubject = "Subject";
      this.labelCode = "Memo Number";
    }else if(this.data.type === "Special Order"){
        this.labelSubject = "Subject";
        this.labelCode = "SO Number";
    }else if(this.data.type === "Notice of Meeting"){
      this.labelSubject = "Subject";
      this.labelCode = "Notice of Meeting #";
    }else if(this.data.type === "Advisory"){
      this.labelSubject = "Subject";
      this.labelCode = "Advisory #";
    }else if(this.data.type === "Others"){
      this.labelSubject = "Subject";
      this.labelCode = "Other #";
    }else if(this.data.type === "MOA"){
     // this.labelSubject = "Subject";
      this.labelCode = "MOA #";
    }else if(this.data.type === "DOD"){
      //this.labelSubject = "Subject";
      this.labelCode = "DOD #";
    }


    if (this.data.delete){
      this.delete = true;
      this.code = this.data.data.code;
    }
    if (this.data.upload && this.data.data.id) {
      this.upload = true;
      this.code = this.data.data.id;
    }


  }

  ngOnInit() {}

  insertDoc() {
      this.rafcService.insertDoc(this.entryForm.value).subscribe(result => {
        if (result) {
          console.log(result);
          this.dialogRef.close();
          this._snackBar.open('New Document inserted', 'Ok', {duration: 2000});
          this.data.gridApi.applyTransaction({ add: [result] });
        }
      });

  }


  updateDoc() {
    this.entryForm.value.date = moment(this.entryForm.value.date).format('YYYY-MM-DD');
    this.entryForm.value.date_encoded = moment(this.entryForm.value.date_encoded).format('YYYY-MM-DD');
    if(this.isMoa)  this.entryForm.value.date_received = moment(this.entryForm.value.date_received).format('YYYY-MM-DD');
    this.rafcService.updateDoc(this.entryForm.value).subscribe(result => {
      if (result) {
        console.log(result);
        this.dialogRef.close({success: true, data: this.entryForm.value});
        this._snackBar.open('Document updated', 'Ok', {duration: 2000});
        this.data.gridApi.applyTransaction({ update: [this.entryForm.value] });
        this.data.gridApi.redrawRows(); // create the row again from scratch
      }
    });
  }

  removeDoc() {
    this.rafcService.removeDoc(this.data.data.id).subscribe(result => {
      console.log(result);
      if (result) {
        this.dialogRef.close();
        this._snackBar.open('Document removed', 'Ok', {duration: 2000});
        this.data.gridApi.applyTransaction({ remove: [this.data.data] });
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


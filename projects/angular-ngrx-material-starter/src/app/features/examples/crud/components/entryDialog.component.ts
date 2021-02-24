import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
// import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { PmisService } from '../../../../core/services/pmis.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, catchError } from 'rxjs/operators';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  templateUrl: './entryDialog.component.html',
  styleUrls: ['./crud.component.scss']
})
export class entryDialog implements OnInit {
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
        map(event => {
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
          let file = {
            file_name: event.body.file_name,
            rafc_code: this.data.data.code
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

  onClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
     // console.log(fileUpload.files.length);
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0 });
      //  console.log(this.files);
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  constructor(
    public rafcService: PmisService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<entryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.add) this.add = this.data.add;
    if (this.data.delete) this.delete = this.data.delete;
    if (this.data.upload) this.upload = this.data.upload;
   // console.log(this.data);
    this.editData = this.data.data;
    this.entryForm = new FormGroup({
      code: new FormControl(''),
      type: new FormControl(''),
      year: new FormControl(''),
      afc: new FormControl(''),
      province: new FormControl(''),
      municipal: new FormControl(''),
      date_conducted: new FormControl(''),
      classification: new FormControl(''),
      remarks: new FormControl(''),
      res_title: new FormControl(''),
      res_number: new FormControl(''),
      res_date_endorsement: new FormControl(''),
      res_endorsed_to: new FormControl(''),
      adopted: new FormControl(''),
      date_adopted: new FormControl('')
    });
    if (this.data.data) {
      this.edit = true;;
      console.log(this.editData);
      this.entryForm.patchValue({
        code: this.editData.code,
        type: this.editData.type,
        year: (this.editData.year).toString(),
        afc: this.editData.afc,
        province: this.editData.province,
        municipal: this.editData.municipal,
        date_conducted: this.editData.date_conducted,
        classification: this.editData.classification,
        remarks: this.editData.remarks,
        res_title: this.editData.res_title,
        res_number: this.editData.res_number,
        res_date_endorsement: this.editData.res_date_endorsement,
        res_endorsed_to: this.editData.res_endorsed_to,
        adopted: this.editData.adopted,
        date_adopted: this.editData.date_adopted
      });
    }
  }
  ngOnInit() {}
  
  deadline: any;

  addDeadlineResolution(event){
    let date = new Date(event.setDate(event.getDate() + 30));
    this.deadline = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();    
  
  }

  addDeadlineMeetings(event){
    let date = new Date(event.setDate(event.getDate() + 10));
    this.deadline = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();    
  
  }
  addEvent(event){ 
    let date = new Date(event);

    if(this.entryForm.value.type === 'Resolution'){
      this.addDeadlineResolution(date);
     }else if(this.entryForm.value.type === 'Highlights of Meeting'){
      this.addDeadlineMeetings(date);
    }else{
      alert('Please select Document type')
    }
    
  }


  insertDoc() {
    this.rafcService.insertDoc(this.entryForm.value).subscribe(result => {
      if (result) {
        this.dialogRef.close();
        this._snackBar.open('New Document inserted', 'Ok', {duration: 2000});
        this.data.gridApi.applyTransaction({ add: [result] });
      }
    });
  }


  updateDoc() {

    this.entryForm.value.date_conducted = moment(this.entryForm.value.date_conducted).format('YYYY-MM-DD');
    this.entryForm.value.res_date_endorsement = moment(this.entryForm.value.res_date_endorsement).format('YYYY-MM-DD');
    this.entryForm.value.date_adopted = moment(this.entryForm.value.date_adopted).format('YYYY-MM-DD');
    console.log(this.entryForm.value);
    this.rafcService.updateDoc(this.entryForm.value).subscribe(result => {
      if (result) {
        this.dialogRef.close();
        this._snackBar.open('Document updated', 'Ok', {duration: 2000});
        this.data.gridApi.applyTransaction({ update: [this.entryForm.value] });
      }
    });
  }

  removeDoc() {
    this.rafcService.removeDoc(this.editData.code).subscribe(result => {
      if (result) {
        this.dialogRef.close();
        this._snackBar.open('Document removed', 'Ok', {duration: 2000});
        this.data.gridApi.applyTransaction({ remove: [this.editData] });
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

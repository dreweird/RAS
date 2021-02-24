import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PmisService } from '../../../core/services/pmis.service';

import { PDFSource } from 'ng2-pdf-viewer';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import {Location} from '@angular/common';

import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/animations/route.animations';
import { Store, select } from '@ngrx/store';
import { selectUserType } from '../../../core/auth/auth.selectors';
import { of, Observable } from 'rxjs';
import { LocalStorageService } from '../../../core/core.module';

export interface DocInterface {
  type: String;
  code: String;
  subject: String;
  date: Date;
  classification: String;
}


@Component({
  selector: 'anms-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentComponent implements OnInit {

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  doc: DocInterface;
  files: Array<any>;
  status: { status: string}[];
  code: String;
  pdfSrc: string | PDFSource | ArrayBuffer = '';
  imgSrc: String;
  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  isImage: boolean = false;
  isPDF: boolean = false;
  isResolution: boolean = false;
  type: string;

  backClicked() {
    this._location.back();
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  loadPdf(file_name) {
    let url = 'http://172.16.128.38:3800/pdf/' + file_name;
     //let url = 'http://localhost:4200/assets/' + file_name;
    let extension = url.split('.').pop();
    console.log(extension);
    if (extension === 'pdf' || extension === 'PDF') {
      this.isPDF = true;
      this.isImage = false;
      this.pdfSrc = url;
    } else {
      this.isImage = true;
      this.isPDF = false;
      this.imgSrc = url;
    }
  }

  delete(f, index) {
    const dialogRef = this.dialog.open(DetachedFileDialog, {
      minWidth: '50vh',
      data: { file: f, index: index, files: this.files }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.files.splice(index, 1);
        this.isImage = false;
        this.isPDF = false;
        this.cd.markForCheck();
        this._snackBar.open('Detached files successfully', 'Ok', {
          duration: 2000
        });
      }
    });
  }



  user: any;
  isNewType = 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private docService: PmisService,
    private cd: ChangeDetectorRef,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _location: Location,
    private localStorage: LocalStorageService
  ) {
    this.code = this.route.snapshot.paramMap.get('id');
    this.user = this.localStorage.getItem('AUTH');
  }


  ngOnInit(): void {
    console.log(this.code);
     this.getDocument(this.code);
     this.findFiles(this.code);
  }


  findFiles(code) {
    this.docService.findFiles(code).subscribe((result: any) => {
      this.files = result;
      this.cd.markForCheck();
    });
  }

  getDocument(id): void {
    this.docService.getDocuments(id).subscribe((result: any) => {
      this.doc = result;
      if(this.doc.type == 'DOD' || this.doc.type == 'MOA') this.isNewType = 1;
      console.log(result);
      this.cd.markForCheck();
    });
  }
}

@Component({
  template: `
    <h3 mat-dialog-title>Detached File</h3>
    <div mat-dialog-content>
      <p>
        Are you sure you want to detached file with filename
        <b> {{ data.file.file_name }}</b
        >? This action is irreversible.
      </p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button (click)="detached()" mat-button>Detached</button>
    </div>
  `
})
export class DetachedFileDialog {
  constructor(
    public dialogRef: MatDialogRef<DetachedFileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private docService: PmisService
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  detached() {
    this.docService.detachedFile(this.data.file.id).subscribe((result: any) => {
      if (result.success) {
        this.dialogRef.close(true);
        this.deleteUploadedFile();
      }
    });
  }

  deleteUploadedFile(){
    this.docService.deleteUploadedFile(this.data.file.file_name).subscribe((result: any) => {
      console.log(result);
    });
  }
}


import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-content-dialog',
  templateUrl: './add-content-dialog.component.html',
  styleUrls: ['./add-content-dialog.component.scss']
})
export class AddContentDialogComponent implements OnInit {

  fileName:string | undefined ='';
  hasError = false;
  allTextPattern = "[a-zA-Z][a-zA-Z]*";
  public addContentForm = new FormGroup({
    name: new FormControl('', [Validators.pattern(this.allTextPattern), Validators.required]),
    file: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.pattern(this.allTextPattern), Validators.required]),
    tag: new FormControl('', [Validators.pattern(this.allTextPattern)]),
  });

  createError = false;
  constructor(private dialogRef: MatDialogRef<AddContentDialogComponent>,) { }

  ngOnInit(): void {
  }

  onFileChange(event: Event) {
			// if( this.files && this.files.length > 1 )
			// 	fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			// else
			// 	fileName = e.target.value.split( '\\' ).pop();

			// if( fileName )
			// 	label.querySelector( 'span' ).innerHTML = fileName;
			// else
			// 	label.innerHTML = labelVal;
		

    if (event!=null && event.target!=null)
    {
      const target= event.target as HTMLInputElement;
      if (target.files!=null && target.files.length > 0) {
        this.fileName = target.value.split('\\').pop();
        const file = target.files[0];
        // this.addContentForm.patchValue({
        //   file: file
       // });
      } else {
        this.fileName = '';
      }

    }

  }

  // submit(){
  //   const formData = new FormData();
  //   formData.append('file', this.myForm.get('fileSource').value);

  //   this.http.post('http://localhost:', formData)
  //     .subscribe(res => {
  //       console.log(res);
  //       alert('Uploaded Successfully.');
  //     })
  // }

  addContent() {
    const metadata = {
      name: this.addContentForm.value.name,
      // :TODO add metadata from file
      // type:"png",
      // size: "3423kb",
      // createTime:"1.1.2020.",
      // editTime:"1.1.2020.",
      description: this.addContentForm.value.description,
      tag: this.addContentForm.value.tag
    }

    if (this.addContentForm.valid) {
      //    this.storeContent(metadata, this.addContentForm.value.file)
    }

//delete this after
    this.dialogRef.close("success");
  }

  // :TODO make storeService

  // storeContent(metadata: any, file: any) {
  //   this.storeService.storeContentToS3(file).subscribe({
  //     next: () => {
  //       this.addMetadata(metadata);
  //     },
  //     error: (error:any) => {
  //       if (error instanceof HttpErrorResponse) {
  //         this.createError = true;
  //       }
  //     },
  //   });
  // }

  // addMetadata(metadata:any) {
  //   this.storeService.addMetadataToDynamoDB(metadata).subscribe({
  //     next: () => {
  //       this.dialogRef.close("success");
  //     },
  //     error: (error:any) => {
  //       if (error instanceof HttpErrorResponse) {
  //         console.log(error);
  //         this.createError = true;
  //       }
  //     },
  //   });
  // }
}



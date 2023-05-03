import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UploadService } from 'src/app/services/upload.service';

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
  name="";
  type:string="";
  size=0;
  createTime=0;
  editTime=0;
  data="";
  createError = false;
  constructor(private dialogRef: MatDialogRef<AddContentDialogComponent>, private uploadService:UploadService) { }

  ngOnInit(): void {
  }

  async onFileChange(event: Event) {
    if (event!=null && event.target!=null)
    {
      const target= event.target as HTMLInputElement;
      if (target.files!=null && target.files.length > 0) {
        const file = target.files[0];
        this.fileName=file.name.split("\\").pop()
        
        
        this.type=(this.fileName||"ime").split('.')[1]||"";
        this.size=file.size;
        this.createTime=Date.now();
        this.editTime=this.createTime;
        
        try {
          this.data = await toBase64(file);
          this.data=this.data.split(',')[1];
        } catch(error) {
            console.error(error);
            return;
        }
        
        // const reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onload = () => {
        //   this.data = reader.result.toString().split(',')[1];
        // };
       

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

  async addContent() {

    if (this.addContentForm.valid) {
      var file={"name":this.addContentForm.value.name, "size":this.size,"type":this.type,
              "createTime":this.createTime, "editTime":this.editTime,
            "description":this.addContentForm.value.description,"tag":this.addContentForm.value.tag,"data":this.data};
    
      (await this.uploadService.sendToApiGateway(file)).subscribe({
        next: (result) => {
          console.log(result)
        },
        error: (error) => {
          console.error(error);
        },
      });

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

const toBase64 = (file: any) => new Promise<any>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

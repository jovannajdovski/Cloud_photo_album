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
        
      } else {
        this.fileName = '';
      }
    }

  }


  addContent() {
    if (this.addContentForm.valid) {
      var file={
        "name":this.addContentForm.value.name,
        "size":this.size,"type":this.type,
        "createTime":this.createTime,
        "editTime":this.editTime,
        "description":this.addContentForm.value.description,
        "tag":this.addContentForm.value.tag,
        "data":this.data
      };
    
      this.uploadService.uploadFile(file).subscribe({
        next: (result) => {
          console.log(result);
          this.createError = false;
        },
        error: (error) => {
          console.error(error);
          this.createError = true;
          this.dialogRef.close("error");
        },
      });

    }

    this.dialogRef.close("success");
  }
  
}

const toBase64 = (file: any) => new Promise<any>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

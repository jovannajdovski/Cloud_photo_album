import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { EditService } from 'src/app/services/edit.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-content-dialog',
  templateUrl: './edit-content-dialog.component.html',
  styleUrls: ['./edit-content-dialog.component.scss']
})
export class EditContentDialogComponent implements OnInit {

  fileName:string | undefined ='';
  hasError = false;
  allTextPattern = "[a-zA-Z][a-zA-Z]*";
  public editContentForm = new FormGroup({
    name: new FormControl('', [Validators.pattern(this.allTextPattern), Validators.required]),
    description: new FormControl('', [Validators.pattern(this.allTextPattern), Validators.required]),
    tag: new FormControl('', [Validators.pattern(this.allTextPattern)]),
  });
  name="";
  user="";
  filePath="";
  type:string="";
  createError = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<EditContentDialogComponent>, private editService:EditService) { }

  ngOnInit(): void {
    this.editContentForm.value.name=this.data.name;
    this.editContentForm.value.description=this.data.description;
    this.editContentForm.value.tag=this.data.tag;
    this.user=this.data.user;
    this.filePath=this.data.file_path;
  }

  
  async editContent() {

    if (this.editContentForm.valid) {
      var editedData={"name":this.editContentForm.value.name,
          "description":this.editContentForm.value.description,
          "tag":this.editContentForm.value.tag,
          "user": this.user,
          "file_path": this.filePath};
    
      (await this.editService.sendToApiGateway(editedData)).subscribe({
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
  
}

const toBase64 = (file: any) => new Promise<any>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Router } from '@angular/router';
import { Helper } from '../../../helper';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal, NgbModalRef, NgbDateStruct, NgbDatepickerConfig, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'provision-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [NCBService, Helper]
})
export class CreateComponent implements OnInit {
  public Editor = ClassicEditor;
  dataForm: FormGroup;
  submitted = false;
  content: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ncbService: NCBService,
    public router: Router,
    private helper: Helper
  ) { }

  ngOnInit() {
    this.dataForm = this.formBuilder.group({
      provisionName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      provisionLink: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      provisionCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
    });
  }
  get Form() { return this.dataForm.controls; }

  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      console.log('loader : ', loader);
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
      return;
    }
    this.ncbService.createMBProvision(this.dataForm.value).then((result) => {
      if (result.status === 200) {
        if (result.json().code !== '00') {
          this.toastr.error(result.json().message, 'Thất bại!');
        } else {
          this.toastr.success('Thêm mới thành công', 'Thành công!');
          setTimeout(() => {
            this.router.navigateByUrl('/provision');
          }, 500);
        }
      } else {
        this.toastr.error(result.message, 'Thất bại!');
      }
    }).catch((err) => {
      this.toastr.error(err.json().message, 'Thất bại!');

    });
  }
  resetForm() {
    this.router.navigateByUrl('/provision');
  }
}
export class UploadAdapter {
  private loader;
  constructor( loader ) {
     this.loader = loader;
  }

  upload() {
     return this.loader.file
           .then( file => new Promise( ( resolve, reject ) => {
                 const myReader = new FileReader();
                 myReader.onloadend = (e) => {
                    resolve({ default: myReader.result });
                 };

                 myReader.readAsDataURL(file);
           } ) );
  }
}



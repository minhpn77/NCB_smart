import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Helper } from '../../../helper';

@Component({
  selector: 'pos-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [NCBService, Helper]
})
export class EditComponent implements OnInit {
  dataForm: FormGroup;
  submitted = false;
  departCode: any;
  listStatus: any = [
    {
      name: 'Active',
      code: 'A',
    },
    {
      name: 'Deactive',
      code: 'D',
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public router: Router,
    private route: ActivatedRoute,
    public ncbService: NCBService,
    private helper: Helper
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.departCode = params.itemId;
    });
    this.dataForm = this.formBuilder.group({
      brnCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      branchName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      departCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      departName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      address: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
      phone: ['', Validators.compose([Validators.maxLength(13), this.helper.noWhitespaceValidator])],
      fax: ['', Validators.compose([this.helper.noWhitespaceValidator])],
      latitude: ['', Validators.compose([this.helper.noWhitespaceValidator])],
      longitude: ['', Validators.compose([this.helper.noWhitespaceValidator])],
      urlImg: ['', Validators.compose([this.helper.noWhitespaceValidator])],
      dao: ['', Validators.compose([this.helper.noWhitespaceValidator])],
      status: ''
    });
    this.getItem(this.departCode);
  }
  get Form() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.dataForm.invalid) {
        return;
    }
    this.ncbService.updateBranch(this.dataForm.value).then(result => {
      if (result.json().code === '00') {
        this.toastr.success('Sửa thành công', 'Thành công!');
        setTimeout(() => {
            this.router.navigateByUrl('/transaction-room');
        }, 500);
      } else {
          this.toastr.error('Sửa chi nhánh thất bại', 'Thất bại!');
      }
    }).catch(err => {
      this.toastr.error(err.json().desciption, 'Thất bại!');
    });
  }
  getItem(params) {
    this.ncbService.detailBranch({departCode: params}).then((result) => {
      const body = result.json().body;
      this.dataForm.patchValue({
        brnCode: body.brnCode,
        branchName: body.branchName,
        departCode: body.departCode,
        departName: body.departName,
        address: body.address,
        phone: body.phone,
        longitude: body.longitude,
        latitude: body.latitude,
        dao: body.dao,
        urlImg: body.urlImg,
        status: body.status,
        fax: body.fax
      });
    }).catch(err => {
      this.toastr.error(err.json().message, 'Thất bại!');
    });
  }
  resetForm() {
    this.router.navigateByUrl('/transaction-room');
  }
}




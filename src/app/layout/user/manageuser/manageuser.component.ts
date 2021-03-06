import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NCBService } from '../../../services/ncb.service';
import { Helper } from '../../../helper';
import { Router } from '@angular/router';

@Component({
    selector: 'app-manageuser',
    templateUrl: './manageuser.component.html',
    styleUrls: ['./manageuser.component.scss'],
    providers: [NCBService, Helper]
})
export class ManageUserComponent implements OnInit {
    dataForm: FormGroup;
    submitted = false;
    listPGD: any = [];
    listBranch: any = [];
    listRole: any = [];
    user = {
        password: ''
    };

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private ncbService: NCBService,
        private helper: Helper,
        public router: Router
    ) {}

    ngOnInit() {
        this.dataForm = this.formBuilder.group(
            {
                // tslint:disable-next-line:max-line-length
                branchCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
                transactionCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
                userCode: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
                userName: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
                fullName: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
                password: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
                re_password: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
                email: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
                roleId: ['', Validators.compose([Validators.required, this.helper.noWhitespaceValidator])],
                phone: ['', Validators.compose([Validators.maxLength(13), this.helper.noWhitespaceValidator])]
            },
            {
                validator: this.helper.MustMatch('password', 're_password')
            }
        );

        this.getBranchs();
        this.getListRole();
        this.getAllPGD();
    }
    get Form() {
        return this.dataForm.controls;
    }

    getBranchs() {
        this.listBranch = [];
        this.ncbService
            .getBranchs()
            .then(result => {
                result.json().body.forEach(element => {
                    this.listBranch.push({
                        code: element.brnCode,
                        name: element.branchName
                    });
                });
            })
            .catch(err => {
                this.toastr.error('Không lấy được dự liệu chi nhánh!', 'Thất bại!');
            });
    }
    async onChangePGD(value) {
        this.dataForm.patchValue({
            transactionCode: ''
        });
        if (value === '') {
            await this.getAllPGD();
        } else {
            await this.getPGD(value);
        }
    }
    getPGD(value) {
        this.listPGD = [];
        this.ncbService
            .getPGD({ brnCode: value })
            .then(result => {
                result.json().body.content.forEach(element => {
                    this.listPGD.push({
                        code: element.departCode,
                        name: element.departName
                    });
                });
            })
            .catch(err => {
                this.toastr.error('Không lấy được dữ liệu phòng giao dịch', 'Thất bại');
            });
    }
    getAllPGD() {
        this.listPGD = [];
        this.ncbService
            .getListPGD()
            .then(result => {
                result.json().body.forEach(element => {
                    this.listPGD.push({
                        code: element.departCode,
                        name: element.departName
                    });
                });
            })
            .catch(err => {
                this.toastr.error('Không lấy được dữ liệu phòng giao dịch', 'Thất bại');
            });
    }
    getListRole() {
        this.listRole = [];
        this.ncbService
            .searchRoles({
                status: 'A',
                roleName: '',
                page: 1,
                size: 1000
            })
            .then(result => {
                result.json().body.content.forEach(element => {
                    this.listRole.push({
                        code: element.roleId,
                        name: element.roleName
                    });
                });
            })
            .catch(err => {
                this.toastr.error('Không lấy được dự liệu phân quyền!', 'Thất bại!');
            });
    }
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.dataForm.invalid) {
            return;
        }
        this.ncbService
            .createUser(this.dataForm.value)
            .then(result => {
                if (result.status === 200) {
                    if (result.json().code === '00') {
                        this.toastr.success('Thêm mới thành công', 'Thành công!');
                        setTimeout(() => {
                            this.router.navigateByUrl('/user');
                        }, 500);
                    } else if (result.json().code === '404') {
                        this.toastr.error('Tài khoản đã tồn tại', 'Thất bại!');
                    } else {
                        this.toastr.error('Thêm mới không thành công', 'Thất bại!');
                    }
                } else {
                    this.toastr.error('Thêm mới không thành công', 'Thất bại!');
                }
            })
            .catch(err => {
                this.toastr.error('Thêm mới không thành công', 'Thất bại!');
            });
    }
    resetForm() {
        this.router.navigateByUrl('/user');
    }
    noWhitespaceValidator(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { whitespace: true };
    }
}

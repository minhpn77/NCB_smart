import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Helper } from '../helper';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()],
    providers: [Helper]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    submitted = false;
    processLogin: any = 0;
    page_back: any = '';
    return_url: any = '';
    isProcessLoad: any = 0;
    constructor(
        public router: Router,
        private formBuilder: FormBuilder,
        public authService: AuthService,
        public helper: Helper,
        private toastr: ToastrService,
    ) {}

    ngOnInit() {
        this.return_url    = this.helper.getParameterByName('return_url');
        this.page_back    = this.helper.getParameterByName('call-back');
        this.loginForm = this.formBuilder.group({
            userName: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])],
            password: ['', Validators.compose([Validators.required, Validators.pattern(/^((?!\s{1,}).)*$/)])]
          });
    }
    get Form() { return this.loginForm.controls; }

    keyDownFunction(event) {
        if (event.keyCode === 13) {
            this.onLoggedin();
        }
    }

    onLoggedin() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        this.isProcessLoad = 1;
        this.authService.login(this.loginForm.value)
            .then((result) => {
                localStorage.setItem('token', result.json().body.token ? result.json().body.token : null);
                localStorage.setItem('profile', JSON.stringify(result.json().body));
                if (this.page_back !== '' && this.page_back != null && this.page_back !== undefined) {
                    this.router.navigateByUrl(this.page_back);
                } else {
                    localStorage.setItem('isLoggedin', 'true');
                    if (result.json().body.loginCount === 1) {
                        this.router.navigateByUrl('/user/change-password');
                    } else {
                        this.router.navigateByUrl('/user/profile');
                    }
                }
                //
                if (this.return_url !== '' && this.return_url != null && this.return_url !== undefined) {
                    window.location.href = this.return_url;
                } else {
                    localStorage.setItem('isLoggedin', 'true');
                    if (result.json().body.passChange === '0') {
                        this.router.navigateByUrl('/user/change-password');
                    } else {
                        this.router.navigateByUrl('/user/profile');
                    }
                }
                        // this.onLoadAfterLogin(result);
                this.isProcessLoad = 0;
                })
        .catch((err) => {
            this.isProcessLoad = 0;
            if (err.status === 401) {
                if (parseInt(err.json().code) === 402) {
                    this.toastr.error('Tài khoản chưa được active. Vui lòng liên hệ admin!', 'Thất bại!');
                } else {
                    this.toastr.error('Vui lòng kiểm tra lại thông tin đăng nhập!', 'Thất bại!');
                }
            } else if (err.status === 402) {
                this.toastr.error('Tài khoản chưa được active. Vui lòng liên hệ admin!', 'Thất bại!');
            } else if (err.status === 0) {
                this.toastr.error('Không có kết nối đến máy chủ', 'Lỗi Internet!');
            } else {
                this.toastr.error(err.description, 'Thất bại!');
            }
        });
      }

    onLoadAfterLogin(data): void {
        localStorage.setItem('token', data.headers.get('Authorization'));
        localStorage.setItem('profile', JSON.stringify(data.json().body));
        if (this.page_back !== '' && this.page_back != null && this.page_back !== undefined) {
            this.router.navigateByUrl(this.page_back);
        } else {
            localStorage.setItem('isLoggedin', 'true');
            this.router.navigateByUrl('/user/profile');

        }
        //
        if (this.return_url !== '' && this.return_url != null && this.return_url !== undefined) {
            window.location.href = this.return_url;
        } else {
            localStorage.setItem('isLoggedin', 'true');
            this.router.navigateByUrl('/user/profile');
        }



    }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { HpCostRoutingModule } from './hpcost.routing.module';
 import { ListComponent } from './list/list.component';
 import { EditComponent } from './edit/edit.component';
 import { CreateComponent } from './create/create.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
   declarations: [ListComponent, EditComponent, CreateComponent ],
  imports: [
    CommonModule,  HpCostRoutingModule,
    PageHeaderModule, NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    CKEditorModule,
    SweetAlert2Module.forRoot({
        buttonsStyling: false,
        customClass: 'modal-content',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn'
    }),
    OrderModule
  ]
})
export class HpCostsModule { }

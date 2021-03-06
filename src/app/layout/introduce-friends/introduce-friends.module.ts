import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntroduceFriendsRoutingModule } from './introduce-friends-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { PageHeaderModule } from '../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditDisComponent } from './edit-dis/edit-dis.component';


@NgModule({
  declarations: [CreateComponent, ListComponent, EditComponent, EditDisComponent],
  imports: [
    PageHeaderModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IntroduceFriendsRoutingModule,
    NgbModule
  ]
})
export class IntroduceFriendsModule { }

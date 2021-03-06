import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { HistoryComponent } from './history/history.component';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'front-page', component: FrontPageComponent, canActivate: [ AuthGuard ]},
  { path: 'add-task', component: AddTaskComponent, canActivate: [ AuthGuard ]},
  { path: 'history', component: HistoryComponent, canActivate: [ AuthGuard ]},  
  { path: '',   redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

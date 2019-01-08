import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { ViewTaskComponent } from './components/view-task/view-task.component';

const routes: Routes = [
  { path: 'add-task', component: AddTaskComponent },
  { path: 'view-task', component: ViewTaskComponent },
  {
    path: '', redirectTo: '/view-task',
    pathMatch: 'full'
  },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

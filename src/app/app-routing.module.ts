import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { List2Component } from './list2/list2.component';

const routes: Routes = [
  { path: 'list1', component: ListComponent },
  { path: 'list2', component: List2Component },
  { path: '**', redirectTo: 'list1' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

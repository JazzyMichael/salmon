import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutPage } from './about.page';

const routes: Routes = [
  {
    path: '',
    component: AboutPage,
    children: [
      {
        path: 'app',
        loadChildren: () => import('./app/app.module').then( m => m.AppPageModule)
      },
      {
        path: 'fish',
        loadChildren: () => import('./fish/fish.module').then( m => m.FishPageModule)
      },
      {
        path: '',
        redirectTo: 'app'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutPageRoutingModule {}

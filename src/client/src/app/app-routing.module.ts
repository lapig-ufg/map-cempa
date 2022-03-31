import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from "./error/error.component";

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/components.module')
      .then(m => m.ComponentsModule),
  },
  {
    path: '**',
    component: ErrorComponent,
  },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './../guard/auth/auth.guard';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'default', pathMatch: 'full', redirectTo : 'login'},
  { path: 'login', loadChildren: '../pages/login/login.module#LoginPageModule'},
  { path: 'home', loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule),canActivate: [AuthGuard]},
  
  { path: 'registro', loadChildren: '../pages/registro/registro/registro.module#RegistroPageModule'},


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

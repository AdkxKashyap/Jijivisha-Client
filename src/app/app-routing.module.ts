import { NgModule } from '@angular/core';
import { Routes, RouterModule,ExtraOptions } from '@angular/router';
import { IndiaComponent } from './india/india.component';
import { MainComponentComponent } from './main-component/main-component.component';
import { NewsComponent } from './news/news.component';
import { MythBustersComponent } from './myth-busters/myth-busters.component';

const routerOptions: ExtraOptions = {
  useHash:true,
  anchorScrolling: 'enabled'
}

const routes: Routes = [
  {path:'',component:IndiaComponent},
  {path:'world',component:MainComponentComponent},
  {path:'news',component:NewsComponent},
  {path:'mythbusters',component:MythBustersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,routerOptions),],
  exports: [RouterModule]
})
export class AppRoutingModule { }

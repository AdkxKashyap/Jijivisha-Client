import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponentComponent } from './main-component/main-component.component';
import { HttpClientModule } from '@angular/common/http'; 
import { GetCovidDataService } from './Service/GetCovidData/get-covid-data.service';
import { NavbarComponent } from './navbar/navbar.component';
import { GetLatestAggDataService } from './Service/GetCovidData/GetLatestAggCOVIDData/get-latest-agg-data.service';
import { GetAllAggDataService } from './Service/GetAllAggData/get-all-agg-data.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IndiaComponent } from './india/india.component';
import { GetIndiaDataService } from './Service/GetAllIndiaData/get-india-data.service';
import { NewsComponent } from './news/news.component';
import { GetLatestNewsService } from './Service/GetLatestNews/get-latest-news.service';
import { FloatBtnComponent } from './float-btn/float-btn.component';
import { LoadingElementComponent } from './loading-element/loading-element.component';
import { MythBustersComponent } from './myth-busters/myth-busters.component';
import { GetMythbusterService } from './Service/GetMythBusters/get-mythbuster.service';
import { FooterComponent } from './footer/footer.component';
import { IndiaDistrictComponent } from './india-district/india-district.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponentComponent,
    NavbarComponent,
    IndiaComponent,
    NewsComponent,
    FloatBtnComponent,
    LoadingElementComponent,
    MythBustersComponent,
    FooterComponent,
    IndiaDistrictComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [GetCovidDataService,GetLatestAggDataService,GetAllAggDataService,GetIndiaDataService,GetLatestNewsService,GetMythbusterService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class GetCovidDataService {

  constructor(private http:HttpClient ) { }
    url:any
  getData():Observable<any>{
    this.url=environment.PORT+"/Jijivisha/v1.0/GetAllLatestData"
    return this.http.get(this.url)
  }
}

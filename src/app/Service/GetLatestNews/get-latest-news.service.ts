import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class GetLatestNewsService {

  constructor(private http:HttpClient) { }
   url=environment.PORT

  getIndiaNews():Observable<any>{
    return this.http.get(this.url+"/Jijivisha/v1.0/GetAllLatestIndiaNews")
  } 
  getWorldNews():Observable<any>{
    return this.http.get(this.url+"/Jijivisha/v1.0/GetAllLatestWorldNews")
  } 
}

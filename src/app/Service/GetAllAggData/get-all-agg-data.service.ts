import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class GetAllAggDataService {

  constructor(private http:HttpClient) { }
  url:any
  getData():Observable<any>{
    this.url=environment.PORT+"/Jijivisha/v1.0/GetAllAggData?N=12"
    return this.http.get(this.url)
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetLatestAggDataService {

  constructor(private http:HttpClient) { }
  url:any
  getData():Observable<any>{
    this.url=environment.PORT+"/Jijivisha/v1.0/GetLatestAggData"
    return this.http.get(this.url)
  }
}

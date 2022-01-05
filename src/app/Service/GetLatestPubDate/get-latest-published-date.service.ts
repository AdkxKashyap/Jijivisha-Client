import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class GetLatestPublishedDateService {

  constructor(private http : HttpClient) { }
  url:any
  isDataUpdated(date:String):Observable<any>{
    this.url=environment.PORT+"/Jijivisha/v1.0/IsDataUpdated?date="+date
    return this.http.get(this.url)
  }
}

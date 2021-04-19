import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
//Gets only latest india data
export class GetIndiaDataService {

  constructor(private http:HttpClient) { }
  url:any
  //Will only return the latest covid data
  getData():Observable<any>{
    this.url=environment.PORT+"/Jijivisha/v1.0/GetLatestIndiaData"
    return this.http.get(this.url)
  }

  getDataByState(state:String,N:Number):Observable<any>{
    this.url=environment.PORT+"/Jijivisha/v1.0/GetDataByState?state="+state+"&N="+N
    return this.http.get(this.url)
  }

  getAllAggData():Observable<any>{
    //N is the no. of docs to be fetched
    this.url=environment.PORT+"/Jijivisha/v1.0/GetAllAggIndiaData?N=12"
    return this.http.get(this.url)
  }

  getDistrictsData(state:String):Observable<any>{
    //district data from particular state will be fetched
    //N is the number of documents 
    this.url=environment.PORT+"/Jijivisha/v1.0/GetLatestIndiaDistrictData?state="+state
    return this.http.get(this.url)
  }
}

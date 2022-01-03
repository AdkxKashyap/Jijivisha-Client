import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetIndiaDataService } from '../Service/GetAllIndiaData/get-india-data.service';
import { environment } from "../../environments/environment";

declare const google:any
declare const AOS:any
@Component({
  selector: 'app-india-district',
  templateUrl: './india-district.component.html',
  styleUrls: ['./india-district.component.css']
})
export class IndiaDistrictComponent implements OnInit {
  
  constructor(private route:ActivatedRoute,private getAllIndiaData:GetIndiaDataService) { }

  ngOnInit() {

    //for scroll animations
    AOS.init({
      disableMutationObserver:false,
      offset: 200, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 900, // values from 0 to 3000, with step 50ms
      easing: "ease", // default easing for AOS animations
      once: false, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
      anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
    });

    this.route.params.subscribe((res)=>{
      this.state=res.state
    })
    this.getAllIndiaData.getDistrictsData(this.state).subscribe(res=>{
      
      this.districtsData=JSON.parse(res[0].covid_data[0].districts)
      console.log(this.districtsData)
      localStorage.setItem("districtData",JSON.stringify(this.districtsData))
      this.districtsDataList=this.getDistrictDataList()

      console.log(this.districtsDataList)
    },err=>{
      alert(err)
    })
    this.getAllIndiaData.getDataByState(this.state,12).subscribe(res=>{
      // console.log(res)
      this.stateData=res
      localStorage.setItem("stateData",JSON.stringify(this.stateData))
      this.lineChartInit()
      this.latestStateData=this.getLatestStateData()
      // console.log(this.latestStateData)
    },err=>{
      alert(err)
    })
    this.getdataLastUpdatedTime()

    // make google chart responsive
    window.addEventListener("resize", () => {
      // this.drawRegionsMap();
      this.drawLineChart();
    });
  }
  state:String
  districtsData:any
  districtsDataList:any[] | boolean
  stateData:any
  lastUpdated:any
  latestStateData:any
  monthsIndex:String[]
  latestAggStateData:{}
  //Init line charts
  //for line charts
  lineChartInit() {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(this.drawLineChart);
  }

  drawLineChart() {
    var monthsIndex = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
  
    // Chart for total cases
    var stateData:any[] = JSON.parse(
      localStorage.getItem("stateData")
    )
   
    var totalCasesList = [];
    var totalDeathsList = [];
    var totalRecoveredList = [];
    // let activeCasesList = [];
    var totalTestedList=[]

      totalCasesList=stateData.filter(res=>{
        if(!res.covid_data[0].confirmed){
          return false
        }
        return true
      }).map(res=>{

        let dateTmp=new Date(res.published)
        let date=dateTmp.getDate().toString()+monthsIndex[dateTmp.getMonth()]
        let data=res.covid_data[0].confirmed
        
        if(typeof(data)=="number"){
          return [date,data]
        }  
        else if(typeof(data)=="string"){
          //some string might have commas
          data=parseInt(data.replace(/,/g,""))
        }  
        return [date,data]
      })

      totalDeathsList=stateData.filter(res=>{
        if(!res.covid_data[0].deaths){
          return false
        }
        return true
      }).map(res=>{
        let dateTmp=new Date(res.published)
        let date=dateTmp.getDate().toString()+monthsIndex[dateTmp.getMonth()]
        let data=res.covid_data[0].deaths
        
        if(typeof(data)=="number"){
          return [date,data]
        }  
        else if(typeof(data)=="string"){
          //some string might have commas
          data=parseInt(data.replace(/,/g,"").trim())
        }  
        return [date,data]
      })
      totalRecoveredList=stateData.filter(res=>{
        if(!res.covid_data[0].recovered){
          return false
        }
        return true
      }).map(res=>{
        let dateTmp=new Date(res.published)
        let date=dateTmp.getDate().toString()+monthsIndex[dateTmp.getMonth()]
        let data=res.covid_data[0].recovered
        
        if(typeof(data)=="number"){
          return [date,data]
        }  
        else if(typeof(data)=="string"){
          //some string might have commas
          data=parseInt(data.replace(/,/g,""))
        }  
        return [date,data]
      })

      totalTestedList=stateData.filter(res=>{
        if(!res.covid_data[0].tested){
          return false
        }
        return true
      }).map(res=>{
        let dateTmp=new Date(res.published)
        let date=dateTmp.getDate().toString()+monthsIndex[dateTmp.getMonth()]
        let data=res.covid_data[0].tested
        
        if(typeof(data)=="number"){
          return [date,data]
        }  
        else if(typeof(data)=="string"){
          //some string might have commas
          data=parseInt(data.replace(/,/g,""))
        }  
        return [date,data]
      })
      console.log(totalCasesList)

  
    totalCasesList.unshift(
      [["Date"], ["Total Cases"]],
    );
    totalRecoveredList.unshift(
      [["Date"], ["Recovered"]],
      
    );
    totalDeathsList.unshift(
      [["Date"], ["Deaths"]],
      
    );
    totalTestedList.unshift(
      [["Date"], ["Total Tested"]],
    );
   
    // //For Total Cases Chart
    var dataTotalCases = google.visualization.arrayToDataTable(totalCasesList);
    var optionsTotalCases = {
      curveType: "function",
      legend: "none",
      animation: {
        duration: 3000,
        easing: "out",
        startup: "true",
      },
      series: {
        0: {
          color: "#00bcd4",
        },
      },
    };

    var chartTotalCases = new google.visualization.LineChart(
      document.getElementById("curve_chart_totalcases")
    );
    chartTotalCases.draw(dataTotalCases, optionsTotalCases);

    //For Total Recovered Chart
    var dataRecovered = google.visualization.arrayToDataTable(
      totalRecoveredList
    );
    var optionsRecovered = {
      curveType: "function",
      legend: "none",
      animation: {
        duration: 3000,
        easing: "out",
        startup: "true",
      },
      series: {
        0: {
          color: "#00897b",
        },
      },
    };

    var chartRecovered = new google.visualization.LineChart(
      document.getElementById("curve_chart_totalrecovered")
    );
    chartRecovered.draw(dataRecovered, optionsRecovered);

    //For Total Deaths Chart
    var dataDeaths = google.visualization.arrayToDataTable(totalDeathsList);
    var optionsDeaths = {
      curveType: "function",
      legend: "none",
      animation: {
        duration: 3000,
        easing: "out",
        startup: "true",
      },
      series: {
        0: {
          color: "#673ab7",
        },
      },
    };

    var chartDeaths = new google.visualization.LineChart(
      document.getElementById("curve_chart_totaldeaths")
    );
    chartDeaths.draw(dataDeaths, optionsDeaths);

    //For Total Active Cases Chart
    var dataActive = google.visualization.arrayToDataTable(totalTestedList);
    var optionsActive = {
      curveType: "function",
      legend: "none",
      animation: {
        duration: 3000,
        easing: "out",
        startup: "true",
      },
      series: {
        0: {
          color: "#00bcd4",
        },
      },
    };

    var chartActive = new google.visualization.LineChart(
      document.getElementById("curve_chart_activecases")
    );
    chartActive.draw(dataActive, optionsActive);
  }
  getLatestStateData(){
    try {
      return this.stateData[this.stateData.length-1].covid_data[0]
    } catch (error) {
      alert(error)
    }
  }

  getDistrictDataList(){
    var data=this.districtsData
    if(data.hasOwnProperty('Unknown')){
      return false
    }
    var tmp=[]
     for(let key in data){
       let dict_tmp={
        "district":key,
        "total":data[key].total.confirmed,
        "recovered":data[key].total.recovered,
        "deaths":data[key].total.deceased,
        "tested":data[key].total.tested
       }
      tmp.push(dict_tmp)
    }
    return tmp
  }

  getdataLastUpdatedTime() {
    this.lastUpdated = localStorage.getItem("dataLastUpdated");
  }

  getDate(dateStr){
    var date=new Date(dateStr)
    var newDateStr=date.getDate().toString()+this.monthsIndex[date.getMonth()]
    return newDateStr
  }
  
}

import { Component, OnInit } from "@angular/core";
import { GetIndiaDataService } from "../Service/GetAllIndiaData/get-india-data.service";
import * as moment from "moment"
import { environment } from "../../environments/environment";
import { GetLatestPublishedDateService } from "../Service/GetLatestPubDate/get-latest-published-date.service";
declare const google: any;
declare const AOS: any;
@Component({
  selector: "app-india",
  templateUrl: "./india.component.html",
  styleUrls: ["./india.component.css"],
})
export class IndiaComponent implements OnInit {
  constructor(private getIndiaData: GetIndiaDataService, private checkDataUpdated: GetLatestPublishedDateService) {}

  ngOnInit() {
     //navbar init
     document.getElementById("animationDiv").classList.add("start-home");
     document.getElementsByClassName("nav-item")[0].classList.add("active");
    //adding event handlers
    
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
    
    //check latest pub date from localstorage if available.If updated data is available in cache,cache data is used else data fetched from server.
    this.checkLatestPubDate()
    
    

    // make google chart responsive
    window.addEventListener("resize", () => {
      // this.drawRegionsMap();
      this.drawLineChart();
    });

    this.monthsIndex = [
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
  }
  //variables
  allIndianStatesData: any;
  lastUpdated: any;
  allCovidData: any;
  allAggData: any;
  latestAggDataDict: any;
  allAggCovidCasesData: {};
  monthsIndex:(string)[]
  isCurrentDataUpdated:boolean;
  //Init Geo Charts
  geochartInit() {
    google.charts.load("current", {
      packages: ["geochart"],
      mapsApiKey: environment.GOOGLE_API_KEY,
    });
    google.charts.setOnLoadCallback(this.drawRegionsMap);
  }
  //Init line charts
  //for line charts
  lineChartInit() {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(this.drawLineChart);
  }
  fetchLatestData(){
    /** this method fetches latest data from server if current data in localstorage is outdated or there is no data   */
    
    //get state wise data form India
    this.getIndiaData.getData().subscribe((res) => {
      localStorage.setItem("latestPublishedDate",res[0].published)
      this.setAllIndianStatesData(res[0].covid_data)
      localStorage.setItem("indiaData", JSON.stringify(this.allIndianStatesData));
      this.geochartInit();
      this.setdataLastUpdatedTime()
    });

    //get all the aggregated data from india
    this.getIndiaData.getAllAggData().subscribe((res) => {
      this.setAllAggData(res);
      localStorage.setItem("allAggData", JSON.stringify(this.allAggData))
      this.getLatestAggCovidCases();
      this.getAllAggCovidCasesData();
      
      this.lineChartInit();
    });
  }
  drawRegionsMap() {
    var data_main = JSON.parse(localStorage.getItem("indiaData"));
    console.log(data_main);
    var dataArray = [];
    dataArray[0] = ["State", "Total Cases", "Deaths"];
    data_main.forEach((data) => {
      
      let tmpArr = [];

      let activeCases = data.confirmed
      var state = data.state;
      if(state == null) return;
      if (state.toLowerCase() == "odisha") {
        state = "Orissa";
      }
      let deaths = parseInt(data.deaths);
      tmpArr.push(state);
      tmpArr.push(parseInt(activeCases));
      tmpArr.push(deaths);
      dataArray.push(tmpArr);
    });

    var data = google.visualization.arrayToDataTable(dataArray);
    var options = {
      colorAxis: {
        colors: ["#ef9a9a", "#f44336", "#d32f2f", "#c62828", "#b71c1c"],
      },
      
      tooltip: {
        textStyle: {
          color: "#673ab7",
        },
      },
      region: "IN",
      resolution: "provinces",
    };

    var chart = new google.visualization.GeoChart(
      document.getElementById("chart_div")
    );
    chart.draw(data, options);
  }

  drawLineChart() {
    // Chart for total cases
    var resTotalCases:any[] = JSON.parse(
      localStorage.getItem("allIndiaAggCovidCasesData")
    ).allTotalCasesList;
    var resTotalDeaths:any[] = JSON.parse(
      localStorage.getItem("allIndiaAggCovidCasesData")
    ).allTotalDeathsList;
    var resTotalRecovered:any[] = JSON.parse(
      localStorage.getItem("allIndiaAggCovidCasesData")
    ).allTotalRecoveredCasesList;
    var resTotalActiveCases:any[] = JSON.parse(
      localStorage.getItem("allIndiaAggCovidCasesData")
    ).allTotalActiveCasesList;
    let totalCasesList = [];
    let totalDeathsList = [];
    let totalRecoveredList = [];
    let activeCasesList = [];
    
    let dataLen=resTotalCases.length
    let countTmp=0

    while (countTmp < dataLen) {
      let tmpArrTotalCases = [];
      let tmpArrRecovered = [];
      let tmpArrDeaths = [];
      let tmpArrActiveCases = [];

      let date=resTotalCases[countTmp].date
      
      tmpArrTotalCases.push(date);
      tmpArrRecovered.push(date);
      tmpArrDeaths.push(date);
      tmpArrActiveCases.push(date);

      tmpArrTotalCases.push(
        parseInt(resTotalCases[countTmp].data.replace(/,/g, ""))
      );
      tmpArrRecovered.push(
        parseInt(resTotalRecovered[countTmp].data.replace(/,/g, ""))
      );
      tmpArrDeaths.push(
        parseInt(resTotalDeaths[countTmp].data.replace(/,/g, ""))
      );
      tmpArrActiveCases.push(
        parseInt(resTotalActiveCases[countTmp].data.replace(/,/g, ""))
      );

      totalCasesList.push(tmpArrTotalCases);
      totalRecoveredList.push(tmpArrRecovered);
      totalDeathsList.push(tmpArrDeaths);
      activeCasesList.push(tmpArrActiveCases);
      countTmp = countTmp + 1;
    } 
    //pushing the first value
    totalCasesList.unshift(
      [["Date"], ["Total Cases"]],
    );
    totalRecoveredList.unshift(
      [["Date"], ["Recovered"]],
      
    );
    totalDeathsList.unshift(
      [["Date"], ["Deaths"]],
      
    );
    activeCasesList.unshift(
      [["Date"], ["Total Active Cases"]],
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
    var dataActive = google.visualization.arrayToDataTable(activeCasesList);
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
  setAllIndianStatesData(data){
    /**This method will set data used by the table and google map vizualization */
    this.allIndianStatesData = data;
  }

  setAllAggData(data){
    /**This method will set data used by google line chart vizualization */
    this.allAggData = data;
  }
  //This method will give all the aggregated data which is used by line chart
  getAllAggCovidCasesData() {
    let allCasesList = [];
    let allRecoveredList = [];
    let deaths = [];
    let activeCases = [];
    let allData = this.allAggData;
    let pubDate:Date
    let dateStr=""
    // console.log("allData",allData)
    allData.forEach((data) => {
       pubDate=new Date(data.published) 
      dateStr=pubDate.getDate().toString()+this.monthsIndex[pubDate.getMonth()]
      let covidData = data.covid_data[0];
      allCasesList.push({date:dateStr,data:covidData.total_cases});
      allRecoveredList.push({date:dateStr,data:covidData.total_recovered});
      deaths.push({date:dateStr,data:covidData.total_deaths});
      activeCases.push({date:dateStr,data:covidData.active_cases});
    });

    this.allAggCovidCasesData = {
      allTotalCasesList: allCasesList,
      allTotalRecoveredCasesList: allRecoveredList,
      allTotalDeathsList: deaths,
      allTotalActiveCasesList: activeCases,
    };
    
    localStorage.setItem(
      "allIndiaAggCovidCasesData",
      JSON.stringify(this.allAggCovidCasesData)
    );
  }
  //This method will only give the latest aggregated data,used by main counter
  getLatestAggCovidCases() {
    let allAggData:any[] = JSON.parse(localStorage.getItem("allAggData"))
    let latestData = allAggData[allAggData.length - 1].covid_data[0];

    this.latestAggDataDict = {
      totalCases: latestData.total_cases,
      deaths: latestData.total_deaths,
      recovered: latestData.total_recovered,
      activeCases: latestData.active_cases,
    };
    // console.log(this.latestAggDataDict)
  }

  setdataLastUpdatedTime() {
    var res = localStorage.getItem('latestPublishedDate')
    var date = new Date(res).getTime();
    this.lastUpdated = moment(date).fromNow();
    // console.log(this.lastUpdated)
    localStorage.setItem("dataLastUpdated",this.lastUpdated)
  }
  //check if latest pub date is available in localstorage
  //check if latest pub date is up to date
  checkLatestPubDate(){
    let date = localStorage.getItem('latestPublishedDate')
    if(!date) {
      this.isCurrentDataUpdated = false;
      this.fetchLatestData()
    }
    else if(date){
      this.checkDataUpdated.isDataUpdated(date).subscribe(res=>{
        if(res == false){
          this.isCurrentDataUpdated = false;
          this.fetchLatestData()
        }
        else if(res == true){
          this.geochartInit();
          this.setdataLastUpdatedTime()
          this.setAllIndianStatesData(JSON.parse(localStorage.getItem("indiaData")))
          this.setAllAggData(JSON.parse(localStorage.getItem("allAggData")))
          this.lineChartInit();
          this.getLatestAggCovidCases()
          this.isCurrentDataUpdated = true;
        }
      })
    }  
  }
}
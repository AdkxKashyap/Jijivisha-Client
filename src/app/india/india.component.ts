import { Component, OnInit } from "@angular/core";
import { GetIndiaDataService } from "../Service/GetAllIndiaData/get-india-data.service";
import * as moment from "moment"
import { environment } from "../../environments/environment";
declare const google: any;
declare const AOS: any;
@Component({
  selector: "app-india",
  templateUrl: "./india.component.html",
  styleUrls: ["./india.component.css"],
})
export class IndiaComponent implements OnInit {
  constructor(private getIndiaData: GetIndiaDataService) {}

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
   
    //get state wise data forom India
    this.getIndiaData.getData().subscribe((res) => {
      this.allCovidData = res;
      this.latestMainData = res[res.length - 1].covid_data;
    
      localStorage.setItem("indiaData", JSON.stringify(this.latestMainData));
      this.geochartInit();

      this.getdataLastUpdatedTime(res[res.length-1].published)
    });

    //get all the aggregated data from india
    this.getIndiaData.getAllAggData().subscribe((res) => {
      this.allAggData = res;
      this.getAllAggCovidCasesData();
      this.getLatestAggCovidCases();
      this.lineChartInit();
    });

    // make google chart responsive
    window.addEventListener("resize", () => {
      this.drawRegionsMap();
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
  latestMainData: any;
  lastUpdated: any;
  allCovidData: any;
  allAggData: any;
  latestAggDataDict: any;
  allAggCovidCasesData: {};
  monthsIndex:(string)[]
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

  drawRegionsMap() {
    var data_main = JSON.parse(localStorage.getItem("indiaData"));
    var dataArray = [];
    dataArray[0] = ["State", "Total Cases", "Deaths"];
    data_main.forEach((data) => {
      let tmpArr = [];

      let activeCases = data.confirmed.replace(",", "");
      var state = data.state;
      if (state.toLowerCase() == "odisha") {
        state = "Orissa";
      }
      let deaths = parseInt(data.deaths.replace(",", ""));
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
    //Chart for total cases
    var resTotalCases = JSON.parse(
      localStorage.getItem("allIndiaAggCovidCasesData")
    ).allTotalCasesList;
    var resTotalDeaths = JSON.parse(
      localStorage.getItem("allIndiaAggCovidCasesData")
    ).allTotalDeathsList;
    var resTotalRecovered = JSON.parse(
      localStorage.getItem("allIndiaAggCovidCasesData")
    ).allTotalRecoveredCasesList;
    var resTotalActiveCases = JSON.parse(
      localStorage.getItem("allIndiaAggCovidCasesData")
    ).allTotalActiveCasesList;

    let totalCasesList = [];
    let totalDeathsList = [];
    let totalRecoveredList = [];
    let activeCasesList = [];
    
    //Only need 8 out of total data for the charts
    let skip = Math.floor(resTotalCases.length / 7);

    //the loop does not insert the first and last value in the array,those values are required and to be added later
    let countTmp = skip;
    while (countTmp < 7 * Math.floor(resTotalCases.length / 7)) {
      let tmpArrTotalCases = [];
      let tmpArrRecovered = [];
      let tmpArrDeaths = [];
      let tmpArrActiveCases = [];

      let date=resTotalCases[countTmp - 1].date
      
      tmpArrTotalCases.push(date);
      tmpArrRecovered.push(date);
      tmpArrDeaths.push(date);
      tmpArrActiveCases.push(date);

      tmpArrTotalCases.push(
        parseInt(resTotalCases[countTmp - 1].data.replace(/,/g, ""))
      );
      tmpArrRecovered.push(
        parseInt(resTotalRecovered[countTmp - 1].data.replace(/,/g, ""))
      );
      tmpArrDeaths.push(
        parseInt(resTotalDeaths[countTmp - 1].data.replace(/,/g, ""))
      );
      tmpArrActiveCases.push(
        parseInt(resTotalActiveCases[countTmp - 1].data.replace(/,/g, ""))
      );

      totalCasesList.push(tmpArrTotalCases);
      totalRecoveredList.push(tmpArrRecovered);
      totalDeathsList.push(tmpArrDeaths);
      activeCasesList.push(tmpArrActiveCases);
      countTmp = countTmp + skip;
    }
    //pushing the first value
    totalCasesList.unshift(
      [["Date"], ["Total Cases"]],
      [resTotalCases[0].date, parseInt(resTotalCases[0].data.replace(/,/g, ""))]
    );
    totalRecoveredList.unshift(
      [["Date"], ["Recovred"]],
      [resTotalCases[0].date, parseInt(resTotalRecovered[0].data.replace(/,/g, ""))]
    );
    totalDeathsList.unshift(
      [["Date"], ["Deaths"]],
      [resTotalCases[0].date, parseInt(resTotalDeaths[0].data.replace(/,/g, ""))]
    );
    activeCasesList.unshift(
      [["Date"], ["Total Active Cases"]],
      [resTotalCases[0].date, parseInt(resTotalActiveCases[0].data.replace(/,/g, ""))]
    );
    //pushing the last value
    let pubDate=resTotalCases[resTotalCases.length - 1].date
    totalCasesList.push([
      pubDate,
      parseInt(resTotalCases[resTotalCases.length - 1].data.replace(/,/g, "")),
    ]);
    totalRecoveredList.push([
      pubDate,
      parseInt(
        resTotalRecovered[resTotalRecovered.length - 1].data.replace(/,/g, "")
      ),
    ]);
    totalDeathsList.push([
      pubDate,
      parseInt(resTotalDeaths[resTotalDeaths.length - 1].data.replace(/,/g, "")),
    ]);
    activeCasesList.push([
      pubDate,
      parseInt(
        resTotalActiveCases[resTotalActiveCases.length - 1].data.replace(/,/g, "")
      ),
    ]);

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

  //This func will give all the aggregated data
  getAllAggCovidCasesData() {
    let allCasesList = [];
    let allRecoveredList = [];
    let deaths = [];
    let activeCases = [];
    let allData = this.allAggData;
    let pubDate:Date
    let dateStr=""
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
  //This func will only give the latest aggregated data
  getLatestAggCovidCases() {
    let latestData = this.allAggData[this.allAggData.length - 1].covid_data[0];

    this.latestAggDataDict = {
      totalCases: latestData.total_cases,
      deaths: latestData.total_deaths,
      recovered: latestData.total_recovered,
      activeCases: latestData.active_cases,
    };
  }

  getdataLastUpdatedTime(res) {
    var date = new Date(res).getTime();
    var now = Date.now();
    this.lastUpdated = moment(date).fromNow();
    localStorage.setItem("dataLastUpdated",this.lastUpdated)
  }
  
}

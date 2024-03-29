import { Component, OnInit } from "@angular/core";
import { GetCovidDataService } from "../Service/GetCovidData/get-covid-data.service";
import { environment } from "../../environments/environment";
import {Router} from '@angular/router';
import { GetLatestAggDataService } from "../Service/GetCovidData/GetLatestAggCOVIDData/get-latest-agg-data.service";
import { GetAllAggDataService } from "../Service/GetAllAggData/get-all-agg-data.service";
import { FormBuilder } from "@angular/forms";
import { GetLatestPublishedDateService } from "../Service/GetLatestPubDate/get-latest-published-date.service";
declare const google: any;
declare const AOS: any;
@Component({
  selector: "app-main-component",
  templateUrl: "./main-component.component.html",
  styleUrls: ["./main-component.component.css"],
})
export class MainComponentComponent implements OnInit {
  constructor(
    private getCovidData: GetCovidDataService,
    private getLatestAggData: GetLatestAggDataService,
    private getAlllatestAggData: GetAllAggDataService,
    private fb: FormBuilder,
    private checkDataUpdated:GetLatestPublishedDateService ,
    private router:Router
  ) {}
  ngOnInit() {
    //Navbar init
    document.getElementById("animationDiv").classList.add("start-world");
    document.getElementsByClassName("nav-item")[1].classList.add("active");
    //Scroll animations init
    AOS.init({
      disableMutationObserver: false,
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

    this.createtTableSearchForm();
    //Events inits
    // document.getElementById("searchClear").addEventListener("click",this.clearSearch)
  }

  //variables
  lastUpdated: any;
  mainData: any;
  latestAggData: any;
  allAggData: any;
  aggTotCases: any;
  aggDeathCases: any;
  aggRecoveredCases: any;
  aggActiveCases: any;
  tableSearchForm: any;
  isCurrentDataUpdated:any;
  monthsIndex = [
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

  fetchLatestData(){
    this.getCovidData.getData().subscribe((res) => {
      this.mainData = res[0].covid_data;
      this.getMainDataofCountries();
      localStorage.setItem("mainData", JSON.stringify(res));
      localStorage.setItem('World_latestPublishedDate', res[0].published);
      this.setdataLastUpdatedTime();
      this.geochartInit();
      this.createTableBody()
    });

    this.getLatestAggData.getData().subscribe((res) => {
      this.latestAggData = res[0].agg_covid_data;
      localStorage.setItem('latestAggData', JSON.stringify(this.latestAggData));
      this.aggTotCases = this.latestAggData.covid19_cases;
      this.aggDeathCases = this.latestAggData.total_deaths;
      this.aggRecoveredCases = this.latestAggData.total_recovered;
      this.aggActiveCases = this.latestAggData.total_infected;
    });



    this.getAlllatestAggData.getData().subscribe((res) => {
      this.allAggData = res;
      this.getAllCovidCases();
      this.getTotalDeaths();
      this.getTotalRecovered();
      this.getTotalInfected();
      this.lineChartInit();
      // localStorage.setItem("allGlobalLatestData",)
    });
  }

  geochartInit() {
    google.charts.load("current", {
      packages: ["geochart"],
      mapsApiKey: environment.GOOGLE_API_KEY,
    });
    google.charts.setOnLoadCallback(this.drawRegionsMap);
  }

  drawRegionsMap() {
    var data_main = JSON.parse(localStorage.getItem("mainAllCountriesData"));

    var dataArray = [];

    data_main.forEach((data) => {
      let tmpArr = [];
      dataArray[0] = ["Country", "Total Cases", "Deaths"];
      let activeCases = data.total_cases.replace(/,/g, "");
      var country = data.country;
      let deaths = parseInt(data.total_deaths.replace(/,/g, ""));
      tmpArr.push(country);
      tmpArr.push(parseInt(activeCases));
      tmpArr.push(deaths);
      dataArray.push(tmpArr);
    });
    var data = google.visualization.arrayToDataTable(dataArray);
    var options = {
      colorAxis: {
        colors: ["#ef9a9a", "#f44336", "#d32f2f", "#c62828", "#b71c1c"],
      },
      backgroundColor: "#e3f2fd",
      tooltip: {
        textStyle: {
          color: "#673ab7",
        },
      },
    };

    var chart = new google.visualization.GeoChart(
      document.getElementById("regions_div")
    );
    chart.draw(data, options);
  }

  //for line charts
  lineChartInit() {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(this.drawLineChart);
  }
  drawLineChart() {
    //Organizing data
    var resTotalCases:any[] = JSON.parse(localStorage.getItem("allCovidCasesList"));
    var resTotalDeaths:any[] = JSON.parse(localStorage.getItem("allDeathCases"));
    var resTotalRecovered:any[] = JSON.parse(
      localStorage.getItem("allRecoveredCases")
    );
    var resTotalActiveCases:any[] = JSON.parse(
      localStorage.getItem("allInfectedCases")
    );
    let totalCasesList = [];
    let totalDeathsList = [];
    let totalRecoveredList = [];
    let activeCasesList = [];

    //Only need 8 out of total data for the charts
    // let skip = Math.floor(resTotalCases.length / 7);

    // //the loop does not insert the first and last value in the array,those values are required and to be added later
    // let countTmp = skip;
    var countTmp=0
    var data_len=resTotalCases.length
    while (countTmp < data_len) {
      let tmpArrTotalCases = [];
      let tmpArrRecovered = [];
      let tmpArrDeaths = [];
      let tmpArrActiveCases = [];

      let date = resTotalCases[countTmp].date;

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
      [["Date"], ["Recovred"]],
     
    );
    totalDeathsList.unshift(
      [["Date"], ["Deaths"]],
     
    );
    activeCasesList.unshift(
      [["Date"], ["Total Active Cases"]],
     
    );
    //pushing the last value
    // let pubDate = resTotalCases[resTotalCases.length - 1].date;
    // totalCasesList.push([
    //   pubDate,
    //   parseInt(resTotalCases[resTotalCases.length - 1].data.replace(/,/g, "")),
    // ]);
    // totalRecoveredList.push([
    //   pubDate,
    //   parseInt(
    //     resTotalRecovered[resTotalRecovered.length - 1].data.replace(/,/g, "")
    //   ),
    // ]);
    // totalDeathsList.push([
    //   pubDate,
    //   parseInt(
    //     resTotalDeaths[resTotalDeaths.length - 1].data.replace(/,/g, "")
    //   ),
    // ]);
    // activeCasesList.push([
    //   pubDate,
    //   parseInt(
    //     resTotalActiveCases[resTotalActiveCases.length - 1].data.replace(
    //       /,/g,
    //       ""
    //     )
    //   ),
    // ]);

    // //Chart for total cases
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
          color: "#03a9f4",
        },
      },
    };

    var chartTotalCases = new google.visualization.LineChart(
      document.getElementById("curve_chart_totalcases")
    );
    chartTotalCases.draw(dataTotalCases, optionsTotalCases);

    //Chart for total deaths
    var chartDataDeaths = google.visualization.arrayToDataTable(
      totalDeathsList
    );

    var chartOptionsDeaths = {
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

    var chartForDeaths = new google.visualization.LineChart(
      document.getElementById("curve_chart_deathcases")
    );
    chartForDeaths.draw(chartDataDeaths, chartOptionsDeaths);

    // //Chart for Recovered cases

    var chartDataRecovered = google.visualization.arrayToDataTable(
      totalRecoveredList
    );

    var chartOptionsRecovered = {
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

    var chartForRecovered = new google.visualization.LineChart(
      document.getElementById("curve_chart_recoveredcases")
    );
    chartForRecovered.draw(chartDataRecovered, chartOptionsRecovered);

    // //Chart for total infected
    var chartDataInfected = google.visualization.arrayToDataTable(
      activeCasesList
    );

    var chartOptionsInfected = {
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

    var chartForInfected = new google.visualization.LineChart(
      document.getElementById("curve_chart_infectedcases")
    );
    chartForInfected.draw(chartDataInfected, chartOptionsInfected);
  }

  setdataLastUpdatedTime() {
    //this is for the last updated header
    this.lastUpdated = localStorage.getItem("dataLastUpdated");
    //set data last updated for world

  }

  getAllCovidCases() {
    var dataList = [];
    let pubDate: Date;
    let date = "";
    let data = {};
    this.allAggData.forEach((res) => {
      pubDate = new Date(res.published);
      date =
        pubDate.getDate().toString() +
        " " +
        this.monthsIndex[pubDate.getMonth()];
      data = { date: date, data: res.agg_covid_data.covid19_cases };
      dataList.push(data);
    });
    localStorage.setItem("allCovidCasesList", JSON.stringify(dataList));
  }
  getTotalDeaths() {
    let dataList = [];
    let pubDate: Date;
    let date = "";
    let data = {};
    this.allAggData.forEach((res) => {
      pubDate = new Date(res.published);
      date =
        pubDate.getDate().toString() +
        " " +
        this.monthsIndex[pubDate.getMonth()];
      data = { date: date, data: res.agg_covid_data.total_deaths };
      dataList.push(data);
    });
    localStorage.setItem("allDeathCases", JSON.stringify(dataList));
  }
  getTotalRecovered() {
    let dataList = [];
    let pubDate: Date;
    let date = "";
    let data = {};
    this.allAggData.forEach((res) => {
      pubDate = new Date(res.published);
      date =
        pubDate.getDate().toString() +
        " " +
        this.monthsIndex[pubDate.getMonth()];
      data = { date: date, data: res.agg_covid_data.total_recovered };
      dataList.push(data);
    });
    localStorage.setItem("allRecoveredCases", JSON.stringify(dataList));
  }

  getTotalInfected() {
    let dataList = [];
    let pubDate: Date;
    let date = "";
    let data = {};
    this.allAggData.forEach((res) => {
      pubDate = new Date(res.published);
      date =
        pubDate.getDate().toString() +
        " " +
        this.monthsIndex[pubDate.getMonth()];
      data = { date: date, data: res.agg_covid_data.total_infected };
      dataList.push(data);
    });
    localStorage.setItem("allInfectedCases", JSON.stringify(dataList));
  }

  setLatestAggData(){
    let latestAggData = JSON.parse(localStorage.getItem("latestAggData"))
    this.aggTotCases = latestAggData.covid19_cases;
      this.aggDeathCases = latestAggData.total_deaths;
      this.aggRecoveredCases = latestAggData.total_recovered;
      this.aggActiveCases = latestAggData.total_infected;
  }

  getMainDataofCountries() {
    let dataList = [];
    this.mainData.forEach((res) => {
      if (res.type == "country") {
        dataList.push(res);
      }
    });
    localStorage.setItem("mainAllCountriesData", JSON.stringify(dataList));
  }
  //search table

  createtTableSearchForm() {
    this.tableSearchForm = this.fb.group({
      search: [""],
    });
  }

  createTableBody() {

    let mainData = JSON.parse(localStorage.getItem("mainAllCountriesData"))
    let dataTableBody=document.getElementById("data-table-body")
    mainData.forEach((data)=>{
      if(data.type=="country" && data.country!=""){
        let newTableRow=document.createElement('tr')
      let dataCountry=document.createElement('th')
      let data_total_cases=document.createElement('td')
      let data_new_cases=document.createElement('td')
      let data_total_deaths=document.createElement('td')
      let data_new_deaths=document.createElement('td')
      let data_total_recovered=document.createElement('td')
      let data_active_cases=document.createElement('td')
      let data_serious_or_critical=document.createElement('td')
      let data_tot_cases_oneM_pop=document.createElement('td')
      let data_deaths_oneM_pop=document.createElement('td')
      let data_total_tests =document.createElement('td')
      let data_tests_oneM_pop  =document.createElement('td')

      dataCountry.scope="row"
      dataCountry.textContent=data.country
      data_total_cases.textContent=data.total_cases
      data_new_cases.textContent=data.new_cases
      data_new_cases.style.color="red"
      data_total_deaths.textContent=data.total_deaths
      data_new_deaths.textContent=data.new_deaths
      data_new_deaths.style.color="red"
      data_total_recovered.textContent=data.total_recovered
      data_active_cases.textContent=data.active_cases
      data_serious_or_critical.textContent=data.serious_or_critical
      data_tot_cases_oneM_pop.textContent=data.tot_cases_oneM_pop
      data_deaths_oneM_pop.textContent=data.deaths_oneM_pop
      data_total_tests.textContent=data.total_tests
      data_tests_oneM_pop.textContent=data.tests_oneM_pop

      newTableRow.appendChild(dataCountry)
      newTableRow.appendChild(data_total_cases)
      newTableRow.appendChild(data_new_cases)
      newTableRow.appendChild(data_total_deaths)
      newTableRow.appendChild(data_new_deaths)
      newTableRow.appendChild(data_total_recovered)
      newTableRow.appendChild(data_active_cases)
      newTableRow.appendChild(data_serious_or_critical)
      newTableRow.appendChild(data_tot_cases_oneM_pop)
      newTableRow.appendChild(data_deaths_oneM_pop)
      newTableRow.appendChild(data_total_tests)
      newTableRow.appendChild(data_tests_oneM_pop)
      dataTableBody.appendChild(newTableRow)
      }
      

    })
  }

  searchTable() {
    let searchTxt = this.tableSearchForm.value.search.toLowerCase();
    if (searchTxt == "") {
      document.getElementById("searchClear").style.visibility = "hidden";
    } else {
      document.getElementById("searchClear").style.visibility = "visible";
    }
    let tRow = document
      .getElementById("data-table")
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");
    for (let i = 0; i < tRow.length; i++) {
      let tData = tRow[i]
        .getElementsByTagName("th")[0]
        .textContent.toLowerCase();
      if (!tData.includes(searchTxt)) {
        tRow[i].style.display = "none";
      } else {
        tRow[i].style.display = "";
      }
    }
  }

  clearSearch() {
    (<HTMLInputElement>document.getElementById("searchBox")).value = "";
    document.getElementById("searchClear").style.visibility = "hidden";
    this.tableSearchForm.value.search = "";
    let tRow = document
      .getElementById("data-table")
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");
    for (let i = 0; i < tRow.length; i++) {
      if ((tRow[i].style.display = "none")) {
        tRow[i].style.display = "";
      }
    }
  }

  //check if latest pub date is available in localstorage
  //check if latest pub date is up to date
  checkLatestPubDate(){
  let date = localStorage.getItem('World_latestPublishedDate')
  // let date = "2020-06-16 20:16:21.145714"
  if(!date) {
    this.navigateToComponent('')
    this.isCurrentDataUpdated = false;
    this.fetchLatestData()
  }
  else if(date){
    this.checkDataUpdated.isDataUpdated(date).subscribe(res=>{
      if(res == false){
        this.isCurrentDataUpdated = false;
        this.fetchLatestData()
        // this.navigateToComponent('');
      }
      else if(res == true){
        this.geochartInit();
        this.createTableBody();
        this.setLatestAggData();
        this.lineChartInit();
        this.setdataLastUpdatedTime();
        this.isCurrentDataUpdated = true;
      }
    })
  }  
}

navigateToComponent(component:string){
  this.router.navigate([component]).then(res=>{
    if(res == false){
      this.router.navigate(['']);
    }
  })
}
}

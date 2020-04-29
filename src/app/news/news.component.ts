import { Component, OnInit,OnDestroy } from "@angular/core";
import { GetLatestNewsService } from "../Service/GetLatestNews/get-latest-news.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.css"],
})
export class NewsComponent implements OnInit,OnDestroy {
  constructor(
    private getLatestNewsService: GetLatestNewsService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    window.removeEventListener("scroll",()=>{
      var indiaDiv=document.getElementById("india_news-div")
      var worldDiv=document.getElementById("global_news-div")
    
      var indiaDivHeight=indiaDiv.clientHeight
      var worldDivHeight=worldDiv.clientHeight
      var windowHeight=window.innerHeight
      var scrollY=window.scrollY || window.pageYOffset
      
      var scrollPos=scrollY+windowHeight
      var indiaDivBeggPos=indiaDiv.getBoundingClientRect().top+scrollY
      var indiaDivEndPos=indiaDiv.getBoundingClientRect().top+scrollY+indiaDivHeight
      var worldDivBeggPos=worldDiv.getBoundingClientRect().top
      var worldDivEndPos=worldDiv.getBoundingClientRect().top+scrollY+worldDivHeight
      if(scrollPos>=indiaDivBeggPos && scrollPos<=indiaDivEndPos){
        document.getElementById("side-nav_mobile-nav").innerHTML="Global"
      }
      else if(scrollPos>=worldDivBeggPos && scrollPos<=worldDivEndPos){
        document.getElementById("side-nav_mobile-nav").innerHTML="India"
      }
    })
  }

  ngOnInit() {
    //Navbar Init
    document.getElementById("animationDiv").classList.add("start-news");
    document.getElementsByClassName("nav-item")[2].classList.add("active");
    //adding event handlers
    window.addEventListener('scroll',()=>{
    
    })


    //Get services
    this.getLatestNewsService.getIndiaNews().subscribe((res) => {
      this.newsIndia = res[0].news_data;
    });
    this.getLatestNewsService.getWorldNews().subscribe((res) => {
      this.newsWorld = res[0].news_data;
    });
   

    
  }
  //Variables
  newsIndia: any;
  newsWorld: any;
  
 
  //internal Navigation for mobile
  inView(){
 
  }

  mobileNav(event:any) {
    console.log(event.target.innerHTML)
    if (event.target.innerHTML.toLowerCase().trim()=="global"){
      this.router.navigate(['./news'],{fragment:'global_news'})
    }
   else if (event.target.innerHTML.toLowerCase().trim()=="india"){
    this.router.navigate(['./news'],{fragment:'india_news'})
  }
  }
 }

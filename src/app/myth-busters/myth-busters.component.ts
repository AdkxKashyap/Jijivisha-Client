import { Component, OnInit ,AfterViewChecked} from '@angular/core';
import { GetMythbusterService } from '../Service/GetMythBusters/get-mythbuster.service';
declare const AOS:any
@Component({
  selector: 'app-myth-busters',
  templateUrl: './myth-busters.component.html',
  styleUrls: ['./myth-busters.component.css']
})
export class MythBustersComponent implements OnInit {

  constructor(private mythBustersService:GetMythbusterService) { 
   
  }
  

  ngOnInit() {
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
     //navbar init
     document.getElementById("animationDiv").classList.add("start-mythb");
     document.getElementsByClassName("nav-item")[3].classList.add("active");

     

    this.mythBustersService.getData().subscribe(res=>{
      this.mainData=res[0].myth_busters_data
    
    })
  }

  ngAfterViewInit(){
    
  }

  
//Variables
mainData:any
}

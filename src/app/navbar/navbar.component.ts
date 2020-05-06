import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    
    // this.navItems=document.getElementsByClassName("nav-item")
    // this.navItems.forEach((item:Element)=>{
    //   item.addEventListener("click",this.animateNavLinks)
    // })
    // document.addEventListener("click", this.animateNavLinks);
  }
  navItems:any
  animateNavLinks(event) {
    // var elem=event.target as Element
    // console.log(elem)
    // var id = elem.id;
    // var className = "start-" + id;
    // document
    //   .getElementById("animationDiv")
    //   .classList.remove("start-home", "start-world", "start-news","start-mythb");
    // document.getElementById("animationDiv").classList.add(className);

    // var navLinks=document.getElementsByClassName("nav-item")
    
    // for(let i=0;i<navLinks.length;i++){
    //   navLinks[i].classList.remove("active")
    // }
    // elem.parentElement.classList.add("active")
  }

 
}

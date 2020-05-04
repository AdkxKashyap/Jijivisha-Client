import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-float-btn",
  templateUrl: "./float-btn.component.html",
  styleUrls: ["./float-btn.component.css"],
})
export class FloatBtnComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    var floatBtn = document.getElementById("float");
    floatBtn.addEventListener("click", this.goTopFunction);
    window.onscroll = () => {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        floatBtn.style.display = "block";
      } else {
        floatBtn.style.display = "none";
      }
    };
  }
  goTopFunction(event) {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
}

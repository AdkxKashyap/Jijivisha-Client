import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  ngOnInit() {
    // setInterval(()=>{
    //   console.log('test')
    // },1000)
  }
  title = 'jijivisha-client';
}

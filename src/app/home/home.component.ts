import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }
  public images = [
    {
      src: "../../assets/images/homepg2.jpg",
      alt: "inventory",
      class: "first"
    },
    {
      src: "../../assets/images/homepg4.jpg",
      alt: "inventory",
      class: "sec"
    },
    {
      src: "../../assets/images/homepg3.png",
      alt: "inventory",
      class: "third"
    },
    {
      src: "../../assets/images/homepg.jpg",
      alt: "inventory",
      class: "forth"
    }
  ]
  public show1stDiv: boolean = false
  ngOnInit(): void {
    var that = this
    setInterval(function () {
      that.show1stDiv = !that.show1stDiv
    }, 3500);
  }
  goToInventory() {
    this.router.navigate(['/stock'])
  }
}

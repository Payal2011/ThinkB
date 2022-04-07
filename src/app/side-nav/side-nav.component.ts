import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  constructor(private router: Router) { }
  appTitle = "ThinkB"
  showOverlay: boolean = true;
  opened: boolean;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  ngOnInit(): void {
  }
  openHome() {
    this.router.navigate(['/home'])
  }
  openStock() {
    this.router.navigate(['/stock'])
  }

}

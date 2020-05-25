import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  subscription: Subscription;
  login: Boolean;
  userName: String;
  constructor(private authService: AuthService) {
   
    const atoken = sessionStorage.getItem('accesstoken');
    if (atoken) {
      this.login = true;
      this.userName = JSON.parse(atoken).username;
    } else {
      this.login = false;
    }
   }

  ngOnInit(): void {
  }

  logout() {
    console.log('Logging out');
    this.authService.logout();
  }
}

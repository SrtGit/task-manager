import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error = '';

login = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    
  }

  // lomakkeen lähetys
  // authService palauttaa observablen jossa on joko true tai false
  onSubmit() {
    this.authService.login(this.login.get('userName').value, this.login.get('password').value)
      .subscribe(result => {
        if (result === true) {
          this.router.navigate(['/front-page']);
        } else {
          this.error = 'Tunnus tai salasana väärä';
        }
      });
    }

  
  
}

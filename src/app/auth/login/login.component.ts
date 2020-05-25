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
  errorDuringLogin : Boolean = false;
  registerError: Boolean = false;
  wantToRegister: Boolean = false;
login = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    
  }

  // Lähetetään käyttäjän syöttämät kirjautumis tai rekisteröitymistiedot
  onSubmit() {

    //Jos käyttäjä ei aio rekisteröityä
    if (!this.wantToRegister) {
        //Tilataan authServisen login metodi ja
        //Lähetetään sille form:ista userName ja password
        this.authService.login(this.login.get('userName').value, this.login.get('password').value)
          .subscribe(result => {
            
            //Jos login onnistui
            if (result === true) {
              //tutkitaan onko serviceen tallentunut
              //uudelleenohjaus osoitetta
              if (this.authService.redirectUrl) {
              this.router.navigate([this.authService.redirectUrl]);

              //Jos ei ole redirectUrl:aa ohjataan etusivulle
              } else this.router.navigate(['/front-page']);
            } else { //Jos login epäonnistui
              this.error = 'Tunnus tai salasana väärä';

              //Laitetaan hetkeksi error viesti näkyviin templaatissa
              this.errorDuringLogin = true;
              setTimeout(() => {
                this.errorDuringLogin = false;
              }, 3000);
            }
          });
    } else {
      //Tämä suoritetaan, jos käyttäjä haluaa rekisteröityä
      this.authService.register(this.login.get('userName').value, this.login.get('password').value).subscribe(result => {
        console.log(result);
        //jos rekisteröinti onnistui, suoritetaan onSubmit metodi, jonka avulla käyttäjä kirjataan sovellukseen
        if(result.success === true) {
          this.wantToRegister = false;
          this.onSubmit();
        } else {  //Jos rekisteröinti epäonnistui esitetään error viesti templaatissa
          this.registerError = true;
          setTimeout(() => {
            this.registerError = false;
          }, 3000);
        }
      });
    }
  }

  /**
   * Funktio vaihtaa templaatin näkymää rekisteröitymisen ja kirjautumisen välillä
   */
  registerView() {
    if (!this.wantToRegister) {
        this.wantToRegister = true;
    } else this.wantToRegister = false;
  }

  
  
}

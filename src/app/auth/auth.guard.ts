/*
  This Guard provides information about the user to the router. If the user is logged in, he can navigate to guarded locations.
*/

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auhtService: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      let url: string = state.url;
      return this.checkLogin(url);
    }

  checkLogin(url: string): boolean {

      //Jos kirjautumistiedot löytyy, palautetaan true
      if(sessionStorage.getItem('accesstoken')) return true;

      //Muutoin..
      //Tallennetaan haettu osoite uudelleenohjausta varten
      this.auhtService.redirectUrl = url;

      //Ohjataan authorisoimaton navigaatio login-sivulle
      this.router.navigate(['/login']);
      return false;
  }
  
}

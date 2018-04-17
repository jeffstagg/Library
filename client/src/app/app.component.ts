import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OidcSecurityService, AuthorizationResult } from 'angular-auth-oidc-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

  isAuthorized: boolean;
  isAuthorizedSubscription: Subscription;
  public publicBooks;
  public privateBooks;

  checksession = false;

  constructor(private oidcSecurityService: OidcSecurityService, private http: HttpClient){
    console.log('AppComponent STARTING');

    if (this.oidcSecurityService.moduleSetup) {
        this.doCallbackLogicIfRequired();
    } else {
        this.oidcSecurityService.onModuleSetup.subscribe(() => {
            this.doCallbackLogicIfRequired();
        });
    }

    this.oidcSecurityService.onCheckSessionChanged.subscribe(
        (checksession: boolean) => {
            console.log('...recieved a check session event');
            this.checksession = checksession;
        });

    this.oidcSecurityService.onAuthorizationResult.subscribe(
        (authorizationResult: AuthorizationResult) => {
            this.onAuthorizationResultComplete(authorizationResult);
        });
  }

  ngOnInit() {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized()
      .subscribe(isAuthorized => this.isAuthorized = isAuthorized);
  }

  ngOnDestroy() {
    this.isAuthorizedSubscription.unsubscribe();
  }

  signUp() {
    this.oidcSecurityService.authorize();
  }

  signOut() {
    this.oidcSecurityService.logoff();
  }

  getPublicBooks() {
    const publicBooksApiURL = 'http://localhost:5000/public';
    
    this.http.get(publicBooksApiURL).subscribe(
        response => this.publicBooks = response,
        error => console.log(error)
      );
  }

  getPrivateBooks() {
    const token = this.oidcSecurityService.getToken();
    const privateBooksApiURL = 'http://localhost:5000/private';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(privateBooksApiURL, { headers: headers }).subscribe(
      response => this.privateBooks = response,
      error => console.log(error)
    );

  }

  private doCallbackLogicIfRequired() {
    if (window.location.hash) {
        this.oidcSecurityService.authorizedCallback();
    }
  }

  private onAuthorizationResultComplete(authorizationResult: AuthorizationResult) {
    console.log('Auth result received:' + authorizationResult);
    if (authorizationResult === AuthorizationResult.unauthorized) {
        if (window.parent) {
            // sent from the child iframe, for example the silent renew
            window.parent.location.href = '/';
        } else {
            // sent from the main window
            window.location.href = '/';
        }
    }
}
}

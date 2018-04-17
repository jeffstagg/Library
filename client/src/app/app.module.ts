import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { RedirectComponent } from './redirect/redirect.component';

import {
  AuthModule,
  OidcSecurityService,
  OpenIDImplicitFlowConfiguration,
  OidcConfigService,
  AuthWellKnownEndpoints
} from 'angular-auth-oidc-client';

export function loadConfig(oidcConfigService: OidcConfigService) {
  console.log('App Initializer Starting');
  return () => oidcConfigService.load_using_custom_stsServer('https://login.microsoftonline.com/newazureb2cdemo.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_SignUpIn');
}

const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'redirect.html', component: RedirectComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    RedirectComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AuthModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [OidcConfigService],
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private oidcConfigService: OidcConfigService,
  ) {
    this.oidcConfigService.onConfigurationLoaded.subscribe(() => {

      const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
      openIDImplicitFlowConfiguration.stsServer = 'https://login.microsoftonline.com/tfp/newazureb2cdemo.onmicrosoft.com/b2c_1_signupin/oauth2/v2.0/';
      openIDImplicitFlowConfiguration.redirect_url = 'http://localhost:4200/redirect.html';
      openIDImplicitFlowConfiguration.client_id = 'e823eb1b-196a-4bde-a9d7-3af6715965b0'; //application id
      openIDImplicitFlowConfiguration.response_type = 'id_token token';
      openIDImplicitFlowConfiguration.scope = 'openid offline_access https://newazureb2cdemo.onmicrosoft.com/demoapi/demo.read'; //URL of newly added scope
      openIDImplicitFlowConfiguration.post_logout_redirect_uri = 'http://localhost:4200';
      openIDImplicitFlowConfiguration.post_login_route = '/';
      openIDImplicitFlowConfiguration.forbidden_route = '/';
      openIDImplicitFlowConfiguration.unauthorized_route = '/';
      openIDImplicitFlowConfiguration.auto_userinfo = false;
      openIDImplicitFlowConfiguration.log_console_warning_active = true;
      openIDImplicitFlowConfiguration.log_console_debug_active = true;
      openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 30;

      const authWellKnownEndpoints = new AuthWellKnownEndpoints();
      authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

      this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);

    });

    console.log('APP STARTING');
  }
}

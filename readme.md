## Intro

This repository serves as storage for demo code and slideshow for my presentation for the Global Azure Bootcamp 2018, *Signing Into Apps with Azure B2C*.

Included with the slideshow is the code for 2 projects:  
- .Net Core Web API  
- Angular Front-End Client Application

## Tools Required

- .Net Core 2
- NodeJS / NPM  
- Angular CLI

## To Use Code

#### .Net Core App

```c#
    services.AddAuthentication(options =>
    {
    	options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(jwtOptions =>
    {
    	jwtOptions.MetadataAddress = string.Format("https://login.microsoftonline.com/{0}/v2.0/.well-known/openid-configuration?p={1}",
    	"resourceUrl.onmicrosoft.com",
    	"PolicyName");

    	//Application ID
    	jwtOptions.Audience = "application-id-012345";

        jwtOptions.Events = new JwtBearerEvents
        {
        OnAuthenticationFailed = AuthenticationFailed
        };
    });
```

#### Angular App

>app.module.ts

```typescript
export function loadConfig(oidcConfigService: OidcConfigService) {
  console.log('App Initializer Starting');
  return () => oidcConfigService.load_using_custom_stsServer('https://login.microsoftonline.com/resourceUrl.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=PolicyName');
}
```

```typescript

export class AppModule { 
  constructor(
    private oidcSecurityService: OidcSecurityService,
    private oidcConfigService: OidcConfigService,
   ) {
    this.oidcConfigService.onConfigurationLoaded.subscribe(() => {

      const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
      openIDImplicitFlowConfiguration.stsServer = 'https://login.microsoftonline.com/tfp/resourceUrl.onmicrosoft.com/b2c_1_signupin/oauth2/v2.0/';
      openIDImplicitFlowConfiguration.redirect_url = 'http://localhost:4200/redirect.html';
      openIDImplicitFlowConfiguration.client_id = 'application-id-012345'; //application id
      openIDImplicitFlowConfiguration.response_type = 'id_token token';
      openIDImplicitFlowConfiguration.scope = 'openid offline_access https://resourceUrl.onmicrosoft.com/demoapi/demo.read'; //URL of newly added scope
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
```

>app.component.ts

```typescript
getPrivateBooks() {
    const token = this.oidcSecurityService.getToken();
    const privateBooksApiURL = 'http://localhost:5000/private';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(privateBooksApiURL, { headers: headers }).subscribe(
      response => this.privateBooks = response,
      error => console.log(error)
    );

  }
```

## To Run

#### API  
> dotnet run

#### Front-End Client  
> ng serve
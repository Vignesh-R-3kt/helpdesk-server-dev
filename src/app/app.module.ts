import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MainBodyComponent } from './components/main-body/main-body.component';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './components/loader/loader.component';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { MsalModule, MsalRedirectComponent, MsalGuardConfiguration, MsalInterceptorConfiguration } from "@azure/msal-angular";
import { InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { HTTPInterceptorInterceptor } from './http-interceptor.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorMessageComponent } from './components/login/error-message/error-message.component';
import { MatTooltipModule } from '@angular/material/tooltip';

export const msalGuardConfig: MsalGuardConfiguration = {
  interactionType: InteractionType.Popup,
  authRequest: {
    scopes: ['user.read'],
  },
};

export const msalInterceptorConfig: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Popup,
  protectedResourceMap: new Map([
    [environment.auth.resourceMapURL, ['user.read']],
  ]),
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainBodyComponent,
    HeaderComponent,
    NavbarComponent,
    LoaderComponent,
    ErrorMessageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: environment.auth.clientId,
          authority: environment.auth.authority,
          redirectUri: environment.auth.postLogoutRedirectUri,
        },
        cache: {
          cacheLocation: "sessionStorage",
        },
      }),
      msalGuardConfig,
      msalInterceptorConfig
    )
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HTTPInterceptorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }

import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './common/app-state';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ServicesModule } from './common/services/services.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        StoreModule.forRoot(reducers, { metaReducers }),
        isDevMode() ? StoreDevtoolsModule.instrument() : [],
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
        ServicesModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

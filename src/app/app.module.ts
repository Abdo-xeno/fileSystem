import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxGraphModule } from '@swimlane/ngx-graph';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SystemFilesTreeComponent } from './system-files-tree/system-files-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    SystemFilesTreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxGraphModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

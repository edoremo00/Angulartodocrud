import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { HomepageComponent } from './components/homepage/homepage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { SearchFilterPipe } from './search-filter.pipe';
import { TodoComponent } from './components/todo/todo.component';
import { ChangetodovisualizationPipe } from './services/changetodovisualization.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    RegisterComponent,
    SearchFilterPipe,
    TodoComponent,
    ChangetodovisualizationPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

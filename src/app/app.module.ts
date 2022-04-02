import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { HomepageComponent } from './components/homepage/homepage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';

import { TodoComponent } from './components/todo/todo.component';
import { ChangetodovisualizationPipe } from './pipes/changetodovisualization.pipe';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { TodofilterPipe } from './pipes/todofilter.pipe';
import { EditprofileComponent } from './editprofile/editprofile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    RegisterComponent,
    SearchFilterPipe,
    TodoComponent,
    ChangetodovisualizationPipe,
    TodofilterPipe,
    EditprofileComponent
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { RegisterComponent } from './components/register/register.component';
import { TodoComponent } from './components/todo/todo.component';
import { EditprofileComponent } from './editprofile/editprofile.component';

const routes: Routes = [
  {path:'home',component:HomepageComponent},
  {path:"",redirectTo:"/home",pathMatch:"full"},//setta pagina di default
  {path:'register',component:RegisterComponent},
  {path:'todo',component:TodoComponent},
  {path:'editprofile',component:EditprofileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

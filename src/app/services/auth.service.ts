import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Identityuserinterface } from 'src/interfaces/identityuserinterface';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

    apiauthbaseurl:string=environment.authbaseurl;
    userbaseurl:string=environment.userbaseurl;
    

  constructor(private http:HttpClient) {
  }

  Login(user:Identityuserinterface):Observable<any>{
    return this.http.post(`${this.apiauthbaseurl}Login`,JSON.stringify(user),{
      headers:new HttpHeaders({
        "Content-type":"application/json"
      }),
    });
  }

  Register(registeruser:Identityuserinterface):Observable<Identityuserinterface>{
    return this.http.post<Identityuserinterface>(`${this.apiauthbaseurl}Register`,registeruser,{
      headers:new HttpHeaders({
        "Content-type":"application/json"
      })
    })
  }

  RegisterGoogleUser(token:string):Observable<any>{
    return this.http.post<any>(`${this.apiauthbaseurl}ValidateGoogletoken`,{},{
      headers:new HttpHeaders({
        "Content-type":"application/json"
      }),params:new HttpParams().set('token',token)
    })
  }

  LogOut(external:boolean){
    external ? (window.sessionStorage.removeItem('externallogin'), window.sessionStorage.removeItem('googleuser')) : ""
    window.sessionStorage.removeItem('id')
    window.sessionStorage.removeItem('user')
    window.sessionStorage.removeItem('tok')
    
  }

 

}

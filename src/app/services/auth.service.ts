import { HttpClient,HttpHeaders } from '@angular/common/http';
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

  Getall():Observable<Identityuserinterface[]>{
    return this.http.get<Identityuserinterface[]>(`${this.userbaseurl}Getallusers`,{
      headers:new HttpHeaders({
        "Content-type":"application/json"
      })
    })
  }

}

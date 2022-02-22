import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Identityuserinterface } from 'src/interfaces/identityuserinterface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  userbaseurl:string=environment.userbaseurl

  Getall():Observable<Identityuserinterface[]>{
    return this.http.get<Identityuserinterface[]>(`${this.userbaseurl}Getallusers`,{
      headers:new HttpHeaders({
        "Content-type":"application/json"
      })
    })
  }

  Update(updateduser:Identityuserinterface):Observable<Identityuserinterface>|null{
    return this.http.put<Identityuserinterface>(`${this.userbaseurl}updateuser`,updateduser,{
      headers:new HttpHeaders({
        "Content-type":"application/json"
      })
    })
  }
}

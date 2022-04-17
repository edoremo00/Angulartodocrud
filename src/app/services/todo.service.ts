import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Itodointerface } from 'src/interfaces/todointeerface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todobaseurl:string=environment.todobaseurl;

  constructor(private http:HttpClient) { }

  GetAlltodos(foruserid:string):Observable<Itodointerface[]>{
    return this.http.get<Itodointerface[]>(`${this.todobaseurl}/Getallusertodo`,{
      headers:new HttpHeaders({
        "Content-type":"application/json"
      }),
      params:new HttpParams().set('foruserid',foruserid)//setto  i parametri in querystring
    })
  }

  GetallusertodoforExternalLogin(foruserid:string,Isexternalloginprovider:boolean):Observable<Itodointerface[]>{
    return this.http.get<Itodointerface[]>(`${this.todobaseurl}/Getallusertodo`,{
      headers:new HttpHeaders({
        "Content-type":"application/json"
      }),
      params:new HttpParams().set('foruserid',foruserid).append('externalloginuser',Isexternalloginprovider)
    })
  }

  UpdateTodo(todotoupdate:Itodointerface):Observable<Itodointerface|null>{
    return this.http.put<Itodointerface|null>(`${this.todobaseurl}/Updatetodo`,todotoupdate,{
      headers:new HttpHeaders({
        "Content-type":"application/json"
      })
    })
  }


  DeleteTodo(id:number):Observable<boolean>{
    return this.http.delete<boolean>(`${this.todobaseurl}/DeleteTodo/${id}`,{
      headers:new HttpHeaders({
        "Content-type":"application/json"
      })
    })
  }
}

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
      params:new HttpParams().set('foruserid',foruserid)//setto  i Aparametri in querystring
    })
  }
}

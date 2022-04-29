import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  private auth2:gapi.auth2.GoogleAuth|undefined
  private subject=new ReplaySubject<gapi.auth2.GoogleUser|null>(1)//avrà valori null o utente a seconda se sei loggato o meno
  googleloggeduser:any
  constructor(private router:Router,private ngzone:NgZone) {
    gapi.load('auth2',()=>{
     this.auth2= gapi.auth2.init({
        client_id:''
      })
    })
   }

   get Googleuserlogged(){
     return this.googleloggeduser
   }

   signIn(){
     return this.auth2!.signIn({

     }).then(user=>{
       debugger
       console.log(user)
       let id_token=user.getAuthResponse().id_token
      
      this.subject.next(user)//viene emesso valore da observable
      this.googleloggeduser=user
      window.sessionStorage.setItem('googleuser',JSON.stringify(user))
      //se queste due istruzioni sono invertite causa problemi al corretto render della pagina todo 
      
      this.ngzone.run(()=>this.router.navigate(['todo']))
      return id_token

     }).catch(()=>{
      this.subject.next(null)//emetto null a observable. qualcosa nella login non è andato a buon fine
      return null
     })
   }

   signOut(){
     this.auth2?.signOut().then(()=>{
       this.subject.next(null)
       window.sessionStorage.removeItem('googleuser')
       this.ngzone.run(()=>this.router.navigate(['home']))

     })
   }

   public observable():Observable<gapi.auth2.GoogleUser|null>{//miei component si iscriveranno a questo observable per avere 
    //valore dell'utente loggato o null se nessuno è loggato
     return this.subject.asObservable()
   }
}

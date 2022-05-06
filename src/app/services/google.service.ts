import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  private auth2:gapi.auth2.GoogleAuth|undefined
  //private calendar:any //CAPIRE SE SI PUò FARE COME FATTO CON VARIABILE AUTH2 MA NON PENSO
  //OGNI VOLTA DEVO QUINDI CARICARMI L'API?
  private subject=new ReplaySubject<gapi.auth2.GoogleUser|null>(1)//avrà valori null o utente a seconda se sei loggato o meno
  googleloggeduser:any
  
  
  constructor(private router:Router,private ngzone:NgZone) {
    //this.LoadCalendarApi()
    
    gapi.load('auth2',()=>{
     
     //let request= this.calendar=gapi.client.load('calendar','v3')
     this.auth2= gapi.auth2.init({
        client_id:'',
        scope:'https://www.googleapis.com/auth/calendar'//FONDAMENTALE METTERLO SENNO CALENDARIO NON ANDRà MAI
      })
    })
    //QUESTO CODICE è SUPERFLUO. NON SERVE
    /*gapi.load('calendar',()=>{
      this.calendar=gapi.client.init({
        clientId:'474094806386-tkedrgeu1vg8c3ug36edvb4gkhc3a87r.apps.googleusercontent.com',
        //scope:'https://www.googleapis.com/auth/calendar'
      })
    })*/
   }

   Testcalendar(){
    //FUNZIONA DOPO LOGIN
    //NON è POSSIBILE INIZIALIZZARE VARIABILE COME FATTO PER AUTH2?
    //OGNI VOLTA DEVO FARE IL LOAD?
    //INOLTRE LO SCOPE 
     gapi.client.load('calendar', 'v3').then(function () {
       gapi.client.calendar.calendarList.list().then(response => console.log(response)).catch(e => console.log('ERROR LISTING CALENDARS', e))
     }).catch(e => console.log('ERRORE LOAD CALENDAR API', e))
     
   }

   createEventinCalendar(){
     gapi.client.load('calendar','v3').then(function(){
       let eventinput:gapi.client.calendar.EventInput={
         summary:'creato da todo app :)',
         start:{
           date:moment(Date.now()).format('YYYY-MM-DD'),
           //dateTime:moment(Date.now()).format('YYYY-MM-DD h:mm:ss'),
           timeZone:'Europe/Rome'
         },
         end:{
           date:moment(hoursfromnow(2)).format('YYYY-MM-DD'),
           //dateTime:moment(hoursfromnow(2)).format('YYYY-MM-DD h:mm:ss'),
           timeZone:'Europe/Rome'

         }
       }
      
      gapi.client.calendar.events.insert({
        calendarId:'primary',
        resource:eventinput,
        sendNotifications:true,
      }).then((response:any)=>console.log(response)).catch((error:any)=>console.log('ERRORE INSERT',error))
      
      
     })
   }

    

   

   get Googleuserlogged(){
     return this.googleloggeduser
   }

   signIn(){
     return this.auth2!.signIn({

     }).then(user=>{
       console.log(user)
       let id_token=user.getAuthResponse().id_token
      
      this.subject.next(user)//viene emesso valore da observable
      this.googleloggeduser=user
      window.sessionStorage.setItem('externallogin',String(true))
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
       window.sessionStorage.removeItem('externallogin')
       window.sessionStorage.removeItem('tok')
       this.ngzone.run(()=>this.router.navigate(['home']))

     })
   }

   public observable():Observable<gapi.auth2.GoogleUser|null>{//miei component si iscriveranno a questo observable per avere 
    //valore dell'utente loggato o null se nessuno è loggato
     return this.subject.asObservable()
   }
}

const hoursfromnow=(n:any)=>new Date(Date.now()+n*1000*60*60)

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleService } from 'src/app/services/google.service';
import { Identityuserinterface } from 'src/interfaces/identityuserinterface';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  loginForm:FormGroup=new FormGroup({
    email:new FormControl("",[Validators.required,Validators.email]),
    password:new FormControl("",[Validators.required,Validators.minLength(6)])
  });
  constructor(private authservice:AuthService,private router:Router,private googleservice:GoogleService,private ref:ChangeDetectorRef) { }

  loggedGoogleuser:any

  googleuserservicesubscription:Subscription=new Subscription()//lo uso per disiscirvermi da observable

 
  get emailinputvalue(){
    return this.loginForm.get("email");
  }
  get passwordinputvalue(){
    return this.loginForm.get("password");
 }

  ngOnInit(): void {

    this.googleuserservicesubscription= this.googleservice.observable().subscribe({
      next:(googleuser)=>{
        if(googleuser){//solo se ho utente
         this.loggedGoogleuser=googleuser?.getBasicProfile().getEmail()
         
        }
       //this.loggedGoogleuser=googleuser?.getBasicProfile().getEmail()
       this.ref.detectChanges()//ascolto sempre i cambiamenti
       
      }
    })
  }

  printformloginvalue():void{
     let emailfield=document.getElementById("email") as HTMLInputElement;
     if(emailfield){
       console.log("valore email"+emailfield.value);
     }
     
  }

  Login():void{
    let usertologin:Identityuserinterface={
      email:this.emailinputvalue?.value,
      password:this.passwordinputvalue?.value
    };
    this.authservice.Login(usertologin).subscribe({
      next:(response:any)=>{//usa questa callback per ricevere valori da observable
       const token=response.token
       window.sessionStorage.setItem('tok',token)
       if(response.claims){
        let userid=response.claims.filter((c:any)=>c.type==="sub")[0].value
        window.sessionStorage.setItem('id',userid)
       }
      },error:(error:HttpErrorResponse)=>{//gestione errori
        console.warn(error.message)
      },
      complete:()=>{//observable completato.non chiamata in caso di errori
        this.router.navigate(['todo'])
      }
    })
  }

  signin(){//login con Google
    this.googleservice.signIn().then((token)=>{
      if(token){
        this.RegisterGoogleUser(token)
        //this.RegisterGoogleUser(id_token)//chiamare questa funzione per registrare utente Google su BACKEND
      }
    })
  }

  RegisterGoogleUser(id_token:string){
    return this.authservice.RegisterGoogleUser(id_token).subscribe({
      next:(result)=>{
        if(result.claims){
          let userid=result.claims.filter((c:any)=>c.type==="sub")[0].value
          sessionStorage.setItem('id',userid)
        }
        sessionStorage.setItem('tok',result.encodedPayload)
        
       
      },
      error:(error:HttpErrorResponse)=>{
        console.warn(error)
      }
    })
  }

  

}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
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
  constructor(private authservice:AuthService) { }

 
  get emailinputvalue(){
    return this.loginForm.get("email");
  }
  get passwordinputvalue(){
    return this.loginForm.get("password");
 }

  ngOnInit(): void {
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
       console.log(response);
       console.log(token);
       alert("ciao")
      },error:(error:HttpErrorResponse)=>{//gestione errori
        console.log(error.status)
      },
      complete:()=>{//observable completato.non chiamata in caso di errori
        alert("loggato")
      }
    })
  }

}

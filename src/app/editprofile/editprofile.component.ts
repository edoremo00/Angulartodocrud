import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GoogleService } from '../services/google.service';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss']
})
export class EditprofileComponent implements OnInit,AfterViewInit {

  externalLogin:string|null=window.sessionStorage.getItem('externallogin')//per sapere se utente loggato con Google o no
  constructor(private authservice:AuthService,private googleservice:GoogleService) { }
  inputfile:any;
  ngAfterViewInit(): void {
    this.inputfile=document.getElementById('formFileSm')
  }

  ngOnInit(): void {
  }

  

  async Onfileselected():Promise<void>{
    if(this.inputfile){
      let input=this.inputfile as HTMLInputElement
      let file=input.files
      if(file){
        console.log(file)
        let formdata=new FormData()
        formdata.append('file',file[0])
        await fetch('https://localhost:44335/api/Uploadfiles/Uploadfile',{
          method:'POST',
          body:formdata,
          
        })
      }
     
    }
  }

  SignOutGoogleorNormal() {
    this.externalLogin ? (this.googleservice.signOut(),
    this.authservice.LogOut(true))//rimuove mie chiavi da session storage
    : this.LogOut()

    
  }

  LogOut(){
    this.authservice.LogOut(false)
  }

}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { Identityuserinterface } from 'src/interfaces/identityuserinterface';
import { validatedate } from '../customvalidators/datevalidator';
import { passwordandconfirmpasswequal } from '../customvalidators/passwordandconfirmpassvalidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  usertoedit_todelete:Identityuserinterface={password:'',email:''};//per avere sempre utente cliccatoe poterlo aggiornare

  registerform:FormGroup=new FormGroup({
    name:new FormControl('',[Validators.required,Validators.minLength(1)]),
    lastname:new FormControl('',[Validators.required,Validators.minLength(1)]),
    username:new FormControl('',[Validators.required,Validators.minLength(1)]),
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required,Validators.minLength(6)]),
    confirmpassword:new FormControl('',[Validators.required,Validators.minLength(6),]),//passwordandconfirmpasswequal('') custom validator
    birthday:new FormControl('',[Validators.required,validatedate()])
  })

  updateuserform:FormGroup=new FormGroup({
    editname:new FormControl('',[Validators.required,Validators.minLength(1)]),
    editbirthday:new FormControl('',[Validators.required,validatedate()]),
    

  })

  get name(){
    return this.registerform.get('name')
  }

  get lastname(){
    return this.registerform.get('lastname')
  }

  get username(){
    return this.registerform.get('username')
  }

  get email(){
    return this.registerform.get('email')
  }

  get password(){
    return this.registerform.get('password')
  }

  get confirmpassword(){
    return this.registerform.get('confirmpassword')
  }

  get birthday(){
    return this.registerform.get('birthday')
  }


  //aggiungere datepicker a form e validatori in html magari uno anche custom

  constructor(private authservice:AuthService,private router:Router) { }
  users:Array<Identityuserinterface>=[];
  ngOnInit(): void {
     this.Getall()
  }

  Register():void{
    let usertoregister:Identityuserinterface={
      name:this.name?.value,
      lastname:this.lastname?.value,
      username:this.username?.value,
      email:this.email?.value,
      password:this.password?.value,
      confirmpassword:this.password?.value,
      birthday:this.birthday?.value

      
    }
    this.authservice.Register(usertoregister).subscribe({
      next:(user)=>{
        console.log(user)
      },
      error(err:HttpErrorResponse){
        console.log(err.status)
        alert('error in registering')
      },
      complete:()=>{
        this.router.navigate(['home'])
      }
    })
  }
  Getall(){
    this.authservice.Getall().subscribe({
      next:(getusers)=>{
        //this.users=getusers
        this.users=getusers
        this.users.map(U=>{//trasforma data utenti formattandola
          U.birthday= moment(U.birthday).format('YYYY-MM-DD').toString()
        })
        
      },error:(err:HttpErrorResponse)=>{
        console.log(err.status);
        alert("error getting users")
      }
    })
  }

  test():void{
    console.log('click save')
  }

  premuto():void{
    console.log('premuto tasto')
  }

  oneditmodalclosed(){//mostra popup di conferma
    var myModalEl = document.getElementById('modelId');
    if(myModalEl){
        myModalEl.addEventListener('hide.bs.modal', function (event) {
            let userchoice:boolean=confirm('data will be lost')
            event.stopImmediatePropagation()//se non presente qui a volte alert si triggera più volte se premuto annulla
            if(!userchoice){
              event.preventDefault()//impedisco a evento di propagarsi
            }else{
              event.stopImmediatePropagation()//faccio fare evento chiusura e stoppo propagazione in teoria
            }
           }
      );
    }
    
  }

 

  edituser(usertoedit:Identityuserinterface){
    this.usertoedit_todelete=usertoedit;
    this.updateuserform.patchValue({editname:usertoedit.username})
    this.updateuserform.patchValue({editbirthday:usertoedit.birthday})
  }
  deleteuser(usertodelete:Identityuserinterface){
    console.log("user to delete"+usertodelete.userid)
  }

}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
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

  userupdated:Identityuserinterface={password:'',email:''}
   buttonisloading:boolean=false;

  query:string="" //è il testo dell'input per filtrare

  checkfiltervalidity(stringtovalidate:string):boolean{//verifica che nel filtro ci sia almeno una lettera senno mostra un messaggio
     if(stringtovalidate.trim().length===0){
       return false
     }
     return true
  }

  clearfilter(inputtochangestatus?:any){
    this.query=""//reset valore filtro
    let filterusercontrol= inputtochangestatus as NgModel
    //filterusercontrol.control.markAsUntouched({onlySelf:true})//permette di nascondere poi messaggio di inserire una lettera per filtrare
    filterusercontrol.control.markAsPristine({onlySelf:true})
    //se nel template uso dirty(appena utente scrive). per non fare apparire errore bisogna resettare il campo a pristine

    //se nel template uso touched(utente scrive poi esce) per non fare apparire errore bisogna resettare il campo a untouched
  }
  
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

  //edituserform
  get editname(){
    return this.updateuserform.get('editname')
  }

  get editbirthday(){
    return this.updateuserform.get('editbirthday')
  }


  

  constructor(private authservice:AuthService,private router:Router,private userservice:UserService) { }
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
    this.userservice.Getall().subscribe({
      next:(getusers)=>{
        this.users=getusers
        this.users.map(U=>{//trasforma data utenti formattandola
          U.birthday= moment(U.birthday).format('YYYY-MM-DD').toString()
        });
        //FORMATTARE DATA MAGARI CON PIPE DI ANGULAR
        
        
      },error:(err:HttpErrorResponse)=>{
        console.log(err.status);
        alert("error getting users")
      }
    })
  }

  Edituser(){
    //this.editname?.value ?? this.usertoedit_todelete.username
    //this.editbirthday?.value ?? this.usertoedit_todelete.birthday
    //this.usertoedit_todelete.username=this.editname?.value
    //this.usertoedit_todelete.birthday=this.editbirthday?.value
    this.buttonisloading=true;
    this.userupdated=this.usertoedit_todelete
    console.log('vecchio valore',this.userupdated)
    let vecchionome:string|undefined=this.usertoedit_todelete.username
    let vecchiadata:string|undefined=this.usertoedit_todelete.birthday
    this.userupdated.username=this.editname?.value
    this.userupdated.birthday=this.editbirthday?.value
    console.log('nuovo valore',this.userupdated)
    //this.showloadinganimation('editusermodal','snackbar')
    this.userservice.Update(this.userupdated)?.subscribe({
      next:(updateduser)=>{
        console.table(updateduser)
      },error:(err:HttpErrorResponse)=>{
        
        //this.userupdated.username=this.usertoedit_todelete.username//RIASSEGNANDO VALORI COSì O CON OGGETTO DIRETTAMENTE NON VA
        //this.userupdated.birthday=this.usertoedit_todelete.birthday
        //this.userupdated=this.usertoedit_todelete
        this.showsnackbar('editusermodal','snackbarerror')
        setTimeout(() => {
          this.userupdated.username=vecchionome//COSì FUNZIONA COME PREVISTO PERCHè?!!
          this.userupdated.birthday=vecchiadata
          console.log('valore errore',this.userupdated)
          console.log(err.status)
          this.buttonisloading=false
         
        }, 2000);
      },complete:()=>{
        setTimeout(() => {
          this.buttonisloading=false
          this.showsnackbar('editusermodal','snackbar')
        }, 2000);
      }
    })
  }





  showloadinganimation(elementid:string,snackbarid:string):void{
    console.table(this.usertoedit_todelete.username)
      this.buttonisloading=true
      setTimeout(() => {
        this.buttonisloading=false;
        this.showsnackbar(elementid,snackbarid)
        
        //QUI VERRà AGGIUNTO UNO SNACKBAR CHE DA CONFERMA A UTENTE
      }, 2000);
  }

  showsnackbar(idcomponente:string,idsnackbar:string){
      let snackbar:HTMLElement|null=document.getElementById(idsnackbar)
      let elementtoapplysnackbar = document.getElementById(idcomponente);//modale
      if(snackbar){
        snackbar.className="showsnackbar"
        setTimeout(() => {
            snackbar!.className=""
            if(elementtoapplysnackbar){
               //codice per chiudere modal bootstrap
            }
        }, 2000);
      }
  }

  premuto():void{
    console.log('premuto tasto')
  }

  oneditmodalclosed(){//mostra popup di conferma
   //MOSTRARE IL MESSAGGIO SOLO SE UTENTE HA EFFETTUATO ALMENO UNA MODIFICA
    var myModalEl = document.getElementById('editusermodal');
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

   checkifvaluehaschanged():number{
     let fieldschanged:number=0;
    if(this.editname?.value!==this.usertoedit_todelete.username){
      fieldschanged++
    }else if(this.editbirthday?.value!==this.usertoedit_todelete.birthday){
      fieldschanged++;
    }
    return fieldschanged;
   }

  deleteuser(usertodelete:Identityuserinterface){
    this.usertoedit_todelete=usertodelete
    
    console.log("user to delete"+usertodelete.userid)
  }

}

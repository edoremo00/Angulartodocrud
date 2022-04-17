import { HttpErrorResponse } from '@angular/common/http';
import { APP_BOOTSTRAP_LISTENER, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { async, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleService } from 'src/app/services/google.service';
import { UserService } from 'src/app/services/user.service';
import { Identityuserinterface } from 'src/interfaces/identityuserinterface';
import { validatedate } from '../customvalidators/datevalidator';
import { noonlywhitespace } from '../customvalidators/noonlywhitespacesvalidator';
import { passwordandconfirmpasswequal } from '../customvalidators/passwordandconfirmpassvalidator';
import { validatePasswordComplexity } from '../customvalidators/passwordcomplexityvalidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit,OnDestroy {
  
  @ViewChild('closedeleteusermodal', { static: false }) closedeleteusermodalref!: ElementRef<HTMLButtonElement>;
  @ViewChild ('closeeditusermodal',{static:false}) closeeditusermodalref!:ElementRef<HTMLButtonElement>;
  //viewchild serve per molte cose tra queste per controllare un elemento dalla classe
  //static a false indica ad angular che rifermento a quell'elemento va aggiornata in seguito ad ngif ecc

  loggedGoogleuser:any

  googleuserservicesubscription:Subscription=new Subscription()//lo uso per disiscirvermi da observable
  

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

  countchars():number{ //used to display a number for the maximum chars allowed in the filter field
    return this.query.length
  }
  
  registerform:FormGroup=new FormGroup({
    name:new FormControl('',[Validators.required,Validators.minLength(1),noonlywhitespace()]),//per qualche motivo non scatta il required se ci sono solo spazi in questi campi mentre in email si
    lastname:new FormControl('',[Validators.required,Validators.minLength(1),noonlywhitespace()]),
    username:new FormControl('',[Validators.required,Validators.minLength(1),noonlywhitespace()]),
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required,Validators.minLength(6),validatePasswordComplexity()]),
    confirmpassword:new FormControl('',[Validators.required,Validators.minLength(6),validatePasswordComplexity()]),//passwordandconfirmpasswequal('') custom validator
    birthday:new FormControl('',[Validators.required,validatedate()])
  })

  updateuserform:FormGroup=new FormGroup({
    editname:new FormControl('',[Validators.required,Validators.minLength(1),noonlywhitespace()]),
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


  

  constructor(private authservice:AuthService,private router:Router,private ngzone:NgZone,private userservice:UserService,private googleservice:GoogleService,private ref:ChangeDetectorRef) { }
  ngOnDestroy(): void {
    //console.log('rimossa subscription')
    this.googleuserservicesubscription.unsubscribe()
    
  }
  users:Array<Identityuserinterface>=[];
  ngOnInit(): void {
    
     this.Getall()
    this.googleuserservicesubscription= this.googleservice.observable().subscribe({
       next:(googleuser)=>{
         if(googleuser){//solo se ho utente
          this.loggedGoogleuser=googleuser?.getBasicProfile().getEmail()
          
         }
        //this.loggedGoogleuser=googleuser?.getBasicProfile().getEmail()
        this.ref.detectChanges()//ascolto sempre i cambiamenti
        
       }
     })/*user=>{
       this.loggedGoogleuser=user?.getBasicProfile().getEmail()
       console.log('infoutente', this.loggedGoogleuser)
       this.ref.detectChanges()//. questo osservo cambiamenti a utente loggato. se fa logout sarà null sennò avrò nuovo valore ecc
     })*/
    
    

     
  }

  signin(){//login con Google
    this.googleservice.signIn()
  }

  shownoresultsfoundmessage(arrayutenti:Array<Identityuserinterface>):boolean{ //mostra il messaggio se non vengono trovati utenti
    //in seguito a ricerca
    if(this.query.trim().length===0){ //se stringa è solo spazi non mostrarlo
      return true
    }
    //sebbene funzione filter agisca solo su username
    //il json stringify mi da tutto l'oggetto. quindi mi restituisce true anche in casi non voluti
    //solo perchè id utente contiene quei numeri inseriti. che non vengono mostrati 
    //return JSON.stringify(arrayutenti.filter(x=>x.username?.toLowerCase())).includes(this.query);
    //RISOLTO COSI SOTTO

    return arrayutenti.filter(x=>x.username?.toLowerCase().includes(this.query)).length>0
    //SE TRUE TABELLA MOSTRATA SE FALSE MOSTRATO MESSAGGIO
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
        if(this.users){ //CHECK PER EVITARE ERRORE DOPO IL REFRESH IN SEGUITO A CANCELLAZIONE UTENTE SE 
          //NON CI SONO PIù UTENTI PRESENTI
          this.users.map(U=>{//trasforma data utenti formattandola
            U.birthday= moment(U.birthday).format('YYYY-MM-DD')
          })
          //FORMATTARE DATA MAGARI CON PIPE DI ANGULAR
        }
      },error:(err:HttpErrorResponse)=>{
        console.log(err.status);
        alert("error getting users")
      }
    })
  }

  Edituser(){
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
          this.showsnackbar('editusermodal','snackbar').then(()=>{
           setTimeout(() => {
           
             this.closeeditusermodalref.nativeElement.click()
             this.Getall()
           }, 2000);
         })
        }, 1000);
      }
    })
  }

  Deleteuser(id:string){
    this.buttonisloading=true
    return this.userservice.Delete(id).subscribe({
      next:(deleted)=>{
        console.log(deleted)
      },error:(err:HttpErrorResponse)=>{
        this.showsnackbar('deleteusermodal','snackbardeleteerror')
        console.log(err.status)
          console.log(err.message)
        setTimeout(() => {
          this.buttonisloading=false
          this.closedeleteusermodalref.nativeElement.click()
        }, 2000);
      },
      complete:()=>{
        //creo apposta delay di due secondi per mostrare effetto caricamento
         setTimeout(() => {
           this.buttonisloading=false
           this.showsnackbar('deleteusermodal','snackbardelete').then(()=>{
            setTimeout(() => {
            
              this.closedeleteusermodalref.nativeElement.click()
              this.Getall()
            }, 2000);
          })
         }, 1000);
          //NB: HO RESO FUNZIONE SHOWSNACKBAR ASINCRONA IN QUANTO AL TERMINE DEI DUE SECONDI il set timeout non 
          //aspettava il termine di essa e chiudeva direttamente la modale
      },
    })
  }





  showloadinganimation(elementid:string,snackbarid:string):void{ //NON PIù USATA
    console.table(this.usertoedit_todelete.username)
      this.buttonisloading=true
      setTimeout(() => {
        this.buttonisloading=false;
        this.showsnackbar(elementid,snackbarid)
        
        //QUI VERRà AGGIUNTO UNO SNACKBAR CHE DA CONFERMA A UTENTE
      }, 2000);
  }

 async showsnackbar(idcomponente:string,idsnackbar:string):Promise<void> {
      let snackbar:HTMLElement|null=document.getElementById(idsnackbar)
      let elementtoapplysnackbar = document.getElementById(idcomponente);//modale
      if(snackbar){
        snackbar.className="showsnackbar"
        setTimeout(() => {
            snackbar!.className=""
            
            
            
             //elementtoapplysnackbar2.click()
               //codice per chiudere modal bootstrap
            
        }, 3000);
      }
  }

  premuto():void{
    console.log('premuto tasto')
  }

  oneditmodalclosed(){//mostra popup di conferma
   //MOSTRARE IL MESSAGGIO SOLO SE UTENTE HA EFFETTUATO ALMENO UNA MODIFICA
    var myModalEl = document.getElementById('editusermodal');
    if(myModalEl){
        myModalEl.addEventListener('hide.bs.modal',  (event)=> {//mettendo arrow function ho visibilità di funzione checkif value has changed
           if(this.checkifvaluehaschanged()>0){
            let userchoice:boolean=confirm('data will be lost')
            event.stopImmediatePropagation()//se non presente qui a volte alert si triggera più volte se premuto annulla
            if(!userchoice){
              event.preventDefault()//impedisco a evento di propagarsi
            }else{
              event.stopImmediatePropagation()//faccio fare evento chiusura e stoppo propagazione in teoria
            }
           }
        }
          //aggiungere if con check if values chnaged && booldiduserupated
           
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



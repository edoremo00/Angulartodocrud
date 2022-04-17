import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import * as moment from 'moment';
import { GoogleService } from 'src/app/services/google.service';
import { TodoService } from 'src/app/services/todo.service';
import { Itodointerface } from 'src/interfaces/todointeerface';
import { noonlywhitespace } from '../customvalidators/noonlywhitespacesvalidator';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  
  
  foruserid:string="a9b1a280-2a47-4aea-ad5d-e9217549a119"
  googleuseremail:any
  googleuserprofilepic:any
  todotitle:string="";
  filterquery:string="";
  testcheckbox:boolean=true;
  selectvalue:string="0";//qui setto valore selected del tag select senno è vuoto quindi undefined per qualche motivo
  //questo perchè ngmodel sovrascrive il valore di default
  buttonisloading:boolean=false;

  updatetodoform:FormGroup=new FormGroup({
    todotitle:new FormControl('',noonlywhitespace()),
    tododescription:new FormControl('',noonlywhitespace()),
    todoisdone:new FormControl('')
  })

   //snackbarstriggered:Array<string>

  

  

  
  

  getallusertodo:Array<Itodointerface>;
  constructor(private todoservice:TodoService,private googleservice:GoogleService) {
    this.getallusertodo=[];
    //this.snackbarstriggered=[]
  }

  //Logout google
  SignOutGoogle(){
    this.googleservice.signOut()
  }


  get todotitlevalue():AbstractControl|null{
    return this.updatetodoform.get('todotitle')
  }

  get tododescriptionvalue():AbstractControl|null{
    return this.updatetodoform.get('tododescription')
  }

  get todoisdone():AbstractControl|null{
    return this.updatetodoform.get('todoisdone')
  }
   
  ngOnInit(): void {
    debugger
    /*this.googleservice.observable().subscribe({
      next:((user)=>{
        if(user){
          
          this.googleuseremail=user.getBasicProfile().getEmail()
          //user.getBasicProfile().getImageUrl
          this.googleuserprofilepic=user.getBasicProfile().getImageUrl()
        }
      })
    })
    if(RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(this.googleuseremail)){
      this.GetallusertodoforExternalLogin(this.googleuseremail,true)
    }else{
      this.Getallusertodo(this.foruserid)
    }*/

    if(this.googleservice.Googleuserlogged){
      this.googleuseremail=this.googleservice.Googleuserlogged.getBasicProfile().getEmail()
      this.googleuserprofilepic=this.googleservice.Googleuserlogged.getBasicProfile().getImageUrl()
      if(RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(this.googleuseremail)){
        this.GetallusertodoforExternalLogin(this.googleuseremail,true)
      }else{
        return
      }
    }else{
      this.Getallusertodo(this.foruserid)
    }

    
    
  }

  //quando clicco la checkbox
  togglecheckbox(e:Event,todo:Itodointerface){
    debugger
    let element:HTMLElement=e.target as HTMLElement;
    //controllo che chi ha scatenato evento è la checkbox
    if(element.tagName==="INPUT"){
      e.stopImmediatePropagation()
     let checkbox:HTMLInputElement=element as HTMLInputElement
      todo.isTodoDone=checkbox.checked
      this.patchformvalue(todo)//senno con binding form angular resetta valore titolo e descrizione a valore di default
      this.Updatetodo(todo)//a questo punto chiamo la put
      if(checkbox.checked){
        this.showsnackbar2('snackbardone')
        
      }else{
        this.showsnackbar2("snackbarundone")
      }
    }
  }

  Getallusertodo(foruserid:string){
    this.todoservice.GetAlltodos(foruserid).subscribe({
      next:(u)=>{
        this.getallusertodo=u;
        this.getallusertodo.map((c)=>c.lastmodified=moment(c.lastmodified).format('YYYY-MM-DD hh:mm'))
      },complete:()=>{
        console.log(this.getallusertodo)
      },error:(error:HttpErrorResponse)=>{
        alert("unable to retrieve usertodo");
        console.error(error.message)
      }
    })
  }

  GetallusertodoforExternalLogin(foruserid:string,externalloginuser:boolean){
    this.todoservice.GetallusertodoforExternalLogin(foruserid,externalloginuser).subscribe({
      next:(u)=>{
        this.getallusertodo=u
        if(this.getallusertodo){
          this.getallusertodo.map((c)=>c.lastmodified=moment(c.lastmodified).format('YYYY-MM-DD hh:mm'))
        }
      },complete:()=>{
        console.log(this.getallusertodo)
      },error:(error:HttpErrorResponse)=>{
        alert('unable to retrieve external user todo')
        console.error(error.message)
      }
    })
  }

  filterattempt(value:Event){
    let htmltag:HTMLElement=value.target as HTMLElement;
    let prova:HTMLSelectElement=htmltag as HTMLSelectElement
    
    console.log(`valore select:${prova.value}`)
    let filterattempt:Array<Itodointerface>= prova.value==="1" ? this.getallusertodo.filter(x=>x.isTodoDone==false) :this.getallusertodo.filter(x=>x.isTodoDone);
    console.log(filterattempt);
  }

  patchformvalue(todo:Itodointerface){
    this.updatetodoform.patchValue({todotitle:todo.title})
    this.updatetodoform.patchValue({tododescription:todo.description})
    this.todotitle=todo.title
  }

  oneditmodalclosed(){
     var myModalEl = document.getElementById('edittodomodal');
     if(myModalEl){
         myModalEl.addEventListener('hide.bs.modal',  (event)=> {
            this.updatetodoform.markAsPristine();// a chiusura metto form come mai toccato cosi bottone salva è disabilitato finche non si cambia valore
            
         }    
       );
     }
     
   }

   //questa funzione serve per mostrare messaggio se filtro barra
   //di ricerca non trova nulla accoppiato con filtro visualizzazione select
   shownoresultsfoundmessage(todo:Itodointerface[],selectvalue:any,filterquery:string):boolean{
     if(filterquery!==""){//questo if serve per evitare che ngif sia true per qualche secondo
      //questo perchè la get all viene eseguita nell'oninit
      if(selectvalue==="0"){
        return  todo.filter(x=>{
          return x.title.toLowerCase().includes(filterquery.trim())
         }).length>0
        }else if(selectvalue==="1"){
          return todo.filter(x=>{
            return x.title.toLowerCase().includes(filterquery.trim()) && x.isTodoDone
          }).length>0
        }else{
         return todo.filter(x=>{
          return x.title.toLowerCase().includes(filterquery.trim()) && !x.isTodoDone
         }).length>0
        }
      }
      return true
     
   }

   //problema quando più todo vengono selezionati mentre animazione snackbar è in corso
   //viene mostrata solo per il primo elemento cliccato
    showsnackbar(idsnackbar:string,idcomponente?:string|any){
    //this.snackbarstriggered.push(idsnackbar)
    
    //this.snackbarstriggered.push(idsnackbar)
    //debugger;
    let snackbar:HTMLElement|null=document.getElementById(idsnackbar)
     //let elementtoapplysnackbar = document.getElementById(idcomponente);//modale
    if(snackbar){
      snackbar.className="showsnackbar"
     
      setTimeout(() => {
          snackbar!.className=""
          //let elementtoremovefromlist= this.snackbarstriggered.indexOf(this.snackbarstriggered.find(x=>x===idsnackbar)!)
          //console.log("elemento da rimuovere "+elementtoremovefromlist)
           
       
          //elementtoapplysnackbar?.click()
          
          
           //elementtoapplysnackbar2.click()
             //codice per chiudere modal bootstrap
          
      }, 3000);
    }
    
  }


   showsnackbar2(idsnackbar:string,idcomponente?:string|any) {
  
    //this.snackbarstriggered.push(idsnackbar)
    //debugger;
    let snackbar:HTMLElement|null=document.getElementById(idsnackbar)
     //let elementtoapplysnackbar = document.getElementById(idcomponente);//modale
    if(snackbar){
      snackbar.className="showsnackbar"
     
      setTimeout(() => {
          snackbar!.className=""
          //let elementtoremovefromlist= this.snackbarstriggered.indexOf(this.snackbarstriggered.find(x=>x===idsnackbar)!)
           
          //this.snackbarstriggered.splice(elementtoremovefromlist,1)
          //elementtoapplysnackbar?.click()
          
          
           //elementtoapplysnackbar2.click()
             //codice per chiudere modal bootstrap
          
      }, 3000);
    }
    /*if(this.snackbarstriggered.length!==0){
      this.snackbarstriggered.map(x=> this.showsnackbar(x))
    }*/
  }

  


   checkfiltervalidity(stringtovalidate:string):boolean{//verifica che nel filtro ci sia almeno una lettera senno mostra un messaggio
    if(stringtovalidate.trim().length===0){
      return false
    }
    return true
  }

  clearfilter(inputtochangestatus?:any){
    this.filterquery=""//reset valore filtro
    let filterusercontrol= inputtochangestatus as NgModel
    //filterusercontrol.control.markAsUntouched({onlySelf:true})//permette di nascondere poi messaggio di inserire una lettera per filtrare
    filterusercontrol.control.markAsPristine({onlySelf:true})
 
    
    
    //se nel template uso dirty(appena utente scrive). per non fare apparire errore bisogna resettare il campo a pristine

    //se nel template uso touched(utente scrive poi esce) per non fare apparire errore bisogna resettare il campo a untouched
  }

  countchars():number{ //used to display a number for the maximum chars allowed in the filter field
    return this.filterquery.length
  }

   Updatetodo(todotoupdate:Itodointerface){
     let valuesbeforeupdate:Itodointerface=todotoupdate;
     let oldtitle:string=valuesbeforeupdate.title;
     let olddescription:string=valuesbeforeupdate.description
     let oldlastmodifieddate:string=valuesbeforeupdate.lastmodified
     let oldtodoisdone:boolean=valuesbeforeupdate.isTodoDone
     todotoupdate.description=this.tododescriptionvalue?.value
     todotoupdate.title=this.todotitlevalue?.value
     todotoupdate.lastmodified=moment(Date.now()).format()//mandarlo cosi senno datetime non valido per backend
     return this.todoservice.UpdateTodo(todotoupdate).subscribe({
       next:()=>{
         
       },
       complete:()=>{
         todotoupdate.lastmodified=moment(todotoupdate.lastmodified).format('YYYY-MM-DD hh:mm')//una volta che chiamata è complete lo formatto
       },
       error:(error:HttpErrorResponse)=>{
         console.error(error.message)
         alert('error in updating todo. values are restored to the ones previously saved');
         this.updatetodoform.patchValue({todotitle:oldtitle})
         this.updatetodoform.patchValue({tododescription:olddescription})
         todotoupdate.isTodoDone=!oldtodoisdone
         todotoupdate.lastmodified=moment(oldlastmodifieddate).format('YYYY-MM-DD hh:mm')
       }
     })
   }

   Deletetodo(id:number){
     return this.todoservice.DeleteTodo(id).subscribe({
       next:(t)=>{
         console.log("deleted todo",t)
       },complete:()=>{

       },error:(err:HttpErrorResponse)=>{
         alert('error in deleting todo')
         console.error(err.message)
       }
     })
   }

  /*shallowEqual(object1:any, object2:any) :boolean{
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }*/
}

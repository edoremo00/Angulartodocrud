import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
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
  todotitle:string="";
  testcheckbox:boolean=true;
  selectvalue:string="2";//qui setto valore selected del tag select senno è vuoto quindi undefined per qualche motivo
  //questo perchè ngmodel sovrascrive il valore di default
  buttonisloading:boolean=false;

  updatetodoform:FormGroup=new FormGroup({
    todotitle:new FormControl('',noonlywhitespace()),
    tododescription:new FormControl('',noonlywhitespace()),
    todoisdone:new FormControl('')
  })

  
  

  getallusertodo:Array<Itodointerface>;
  constructor(private todoservice:TodoService) {
    this.getallusertodo=[];
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
    this.Getallusertodo(this.foruserid)
  }

  //quando clicco la checkbox
  clickedbutton(e:Event,todo:Itodointerface){
    let element:HTMLElement=e.target as HTMLElement;
    //controllo che chi ha scatenato evento è la checkbox
    if(element.tagName==="INPUT"){
      e.stopImmediatePropagation()
      console.log((element as HTMLInputElement).checked)
      todo.isTodoDone=(element as HTMLInputElement).checked
      this.patchformvalue(todo)//senno con binding form angular resetta valore titolo e descrizione a valore di default
      this.Updatetodo(todo)//a questo punto chiamo la put
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

  oneditmodalclosed(todo:Itodointerface){//mostra popup di conferma
    //MOSTRARE IL MESSAGGIO SOLO SE UTENTE HA EFFETTUATO ALMENO UNA MODIFICA
     var myModalEl = document.getElementById('edittodomodal');
     if(myModalEl){
         myModalEl.addEventListener('hide.bs.modal',  (event)=> {
            this.updatetodoform.markAsPristine();// a chiusura metto form come mai toccato cosi bottone salva è disabilitato finche non si cambia valore
            
         }    
       );
     }
     
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

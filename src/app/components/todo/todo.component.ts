import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { TodoService } from 'src/app/services/todo.service';
import { Itodointerface } from 'src/interfaces/todointeerface';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  foruserid:string="a9b1a280-2a47-4aea-ad5d-e9217549a119"

  testcheckbox:boolean=true;
  selectvalue:string="change todo visualization";//qui setto valore selected del tag select senno è vuoto quindi undefined per qualche motivo
  //questo perchè ngmodel sovrascrive il valore di default
  

  getallusertodo:Array<Itodointerface>;
  constructor(private todoservice:TodoService) {
    this.getallusertodo=[];
  }

  ngOnInit(): void {
    this.Getallusertodo(this.foruserid)
  }

  clickedbutton(e:Event,todo:Itodointerface){
    //if(e.target==HTMLInputElement)
    
    let element:HTMLElement=e.target as HTMLElement;
    if(element.tagName==="INPUT"){
      e.stopImmediatePropagation()
      console.log((element as HTMLInputElement).checked)
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



}

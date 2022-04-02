import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss']
})
export class EditprofileComponent implements OnInit,AfterViewInit {

  constructor() { }
  inputfile:any;
  ngAfterViewInit(): void {
    this.inputfile=document.getElementById('formFileSm')
  }

  ngOnInit(): void {
  }

  

  Onfileselected(){
    if(this.inputfile){
      let input=this.inputfile as HTMLInputElement
      let file=input.files
      console.log(file)
    }
  }

}

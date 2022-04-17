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

}

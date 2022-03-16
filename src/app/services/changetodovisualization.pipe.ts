import { Pipe, PipeTransform } from '@angular/core';
import { Itodointerface } from 'src/interfaces/todointeerface';

@Pipe({
  name: 'changetodovisualization'
})
export class ChangetodovisualizationPipe implements PipeTransform { //pipe per mostrare-nascondere to do fatti o meno

  transform(value: Array<Itodointerface>, args?: string): Itodointerface[] {
    //debugger;
    
    if(!args){
      return value
    }else if(args==="change todo visualization"){
      return value;
    }else if(args==="1"){
      return value.filter(x=>x.isTodoDone)
    }else{
      return value.filter(x=>!x.isTodoDone)
    }
  }

}

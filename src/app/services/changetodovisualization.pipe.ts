import { Pipe, PipeTransform } from '@angular/core';
import { Itodointerface } from 'src/interfaces/todointeerface';

@Pipe({
  name: 'changetodovisualization',
  pure:false //ho dovuto rendere pipe inpura per farla eseguire ad ogni cambio di stato sennò valore checkbox todo non era coerente
})
export class ChangetodovisualizationPipe implements PipeTransform { //pipe per mostrare-nascondere to do fatti o meno

  transform(value: Array<Itodointerface>, args?: string): Itodointerface[] {
    if(!args){
      return value
    }else if(args==="1"){
      return value.filter(x=>x.isTodoDone)
    }else{
      return value.filter(x=>!x.isTodoDone)
    }
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { Itodointerface } from 'src/interfaces/todointeerface';

@Pipe({
  name: 'todofilter'
})
export class TodofilterPipe implements PipeTransform {

  transform(value: Array<Itodointerface>, args?: string): any {
    
    if(!args){ // nota: valore di default stringa ricerca è "". questo valore è falsy. se e falsy ritorno array intero
      return value
    }
    else if(args!.toLowerCase().trim().length===0){
      return value
    }
    return value.filter(t=>{
      return t.title.toLowerCase().includes(args!);
    })
  }

      /*
          The following values are always falsy:
          false
          0 (zero)
          -0 (minus zero)
          0n (BigInt zero)
          '', "", `` (empty string)
          null
          undefined
          NaN

          Everything else is truthy. That includes:

          '0' (a string containing a single zero)
          'false' (a string containing the text “false”)
          [] (an empty array)
          {} (an empty object)
          function(){} (an “empty” function)
      */

}

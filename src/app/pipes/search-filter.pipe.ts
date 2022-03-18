import { Pipe, PipeTransform } from '@angular/core';
import { Identityuserinterface } from 'src/interfaces/identityuserinterface';

@Pipe({
  name: 'searchFilter'//mi permette di filtrare i dati nella tabella utenti
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: Array<Identityuserinterface>, args?: string): any {
    //return null;
    if(!value) return null;
    if(!args) return value;
    if(args.trim().length===0) return value//se args ovvero testo input senza spazi è lungo 0 ritorna l'array
    args=args.toLowerCase();
    return value.filter(x=>
      {
        //return JSON.stringify(x).toLowerCase().includes(args!)//ti filtra per tutto oggetto
        
         return x.username?.toLowerCase().includes(args!) //filtra solo per username
         //capire perchè del doppio return
      }
    )
    //ritorna tutti gli elementi trasformati in json e in minuscolo che contengono la stringa di ricerca
    /*return value.filter(function(data: any){
      return JSON.stringify(data).toLowerCase().includes(args!)//perchè in json?
    })*/
    //VALUE DOVREBBE ESSERE IL MIO ARRAY
  }

}

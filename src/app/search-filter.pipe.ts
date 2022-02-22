import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'//mi permette di filtrare i dati nella tabella utenti
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: any, args?: string): any {
    //return null;
    if(!value) return null;
    if(!args) return value;
    if(args.trim().length===0) return value//se args ovvero testo input senza spazi è lungo 0 ritorna l'array
    args=args.toLowerCase();

    return value.filter(function(data: any){
      return JSON.stringify(data).toLowerCase().includes(args!)//perchè in json?
    })
    //VALUE DOVREBBE ESSERE IL MIO ARRAY
  }

}

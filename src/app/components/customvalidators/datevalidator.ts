import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment"; //libreria date

export function validatedate():ValidatorFn{//:interfaccia riceve in input un control di tipo abstractcontrol e ritorna un map con gli errori se presenti o null
    return (control: AbstractControl): ValidationErrors | null => {//in seconda graffa ho cosa deve restituire validator
        let dataoggi=new Date()
        //problema è data oggi
        
        //let stringadataoggi=dataoggi.toLocaleDateString('').split('/').join('-');
		if(control.value===moment(dataoggi).format('YYYY-MM-DD')){
            return {validatedate:true}
        }
		return null;
	};
}
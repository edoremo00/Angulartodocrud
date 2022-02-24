import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function noonlywhitespace():ValidatorFn{//:interfaccia riceve in input un control di tipo abstractcontrol e ritorna un map con gli errori se presenti o null
    return (control: AbstractControl): ValidationErrors | null => {//in seconda graffa ho cosa deve restituire validator
        let controlvalue=control.value as string
		if(controlvalue.trim().length===0){
            return {noonlywhitespace:true}
        }
		return null;
	};
}
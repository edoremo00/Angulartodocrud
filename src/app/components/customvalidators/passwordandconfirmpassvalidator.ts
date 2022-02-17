import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordandconfirmpasswequal(password:string):ValidatorFn{ //non riesco a passare valore e nemmeno a prenderlo dal form siccome oggetto form ancora non è inizializzato
    return (control: AbstractControl): ValidationErrors | null => {//in seconda graffa ho cosa deve restituire validator
		if(control.value!==password){
            
            return {passwordandconfirmpasswequal:true}//oggetto errors ritornato da usare nel componente per fare display errori
        }
		return null;
	};
}



import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
//password con almeno 6 caratteri con Maiuscola,minuscola, carattere speciale e numero
export function validatePasswordComplexity():ValidatorFn{
   return (control:AbstractControl):ValidationErrors|null=>{
       let passwordvalue=control.value;
   let isvalid= RegExp(/^(?=.*\d)(?=.*[!@#$%^&*/])(?=.*[a-z])(?=.*[A-Z]).{6,}$/).test(passwordvalue)
     return  isvalid ?  null : {passwordcomplexity:true}
   }
}
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

export function validatefuturedates():ValidatorFn{
    return(control:AbstractControl):ValidationErrors|null=>{
        let dataoggi=new Date()
        if(control.value>moment(dataoggi).format('YYYY-MM-DD')){
            return {validatefuturedates:true}
        }
        return null;
    }
}
export function atleast13yearsold():ValidatorFn{
    return(control:AbstractControl):ValidationErrors|null=>{
        let dataoggi=new Date()
        let controlvalue:String=String(control.value).split('-')[0];
        if(dataoggi.getFullYear()-Number(controlvalue)<13){
            return {atleast13yearsold:true}
        }
        return null;
    }
}
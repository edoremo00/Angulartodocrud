export interface Identityuserinterface{ 
   name?:string,
   lastname?:string,
   username?:string,
   userid?:string;
   password:string;
   confirmpassword?:string,
   email:string;
   birthday?:Date;//oppure faremo stringa se dovesse dare problemi
}
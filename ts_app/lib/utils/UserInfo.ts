

module utils {
    
    export class UserInfo {

        get email():string {
            return "me@domain.com";
        }
    
        set email(value:string) {
            //stub
        }

        get someDataSentFromTheNativeAppCode():string {
            return "test";
        }

        set someDataSentFromTheNativeAppCode(value:string) {
            //stub
        }
    }
}
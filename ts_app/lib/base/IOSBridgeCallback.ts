
module base {
    export class IOSBridgeCallback implements BridgeCallback {
        constructor(public someDataSentFromTheNativeAppCode:string, public initializedCallback) {
            
        }

        getSomeDataSentFromTheNativeAppCode():string {
            return this.someDataSentFromTheNativeAppCode;
        }

        bridgeInitialized() {
            this.initializedCallback();
        }

        executionResult(executionId:string, argumentsJson:string):void {
            //this will not be used, since iOS uses bridge.execImmediate rather than bridge.exec
        }

        executionError(executionId:string, errorJson):void {
            //this will not be used, since iOS uses bridge.execImmediate rather than bridge.exec
        }

        updateAllResults() {
            window['WebViewJavascriptBridge'].callHandler("updateResults");
        }
        
        fetchResult() {
            //only used by android
        }
    }
}
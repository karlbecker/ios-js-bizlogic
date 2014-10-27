
module base {
    export class AndroidBridgeCallback implements BridgeCallback {
        fetchCallbacks = {};
        fetchIdSeq:number = 0;

        public constructor() {
            
        }

        getSomeDataSentFromTheNativeAppCode():string {
            return window['BridgeCallback'].getDeviceId();
        }

        bridgeInitialized() {
            return window['BridgeCallback'].bridgeInitialized();
        }

        executionResult(executionId:string, argumentsJson:string) {
            return window['BridgeCallback'].executionResult(executionId, argumentsJson);
        }

        executionError(executionId:string, errorJson) {
            return window['BridgeCallback'].executionError(executionId, errorJson);
        }

        updateAllResults() {
            return window['BridgeCallback'].updateAllResults();
        }

    }
}
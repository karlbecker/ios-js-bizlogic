var assert = window['assert'],
    jsyaml = window['jsyaml'];

var currentSpec:any = null;

class TestHarness implements base.BridgeCallback, utils.UrlContentFetcher {
    constructor(public someDataSentFromTheNativeAppCode:string) {

    }

    getSomeDataSentFromTheNativeAppCode():string {
        return this.someDataSentFromTheNativeAppCode;
    }

    bridgeInitialized() {
        var callback = this;
    }

    executionResult() {

    }

    executionError() {

    }

    updateAllResults() {

    }
    
    fetchResult() {
        //only used by android
    }
}

// we need to set the bridge globally so that it can be used in tests
// this is really evil, we need a more obvious place to kick things off from
window['bridge'] = new base.Bridge(new TestHarness("someTestData"));
window['bridge'].start();

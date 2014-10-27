
describe('Bridge', () => {
    var objects: controllers.Objects;
    var defaultTestSomeDataSentFromTheNativeAppCode = "test-device-id";

    it( 'should use a custom some data sent', () => {
        var testSomeDataSentFromTheNativeAppCode = "my_custom_test_id";
        var bridge:base.Bridge = new base.Bridge(new base.IOSBridgeCallback(testSomeDataSentFromTheNativeAppCode, function(){}));

        assert.equal(bridge.callback.getSomeDataSentFromTheNativeAppCode(), testSomeDataSentFromTheNativeAppCode);
    });
});
//
//  MyJSBridge.h
//  iOS-JS-BizLogic
//
//  Copyright (c) 2014 Your Company, LLC. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <WebViewJavascriptBridge/WKWebViewJavascriptBridge.h>
#import "MyJSBridgeMethodInvocation.h"

@interface MyJSBridge : NSObject

@property(nonatomic, strong) WKWebView *webview;
@property(nonatomic, strong) WKWebViewJavascriptBridge *bridge;
@property(nonatomic, strong) NSPointerArray *proxyInstances;

- (id)initWithHTMLFile:(NSString *)bridgeFilePath;

- (id)createProxyForController:(NSString *)controllerName;
- (void)execJavascriptMethodInBackground:(MyJSBridgeMethodInvocation *)invocation;

@end

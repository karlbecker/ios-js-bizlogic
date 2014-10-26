//
//  MyJSBridge.h
//  iOS-JS-BizLogic
//
//  Copyright (c) 2014 Your Company, LLC. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WebViewJavascriptBridge.h"
#import "MyJSBridgeMethodInvocation.h"

@interface MyJSBridge : NSObject

@property(nonatomic, strong) UIWebView *webview;
@property(nonatomic, strong) WebViewJavascriptBridge *bridge;
@property(nonatomic, strong) NSPointerArray *proxyInstances;

- (id)createProxyForController:(NSString *)controllerName;
- (void)execJavascriptMethodInBackground:(MyJSBridgeMethodInvocation *)invocation;

@end

//
//  MyJSBridgeMethodInvocation.h
//  iOS-JS-BizLogic
//
//  Copyright (c) 2014 Your Company, LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef void (^MyJSBridgeCompletionHandler)(id error, id result);

@interface MyJSBridgeMethodInvocation : NSObject

@property(nonatomic, strong) NSString *className;
@property(nonatomic, strong) NSString *methodName;
@property(nonatomic, strong) NSArray *args;
@property(nonatomic, copy) MyJSBridgeCompletionHandler callback;

@end

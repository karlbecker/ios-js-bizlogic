//
//  MyJSProxy.h
//  iOS-JS-BizLogic
//
//  Copyright (c) 2014 Your Company, LLC. All rights reserved.
//

#import "MyJSBridge.h"

@interface MyJSProxy : NSObject

@property(nonatomic, strong) MyJSBridge *bridge;
@property(nonatomic, strong) NSString *controllerName;
@property(nonatomic, strong) NSMutableArray *invocationsToUpdate;

- (id)initWithBridge:(MyJSBridge *)bridge andControllerName:(NSString *)controllerName;
- (void)updateInvocations;

@end

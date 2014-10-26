//
//  MyJSBridgeMethodInvocation.m
//  iOS-JS-BizLogic
//
//  Copyright (c) 2014 Your Company, LLC. All rights reserved.
//

#import "MyJSBridgeMethodInvocation.h"

@implementation MyJSBridgeMethodInvocation

- (NSString *)description
{
	NSString *descriptionString = [NSString stringWithFormat:@"%@%@%@%@",
								   (_className ? [NSString stringWithFormat:@"className: %@\n", _className]: @""),
								   (_methodName ? [NSString stringWithFormat:@"methodName: %@\n", _methodName]: @""),
								   (_args.description ? [NSString stringWithFormat:@"args: %@\n", _args.description]: @""),
								   (_callback ? [NSString stringWithFormat:@"callback: %@", _callback] : @"")];
	return (descriptionString.length > 0 ? descriptionString : [super description]);
}

@end

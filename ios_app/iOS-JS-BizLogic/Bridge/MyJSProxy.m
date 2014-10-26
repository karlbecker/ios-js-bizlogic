//
//  MyJSProxy.m
//  iOS-JS-BizLogic
//
//  Copyright (c) 2014 Your Company, LLC. All rights reserved.
//

#import "MyJSProxy.h"

@implementation MyJSProxy

- (id)initWithBridge:(MyJSBridge *)bridge andControllerName:(NSString *)controllerName
{
	if(self = [super init])
	{
		self.bridge = bridge;
		self.controllerName = controllerName;
		self.invocationsToUpdate = [[NSMutableArray alloc] init];
	}
	return self;
}

- (NSMethodSignature *)methodSignatureForSelector:(SEL)sel
{
	//parse the number of args based on the incoming selector
	NSMutableArray *argNames = [NSStringFromSelector(sel) componentsSeparatedByString:@":"].mutableCopy;
	[argNames removeObject:@""];
	
	//create the method signature, assuming a void return type and all arguments are Objective C objects
	NSString *signatureTypes = [@"v@:" stringByPaddingToLength:argNames.count + 3 withString:@"@" startingAtIndex:0];
	NSMethodSignature *sig = [NSMethodSignature signatureWithObjCTypes:signatureTypes.UTF8String];
	return sig;
}

- (void)forwardInvocation:(NSInvocation *)inv
{
	MyJSBridgeMethodInvocation *invocation = [[MyJSBridgeMethodInvocation alloc] init];
	
	invocation.className = self.controllerName;
	
	//parse the "method name" from the invocation's selector
	NSMutableArray *argNames = [NSStringFromSelector(inv.selector) componentsSeparatedByString:@":"].mutableCopy;
	[argNames removeObject:@""];
	
	//we are considering the first arg the "method name"
	//if there are no arguments to the method, it must still take a result handler, so we may want to be clear that
	//the argument is a result handler, not a method call, so we'll allow WithResult or WithUpdatingResult to be appended to the first arg name,
	//and remove it before calling the JS method.
	invocation.methodName = [[argNames[0] stringByReplacingOccurrencesOfString:@"WithUpdatingResult" withString:@""]
							 stringByReplacingOccurrencesOfString:@"WithResult" withString:@""];
	
	//copy the args of the passed in invocation into an array, so that we can reason about them
	//the invocation holds the args starting at index 2
	NSMutableArray *args = [[NSMutableArray alloc] initWithCapacity:argNames.count];
	for(int i = 0; i < argNames.count; i++) {
		id __unsafe_unretained arg;
		[inv getArgument:&arg atIndex: 2 + i];
		if(arg != nil) {
			args[i] = arg;
		} else {
			args[i] = [NSNull null];
		}
	}
	
	//get the callback argument. for now, just always assume the last arg is a callback.
	invocation.callback = [args lastObject];
	
	[args removeLastObject];
	invocation.args = args;
	
	
	//if the last arg is an "updating" result, we'll store the invocation and trigger it again when data is updated
	if([[argNames.lastObject lowercaseString] hasSuffix:@"withupdatingresult"]) {
		[self.invocationsToUpdate addObject:invocation];
	}
	
	
	//forward the invocation onto MyJSBridge class to be executed:
	[self.bridge execJavascriptMethodInBackground:invocation];
}

- (void)updateInvocations
{
	for (MyJSBridgeMethodInvocation *invocation in self.invocationsToUpdate) {
		[self.bridge execJavascriptMethodInBackground:invocation];
	}
}

@end

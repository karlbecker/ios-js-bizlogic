//
//  MyJSBridge.m
//  iOS-JS-BizLogic
//
//  Copyright (c) 2014 Your Company, LLC. All rights reserved.
//

#import "MyJSBridge.h"
#import "MyJSProxy.h"
#import <Mantle/Mantle.h>
#import <SLObjectiveCRuntimeAdditions/SLBlockDescription.h>
#import <NSString+TIUtils/NSString+TIUtils.h>

@implementation MyJSBridge

- (id)initWithHTMLFile:(NSString *)bridgeFilePath {
	if(self = [super init]) {
		self.proxyInstances = [NSPointerArray weakObjectsPointerArray];
		
		self.webview = [[UIWebView alloc] init];
		
		if( !bridgeFilePath ) {
			return self;  //bridge file does not exist, so just get out of here!
		}
		
		[self.webview loadRequest:[NSURLRequest requestWithURL:[NSURL fileURLWithPath:bridgeFilePath]]];
		
		//initialize the WVJB bridge
		self.bridge = [WebViewJavascriptBridge bridgeForWebView:self.webview handler:nil];
		
		//add callback to fetch website data
		[self.bridge registerHandler:@"fetchContent" handler:^(NSDictionary *options, WVJBResponseCallback responseCallback) {
			NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:options[@"url"]]];
			[request setTimeoutInterval:10];
			[request setValue:@"gzip" forHTTPHeaderField:@"Accept-Encoding"];
			[request setValue:@"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-us) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27 (iOS 6.1.3)" forHTTPHeaderField:@"User-Agent"];
		}];
		
		
		//add callback to update results
		[self.bridge registerHandler:@"updateResults" handler:^(id data, WVJBResponseCallback responseCallback) {
			// NSPointerArray's "compact" method should get rid of nil elements, but it totally doesn't work: http://www.openradar.me/15396578
			// instead, we're going to work through the list backward, and remove elements as we go, to avoid skipping items
			
			for (int i = (int)self.proxyInstances.count - 1; i >= 0 ; i--) {
				MyJSProxy *proxyInstance = [self.proxyInstances pointerAtIndex:i];
				if(!proxyInstance) {
					[self.proxyInstances removePointerAtIndex:i];
				} else {
					[proxyInstance updateInvocations];
				}
			}
		}];
		
		//call the "initialize" handler, which starts up the bridge-side logic
		[self.bridge callHandler:@"initialize" data:@{} responseCallback:^(id responseData) {
			NSLog(@"bridge initialized.");
		}];
	}
	return self;
}

#pragma mark - controllers methods

- (id)createProxyForController:(NSString *)controllerName {
	MyJSProxy *proxy = [[MyJSProxy alloc] initWithBridge:self andControllerName:controllerName];
	[self.proxyInstances addPointer:(__bridge void *)proxy];
	return proxy;
}

/**
 * Executes the javascript method in the background, although will perform the actual JS on the main thread.
 *
 * @warning: the UIWebView in which this runs is not thread safe, which means you'll need to 
 */
- (void)execJavascriptMethodInBackground:(MyJSBridgeMethodInvocation *)invocation {
	
	//serialize any incoming model objects to json in the background
	dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
		NSMutableArray *mutableArgs = invocation.args.mutableCopy;
		for(int i = 0; i < mutableArgs.count; i++) {
			id arg = mutableArgs[i];
			if([arg isKindOfClass:MTLModel.class]) {
				mutableArgs[i] = [MTLJSONAdapter JSONDictionaryFromModel:arg];
			}
		}
		
		//call the JS method from the main thread to avoid any concurrency issues (WVJS is not thread safe!)
		dispatch_async(dispatch_get_main_queue(), ^{
			
			[self.bridge callHandler:@"exec" data:@{@"className": invocation.className, @"methodName": invocation.methodName, @"args": mutableArgs} responseCallback:^(NSArray *responseData) {
				
				//deserialize the WVJS response in the background
				dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
					
					SLBlockDescription *blockDescription = [[SLBlockDescription alloc] initWithBlock:invocation.callback];
					
					// getting a method signature for this block
					NSMethodSignature *methodSignature = blockDescription.blockSignature;
					
					id err = nil;
					id result = nil;
					if(!responseData || responseData.count != 2) {
						err = @{@"type": @"BridgeFailure",
								@"message": [NSString stringWithFormat:@"invalid response from bridge - expected array of 2 args, but was %@", responseData]};
					} else {
						err = responseData[0];
						result = responseData[1];
						
						if(err == [NSNull null]) {
							err = nil;
						}
						if(result == [NSNull null]) {
							result = nil;
						}
						
						//deserialize result into model object if necessary
						if(!err && [result isKindOfClass:NSDictionary.class] && methodSignature.numberOfArguments > 2) {
							const char *resultTypeCString = [methodSignature getArgumentTypeAtIndex:2];
							NSString *resultTypeString = [NSString stringWithCString:resultTypeCString encoding:NSUTF8StringEncoding];
							NSArray *match = [resultTypeString matchForPattern:@"@\"(\\w+)\""];
							NSString *className = match[1];
							Class resultClass = NSClassFromString(className);
							if([resultClass isSubclassOfClass:MTLModel.class]) {
								NSError *mappingError;
								result = [MTLJSONAdapter modelOfClass:resultClass fromJSONDictionary:result error:&mappingError];
								if(mappingError) {
									err = @{@"type": @"MappingError", @"message": [mappingError localizedDescription]};
								}
							}
						}
						
					}
					
					//perform the callback on the main thread
					dispatch_async(dispatch_get_main_queue(), ^{
						invocation.callback(err, result);
					});
				});
			}];
		});
	});
}

@end



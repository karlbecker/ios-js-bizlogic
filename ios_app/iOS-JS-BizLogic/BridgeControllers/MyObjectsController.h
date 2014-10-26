//
//  MyObjectsController.h
//  iOS-JS-BizLogic
//
//  Copyright (c) 2014 Your Company, LLC. All rights reserved.
//

#import "MyJSBridge.h"

@interface MyObjectsController : NSObject

/**
 * Perform some function with no return value
 */
- (void)incrementObjectCountWithResult:(void (^)(id error, NSDictionary *result))result;

/**
 * Check to see we have a particular object ID
 **/
- (void)containsObjectId:(NSString *)objectID withUpdatingResult:(void (^)(id error, NSNumber* doesContain))resultHandler;

@end
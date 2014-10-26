//
//  MyObject.h
//  iOS-JS-BizLogic
//
//  Copyright (c) 2014 Your Company, LLC. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Mantle/Mantle.h>

/**
 * Represents an object in your javascript code
 **/
@interface MyObject : MTLModel <MTLJSONSerializing>
@property (strong, nonatomic) NSString *id;
@property (strong, nonatomic) NSString *title;
@property (strong, nonatomic) NSNumber *count;

/**
 * An array of related objects
 */
@property (nonatomic, strong) NSArray *children;

/**
 * Number of non-empty shelf items
 */
@property(nonatomic, readonly)NSInteger itemCount;

@end
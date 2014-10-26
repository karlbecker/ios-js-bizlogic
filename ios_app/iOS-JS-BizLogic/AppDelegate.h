//
//  AppDelegate.h
//  iOS-JS-BizLogic
//
//  Created by Karl Becker on 10/26/14.
//  Copyright (c) 2014 Your Company, LLC. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "MyJSBridge.h"
#import "MyObjectsController.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;

@property (nonatomic, strong) MyJSBridge *bridge;

- (MyObjectsController *)objectsController;

@end


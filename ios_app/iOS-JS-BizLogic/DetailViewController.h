//
//  DetailViewController.h
//  iOS-JS-BizLogic
//
//  Created by Karl Becker on 10/26/14.
//  Copyright (c) 2014 Your Company, LLC. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface DetailViewController : UIViewController

@property (strong, nonatomic) id detailItem;
@property (weak, nonatomic) IBOutlet UILabel *detailDescriptionLabel;

@end


//
//  CombinedModule.m
//  NoteTaking
//
//  Created by Chicmic_Reacjs01 on 2024-06-21.
//

#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(InterstitialAdModule, NSObject)

RCT_EXTERN_METHOD(loadInterstitialAd:(NSString *)requestID)
RCT_EXTERN_METHOD(showInterstitialAd)

@end

// This ensures the module is exported to React Native
@interface RCT_EXTERN_REMAP_MODULE(AdsModule,RNAdMobModule, NSObject)
RCT_EXTERN_METHOD(initializeAds: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end

@interface RCT_EXTERN_MODULE(Counter, NSObject)
@end

@interface RCT_EXTERN_REMAP_MODULE(AdView, AdViewManager, RCTViewManager)
RCT_EXTERN_METHOD(loadBanner:(NSString *)adUnitId)
@end

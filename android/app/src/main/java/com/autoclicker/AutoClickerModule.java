package com.autoclicker;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.GestureDescription;
import android.graphics.Path;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.content.Intent;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;

public class AutoClickerModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private AutoClickerService clickerService;

    public AutoClickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "AutoClickerModule";
    }

    @ReactMethod
    public void checkAccessibilityPermission(Promise promise) {
        try {
            boolean isEnabled = isAccessibilityServiceEnabled();
            promise.resolve(isEnabled);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void openAccessibilitySettings() {
        Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }

    @ReactMethod
    public void simulateClick(int x, int y, Promise promise) {
        if (clickerService != null) {
            clickerService.performClick(x, y);
            promise.resolve(true);
        } else {
            promise.reject("ERROR", "Accessibility service not running");
        }
    }

    private boolean isAccessibilityServiceEnabled() {
        String serviceName = reactContext.getPackageName() + "/com.autoclicker.AutoClickerService";
        String enabledServices = Settings.Secure.getString(
                reactContext.getContentResolver(),
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES);
        return enabledServices != null && enabledServices.contains(serviceName);
    }
}

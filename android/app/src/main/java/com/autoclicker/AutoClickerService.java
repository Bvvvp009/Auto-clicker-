package com.autoclicker;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.GestureDescription;
import android.graphics.Path;
import android.view.accessibility.AccessibilityEvent;

public class AutoClickerService extends AccessibilityService {
    private static AutoClickerService instance;

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // Not used in this implementation
    }

    @Override
    public void onInterrupt() {
        // Not used in this implementation
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        instance = this;
    }

    public void performClick(int x, int y) {
        Path clickPath = new Path();
        clickPath.moveTo(x, y);

        GestureDescription.Builder gestureBuilder = new GestureDescription.Builder();
        gestureBuilder.addStroke(new GestureDescription.StrokeDescription(clickPath, 0, 1));
        
        dispatchGesture(gestureBuilder.build(), new GestureResultCallback() {
            @Override
            public void onCompleted(GestureDescription gestureDescription) {
                super.onCompleted(gestureDescription);
            }
        }, null);
    }

    public static AutoClickerService getInstance() {
        return instance;
    }
}

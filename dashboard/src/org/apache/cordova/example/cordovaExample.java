package org.apache.cordova.example;

import android.app.Activity;
import android.os.Bundle;
import org.apache.cordova.*;

public class cordovaExample extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("https://pilots.omh.io/dev-ucdpilot/index.html");
    }
}

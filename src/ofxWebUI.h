//
//  ofxWebUI.h
//
//  Created by ISHII 2bit on 2014/12/23.
//
//

#pragma once

#include "ofMain.h"
#include "ofxNodejs.h"
#include "ofxJsonxx.h"

#include "ofxWebUIParameter.h"

class ofxWebUI {
public:
    void setup(string appName) {
        this->appName = appName;
    }
    
    void update() {
        using namespace ofxNodejs;
        for(auto it : parameters) {
            string name = string("values.") + it.first;
            it.second->get($(name));
        }
    }
    
    template <typename T>
    void bindParameter(const string &name, ofxWebUIType type, T &value, ofxJsonxx::Object option = ofxJsonxx::Object()) {
        keys.push_back(name);
        parameters[name] = ofPtr<ofxWebUIParameter>(new ofxWebUIParameter(name, type, value, option));
    }
    
    void runServer(bool withOpenBrowser = false) {
        using namespace ofxNodejs;
        
        ofxNodejs::init();
        
        dumpOutConfig();
        dumpOutParameters();
        
        $$("ofxWebUIData/app.js");
        if(withOpenBrowser) {
            ofLaunchBrowser("http://localhost:8000/");
        }
    }
    
    void dumpOutConfig() {
        ofxJsonxx::Object exports;
        exports << "appName" << appName;
        
        dumpOut("ofxWebUIData/generated/config.js", exports);
    }
    
    void dumpOutParameters() {
        ofxJsonxx::Array arr;
        for(auto key : keys) {
            auto &v = parameters[key];
            ofxJsonxx::Object o;
            o << "name" << key;
            o << "type" << (string)ofxWebUITypeStrings[v->type];
            o << "option" << v->option;
            arr << o;
        }
        ofxJsonxx::Object exports;
        exports << "data" << arr;
        
        dumpOut("ofxWebUIData/generated/parameters.js", exports);
    }
    
private:
    void dumpOut(const string &path, ofxJsonxx::Object &exports) {
        string buf;
        ofxJsonxx::saveToString(exports, buf);
        ofBuffer buffer("module.exports = " + buf);
        bool b  = ofBufferToFile(path, buffer);
        if(b) {
            ofLogVerbose() << "write success";
        } else {
            ofLogVerbose() << "write failure";
        }
    }
    
    string appName;
    map<string, ofPtr<ofxWebUIParameter> > parameters;
    vector<string> keys;
};
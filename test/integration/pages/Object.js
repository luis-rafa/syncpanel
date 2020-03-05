sap.ui.define(["sap/ui/test/Opa5","sap/ui/test/actions/Press","sap/ui/test/matchers/PropertyStrictEquals","./Common","./shareOptions"],function(e,t,s,i,a){"use strict";var n="Object";e.createPageObjects({onTheObjectPage:{baseClass:i,actions:Object.assign({iPressTheBackButton:function(){return this.waitFor({id:"page",viewName:n,actions:new t,errorMessage:"Did not find the nav button on object page"})}},a.createActions(n)),assertions:Object.assign({iShouldSeeTheRememberedObject:function(){return this.waitFor({success:function(){var t=this.getContext().currentItem.bindingPath;this.waitFor({id:"page",viewName:n,matchers:function(e){return e.getBindingContext()&&e.getBindingContext().getPath()===t},success:function(s){e.assert.strictEqual(s.getBindingContext().getPath(),t,"was on the remembered detail page")},errorMessage:"Remembered object "+t+" is not shown"})}})},iShouldSeeTheObjectViewsBusyIndicator:function(){return this.waitFor({id:"page",viewName:n,matchers:new s({name:"busy",value:true}),autoWait:false,success:function(t){e.assert.ok(t.getBusy(),"The object view is busy")},errorMessage:"The object view is not busy"})},theViewIsNotBusyAnymore:function(){return this.waitFor({id:"page",viewName:n,matchers:new s({name:"busy",value:false}),autoWait:false,success:function(t){e.assert.ok(!t.getBusy(),"The object view is not busy")},errorMessage:"The object view is busy"})},theObjectViewsBusyIndicatorDelayIsZero:function(){return this.waitFor({id:"page",viewName:n,success:function(t){e.assert.strictEqual(t.getBusyIndicatorDelay(),0,"The object view's busy indicator delay is zero.")},errorMessage:"The object view's busy indicator delay is not zero."})},theObjectViewsBusyIndicatorDelayIsRestored:function(){return this.waitFor({id:"page",viewName:n,matchers:new s({name:"busyIndicatorDelay",value:1e3}),success:function(){e.assert.ok(true,"The object view's busy indicator delay default is restored.")},errorMessage:"The object view's busy indicator delay is still zero."})},theShareTileButtonShouldContainTheRememberedObjectName:function(){return this.waitFor({id:"shareTile",viewName:n,matchers:function(e){var t=this.getContext().currentItem.name;var s=e.getTitle();return s&&s.indexOf(t)>-1}.bind(this),success:function(){e.assert.ok(true,"The Save as Tile button contains the object name")},errorMessage:"The Save as Tile did not contain the object name"})}},a.createAssertions(n))}})});
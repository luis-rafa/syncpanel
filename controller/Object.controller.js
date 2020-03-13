sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","../model/formatter"],function(e,t,n){"use strict";return e.extend("com.colsubsidio.syncpanel.syncpanel.controller.Object",{formatter:n,onInit:function(){var e,n=new t({busy:true,delay:0});this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched,this);e=this.getView().getBusyIndicatorDelay();this.setModel(n,"objectView");this.getOwnerComponent().getModel().metadataLoaded().then(function(){n.setProperty("/delay",e)})},onShareInJamPress:function(){var e=this.getModel("objectView"),t=sap.ui.getCore().createComponent({name:"sap.collaboration.components.fiori.sharing.dialog",settings:{object:{id:location.href,share:e.getProperty("/shareOnJamTitle")}}});t.open()},_onObjectMatched:function(e){var t=e.getParameter("arguments").objectId;this.getModel().metadataLoaded().then(function(){var e=this.getModel().createKey("Epss",{EpsId:t});this._bindView("/"+e)}.bind(this))},_bindView:function(e){var t=this.getModel("objectView"),n=this.getModel();this.getView().bindElement({path:e,events:{change:this._onBindingChange.bind(this),dataRequested:function(){n.metadataLoaded().then(function(){t.setProperty("/busy",true)})},dataReceived:function(){t.setProperty("/busy",false)}}})},_onBindingChange:function(){var e=this.getView(),t=this.getModel("objectView"),n=e.getElementBinding();if(!n.getBoundContext()){this.getRouter().getTargets().display("objectNotFound");return}var i=this.getResourceBundle(),o=e.getBindingContext().getObject(),s=o.EpsId,a=o.EpsDescripcion;t.setProperty("/busy",false);this.addHistoryEntry({title:this.getResourceBundle().getText("objectTitle")+" - "+a,icon:"sap-icon://enter-more",intent:"#PaneldeSincronizacion-display&/Epss/"+s});t.setProperty("/saveAsTileTitle",i.getText("saveAsTileTitle",[a]));t.setProperty("/shareOnJamTitle",a);t.setProperty("/shareSendEmailSubject",i.getText("shareSendEmailObjectSubject",[s]));t.setProperty("/shareSendEmailMessage",i.getText("shareSendEmailObjectMessage",[a,s,location.href]))}})});
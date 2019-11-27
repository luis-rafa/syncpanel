sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"./BaseController"
], function (Controller, JSONModel, BaseController) {
	"use strict";

	return BaseController.extend("com.colsubsidio.syncpanel.syncpanel.controller.paymentboxSync", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.colsubsidio.syncpanel.syncpanel.view.paymentboxSync
		 */
		onInit: function () {
			var oTiles = {
				"TileCollection": [{
					"icon": "sap-icon://desktop-mobile",
					"title": "Sincronizar Terminales desde el ERP",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://synchronize",
					"title": "Sincronizar Apertura de cajas desde el ERP",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://customer-and-supplier",
					"title": "Sincronizar Supervisores desde el ERP",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://batch-payments",
					"title": "Sincronizar Tipos de pago desde el ERP",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://supplier",
					"title": "Sincronizar Cajeros desde el ERP",
					"info": "Habilitado",
					"infoState": "Success"
				}]
			};
			var oModel = new JSONModel(oTiles);
			this.getView().setModel(oModel);
		},
		onBack: function () {
				this.getRouter().navTo("worklist");
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf com.colsubsidio.syncpanel.syncpanel.view.paymentboxSync
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.colsubsidio.syncpanel.syncpanel.view.paymentboxSync
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.colsubsidio.syncpanel.syncpanel.view.paymentboxSync
		 */
		//	onExit: function() {
		//
		//	}

	});

});
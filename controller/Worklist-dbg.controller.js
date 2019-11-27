sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator) {
	"use strict";
	var that;
	var sDestination= "/colsubsidio-app/";
	return BaseController.extend("com.colsubsidio.syncpanel.syncpanel.controller.Worklist", {

		formatter: formatter,
		onEvent:function(oEvt){
			/*console.log(oEvt.getSource());
			console.log(oEvt.getSource().getBindingContext().getObject());
			console.log("Premise")
			console.log(this.getRouter())*/
			//this.getRouter().navTo("paymentboxSync");
			var oProperty = oEvt.getSource().getBindingContext().getObject();
			that.onSelectService(oProperty, oEvt.getSource());
		},
		onSelectService:function(oProperty, oControl){
			$.ajax({
				method: 'GET',
				url: sDestination + that.URL_SYNC[1],
				beforeSend:function(){
					oControl.setBusy(true);	
				},
				success:function(odata){
					oControl.setBusy(false);
				},
				error:function(){
					console.log("Error")
				}
			});
		},
		onGoPaymentboxSync:function(){
			this.getRouter().navTo("paymentboxSync");
		},
		onInit: function () {
			that = this;
			var oTiles = {
				"TileCollection": [{
					"icon": "sap-icon://offsite-work",
					"title": "Causales Externos",
					"info": "Habilitado",
					"method":1,
					"infoState": "Success"
				},{
					"icon": "sap-icon://database",
					"title": "Constantes ERP",
					"info": "Habilitado",
					"method":2,
					"infoState": "Success"
				},{
					"icon": "sap-icon://decision",
					"title": "Contratos Marco",
					"info": "Habilitado",
					"method":3,
					"infoState": "Success"
				},{
					"icon": "sap-icon://decision",
					"title": "Convenios Centro / IPS",
					"info": "Habilitado",
					"method":4,
					"infoState": "Success"
				},{
					"icon": "sap-icon://database",
					"title": "Conversores EPS",
					"info": "Habilitado",
					"method":5,
					"infoState": "Success"
				},{
					"icon": "sap-icon://database",
					"title": "Cuotas Moderadoras EPS",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://database",
					"title": "Carga EPS´s",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://database",
					"title": "Homologacion EPS / IPS",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://accidental-leave",
					"title": "Farmacias",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://database",
					"title": "IPS / Convenio",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://database",
					"title": "Medicamentos EPS / Convenio",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://product",
					"title": "Medicamentos Stock",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://database",
					"title": "Motivos Pendiente",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://customer-order-entry",
					"title": "Sincronizar Pedido",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://customize",
					"title": "Tablas Maestras",
					"info": "Habilitado",
					"infoState": "Success"
				},{
					"icon": "sap-icon://database",
					"title": "Topes Moléculas",
					"info": "Habilitado",
					"infoState": "Success"
				}]
			};
			var oModel = new JSONModel(oTiles);
			this.getView().setModel(oModel);

			// var oViewModel,
			// 	iOriginalBusyDelay,
			// 	oTable = this.byId("table");

			// iOriginalBusyDelay = oTable.getBusyIndicatorDelay();

			// this._aTableSearchState = [];

			// oViewModel = new JSONModel({
			// 	worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
			// 	saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
			// 	shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
			// 	shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
			// 	shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
			// 	tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
			// 	tableBusyDelay : 0
			// });
			// this.setModel(oViewModel, "worklistView");

			// oTable.attachEventOnce("updateFinished", function(){
			// 	oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			// });

			// this.addHistoryEntry({
			// 	title: this.getResourceBundle().getText("worklistViewTitle"),
			// 	icon: "sap-icon://table-view",
			// 	intent: "#PaneldeSincronizacion-display"
			// }, true);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {

			// var sTitle,
			// 	oTable = oEvent.getSource(),
			// 	iTotalItems = oEvent.getParameter("total");
			// if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
			// 	sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			// } else {
			// 	sTitle = this.getResourceBundle().getText("worklistTableTitle");
			// }
			// this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);

		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function (oEvent) {
			// The source is the list item that got pressed
			/*this._showObject(oEvent.getSource());*/
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
			// var oViewModel = this.getModel("worklistView"),
			// 	oShareDialog = sap.ui.getCore().createComponent({
			// 		name: "sap.collaboration.components.fiori.sharing.dialog",
			// 		settings: {
			// 			object:{
			// 				id: location.href,
			// 				share: oViewModel.getProperty("/shareOnJamTitle")
			// 			}
			// 		}
			// 	});
			// oShareDialog.open();
		},

		onSearch: function (oEvent) {
			// if (oEvent.getParameters().refreshButtonPressed) {
			// 	// Search field's 'refresh' button has been pressed.
			// 	// This is visible if you select any master list item.
			// 	// In this case no new search is triggered, we only
			// 	// refresh the list binding.
			// 	this.onRefresh();
			// } else {
			// 	var aTableSearchState = [];
			// 	var sQuery = oEvent.getParameter("query");

			// 	if (sQuery && sQuery.length > 0) {
			// 		aTableSearchState = [new Filter("EpsDescripcion", FilterOperator.Contains, sQuery)];
			// 	}
			// 	this._applySearch(aTableSearchState);
			// }

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			// var oTable = this.byId("table");
			// oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function (oItem) {
			// this.getRouter().navTo("object", {
			// 	objectId: oItem.getBindingContext().getProperty("EpsId")
			// });
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function (aTableSearchState) {
			// var oTable = this.byId("table"),
			// 	oViewModel = this.getModel("worklistView");
			// oTable.getBinding("items").filter(aTableSearchState, "Application");
			// // changes the noDataText of the list in case there are no filter results
			// if (aTableSearchState.length !== 0) {
			// 	oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			// }
		}

	});
});
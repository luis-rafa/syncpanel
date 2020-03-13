sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, Fragment, MessageBox) {
	"use strict";
	var that;
	var OData;
	var sDestination = "/sapcaja-app/";
	var aEPSs;
	var aCentros;
	return BaseController.extend("com.colsubsidio.syncpanel.syncpanel.controller.paymentboxSync", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.colsubsidio.syncpanel.syncpanel.view.paymentboxSync
		 */
		onEvent: function (oEvt) {
			/*console.log(oEvt.getSource());
			console.log(oEvt.getSource().getBindingContext().getObject());
			console.log("Premise")
			console.log(this.getRouter())*/
			//this.getRouter().navTo("paymentboxSync");
			var oProperty = oEvt.getSource().getBindingContext().getObject();
			that.onSelectService(oProperty, oEvt.getSource());
		},
		onSelectService: function (oProperty, oControl) {
			var oModelDialog = new JSONModel({
				selectedEpsKey: ""
			});
			if (oProperty['param']) {
				var oView = this.getView();
				if (!this.byId("ParamDialog")) {
					Fragment.load({
						id: oView.getId(),
						name: "com.colsubsidio.syncpanel.syncpanel.view.Dialog.BoxParamDialog",
						controller: that
					}).then(function (oDialog) {
						oView.addDependent(oDialog);
						oDialog.open();
						oDialog.setModel(oModelDialog);
						that._oDialog = oDialog;
						that.onCreateContent(oProperty, oDialog);
					});
				} else {
					this.byId("ParamDialog").open();
					that.onCreateContent(oProperty, this.byId("ParamDialog"));
				}
			} else {
				that.onSendService(oProperty, oControl, "");
			}
		},
		onSendService: function (oProperty, oControl, sAditional, isDilog, sType, aContent) {

			console.log(sDestination + oProperty.url + sAditional)
			console.log(oProperty)
			console.log(oControl)
			console.log(sAditional)
			console.log(isDilog)
			console.log(sType)
			console.log(aContent)
			if (sType === undefined) {
				sType = 'GET'
			}
			var oConfig = {
				method: sType,
				timeout: 18000000,
				url: sDestination + oProperty.url + sAditional,
				contentType: "application/json",
				headers: {
					"Accept": "application/json"
				},
				beforeSend: function () {
					oControl.setBusy(true);
				},
				success: function (odata) {
					oControl.setBusy(false);
					MessageBox.show(
						"Datos sincronizados", {
							icon: MessageBox.Icon.INFORMATION,
							title: "SAP DISPENSACION",
							actions: [MessageBox.Action.OK],
							onClose: function (oAction) {

							}
						}
					);
					if (isDilog) {
						oControl.close();
					}
				},
				error: function () {
					oControl.setBusy(false);
					sap.m.MessageToast.show("Error al tratar de sincronizar.");
					if (isDilog) {
						oControl.close();
					}
					oControl.setInfoState(sap.ui.core.ValueState.Error);
					oControl.setInfo("Error");

				}
			};
			if (sType === 'POST') {
				oConfig.data = JSON.stringify(aContent);
			}
			$.ajax(oConfig);
		},
		onCreateContent: function (oProperty, oDialog) {
			var oContainer = that.getView().byId("feObjects").destroyFormElements();
			var oElement;
			var aControls = {};
			var aObjectId = {};
			$.each(oProperty.param, function (key, value) {
				aControls = {};
				aControls["grupo" + key] = [];

				$.each(value.grupo, function (gKey, gValue) {
					//aControls.push(that.onCreateObject(gValue))
					aControls = that.onCreateObject(gValue, aControls, key);
				});
				oElement = null;
				oElement = new sap.ui.layout.form.FormElement({
					label: aControls.l.text,
					fields: [
						aControls.o
					]
				});
				oContainer.addFormElement(oElement);
				aObjectId["grupo" + key] = aControls["grupo" + key];
			})
			oDialog.setModel(new JSONModel(aObjectId));
			oDialog.setModel(new JSONModel(oProperty), "info");
		},
		onSync: function () {
			var oDialogsSync = this.byId("ParamDialog");
			var oModelDialog = oDialogsSync.getModel("info").getData();
			var sUrl = "";
			var oDataModel = oDialogsSync.getModel().getData();
			var oControl;
			var bFlag = false;
			var sType = 'GET';
			sType = oModelDialog.method;
			var aContent = [];
			$.each(oDataModel, function (key, value) {
				console.log(value)
				console.log(key)
				$.each(value, function (sKey, sValue) {
					oControl = "";
					if (sValue.type === "c") {
						oControl = sap.ui.getCore().byId(sValue.id).getSelectedKey();
						if (oControl === "") {
							sap.m.MessageToast.show("Campo vacio");
							bFlag = false;
							return;
						} else {
							if (sValue.pos !== 0) {
								sUrl = sUrl + "/" + oControl;
							} else {
								sUrl = sUrl + oControl;
							}
							bFlag = true;
						}
					} else if (sValue.type === "i") {
						console.log(sValue.id)
						oControl = sap.ui.getCore().byId(sValue.id).getValue();
						if (oControl === "") {
							sap.m.MessageToast.show("Campo vacio");
							bFlag = false;
							return;
						} else {
							if (sValue.pos !== 0) {
								sUrl = sUrl + "/" + oControl;
							} else {
								sUrl = sUrl + oControl;
							}
							bFlag = true;
						}
						if(sType === 'POST'){
							bFlag = true;
							//sType = 'POST'
							sUrl = "";
							aContent.push(oControl);
						}
					} else if (sValue.type === "m") {
						console.log(sValue.id)
						oControl = sap.ui.getCore().byId(sValue.id).getSelectedKeys();
						if (oControl.length <= 0) {
							sap.m.MessageToast.show("Capo de seleccion vacio.");
							bFlag = false;
							return;
						}
						bFlag = true;
						sType = 'POST'
						aContent = oControl;
					}

				})
			})
			console.log(sUrl)
			if (bFlag) {
				that.onSendService(oModelDialog, oDialogsSync, sUrl, true, sType, aContent);
			}

		},
		onCreateObject: function (oControl, aControls, iKey) {
			if (oControl.type === "l") {
				aControls.l = {
					text: oControl.text
				};
			} else if (oControl.type === "o") {
				if (oControl.subType === "i") {
					aControls.o = new sap.m.Input("grupo-" + iKey + oControl.subType, {
						placeholder: ""
					});
					aControls["grupo" + iKey].push({
						type: "i",
						id: "grupo-" + iKey + oControl.subType,
						pos: iKey
					});
				} else if (oControl.subType === "c") {
					var comboBox = new sap.m.ComboBox("grupo-" + iKey + oControl.subType, {

						placeholder: "Seleccione EPS"
					});
					var oItemTemplate = new sap.ui.core.Item({
						text: '{EpsDescripcion}',
						key: '{EpsCodigo}'
					});
					//comboBox.setModel(aEPSs);
					comboBox.bindItems("/results", oItemTemplate);
					aControls.o = comboBox;
					aControls["grupo" + iKey].push({
						type: "c",
						id: "grupo-" + iKey + oControl.subType,
						pos: iKey
					});
				} else if (oControl.subType === "m") {
					var comboBox = new sap.m.MultiComboBox("grupo-" + iKey + oControl.subType, {

						placeholder: oControl.placeholder
					});
					var oItemTemplate = new sap.ui.core.Item({
						text: '{Centro} - {FarmaciaDescripcion}',
						key: '{Centro}'
					});
					//comboBox.setModel(aCentros);
					comboBox.bindItems("/results", oItemTemplate);
					aControls.o = comboBox;
					aControls["grupo" + iKey].push({
						type: "m",
						id: "grupo-" + iKey + oControl.subType,
						pos: iKey
					});
				}
			}
			return aControls;
		},
		onGoPaymentboxSync: function () {
			this.getRouter().navTo("paymentboxSync");
		},
		onLoadDataInitial: function () {
			// OData.read("/Epss", {
			// 	success: function (odata, response) {
			// 		var oModelEps = new sap.ui.model.json.JSONModel();
			// 		oModelEps.setData(odata);
			// 		oModelEps.setSizeLimit(1000); //Size Limit
			// 		aEPSs = oModelEps;
			// 	}
			// });
			// OData.read("/Farmacias", {
			// 	success: function (odata, response) {
			// 		var oModelEps = new sap.ui.model.json.JSONModel();
			// 		oModelEps.setData(odata);
			// 		oModelEps.setSizeLimit(1000); //Size Limit
			// 		aCentros = oModelEps;
			// 		//aCentros = new JSONModel(odata).setSizeLimit(1000);
			// 	}
			// });
		},
		onInit: function () {
			that = this;
			// $.ajax({
			// 	method: 'POST',
			// 	timeout: 18000000,
			// 	url: "/colsubsidio-app/dispensacion/sync/medicamentosStockCentro",
			// 	dataType: "json",
			// 	async: true,
			// 	contentType: "application/json",
			// 	crossDomain: true,
			// 	data: JSON.stringify(["D209"]),
			// 	success: function (data) {
			// 		console.log(data)
			// 	},
			// 	error: function (data, textStatus, errorThrown) {
			// 		if (textStatus == "timeout") {
			// 			alert("Got timeout");
			// 		}
			// 	}
			// });
			// var oConfig = {
			// 	method: 'POST',
			// 	url: "/colsubsidio-app/dispensacion/sync/medicamentosStockCentro",
			// 	data: JSON.stringify(["D209"]),
			// 	contentType: "application/json",
			// 	async: true,
			// 	crossDomain: true,
			// 	timeout: 1800000,
			// 	headers: {
			// 		"Accept": "application/json"
			// 	},
			// 	beforeSend: function () {

			// 	},
			// 	success: function (odata) {

			// 	},
			// 	error: function () {

			// 	}
			// };
			// $.ajax(oConfig);

			//var OData = that.getOwnerComponent().getModel();
			OData = that.getOwnerComponent().getModel();
			that.onLoadDataInitial();
			var oTiles = {
				"TileCollection": [
					// 	{
					// 	"icon": "sap-icon://offsite-work",
					// 	"title": "Causales Externos",
					// 	"info": "Habilitado",
					// 	"method": 1,
					// 	"url": "dispensacion/sync/causalesExterno",
					// 	"infoState": "Success"
					// }, 
					{
						"icon": "sap-icon://database",
						"title": "Asigncaciones CAJA",
						"info": "Habilitado",
						"method": "GET",
						"url": "caja/sync/asignacionesCaja",
						"infoState": "Success",
						"enabled":false
					}, {
						"icon": "sap-icon://decision",
						"title": "Cajeros",
						"info": "Habilitado",
						"method": "GET",
						"url": "caja/sync/cajeros",
						"infoState": "Success",
						"enabled":false
					}, {
						"icon": "sap-icon://product",
						"title": "Cerrar caja de usuario",
						"info": "Habilitado",
						"infoState": "Success",
						"method": "GET",
						"multi":true,
						"url": "caja/sync/cerrarCaja/",
						"enabled":false,
						"param": [{
							"grupo": [{
								type: "l",
								text: "Usuario",
								wrapping: true
							}, {
								type: "o",
								subType: "i"
							}]
						}]
					}, {
						"icon": "sap-icon://database",
						"title": "Sucursales",
						"info": "Habilitado",
						"method": "GET",
						"url": "caja/sync/sucursales",
						"infoState": "Success",
						"enabled":false
					}, {
						"icon": "sap-icon://customize",
						"title": "Supervisores",
						"info": "Habilitado",
						"method": "GET",
						"url": "caja/sync/supervisores",
						"infoState": "Success",
						"enabled":false
					}, {
						"icon": "sap-icon://customize",
						"title": "Terminales",
						"info": "Habilitado",
						"method": "GET",
						"url": "caja/sync/terminales",
						"infoState": "Success",
						"enabled":false
					},{
						"icon": "sap-icon://customize",
						"title": "Tipos de pago",
						"info": "Habilitado",
						"method": "GET",
						"url": "caja/sync/tiposPago",
						"infoState": "Success",
						"enabled":false
					}
				]
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
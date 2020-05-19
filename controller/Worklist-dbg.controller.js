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
	var sDestination = "/colsubsidiojob	-app/";
	var aEPSs;
	var aCentros;
	return BaseController.extend("com.colsubsidio.syncpanel.syncpanel.controller.Worklist", {

		formatter: formatter,
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
						name: "com.colsubsidio.syncpanel.syncpanel.view.Dialog.ParamDialog",
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
		onClose:function(){
			that._oDialog.close();
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
					comboBox.setModel(aEPSs);
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
					comboBox.setModel(aCentros);
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
			OData.read("/Epss", {
				success: function (odata, response) {
					var oModelEps = new sap.ui.model.json.JSONModel();
					oModelEps.setData(odata);
					oModelEps.setSizeLimit(1000); //Size Limit
					aEPSs = oModelEps;
				}
			});
			OData.read("/Farmacias", {
				success: function (odata, response) {
					var oModelEps = new sap.ui.model.json.JSONModel();
					oModelEps.setData(odata);
					oModelEps.setSizeLimit(1000); //Size Limit
					aCentros = oModelEps;
					//aCentros = new JSONModel(odata).setSizeLimit(1000);
				}
			});
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
						"title": "Constantes ERP",
						"info": "Habilitado",
						"method": "GET",
						"url": "dispensacion/sync/constantesErp",
						"infoState": "Success"
					}, {
						"icon": "sap-icon://decision",
						"title": "Contratos Marco",
						"info": "Habilitado",
						"method": "GET",
						"url": "dispensacion/sync/contratoMarco",
						"infoState": "Success"
					}, {
						"icon": "sap-icon://decision",
						"title": "Convenios Centro / IPS",
						"info": "Habilitado",
						"method": "GET",
						"url": "dispensacion/sync/conveniosCentroIps",
						"infoState": "Success"
					}, {
						"icon": "sap-icon://database",
						"title": "Datos Maestros",
						"info": "Habilitado",
						"method": "GET",
						"url": "dispensacion/sync/datosMaestros",
						"infoState": "Success"
					}, {
						"icon": "sap-icon://database",
						"title": "Diccionarios",
						"info": "Habilitado",
						"method": "GET",
						"url": "dispensacion/sync/diccionarios",
						"infoState": "Success"
					}, {
						"icon": "sap-icon://database",
						"title": "EPS / IPS",
						"info": "Habilitado",
						"method": "GET",
						"url": "dispensacion/sync/epsIps",
						"infoState": "Success"
					}, {
						"icon": "sap-icon://database",
						"title": "Forma de pago",
						"info": "Habilitado",
						"method": "GET",
						"url": "dispensacion/sync/formaPago",
						"infoState": "Success"
					},
					// {
					// 	"icon": "sap-icon://database",
					// 	"title": "Conversores EPS",
					// 	"info": "Habilitado",
					// 	"method": 5,
					// 	"url": "dispensacion/sync/conversoresEps",
					// 	"infoState": "Success"
					// },
					// {
					// 	"icon": "sap-icon://database",
					// 	"title": "Cuotas Moderadoras EPS",
					// 	"info": "Habilitado",
					// 	"url": "dispensacion/sync/cuotasModeradora/",
					// 	"param": [{
					// 		"grupo": [{
					// 			type: "l",
					// 			text: "EPS",
					// 			wrapping: true,
					// 		}, {
					// 			type: "o",
					// 			subType: "c",
					// 			source: "/Epss",
					// 			selectedKey: "{selectedEpsKey}"

					// 		}]
					// 	}],
					// 	"infoState": "Success"
					// }
					{
						"icon": "sap-icon://database",
						"title": "Medicamentos EPS / Convenio",
						"info": "Habilitado",
						"infoState": "Success",
						"method": "GET",
						"url": "dispensacion/sync/medicamentos/",
						"param": [{
							"grupo": [{
								type: "l",
								text: "EPS",
								wrapping: true
							}, {
								type: "o",
								subType: "c",
								source: "/Eps",
								selectedKey: "{selectedKey}",
								placeholder: "Seleccione EPS´s"
							}]
						}, {
							"grupo": [{
								type: "l",
								text: "Convenio",
								wrapping: true
							},  {
								type: "o",
								subType: "i"
							}]

						}]
					}, {
						"icon": "sap-icon://database",
						"title": "Medicamentos IPS / Cuotas Moderadoras",
						"info": "Habilitado",
						"infoState": "Success",
						"method": "GET",
						"url": "dispensacion/sync/medicamentosIpsCuotaMod/",
						"param": [{
							"grupo": [{
								type: "l",
								text: "EPS",
								wrapping: true
							}, {
								type: "o",
								subType: "c",
								source: "/Eps",
								selectedKey: "{selectedKey}",
								placeholder: "Seleccione EPS´s"
							}]
						}]
					}, {
						"icon": "sap-icon://product",
						"title": "Medicamentos Stock",
						"info": "Habilitado",
						"infoState": "Success",
						"method": "POST",
						"multi":true,
						"url": "dispensacion/sync/medicamentosStockCentro",
						"param": [{
							"grupo": [{
								type: "l",
								text: "Centro",
								wrapping: true
							}, {
								type: "o",
								subType: "i"
							}]
						}]
					}, {
						"icon": "sap-icon://database",
						"title": "Motivos / Causales Pendientes",
						"info": "Habilitado",
						"method": "GET",
						"url": "dispensacion/sync/motivosCausalesPendientes",
						"infoState": "Success"
					}, {
						"icon": "sap-icon://customer-order-entry",
						"title": "Sincronizar Pedido",
						"info": "Habilitado",
						"method": "GET",
						"url": "dispensacion/sync/pedido/",
						"param": [{
							"grupo": [{
								type: "l",
								text: "N° Pedido",
								wrapping: true
							}, {
								type: "o",
								subType: "i"
							}]
						}],
						"infoState": "Success"
					}, {
						"icon": "sap-icon://customize",
						"title": "Tablas Maestras",
						"info": "Habilitado",
						"method": "GET",
						"url": "dispensacion/sync/datosMaestros",
						"infoState": "Success"
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
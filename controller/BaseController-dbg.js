sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library"
], function (Controller, UIComponent, mobileLibrary) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return Controller.extend("com.colsubsidio.syncpanel.syncpanel.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},
		URL_SYNC: {
				1:"dispensacion/sync/causalesExterno",
				2:"dispensacion/sync/constantesErp",
				3:"dispensacion/sync/contratosMarco",
				4:"dispensacion/sync/conveniosCentroIps",
				5:"dispensacion/sync/conversoresEps",
				6:""
		},
		ajax: function (service, params, callbacks) {
			var paramsAjax, _params;
			_params = $.isEmptyObject(params) ? {} : params;

			paramsAjax = {
				type: _params.type !== null && typeof _params.type !== "undefined" ? _params.type : "GET",
				url: "/colsubsidio-app/" + service,
				contentType: _params.contentType !== null && typeof _params.contentType !== "undefined" ? _params.contentType : "application/json",
				headers: $.isEmptyObject(_params.headers) ? {
					"Accept": "application/json",
				} : _params.headers,
				dataType: _params.dataType !== null && typeof _params.dataType !== "undefined" ? _params.dataType : "json",
				data: _params.data !== null && typeof _params.data !== "undefined" ? _params.data : ""
			};

			if (!$.isEmptyObject(callbacks)) {
				if ($.isFunction(callbacks.beforeSend)) {
					paramsAjax.beforeSend = callbacks.beforeSend;
				}
				if ($.isFunction(callbacks.success)) {
					paramsAjax.success = callbacks.success;
				}
				if ($.isFunction(callbacks.error)) {
					paramsAjax.error = callbacks.error;
				}
				if ($.isFunction(callbacks.complete)) {
					paramsAjax.complete = callbacks.complete;
				}
			}
			$.ajax(paramsAjax).always(function (e, status, jqXHR) {
				if ($.isFunction(jqXHR.getResponseHeader) && jqXHR.getResponseHeader("com.sap.cloud.security.login")) {
					alert("Session is expired, page shall be reloaded.");
					window.location.reload();
					console.log("Valid expired session");
				}
			});
		},
		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function () {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		/**
		 * Adds a history entry in the FLP page history
		 * @public
		 * @param {object} oEntry An entry object to add to the hierachy array as expected from the ShellUIService.setHierarchy method
		 * @param {boolean} bReset If true resets the history before the new entry is added
		 */
		addHistoryEntry: (function () {
			var aHistoryEntries = [];

			return function (oEntry, bReset) {
				if (bReset) {
					aHistoryEntries = [];
				}

				var bInHistory = aHistoryEntries.some(function (oHistoryEntry) {
					return oHistoryEntry.intent === oEntry.intent;
				});

				if (!bInHistory) {
					aHistoryEntries.push(oEntry);
					this.getOwnerComponent().getService("ShellUIService").then(function (oService) {
						oService.setHierarchy(aHistoryEntries);
					});
				}
			};
		})()

	});

});
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"com/colsubsidio/syncpanel/syncpanel/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","./model/models","./controller/ErrorHandler"],function(t,e,s,i){"use strict";return t.extend("com.colsubsidio.syncpanel.syncpanel.Component",{metadata:{manifest:"json"},init:function(){t.prototype.init.apply(this,arguments);this._oErrorHandler=new i(this);this.setModel(s.createDeviceModel(),"device");this.setModel(s.createFLPModel(),"FLP");this.getRouter().initialize()},destroy:function(){this._oErrorHandler.destroy();t.prototype.destroy.apply(this,arguments)},getContentDensityClass:function(){if(this._sContentDensityClass===undefined){if(document.body.classList.contains("sapUiSizeCozy")||document.body.classList.contains("sapUiSizeCompact")){this._sContentDensityClass=""}else if(!e.support.touch){this._sContentDensityClass="sapUiSizeCompact"}else{this._sContentDensityClass="sapUiSizeCozy"}}return this._sContentDensityClass}})});
},
	"com/colsubsidio/syncpanel/syncpanel/controller/App.controller.js":function(){sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel"],function(e,t){"use strict";return e.extend("com.colsubsidio.syncpanel.syncpanel.controller.App",{onInit:function(){var e,n,o=this.getView().getBusyIndicatorDelay();e=new t({busy:true,delay:0});this.setModel(e,"appView");n=function(){e.setProperty("/busy",false);e.setProperty("/delay",o)};this.getOwnerComponent().getModel().metadataLoaded().then(n);this.getOwnerComponent().getModel().attachMetadataFailed(n);this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())}})});
},
	"com/colsubsidio/syncpanel/syncpanel/controller/BaseController.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/UIComponent","sap/m/library"],function(e,n,t){"use strict";var o=t.URLHelper;return e.extend("com.colsubsidio.syncpanel.syncpanel.controller.BaseController",{getRouter:function(){return n.getRouterFor(this)},URL_SYNC:{1:"dispensacion/sync/causalesExterno",2:"dispensacion/sync/constantesErp",3:"dispensacion/sync/contratosMarco",4:"dispensacion/sync/conveniosCentroIps",5:"dispensacion/sync/conversoresEps",6:""},ajax:function(e,n,t){var o,s;s=$.isEmptyObject(n)?{}:n;o={type:s.type!==null&&typeof s.type!=="undefined"?s.type:"GET",url:"/colsubsidio-app/"+e,contentType:s.contentType!==null&&typeof s.contentType!=="undefined"?s.contentType:"application/json",headers:$.isEmptyObject(s.headers)?{Accept:"application/json"}:s.headers,dataType:s.dataType!==null&&typeof s.dataType!=="undefined"?s.dataType:"json",data:s.data!==null&&typeof s.data!=="undefined"?s.data:""};if(!$.isEmptyObject(t)){if($.isFunction(t.beforeSend)){o.beforeSend=t.beforeSend}if($.isFunction(t.success)){o.success=t.success}if($.isFunction(t.error)){o.error=t.error}if($.isFunction(t.complete)){o.complete=t.complete}}$.ajax(o).always(function(e,n,t){if($.isFunction(t.getResponseHeader)&&t.getResponseHeader("com.sap.cloud.security.login")){alert("Session is expired, page shall be reloaded.");window.location.reload();console.log("Valid expired session")}})},getModel:function(e){return this.getView().getModel(e)},setModel:function(e,n){return this.getView().setModel(e,n)},getResourceBundle:function(){return this.getOwnerComponent().getModel("i18n").getResourceBundle()},onShareEmailPress:function(){var e=this.getModel("objectView")||this.getModel("worklistView");o.triggerEmail(null,e.getProperty("/shareSendEmailSubject"),e.getProperty("/shareSendEmailMessage"))},addHistoryEntry:function(){var e=[];return function(n,t){if(t){e=[]}var o=e.some(function(e){return e.intent===n.intent});if(!o){e.push(n);this.getOwnerComponent().getService("ShellUIService").then(function(n){n.setHierarchy(e)})}}}()})});
},
	"com/colsubsidio/syncpanel/syncpanel/controller/ErrorHandler.js":function(){sap.ui.define(["sap/ui/base/Object","sap/m/MessageBox"],function(e,s){"use strict";return e.extend("com.colsubsidio.syncpanel.syncpanel.controller.ErrorHandler",{constructor:function(e){this._oResourceBundle=e.getModel("i18n").getResourceBundle();this._oComponent=e;this._oModel=e.getModel();this._bMessageOpen=false;this._sErrorText=this._oResourceBundle.getText("errorText");this._oModel.attachMetadataFailed(function(e){var s=e.getParameters();this._showServiceError(s.response)},this);this._oModel.attachRequestFailed(function(e){var s=e.getParameters();if(s.response.statusCode!=="404"||s.response.statusCode===404&&s.response.responseText.indexOf("Cannot POST")===0){this._showServiceError(s.response)}},this)},_showServiceError:function(e){if(this._bMessageOpen){return}this._bMessageOpen=true;s.error(this._sErrorText,{id:"serviceErrorMessageBox",details:e,styleClass:this._oComponent.getContentDensityClass(),actions:[s.Action.CLOSE],onClose:function(){this._bMessageOpen=false}.bind(this)})}})});
},
	"com/colsubsidio/syncpanel/syncpanel/controller/NotFound.controller.js":function(){sap.ui.define(["./BaseController"],function(n){"use strict";return n.extend("com.colsubsidio.syncpanel.syncpanel.controller.NotFound",{onLinkPressed:function(){this.getRouter().navTo("worklist")}})});
},
	"com/colsubsidio/syncpanel/syncpanel/controller/Object.controller.js":function(){sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","../model/formatter"],function(e,t,n){"use strict";return e.extend("com.colsubsidio.syncpanel.syncpanel.controller.Object",{formatter:n,onInit:function(){var e,n=new t({busy:true,delay:0});this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched,this);e=this.getView().getBusyIndicatorDelay();this.setModel(n,"objectView");this.getOwnerComponent().getModel().metadataLoaded().then(function(){n.setProperty("/delay",e)})},onShareInJamPress:function(){var e=this.getModel("objectView"),t=sap.ui.getCore().createComponent({name:"sap.collaboration.components.fiori.sharing.dialog",settings:{object:{id:location.href,share:e.getProperty("/shareOnJamTitle")}}});t.open()},_onObjectMatched:function(e){var t=e.getParameter("arguments").objectId;this.getModel().metadataLoaded().then(function(){var e=this.getModel().createKey("Epss",{EpsId:t});this._bindView("/"+e)}.bind(this))},_bindView:function(e){var t=this.getModel("objectView"),n=this.getModel();this.getView().bindElement({path:e,events:{change:this._onBindingChange.bind(this),dataRequested:function(){n.metadataLoaded().then(function(){t.setProperty("/busy",true)})},dataReceived:function(){t.setProperty("/busy",false)}}})},_onBindingChange:function(){var e=this.getView(),t=this.getModel("objectView"),n=e.getElementBinding();if(!n.getBoundContext()){this.getRouter().getTargets().display("objectNotFound");return}var i=this.getResourceBundle(),o=e.getBindingContext().getObject(),s=o.EpsId,a=o.EpsDescripcion;t.setProperty("/busy",false);this.addHistoryEntry({title:this.getResourceBundle().getText("objectTitle")+" - "+a,icon:"sap-icon://enter-more",intent:"#PaneldeSincronizacion-display&/Epss/"+s});t.setProperty("/saveAsTileTitle",i.getText("saveAsTileTitle",[a]));t.setProperty("/shareOnJamTitle",a);t.setProperty("/shareSendEmailSubject",i.getText("shareSendEmailObjectSubject",[s]));t.setProperty("/shareSendEmailMessage",i.getText("shareSendEmailObjectMessage",[a,s,location.href]))}})});
},
	"com/colsubsidio/syncpanel/syncpanel/controller/Worklist.controller.js":function(){sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","../model/formatter","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/core/Fragment"],function(e,o,t,n,s,a){"use strict";var i;var c;var r="/colsubsidio-app/";var l;var p;return e.extend("com.colsubsidio.syncpanel.syncpanel.controller.Worklist",{formatter:t,onEvent:function(e){var o=e.getSource().getBindingContext().getObject();i.onSelectService(o,e.getSource())},onSelectService:function(e,t){var n=new o({selectedEpsKey:""});if(e["param"]){var s=this.getView();if(!this.byId("ParamDialog")){a.load({id:s.getId(),name:"com.colsubsidio.syncpanel.syncpanel.view.Dialog.ParamDialog",controller:i}).then(function(o){s.addDependent(o);o.open();o.setModel(n);i._oDialog=o;i.onCreateContent(e,o)})}else{this.byId("ParamDialog").open();i.onCreateContent(e,this.byId("ParamDialog"))}}else{i.onSendService(e,t,"")}},onSendService:function(e,o,t,n,s,a){console.log(r+e.url+t);console.log(e);console.log(o);console.log(t);console.log(n);console.log(s);console.log(a);if(s===undefined){s="GET"}var i={method:s,timeout:18e6,url:r+e.url+t,contentType:"application/json",headers:{Accept:"application/json"},beforeSend:function(){o.setBusy(true)},success:function(e){o.setBusy(false);sap.m.MessageToast.show("Datos Sincronizados correctamente.");if(n){o.close()}},error:function(){o.setBusy(false);sap.m.MessageToast.show("Error al tratar de sincronizar.");o.setInfoState(sap.ui.core.ValueState.Error);o.setInfo("Error");if(n){o.close()}}};if(s==="POST"){i.data=JSON.stringify(a)}$.ajax(i)},onCreateContent:function(e,t){var n=i.getView().byId("feObjects").destroyFormElements();var s;var a={};var c={};$.each(e.param,function(e,o){a={};a["grupo"+e]=[];$.each(o.grupo,function(o,t){a=i.onCreateObject(t,a,e)});s=null;s=new sap.ui.layout.form.FormElement({label:a.l.text,fields:[a.o]});n.addFormElement(s);c["grupo"+e]=a["grupo"+e]});t.setModel(new o(c));t.setModel(new o(e),"info")},onSync:function(){var e=this.byId("ParamDialog");var o=e.getModel("info").getData();var t="";var n=e.getModel().getData();var s;var a=false;var c="GET";var r=[];$.each(n,function(e,o){console.log(o);console.log(e);$.each(o,function(e,o){s="";if(o.type==="c"){s=sap.ui.getCore().byId(o.id).getSelectedKey();if(s===""){sap.m.MessageToast.show("Campo vacio");a=false;return}else{if(o.pos!==0){t=t+"/"+s}else{t=t+s}a=true}}else if(o.type==="i"){console.log(o.id);s=sap.ui.getCore().byId(o.id).getValue();if(s===""){sap.m.MessageToast.show("Campo vacio");a=false;return}else{if(o.pos!==0){t=t+"/"+s}else{t=t+s}a=true}}else if(o.type==="m"){console.log(o.id);s=sap.ui.getCore().byId(o.id).getSelectedKeys();if(s.length<=0){sap.m.MessageToast.show("Capo de seleccion vacio.");a=false;return}a=true;c="POST";r=s}})});console.log(t);if(a){i.onSendService(o,e,t,true,c,r)}},onCreateObject:function(e,o,t){if(e.type==="l"){o.l={text:e.text}}else if(e.type==="o"){if(e.subType==="i"){o.o=new sap.m.Input("grupo-"+t+e.subType,{placeholder:""});o["grupo"+t].push({type:"i",id:"grupo-"+t+e.subType,pos:t})}else if(e.subType==="c"){var n=new sap.m.ComboBox("grupo-"+t+e.subType,{placeholder:"Seleccione EPS"});var s=new sap.ui.core.Item({text:"{EpsDescripcion}",key:"{EpsCodigo}"});n.setModel(l);n.bindItems("/results",s);o.o=n;o["grupo"+t].push({type:"c",id:"grupo-"+t+e.subType,pos:t})}else if(e.subType==="m"){var n=new sap.m.MultiComboBox("grupo-"+t+e.subType,{placeholder:e.placeholder});var s=new sap.ui.core.Item({text:"{Centro} - {FarmaciaDescripcion}",key:"{Centro}"});n.setModel(p);n.bindItems("/results",s);o.o=n;o["grupo"+t].push({type:"m",id:"grupo-"+t+e.subType,pos:t})}}return o},onGoPaymentboxSync:function(){this.getRouter().navTo("paymentboxSync")},onLoadDataInitial:function(){c.read("/Epss",{success:function(e,t){l=new o(e)}});c.read("/Farmacias",{success:function(e,t){p=new o(e)}})},onInit:function(){i=this;$.ajax({method:"POST",timeout:18e6,url:"/colsubsidio-app/dispensacion/sync/medicamentosStockCentro",dataType:"json",async:true,contentType:"application/json",crossDomain:true,data:JSON.stringify(["D209"]),success:function(e){console.log(e)},error:function(e,o,t){if(o=="timeout"){alert("Got timeout")}}});c=i.getOwnerComponent().getModel();i.onLoadDataInitial();var e={TileCollection:[{icon:"sap-icon://database",title:"Constantes ERP",info:"Habilitado",method:2,url:"dispensacion/sync/constantesErp",infoState:"Success"},{icon:"sap-icon://decision",title:"Contratos Marco",info:"Habilitado",method:3,url:"dispensacion/sync/contratoMarco",infoState:"Success"},{icon:"sap-icon://decision",title:"Convenios Centro / IPS",info:"Habilitado",method:4,url:"dispensacion/sync/conveniosCentroIps",infoState:"Success"},{icon:"sap-icon://database",title:"Diccionarios",info:"Habilitado",method:4,url:"dispensacion/sync/diccionarios",infoState:"Success"},{icon:"sap-icon://database",title:"Medicamentos EPS",info:"Habilitado",infoState:"Success",url:"dispensacion/sync/medicamentosIpsCuotaMod/",param:[{grupo:[{type:"l",text:"EPS",wrapping:true},{type:"o",subType:"c",source:"/Eps",selectedKey:"{selectedKey}",placeholder:"Seleccione EPS´s"}]}]},{icon:"sap-icon://product",title:"Medicamentos Stock",info:"Habilitado",infoState:"Success",method:"POST",url:"dispensacion/sync/medicamentosStockCentro",param:[{grupo:[{type:"l",text:"Centros",wrapping:true},{type:"o",subType:"m",source:"/Farmacias",placeholder:"Seleccione centros"}]}]},{icon:"sap-icon://database",title:"Motivos / Causales Pendientes",info:"Habilitado",url:"dispensacion/sync/motivosCausalesPendientes",infoState:"Success"},{icon:"sap-icon://customer-order-entry",title:"Sincronizar Pedido",info:"Habilitado",url:"dispensacion/sync/pedido/",param:[{grupo:[{type:"l",text:"N° Pedido",wrapping:true},{type:"o",subType:"i"}]}],infoState:"Success"},{icon:"sap-icon://customize",title:"Tablas Maestras",info:"Habilitado",url:"dispensacion/sync/datosMaestros",infoState:"Success"}]};var t=new o(e);this.getView().setModel(t)},onUpdateFinished:function(e){},onPress:function(e){},onShareInJamPress:function(){},onSearch:function(e){},onRefresh:function(){},_showObject:function(e){},_applySearch:function(e){}})});
},
	"com/colsubsidio/syncpanel/syncpanel/controller/paymentboxSync.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","./BaseController"],function(e,i,o){"use strict";return o.extend("com.colsubsidio.syncpanel.syncpanel.controller.paymentboxSync",{onInit:function(){var e={TileCollection:[{icon:"sap-icon://desktop-mobile",title:"Sincronizar Terminales desde el ERP",info:"Habilitado",infoState:"Success"},{icon:"sap-icon://synchronize",title:"Sincronizar Apertura de cajas desde el ERP",info:"Habilitado",infoState:"Success"},{icon:"sap-icon://customer-and-supplier",title:"Sincronizar Supervisores desde el ERP",info:"Habilitado",infoState:"Success"},{icon:"sap-icon://batch-payments",title:"Sincronizar Tipos de pago desde el ERP",info:"Habilitado",infoState:"Success"},{icon:"sap-icon://supplier",title:"Sincronizar Cajeros desde el ERP",info:"Habilitado",infoState:"Success"}]};var o=new i(e);this.getView().setModel(o)},onEvent:function(){sap.m.MessageToast.show("Proximamente Disponible .... gracias por su paciencia")},onBack:function(){this.getRouter().navTo("worklist")}})});
},
	"com/colsubsidio/syncpanel/syncpanel/i18n/i18n.properties":'# This is the resource bundle for Panel de Sincronizacion\n\n#XTIT: Application name\nappTitle=Panel de Sincronizacion\n\n#YDES: Application description\nappDescription=Master Data Synchronization Panel\n\n#~~~ Worklist View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n#XTIT: Worklist view title\nworklistViewTitle=Panel de Sincronizacion\n\n#XTIT: Worklist page title\nworklistTitle=Panel de Sincronizacion\n\n#XTIT: Table view title\nworklistTableTitle=<EpssPlural>\n\n#XTOL: Tooltip for the search field\nworklistSearchTooltip=Enter an <Epss> name or a part of it.\n\n#XBLI: text for a table with no data with filter or search\nworklistNoDataWithSearchText=No matching <EpssPlural> found\n\n#XTIT: Table view title with placeholder for the number of items\nworklistTableTitleCount=<Epss> ({0})\n\n#XTIT: The title of the column containing the EpsDescripcion of Epss\ntableNameColumnTitle=<EpsDescripcion>\n\n#XTIT: The title of the column containing the  and the unit of measure\ntableUnitNumberColumnTitle=<>\n\n#XBLI: text for a table with no data\ntableNoDataText=No <EpssPlural> are currently available\n\n#XLNK: text for link in \'not found\' pages\nbackToWorklist=Show Panel de Sincronizacion\n\n#~~~ Object View ~~~~~~~~~~~~~~~~~~~~~~~~~~\n#XTIT: Object view title\nobjectViewTitle=<Epss> Details\n\n#XTIT: Object page title\nobjectTitle=<Epss>\n\n\n#XTIT: Label for the EpsDescripcion\nEpsDescripcionLabel=EpsDescripcion\n\n\n#~~~ Share Menu Options ~~~~~~~~~~~~~~~~~~~~~~~\n#XTIT: Save as tile app title\nsaveAsTileTitle=Panel de Sincronizacion - {0}\n\n#XTIT: Send E-Mail subject\nshareSendEmailWorklistSubject=<Email subject PLEASE REPLACE ACCORDING TO YOUR USE CASE>\n\n#YMSG: Send E-Mail message\nshareSendEmailWorklistMessage=<Email body PLEASE REPLACE ACCORDING TO YOUR USE CASE>\\r\\n{0}\n\n#XTIT: Send E-Mail subject\nshareSendEmailObjectSubject=<Email subject including object identifier PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0}\n\n#YMSG: Send E-Mail message\nshareSendEmailObjectMessage=<Email body PLEASE REPLACE ACCORDING TO YOUR USE CASE> {0} (id: {1})\\r\\n{2}\n\n\n#~~~ Not Found View ~~~~~~~~~~~~~~~~~~~~~~~\n\n#XTIT: Not found view title\nnotFoundTitle=Not Found\n\n#YMSG: The Epss not found text is displayed when there is no Epss with this id\nnoObjectFoundText=This <Epss> is not available\n\n#YMSG: The Epss not available text is displayed when there is no data when starting the app\nnoObjectsAvailableText=No <EpssPlural> are currently available\n\n#YMSG: The not found text is displayed when there was an error loading the resource (404 error)\nnotFoundText=The requested resource was not found\n\n#~~~ Error Handling ~~~~~~~~~~~~~~~~~~~~~~~\n\n#YMSG: Error dialog description\nerrorText=Sorry, a technical error occurred! Please try again later.',
	"com/colsubsidio/syncpanel/syncpanel/localService/metadata.xml":'<edmx:Edmx xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" Version="1.0"><edmx:DataServices xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" m:DataServiceVersion="1.0"><Schema xmlns="http://schemas.microsoft.com/ado/2008/09/edm" Namespace="ModelOData"><EntityType Name="ConvenioNoPos"><Key><PropertyRef Name="ConvenioNoposId"/></Key><Property Name="Convenio" Type="Edm.String" Nullable="false" MaxLength="10"/><Property Name="ConvenioNoposId" Type="Edm.String" Nullable="false" MaxLength="255"/><Property Name="Eps" Type="Edm.String" Nullable="false" MaxLength="10"/><Property Name="Tipo_formula" Type="Edm.String" Nullable="false" MaxLength="2"/></EntityType><EntityType Name="ConversorEps"><Key><PropertyRef Name="ConversorId"/></Key><Property Name="ConversorId" Type="Edm.String" Nullable="false" MaxLength="255"/><Property Name="Descripcion" Type="Edm.String" Nullable="false" MaxLength="140"/><Property Name="TipoDato" Type="Edm.String" Nullable="false" MaxLength="10"/><Property Name="TipoEps" Type="Edm.String" Nullable="false" MaxLength="10"/><Property Name="Valor" Type="Edm.String" Nullable="false" MaxLength="20"/><Property Name="ValorSap" Type="Edm.String" Nullable="false" MaxLength="20"/></EntityType><EntityType Name="Diagnostico"><Key><PropertyRef Name="DiagnosticoId"/></Key><Property Name="DiagnosticoCodigo" Type="Edm.String" Nullable="false" MaxLength="4"/><Property Name="DiagnosticoDescripcion" Type="Edm.String" Nullable="false" MaxLength="150"/><Property Name="DiagnosticoId" Type="Edm.String" Nullable="false" MaxLength="255"/></EntityType><EntityType Name="Eps"><Key><PropertyRef Name="EpsId"/></Key><Property Name="EpsCodigo" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="EpsDescripcion" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="EpsId" Type="Edm.String" Nullable="false" MaxLength="255"/></EntityType><EntityType Name="Ips"><Key><PropertyRef Name="IpsId"/></Key><Property Name="Convenio" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="IpsId" Type="Edm.String" Nullable="false" MaxLength="255"/><Property Name="IpsPrestCod" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="IpsPrestDesc" Type="Edm.String" Nullable="true" MaxLength="255"/></EntityType><EntityType Name="MedicamentoView"><Key><PropertyRef Name="MedicamentoId"/></Key><Property Name="IVA" Type="Edm.Decimal" Nullable="true"/><Property Name="Centro" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="Circular" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="CodigoBarras" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="Concentracion" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="Convenio" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="EpsCodigo" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="FecValidFin" Type="Edm.DateTime" Nullable="true"/><Property Name="FecValidIni" Type="Edm.DateTime" Nullable="true"/><Property Name="FormaFarmaceutica" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="Importe" Type="Edm.Double" Nullable="true"/><Property Name="IndAjusteBlister" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="IndExcesoDefecto" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="IndSobreTope" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="MatCod" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="MatCodEps" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="MatDesc" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="MatDescEps" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="MedicamentoId" Type="Edm.String" Nullable="false" MaxLength="255"/><Property Name="Molecula" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="Moneda" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="MonedaCir" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="NombreGenerico" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="PrecioCir" Type="Edm.Decimal" Nullable="true"/><Property Name="StockBodega" Type="Edm.Int32" Nullable="true"/><Property Name="StockCentro" Type="Edm.Int32" Nullable="true"/><Property Name="TieneIVA" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="UmCantidad" Type="Edm.Int32" Nullable="true"/><Property Name="UmCodigo" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="UmDesc" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="UnidadCir" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="UnidadIVA" Type="Edm.String" Nullable="true" MaxLength="255"/></EntityType><EntityType Name="Medico"><Key><PropertyRef Name="MedicoId"/></Key><Property Name="EpsCodigo" Type="Edm.String" Nullable="false" MaxLength="10"/><Property Name="MedicoCodigo" Type="Edm.String" Nullable="false" MaxLength="20"/><Property Name="MedicoDescripcion" Type="Edm.String" Nullable="false" MaxLength="150"/><Property Name="MedicoId" Type="Edm.String" Nullable="false" MaxLength="255"/></EntityType><EntityType Name="OpcionCopago"><Key><PropertyRef Name="OpcionCopagoId"/></Key><Property Name="OpcionCopagoCodigo" Type="Edm.String" Nullable="false" MaxLength="1"/><Property Name="OpcionCopagoDescripcion" Type="Edm.String" Nullable="false" MaxLength="50"/><Property Name="OpcionCopagoId" Type="Edm.String" Nullable="false" MaxLength="255"/></EntityType><EntityType Name="ParamConfig"><Key><PropertyRef Name="ParametroId"/></Key><Property Name="Clave" Type="Edm.String" Nullable="true" MaxLength="50"/><Property Name="Descr" Type="Edm.String" Nullable="true" MaxLength="100"/><Property Name="Grupo" Type="Edm.String" Nullable="true" MaxLength="25"/><Property Name="ParametroId" Type="Edm.String" Nullable="false" MaxLength="255"/><Property Name="Trad" Type="Edm.String" Nullable="true" MaxLength="100"/><Property Name="Valor" Type="Edm.String" Nullable="true" MaxLength="250"/></EntityType><EntityType Name="TipoCuota"><Key><PropertyRef Name="TipoCuotaId"/></Key><Property Name="TipoCuotaCodigo" Type="Edm.String" Nullable="false" MaxLength="1"/><Property Name="TipoCuotaDescripcion" Type="Edm.String" Nullable="false" MaxLength="50"/><Property Name="TipoCuotaId" Type="Edm.String" Nullable="false" MaxLength="255"/></EntityType><EntityType Name="TipoDocumento"><Key><PropertyRef Name="TipoDocumentoId"/></Key><Property Name="TipoDocumentoCodigo" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="TipoDocumentoDescripcion" Type="Edm.String" Nullable="true" MaxLength="255"/><Property Name="TipoDocumentoId" Type="Edm.String" Nullable="false" MaxLength="255"/></EntityType><EntityType Name="TipoDocumentoReceptor"><Key><PropertyRef Name="TipoDocumentoId"/></Key><Property Name="TipoDocumentoCodigo" Type="Edm.String" Nullable="false" MaxLength="2"/><Property Name="TipoDocumentoDescripcion" Type="Edm.String" Nullable="false" MaxLength="100"/><Property Name="TipoDocumentoId" Type="Edm.String" Nullable="false" MaxLength="255"/></EntityType><EntityType Name="TipoFormula"><Key><PropertyRef Name="TipoFormulaId"/></Key><Property Name="EpsCodigo" Type="Edm.String" Nullable="false" MaxLength="10"/><Property Name="IsEditAutorizacion" Type="Edm.String" Nullable="true" MaxLength="1"/><Property Name="IsEditMIPRES" Type="Edm.String" Nullable="true" MaxLength="1"/><Property Name="IsEditPreautorizacion" Type="Edm.String" Nullable="true" MaxLength="1"/><Property Name="TipoFormulaCodigo" Type="Edm.String" Nullable="false" MaxLength="2"/><Property Name="TipoFormulaDescripcion" Type="Edm.String" Nullable="false" MaxLength="100"/><Property Name="TipoFormulaId" Type="Edm.String" Nullable="false" MaxLength="255"/></EntityType><EntityType Name="TopeMolecula"><Key><PropertyRef Name="TopeMoleculaId"/></Key><Property Name="Concentracion" Type="Edm.String" Nullable="false" MaxLength="18"/><Property Name="Convenio" Type="Edm.String" Nullable="false" MaxLength="10"/><Property Name="FormaFarmaceutica" Type="Edm.String" Nullable="false" MaxLength="3"/><Property Name="Molecula" Type="Edm.String" Nullable="false" MaxLength="4"/><Property Name="NombreGenerico" Type="Edm.String" Nullable="false" MaxLength="80"/><Property Name="Tope" Type="Edm.Int32" Nullable="false"/><Property Name="TopeMoleculaId" Type="Edm.String" Nullable="false" MaxLength="255"/><Property Name="UmCodigo" Type="Edm.String" Nullable="false" MaxLength="3"/></EntityType><EntityContainer Name="ModelODataContainer" m:IsDefaultEntityContainer="true"><EntitySet Name="ConvenioNoPoss" EntityType="ModelOData.ConvenioNoPos"/><EntitySet Name="ConversorEpss" EntityType="ModelOData.ConversorEps"/><EntitySet Name="Diagnosticos" EntityType="ModelOData.Diagnostico"/><EntitySet Name="Epss" EntityType="ModelOData.Eps"/><EntitySet Name="Ipss" EntityType="ModelOData.Ips"/><EntitySet Name="MedicamentoViews" EntityType="ModelOData.MedicamentoView"/><EntitySet Name="Medicos" EntityType="ModelOData.Medico"/><EntitySet Name="OpcionCopagos" EntityType="ModelOData.OpcionCopago"/><EntitySet Name="ParamConfigs" EntityType="ModelOData.ParamConfig"/><EntitySet Name="TipoCuotas" EntityType="ModelOData.TipoCuota"/><EntitySet Name="TipoDocumentos" EntityType="ModelOData.TipoDocumento"/><EntitySet Name="TipoDocumentoReceptors" EntityType="ModelOData.TipoDocumentoReceptor"/><EntitySet Name="TipoFormulas" EntityType="ModelOData.TipoFormula"/><EntitySet Name="TopeMoleculas" EntityType="ModelOData.TopeMolecula"/></EntityContainer></Schema></edmx:DataServices></edmx:Edmx>',
	"com/colsubsidio/syncpanel/syncpanel/localService/mockserver.js":function(){sap.ui.define(["sap/ui/core/util/MockServer","sap/ui/model/json/JSONModel","sap/base/util/UriParameters","sap/base/Log"],function(e,t,r,a){"use strict";var o,i="com/colsubsidio/syncpanel/syncpanel/",n=i+"localService/mockdata";var s={init:function(s){var u=s||{};return new Promise(function(s,c){var p=sap.ui.require.toUrl(i+"manifest.json"),l=new t(p);l.attachRequestCompleted(function(){var t=new r(window.location.href),c=sap.ui.require.toUrl(n),p=l.getProperty("/sap.app/dataSources/mainService"),f=sap.ui.require.toUrl(i+p.settings.localUri),d=/.*\/$/.test(p.uri)?p.uri:p.uri+"/";d=d&&new URI(d).absoluteTo(sap.ui.require.toUrl(i)).toString();if(!o){o=new e({rootUri:d})}else{o.stop()}e.config({autoRespond:true,autoRespondAfter:u.delay||t.get("serverDelay")||500});o.simulate(f,{sMockdataBaseUrl:c,bGenerateMissingMockData:true});var m=o.getRequests();var v=function(e,t,r){r.response=function(r){r.respond(e,{"Content-Type":"text/plain;charset=utf-8"},t)}};if(u.metadataError||t.get("metadataError")){m.forEach(function(e){if(e.path.toString().indexOf("$metadata")>-1){v(500,"metadata Error",e)}})}var g=u.errorType||t.get("errorType"),h=g==="badRequest"?400:500;if(g){m.forEach(function(e){v(h,g,e)})}o.setRequests(m);o.start();a.info("Running the app with mock data");s()});l.attachRequestFailed(function(){var e="Failed to load application manifest";a.error(e);c(new Error(e))})})},getMockServer:function(){return o}};return s});
},
	"com/colsubsidio/syncpanel/syncpanel/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"com.colsubsidio.syncpanel.syncpanel","type":"application","i18n":"i18n/i18n.properties","title":"{{appTitle}}","description":"{{appDescription}}","applicationVersion":{"version":"1.0.0"},"resources":"resources.json","dataSources":{"mainService":{"uri":"/colsubsidio-app/dispensacion/odata.svc/","type":"OData","settings":{"odataVersion":"2.0","localUri":"localService/metadata.xml"}}},"sourceTemplate":{"id":"sap.ui.ui5-template-plugin.1worklist","version":"1.72.1"}},"sap.ui":{"technology":"UI5","icons":{"icon":"sap-icon://task","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"rootView":{"viewName":"com.colsubsidio.syncpanel.syncpanel.view.App","type":"XML","async":true,"id":"app"},"dependencies":{"minUI5Version":"1.66.0","libs":{"sap.ui.core":{},"sap.m":{},"sap.f":{},"sap.ushell":{},"sap.collaboration":{"lazy":true}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"com.colsubsidio.syncpanel.syncpanel.i18n.i18n"}},"":{"dataSource":"mainService","preload":true}},"services":{"ShellUIService":{"factoryName":"sap.ushell.ui5service.ShellUIService","lazy":false,"settings":{"setTitle":"auto"}}},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","viewPath":"com.colsubsidio.syncpanel.syncpanel.view","controlId":"app","controlAggregation":"pages","bypassed":{"target":["notFound"]},"async":true},"routes":[{"pattern":"","name":"worklist","target":["worklist"]},{"pattern":"Epss/{objectId}","name":"object","target":["object"]},{"pattern":"paymentboxSync","name":"paymentboxSync","target":["paymentboxSync"]}],"targets":{"worklist":{"viewName":"Worklist","viewId":"worklist","viewLevel":1,"title":"{i18n>worklistViewTitle}"},"object":{"viewName":"Object","viewId":"object","viewLevel":2,"title":"{i18n>objectViewTitle}"},"objectNotFound":{"viewName":"ObjectNotFound","viewId":"objectNotFound"},"notFound":{"viewName":"NotFound","viewId":"notFound"},"paymentboxSync":{"viewType":"XML","viewLevel":3,"viewName":"paymentboxSync"}}}},"sap.platform.hcp":{"uri":"webapp","_version":"1.1.0"}}',
	"com/colsubsidio/syncpanel/syncpanel/model/formatter.js":function(){sap.ui.define([],function(){"use strict";return{numberUnit:function(n){if(!n){return""}return parseFloat(n).toFixed(2)}}});
},
	"com/colsubsidio/syncpanel/syncpanel/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device","sap/base/util/ObjectPath"],function(e,n,t){"use strict";return{createDeviceModel:function(){var t=new e(n);t.setDefaultBindingMode("OneWay");return t},createFLPModel:function(){var n=t.get("sap.ushell.Container.getUser"),a=n?n().isJamActive():false,i=new e({isShareInJamActive:a});i.setDefaultBindingMode("OneWay");return i}}});
},
	"com/colsubsidio/syncpanel/syncpanel/view/App.view.xml":'<mvc:View\n\tcontrollerName="com.colsubsidio.syncpanel.syncpanel.controller.App"\n\tdisplayBlock="true"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><App\n\t\tid="app"\n\t\tbusy="{appView>/busy}"\n\t\tbusyIndicatorDelay="{appView>/delay}"/></mvc:View>',
	"com/colsubsidio/syncpanel/syncpanel/view/Dialog/ParamDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:form="sap.ui.layout.form" xmlns:l="sap.ui.layout"><Dialog id="ParamDialog" title="Hello {/recipient/name}"><customHeader><Bar><contentLeft><Button/></contentLeft><contentMiddle><Title text="Parametros de sincronización"/></contentMiddle></Bar></customHeader><content><form:Form id="frm-Reclamante" editable="true" visible="true" class="sapUiResponsiveMargin"><form:formContainers id="contentForm"><form:FormContainer id="feObjects" visible="true"></form:FormContainer></form:formContainers><form:layout><form:ResponsiveGridLayout adjustLabelSpan="false" columnsXL="1" labelSpanXL="5" columnsL="1" labelSpanL="5" columnsM="1" labelSpanM="4"\n\t\t\t\t\t\tlabelSpanS="12"/></form:layout></form:Form></content><beginButton><Button text="OK" press="onSync" icon="sap-icon://accept" type="Default"/></beginButton></Dialog></core:FragmentDefinition>',
	"com/colsubsidio/syncpanel/syncpanel/view/NotFound.view.xml":'<mvc:View\n\tcontrollerName="com.colsubsidio.syncpanel.syncpanel.controller.NotFound"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><MessagePage\n\t\ttitle="{i18n>notFoundTitle}"\n\t\ttext="{i18n>notFoundText}"\n\t\ticon="sap-icon://document"\n\t\tid="page"\n\t\tdescription=""><customDescription><Link id="link" text="{i18n>backToWorklist}" press=".onLinkPressed"/></customDescription></MessagePage></mvc:View>',
	"com/colsubsidio/syncpanel/syncpanel/view/Object.view.xml":'<mvc:View\n\tcontrollerName="com.colsubsidio.syncpanel.syncpanel.controller.Object"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns:semantic="sap.f.semantic"\n\txmlns:footerbar="sap.ushell.ui.footerbar"><semantic:SemanticPage\n\t\tid="page"\n\t\theaderPinnable="false"\n\t\ttoggleHeaderOnTitleClick="false"\n\t\tbusy="{objectView>/busy}"\n\t\tbusyIndicatorDelay="{objectView>/delay}"><semantic:titleHeading><Title\n\t\t\t\ttext="{EpsDescripcion}"\n\t\t\t\tlevel="H2"/></semantic:titleHeading><semantic:headerContent><ObjectNumber\n\t\t\t\tunit="{EpsCodigo}"\n\t\t\t/></semantic:headerContent><semantic:sendEmailAction><semantic:SendEmailAction id="shareEmail" press=".onShareEmailPress"/></semantic:sendEmailAction><semantic:shareInJamAction><semantic:ShareInJamAction id="shareInJam" visible="{FLP>/isShareInJamActive}" press=".onShareInJamPress"/></semantic:shareInJamAction><semantic:saveAsTileAction><footerbar:AddBookmarkButton id ="shareTile" title="{objectView>/saveAsTileTitle}"/></semantic:saveAsTileAction></semantic:SemanticPage></mvc:View>',
	"com/colsubsidio/syncpanel/syncpanel/view/ObjectNotFound.view.xml":'<mvc:View\n\tcontrollerName="com.colsubsidio.syncpanel.syncpanel.controller.NotFound"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><MessagePage\n\t\ttitle="{i18n>objectTitle}"\n\t\ttext="{i18n>noObjectFoundText}"\n\t\ticon="sap-icon://product"\n\t\tdescription=""\n\t\tid="page"><customDescription><Link id="link" text="{i18n>backToWorklist}" press=".onLinkPressed" /></customDescription></MessagePage></mvc:View>',
	"com/colsubsidio/syncpanel/syncpanel/view/Worklist.view.xml":'<mvc:View controllerName="com.colsubsidio.syncpanel.syncpanel.controller.Worklist" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" height="100%"><Page title="Panel de sincronizacion - Dipensación de medicamentos" class="sapUiContentPadding"><headerContent><Button icon="sap-icon://arrow-right" tooltip="Share" text="Ir a CAJA" press="onGoPaymentboxSync"/></headerContent><subHeader></subHeader><content><TileContainer id="container" tileDelete="handleTileDelete" tiles="{/TileCollection}"><StandardTile icon="{icon}" type="{type}" number="{number}" numberUnit="{numberUnit}" title="{title}" press="onEvent" info="{info}"\n\t\t\t\t\tinfoState="{infoState}" busyIndicatorDelay="0" blocked="{enabled}" /></TileContainer></content><footer></footer></Page></mvc:View>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
	"com/colsubsidio/syncpanel/syncpanel/view/paymentboxSync.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"\n\tcontrollerName="com.colsubsidio.syncpanel.syncpanel.controller.paymentboxSync" xmlns:html="http://www.w3.org/1999/xhtml"><Page title="Panel de sincronizacion - Caja"\n\t\tclass="sapUiContentPadding" showNavButton="true" navButtonPress="onBack"><headerContent></headerContent><subHeader></subHeader><content><TileContainer\n\t\t\tid="tilescaja"\n\t\t\ttileDelete="handleTileDelete"\n\t\t\ttiles="{/TileCollection}"><StandardTile\n\t\t\t\ticon="{icon}"\n\t\t\t\ttype="{type}"\n\t\t\t\tnumber="{number}"\n\t\t\t\tnumberUnit="{numberUnit}"\n\t\t\t\ttitle="{title}"\n\t\t\t\tpress="onEvent"\n\t\t\t\tinfo="{info}"\n\t\t\t\tinfoState="{infoState}" /></TileContainer></content><footer></footer></Page></mvc:View>'
}});

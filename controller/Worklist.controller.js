sap.ui.define(["./BaseController","sap/ui/model/json/JSONModel","../model/formatter","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/core/Fragment","sap/m/MessageBox"],function(e,o,t,n,s,i,a){"use strict";var c;var r;var l="/colsubsidiojob\t-app/";var p;var d;return e.extend("com.colsubsidio.syncpanel.syncpanel.controller.Worklist",{formatter:t,onEvent:function(e){var o=e.getSource().getBindingContext().getObject();c.onSelectService(o,e.getSource())},onSelectService:function(e,t){var n=new o({selectedEpsKey:""});if(e["param"]){var s=this.getView();if(!this.byId("ParamDialog")){i.load({id:s.getId(),name:"com.colsubsidio.syncpanel.syncpanel.view.Dialog.ParamDialog",controller:c}).then(function(o){s.addDependent(o);o.open();o.setModel(n);c._oDialog=o;c.onCreateContent(e,o)})}else{this.byId("ParamDialog").open();c.onCreateContent(e,this.byId("ParamDialog"))}}else{c.onSendService(e,t,"")}},onSendService:function(e,o,t,n,s,i){console.log(l+e.url+t);console.log(e);console.log(o);console.log(t);console.log(n);console.log(s);console.log(i);if(s===undefined){s="GET"}var c={method:s,url:l+e.url+t,contentType:"application/json",headers:{Accept:"application/json"},beforeSend:function(){o.setBusy(true)},success:function(e){o.setBusy(false);a.show("Datos sincronizados",{icon:a.Icon.INFORMATION,title:"SAP DISPENSACION",actions:[a.Action.OK],onClose:function(e){}});if(n){o.close()}},error:function(){o.setBusy(false);sap.m.MessageToast.show("Error al tratar de sincronizar.");if(n){o.close()}o.setInfoState(sap.ui.core.ValueState.Error);o.setInfo("Error")}};if(s==="POST"){c.data=JSON.stringify(i)}$.ajax(c)},onCreateContent:function(e,t){var n=c.getView().byId("feObjects").destroyFormElements();var s;var i={};var a={};$.each(e.param,function(e,o){i={};i["grupo"+e]=[];$.each(o.grupo,function(o,t){i=c.onCreateObject(t,i,e)});s=null;s=new sap.ui.layout.form.FormElement({label:i.l.text,fields:[i.o]});n.addFormElement(s);a["grupo"+e]=i["grupo"+e]});t.setModel(new o(a));t.setModel(new o(e),"info")},onSync:function(){var e=this.byId("ParamDialog");var o=e.getModel("info").getData();var t="";var n=e.getModel().getData();var s;var i=false;var a="GET";a=o.method;var r=[];$.each(n,function(e,o){console.log(o);console.log(e);$.each(o,function(e,o){s="";if(o.type==="c"){s=sap.ui.getCore().byId(o.id).getSelectedKey();if(s===""){sap.m.MessageToast.show("Campo vacio");i=false;return}else{if(o.pos!==0){t=t+"/"+s}else{t=t+s}i=true}}else if(o.type==="i"){console.log(o.id);s=sap.ui.getCore().byId(o.id).getValue();if(s===""){sap.m.MessageToast.show("Campo vacio");i=false;return}else{if(o.pos!==0){t=t+"/"+s}else{t=t+s}i=true}if(a==="POST"){i=true;t="";r.push(s)}}else if(o.type==="m"){console.log(o.id);s=sap.ui.getCore().byId(o.id).getSelectedKeys();if(s.length<=0){sap.m.MessageToast.show("Capo de seleccion vacio.");i=false;return}i=true;a="POST";r=s}})});console.log(t);if(i){c.onSendService(o,e,t,true,a,r)}},onCreateObject:function(e,o,t){if(e.type==="l"){o.l={text:e.text}}else if(e.type==="o"){if(e.subType==="i"){o.o=new sap.m.Input("grupo-"+t+e.subType,{placeholder:""});o["grupo"+t].push({type:"i",id:"grupo-"+t+e.subType,pos:t})}else if(e.subType==="c"){var n=new sap.m.ComboBox("grupo-"+t+e.subType,{placeholder:"Seleccione EPS"});var s=new sap.ui.core.Item({text:"{EpsDescripcion}",key:"{EpsCodigo}"});n.setModel(p);n.bindItems("/results",s);o.o=n;o["grupo"+t].push({type:"c",id:"grupo-"+t+e.subType,pos:t})}else if(e.subType==="m"){var n=new sap.m.MultiComboBox("grupo-"+t+e.subType,{placeholder:e.placeholder});var s=new sap.ui.core.Item({text:"{Centro} - {FarmaciaDescripcion}",key:"{Centro}"});n.setModel(d);n.bindItems("/results",s);o.o=n;o["grupo"+t].push({type:"m",id:"grupo-"+t+e.subType,pos:t})}}return o},onGoPaymentboxSync:function(){this.getRouter().navTo("paymentboxSync")},onLoadDataInitial:function(){r.read("/Epss",{success:function(e,o){var t=new sap.ui.model.json.JSONModel;t.setData(e);t.setSizeLimit(1e3);p=t}});r.read("/Farmacias",{success:function(e,o){var t=new sap.ui.model.json.JSONModel;t.setData(e);t.setSizeLimit(1e3);d=t}})},onInit:function(){c=this;r=c.getOwnerComponent().getModel();c.onLoadDataInitial();var e={TileCollection:[{icon:"sap-icon://database",title:"Constantes ERP",info:"Habilitado",method:"GET",url:"dispensacion/sync/constantesErp",infoState:"Success"},{icon:"sap-icon://decision",title:"Contratos Marco",info:"Habilitado",method:"GET",url:"dispensacion/sync/contratoMarco",infoState:"Success"},{icon:"sap-icon://decision",title:"Convenios Centro / IPS",info:"Habilitado",method:"GET",url:"dispensacion/sync/conveniosCentroIps",infoState:"Success"},{icon:"sap-icon://database",title:"Datos Maestros",info:"Habilitado",method:"GET",url:"dispensacion/sync/datosMaestros",infoState:"Success"},{icon:"sap-icon://database",title:"Diccionarios",info:"Habilitado",method:"GET",url:"dispensacion/sync/diccionarios",infoState:"Success"},{icon:"sap-icon://database",title:"EPS / IPS",info:"Habilitado",method:"GET",url:"dispensacion/sync/epsIps",infoState:"Success"},{icon:"sap-icon://database",title:"Forma de pago",info:"Habilitado",method:"GET",url:"dispensacion/sync/formaPago",infoState:"Success"},{icon:"sap-icon://database",title:"Medicamentos EPS / Convenio",info:"Habilitado",infoState:"Success",method:"GET",url:"dispensacion/sync/medicamentos/",param:[{grupo:[{type:"l",text:"EPS",wrapping:true},{type:"o",subType:"c",source:"/Eps",selectedKey:"{selectedKey}",placeholder:"Seleccione EPS´s"}]},{grupo:[{type:"l",text:"Convenio",wrapping:true},{type:"o",subType:"i"}]}]},{icon:"sap-icon://database",title:"Medicamentos IPS / Cuotas Moderadoras",info:"Habilitado",infoState:"Success",method:"GET",url:"dispensacion/sync/medicamentosIpsCuotaMod/",param:[{grupo:[{type:"l",text:"EPS",wrapping:true},{type:"o",subType:"c",source:"/Eps",selectedKey:"{selectedKey}",placeholder:"Seleccione EPS´s"}]}]},{icon:"sap-icon://product",title:"Medicamentos Stock",info:"Habilitado",infoState:"Success",method:"POST",multi:true,url:"dispensacion/sync/medicamentosStockCentro",param:[{grupo:[{type:"l",text:"Centro",wrapping:true},{type:"o",subType:"i"}]}]},{icon:"sap-icon://database",title:"Motivos / Causales Pendientes",info:"Habilitado",method:"GET",url:"dispensacion/sync/motivosCausalesPendientes",infoState:"Success"},{icon:"sap-icon://customer-order-entry",title:"Sincronizar Pedido",info:"Habilitado",method:"GET",url:"dispensacion/sync/pedido/",param:[{grupo:[{type:"l",text:"N° Pedido",wrapping:true},{type:"o",subType:"i"}]}],infoState:"Success"},{icon:"sap-icon://customize",title:"Tablas Maestras",info:"Habilitado",method:"GET",url:"dispensacion/sync/datosMaestros",infoState:"Success"}]};var t=new o(e);this.getView().setModel(t)},onUpdateFinished:function(e){},onPress:function(e){},onShareInJamPress:function(){},onSearch:function(e){},onRefresh:function(){},_showObject:function(e){},_applySearch:function(e){}})});
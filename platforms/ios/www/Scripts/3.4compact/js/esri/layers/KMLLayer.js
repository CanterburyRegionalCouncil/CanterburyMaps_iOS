/*
 COPYRIGHT 2009 ESRI

 TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
 Unpublished material - all rights reserved under the
 Copyright Laws of the United States and applicable international
 laws, treaties, and conventions.

 For additional information, contact:
 Environmental Systems Research Institute, Inc.
 Attn: Contracts and Legal Services Department
 380 New York Street
 Redlands, California, 92373
 USA

 email: contracts@esri.com
 */
//>>built
define("esri/layers/KMLLayer",["dojo/_base/kernel","dojo/_base/declare","dojo/_base/connect","dojo/_base/lang","dojo/_base/array","dojo/_base/json","dojo/_base/sniff","dojo/io-query","dojo/dom-construct","dojo/dom-style","esri/kernel","esri/config","esri/lang","esri/request","esri/SpatialReference","esri/geometry/webMercatorUtils","esri/dijit/PopupTemplate","esri/layers/layer","esri/layers/KMLFolder","esri/layers/KMLGroundOverlay","esri/layers/MapImageLayer","esri/layers/FeatureLayer"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,_12,_13,_14,_15,_16){var _17=_2([_12],{declaredClass:"esri.layers.KMLLayer",serviceUrl:location.protocol+"//utility.arcgis.com/sharing/kml",constructor:function(url,_18){if(!url){console.log("KMLLayer:constructor - please provide url for the KML file");}this._outSR=(_18&&_18.outSR)||new _f({wkid:4326});this._options=_18;if(_c.defaults.kmlService){this.serviceUrl=_c.defaults.kmlService;}var _19=(this.linkInfo=_18&&_18.linkInfo);if(_19){this.visible=!!_19.visibility;this._waitingForMap=!!_19.viewFormat;}if(!_19||(_19&&_19.visibility&&!this._waitingForMap)){this._parseKml();}this.refresh=_4.hitch(this,this.refresh);},getFeature:function(_1a){if(!_1a){return;}var _1b=_1a.type,id=_1a.id,_1c,i,len;switch(_1b){case "esriGeometryPoint":case "esriGeometryPolyline":case "esriGeometryPolygon":var _1d=this["_"+_1b];if(_1d){_1c=_4.getObject("_mode._featureMap."+id,false,_1d);}break;case "GroundOverlay":var _1e=this._groundLyr;if(_1e){var _1f=_1e.getImages();len=_1f.length;for(i=0;i<len;i++){if(_1f[i].id===id){_1c=_1f[i];break;}}}break;case "ScreenOverlay":break;case "NetworkLink":_5.some(this._links,function(_20){if(_20.linkInfo&&_20.linkInfo.id===id){_1c=_20;return true;}else{return false;}});break;case "Folder":var _21=this.folders;len=_21?_21.length:0;for(i=0;i<len;i++){if(_21[i].id===id){_1c=_21[i];break;}}break;default:console.log("KMLLayer:getFeature - unknown feature type");break;}return _1c;},getLayers:function(){var _22=[];if(this._groundLyr){_22.push(this._groundLyr);}if(this._fLayers){_22=_22.concat(this._fLayers);}if(this._links){_5.forEach(this._links,function(_23){if(_23.declaredClass){_22.push(_23);}});}return _22;},setFolderVisibility:function(_24,_25){if(!_24){return;}this._fireUpdateStart();_24.visible=_25;if(_25){_25=this._areLocalAncestorsVisible(_24);}this._setState(_24,_25);this._fireUpdateEnd();},onRefresh:function(){},_parseKml:function(map){var _26=this;this._fireUpdateStart();this._io=_e({url:this.serviceUrl,content:{url:this._url.path+this._getQueryParameters(map),model:"simple",folders:"",refresh:this.loaded?true:undefined,outSR:_6.toJson(this._outSR.toJson())},callbackParamName:"callback",load:function(_27){_26._io=null;_26._initLayer(_27);},error:function(err){_26._io=null;err=_4.mixin(new Error(),err);err.message="Unable to load KML: "+_26.url+" "+(err.message||"");_26._fireUpdateEnd(err);_26.onError(err);}});},_initLayer:function(_28){if(this.loaded){this._removeInternalLayers();}this.name=_28.name;this.description=_28.description;this.snippet=_28.snippet;this.visibility=_28.visibility;this.featureInfos=_28.featureInfos;var i,len;var _29=(this.folders=_28.folders),_2a=[],_2b;if(_29){len=_29.length;for(i=0;i<len;i++){_2b=(_29[i]=new _13(_29[i]));if(_2b.parentFolderId===-1){_2a.push(_2b);}}}var _2c=(this._links=_28.networkLinks),_2d;len=_2c?_2c.length:0;for(i=0;i<len;i++){if(_2c[i].viewRefreshMode&&_2c[i].viewRefreshMode.toLowerCase().indexOf("onregion")!==-1){continue;}_2d=_4.mixin({},this._options);_2d.linkInfo=_2c[i];if(_2d.id){_2d.id=_2d.id+"_"+i;}_2c[i]=new _17(_2c[i].href,_2d);_2c[i]._parentLayer=this;_2c[i]._parentFolderId=this._getLinkParentId(_2c[i].linkInfo.id);}var _2e=_28.groundOverlays;if(_2e&&_2e.length>0){_2d=_4.mixin({},this._options);if(_2d.id){_2d.id=_2d.id+"_"+"mapImage";}var _2f=(this._groundLyr=new _15(_2d));len=_2e.length;for(i=0;i<len;i++){_2f.addImage(new _14(_2e[i]));}}var _30=_4.getObject("featureCollection.layers",false,_28);if(_30&&_30.length>0){this._fLayers=[];_5.forEach(_30,function(_31,i){var _32=_4.getObject("featureSet.features",false,_31),_33;if(_32&&_32.length>0){_2d=_4.mixin({outFields:["*"],infoTemplate:_31.popupInfo?new _11(_31.popupInfo):null,editable:false},this._options);if(_2d.id){_2d.id=_2d.id+"_"+i;}_31.layerDefinition.capabilities="Query,Data";_33=new _16(_31,_2d);if(_33.geometryType){this["_"+_33.geometryType]=_33;}this._fLayers.push(_33);}},this);if(this._fLayers.length===0){delete this._fLayers;}}len=_2a.length;for(i=0;i<len;i++){_2b=_2a[i];this._setState(_2b,_2b.visible);}this._fireUpdateEnd();if(this.loaded){this._addInternalLayers();this.onRefresh();}else{this.loaded=true;this.onLoad(this);}},_addInternalLayers:function(){var map=this._map;this._fireUpdateStart();if(this._links){_5.forEach(this._links,function(_34){if(_34.declaredClass){map.addLayer(_34);if(_34._waitingForMap){_34._waitingForMap=null;if(_34.visible){_34._parseKml(map);}else{_34._wMap=map;}}}});}var _35=map.spatialReference,_36=this._outSR,_37;if(!_35.equals(_36)){if(_35.isWebMercator()&&_36.wkid===4326){_37=_10.geographicToWebMercator;}else{if(_36.isWebMercator()&&_35.wkid===4326){_37=_10.webMercatorToGeographic;}else{console.log("KMLLayer:_setMap - unsupported workflow. Spatial reference of the map and kml layer do not match, and the conversion cannot be done on the client.");return;}}}if(this._groundLyr){if(_37){_5.forEach(this._groundLyr.getImages(),function(_38){_38.extent=_37(_38.extent);});}map.addLayer(this._groundLyr);}var _39=this._fLayers;if(_39&&_39.length>0){_5.forEach(_39,function(_3a){if(_37){var _3b=_3a.graphics,i,_3c,len=_3b?_3b.length:0;for(i=0;i<len;i++){_3c=_3b[i].geometry;if(_3c){_3b[i].setGeometry(_37(_3c));}}}map.addLayer(_3a);});}this.onVisibilityChange(this.visible);},_removeInternalLayers:function(){var map=this._map;if(this._links){_5.forEach(this._links,function(_3d){if(_3d.declaredClass&&_3d._io){_3d._io.cancel();}});}if(map){_5.forEach(this.getLayers(),map.removeLayer,map);}},_setState:function(_3e,_3f){var _40=_3e.featureInfos,_41,_42,i,len=_40?_40.length:0,_43=_3f?"show":"hide";for(i=0;i<len;i++){_41=_40[i];_42=this.getFeature(_41);if(!_42){continue;}if(_41.type==="Folder"){this._setState(_42,_3f&&_42.visible);}else{if(_41.type==="NetworkLink"){this._setInternalVisibility(_42,_3f);}else{_42[_43]();}}}},_areLocalAncestorsVisible:function(_44){var _45=_44.parentFolderId,_46=_44.visible;while(_46&&_45!==-1){var _47=this.getFeature({type:"Folder",id:_45});_46=_46&&_47.visible;_45=_47.parentFolderId;}return _46;},_setInternalVisibility:function(_48,_49){var _4a=_48._parentLayer,_4b=_48._parentFolderId;_49=_49&&_48.visible;while(_49&&_4a){_49=_49&&_4a.visible;if(_4b>-1){_49=_49&&_4a._areLocalAncestorsVisible(_4a.getFeature({type:"Folder",id:_4b}));}_4b=_4a._parentFolderId;_4a=_4a._parentLayer;}this._setIntState(_48,_49);},_setIntState:function(_4c,_4d){if(!_4c){return;}_5.forEach(_4c.getLayers(),function(_4e){if(_4e.linkInfo){_4c._setIntState(_4e,_4d&&_4e.visible&&_4c._areLocalAncestorsVisible(_4c.getFeature({type:"Folder",id:_4e._parentFolderId})));}else{_4e.setVisibility(_4d);}});},_getLinkParentId:function(id){var _4f=-1;if(this.folders){_5.some(this.folders,function(_50){if(_50.networkLinkIds&&_5.indexOf(_50.networkLinkIds,id)!==-1){_4f=_50.id;return true;}return false;});}return _4f;},_checkAutoRefresh:function(){var _51=this.linkInfo;if(_51){if(this.visible){if(this.loaded&&this._map){var _52=_51.refreshMode,_53=_51.refreshInterval,_54=_51.viewRefreshMode,_55=_51.viewRefreshTime;if(_52&&_52.toLowerCase().indexOf("oninterval")!==-1&&_53>0){this._stopAutoRefresh();this._timeoutHandle=setTimeout(this.refresh,_53*1000);}if(_54&&_54.toLowerCase().indexOf("onstop")!==-1&&_55>0){if(!this._extChgHandle){this._extChgHandle=_3.connect(this._map,"onExtentChange",this,this._extentChanged);}}}}else{this._stopAutoRefresh();_3.disconnect(this._extChgHandle);delete this._extChgHandle;}}},_stopAutoRefresh:function(){clearTimeout(this._timeoutHandle);this._timeoutHandle=null;},_getQueryParameters:function(map){map=map||this._map;var _56={},_57=this.linkInfo,_58=map&&map.extent,_59;if(this._url.query){_4.mixin(_56,this._url.query);_59=!!this._url.query.token;}if(_b.id&&!_59){var _5a=_b.id.findCredential(this._url.path);if(_5a){_56.token=_5a.token;}}if(_57){var _5b=_57.viewFormat,_5c=_57.httpQuery,_5d=_57.viewBoundScale;if(_58&&_5b){var _5e=_58,_5f=_58,sr=_58.spatialReference;if(sr){if(sr.isWebMercator()){_5e=_10.webMercatorToGeographic(_58);}else{if(sr.wkid===4326){_5f=_10.geographicToWebMercator(_58);}}}var _60=_5e.getCenter(),_61=Math.max(_5f.getWidth(),_5f.getHeight());if(_5d){_5e=_5e.expand(_5d);}_5b=_5b.replace(/\[bboxWest\]/ig,_5e.xmin).replace(/\[bboxEast\]/ig,_5e.xmax).replace(/\[bboxSouth\]/ig,_5e.ymin).replace(/\[bboxNorth\]/ig,_5e.ymax).replace(/\[lookatLon\]/ig,_60.x).replace(/\[lookatLat\]/ig,_60.y).replace(/\[lookatRange\]/ig,_61).replace(/\[lookatTilt\]/ig,0).replace(/\[lookatHeading\]/ig,0).replace(/\[lookatTerrainLon\]/ig,_60.x).replace(/\[lookatTerrainLat\]/ig,_60.y).replace(/\[lookatTerrainAlt\]/ig,0).replace(/\[cameraLon\]/ig,_60.x).replace(/\[cameraLat\]/ig,_60.y).replace(/\[cameraAlt\]/ig,_61).replace(/\[horizFov\]/ig,60).replace(/\[vertFov\]/ig,60).replace(/\[horizPixels\]/ig,map.width).replace(/\[vertPixels\]/ig,map.height).replace(/\[terrainEnabled\]/ig,0);_4.mixin(_56,_8.queryToObject(_5b));}if(_5c){_5c=_5c.replace(/\[clientVersion\]/ig,_b.version).replace(/\[kmlVersion\]/ig,2.2).replace(/\[clientName\]/ig,"ArcGIS API for JavaScript").replace(/\[language\]/ig,_1.locale);_4.mixin(_56,_8.queryToObject(_5c));}}var _62=[],_63;for(_63 in _56){if(_d.isDefined(_56[_63])){_62.push(_63+"="+_56[_63]);}}_62=_62.join("&");return _62?("?"+_62):"";},_setMap:function(map,_64){this._map=map;var div=this._div=_9.create("div",null,_64);_a.set(div,"position","absolute");this._addInternalLayers();return div;},_unsetMap:function(map,_65){if(this._io){this._io.cancel();}this._stopAutoRefresh();_3.disconnect(this._extChgHandle);delete this._extChgHandle;this._removeInternalLayers();var div=this._div;if(div){_65.removeChild(div);_9.destroy(div);}this._map=this._wMap=this._div=null;},onVisibilityChange:function(_66){if(!this.loaded){if(this.linkInfo&&_66){if(!this._waitingForMap){this._parseKml(this._wMap);}}return;}this._fireUpdateStart();this._setInternalVisibility(this,_66);this._checkAutoRefresh();this._fireUpdateEnd();},refresh:function(){if(!this.loaded||!this._map||this._io){return;}this._parseKml();},_extentChanged:function(){this._stopAutoRefresh();this._timeoutHandle=setTimeout(this.refresh,this.linkInfo.viewRefreshTime*1000);}});if(_7("extend-esri")){_4.setObject("layers.KMLLayer",_17,_b);}return _17;});
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
define("esri/layers/WMTSLayer",["dojo/_base/kernel","dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dojo/sniff","dojo/string","dojox/xml/parser","esri/kernel","esri/lang","esri/request","esri/WKIDUnitConversion","esri/SpatialReference","esri/geometry/Point","esri/geometry/Extent","esri/geometry/webMercatorUtils","esri/layers/TiledMapServiceLayer","esri/layers/TileInfo","esri/layers/WMTSLayerInfo","dojo/query"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,_12){var _13=_2([_10],{declaredClass:"esri.layers.WMTSLayer",copyright:null,extent:null,tileUrl:null,spatialReference:null,tileInfo:null,constructor:function(url,_14){this.version="1.0.0";this.tileUr=this._url=url;this.serviceMode="RESTful";this._parseCapabilities=_3.hitch(this,this._parseCapabilities);this._getCapabilitiesError=_3.hitch(this,this._getCapabilitiesError);if(!_14){_14={};}if(_14.serviceMode){if(_14.serviceMode==="KVP"||_14.serviceMode==="RESTful"){this.serviceMode=_14.serviceMode;}else{console.error("WMTS mode could only be 'KVP' or 'RESTful'");return;}}this.layerInfo=new _12();if(_14.layerInfo){this.layerInfo=_14.layerInfo;this._identifier=_14.layerInfo.identifier;this._tileMatrixSetId=_14.layerInfo.tileMatrixSet;if(_14.layerInfo.format){this.format="image/"+_14.layerInfo.format;}this._style=_14.layerInfo.style;this.title=_14.layerInfo.title;}if(_14.resourceInfo){this.version=_14.resourceInfo.version;if(_14.resourceInfo.getTileUrl){this._url=this.tileUrl=_14.resourceInfo.getTileUrl;}this.copyright=_14.resourceInfo.copyright;this.layerInfos=_14.resourceInfo.layerInfos;this._parseResourceInfo();this.loaded=true;this.onLoad(this);}else{this._getCapabilities();}this._formatDictionary={"image/png":".png","image/png8":".png","image/png24":".png","image/png32":".png","image/jpg":".jpg","image/jpeg":".jpeg","image/gif":".gif","image/bmp":".bmp","image/tiff":".tif","image/jpgpng":"","image/jpegpng":""};},setActiveLayer:function(_15){this.setVisibleLayer(_15);},setVisibleLayer:function(_16){this._setActiveLayer(_16);this.refresh(true);},getTileUrl:function(_17,row,col){_17=this._levelToLevelValue[_17];var _18;if(this.resourceUrls&&this.resourceUrls.length>0){_18=this.resourceUrls[row%this.resourceUrls.length].template;_18=_18.replace(/\{Style\}/gi,this._style);_18=_18.replace(/\{TileMatrixSet\}/gi,this._tileMatrixSetId);_18=_18.replace(/\{TileMatrix\}/gi,_17);_18=_18.replace(/\{TileRow\}/gi,row);_18=_18.replace(/\{TileCol\}/gi,col);return _18;}_18=this.UrlTemplate.replace(/\{level\}/gi,_17);_18=_18.replace(/\{row\}/gi,row);_18=_18.replace(/\{col\}/gi,col);return _18;},getTileUrlTemplate:function(_19){var _1a,_1b=_19.identifier,_1c=_19.tileMatrixSet,_1d=_19.format,_1e=_19.style;if(!_1b){_1a=this.layers[0];_1b=this.layers[0].identifier;}else{_1a=_4.filter(this.layers,function(_1f){return _1f.identifier===_1b;})[0];}if(!_1a){console.error("couldn't find the layer "+_1b);this.onError(new Error("couldn't find the layer "+_1b));return;}if(!_1d){_1d=_1a.formats[0];if(_1d.indexOf("image/")===-1){_1d="image/"+_1d;}}else{if(_1d.indexOf("image/")===-1){_1d="image/"+_1d;}if(_4.indexOf(_1a.formats,_1d)===-1){console.error("The layer doesn't support the format of "+_1d);this.onError(new Error("The layer doesn't support the format of "+_1d));return;}}if(!_1e){_1e=_1a.styles[0];}else{if(_4.indexOf(_1a.styles,_1e)===-1){console.error("The layer doesn't support the style of "+_1e);this.onError(new Error("The layer doesn't support the style of "+_1e));return;}}var _20;if(!_1c){_20=_4.filter(_1a.tileMatrixSetInfos,function(_21){return _21.tileMatrixSet==="GoogleMapsCompatible";})[0];if(!_20){_20=_1a.tileMatrixSetInfos[0];}_1c=_20.tileMatrixSet;}else{_20=_4.filter(_1a.tileMatrixSetInfos,function(_22){return _22.tileMatrixSet===_1c;})[0];if(!_20){console.error("The tileMatrixSetId "+_1c+" is not supported by the layer of "+_1b);this.onError(new Error("The tileMatrixSetId "+_1c+" is not supported by the layer of "+_1b));return;}}return this._getTileUrlTemplate(_1b,_1c,_1d,_1e);},_getTileUrlTemplate:function(_23,_24,_25,_26){var _27;if(!_23){_23=this._identifier;}if(!_24){_24=this._tileMatrixSetId;}if(!_25){_25=this.format;}if(!_26){_26=this._style;}if(this.resourceUrls&&this.resourceUrls.length>0){_27=this.resourceUrls[0].template;_27=_27.replace(/\{Style\}/gi,_26);_27=_27.replace(/\{TileMatrixSet\}/gi,_24);_27=_27.replace(/\{TileMatrix\}/gi,"{level}");_27=_27.replace(/\{TileRow\}/gi,"{row}");_27=_27.replace(/\{TileCol\}/gi,"{col}");return _27;}if(this.serviceMode==="KVP"){_27=this._url+"SERVICE=WMTS&VERSION="+this.version+"&REQUEST=GetTile"+"&LAYER="+_23+"&STYLE="+_26+"&FORMAT="+_25+"&TILEMATRIXSET="+_24+"&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}";}else{if(this.serviceMode==="RESTful"){var _28="";if(this._formatDictionary[_25.toLowerCase()]){_28=this._formatDictionary[_25.toLowerCase()];}_27=this._url+_23+"/"+_26+"/"+_24+"/{level}/{row}/{col}"+_28;}}return _27;},_parseResourceInfo:function(){var _29=this.layerInfos,i;if(this.serviceMode==="KVP"){this._url+=(this._url.substring(this._url.length-1,this._url.length)=="?")?"":"?";}for(i=0;i<_29.length;i++){if((!this._identifier||_29[i].identifier===this._identifier)&&(!this.title||_29[i].title===this.title)&&(!this._tileMatrixSetId||_29[i].tileMatrixSet===this._tileMatrixSetId)&&(!this.format||"image/"+_29[i].format===this.format)&&(!this._style||_29[i].style===this._style)){_3.mixin(this,{"description":_29[i].description,tileInfo:_29[i].tileInfo,spatialReference:_29[i].tileInfo.spatialReference,fullExtent:_29[i].fullExtent,initialExtent:_29[i].initialExtent,_identifier:_29[i].identifier,_tileMatrixSetId:_29[i].tileMatrixSet,format:"image/"+_29[i].format,_style:_29[i].style});break;}}},_getCapabilities:function(){var _2a;if(this.serviceMode==="KVP"){_2a=this._url+"?request=GetCapabilities&service=WMTS&version="+this.version;}else{if(this.serviceMode==="RESTful"){_2a=this._url+"/"+this.version+"/WMTSCapabilities.xml";}}_a({url:_2a,handleAs:"text",load:this._parseCapabilities,error:this._getCapabilitiesError});},_parseCapabilities:function(_2b){_2b=_2b.replace(/ows:/gi,"");var xml=_7.parse(_2b);var _2c=_1.query("Contents",xml)[0];if(!_2c){console.error("The WMTS capabilities XML is not valid");this.onError(new Error("The WMTS capabilities XML is not valid"));return;}var _2d=_1.query("OperationsMetadata",xml)[0],_2e=_1.query("[name='GetTile']",_2d)[0],_2f=this.tileUrl,_30=_1.query("Get",_2e),i;for(i=0;i<_30.length;i++){var _31=_1.query("Constraint",_30[i])[0];if(!_31||this._getTagWithChildTagValue("AllowedValues","Value",this.serviceMode,_31)){_2f=_30[i].attributes[0].nodeValue;break;}}if(_2f.indexOf("/1.0.0/")===-1&&this.serviceMode==="RESTful"){_2f+="/";}if(this.serviceMode==="KVP"){_2f+=(_2f.substring(_2f.length-1,_2f.length)=="?")?"":"?";}this._url=_2f;this.copyright=this._getTagValues("Capabilities>ServiceIdentification>AccessConstraints",xml)[0];var _32=_1.query("Layer",_2c),_33,_34=[];this.layers=[];_4.forEach(_32,function(_35){_33=this._getTagValues("Identifier",_35)[0];_34.push(_33);this.layers.push(this._getWMTSLayerInfo(_33,_35,_2c));},this);this._setActiveLayer();this.loaded=true;this.onLoad(this);},_setActiveLayer:function(_36){if(!_36){_36={};}if(_36.identifier){this._identifier=_36.identifier;}if(_36.tileMatrixSet){this._tileMatrixSetId=_36.tileMatrixSet;}if(_36.format){this.format=_36.format;}if(_36.style){this._style=_36.style;}if(!this.layers){return;}var _37;if(!this._identifier){_37=this.layers[0];this._identifier=this.layers[0].identifier;}else{_37=_4.filter(this.layers,function(_38){return _38.identifier===this._identifier;},this)[0];}if(!_37){console.error("couldn't find the layer "+this._identifier);this.onError(new Error("couldn't find the layer "+this._identifier));return;}if(!this.format){this.format=_37.formats[0];if(this.format.indexOf("image/")===-1){this.format="image/"+this.format;}}else{if(this.format.indexOf("image/")===-1){this.format="image/"+this.format;}if(_4.indexOf(_37.formats,this.format)===-1){console.error("The layer doesn't support the format of "+this.format);this.onError(new Error("The layer doesn't support the format of "+this.format));return;}}if(!this._style){this._style=_37.styles[0];}else{if(_4.indexOf(_37.styles,this._style)===-1){console.error("The layer doesn't support the style of "+this._style);this.onError(new Error("The layer doesn't support the style of "+this._style));return;}}var _39;if(!this._tileMatrixSetId){_39=_4.filter(_37.tileMatrixSetInfos,function(_3a){return _3a.tileMatrixSet==="GoogleMapsCompatible";})[0];if(!_39){_39=_37.tileMatrixSetInfos[0];}this._tileMatrixSetId=_39.tileMatrixSet;}else{_39=_4.filter(_37.tileMatrixSetInfos,function(_3b){return _3b.tileMatrixSet===this._tileMatrixSetId;},this)[0];if(!_39){console.error("The tileMatrixSetId "+this._tileMatrixSetId+" is not supported by the layer of "+this._identifier);this.onError(new Error("The tileMatrixSetId "+this._tileMatrixSetId+" is not supported by the layer of "+this._identifier));return;}}this.description=_37.description;this.title=_37.title;this.spatialReference=_39.tileInfo.spatialReference;this.tileInfo=_39.tileInfo;this._levelToLevelValue=[];_4.forEach(this.tileInfo.lods,function(_3c){this._levelToLevelValue[_3c.level]=_3c.levelValue?_3c.levelValue:_3c.level;},this);if(this.spatialReference.wkid===102100||this.spatialReference.wkid===102113){this.fullExtent=this.initialExtent=_f.geographicToWebMercator(_37.gcsExtent);}else{if(this.spatialReference.wkid===4326){this.fullExtent=this.initialExtent=_37.gcsExtent;}else{this.fullExtent=_39.fullExtent;this.initialExtent=_39.initialExtent;}}this.resourceUrls=_37.resourceUrls;this.UrlTemplate=this._getTileUrlTemplate();this.layerInfo={"identifier":this._identifier,"tileMatrixSet":this._tileMatrixSetId,"format":this.format,"style":this._style,"fullExtent":this.fullExtent,"initialExtent":this.initialExtent,"tileInfo":this.tileInfo,"title":this.title,"description":this.description};},_getWMTSLayerInfo:function(_3d,_3e,_3f){var _40=this._getTagValues("Abstract",_3e)[0],_41=this._getTagValues("Title",_3e)[0],_42=_1.query("WGS84BoundingBox",_3e)[0],_43=this._getTagValues("LowerCorner",_42)[0].split(" "),_44=this._getTagValues("UpperCorner",_42)[0].split(" "),_45=parseFloat(_43[0]),_46=parseFloat(_43[1]),_47=parseFloat(_44[0]),_48=parseFloat(_44[1]),_49=new _e(_45,_46,_47,_48,new _c({"wkid":4326})),_4a=this._getTagValues("Identifier",_1.query("Style",_3e)[0]),_4b=this._getTagValues("Format",_3e),_4c=this._getLayerMatrixInfos(_3e,_3f),_4d={"identifier":_3d,"tileMatrixSetInfos":_4c,"formats":_4b,"styles":_4a,"title":_41,"description":_40,"gcsExtent":_49},_4e=_1.query("ResourceURL",_3e),_4f=[];_4.forEach(_4e,function(_50){_4f.push({"template":_50.getAttribute("template"),"format":_50.getAttribute("format"),"resourceType":_50.getAttribute("resourceType")});});if(_4f&&_4f.length>0){_4d.resourceUrls=_4f;}return _4d;},_getLayerMatrixInfos:function(_51,_52){var i,_53=[];if(!this._allMatrixInfos){this._allMatrixInfos=[];}var _54=this._getTagValues("TileMatrixSet",_51);if(!_54||_54.length===0){return;}_4.forEach(_54,function(_55,idx){var _56;if(this._allMatrixInfos.length>0){for(i=0;i<this._allMatrixInfos.length;i++){if(this._allMatrixInfos[i].tileMatrixSet==_55){_56=this._allMatrixInfos[i];break;}}}if(!_56){_56=this._getLayerMatrixInfo(_55,_51,_52);this._allMatrixInfos.push(_56);}_53.push(_56);},this);return _53;},_getLayerMatrixInfo:function(_57,_58,_59){var _5a,_5b,_5c,i,_5d,lod,_5e=[];var _5f=this._getTagWithChildTagValue("TileMatrixSetLink","TileMatrixSet",_57,_58);var _60=this._getTagValues("TileMatrix",_5f);var _61=this._getTagWithChildTagValue("TileMatrixSet","Identifier",_57,_59);var crs=this._getTagValues("SupportedCRS",_61)[0];_5a=crs.split(":").pop();if(_5a==900913||_5a==3857){_5a=102100;}if(crs.toLowerCase().indexOf("crs84")>-1||crs.toLowerCase().indexOf("crs:84")>-1){_5a=4326;}else{if(crs.toLowerCase().indexOf("crs83")>-1||crs.toLowerCase().indexOf("crs:83")>-1){_5a=4269;}else{if(crs.toLowerCase().indexOf("crs27")>-1||crs.toLowerCase().indexOf("crs:27")>-1){_5a=4267;}}}var _62=new _c({"wkid":_5a});var _63=_1.query("TileMatrix",_61)[0];_5b=parseInt(this._getTagValues("TileWidth",_63)[0],10);_5c=parseInt(this._getTagValues("TileHeight",_63)[0],10);var _64=this._getTagValues("TopLeftCorner",_63)[0].split(" "),top=_64[0],_65=_64[1];if(top.split("E").length>1){var _66=top.split("E");top=_66[0]*Math.pow(10,_66[1]);}if(_65.split("E").length>1){var _67=_65.split("E");_65=_67[0]*Math.pow(10,_67[1]);}for(i=0;i<this._flippingAxisForWkids.length;i++){if((crs.split(":").pop()>=this._flippingAxisForWkids[i][0]&&crs.split(":").pop()<=this._flippingAxisForWkids[i][1])||_5a===4326){_5d=new _d(parseFloat(_65),parseFloat(top),_62);break;}}if(i===this._flippingAxisForWkids.length){_5d=new _d(parseFloat(top),parseFloat(_65),_62);}if(_60.length===0){var _68=_1.query("TileMatrix",_61);for(i=0;i<_68.length;i++){lod=this._getLodFromTileMatrix(_68[i],_5a,i);_5e.push(lod);}}else{for(i=0;i<_60.length;i++){var _69=this._getTagWithChildTagValue("TileMatrix","Identifier",_60[i],_61);lod=this._getLodFromTileMatrix(_69,_5a,i);_5e.push(lod);}}var _6a=_1.query("BoundingBox",_61)[0],_6b,_6c,_6d,_6e,_6f,_70,_71,_72,_73;if(_6a){_6b=this._getTagValues("LowerCorner",_6a)[0].split(" ");_6c=this._getTagValues("UpperCorner",_6a)[0].split(" ");}if(_6b&&_6b.length>1&&_6c&&_6c.length>1){_6d=parseFloat(_6b[0]);_6f=parseFloat(_6b[1]);_6e=parseFloat(_6c[0]);_70=parseFloat(_6c[1]);}else{var _74=this._getTagValues("MatrixWidth",_63)[0],_75=this._getTagValues("MatrixHeight",_63)[0];_6d=_5d.x;_70=_5d.y;_6e=_6d+_74*_5c*_5e[0].resolution;_6f=_70-_75*_5b*_5e[0].resolution;}_71=new _e(_6d,_6f,_6e,_70,_62);_72=_73=_71;var _76=new _11({"dpi":90.71428571428571,"spatialReference":_62,"format":this.format,"rows":_5b,"cols":_5c,"origin":_5d,"lods":_5e});var _77={"tileMatrixSet":_57,"fullExtent":_72,"initialExtent":_73,"tileInfo":_76};return _77;},_getCapabilitiesError:function(err){console.error("Failed to get capabilities xml");this.onError(err);},_getLodFromTileMatrix:function(_78,_79,_7a){var id=this._getTagValues("Identifier",_78)[0];var _7b=this._getTagValues("ScaleDenominator",_78)[0];if(_7b.split("E").length>1){var _7c=_7b.split("E");_7b=_7c[0]*Math.pow(10,_7c[1]);}else{_7b=parseFloat(_7b);}var _7d;if(_9.isDefined(_b[_79])){_7d=_b.values[_b[_79]];}else{_7d=111194.6519066546;}var _7e=_7b*7/25000/_7d;var lod={"level":_7a,"levelValue":id,"scale":_7b,"resolution":_7e};return lod;},_getTag:function(_7f,xml){var _80=_1.query(_7f,xml);if(_80&&_80.length>0){return _80[0];}else{return null;}},_getTagValues:function(_81,xml){var _82=[],_83=_81.split(">"),tag,_84,i;tag=_1.query(_83[0],xml)[0];if(_83.length>1){for(i=1;i<_83.length-1;i++){tag=_1.query(_83[i],tag)[0];}_84=_1.query(_83[_83.length-1],tag);}else{_84=_1.query(_83[0],xml);}if(_84&&_84.length>0){_4.forEach(_84,function(_85){if(_5("ie")){_82.push(_85.childNodes[0].nodeValue);}else{_82.push(_85.textContent);}});}return _82;},_getAttributeValues:function(_86,_87,xml){var _88=_1.query(_86,xml),_89=[];if(_88&&_88.length>0){_4.forEach(_88,function(tag){_89.push(tag.getAttribute(_87));});}return _89;},_getTagWithChildTagValue:function(_8a,_8b,_8c,xml){var _8d=xml.childNodes,_8e,j;for(j=0;j<_8d.length;j++){if(_8d[j].nodeName===_8a){if(_5("ie")){if(_9.isDefined(_1.query(_8b,_8d[j])[0])){_8e=_1.query(_8b,_8d[j])[0].childNodes[0].nodeValue;}}else{if(_9.isDefined(_1.query(_8b,_8d[j])[0])){_8e=_1.query(_8b,_8d[j])[0].textContent;}}if(_8e===_8c){return _8d[j];}}}},_flippingAxisForWkids:[[3819,3819],[3821,3824],[3889,3889],[3906,3906],[4001,4025],[4027,4036],[4039,4047],[4052,4055],[4074,4075],[4080,4081],[4120,4176],[4178,4185],[4188,4216],[4218,4289],[4291,4304],[4306,4319],[4322,4326],[4463,4463],[4470,4470],[4475,4475],[4483,4483],[4490,4490],[4555,4558],[4600,4646],[4657,4765],[4801,4811],[4813,4821],[4823,4824],[4901,4904],[5013,5013],[5132,5132],[5228,5229],[5233,5233],[5246,5246],[5252,5252],[5264,5264],[5324,5340],[5354,5354],[5360,5360],[5365,5365],[5370,5373],[5381,5381],[5393,5393],[5451,5451],[5464,5464],[5467,5467],[5489,5489],[5524,5524],[5527,5527],[5546,5546],[2044,2045],[2081,2083],[2085,2086],[2093,2093],[2096,2098],[2105,2132],[2169,2170],[2176,2180],[2193,2193],[2200,2200],[2206,2212],[2319,2319],[2320,2462],[2523,2549],[2551,2735],[2738,2758],[2935,2941],[2953,2953],[3006,3030],[3034,3035],[3038,3051],[3058,3059],[3068,3068],[3114,3118],[3126,3138],[3150,3151],[3300,3301],[3328,3335],[3346,3346],[3350,3352],[3366,3366],[3389,3390],[3416,3417],[3833,3841],[3844,3850],[3854,3854],[3873,3885],[3907,3910],[4026,4026],[4037,4038],[4417,4417],[4434,4434],[4491,4554],[4839,4839],[5048,5048],[5105,5130],[5253,5259],[5269,5275],[5343,5349],[5479,5482],[5518,5519],[5520,5520],[20004,20032],[20064,20092],[21413,21423],[21473,21483],[21896,21899],[22171,22177],[22181,22187],[22191,22197],[25884,25884],[27205,27232],[27391,27398],[27492,27492],[28402,28432],[28462,28492],[30161,30179],[30800,30800],[31251,31259],[31275,31279],[31281,31290],[31466,31700],[900913,900913]]});if(_5("extend-esri")){_3.setObject("layers.WMTSLayer",_13,_8);}return _13;});
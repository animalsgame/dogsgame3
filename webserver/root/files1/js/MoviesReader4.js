(function(window){
function cl(vm){
var _183=["MoviesReader4_5667656","lang.display.Sprite","png","jpg","gif","bmp","push","addChild","add","run","on","resize","autoResize","web","addSpriteType","bitmap","src","getAssetByName","getAssetImage","shape","resid","setTarget","fillColor","int","getHexColor","Object","type","gradient","cos","sin","createLinearGradient","rect","resizeFunc1","sound","getAssetByID","mp3","text","","Arial","color","fontSize","fontName","filters","applyFiltersDisp","fillID","draw","bitmapMC","aid","image","textInput","id","shadow","#000000","blur","offsetX","offsetY","addAssetBitmapID","url","del","removeURL","removeAssetByName","createAssetURL","sourceRect","getAssetBitmap","readBytes","createURL","getAssetURL","getMovieInfoByID","readMovieObjectJSON","readMovieByInfoJSON","drawMovie","percentWidth","percentHeight","buttonMode","regPoint","split",",","setMatrixMovieJSON","getMovieID","writeMovieByObj","createMovie","checkImageExt","Array","/","parseAtlasJSON",".png","indexOf","@","cut",".","initAtlasesV","readInt","readString","ttf","json","readUTFBytes","decode","audio/mpeg","image/","registerFont","load","clear","readAssetsTag","normal","fullscreen","setFullscreen","autoFullscreen","getPropertyByStr","callmethod","String","Function","apply","callEventAction","addEventFunc1","init","applyEventsList","charAt","%","getStrPercent","calcPercentVal1","getSpriteSizeA","toString","0","#","matrix","movie","name","getChildAt","cb","matrixSprite","offsetYPos","events","isFile","readByte","read","readBytesStructNoSkip","findFolderByName","movies","readFolder","addClass","findFileByName","exportNames.json","readFileBytes","setGlobal","assetsSize","assets","setPixelRatio","setAppMinSize","w","h","painter","fillValue","fillData","resizeCB","ceil","destroy","lib.MoviesReader4","getAll","removeAll","remove","stop","now","update","lib.TweenGroup","nextId","setCallback","floor","TWEEN","static","concat","start","_onStopCallback","stopChainedTweens","end","group","delay","repeat","repeatDelay","yoyo","interpolation","chain","onStart","onStop","_onStartCallback","easingFunction","_interpolationFunction","+","-","Number","onUpdate","onComplete","lib.Tween"];
var GLOBAL=vm.GLOBAL;
var checkIn=vm.checkIn;
var checkIs=vm.checkIs;
var castInt=vm.castInt;
var callMethod=vm.callMethod;
var ctorObject=vm.ctorObject;
(function(window){
var _MoviesReader4_5667656={};
_MoviesReader4_5667656["ctor"]=function(){

};
vm.registerClass(_183[0],_183[1],_MoviesReader4_5667656);
})(window);


(function(window){
var _lib_MoviesReader4={};
_lib_MoviesReader4["ctor"]=function(){
var th=this;
this.headerArr=[15];
this.version=0;
this.isAssetsSizeAllow=!1;
this.extImageList=[_183[2],_183[3],_183[4],_183[5]];
this.assetsList={};
this.assetsSizeInfo={};
this.assetsNamesList={};
this.assetsArrList=[];
this.moviesPos={};
this.moviesPosNames={};
this.exportMoviesName={};
this.atlasesInfo={};
this.atlasesFramesObj={};
this.evObjA={click:1,mousedown:1,mouseup:1,rclick:1,rollover:1,rollout:1};
this.moviesIds=[];
this.resizeCB=null;
this.fontsList=[];
this.resizeArr=[];
this.resizeObject=[];
callMethod(this,this.resizeObject,_183[6],[th]);
this.fpsM=null;
this.appMinSize=null;
this.scaleFactor=1;
this.stageWidth=0;
this.stageHeight=0;
this.stageScaleWidth=0;
this.stageScaleHeight=0;
this.isScaleFit=!1;
this.isOptimizeNoWeb=!1;
this.isMovieJSON=!0;
this.itemsTypeObj={};
this.global=null;
this.ba=null;
this.ev=ctorObject(lang.events.EventsObjectMaster);
this.evm=ctorObject(lang.events.EventsObjectMaster);
this.noWeb=!1;
this.cnv=ctorObject(lang.display.Canvas);
callMethod(this,null,_183[7],[this.cnv]);
var fpsV=30;
var fps=ctorObject(lang.utils.FpsMaster);
fps.framerate=fpsV;
callMethod(this,fps,_183[8],[this.cnv]);
callMethod(this,fps,_183[9]);
this.fpsM=fps;
stage.framerate=fpsV;
callMethod(this,stage,_183[10],[_183[11],function(){
callMethod(this,th,_183[12]);

}]);
callMethod(this,th,_183[12]);

callMethod(this,null,_183[14],[_183[15],function(obj){
var resid=obj.resid;
var matrix=obj.matrix;
var spr1=null;
var atlasInfo=null;
if(checkIn(obj,_183[16]) && obj.src){
var atlasNm=obj.src;
if(checkIn(th.atlasesFramesObj,atlasNm)){
atlasInfo=th.atlasesFramesObj[atlasNm];

}

}
if(atlasInfo){
var el=callMethod(this,th,_183[17],[atlasInfo.atlasName]);
if(el){
var bm=ctorObject(lang.display.Bitmap);
bm.src=el;
bm.sourceRect=atlasInfo.frame;
spr1=bm;

}

}else{
var assetObj=callMethod(this,th,_183[18],[resid]);
if(assetObj){
spr1=assetObj;

}

}
if(!spr1){
spr1=ctorObject(lang.display.Bitmap);

}
spr1.matrixSprite=matrix;
return spr1;

}]);
callMethod(this,null,_183[14],[_183[19],function(obj){
var resid=0;
if(checkIn(obj,_183[20])){
resid=obj.resid;

}
var fillColor=0;
var fillV=fillColor;
var isGradient=!1;
var fillGrad=null;
var matrix=obj.matrix;
var spr2=ctorObject(lang.display.Sprite);
var p1=ctorObject(lang.display.Painter);
callMethod(this,p1,_183[21],[spr2]);
if(checkIn(obj,_183[22])){
fillColor=obj.fillColor;
if(checkIs(fillColor,_183[23])){
fillV=callMethod(this,th,_183[24],[fillColor]);

}else if(checkIs(fillColor,_183[25])){
if(checkIn(fillColor,_183[26]) && (fillColor.type == _183[27])){
isGradient=!0;
var fillq=fillColor;
var angle=((fillq.r / 180) * Math.PI);
var cos=callMethod(this,Math,_183[28],[angle]);
var sin=callMethod(this,Math,_183[29],[angle]);
fillV=callMethod(this,p1,_183[30],[0,0,(cos * matrix.w),(sin * matrix.h),fillq.colors,fillq.ratios]);
if(!th.noWeb){
spr2.cacheAsBitmap=!0;

}

}

}


}
if((resid > 0)){
var bmData=callMethod(this,th,_183[18],[resid]);
if(bmData){
fillV=bmData;
if(!th.noWeb){
spr2.cacheAsBitmap=!0;

}

}

}
p1.fillData=fillV;
if(isGradient){
p1.fillData=fillColor;

}
spr2.painter=p1;
p1.fillValue=fillV;
callMethod(this,p1,_183[31],[0,0,matrix.w,matrix.h,fillV]);
spr2.matrixSprite=matrix;
callMethod(this,th,_183[32],[th.stageScaleWidth,th.stageScaleHeight,spr2]);
return spr2;

}]);
callMethod(this,null,_183[14],[_183[33],function(obj){
var resid=obj.resid;
var so=ctorObject(lang.media.Sound);
var matrix=obj.matrix;
var assetObj=callMethod(this,th,_183[34],[resid]);
if(assetObj){
if((assetObj.ext == _183[35])){
so.src=assetObj.url;

}

}
so.matrixSprite=matrix;
return so;

}]);
callMethod(this,null,_183[14],[_183[36],function(obj){
var matrix=obj.matrix;
var txt=_183[37];
var color=0;
var fontSize=16;
var fontName=_183[38];
if(checkIn(obj,_183[36])){
txt=obj.text;

}
if(checkIn(obj,_183[39])){
color=obj.color;

}
if(checkIn(obj,_183[40])){
fontSize=obj.fontSize;

}
if(checkIn(obj,_183[41])){
fontName=obj.fontName;

}
var spr1=ctorObject(lang.text.TextField);
if(checkIn(obj,_183[42])){
callMethod(this,th,_183[43],[obj.filters,spr1]);

}
if(checkIn(obj,_183[44])){
spr1.fillID=obj.fillID;
var bm=callMethod(this,th,_183[18],[obj.fillID]);
if(bm){
var bmd=ctorObject(lang.display.BitmapData,[bm.naturalWidth,bm.naturalHeight,0,!0]);
callMethod(this,bmd,_183[45],[bm]);
color=bmd;

}

}
spr1.color=color;
spr1.fontSize=fontSize;
spr1.fontName=fontName;
spr1.text=txt;
spr1.matrixSprite=matrix;
return spr1;

}]);
callMethod(this,null,_183[14],[_183[46],function(obj){
var resid=obj.resid;
var assetid=0;
if(checkIn(obj,_183[47])){
assetid=obj.aid;

}
var bm=null;
var matrix=obj.matrix;
var c=callMethod(this,th,_183[34],[assetid]);
if(c){
if(checkIn(c,_183[48])){
bm=c.image;

}

}
var spr1=ctorObject(lang.display.BitmapMovieClip,[bm]);
spr1.frames=obj.frames;
spr1.aid=obj.aid;
spr1.matrixSprite=matrix;
return spr1;

}]);
callMethod(this,null,_183[14],[_183[49],function(obj){
var matrix=obj.matrix;
var color=0;
var fontSize=16;
var fontName=_183[38];
if(checkIn(obj,_183[39])){
color=obj.color;

}
if(checkIn(obj,_183[40])){
fontSize=obj.fontSize;

}
if(checkIn(obj,_183[41])){
fontName=obj.fontName;

}
var spr1=ctorObject(lang.text.TextInput);
spr1.color=color;
spr1.fontSize=fontSize;
spr1.fontName=fontName;
spr1.offsetYPos=-8;

spr1.matrixSprite=matrix;
return spr1;

}]);

};
_lib_MoviesReader4[_183[43]]=function(arr,disp){
var th=this;
if(arr){
if(disp){
var isShadowObj=null;
var a=[];
var i=0;
while((i < arr.size)){
var el=arr[i];
if(checkIn(el,_183[50])){
if((el.id == _183[51])){
if(!isShadowObj){
isShadowObj=el;

}

}

}
i++;
}
if(isShadowObj){
var ob={id:_183[51],color:_183[52],blur:0,offsetX:0,offsetY:0};
if(checkIn(isShadowObj,_183[39])){
ob.color=isShadowObj.color;

}
if(checkIn(isShadowObj,_183[53])){
ob.blur=isShadowObj.blur;

}
if(checkIn(isShadowObj,_183[54])){
ob.offsetX=isShadowObj.offsetX;

}
if(checkIn(isShadowObj,_183[55])){
ob.offsetY=isShadowObj.offsetY;

}
callMethod(this,a,_183[6],[ob]);

}
if((a.size > 0)){
disp.filters=a;

}

}

}

};
_lib_MoviesReader4[_183[14]]=function(id,cb){
if(cb){
var ob={id:id,cb:cb};
this.itemsTypeObj[id]=ob;

}

};
_lib_MoviesReader4[_183[56]]=function(id,name,bm){
if(bm){
var url=bm.src;
var ob={id:id,fileName:name,ext:_183[2],url:url};
ob.image=bm;
this.assetsList[id]=ob;
callMethod(this,this.assetsArrList,_183[6],[ob]);

}

};
_lib_MoviesReader4[_183[60]]=function(v){
var th=this;
var i=0;
while((i < this.assetsArrList.size)){
var c=this.assetsArrList[i];
if((c.fileName == v)){
if(checkIn(th.assetsList,v)){
delete th.assetsList[v];

}
if(checkIn(c,_183[57])){
callMethod(this,this.assetsArrList,_183[58],[i]);
callMethod(this,URL,_183[59],[c.url]);

}
return !0;

}
i++;
}
return !1;

};
_lib_MoviesReader4[_183[18]]=function(id){
if(checkIn(this.assetsList,id)){
var c=this.assetsList[id];
if((c.id == id)){
if(this.isOptimizeNoWeb){
if(!c.isInit){
callMethod(this,this,_183[61],[c]);

}

}
if(checkIn(c,_183[48])){
var imgW=c.image.naturalWidth;
var imgH=c.image.naturalHeight;
var aInfo=null;
if(checkIn(this.assetsSizeInfo,id)){
aInfo=this.assetsSizeInfo[id];
imgW=aInfo.w;
imgH=aInfo.h;

}
var bm=ctorObject(lang.display.Bitmap);
bm.width=imgW;
bm.height=imgH;
if(aInfo){
bm.imageSizeData={width:imgW,height:imgH};

}
if(checkIn(c.image,_183[62])){
bm.sourceRect=c.image.sourceRect;

}
bm.src=c.url;
return bm;

}

}

}
return null;

};
_lib_MoviesReader4[_183[63]]=function(v){
if(checkIn(this.assetsNamesList,v)){
var c=this.assetsNamesList[v];
var id=c.id;
if(this.isOptimizeNoWeb){
if(!c.isInit){
callMethod(this,this,_183[61],[c]);

}

}
if(checkIn(c,_183[48])){
if(checkIn(this.assetsSizeInfo,id)){
var aInfo=this.assetsSizeInfo[id];
var imgW=aInfo.w;
var imgH=aInfo.h;
c.image.imageSizeData={width:imgW,height:imgH};

}
return c.image;

}

}
return null;

};
_lib_MoviesReader4[_183[61]]=function(c){
if(!checkIn(c,_183[57])){
var bb=this.ba;
var lastPos=bb.position;
bb.position=c.pos;
var by=ctorObject(lang.utils.ByteArray);
callMethod(this,bb,_183[64],[by,0,c.size]);
by.position=0;
bb.position=lastPos;
var url=callMethod(this,URL,_183[65],[by,c.mimeType]);
var bmm=ctorObject(lang.display.Bitmap);
bmm.src=url;
c.isInit=!0;
c.image=bmm;
c.url=url;
c.bytes=null;

}

};
_lib_MoviesReader4[_183[17]]=function(v){
if(checkIn(this.assetsNamesList,v)){
var c=this.assetsNamesList[v];
var vv=callMethod(this,this,_183[18],[c.id]);
return vv;

}
return null;

};
_lib_MoviesReader4[_183[34]]=function(v){
if(checkIn(this.assetsList,v)){
var c=this.assetsList[v];
if(this.isOptimizeNoWeb){
if(!c.isInit){
callMethod(this,this,_183[61],[c]);

}

}
if((c.id == v)){
return c;

}

}
return null;

};
_lib_MoviesReader4[_183[66]]=function(name){
if(checkIn(this.assetsNamesList,name)){
var c=this.assetsNamesList[name];
if(this.isOptimizeNoWeb){
if(!c.isInit){
callMethod(this,this,_183[61],[c]);

}

}
if(checkIn(c,_183[57])){
return c.url;

}

}
return _183[37];

};
_lib_MoviesReader4[_183[67]]=function(id){
if(checkIn(this.moviesPos,id)){
var vv=this.moviesPos[id];
return vv;

}
return null;

};
_lib_MoviesReader4[_183[69]]=function(info,spr){
if(info){
if(!spr){
spr=ctorObject(lang.display.Sprite);

}
callMethod(this,this,_183[68],[info.data,spr]);
return spr;

}
return null;

};
_lib_MoviesReader4[_183[70]]=function(id,spr){
var b=null;
if(!spr){
spr=ctorObject(lang.display.Sprite);

}
b=checkIn(this.moviesPos,id) ? this.moviesPos[id] : null;
if(b){
var obb=callMethod(this,this,_183[69],[b,spr]);
return obb;

}
return null;

};
_lib_MoviesReader4[_183[77]]=function(obj,o,disp){
if(o && disp){
disp.x=o.x;
disp.y=o.y;
disp.rotation=o.r;
disp.scaleX=o.scaleX;
disp.scaleY=o.scaleY;
if(checkIn(o,_183[71])){
disp.percentWidth=o.percentWidth;

}
if(checkIn(o,_183[72])){
disp.percentHeight=o.percentHeight;

}
if(checkIs(disp,lang.display.Bitmap)){

}else{
disp.width=o.w;
disp.height=o.h;

}
disp.alpha=o.alpha;
if(checkIn(o,_183[73])){
if((o.buttonMode == 1)){
disp.buttonMode=!0;

}else if(o.buttonMode){
disp.buttonMode=!0;

}


}
var px=0;
var py=0;
if(checkIn(o,_183[74])){
var ar1=callMethod(this,o.regPoint,_183[75],[_183[76]]);
if((ar1.size > 1)){
px=castInt(ar1[0]);
py=castInt(ar1[1]);

}

}
disp.point={x:px,y:py};

}

};
_lib_MoviesReader4[_183[80]]=function(id){
var mov=callMethod(this,null,_183[78],[id]);
if(mov){
var s=ctorObject(lang.display.Sprite);
callMethod(this,null,_183[79],[mov.data,s]);
return s;

}
return null;

};
_lib_MoviesReader4[_183[81]]=function(s){
var th=this;
var a=th.extImageList;
var i=0;
while((i < a.size)){
var el1=a[i];
if((s == el1)){
return !0;

}
i++;
}
return !1;

};
_lib_MoviesReader4[_183[84]]=function(origName,name,o,ob){
var arr=[];
if(o){
if(o.animations){
var animData=o.animations;
var animFrames=o.frames;
if(animData){
for(var n2 in animData){
var dt1=animData[n2];
var nm3=n2;
if(dt1.frames){
if(dt1 && dt1.frames){
dt1=dt1.frames;

}
if(checkIs(dt1,_183[82])){
if(dt1 && (dt1.length == 1)){
var pos=dt1[0];
var a1=animFrames[pos];
if(checkIs(a1,_183[82])){
if(a1 && (a1.length > 3)){
var x=a1[0];
var y=a1[1];
var w=a1[2];
var h=a1[3];
var frame={x:x,y:y,w:w,h:h};
var res={atlasName:origName,name:nm3,frame:frame};
callMethod(this,arr,_183[6],[res]);
var fname=((name + _183[83]) + nm3);
if(ob){
ob[fname]=res;

}

}

}

}else{

}

}

}

}

}

}else if(o.frames){
for(var n2 in o.frames){
var dt1=o.frames[n2];
var frame=dt1.frame;
var nm3=n2;
var res={atlasName:origName,name:nm3,frame:frame};
callMethod(this,arr,_183[6],[res]);
var fname=((name + _183[83]) + nm3);
if(ob){
ob[fname]=res;

}

}

}


}
return arr;

};
_lib_MoviesReader4[_183[90]]=function(){
var th=this;
for(var n in th.atlasesInfo){
var obj=th.atlasesInfo[n];
if(obj){
var nm=(n + _183[85]);
var el=callMethod(this,th,_183[17],[nm]);
if(el){
var nm2=nm;
var p2=callMethod(this,nm2,_183[86],[_183[87]]);
if((p2 > -1)){
nm2=callMethod(this,nm2,_183[88],[0,p2]);

}
p2=callMethod(this,nm2,_183[86],[_183[89]]);
if((p2 > -1)){
nm2=callMethod(this,nm2,_183[88],[0,p2]);

}
var arr2=callMethod(this,th,_183[84],[nm,nm2,obj,th.atlasesFramesObj]);
th.atlasesInfo[nm]=arr2;

}

}

}

};
_lib_MoviesReader4[_183[102]]=function(ba,cb){
var th=this;
var count=callMethod(this,ba,_183[91]);
var nums=0;
if(th.isOptimizeNoWeb){
var kk=0;
while((kk < count)){
var id=callMethod(this,ba,_183[91]);
var name=callMethod(this,ba,_183[92]);
var ext=callMethod(this,ba,_183[92]);
var szz=callMethod(this,ba,_183[91]);
var by=ba;
var pos7=ba.position;
if((ext == _183[93])){
by=ctorObject(lang.utils.ByteArray);
callMethod(this,ba,_183[64],[by,0,szz]);
by.position=0;

}else if((ext == _183[94])){
var ss=callMethod(this,ba,_183[95],[szz]);
var pp=callMethod(this,name,_183[86],[_183[89]]);
var nm3=name;
if((pp > -1)){
nm3=callMethod(this,nm3,_183[88],[0,pp]);

}
var ob=callMethod(this,JSON,_183[96],[ss]);
if(ob){
th.atlasesInfo[nm3]=ob;

}

}else{
ba.position+=szz;

}

var isImg=callMethod(this,th,_183[81],[ext]);
var ctype=_183[37];
var url=_183[37];
if((ext == _183[35])){
ctype=_183[97];

}
if(isImg){
ctype=(_183[98] + ext);

}
if((ext == _183[93])){
var pp=callMethod(this,name,_183[86],[_183[89]]);
var nm3=name;
if((pp > -1)){
nm3=callMethod(this,nm3,_183[88],[0,pp]);

}
callMethod(this,th.fontsList,_183[6],[{name:nm3,bytes:by}]);
callMethod(this,lang.text.Font,_183[99],[nm3,by]);

}
var ob={id:id,fileName:name,mimeType:ctype,ext:ext,pos:pos7,size:szz,isInit:!1};
this.assetsList[id]=ob;
this.assetsNamesList[name]=ob;
callMethod(this,this.assetsArrList,_183[6],[ob]);
kk++;
}
callMethod(this,th,_183[90]);
cb();

}else{
var kk=0;
while((kk < count)){
var id=callMethod(this,ba,_183[91]);
var name=callMethod(this,ba,_183[92]);
var ext=callMethod(this,ba,_183[92]);
var szz=callMethod(this,ba,_183[91]);
var by=ba;
var pos7=ba.position;
by=ctorObject(lang.utils.ByteArray);
callMethod(this,ba,_183[64],[by,0,szz]);
by.position=0;
var isImg=callMethod(this,th,_183[81],[ext]);
if(isImg){
var imgurl=null;
var img=ctorObject(lang.display.Bitmap);
imgurl=callMethod(this,URL,_183[65],[by,(_183[98] + ext)]);
callMethod(this,th.ev,_183[10],[img,_183[100],function(){
++nums;if((nums >= count)){
callMethod(this,th.ev,_183[101]);
cb();
callMethod(this,th,_183[12]);

}

}]);
img.src=imgurl;
var ob={id:id,fileName:name,ext:ext,url:imgurl,image:img};
this.assetsList[id]=ob;
this.assetsNamesList[name]=ob;
callMethod(this,this.assetsArrList,_183[6],[ob]);

}else{
var ctype=_183[37];
if((ext == _183[35])){
ctype=_183[97];

}
var url=callMethod(this,URL,_183[65],[by,ctype]);
var ob={id:id,fileName:name,ext:ext,url:url};
this.assetsList[id]=ob;
this.assetsNamesList[name]=ob;
callMethod(this,this.assetsArrList,_183[6],[ob]);
++nums;if((nums >= count)){
callMethod(this,th.ev,_183[101]);
cb();
callMethod(this,th,_183[12]);

}

}
kk++;
}
if((count <= 0)){
cb();
callMethod(this,th,_183[12]);

}

}

};
_lib_MoviesReader4[_183[105]]=function(v){
if(v){
if((this.stage.displayState == _183[103])){
this.stage.displayState=_183[104];

}

}else{
if((this.stage.displayState != _183[103])){
this.stage.displayState=_183[103];

}

}

};
_lib_MoviesReader4[_183[106]]=function(){
this.stage.displayState=(this.stage.displayState == _183[103]) ? _183[104] : _183[103];

};
_lib_MoviesReader4[_183[107]]=function(s){
var o=this.global;
if(!o){
return null;

}
if(s){
var spl=callMethod(this,s,_183[75],[_183[89]]);
var i=0;
while((i < spl.size)){
var nm=spl[i];
if(checkIn(o,nm)){
o=o[nm];

}else{
return null;

}
i++;
}

}else{
return null;

}
return o;

};
_lib_MoviesReader4[_183[112]]=function(e,ev,disp){
var th=this;
if(ev){
var tt=ev.type;
var act=ev.action;
if((tt == _183[108])){
if(checkIs(act,_183[109])){
var cbb=callMethod(this,th,_183[107],[act]);
if(cbb){
if(checkIs(cbb,_183[110])){
var r=callMethod(this,cbb,_183[111],[disp,[e]]);

}

}

}

}

}

};
_lib_MoviesReader4[_183[113]]=function(disp,type,arr){
var th=this;
var cb1=function(e){
if(arr){
var k=0;
while((k < arr.size)){
callMethod(this,th,_183[112],[e,arr[k],disp]);
k++;
}

}

};
callMethod(this,disp,_183[10],[type,cb1]);
return cb1;

};
_lib_MoviesReader4[_183[115]]=function(disp,arr){
var th=this;
if(arr){
var cbobj={};
var evList={};
var i=0;
while((i < arr.size)){
var el=arr[i];
var tt=el.type;
if(checkIn(th.evObjA,tt)){
if(!checkIn(evList,tt)){
evList[tt]=[];

}
var evv=evList[tt];
callMethod(this,evv,_183[6],[el.action]);
if(!checkIn(cbobj,tt)){
var cb1=callMethod(this,th,_183[113],[disp,tt,evv]);
cbobj[tt]=cb1;

}

}else{
if((tt == _183[114])){
callMethod(this,th,_183[112],[null,el.action,disp]);

}

}
i++;
}

}

};
_lib_MoviesReader4[_183[118]]=function(o){
if(o){
if(checkIs(o,_183[109])){
var sz=o.size;
if((sz > 0)){
var s=callMethod(this,o,_183[116],[(sz - 1)]);
if((s == _183[117])){
var ss=callMethod(this,o,_183[88],[0,(sz - 1)]);
var perc=castInt(ss);
return perc;

}

}

}

}
return null;

};
_lib_MoviesReader4[_183[119]]=function(w,v){
var percW=callMethod(this,this,_183[118],[v]);
if(percW){
var perc=castInt(((w * percW) / 100));
return perc;

}
return w;

};
_lib_MoviesReader4[_183[120]]=function(o,w,h){
var th=this;
if(o){
var par=o;
if(par){
while(par){
if(checkIn(par,_183[71])){
var ww=par.percentWidth;
if(checkIs(ww,_183[109])){
ww=callMethod(this,th,_183[119],[w,ww]);

}
w=ww;

}
if(checkIn(par,_183[72])){
var hh=par.percentHeight;
if(checkIs(hh,_183[109])){
hh=callMethod(this,th,_183[119],[h,hh]);

}
h=hh;

}
par=par.parent;

}

}

}
return {w:w,h:h};

};
_lib_MoviesReader4[_183[24]]=function(color){
var vv=(_183[37] + callMethod(this,color,_183[121],[16]));
var num=vv.size;
var qw=_183[37];
if((num < 6)){
var i=0;
while((i < (6 - num))){
qw+=_183[122];
i++;
}

}
var q=((qw + _183[37]) + vv);
return (_183[123] + q);

};
_lib_MoviesReader4[_183[68]]=function(o,spr){
if(o){
if(spr){
var t=_183[37];
if(checkIn(o,_183[26])){
t=o.type;

}
var matrix=null;
var resid=0;
if(checkIn(o,_183[124])){
matrix=o.matrix;

}
if(checkIn(o,_183[20])){
resid=o.resid;

}
if((t == _183[125])){
if((resid == 0)){
var count=o.list.size;
var k=0;
while((k < count)){
callMethod(this,this,_183[68],[o.list[k],spr]);
k++;
}

}else{
var movInfo=checkIn(this.moviesPos,resid) ? this.moviesPos[resid] : null;
if(movInfo){
var mv1=callMethod(this,this,_183[69],[movInfo,null]);
callMethod(this,this,_183[77],[o,matrix,mv1]);
callMethod(this,spr,_183[7],[mv1]);
if(checkIn(matrix,_183[126])){
var mName=matrix.name;
spr[mName]=mv1;
if((movInfo.type == 2)){
var mvv=callMethod(this,mv1,_183[127],[0]);
spr[mName]=mvv;

}

}

}

}

}else{
if(checkIn(this.itemsTypeObj,t)){
var obb=this.itemsTypeObj[t];
if(obb.cb){
var spr1=callMethod(this,obb,_183[128],[o]);
if(spr1){
if(checkIn(spr1,_183[129])){
callMethod(this,this,_183[77],[o,spr1.matrixSprite,spr1]);
if(checkIn(spr1,_183[130])){
spr1.y=(spr1.y + spr1.offsetYPos);

}
if(checkIn(spr1.matrixSprite,_183[126])){
var mName=spr1.matrixSprite.name;
spr[mName]=spr1;
spr1.itemName=mName;

}

}
if(checkIn(o,_183[131])){
callMethod(this,this,_183[115],[spr1,o.events]);

}
if(checkIs(spr1,lang.media.Sound)){

}else{
callMethod(this,spr,_183[7],[spr1]);

}

}

}

}

}

}

}

};
_lib_MoviesReader4[_183[134]]=function(ba,cb){
var th=this;
if(checkIs(ba,_183[109])){
var fi=ctorObject(lang.io.File,[ba]);
var isExt2=callMethod(this,fi,_183[132]);
if(isExt2){
ba=callMethod(this,fi,_183[64]);

}

}
this.ba=ba;
if(ba){
var res=!0;
var i=0;
while((i < this.headerArr.size)){
var b=callMethod(this,ba,_183[133]);
if((b != this.headerArr[i])){
res=!1;

}
i++;
}
if(res){
var q=ctorObject(lang.utils.ReadFolderFileStruct);
callMethod(this,q,_183[134],[ba]);
var rootFolder=callMethod(this,q,_183[135]);
var moviesFolder=callMethod(this,q,_183[136],[rootFolder,_183[137]]);
var files=callMethod(this,q,_183[138],[moviesFolder,!1]);
if(files){
var i=0;
while((i < files.size)){
var el=files[i];
var id=0;
var nameM=el.name;
var name=_183[37];
var poss=ba.position;
var p2=callMethod(this,nameM,_183[86],[_183[89]]);
if((p2 > -1)){
var nm=callMethod(this,nameM,_183[88],[0,p2]);
id=castInt(nm);

}
ba.position=el.pos;
var sz=el.size;
var ob1={id:id,name:name,type:1};
var ss=callMethod(this,ba,_183[95],[sz]);
ba.position=poss;
var ob=callMethod(this,JSON,_183[96],[ss]);
if(ob){
ob1.data=ob;

}
this.moviesPos[id]=ob1;
i++;
}

}
var addCl=function(movid,name){
var mm=callMethod(this,VM,_183[139],[name,_183[1],function(){
callMethod(this,th,_183[70],[movid,this]);

}]);
return mm;

};
var exportNamesFile=callMethod(this,q,_183[140],[rootFolder,_183[141]]);
if(exportNamesFile){
var ba3=callMethod(this,q,_183[142],[exportNamesFile]);
if(ba3){
var s3=callMethod(this,ba3,_183[95],[ba3.size]);
var ob4=callMethod(this,JSON,_183[96],[s3]);
if(ob4){
var i=0;
while((i < ob4.size)){
var el=ob4[i];
var tt=el.t;
var name=el.name;
if((tt == 1)){
var movClass=addCl(el.id,name);
if(movClass){
movClass.movieid=el.id;
callMethod(this,VM,_183[143],[name,movClass]);

}

}
i++;
}

}

}

}
var assetsSizeInfo=callMethod(this,q,_183[140],[rootFolder,_183[144]]);
if(assetsSizeInfo){
var pp=ba.position;
ba.position=assetsSizeInfo.pos;
var allSz=(assetsSizeInfo.pos + assetsSizeInfo.size);
var nums=callMethod(this,ba,_183[91]);
if((nums > 0)){
this.isOptimizeNoWeb=!0;
this.isAssetsSizeAllow=!0;

}
while((ba.position < allSz)){
var id=callMethod(this,ba,_183[91]);
var w=callMethod(this,ba,_183[91]);
var h=callMethod(this,ba,_183[91]);
var szObj={w:w,h:h};
this.assetsSizeInfo[id]=szObj;

}
ba.position=pp;

}
var assetsFile=callMethod(this,q,_183[140],[rootFolder,_183[145]]);
if(assetsFile){
var pp=ba.position;
ba.position=assetsFile.pos;
callMethod(this,this,_183[102],[ba,cb]);
ba.position=pp;

}

}

}

};
_lib_MoviesReader4[_183[146]]=function(v){
this.scaleX=v;
this.scaleY=v;
this.scaleFactor=v;

};
_lib_MoviesReader4[_183[147]]=function(w,h){
this.isScaleFit=!0;
this.appMinSize={width:w,height:h};

};
_lib_MoviesReader4[_183[32]]=function(w,h,o,par){
var th=this;
if(o){
if(checkIs(o,lang.display.Sprite)){
var i=0;
while((i < o.numChildren)){
var el=callMethod(this,o,_183[127],[i]);
callMethod(this,th,_183[32],[w,h,el,o]);
i++;
}

}
var sz=null;
var ww=0;
var hh=0;
if(checkIn(o,_183[129])){
var matr=o.matrixSprite;
if(checkIn(matr,_183[148])){
ww=matr.w;

}
if(checkIn(matr,_183[149])){
hh=matr.h;

}

}
if(checkIn(o,_183[71])){
sz=callMethod(this,th,_183[120],[o,w,h]);

}
if(checkIn(o,_183[72])){
if(!sz){
sz=callMethod(this,th,_183[120],[o,w,h]);

}

}
if(sz){
if(checkIn(o,_183[71])){
ww=sz.w;

}
if(checkIn(o,_183[72])){
hh=sz.h;

}
if(checkIs(o,lang.display.Bitmap)){
if(checkIn(o,_183[71])){
o.scaleX=(sz.w / o.naturalWidth);

}
if(checkIn(o,_183[72])){
o.scaleY=(sz.h / o.naturalHeight);

}

}
if(checkIn(o,_183[150])){
var pp=o.painter;
if(checkIn(pp,_183[151])){
var fillV=0;
if(checkIn(pp,_183[152])){
fillV=pp.fillData;
callMethod(this,pp,_183[101]);
if(checkIs(pp.fillData,_183[25])){
if(checkIn(pp.fillData,_183[26]) && (pp.fillData.type == _183[27])){
var fillq=pp.fillData;
var angle=((fillq.r / 180) * Math.PI);
var cos=callMethod(this,Math,_183[28],[angle]);
var sin=callMethod(this,Math,_183[29],[angle]);
fillq.x1=(cos * ww);
fillq.y1=(sin * hh);
fillV=pp.fillValue;

}

}
callMethod(this,pp,_183[31],[0,0,ww,hh,fillV]);

}

}

}

}

}

};
_lib_MoviesReader4[_183[12]]=function(){
var th=this;
var w=th.stage.stageWidth;
var h=th.stage.stageHeight;
if(th.resizeCB){
callMethod(this,th,_183[153],[w,h]);

}
if(th.isScaleFit){
if(th.appMinSize){
var factorX=(w / th.appMinSize.width);
var factorY=(h / th.appMinSize.height);
var factor=factorY;
if((factorX < factorY)){
factor=factorX;

}
callMethod(this,this,_183[146],[factor]);

}

}
var wScale=callMethod(this,Math,_183[154],[(w / th.scaleFactor)]);
var hScale=callMethod(this,Math,_183[154],[(h / th.scaleFactor)]);
th.stageWidth=w;
th.stageHeight=h;
th.stageScaleWidth=wScale;
th.stageScaleHeight=hScale;
th.cnv.width=w;
th.cnv.height=h;
if(th.isScaleFit){
w=th.stageScaleWidth;
h=th.stageScaleHeight;

}
var i=0;
while((i < th.resizeObject.size)){
var el=th.resizeObject[i];
callMethod(this,th,_183[32],[w,h,el]);
i++;
}
var i=0;
while((i < th.resizeArr.size)){
var el=th.resizeArr[i];
el(w,h);
i++;
}

};
_lib_MoviesReader4[_183[155]]=function(){
callMethod(this,this.evm,_183[101]);

};
vm.registerClass(_183[156],_183[1],_lib_MoviesReader4);
})(window);


(function(window){
var _lib_TweenGroup={};
_lib_TweenGroup["ctor"]=function(){
this._tweens={};
this._tweensAddedDuringUpdate={};
this.tweenCB=null;

};
_lib_TweenGroup[_183[157]]=function(){
return this._tweens;

};
_lib_TweenGroup[_183[158]]=function(){
this._tweens={};

};
_lib_TweenGroup[_183[8]]=function(tween){
var idd=tween._id;
this._tweens[idd]=tween;
this._tweensAddedDuringUpdate[idd]=tween;

};
_lib_TweenGroup[_183[159]]=function(tween){
var idd=tween._id;
delete this._tweens[idd];
delete this._tweensAddedDuringUpdate[idd];

};
_lib_TweenGroup[_183[162]]=function(time,preserve){
var tweenIds=[];
for(var n in this._tweens){
callMethod(this,tweenIds,_183[6],[n]);

}
if((tweenIds.size == 0)){
if(GLOBAL.TWEEN.fpsMaster){
callMethod(this,GLOBAL.TWEEN.fpsMaster,_183[160]);
GLOBAL.TWEEN.fpsMaster=null;

}
return !1;

}
time=(time != 0) ? time : callMethod(this,GLOBAL.TWEEN,_183[161]);
;
while((tweenIds.size > 0)){
this._tweensAddedDuringUpdate={};
var i=0;
while((i < tweenIds.size)){
var idd=tweenIds[i];
var tween=this._tweens[idd];
var isUpd=callMethod(this,tween,_183[162],[time]);
if(tween && !isUpd){
tween._isPlaying=!1;
if(!preserve){
delete this._tweens[idd];

}

}
i++;
}
var ar2=[];
for(var n in this._tweensAddedDuringUpdate){
callMethod(this,ar2,_183[6],[n]);

}
tweenIds=ar2;

}
return !0;

};
vm.registerClass(_183[163],_183[37],_lib_TweenGroup);
})(window);


(function(window){
var _lib_Tween={};
_lib_Tween["ctor"]=function(object,group){
var gl=GLOBAL;
this._object=object;
this._valuesStart={};
this._valuesEnd={};
this._valuesStartRepeat={};
this._duration=1000;
this._repeat=0;
this._repeatDelayTime=null;
this._yoyo=!1;
this._isPlaying=!1;
this._reversed=!1;
this._delayTime=0;
this._startTime=null;
this.easingFunction=gl.TWEEN.Easing.Linear.None;
this._interpolationFunction=gl.TWEEN.Interpolation.Linear;
this._chainedTweens=[];
this._onStartCallback=null;
this._onStartCallbackFired=!1;
this.onUpdate=null;
this.onComplete=null;
this._onStopCallback=null;
if(!group){
group=gl.TWEEN;

}
this._group=group;
this._id=callMethod(this,gl.TWEEN,_183[164]);
if(!gl.TWEEN.fpsMaster){
var fps=ctorObject(lang.utils.FpsMaster);
fps.framerate=30;

callMethod(this,fps,_183[9]);
var cbFps=function(){
callMethod(this,gl.TWEEN,_183[162],[0]);

};
callMethod(this,fps,_183[165],[cbFps]);
gl.TWEEN.fpsMaster=fps;

}

};
_lib_Tween[_183[168]]=function(){
var th=this;
var gTWEEN=ctorObject(_183[163]);
gTWEEN.Easing={Linear:{None:function(k){
return k;

}},Quadratic:{In:function(k){
return (k * k);

},Out:function(k){
return (k * (2 - k));

},InOut:function(k){
var kk=(k * 2);
k=kk;
if((kk < 1)){
return ((0.5 * k) * k);

}
--k;return (-0.5 * ((k * (k - 2)) - 1));

}}};
gTWEEN.Interpolation={Utils:{Linear:function(p0,p1,t){
return (((p1 - p0) * t) + p0);

}},Linear:function(v,k){
var m=(v.size - 1);
var f=(m * k);
var i=callMethod(this,Math,_183[166],[f]);
var fn=gTWEEN.Interpolation.Utils.Linear;
if((k < 0)){
return fn(v[0],v[1],f);

}
if((k > 1)){
var v1=(m - 1);
return fn(v[m],v[v1],(m - f));

}
var v2=((i + 1) > m) ? m : (i + 1);
return fn(v[i],v[v2],(f - i));

}};
callMethod(this,VM,_183[143],[_183[167],gTWEEN]);
GLOBAL.TWEEN.fpsMaster=null;
GLOBAL.TWEEN._nextId=0;
GLOBAL.TWEEN.nextId=function(){
GLOBAL.TWEEN._nextId+=1;
return GLOBAL.TWEEN._nextId;

};
GLOBAL.TWEEN.now=function(){
var v2=callMethod(this,System.performance,_183[161]);
return v2;

};

};
_lib_Tween[_183[114]]=function(properties,duration,onUpdate,onComplete){
this._valuesEnd=properties;
if(duration){
this._duration=duration;

}
var sz=arguments.length;
if((sz > 2)){
this.onUpdate=onUpdate;

}
if((sz > 3)){
this.onComplete=onComplete;

}

};
_lib_Tween[_183[170]]=function(time){
callMethod(this,this._group,_183[8],[this]);
this._isPlaying=!0;
this._onStartCallbackFired=!1;
this._startTime=time ? time : callMethod(this,GLOBAL.TWEEN,_183[161]);
;
this._startTime=(this._startTime + this._delayTime);
for(var property in this._valuesEnd){
var v1=this._valuesEnd[property];
var r3=!0;
if(checkIs(v1,_183[82])){
if((v1.size > 0)){
var a2=[this._object[property]];
this._valuesEnd[property]=callMethod(this,a2,_183[169],[v1]);

}else{
r3=!1;

}

}
if(r3){
if(checkIn(this._object,property)){
var v2=this._object[property];
this._valuesStart[property]=v2;
if(!checkIs(v2,_183[82])){
this._valuesStart[property]*=1;

}
this._valuesStartRepeat[property]=this._valuesStart[property];

}

}

}

};
_lib_Tween[_183[160]]=function(){
if(!this._isPlaying){
return;

}
callMethod(this,this._group,_183[159],[this]);
this._isPlaying=!1;
if((this._onStopCallback !== null)){
callMethod(this,this,_183[171],[this._object]);

}
callMethod(this,this,_183[172]);

};
_lib_Tween[_183[173]]=function(){
callMethod(this,this,_183[162],[(this._startTime + this._duration)]);

};
_lib_Tween[_183[172]]=function(){
var i=0;
while((i < this._chainedTweens.size)){
var el=this._chainedTweens[i];
callMethod(this,el,_183[160]);
i++;
}

};
_lib_Tween[_183[174]]=function(g){
this._group=g;

};
_lib_Tween[_183[175]]=function(amount){
this._delayTime=amount;

};
_lib_Tween[_183[176]]=function(times){
this._repeat=times;

};
_lib_Tween[_183[177]]=function(amount){
this._repeatDelayTime=amount;

};
_lib_Tween[_183[178]]=function(yy){
this._yoyo=yy;
return this;

};
_lib_Tween[_183[179]]=function(inter){
this._interpolationFunction=inter;

};
_lib_Tween[_183[180]]=function(){
this._chainedTweens=arguments;

};
_lib_Tween[_183[181]]=function(callback){
this._onStartCallback=callback;

};
_lib_Tween[_183[182]]=function(callback){
this._onStopCallback=callback;

};
_lib_Tween[_183[162]]=function(time){
if((time < this._startTime)){
return !0;

}
if(!this._onStartCallbackFired){
if(this._onStartCallback){
callMethod(this,this,_183[183],[this._object]);

}
this._onStartCallbackFired=!0;

}
var elapsed=(castInt((time - this._startTime)) / this._duration);
if((this._duration == 0)){
elapsed=1;

}else if((elapsed > 1)){
elapsed=1;

}

var value=callMethod(this,this,_183[184],[elapsed]);
for(var property in this._valuesEnd){
if(checkIn(this._valuesStart,property)){
var start=this._valuesStart[property];
var end=this._valuesEnd[property];
if(checkIs(end,_183[82])){
this._object[property]=callMethod(this,this,_183[185],[end,value]);

}else{
if(checkIs(end,_183[109])){
var ch=callMethod(this,end,_183[116],[0]);
var v4=parseFloat(end);
if((ch == _183[186]) || (ch == _183[187])){
end=(start + v4);

}else{
end=v4;

}

}
var isNum=!1;
if(checkIs(end,_183[188])){
isNum=!0;

}else if(checkIs(end,_183[23])){
isNum=!0;

}

if(isNum){
this._object[property]=(start + ((end - start) * value));

}

}

}

}
if(this.onUpdate){
callMethod(this,this,_183[189],[this._object]);

}
if((elapsed == 1)){
if((this._repeat > 0)){
this._repeat-=1;
for(var property in this._valuesStartRepeat){
var v5=this._valuesEnd[property];
if(checkIs(v5,_183[109])){
var a5=parseFloat(v5);
this._valuesStartRepeat[property]=(this._valuesStartRepeat[property] + a5);

}
if(this._yoyo){
var tmp=this._valuesStartRepeat[property];
this._valuesStartRepeat[property]=this._valuesEnd[property];
this._valuesEnd[property]=tmp;

}
this._valuesStart[property]=this._valuesStartRepeat[property];

}
if(this._yoyo){
this._reversed=this._reversed ? !1 : !0;

}
if(this._repeatDelayTime){
this._startTime=(time + this._repeatDelayTime);

}else{
this._startTime=(time + this._delayTime);

}
return !0;

}else{
if(this.onComplete){
callMethod(this,this,_183[190],[this._object]);

}
var sz2=this._chainedTweens.size;
var i=0;
while((i < sz2)){
var el=this._chainedTweens[i];
callMethod(this,el,_183[170],[(this._startTime + this._duration)]);
i++;
}
return !1;

}

}
return !0;

};
vm.registerClass(_183[191],_183[37],_lib_Tween);
})(window);
}
cl.isLib=true;
cl.instanceClass="MoviesReader4_5667656";
pClass(cl);

})(window);
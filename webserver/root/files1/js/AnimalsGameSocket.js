// исходный код https://github.com/animalsgame/vm2_apps/tree/main/lib_AnimalsGameSocket

(function(window){
function cl(vm){
var _156=[null,"on","off","clearEvents","hasEvent","apply","packetsCB","get","emit","close","closeHandler","clear","noStream","addUserCB","removeUserCB","Array","push","runE","sendByStream","send","join","leave","clearNoLeave","AnimalsGameStream","","lang.net.Socket","Config","CONNECT_HOST","animals-game.ru","web","wsApp","noapp","noAppCB","shift","addService","system","main","cbSocket","stream","randomInt","getUniqID","closeStreams","connected","data","lang.utils.ByteArray","readObject","String","decode","run","error","disconnect","connect","Connect","Function","sendData","isConnected","writeObject","encode","createStream","AnimalsGameSocket","AnimalsGameSocket657658569","lang.display.Sprite"];
var GLOBAL=vm.GLOBAL;
var checkIn=vm.checkIn;
var checkIs=vm.checkIs;
var setProp=vm.setProp;
var callMethod=vm.callMethod;
var ctorObject=vm.ctorObject;
(function(window){
var _AnimalsGameStream={};
_AnimalsGameStream["ctor"]=function(id,socket){
this.id=id;
this.connect=socket;
this.id=id;
this.noStream=_156[0];
this.addUserCB=0;
this.removeUserCB=0;
this.closeHandler=0;
this.packetsCB=_156[0];
this.isLeave=false;
this.ev={};

};
_AnimalsGameStream[_156[1]]=function(t,cb){
this.ev[t]=cb;

};
_AnimalsGameStream[_156[2]]=function(t){
if(checkIn(this.ev,t)){
delete this.ev[t];

}

};
_AnimalsGameStream[_156[3]]=function(){
this.ev={};

};
_AnimalsGameStream[_156[4]]=function(t){
if(checkIn(this.ev,t)){
return true;

}
return false;

};
_AnimalsGameStream[_156[8]]=function(t,args){
if(checkIn(this.ev,t)){
var cb=this.ev[t];
callMethod(this,cb,_156[5],[this,args]);
if((this.packetsCB != _156[0])){
callMethod(this,this,_156[6],[_156[7],t,args]);

}

}

};
_AnimalsGameStream[_156[17]]=function(t,o){
if((t == _156[9])){
if((this.closeHandler != 0)){
callMethod(this,this,_156[10]);

}
callMethod(this,this,_156[11]);

}else if((t == 0)){
if((this.packetsCB != _156[0])){
callMethod(this,this,_156[6],[_156[7],_156[12],_156[0]]);

}
if((this.noStream != _156[0])){
callMethod(this,this,_156[12]);

}

}

if((callMethod(this,this,_156[4],[t]) == true)){
if((t == -2)){
if((this.addUserCB != 0)){
callMethod(this,this,_156[13],[o]);

}

}else if((t == -3)){
if((this.removeUserCB != 0)){
callMethod(this,this,_156[14],[o]);

}

}else{
var args=[];
if((o != _156[0])){
if((checkIs(o,_156[15]) == false)){
o=[o];

}
var i=0;
while((i < o.size)){
callMethod(this,args,_156[16],[o[i]]);
i++;
}

}
callMethod(this,this,_156[8],[t,args]);

}


}

};
_AnimalsGameStream[_156[19]]=function(){
var t=arguments[0];
var prms=[1,t];
var i=1;
while((i < arguments.length)){
callMethod(this,prms,_156[16],[arguments[i]]);
i++;
}
callMethod(this,this.connect,_156[18],[this.id,prms]);
if((this.packetsCB != _156[0])){
callMethod(this,this,_156[6],[_156[19],t,prms]);

}

};
_AnimalsGameStream[_156[20]]=function(o){
callMethod(this,this.connect,_156[18],[this.id,[2]]);

};
_AnimalsGameStream[_156[21]]=function(){
callMethod(this,this.connect,_156[18],[this.id,[3]]);

};
_AnimalsGameStream[_156[11]]=function(){
var stt=this.connect.streams;
var idd=this.id;
if(checkIn(stt,idd)){
delete stt[idd];

}
callMethod(this,this,_156[21]);
this.noStream=_156[0];
this.addUserCB=_156[0];
this.removeUserCB=_156[0];
this.closeHandler=_156[0];

};
_AnimalsGameStream[_156[22]]=function(){
var stt=this.connect.streams;
var idd=this.id;
if(checkIn(stt,idd)){
delete stt[idd];

}
this.noStream=_156[0];
this.addUserCB=_156[0];
this.removeUserCB=_156[0];
this.closeHandler=_156[0];

};
vm.registerClass(_156[23],_156[24],_AnimalsGameStream);
})(window);


(function(window){
var _AnimalsGameSocket={};
_AnimalsGameSocket["ctor"]=function(appname,host,port){
this.host=host;
this.port=port;
this.appname=appname;
this.datacb=_156[0];
this.noAppCB=_156[0];
var th=this;
var sock=ctorObject(_156[25]);
if(checkIn(GLOBAL,_156[26])){
if(checkIn(GLOBAL.Config,_156[27])){
if((GLOBAL.Config.CONNECT_HOST == _156[28])){
sock.secure=true;

}

}

}
this.isWeb=true;
this.isSendBinary=false;
if((System.platform.type != _156[29])){
this.isWeb=false;

}else{
this.isSendBinary=true;

}
this.sock=sock;
this.isConnect=false;
this.isClose=false;
this.cbIds={};
this.cmdsObj={};
this.streams={};
this.services={};
this.type=_156[24];
if((this.appname != _156[0])){
if((this.appname.size > 0)){
this.type=_156[30];

}

}
var service0={run:function(arr){
var tt=arr[1];
if((tt == _156[31])){
if((th.noAppCB != _156[0])){
callMethod(this,th,_156[32]);

}

}

}};
var service1={run:function(arr){
var params=arr[1];
var cid=arr[2];
if(checkIn(th.cbIds,cid)){
var cb=th.cbIds[cid];
callMethod(this,cb,_156[5],[th,params]);
delete th.cbIds[cid];

}

}};
var service2={run:function(arr){
var aa=arr[1];
var t=callMethod(this,aa,_156[33]);
if(checkIn(th.cmdsObj,t)){
var cbb=th.cmdsObj[t];
callMethod(this,cbb,_156[5],[_156[0],aa]);

}

}};
var service3={run:function(arr){
var args=arr[1];
var streamid=callMethod(this,args,_156[33]);
var res=callMethod(this,args,_156[33]);
if(checkIn(th.streams,streamid)){
var stream=th.streams[streamid];
var ev=callMethod(this,args,_156[33]);
callMethod(this,stream,_156[17],[res,ev]);

}

}};
callMethod(this,this,_156[34],[0,_156[35],service0]);
callMethod(this,this,_156[34],[1,_156[36],service1]);
callMethod(this,this,_156[34],[2,_156[37],service2]);
callMethod(this,this,_156[34],[3,_156[38],service3]);

};
_AnimalsGameSocket[_156[34]]=function(id,name,o){
o.id=id;
o.name=name;
this.services[id]=o;

};
_AnimalsGameSocket[_156[1]]=function(t,cb){
this.cmdsObj[t]=cb;

};
_AnimalsGameSocket[_156[40]]=function(){
var v=callMethod(this,Math,_156[39]);
if(checkIn(this.cbIds,v)){
return callMethod(this,this,_156[40]);

}
return v;

};
_AnimalsGameSocket[_156[41]]=function(){
for(var n in this.streams){
var el=this.streams[n];
callMethod(this,el,_156[17],[_156[9]]);

}

};
_AnimalsGameSocket[_156[52]]=function(cbok,cberr,cbdisconnect){
var th=this;
callMethod(this,this.sock,_156[1],[_156[42],function(){
th.isConnect=true;
cbok();

}]);
callMethod(this,this.sock,_156[1],[_156[43],function(o){
var arr=o;
if(checkIs(arr,_156[44])){
arr=callMethod(this,arr,_156[45]);

}else if(checkIs(arr,_156[46])){
arr=callMethod(this,JSON,_156[47],[arr]);

}

var c=arr[0];
if(checkIn(th.services,c)){
var serviceObj=th.services[c];
callMethod(this,serviceObj,_156[48],[arr]);

}

}]);
callMethod(this,this.sock,_156[1],[_156[49],function(){
th.isConnect=false;
cberr();

}]);
callMethod(this,this.sock,_156[1],[_156[50],function(){
th.isConnect=false;
th.isClose=true;
callMethod(this,th,_156[41]);
cbdisconnect();

}]);
callMethod(this,this.sock,_156[51],[this.host,this.port]);

};
_AnimalsGameSocket[_156[19]]=function(){
if((this.isConnect == true)){
var c=_156[24];
var isFunc=false;
var arg1=arguments[0];
var n=0;
if(checkIs(arg1,_156[53])){
isFunc=true;
n=2;
c=arguments[1];

}else{
n=1;
c=arg1;

}
var rnd=0;
if((isFunc == true)){
rnd=callMethod(this,this,_156[40]);
this.cbIds[rnd]=arg1;

}
var paramsarr=[];
if((this.type == _156[30])){
callMethod(this,paramsarr,_156[16],[this.appname]);

}
callMethod(this,paramsarr,_156[16],[1]);
callMethod(this,paramsarr,_156[16],[c]);
callMethod(this,paramsarr,_156[16],[rnd]);
var args=[];
var i=n;
while((i < arguments.length)){
callMethod(this,args,_156[16],[arguments[i]]);
i++;
}
if((args.size > 0)){
callMethod(this,paramsarr,_156[16],[args]);

}
callMethod(this,this,_156[54],[paramsarr]);

}

};
_AnimalsGameSocket[_156[55]]=function(){
if((this.isConnect == true)){
return true;

}
return false;

};
_AnimalsGameSocket[_156[54]]=function(o){
if((this.isSendBinary == true)){
var ba=ctorObject(_156[44]);
callMethod(this,ba,_156[56],[o]);
callMethod(this,this.sock,_156[19],[ba]);

}else{
var str=callMethod(this,JSON,_156[57],[o]);
callMethod(this,this.sock,_156[19],[str]);

}

};
_AnimalsGameSocket[_156[18]]=function(streamid,params){
var prms=[streamid];
if((params != _156[0])){
var i=0;
while((i < params.size)){
callMethod(this,prms,_156[16],[params[i]]);
i++;
}

}
var p=[];
if((this.type == _156[30])){
callMethod(this,p,_156[16],[this.appname]);

}
callMethod(this,p,_156[16],[3]);
callMethod(this,p,_156[16],[prms]);
callMethod(this,this,_156[54],[p]);

};
_AnimalsGameSocket[_156[58]]=function(id){
var s=ctorObject(_156[23],[id,this]);
this.streams[id]=s;
return s;

};
vm.registerClass(_156[59],_156[24],_AnimalsGameSocket);
})(window);


(function(window){
var _AnimalsGameSocket657658569={};
_AnimalsGameSocket657658569["ctor"]=function(){

};
vm.registerClass(_156[60],_156[61],_AnimalsGameSocket657658569);
})(window);
}
cl.isLib=true;
cl.instanceClass="AnimalsGameSocket657658569";
pClass(cl);

})(window);
function GameRoomsListMaster(){
var th=this;
this.stream=srv.createStream();
this.id=this.stream.id;
this.users=[];
this.tm1=null;
this.stream.onClose=function(){
//if(this.tm1!=null)clearInterval(this.tm1);
trace('close stream GameRoomsListMaster');
};

this.stream.setInOutHanler(function(connect,isIn){
var u=connect.user;
if(isIn){
var r=th.addUser(u.id,connect);
trace('user in GameRoomsListMaster '+u.id,r);

var oo={isRmvFlag:true};
if(u.isBoarKonkurs())oo.isRmvFlag=false;
th.stream.sendConnect(connect,'init',[oo]);
}else{
var r=th.removeUser(connect);
trace('user out GameRoomsListMaster '+u.id,r);
}
});

this.stream.on('getList',function(tt){
var u=this["user"];
if(u!=null){
    
var gt=null;
if(tt=='def')gt='def';
else if(tt=='lapki')gt='lapki';
else if(tt=='room')gt='myroom';

var isCheckActive=true;
if(u.isBoarKonkurs())isCheckActive=false;
var a=th.getGameRoomsListType(gt,isCheckActive);
th.sendEventByUserOne(u,'getListAll',a);
//console.log(t);
}
});

//trace('create GameRoomsListMaster stream '+th.id);
}

GameRoomsListMaster.prototype.init=function(){
var th=this;
};

GameRoomsListMaster.prototype.sendEventByUserOne=function(u,t,o){
var th=this;
if(u!=null){
var aa=[{cmd:t,data:[o]}];
for (var i = 0; i < u.connectsList.length; i++) {
var c=u.connectsList[i];
if(c!=null && c.connect!=null){
th.stream.sendConnect(c.connect,'ev1',aa);
}
}
//th.stream.sendConnect(u.connect,'ev1',[ob]);
}
};

GameRoomsListMaster.prototype.sendEvent=function(t,o){
var th=this;
var ob={cmd:t,data:[o]};
th.stream.send('ev1',[ob]);
};

GameRoomsListMaster.prototype.addUser=function(id,connect){
var isFind=false;
for (var i = 0; i < this.users.length; i++) {
var u=this.users[i];
if(u!=null && u==connect){
isFind=true;
break;
}
}
if(!isFind){
this.users.push(connect);
return true;
}
return false;
};

GameRoomsListMaster.prototype.removeUser=function(connect){
var findPos=-1;
for (var i = 0; i < this.users.length; i++) {
var u=this.users[i];
if(u!=null && u==connect){
findPos=i;
break;
}
}

if(findPos>-1){
this.users.splice(findPos,1);
return true;
}
return false;
};


GameRoomsListMaster.prototype.getGameRoomInfoObj1=function(r){
if(r!=null){
var ts=getTimestamp();
var tm=r.waitTimeStart-ts;
if(tm<=0)tm=0;
var nm='';
var usersIds=r.getRoomUsersIds();
var mapLevel=0;
var t='';
var mapid=0;
var gt=r.gameType;
if(gt=='def')t='def';
else if(gt=='lapki')t='lapki';
else if(gt=='myroom')t='room';

if(r.map!=null){
mapLevel=r.map.mapLevel;
mapid=r.map.id;
}
if(r.roomName!=null && r.roomName.length>0)nm=r.roomName;
var ob={name:nm,t:t,stream:r.stream.id,mapLevel:mapLevel,mapid:mapid,waitTime:tm,users:usersIds};
return ob;
}
return null;
};

GameRoomsListMaster.prototype.getGameRoomsListType=function(gt,isCheckActive){
var arr=[];
if(typeof isCheckActive=='undefined')isCheckActive=true;
if(gt!=null){
var ts=getTimestamp();
for (var i = 0; i < gameRoomsList.length; i++) {
var el=gameRoomsList[i];
if(el!=null && el.gameType==gt/* && !el.isPlayRoom && el.isActive()*/){
var v2=true;
if(isCheckActive){
if(!el.isPlayRoom && el.isActive()){
}else{
v2=false;
}
}else if(gt!='def'){
if(!el.isPlayRoom && el.isActive()){
}else{
v2=false;
}
}
if(v2){
var ob=this.getGameRoomInfoObj1(el);
if(ob!=null){
arr.push(ob);
}
}
}
}
}
return arr;
};

GameRoomsListMaster.prototype.sendEventZabegGameRoom=function(t,room){
if(room!=null){
var ob=this.getGameRoomInfoObj1(room);
if(ob!=null){
if(t=='add'){
this.sendEvent('addZabeg',ob);
}else if(t=='remove'){
this.sendEvent('removeZabeg',{t:ob.t,stream:room.stream.id});
}
}
}
};
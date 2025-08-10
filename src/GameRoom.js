function initStreamGameRoom(){
var th=this;

th.sendChatMsg=function(u,msg){
	if(u!=null && !u.isBan()){
	var userid=u.id;
	if(msg.length>0){
	msg=SubstrTxtChatSize(msg,maxSymbolsWorldChatMsg);
	var msg2=correctChatMessage(msg);
	//if(msg!=msg2)msg=msg2;
	var isFlood=CheckIsFloodMsg(msg);
	if(msg!=msg2)isFlood=true;
	msg=msg.trim();
	if(!isFlood){
	if(msg.length>0){
	/*if(u.isBoarKonkurs()){
	
	}else{*/
	//u.pushMiniChatMsg(msg);
	//}
	
	//var numsUsers=this.stream.CountClients();
	//if(numsUsers>1){
	//if(!u.isBoarKonkurs())u.pushMiniChatMsg(msg);
	//}
	if(u.isBoarKonkurs() && th.gameType=='def'){
	
	}else{
	u.pushMiniChatMsg(msg);
	statsUsers.plusCount('minichat_msgs',u.id);
	}
	this.stream.send("chatMsg",[userid,msg]);
	}
	}else{
	/*if(u.isBoarKonkurs()){
	}else{*/
	/*msg='Здесь был флуд';
	u.pushMiniChatMsg(msg);
	//}
	this.stream.send("chatMsg",[userid,msg]);*/
	}
	}
	}
};


th.stream.on('setViewer',function(){
var u=this["user"];
var userid=u["id"];
var uu=th.users[userid];
if(u!=null && uu!=null && !uu.isViewerMode && uu.item3==0){
/*var isAccess=false;
if(u.isBoarKonkurs())isAccess=true;
else if(u.isTester())isAccess=true;

if(isAccess){*/
uu.item1=0;
uu.isViewerMode=true;
th.stream.send('setViewerMode',[userid]);
/*}else{
for (var i = 0; i < u.connectsList.length; i++) {
var c=u.connectsList[i];
if(c!=null && c.connect!=null){
th.stream.sendConnect(c.connect,"popup",['noViewerAccess']);
}
}
}*/
}
});

th.stream.on("resetPersPos",function(isSend){
var u=this["user"];
var userid=u["id"];
var uu=th.users[userid];
if(th.map!=null && uu!=null){
if(uu.item3==0){
uu.item1=0;
//uu.item2=0;
//var prms=[userid,'no',map.pers.x,map.pers.y];
//th.stream.send('move',prms);
if(th.gameType=='world'){
//var prms=[userid,'no',th.map.pers.x,th.map.pers.y];
if(userid in th.persPosObj)delete th.persPosObj[userid];
if(isSend==true)th.stream.send('resetPersPos',[userid]);
//th.stream.send('move',prms);
}else{
if(isSend==true)th.stream.send('resetPersPos',[userid]);
}

}
}
//th.stream.send("clickItem",prms);
});



this.stream.on("move",function(){
var u=th.users[this.user.id];
if(u!=null){
var u2=this["user"];
var userid=u2["id"];
var prms=[userid];
for (var i = 0; i < arguments.length; i++)prms.push(arguments[i]);
th.stream.sendNoInitiator(this,"move",prms);

if(th.gameType=='world'){
if(arguments.length>2){
var persXY=null;
if(userid in th.persPosObj){
persXY=th.persPosObj[userid];
}else{
persXY=[0,0];
th.persPosObj[userid]=persXY;
}
persXY[0]=arguments[1];
persXY[1]=arguments[2];
}
}

/*var itemm=th.generateRandomGameItemPos(100,0);
for (var i = 0; i < u2.connectsList.length; i++) {
var c=u2.connectsList[i];
if(c!=null && c.connect!=null){
th.stream.sendConnect(c.connect,"addGameItem",[itemm.id,itemm.t,itemm.x,itemm.y]);
}
}*/

}
});

th.stream.on('chatMsg',function(msg){
var u=th.users[this.user.id];
if(u!=null){
if(arguments.length>0){
var u2=this.user;
if(u2!=null && u2.checkAccessAccount('minichat',{connect:this}) && u2.checkAccessM('minichat')){
if(!u2.checkAccessM('chat_capslock')){
msg=msg.toLowerCase();
}
th.sendChatMsg(u2,msg);
}
}
}
});


th.stream.on('chatMsgStart',function(){
var u2=th.users[this.user.id];
var u=this.user;
if(u2 && u && !u.isBan() && u.checkAccessAccount('minichat',{connect:this}) && u.checkAccessM('minichat')){
var userid=u.id;
th.stream.send("chatMsgStart",[userid]);
}
});

}


function GameMap(){
this.id=0;
this.v=0;
this.time=0;
this.scoreValue=0;
this.scoreCount=1;
this.map=null;
this.mapLevel=1;
this.pers={x:0,y:0};
}

GameMap.prototype.parseMap=function(o){
if(o!=null){
if('id' in o)this.id=o['id'];
if('v' in o)this.v=o['v'];
if('time' in o)this.time=o['time'];
if('mapLevel' in o)this.mapLevel=o['mapLevel'];
if('scoreValue' in o)this.scoreValue=o['scoreValue'];
if('scoreCount' in o)this.scoreCount=o['scoreCount'];
if(this.scoreCount<1)this.scoreCount=1;
if('pers' in o && typeof o.pers=='object'){
if(typeof o.pers.x=='number')this.pers.x=o.pers.x;
if(typeof o.pers.y=='number')this.pers.y=o.pers.y;
}
this.map=o;
}
};

GameMap.prototype.checkTextMat=function(){
var th=this;
if(th.map && typeof th.map=='object'){
if(th.map.items && Array.isArray(th.map.items)){
var arr=th.map.items;
for (var i = 0; i < arr.length; i++) {
var el=arr[i];
if(el && typeof el=='object'){
if(el.t==15 && 'text' in el && el.text){
var txtV=''+el.text;
if(txtV!=correctChatMessage(txtV)){
return true;
}
}
}
}
}
}
return false;
};

GameMap.prototype.getMapObj=function(){
var o={id:this.id,v:this.v,time:this.time,scoreValue:this.scoreValue,scoreCount:this.scoreCount,map:this.map,mapLevel:this.mapLevel,pers:this.pers};
return o;
};

function GameRoom(id,map,world,gameType){
this.id=id;
this.gameType=gameType;
this.t2=0;
this.map=map;
this.roomName='';
this.persPosObj={};
var th=this;
this.stream = srv.createStream();
//this.stream.room.autoDelete=true;
this.eventsT2Users={};
this.getItemsRoomA={};
this.getItemsRoomB={};
this.getItemsRoomCage={};
this.getItemsRoomTimer={};
this.getItemsUsersAKey={};
this.isClose=false;
this.isEnd2=false;
this.isPlayRoom=false;
this.closeCB=null;
this.allUsersNums=0;
this.allUsersCount=0;
this.winnerUsersPos=0;
this.itemsObj={};
this.gameItemsArr=[];
this.curDogsCageStart=3;
this.curDogsCageStart2=5;
this.startTime=0;
this.tm3=-1;
var timeMap=1;
this.world=world;
if(map!=null && map.time>0){
map.time=60*5;
//if(map.map!=null)map.map.time=map.time;
timeMap=map.time;
}

this.stream.waitTime=startGameRoomWait;
if(MainRoom && MainRoom.users.length<5){
this.stream.waitTime=3;
}

if(gameType=='myroom')this.stream.waitTime=30;

this.waitTimeStart=getTimestamp()+this.stream.waitTime;
this.stream.time=timeMap;
this.stream.setMinMaxClients(minGameRoomUsers,maxGameRoomUsers);
this.stream.start();
this.users={};
this.waitUsersIds={};

this.stream.setInOutHanler(function(connect, inV){
if(inV){
var uid=connect.user.id;
if((uid in th.waitUsersIds)==false){
th.waitUsersIds[uid]=1;
}

if(th.gameType=='def' && th.map && connect.user.isNewVersion){
var mapStr=th.map.getMapObj();
var itemsList=[];
var uuArr=[connect.user.getGameRoomUserObj()];

/*var rm=th.stream.room;
for (var k = 0; k < rm.clients.length; k++) {
var client=rm.clients[k];
var u=client.user;
if(u){
uuArr.push(u.getGameRoomUserObj());
}
}*/

th.stream.sendConnect(connect,"preinit",[mapStr,uuArr,itemsList]);
}
	//trace("add user",connect.user.id);
//th.stream.sendNoInitiator(connect,"addUser",connect.user.id);
}else{
var uid=connect.user.id;
var u=th.users[uid];

if(uid in th.waitUsersIds){
delete th.waitUsersIds[uid];
}

/*var v4=th.isActiveUser(uid);
//console.log('rrrr',v4);
if(th.isPlayRoom && v4){
if(u!=null && u.user!=null){
if(minusGameRoomOpytExit>0)u.user.minusOpyt(minusGameRoomOpytExit);
}
}*/

if(u!=null){
u.out=1;
u.open1=0;

if(u.item3==0 && th.gameType=='def'){
if(map!=null){
var statsInfo=mapsMaster.getMapStatsInfoByID(map.id);
if(statsInfo && !th.isEvent1(null)){
statsInfo.exit+=1;
}
}

if(th.gameType=='def'){
statsUsers.plusCount('game_exit',uid);
}

}

}

th.checkEndRoom();
th.stream.sendNoInitiator(connect,"removeUser",connect.user.id);
//console.log("user out3",th.stream.CountClients());
}
});

this.stream.onPlay=function(){
th.isPlayRoom=true;
th.isClose=true;

var boneItemID=th.getUniqIDItem();
th.addItemIDType(boneItemID,1);
var exitItemID=th.getUniqIDItem();
th.addItemIDType(exitItemID,3);
/*var exitItemID=th.getUniqIDItem();
th.addItemIDType(exitItemID,2);*/
var ufoItemID=0;
/*var ufoItemID=th.getUniqIDItem();
th.addItemIDType(ufoItemID,3);*/

if(th.world!=null && th.world.activeRoom==th)th.world.activeRoom=null;

/*if(th.world!=null){
th.world.sendGameRoomEvent('startRoom',[]);
}*/

var uuArr=[];
var rm=th.stream.room;
for (var k = 0; k < rm.clients.length; k++) {
var client=rm.clients[k];
var u=client.user;
if(u){
//uuArr.push(u.getACUObj1(0));
uuArr.push(u.getGameRoomUserObj());
var dressIds=u.getDressItemsIDS();
th.users[u.id]={item1:0,item2:0,item3:0,out:0,open1:0,isViewerMode:false,user:u,dressIds:dressIds};

statsUsers.plusCount('play_game',u.id);
}
}

th.allUsersNums=uuArr.length;
th.allUsersCount=uuArr.length;
/*var mapObj={};
mapObj['map']=map;
mapObj['users']=uuArr;*/

if(map!=null && th.gameType=='def'){
var statsInfo=mapsMaster.getMapStatsInfoByID(map.id);
if(statsInfo!=null){
statsInfo.play+=1;
}
}

var mapStr=null;
if(map)mapStr=map.getMapObj();//JSON.stringify(map);
var itemsList=[boneItemID,exitItemID,ufoItemID];
var args3=[mapStr,uuArr,itemsList];
var args4=[null,uuArr,itemsList];

for (var k = 0; k < rm.clients.length; k++) {
var client=rm.clients[k];
var u=client.user;
if(u && u.isNewVersion){
th.stream.sendConnect(client,"init",args4);
}else{
th.stream.sendConnect(client,"init",args3);
}
}

//th.stream.send("init",args3);

//console.log(map);

th.tm=0;

th.startTime=getTimestamp();

var isRmv2=true;
/*if(th.gameType=='def'){

}else{
isRmv2=true;
}*/
//if(th.gameType=='myroom')isRmv2=true;
//else if(th.gameType=='lapki')isRmv2=true;
    
if(isRmv2){
gameRoomsListMaster.sendEventZabegGameRoom('remove',th);
th.isEnd2=true;
}

if(th.isEvent1(null)){
    
for(var n in th.users){
var ob5=th.users[n];
if(ob5 && ob5.user && ob5.user.actionNyInfo1){
var nyy=ob5.user.actionNyInfo1;
nyy.c-=1;
}
}
    
    
var rndV=Math.floor(Math.random()*5);
th.tm3=setInterval(function(){
//console.log(rndV);
if(rndV>0){
rndV-=1;
}else{
for(var n in th.users){
var ob5=th.users[n];
var uid=0;
if(ob5.user && th.isEvent1(ob5.user)){
uid=ob5.user.id;
if(ob5 && ob5.user && ob5.user.actionNyInfo1 && !(uid in th.getItemsRoomTimer)){
var nyy=ob5.user.actionNyInfo1;
th.getItemsRoomTimer[uid]=1;
if(nyy.c<=0){
nyy.c=Math.floor(Math.random()*4)+2;
var findEvent=getCurrentEventT2(null);
th.sendUserItemA(ob5.user,false,findEvent);
}
}
}
}
}
},5000);

}

//+timeMap;

/*th.tm3=setInterval(function(){
var itemsIds=[1,2,3,4];
var giftsList=shopMaster.giftsList;
var gobj=giftsList.random();
var itemT=itemsIds[Math.floor(Math.random()*itemsIds.length)];
var itemm=th.generateRandomGameItemPos(200,gobj.itemid);
//itemm.id=gobj.itemid;
th.stream.send("addGameItem",[itemm.id,itemm.t,itemm.t1,itemm.x,itemm.y]);
},3000);
*/
/*th.tm3=setInterval(function(){
var itemsIds=[1,2,3,4];
var itemT=itemsIds[Math.floor(Math.random()*itemsIds.length)];
var itemm=th.generateRandomGameItemPos(itemT,0);
th.stream.send("addGameItem",[itemm.id,itemm.t,itemm.t1,itemm.x,itemm.y]);
},3000);*/

};


/*this.stream.on("resetPersPos",function(){
var u=this["user"];
var userid=u["id"];
var uu=th.users[userid];
if(map!=null && uu!=null){
if(uu.item1==0){
var prms=[userid,'no',map.pers.x,map.pers.y];
th.stream.send('move',prms);
}else{
for (var i = 0; i < u.connectsList.length; i++) {
var c=u.connectsList[i];
if(c!=null && c.connect!=null){
th.stream.sendConnect(c.connect,"popup",['noResetPos']);
}
}
}
}
//th.stream.send("clickItem",prms);
});*/

initStreamGameRoom.call(this);


this.stream.on("persOut",function(){
var u=th.users[this.user.id];
if(u!=null && u.out==0){
var u2=this["user"];
var userid=u2["id"];
u.out=1;
th.stream.send('persOut',[userid]);
}
th.checkEndRoom();
});

this.stream.on("clickItem",function(){
var u=this["user"];
var userid=u["id"];
var nick=u["nick"];
var prms=[userid];
for (var i = 0; i < arguments.length; i++)prms.push(arguments[i]);
var price=0;
if(u.money>=price){
u.minusMoney(price);
th.stream.send("clickItem",prms);
}
});

this.stream.on("getItem",function(idd,arg1){
var u=th.users[this.user.id];
var u2=this["user"];
var userid=u2["id"];
var t=0;
if(u!=null){
if(arguments.length>0 && idd in th.itemsObj){
var itemObj=th.itemsObj[idd];
if('type' in itemObj)t=itemObj['type'];
}
if(t==1){
if(u.item1==0 && u.item2==0){
u.item1=1;
/*u2.gameItems.plusItem(GameItemsUserType.BONE,1);
u2.gameItemsDay.plusItem(GameItemsUserType.BONE,1);*/
th.stream.send("getItem",[userid,1]);

if(th.gameType=='def'){
statsUsers.plusCount('game_keys',userid);
}

if(th.gameType=='def' && !(u2.id in th.getItemsRoomA)){
u2.actionItemsNumsValV+=1;
if(u2.actionItemsNumsValV>=u2.actionItemsNumsRnd){
u2.actionItemsNumsValV=0;
u2.actionItemsNumsRnd=Math.floor(Math.random()*5)+3;

if(u2.isVip()){
var koef=0.3;
u2.actionItemsNumsRnd-=Math.floor(u2.actionItemsNumsRnd*koef);
}

var itemm=th.generateRandomGameItemPos(100,0);


for (var i = 0; i < u2.connectsList.length; i++) {
var c=u2.connectsList[i];
if(c!=null && c.connect!=null){
th.stream.sendConnect(c.connect,"addGameItem",[itemm.id,itemm.t,0,itemm.x,itemm.y]);
}
}


//if(u2.connect!=null)th.stream.sendConnect(u2.connect.connect,"addGameItem",[itemm.id,itemm.t,itemm.x,itemm.y]);
}
th.getItemsRoomA[u2.id]=1;
}

if(th.gameType=='def' && th.isEvent1(u2) && u2.actionNyInfo1 && !(u2.id in th.getItemsRoomB)){
//u2.actionNyInfo1.a=0;
th.getItemsRoomB[u2.id]=1;
u2.actionNyInfo1.a-=1;
if(u2.actionNyInfo1.a<=0){
u2.actionNyInfo1.a=Math.floor(Math.random()*2)+1;
var findEvent=getCurrentEventT2(null);
th.sendUserItemA(u2,false,findEvent);
}
}

if(th.gameType=='def'){
var findEvent2=eventsActionMaster.findEventByType('egg');
if(findEvent2 && !eventsActionMaster.isEnd(findEvent2)){
if(u2.actionEggRnd<=0 && u2.id!=27895){
u2.actionEggRnd=Math.floor(Math.random()*2)+2;
var itemm2=th.generateRandomGameItemPos(210,0);
for (var i = 0; i < u2.connectsList.length; i++) {
var c=u2.connectsList[i];
if(c!=null && c.connect!=null){
th.stream.sendConnect(c.connect,"addGameItem",[itemm2.id,itemm2.t,0,itemm2.x,itemm2.y]);
}
}
}
}
}

/*u2.actionNYItemsRnd=1;
if(th.gameType=='def' && !(u2.id in th.getItemsRoomB) && actObj2){
u2.actionNYItemsRnd-=1;
if(u2.actionNYItemsRnd<=0){
u2.actionNYItemsRnd=Math.floor(Math.random()*2)+2;
var itemm=th.generateRandomGameItemPos(110,0);
for (var i = 0; i < u2.connectsList.length; i++) {
var c=u2.connectsList[i];
if(c!=null && c.connect!=null){
th.stream.sendConnect(c.connect,"addGameItem",[itemm.id,itemm.t,0,itemm.x,itemm.y]);
//th.stream.sendConnect(c.connect,"gameItemPopUp",[itemm.t]);
}
}
}
th.getItemsRoomB[u2.id]=1;
}*/

/*if(th.gameType=='def' && !(u2.id in th.getItemsRoomB) && u2.actionNYLevel<ny2020Prizes.length){
u2.actionNYItemsRnd-=1;
if(u2.actionNYItemsRnd<=0){
u2.actionNYItemsRnd=Math.floor(Math.random()*2)+2;
var itemm=th.generateRandomGameItemPos(105,0);
for (var i = 0; i < u2.connectsList.length; i++) {
var c=u2.connectsList[i];
if(c!=null && c.connect!=null){
th.stream.sendConnect(c.connect,"addGameItem",[itemm.id,itemm.t,0,itemm.x,itemm.y]);
}
}
}
th.getItemsRoomB[u2.id]=1;
}*/


}
}else if(t==2){
/*if(u.item1==1 && u.item2==0){
u.item2=1;
u.open1=1;
//var id3=th.getUniqIDItem();
//th.addItemIDType(id3,3);
th.stream.send("getItem",[userid,2,arg1]);
//th.stream.send("getItem",[userid,2,id3]);
}*/
}else if(t==3){
if(u.item1==1 && u.item3==0){
//if(u.open1==1 || (u.item1==1 && u.item2==1 && u.item3==0)){
u.item3=1;
u.open1=0;
//th.removeItemIDType(idd);
/*u2.gameItems.plusItem(GameItemsUserType.BUDKA,1);
u2.gameItemsDay.plusItem(GameItemsUserType.BUDKA,1);*/
var ts=getTimestamp();
/*var endTime=th.startTime-ts;
var fullTime=timeMap-2;
var cur_time=fullTime-endTime;*/
//var time_opyt = parseInt(formulaMainZabeg.GetTimeOpyt(0, fullTime, cur_time));
var bonus_opyt=0;

var opytV2=opytWinnerUser;

var dogsCountV=th.curDogsCageStart;

var opyt_top=dogsCountV;


if(th.map!=null && th.map.mapLevel>=mapLevelsUsers2){
opytV2=opytWinnerUser2;
opyt_top=th.curDogsCageStart2;
th.curDogsCageStart2-=1;
if(th.curDogsCageStart2<=1)th.curDogsCageStart2=1;
}

var opyt_prize=Math.floor(th.allUsersNums/th.allUsersCount*opytV2);
var winnerMoney=0;
//var winnerMoney=Math.floor(th.allUsersNums/th.allUsersCount*winnerUserLapkiV);
var prizeOpytTopBonus=0;
var bonusOpytDress=0;
if(th.gameType=='def'){
var koefBonusTop=(bonusTopOpytData.step*bonusTopOpytData.lastLevel)/100;
prizeOpytTopBonus=Math.floor(opyt_prize*koefBonusTop);

if(u.dressIds){
var percDressBonus=dressMaster.getBonusPercentByItemsIDS(u.dressIds);
if(percDressBonus>0){
var allBonusDress=Math.floor(opyt_prize*(percDressBonus/100));
bonusOpytDress=allBonusDress;
//console.log(percDressBonus,opyt_prize,allBonusDress);
}
}

}


if(th.winnerUsersPos<3){
var moneyv2=winnerUserLapkiV;
if(th.map!=null && th.map.mapLevel>=mapLevelsUsers2){
moneyv2=winnerUserLapkiV2;
}
winnerMoney=Math.floor(th.allUsersNums/th.allUsersCount*moneyv2);
}

if(th.gameType!='def'){
winnerMoney=0;
opyt_prize=0;
}

if(winnerMoney>0){
u2.plusMoney(winnerMoney);
}
/*if(u2.pers==1){
bonus_opyt=Math.floor(opyt_prize*0.15);
}*/

if(u2.vip==1){
bonus_opyt=4*u2.level;
}else if(u2.vip==2){
bonus_opyt=2*u2.level;
}
//var opyt_prize = parseInt(formulaMainZabeg.GetFullOpytFormula(0, th.allUsersNums, fullTime,endTime));

var lvlV=u2.level;
if(lvlV<6){
bonus_opyt+=30;
}

if(u2.vip==1){
var q5=Math.round(Math.random()*2)+2;
dogsCountV+=q5;
//dogsCountV+=2;
//dogsCountV=dogsCountV*2;
}

if(th.gameType!='def'){
dogsCountV=0;
bonus_opyt=0;

}

if(dogsCountV>0)
u2.plusDogs(dogsCountV);

if(th.gameType=='def'){

var prefixAuth=u2.getPrefixAuth();
if(prefixAuth=='vk'){
var loginUser=u2.login.substr(2);
var missionid=3;
if(th.curDogsCageStart==3)missionid=5;
else if(th.curDogsCageStart==2)missionid=4;
if(!u2.checkMissionVK(missionid)){
if(vkNotifyApi!=null)vkNotifyApi.setMission(loginUser,missionid,function(){
u2.addMissionVK(missionid);
});    
}
}
}

bonus_opyt+=prizeOpytTopBonus;
bonus_opyt+=bonusOpytDress;
var allOpyt=bonus_opyt+opyt_prize;
th.winnerUsersPos+=1;
th.allUsersNums-=1;

th.stream.send("getItem",[userid,2,th.curDogsCageStart]);

th.curDogsCageStart-=1;
if(th.curDogsCageStart<=1)th.curDogsCageStart=1;

if(th.gameType=='def'){
if(u2.id>0){
u2.opyt_hour+=opyt_top;
u2.opyt_day+=opyt_top;
topM.addUser(userid,opyt_top);
}
}

if(allOpyt>0)u2.plusOpyt(allOpyt);

if(th.gameType=='def'){
statsUsers.plusCount('game_cage',userid);
}

var updScoreInfo=null;

if(th.gameType=='def'){
if(map!=null){
var statsInfo=mapsMaster.getMapStatsInfoByID(map.id);
if(statsInfo!=null)statsInfo.winner+=1;
var scoreV=ts-th.startTime;
if(u2.id<0)scoreV=0;
if(scoreV>0){
var updScore=mapsMaster.updateMapScoreByID(map.id,map.scoreValue,scoreV,map.scoreCount,userid);
if(updScore){
var moneyV5=winnerNewScoreLapki*updScore.scoreCount;
u2.plusMoney(moneyV5);
updScore.scoreCount+=1;
updScoreInfo={user:userid,score:scoreV,prize:moneyV5};
//th.stream.send("newScore",[userid,scoreV,moneyV5]);
//console.log('new score map '+map.id,userid,scoreV);
}
}
}

if(u2.id in th.getItemsUsersAKey){
var itemsV2=th.getItemsUsersAKey[u2.id];
u2.actionItemsNums+=itemsV2;
delete th.getItemsUsersAKey[u2.id];

var allNums=actionItems1Count*u2.actionItemsNumsPos;
if(u2.actionItemsNums>=allNums){
u2.actionItemsNums=0;
th.sendGiftItemA(u2);
}
u2.updateActionItems1(u2.actionItemsNums,u2.actionItemsNumsPos);
}

}

//th.stream.send("getItem",[userid,3,th.curDogsCageStart,arg1]);
var prms=[bonus_opyt,opyt_prize,dogsCountV,winnerMoney];
th.stream.send('winner',[userid,th.winnerUsersPos,prms,updScoreInfo]);


if(th.gameType=='def' && th.isEvent1(u2) && u2.actionNyInfo1 && !(u2.id in th.getItemsRoomCage)){
th.getItemsRoomCage[u2.id]=1;
u2.actionNyInfo1.b-=1;
if(u2.actionNyInfo1.b<=0){
u2.actionNyInfo1.b=Math.floor(Math.random()*2)+2;
var findEvent=getCurrentEventT2(null);
th.sendUserItemA(u2,true,findEvent);
}
}

if(th.gameType=='def'){
var findEvent2=eventsActionMaster.findEventByType('egg');
if(findEvent2 && !eventsActionMaster.isEnd(findEvent2)){
--u2.actionEggRnd;
}
}

/*if(th.gameType=='def'){
if(map!=null){
var statsInfo=mapsMaster.getMapStatsInfoByID(map.id);
if(statsInfo!=null)statsInfo.winner+=1;

var scoreV=ts-th.startTime;
if(u2.id<0)scoreV=0;
if(scoreV>0){
var updScore=mapsMaster.updateMapScoreByID(map.id,map.scoreValue,scoreV,map.scoreCount,userid);
if(updScore!=null){
var moneyV5=winnerNewScoreLapki*updScore.scoreCount;
u2.plusMoney(moneyV5);
updScore.scoreCount+=1;
th.stream.send("newScore",[userid,scoreV,moneyV5]);
//console.log('new score map '+map.id,userid,scoreV);
}
}
}

}*/

//console.log('winner id',userid,'time opyt:'+time_opyt,'prize:'+opyt_prize,'top:'+opyt_top);
th.checkEndRoom();
}
}
}
});

this.stream.on("getGameItem",function(idd,isHand){
var u=th.users[this.user.id];
var u2=this["user"];
var userid=u2["id"];
if(u!=null){
if(arguments.length>1){
var item=th.getGameItemByID(idd);
if(item!=null){
var args2=[];
var tt=item.t;

var res2=false;
if(isHand==1){
if(tt==100){
    
}else{
//res2=true;
}
}
if(res2){
if(u2.gameMagicHand>0){
u2.gameMagicHand-=1;
th.deleteGameItemByID(idd);
th.getItemFunc2(u2,tt,item);
/*if(tt==1){
u2.gameItems.plusItem(GameItemsUserType.STARS,1);
}else if(tt==2){
u2.gameItems.plusItem(GameItemsUserType.MONEY,1);
}else if(tt==3){
u2.gameItems.plusItem(GameItemsUserType.MONEY_KOSTI,1);
}*/

th.stream.send('getGameItem',[userid,idd,1,tt,args2]);
}else{
th.stream.send('getGameItem',[userid,idd,0,tt,args2]);
}
}else{
th.deleteGameItemByID(idd);

var r1=th.getItemFunc2(u2,tt,item);
if(r1!=null && r1.t==1){
var opytV=r1.v;
args2.push(opytV);
}


th.stream.send('getGameItem',[userid,idd,1,tt,args2]);

}
}
}
}
});

/*this.stream.on("bark",function(){
var u=th.users[this.user.id];
if(u!=null){
var u2=this["user"];
var userid=u2["id"];
var ts=Date.now();
if(ts>=u2.lastBarkTS){
u2.lastBarkTS=ts+500;
var prms=[userid];
u2.gameItemsDay.plusItem(GameItemsUserType.BARK,1);
for (var i = 0; i < arguments.length; i++)prms.push(arguments[i]);
//th.stream.send("bark",prms);
th.stream.sendNoInitiator(this,"bark",prms);
}
}
});*/

th.stream.onClose=function(){
th.endRoom();
if(th.gameType=='def' && !th.isEnd2){
if(th.map!=null && th.stream!=null && th.stream.time<=0){
var statsInfo=mapsMaster.getMapStatsInfoByID(th.map.id);
if(statsInfo!=null)statsInfo.endtime+=1;
//console.log('endtime');
}
}
th.isEnd2=true;
//if(srv.Debug)trace('close stream');
};
}

GameRoom.prototype.getItemFunc2=function(u,tt,item){
var th=this;
if(u!=null){
if(tt==1){ // опыт
var opytV=1+Math.floor(Math.random()*3);
u.plusOpyt(opytV);
return {t:tt,v:opytV};
//u.gameItems.plusItem(GameItemsUserType.STARS,1);
}else if(tt==2){ // лапки
//u.gameItems.plusItem(GameItemsUserType.MONEY,1);
u.plusMoney(1);
}else if(tt==3){ // косточки
//u.gameItems.plusItem(GameItemsUserType.MONEY_KOSTI,1);
u.plusKosti(1);
}else if(tt==4){ // популярность
var vv=1+Math.floor(Math.random()*3);
u.plusPopular(vv);
return {t:tt,v:vv};
//u.gameItems.plusItem(GameItemsUserType.STARS,1);
}else if(tt==100){

if(!(u.id in th.getItemsUsersAKey))th.getItemsUsersAKey[u.id]=0;
th.getItemsUsersAKey[u.id]+=1;

/*if(!(u.id in th.getItemsUsersAKey))th.getItemsUsersAKey[u.id]=0;
th.getItemsUsersAKey[u.id]+=1;

u.plusActionItems1(1);

var allNums=actionItems1Count*u.actionItemsNumsPos;
if(u.actionItemsNums>=allNums){
u.actionItemsNums=0;
delete th.getItemsUsersAKey[u.id];

u.updateActionItems1(0,u.actionItemsNumsPos);

th.sendGiftItemA(u);
}*/

/*if(u.id>0 && u.isVipHappy1==0){
u.isVipHappy1=1;
var vipTimeEnd=u.vip_end;
var ts=getTimestamp();
if(ts>=u.vip_end){
vipTimeEnd=ts;
}else if(u.vip==0){
vipTimeEnd=ts;
}else if(u.vip!=1){
vipTimeEnd=ts;
}
u.vip=1;
u.vip_end=vipTimeEnd+(60*60*24*3);
u.updateFieldDB('vip',u.vip);
u.sendUpdateUserInfoCurID();
MainRoom.sendMessageEvent('addVipUser',u.id,0,[u.vip]);
MainRoom.sendPrivateMsg(systemUser,u,'Вы получили золотой VIP на 3 дня!');
}

}*/
}else if(tt==105){
u.actionNYItems+=1;
//console.log('aaa',u.actionNYItems);
}else if(tt==110){
u.actionNYItems+=1;
//console.log('aaa',u.actionNYItems);
}else if(tt==200 && item!=null){ // gifts
var giftObj=shopMaster.getItemByItemIDAndType(item.t1,ShopItemsType.GIFTS);
if(giftObj!=null){
var giftid=giftObj.id;
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,-2,u.id,function(res){
//MainRoom.sendGiftMessage(systemUser,u.id,[giftid]);
//u.emit('userEvent','PresentUserGift',-2,giftid);
});
}

}else if(tt==210){
var aa2=[];
/*for (var i = 0; i < shopMaster.giftsList.length; i++) {
var el=shopMaster.giftsList[i];
aa2.push(el);
}*/

for (var i = 0; i < shopMaster.giftsList.length; i++) {
var el=shopMaster.giftsList[i];
if('price_type' in el && el.price_type==1){
aa2.push(el); 
}else if(el.price>=300 && el.price<=10000){
aa2.push(el);
}
}

var giftObj=aa2.random();
if(giftObj!=null){
var giftid=giftObj.id;
var giftObjInfo=null;
if(giftid in shopMaster.giftsObj)giftObjInfo=shopMaster.giftsObj[giftid];
if(u.id>0){
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,-2,u.id,function(res){
MainRoom.sendGiftMessage(systemUser,u.id,[giftid],'за пасхального кролика');
if(giftObjInfo)u.emit('userEvent','PresentUserGift',-2,giftObjInfo);
});
}else{
if(giftObjInfo)u.emit('userEvent','PresentUserGift',-2,giftObjInfo);
}
}
}
}
return null;
};

GameRoom.prototype.sendGiftItemA=function(u){
var aa2=[];
for (var i = 0; i < shopMaster.giftsList.length; i++) {
var el=shopMaster.giftsList[i];
if('price_type' in el && el.price_type==1){
aa2.push(el); 
}else if(el.price>=400 && el.price<=25000){
aa2.push(el);
}
}

if(u){
//console.log(JSON.stringify(aa2));
var giftObj=aa2.random();
if(giftObj!=null){
var giftid=giftObj.id;
var giftObjInfo=null;
if(giftid in shopMaster.giftsObj)giftObjInfo=shopMaster.giftsObj[giftid];
if(u.id>0){
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,-2,u.id,function(res){
MainRoom.sendGiftMessage(systemUser,u.id,[giftid],'за предметы в забегах');
if(giftObjInfo)u.emit('userEvent','PresentUserGift',-2,giftObjInfo);
});
}else{
if(giftObjInfo)u.emit('userEvent','PresentUserGift',-2,giftObjInfo);
}
}
}
};

GameRoom.prototype.isEvent1=function(u2){
/*var actObj2=null;
if(eventType2Obj){
var v88=getEvType2CurrentDay();
if(v88 && u2 && u2.actionNYLevel<v88.length){
actObj2=v88;
}else if(u2==null && v88){
actObj2=v88;
}
}
return actObj2;*/

var findEvent=getCurrentEventT2(null);
if(u2 && findEvent && !isEndCurrentEventT2(u2)){
return true;
}

if(!u2 && findEvent)return true;

return false
};

GameRoom.prototype.sendUserItemA=function(u2,isGetNotify,evInfo){
var th=this;
if(u2){
var itemm=th.generateRandomGameItemPos(110,0);
for (var i = 0; i < u2.connectsList.length; i++) {
var c=u2.connectsList[i];
if(c!=null && c.connect!=null){
if(isGetNotify){
u2.actionNYItems+=1;
th.stream.sendConnect(c.connect,"gameItemPopUp",[itemm.t]);
}else{
var evInfoObj=null;
if(evInfo){
evInfoObj={id:evInfo.id,name:evInfo.name,t:evInfo.tt,type:evInfo.type};
}
th.stream.sendConnect(c.connect,"addGameItem",[itemm.id,itemm.t,0,itemm.x,itemm.y,evInfoObj]);
}
}
}
}
};

GameRoom.prototype.getUniqIDItem=function(){
var rnd=Math.floor(Math.random()*1000000);
if(rnd in this.itemsObj)return this.getUniqIDItem();
return rnd;
};

GameRoom.prototype.getRoomUsersIds=function(){
var a=[];
var rm=this.stream.room;
for (var k = 0; k < rm.clients.length; k++) {
var client=rm.clients[k];
var u=client.user;
if(u!=null){
a.push(u.id);
}
}
return a;
};


GameRoom.prototype.getGameItemByID=function(id){
for (var i = 0; i < this.gameItemsArr.length; i++) {
var el=this.gameItemsArr[i];
if(el.id==id)return el;
}
return null;
};

GameRoom.prototype.addItemByName=function(name,x,y,w,h){
this.stream.send("clickItem",[0,name,x,y,w,h]);
};

GameRoom.prototype.deleteGameItemByID=function(id){
for (var i = 0; i < this.gameItemsArr.length; i++) {
var el=this.gameItemsArr[i];
if(el.id==id){
this.gameItemsArr.splice(i,1);
break;
}
}
};

GameRoom.prototype.getUniqIDGameItem=function(){
var rnd=Math.floor(Math.random()*1000000);
for (var i = 0; i < this.gameItemsArr.length; i++) {
var el=this.gameItemsArr[i];
if(el.id==rnd)return this.getUniqIDGameItem();
}
return rnd;
};

GameRoom.prototype.generateRandomGameItemPos=function(t,t1){
var id=this.getUniqIDGameItem();
if(typeof t1=='undefined')t1=0;
var mapW=980;
var mapH=460;
var xx=Math.floor(Math.random()*mapW);
var yy=Math.floor(Math.random()*mapH);
var o={id:id,t:t,x:xx,y:yy,t1:t1};
this.gameItemsArr.push(o);
return o;
};


GameRoom.prototype.addItemIDType=function(id,type){
this.itemsObj[id]={type:type};
};

GameRoom.prototype.removeItemIDType=function(id){
if(id in this.itemsObj)delete this.itemsObj[id];
};

GameRoom.prototype.isEndRoomUsers=function(){
var v=0;
for(var n in this.users){
var u=this.users[n];
if(u.out==0 && u.item3==0)++v;
}
return v==0;
}

GameRoom.prototype.isActiveUser=function(id){
if(id in this.users){
var u=this.users[id];
if(u!=null){
if(u.out==1)return false;
if(u.item3==1)return false;
}
}
return true;
}

GameRoom.prototype.checkEndRoom=function(){
var c=this.stream.CountClients();
if(c==0 && this.isPlayRoom){
this.stream.remove();
this.endRoom();
}else if(this.isPlayRoom && this.isEndRoomUsers()){
this.stream.remove();
this.endRoom();
}
}


GameRoom.prototype.isActive=function(){
if(this.isPlayRoom && this.stream.CountClients()==0)return false;
return this.isClose==false;
}

GameRoom.prototype.endRoom=function(){
if(!this.isEnd2){
gameRoomsListMaster.sendEventZabegGameRoom('remove',this);
}
this.isEnd2=true;
this.isClose=true;
clearInterval(this.tm);
clearInterval(this.tm3);
this.waitUsersIds={};
if(this.closeCB!=null)this.closeCB(this);
if(this.world!=null&&this.world.activeRoom==this){
console.log("end room "+this.stream.id);
this.world.activeRoom=null;
}
}
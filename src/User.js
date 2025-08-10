function User(connect,obAccount){
this.connect=connect;
if(typeof obAccount=='undefined')obAccount=null;
this.connectsList=[];
this.ob=null;
this.isNewVersion=false;
this.last_active_ts=0;
this.tsChangeNickRainbow=0;
this.tsChangeNickColor=0;
this.miniChatMsgs=[];
this.lastDressItemsIDS=null;
this.dressItems=[];
this.dressItemsIds=[];
this.vm2AuthLoginPass=null;
this.gameItems=new GameUsersItems();
this.gameItemsDay=new GameUsersItems();
this.ufoCurUser=null;
this.ufoInitiatorCl=null;
this.flagsMaster=new FlagsMaster1([]);
this.settingsFlagsMaster=new FlagsMaster1([]);
this.missionVKList=[];

var aRnd=Math.floor(Math.random()*2)+2;
var bRnd=Math.floor(Math.random()*2)+2;
var cRnd=Math.floor(Math.random()*2)+1;
// a - когда берут ключ
// b - когда открывают клетку
// c - сколько забегов ждать
this.actionNyInfo1={a:aRnd,b:bRnd,c:cRnd};
//this.popularItemsList=[];
this.popularLevel=1;
this.popularPos=0;
copyProps(this,userObjectDef);
if(connect!=null)this.addConnect(connect,obAccount);
}

User.prototype.addPopularItemID=function(id){
var isFindItem=false;
for (var i = 0; i < this.popularItemsList.length; i++) {
var idd=this.popularItemsList[i];
if(idd==id){
isFindItem=true;
break;
}
}
if(!isFindItem){
this.popularItemsList.push(id);
}
};

User.prototype.getPopularInfo1=function(level,v){
var pos=0;
var isEnd=false;
if(level>popularList.length)level=popularList.length;
if((level-1)<popularList.length){
var infoOb=popularList[level-1];
if(infoOb!=null){
for (var i = 0; i < infoOb.length; i++) {
var el=infoOb[i];
if(v>=el.v)pos+=1;
}
if(pos>=infoOb.length){
pos=infoOb.length-1;
isEnd=true;
}
return {pos:pos,o:infoOb[pos],isEnd:isEnd};
}
}
return null;
};

User.prototype.getPopularValArr=function(a){
var v=0;
if(a!=null){
if(a.length>0){
var el=a[a.length-1];
v=el.v;
}
/*for (var i = 0; i < a.length; i++) {
var el=a[i];
v+=el.v;
}*/
}
return v;
}

User.prototype.getPopularInfo2=function(level,v){
if(level>popularList.length)level=popularList.length;
var lvl=level;
var allV=v;
var val=0;
var lvl2=level-1;
if(lvl2<=0)lvl2=0;
for (var k = lvl2; k < popularList.length; k++){
var infoOb=popularList[k];
var pp=k+1;
var vv=this.getPopularValArr(infoOb);
//console.log('aa',vv,pp,v);
if(allV>vv){
lvl=pp+1;
/*if(lvl<popularList.length){
val=this.getPopularValArr(popularList[k+1]);
allV-=val;
}else{*/
val+=vv;
allV-=vv;
//}
}
}
return {lvl:lvl,val:val};
};

User.prototype.addConnect=function(connect,obAccount){
if(connect!=null && !this.checkConnect(connect)){
if(obAccount!=null)connect.connect.obAccount=obAccount;
this.connectsList.push(connect);
}
}


User.prototype.checkOriginalConnect=function(connect){
if(connect!=null && connect.connect!=null){
if('obAccount' in connect.connect){
var ob=connect.connect.obAccount;
if(ob!=null && 'isOriginal' in ob)return true;
}
/*if(('obAccount' in connect.connect)==false){
return true;
}*/
}
return false;
}

User.prototype.checkAccessM=function(v){
var rr=accessUsersMaster.checkAccessUserOne(this.id,v);
return rr;
}

User.prototype.checkAccessAccount=function(v,connect){
//var rr=this.checkAccessM(v);
//if(connect!=null && ('obAccount' in connect.connect)==false)return true;
if(connect!=null && 'obAccount' in connect.connect){
var ob=connect.connect.obAccount;
if(ob!=null && 'isOriginal' in ob){
return true;
}
}
if(v!=null){
if(connect!=null && connect.connect!=null){
if('obAccount' in connect.connect){
var ob=connect.connect.obAccount;
if(ob!=null && 'access' in ob){
for (var i = 0; i < ob.access.length; i++) {
var el=ob.access[i];
if(el==v){
return true;
}
}
}
}
}
}
return false;
}


User.prototype.findAccountByCode=function(v){
if(v!=null){
for (var i = 0; i < this.connectsList.length; i++) {
var c=this.connectsList[i];
if(c!=null && c.connect!=null){
if('obAccount' in c.connect){
var ob=c.connect.obAccount;
if(ob!=null && 'code' in ob && ob.code==v){
return c;
}
}
}
}
}
return null;
}

User.prototype.findAccountInfoByCode=function(v){
if(v!=null){
for (var i = 0; i < this.connectsList.length; i++) {
var c=this.connectsList[i];
if(c!=null && c.connect!=null){
if('obAccount' in c.connect){
var ob=c.connect.obAccount;
if(ob!=null && 'code' in ob && ob.code==v){
return ob;
}
}
}
}
}
return null;
}

User.prototype.checkConnect=function(connect){
if(connect!=null){
for (var i = 0; i < this.connectsList.length; i++) {
var c=this.connectsList[i];
if(c!=null && c.connect!=null && c.connect==connect.connect)return true;
}
}
return false;
}


User.prototype.removeDisconnected=function(){
for (var i = this.connectsList.length - 1; i >= 0; i--) {
var c=this.connectsList[i];
if(c!=null && c.connect.disconnectV==true){
this.connectsList.splice(i,1);
}
}
}

User.prototype.removeConnect=function(connect){
if(connect!=null){
for (var i = 0; i < this.connectsList.length; i++) {
var c=this.connectsList[i];
if(c!=null && c==connect){
this.connectsList.splice(i,1);
return true;
}
}
}
return false;
}


User.prototype.checkAllDisconnected=function(){
var num=0;
var sz=this.connectsList.length;
for (var i = 0; i < sz; i++) {
var c=this.connectsList[i];
if(c!=null && c.connect.disconnectV==true){
++num;
}
}
if(num>=sz)return true;
return false;
}

User.prototype.getCountConnects=function(){
var sz=this.connectsList.length;
//if(this.connect!=null)sz+=1;
return sz;
}

User.prototype.allDisconnect=function(){
for (var i = 0; i < this.connectsList.length; i++) {
var c=this.connectsList[i];
if(c!=null){
c.disconnect();
}
}
this.connectsList=[];
}

User.prototype.disconnect=function(){
if(this.connect!=null)this.connect.disconnect();
}

User.prototype.disconnectOwner=function(){
for (var i = 0; i < this.connectsList.length; i++) {
var c=this.connectsList[i];
if(c!=null && c.connect!=null){
if('obAccount' in c.connect){
var ob=c.connect.obAccount;
if(ob!=null && 'isOriginal' in ob){
c.disconnect();
}
}
}
}
}

User.prototype.addDressItemUser=function(o,cb){
var th=this;
if(o){
var rowid=o.id;
var itemid=o.itemid;
var categ=o.category;
var findItem=null;
var isUpd=false;
if(th.dressItems){
for (var i = 0; i < th.dressItems.length; i++) {
var el=th.dressItems[i];
if(el.id==rowid)findItem=el;
if(el.category==categ && el.status==1){ // если одежда с такой категорией уже надета, то снимаем её, чтобы не было двух шляп и тд
el.status=0;
isUpd=true;
dressMaster.updateDressItemStatus(el.id,el.status);
}
}
}


if(findItem){
if('end_time' in o){
findItem.end_time=o.end_time;
}
if(o.status!=1)isUpd=true;
findItem.status=1;
dressMaster.updateDressItemStatus(findItem.id,findItem.status,function(){
if(typeof cb=='function')cb(true);
});
}else{
isUpd=true;
o.status=1;
th.dressItems.push(o);
dressMaster.updateDressItemStatus(rowid,o.status,function(){
if(typeof cb=='function')cb(true);
});
}

if(isUpd){
th.sendUpdateUserDressIds();
}

th.checkDressSystemV();

}
};

User.prototype.checkDressSystemV=function(){
var th=this;
if(th.id!=systemUser.id){
var ids=th.getDressItemsIDS();
if(ids && ids.length>0){
var v3=dressMaster.checkDressIdsSystem(ids,th);
if(v3){
    
var priceAll=0;
for (var i = 0; i < ids.length; i++) {
var item=dressMaster.getItemByID(ids[i]);
if(item)priceAll+=item.price;
}

if(priceAll>0){
var giftItem=null;
var gifts=shopMaster.giftsListLapkiPrice;
if(gifts){
for (var i = 0; i < gifts.length; i++) {
var el=gifts[i];
var priceV=Math.floor(el.price*0.5);
if(el && priceV>=priceAll){
giftItem=el;
break;
}
}
}
}

var percV=0;
var ob5=dressMaster.dressSysDataAction;
if(ob5 && 'prizePerc' in ob5)percV=ob5.prizePerc;
var txtV='Да! Именно такой наряд у меня!';
if(giftItem)txtV+=' Держи подарок "'+giftItem.name+'".';
txtV+=' Сегодня с этим нарядом в забегах даётся на '+percV+'% больше бонусного опыта! Но если хоть одну вещь снять или заменить - бонус исчезнет!';

MainRoom.sendPrivateMsg(systemUser,th,txtV);

if(giftItem){
var giftid=giftItem.id;
var giftObjInfo=null;
var msgArr=['ура, я не одна такая модная!','теперь мы вместе такие модные!','какие мы нарядные, не правда ли?'];
if(giftid in shopMaster.giftsObj)giftObjInfo=shopMaster.giftsObj[giftid];
if(th.id>0){
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,-2,th.id,function(res){
MainRoom.sendGiftMessage(systemUser,th.id,[giftid],msgArr.random());
if(giftObjInfo)th.emit('userEvent','PresentUserGift',-2,giftObjInfo);
});
}
}

}
}
}
};

User.prototype.disableDressItemUser=function(o,cb){
var th=this;
if(o){
var findItem=null;

if(th.dressItems){
for (var i = 0; i < th.dressItems.length; i++) {
var el=th.dressItems[i];
if(el.id==o.id){
if(el.status==1)findItem=el;
break;
}
}
}

if(findItem){
findItem.status=0;
dressMaster.updateDressItemStatus(findItem.id,findItem.status,function(){
th.sendUpdateUserDressIds();
th.checkDressSystemV();
if(typeof cb=='function')cb(true);
});
}else{
if(typeof cb=='function')cb(false);
}

}
};


User.prototype.removeDressItemUser=function(id){
var th=this;
if(th.dressItems){
for (var i = 0; i < th.dressItems.length; i++) {
var el=th.dressItems[i];
if(el.id==id){
th.dressItems.splice(i,1);
return true;
}
}
}
return false;
};


User.prototype.loadUserDressItems=function(cb){
var th=this;
th.dressItems=[];
var userid=this.id;
if(dressMaster){
dressMaster.getDressListByUserID(userid,function(arr){
th.dressItems=arr;
th.checkDressSystemV();
if(typeof cb=='function')cb(th.dressItems);
});
}
};

User.prototype.parseObj=function(o){
var th=this;
this.ob=o;
if(o!=null){
if('id' in o)this.id=o['id'];
if('energy' in o)this.energy=o['energy'];
if('energy_change_at' in o)this.changeEnergyTime=o['energy_change_at'];
//if('pers_change_at' in o)this.changePersTime=o['pers_change_at'];
if('nickChangeTime' in o)this.nickChangeTime=o['nickChangeTime'];

if('ban_type' in o)this.bantype=o['ban_type'];
if('ban_time' in o)this.bantime=o['ban_time'];
if('ban_change_time' in o)this.banChangeTime=o['ban_change_time'];

if('vip' in o)this.vip=o['vip'];
if('vip_end' in o)this.vip_end=o['vip_end'];
if('vip_trial' in o)this.vip_trial=o['vip_trial'];
if('nickRainbow_end' in o)this.nickRainbow_end=o['nickRainbow_end'];

if('nickColor_pos' in o)this.nickColor_pos=o['nickColor_pos'];
if('nickColor_end' in o)this.nickColor_end=o['nickColor_end'];
if('nickColor_trial' in o)this.nickColor_trial=o['nickColor_trial'];

if('last_active' in o)this.last_active_ts=o['last_active'];

if('nick_itemid' in o)this.nick_itemid=o['nick_itemid'];
if('actionItemsNums' in o)this.actionItemsNums=o['actionItemsNums'];
if('actionItemsNumsPos' in o)this.actionItemsNumsPos=o['actionItemsNumsPos'];

if(this.actionItemsNumsPos<=0)this.actionItemsNumsPos=1;

if('actionNYItems' in o)this.actionNYItems=o['actionNYItems'];
if('actionNYLevel' in o)this.actionNYLevel=o['actionNYLevel'];
if('action_val1' in o)this.actionVal1=o['action_val1'];
//this.actionNYItemsRnd=1+Math.floor(Math.random()*2);
//this.actionNYItemsRnd=1;
this.actionNYItemsRnd=Math.floor(Math.random()*2)+2;
this.actionItemsNumsPos=1;

//this.actionNYItemsRnd=1;

if('toysLevelItems' in o)this.toysLevelItems=o['toysLevelItems'];
if('toysNumsItems' in o)this.toysNumsItems=o['toysNumsItems'];
this.actionEggRnd=Math.floor(Math.random()*2)+2;
this.toysItemsNumsRnd=1+Math.floor(Math.random()*2);

if(this.toysNumsItems==0)this.toysItemsNumsRnd=1;

if('modMapsAdv' in o)this.modMapsAdv=o['modMapsAdv'];
if('gameMagicHand' in o)this.gameMagicHand=o['gameMagicHand'];
if('levels_editor' in o)this.levelsEditor=o['levels_editor'];
if('sex' in o)this.sex=o['sex'];
if('ip' in o)this.ip=o['ip'];
if('login' in o)this.login=o['login'];
if('level' in o)this.level=o['level'];
if('lastLevel' in o)this.lastLevel=o['lastLevel'];
if('dogsCount' in o)this.dogsCount=o['dogsCount'];
if('mapLevel' in o)this.mapLevel=o['mapLevel'];
if(this.mapLevel<=0)this.mapLevel=1;
if('nick' in o)this.nick=o['nick'];
if('pers' in o)this.pers=o['pers'];
if('opyt' in o)this.opyt=o['opyt'];
if('health' in o)this.health=o['health'];
if('popular' in o)this.popular=o['popular'];
if('world_id' in o)this.myWorldId=o['world_id'];
if('popularLevel' in o)this.popularLevel=o['popularLevel'];
if('popularIcon' in o)this.popularIcon=o['popularIcon'];
if(this.popularLevel<=0)this.popularLevel=1;
var info2=this.getPopularInfo1(this.popularLevel,this.popular);
if(info2!=null)this.popularPos=info2.pos;

if('money' in o)this.money=o['money'];
if('kostochki' in o)this.kosti=o['kostochki'];
if('opyt_hour' in o)this.opyt_hour=o['opyt_hour'];
if('opyt_day' in o)this.opyt_day=o['opyt_day'];
if('train_scene' in o)this.trainScene=o['train_scene'];
if('nickLength' in o)this.nickLength=o['nickLength'];
if('nickRainbow' in o)this.nickRainbow=o['nickRainbow'];
if('nickRainbow_trial' in o)this.nickRainbow_trial=o['nickRainbow_trial'];

if('iconEmoji' in o)this.iconEmoji=o['iconEmoji'];
if('isVipHappy1' in o)this.isVipHappy1=o['isVipHappy1'];

if('mapsLevelMode' in o)this.mapsLevelMode=o['mapsLevelMode'];

if('curStyle1' in o)this.curStyle1App=o['curStyle1'];

if('curStyle1Items' in o){
var ss=o['curStyle1Items'];
if(ss.length>0){
try{
this.curStyle1Items=JSON.parse(ss);
}catch(e){}
}
}

if('gift_free_time' in o)this.giftFreeTime=o['gift_free_time'];
if('quests1_free_time' in o)this.quests1FreeTime=o['quests1_free_time'];
if('mod_getmoney_time' in o)this.modGetMoneyTS=o['mod_getmoney_time'];
if('modmaps_getmoney_time' in o)this.modMapsMoneyTS=o['modmaps_getmoney_time'];
if('tester_getmoney_time' in o)this.testerGetMoneyTS=o['tester_getmoney_time'];
if('pers' in o)this.pers=o['pers'];
if('tester' in o)this.tester=o['tester'];
/*if('world_persPos' in o){
var spl2=o.world_persPos.split(',');
if(spl2.length>2)this.persXYArr=[parseInt(spl2[0]),parseInt(spl2[1]),parseInt(spl2[2])];
}*/
if('settings' in o)this.setSettingsStr(o.settings);

this.actionItemsNumsRnd=Math.floor(Math.random()*5)+3;

if(this.isVip()){
var koef=0.3;
this.actionItemsNumsRnd-=Math.floor(this.actionItemsNumsRnd*koef);
}

if(this.actionItemsNums>=actionItems1Count){
this.actionItemsNumsRnd=0;
}

//this.actionItemsNumsRnd=1;
if('flags_data' in o){
var s3=o.flags_data;
this.flagsMaster=new FlagsMaster1([]);
this.flagsMaster.parseStr(s3);
if(s3.length<=0){
this.flagsMaster.push(10);
//this.flagsMaster.add(1,1);
}
}else{
this.flagsMaster=new FlagsMaster1([]);
this.flagsMaster.push(10);
}


if('flags_settings' in o){
var s3=o.flags_settings;
this.settingsFlagsMaster=new FlagsMaster1([]);
this.settingsFlagsMaster.parseStr(s3);
if(s3.length<=0){
this.settingsFlagsMaster.push(10);
}
}else{
this.settingsFlagsMaster=new FlagsMaster1([]);
this.settingsFlagsMaster.push(10);
}


if('missionVKList' in o){
if(o.missionVKList.length>0){
try{
this.missionVKList=JSON.parse(o.missionVKList);
}catch(e){}
if(this.missionVKList==null)this.missionVKList=[];
}
}


if('historyMiniChat' in o){
if(o.historyMiniChat.length>0){
try{
this.miniChatMsgs=JSON.parse(o.historyMiniChat);
}catch(e){}
if(this.miniChatMsgs==null)this.miniChatMsgs=[];
}
}

if('gameItems' in o){
var st2=o.gameItems;
if(st2!=null && st2.length>0){
try{
this.gameItems.parse(JSON.parse(st2));
}catch(e){}
if(this.gameItems==null)this.gameItems=new GameUsersItems();
}
}

if('gameItemsDay' in o){
var st2=o.gameItemsDay;
if(st2!=null && st2.length>0){
try{
this.gameItemsDay.parse(JSON.parse(st2));
}catch(e){}
if(this.gameItemsDay==null)this.gameItemsDay=new GameUsersItems();
}
}


/*if('dress_items' in o){
var st2=o.dress_items;
if(st2!=null && st2.length>0){
try{
this.dressItems=JSON.parse(st2);
}catch(e){}
if(this.dressItems==null)this.dressItems=[];
}
}*/

/*dressMaster.getDressActiveByUserID(this.id,function(a){
th.dressItems=a;
});*/

/*if('popularItems' in o){
var st2=o.popularItems;
if(st2!=null && st2.length>0){
try{
this.popularItemsList=JSON.parse(st2);
}catch(e){}
}
}

if(this.popularItemsList==null)this.popularItemsList=[];
if(this.popularItemsList.length<=0)this.addPopularItemID(1);*/

this.updateProps(o);
}
}

User.prototype.pushMiniChatMsg=function(msg){
if(msg!=null && msg.length>0){
var ts=getTimestamp();
miniChatStack.push({user:this.id,msg:msg,time:ts});
/*this.miniChatMsgs.push({time:ts,msg:msg});
if(this.miniChatMsgs.length>maxMiniChatMsgsHistory)this.miniChatMsgs.shift();*/
}
}

User.prototype.isTester=function(){
if(this.tester==1)return true;
return false;
}

User.prototype.isVip=function(){
if(this.vip>0){
var ts=this.vip_end-getTimestamp();
if(ts>0)return true;
}
return false;
}

User.prototype.isNickColor=function(){
if(this.nickColor_end>0){
var ts=this.nickColor_end-getTimestamp();
if(ts>0)return true;
}
return false;
}

User.prototype.isNickRainbow=function(){
if(this.nickRainbow_end>0){
var ts=this.nickRainbow_end-getTimestamp();
if(ts>0)return true;
}
return false;
}

User.prototype.isBan=function(){
/*var ts=getTimestamp();
if(ts<this.bantime)return true;*/
return this.bantype>0;
}

User.prototype.getExpireBanSecs=function(){
var ts=getTimestamp();
var v=this.bantime-ts;
if(v<=0)v=0;
return v;
}

User.prototype.updateProps=function(o){
if('pers' in o)this.pers=o.pers;
if('mode' in o)this.mode=o.mode;
if('block' in o)this.block=o.block;
if('mod_maps' in o){
this.isModMaps=o['mod_maps']==1;
}
this.boarKonkurs=0;
if('boar_konkurs' in o){
if(o['boar_konkurs']==1)this.boarKonkurs=1;
}

var lvl=levelsMaster.GetLevelByOpyt(this.opyt);
this.level=lvl;
/*var domainObj=utilsMaster.getResolveNameByUserID(this.id);
if(domainObj!=null){
this.domain=domainObj.name;
}*/
}

User.prototype.updateHealth=function(v){
if(v<=0)v=0;
if(v>100)v=100;
this.health=v;
this.emit('user.updHealth',this.health);
}

User.prototype.emit=function(t){
var args=[];
var arr=[t];
for (var i = 1; i < arguments.length; i++)arr.push(arguments[i]);
for (var i = 0; i < this.connectsList.length; i++) {
var c=this.connectsList[i];
if(c!=null)c.emit.apply(c,arr);
}
}

User.prototype.emitArgs=function(t,args){
if(!args)args=[];
var arr=[t];
for (var i = 1; i < args.length; i++)arr.push(args[i]);
for (var i = 0; i < this.connectsList.length; i++) {
var c=this.connectsList[i];
if(c!=null)c.emit.apply(c,arr);
}
}


User.prototype.emitNoInitiator=function(t,connect,args){
var arr=[t];
for (var i = 0; i < args.length; i++)arr.push(args[i]);
for (var i = 0; i < this.connectsList.length; i++) {
var c=this.connectsList[i];
if(c!=null && c.connect!=connect){
c.emit.apply(c,arr);
}
}
}

User.prototype.sendStream=function(st){
if(st){
for (var i = 0; i < this.connectsList.length; i++) {
var c=this.connectsList[i];
if(c!=null && c.connect!=null){
var arr=[c.connect];
for (var k = 1; k < arguments.length; k++)arr.push(arguments[k]);
st.sendConnect.apply(st,arr);
}
}
}
};

User.prototype.sendUpdateUserInfo=function(){
//this.emit('user.updateUserInfo',this.getACUObj1());
if(MainRoom!=null)MainRoom.emitRoom('user.updateUserInfo',this.getACUObj1(0));
}
User.prototype.sendUpdateUserInfoCurID=function(){
//this.emit('user.updateUserInfo',this.getACUObj1());
if(MainRoom!=null)MainRoom.emitRoom('user.updateUserInfo',this.getACUObj1(0));
}
User.prototype.sendUpdateUserInfoCur=function(){
this.emit('user.updateUserInfo',this.getACUObj1(this.id));
}

User.prototype.plusOpyt=function(v){
var th=this;
this.opyt=this.opyt+v;
this.emit('UpdateOpytUser',this.opyt);
var lvl=levelsMaster.GetLevelByOpyt(this.opyt);
var money=0;
if(this.level!=lvl){
this.level=lvl;
var loginVK='';
if(vkNotifyApi!=null && this.login!=null && this.login.length>0 && this.login.substr(0,2)=='vk'){
var idUserVK=this.login.substr(2);
loginVK=idUserVK;
vkNotifyApi.setUserLevel(idUserVK,lvl);
}

if(MainRoom!=null && this.id>0)MainRoom.sendMessageEvent('newLevelUser',this.id,0,[lvl]);

/*if(this.level==mapLevelsUsers2){
this.mapsLevelMode=1;
this.sendUpdateUserInfoCur();
}*/

if(this.lastLevel<lvl){
money=levelNewUserMoney*lvl;
this.lastLevel=lvl;
this.updateFieldDB('lastLevel',this.lastLevel);
this.plusMoney(money);

if(this.id>0){

//if(th.level<=6){
var aa2=[];
for (var i = 0; i < shopMaster.giftsList.length; i++) {
var el=shopMaster.giftsList[i];
if('price_type' in el && el.price_type==1){
aa2.push(el); 
}else if(el.price>=400){
aa2.push(el);
}
}
/*for (var i = 0; i < shopMaster.giftsList.length; i++) {
var el=shopMaster.giftsList[i];
if(el.price<=500)aa2.push(el);
}*/
var giftObj=aa2.random();
if(giftObj!=null){
var giftid=giftObj.id;
if(loginVK.length>0){
    
var missionVK=9;
if(!th.checkMissionVK(missionVK)){
vkNotifyApi.setMission(loginVK,missionVK,function(){
th.addMissionVK(missionVK);
});
}
}
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,-2,th.id,function(res){
th.emit('userEvent','PresentUserGift',-2,giftid);
});
}
//}
}
}
var lvlObj=levelsMaster.GetLevelObjAndNextLevel(this.level);
this.emit('newUserLevel',this.level,this.opyt,money,lvlObj);
this.saveUserDB();
//trace('new level');
}
}

User.prototype.getPrefixAuth=function(){
if(this.login!=null && this.login.length>0){
var p=this.login.substr(0,2);
if(p=='vk')return 'vk';
if(p=='mm')return 'mm';
if(p=='yg')return 'yg';
if(p=='od')return 'od';
if(this.login.length>2){
p=this.login.substr(0,3);
if(p=='reg')return 'reg';
}
}
return '';
}


User.prototype.isLoginReg=function(){
var p=this.getPrefixAuth();
if(p=='reg')return true;
return false;
}


User.prototype.minusOpyt=function(v){
this.opyt=Math.max(0,this.opyt-v);
this.emit('UpdateOpytUser',this.opyt);
}

User.prototype.plusMoney=function(v){
this.money=this.money+v;
this.emit('updateMoneyT','lapki',this.money);
}

User.prototype.minusMoney=function(v){
this.money=Math.max(0,this.money-v);
this.emit('updateMoneyT','lapki',this.money);
}

User.prototype.minusMoneyType=function(v,t){
if(t=='kosti'){
this.minusKosti(v);
}else{
this.minusMoney(v);
}
};

User.prototype.plusMoneyType=function(v,t){
if(t=='kosti'){
this.plusKosti(v);
}else{
this.plusMoney(v);
}
};

User.prototype.plusKosti=function(v){
this.kosti+=v;
this.emit('updateMoneyT','kosti',this.kosti);
}

User.prototype.minusKosti=function(v){
this.kosti=Math.max(0,this.kosti-v);
this.emit('updateMoneyT','kosti',this.kosti);
}



User.prototype.plusDogs=function(v){
this.dogsCount+=v;
this.emit('updateDogsNums',this.dogsCount);
}

User.prototype.minusDogs=function(v){
this.dogsCount=Math.max(0,this.dogsCount-v);
this.emit('updateDogsNums',this.dogsCount);
}


User.prototype.plusActionItems1=function(v){
this.actionItemsNums+=v;
this.updateActionItems1(this.actionItemsNums,this.actionItemsNumsPos);
}

User.prototype.updateActionItems1=function(v,pos){
this.actionItemsNums=Math.max(0,v);
var pp=1;
if(typeof pos!='undefined')pp=pos;
this.emit('actionItems1',this.actionItemsNums,pp);
}

User.prototype.minusEnergy=function(v){
this.energy=Math.max(0,this.energy-v);
this.emit('updateEnergyUser',this.energy);
}

User.prototype.plusEnergy=function(v){
this.energy=this.energy+v;
if(this.energy>=maxEnergyValue)this.energy=maxEnergyValue;
this.emit('updateEnergyUser',this.energy);
}


User.prototype.updPopularObj=function(){
if((this.popularLevel-1)<popularList.length){
var info1=this.getPopularInfo1(this.popularLevel,this.popular);
var idPopular=info1.o.id;
if(info1.isEnd){

var info2=this.getPopularInfo2(this.popularLevel,this.popular);

this.popularLevel=info2.lvl;
this.popular-=info2.val;
this.popularIcon=0;
//console.log(info2);
if(this.popular<=0)this.popular=0;
var lvl2=this.popularLevel-1;
if((this.popularLevel-1)>popularList.length)lvl2=popularList.length-1;
//var nextPopularArr=popularList[lvl2];
//console.log('new popular level',this.popularLevel);
this.emit('UpdatePopularLevel',this.popularLevel)
if(MainRoom!=null)MainRoom.sendMessageEvent('newLevelPopularUser',this.id,0,[this.popularLevel]);
this.sendUpdateUserInfoCurID();
this.saveUserDB();
}else if(this.popularPos!=info1.pos){
this.popularPos=info1.pos;
this.popularIcon=0;
//console.log('new popular part',this.popularPos);
}
}
this.updatePopular(this.popular);
}


/*User.prototype.updPopularObj=function(){
var upd=false;
if((this.popularLevel-1)<popularList.length){
//this.popular+=v;
//var ob=popularList[this.popularLevel-1];
var info1=this.getPopularInfo1(this.popularLevel,this.popular);
var idPopular=info1.o.id;
if(info1.isEnd){
this.popularLevel+=1;
//this.popular=0;
this.popular-=info1.o.v;

//this.popular-=v;

if(this.popular<=0)this.popular=0;
//this.addPopularItemID(idPopular);
//console.log(this.popular);
var lvl2=this.popularLevel-1;
if((this.popularLevel-1)>popularList.length)lvl2=popularList.length-1;

//var nextPopularArr=popularList[lvl2];

//console.log('new popular level',this.popularLevel);
this.emit('UpdatePopularLevel',this.popularLevel)

if(MainRoom!=null)MainRoom.sendMessageEvent('newLevelPopularUser',this.id,0,[this.popularLevel]);
this.sendUpdateUserInfoCurID();
upd=true;
}else if(this.popularPos!=info1.pos){
this.popularPos=info1.pos;

//this.addPopularItemID(idPopular);

//console.log('new popular part',this.popularPos);
}

this.updatePopular(this.popular);

if(upd)this.updPopularObj();

}

}*/


User.prototype.plusPopular=function(v){
this.popular+=v;
this.updPopularObj();
}

/*User.prototype.plusPopular=function(v){
var popularCur=userMaster.getPopularInfoByValue(this.popular);
this.popular+=v;
var popularA=userMaster.getPopularInfoByValue(this.popular);
if(popularA!=null && popularCur!=null && popularA!=popularCur){
this.emit('NewPopularLvl',this.popular);
}
this.updatePopular(this.popular);
}*/

User.prototype.minusPopular=function(v){
var vv=this.popular-v;
if(vv<=0)vv=0;
this.popular=vv;
this.updatePopular(this.popular);
}

User.prototype.updatePopular=function(v){
this.popular=v;
this.emit('UpdatePopularUser',this.popular);
}

User.prototype.plusHealth=function(v){
this.health+=v;
if(this.health>=100)this.health=100;
this.updateHealth(this.health);
}

User.prototype.setSettingsStr=function(v){
if(v.length>0){
var spl=v.split(',');
for (var i = 0; i < spl.length; i++){
var q=parseInt(spl[i]);
if(isNaN(q))q=0;
spl[i]=q;
}
this.settingsList=spl;
}
}

User.prototype.isBoarKonkurs=function(){
if(this.boarKonkurs==1 && curBoarKonkursData!=null)return true;
return false;
};

User.prototype.boarKonkursUpdObj=function(o){
if(o){
var nickBoar='Кабанчик';
var boarDt=curBoarKonkursData;
if(boarDt!=null && 'boarID' in boarDt){
//nickBoar+=' ('+boarDt.boarID+')';
o.boarInfo={id:boarDt.boarID};
}
o.iconEmoji=0;
o.nick_itemid=1;
o.nick=nickBoar;
o.mode=0;
o.vip=0;
}
};

User.prototype.getDressItemsIDS=function(){
var th=this;
var arr=[];
var typeArr=dressSortCategory;
var ob1={};

if(th.id==systemUser.id){
var ob3=dressMaster.dressSysDataAction;
if(ob3 && ob3.items){
var a3=ob3.items;
if(a3){
for (var i = 0; i < a3.length; i++) {
var el=dressMaster.getItemByID(a3[i]);
if(el)ob1[el.category]=el;
}

for (var i = 0; i < typeArr.length; i++) {
var t=typeArr[i];
if(t in ob1){
var item=ob1[t];
arr.push(item.id);
}
}
}

return arr;

}
}

/*if(th.dressItemsShopMain && th.dressItemsShopMain.length>0){

for (var i = 0; i < th.dressItemsShopMain.length; i++) {
var el=th.dressItemsShopMain[i];
if(el)ob1[el.category]=el;
}

for (var i = 0; i < typeArr.length; i++) {
var t=typeArr[i];
if(t in ob1){
var item=ob1[t];
arr.push(item.id);
}
}

return arr;
}*/

if(th.dressItems){
for (var i = 0; i < th.dressItems.length; i++) {
var el=th.dressItems[i];
if(el && el.status==1 && !dressMaster.isItemExpire(el)){
ob1[el.category]=el;
}
}
}

for (var i = 0; i < typeArr.length; i++) {
var t=typeArr[i];
if(t in ob1){
var item=ob1[t];
arr.push(item.itemid);
}
}

return arr;
};


User.prototype.sendUpdateUserDressIds=function(){
var ids=this.getDressItemsIDS();
this.emit('user.updDressIds',ids);
};

User.prototype.getGameRoomUserObj=function(){
/*var mode=0;
if(UserMode.isAdminOrSuperAdmin(this.mode)){
mode=100;
}else if(UserMode.isModerator(this.mode)){
mode=2;
}*/
var mode=this.mode;

var vip=0;
if(this.isVip())vip=this.vip;

var o={id:this.id,nick:this.nick,sex:this.sex,mode:mode,pers:this.pers,vip:vip,popularLevel:this.popularLevel,popular:this.popular,iconEmoji:this.iconEmoji};
//if(this.nick_itemid!=0)o.nick_itemid=this.nick_itemid;
if(this.popularIcon!=0)o.popularIcon=this.popularIcon;
if(this.isBoarKonkurs()){
this.boarKonkursUpdObj(o);
}else{
var dressIds=this.getDressItemsIDS();
if(dressIds && dressIds.length>0)o.dressIds=dressIds;
}
//if(this.nick_itemid!=0)o.nick_itemid=this.nick_itemid;
o.nickRainbow=this.nickRainbow;
o.nickColor_pos=this.nickColor_pos;

if(this.myWorldId!=0)o.myWorldId=this.myWorldId;
if(this.authDevice!=null && this.authDevice.length>0)o.authDevice=this.authDevice;
return o;
}

User.prototype.getACUObj1=function(userid,mode){
if(typeof mode=='undefined')mode=0;

var vip=0;
if(this.isVip())vip=this.vip;

var loginV=this.login;
var prefLogin=this.getPrefixAuth();
if(prefLogin=='yg')loginV='yg';
if(prefLogin=='reg')loginV='reg';
var o={id:this.id,sex:this.sex,login:loginV,nick:this.nick,level:this.level,opyt:this.opyt,popular:this.popular,popularLevel:this.popularLevel,tester:this.tester,mode:this.mode,pers:this.pers,vip:vip,iconEmoji:this.iconEmoji};
//var o={id:this.id,sex:this.sex,login:this.login,nick:this.nick,level:this.level,opyt:this.opyt,popular:this.popular,tester:this.tester,mode:this.mode,pers:this.pers,worldPersPos:this.persXYArr};
o.nickRainbow=this.nickRainbow;
if(this.popularIcon!=0)o.popularIcon=this.popularIcon;
if('sysMod' in this && this.sysMod)o.sysMod=true;
if(this.id==boarUser.id)o.nick_itemid=1;
if(this.isBot)o.isBot=true;
/*if(this.isBoarKonkurs()){
this.boarKonkursUpdObj(o);
}*/

/*if(this.id==systemUser.id){
var items2=[];
var a2=dressMaster.getCategoryListRandom(5);
for (var i = 0; i < a2.length; i++) {
var ct=a2[i];
var item=dressMaster.getItemRandomByCategory(ct,0);
if(item)items2.push(item);
//console.log(ct,item);
}
this.dressItemsShopMain=items2;
}*/

var lvlObj=levelsMaster.GetLevelObjAndNextLevel(this.level);
o.lvlObj=lvlObj;

if(this.myWorldId!=0)o.myWorldId=this.myWorldId;
if(this.authDevice!=null && this.authDevice.length>0)o.authDevice=this.authDevice;
if(this.domain!=null && this.domain.length>0)o.domain=this.domain;
if(this.nick_itemid!=0)o.nick_itemid=this.nick_itemid;
o.nickColor_pos=this.nickColor_pos;

if(!this.isBoarKonkurs()){
var dressIds=this.getDressItemsIDS();
if(dressIds && dressIds.length>0)o.dressIds=dressIds;
}
//if(this.dressItems!=null && this.dressItems.length>0)o.dressItems=this.dressItems;

if(this.isNickColor())o.nickColorFlag=1;
if(this.isNickRainbow())o.nickRainbowFlag=1;

if(this.last_active_ts>0)o.last_active=this.last_active_ts;

var isOnlineUser=MainRoom.getUserByID(this.id);
if(isOnlineUser!=null)o.isOnline=1;

if(userid!=0 && userid==this.id){
o.mapsLevelMode=this.mapsLevelMode;
//o.energy=this.energy;
//o.health=this.health;
o.dogsCount=this.dogsCount;
o.nickLength=this.nickLength;
o.money=this.money;
o.kosti=this.kosti;
}

/*if(mode>0 && (UserMode.isModerator(mode) || UserMode.isModeratorM(mode))){
//o.energy=this.energy;
//o.health=this.health;

var banInfo=getBanUserInfo(this);
var banTime=0;
if(banInfo!=null)banTime=banInfo.expire;
o.banInfo={time:banTime};
if(UserMode.isModerator(mode))o.money=this.money;
//o.kosti=this.kosti;
//o.ip=this.ip;
}*/

//if(mode>0){
var banInfo=getBanUserInfo(this);
var banTime=0;
if(banInfo!=null)banTime=banInfo.expire;
if(banTime>0)o.banInfo={time:banTime};
if(UserMode.isModerator(mode))o.money=this.money;
//}

if(mode>0 && UserMode.isSuperAdmin(mode)){
o.money=this.money;
o.kosti=this.kosti;
o.ip=this.ip;
}

return o;
}

User.prototype.getObj=function(userid){
var vip=0;
if(this.isVip())vip=this.vip;

var loginV=this.login;
var prefLogin=this.getPrefixAuth();
if(prefLogin=='yg')loginV='yg';
if(prefLogin=='reg')loginV='reg';

var o={id:this.id,sex:this.sex,login:loginV,nick:this.nick,popular:this.popular,popularLevel:this.popularLevel,vip:vip,nickRainbow:this.nickRainbow,pers:this.pers,nickLength:this.nickLength,opyt:this.opyt,worldPersPos:this.persXYArr,/*settings:this.settingsList,*/level:this.level,tester:this.tester,money:this.money,kosti:this.kosti,mode:this.mode,vip_trial:this.vip_trial,nickRainbow_trial:this.nickRainbow_trial,nickColor_trial:this.nickColor_trial,iconEmoji:this.iconEmoji/*,authTime:this.authTime*/};
//o.toysLevelItems=this.toysLevelItems;
o.toysNumsItems=this.toysNumsItems;
if(this.popularIcon!=0)o.popularIcon=this.popularIcon;

var lvlObj=levelsMaster.GetLevelObjAndNextLevel(this.level);
o.lvlObj=lvlObj;
if(this.isBot)o.isBot=true;
if(this.boarKonkurs==1)o.boarK=true;
//if(this.dressItems!=null && this.dressItems.length>0)o.dressItems=this.dressItems;
if(this.myWorldId!=0)o.myWorldId=this.myWorldId;
if(this.authDevice!=null && this.authDevice.length>0)o.authDevice=this.authDevice;
o.nickColor_pos=this.nickColor_pos;
if(this.isNickColor())o.nickColorFlag=1;
if(this.isNickRainbow())o.nickRainbowFlag=1;
var banInfo=getBanUserInfo(this);
var banTime=0;
if(banInfo!=null)banTime=banInfo.expire;
o.banTime=banTime;

if(userid==this.id){
o.levelsEditor=this.levelsEditor;
o.dogsCount=this.dogsCount;
o.mapsLevelMode=this.mapsLevelMode;
if(this.modMapsAdv==1)o.modMapsAdv=1;
if(this.connect!=null)o.ip=this.ip;	
}
//if(this.connect!=null)o.ip=this.ip;
if(this.domain!=null && this.domain.length>0)o.domain=this.domain;
return o;
}

User.prototype.updateNick=function(v){
if(this.id>0){
this.nick=v;
this.updateFieldDB('nick',v);
}
}

User.prototype.updateFieldDB=function(t,v,cb){
if(this.id>0){
mysql.query('UPDATE users SET '+t+'=? WHERE id=?', [v,this.id], function(rows){
if(typeof cb!=='undefined')cb();
});
}
}

User.prototype.updateFieldDBRes=function(t,v,cb){
mysql.query('UPDATE users SET '+t+'=? WHERE id=?', [v,this.id], function(rows){
var q=false;
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0)q=true;
if(typeof cb!=='undefined')cb(q);
});
}

User.prototype.getIPConnect=function(connect){
if(connect!=null){
var ip=connect.clientIP();
if(ip=='1')ip='127.0.0.1';
return ip;
}
return '';
}

User.prototype.updateAuthOnlineTime=function(){
var th=this;
if(th.id>0){
var ts=getTimestamp();
var activeSecs=ts-th.authTimeCheckVal;
if(activeSecs<0)activeSecs=0;
th.authTimeCheckVal=ts;
if(activeSecs>0)statsUsers.setValue('online_time_sec',th.id,activeSecs);
}
}

User.prototype.getUserSaveObjDB=function(){
var ip='';
var isDisconnect=false;
if(this.connect!=null){
ip=this.ip;
if(this.connect.connect.disconnectV==true)isDisconnect=true;
}
var ts=getTimestamp();

this.level=levelsMaster.GetLevelByOpyt(this.opyt);
var missionVKListStr='[]';
var popularItemsStrArr='';
/*try{
popularItemsStrArr=JSON.stringify(this.popularItemsList);
}catch(e){}*/

var settingsStr=this.settingsList.join(',');
var persPos='';//this.persXYArr.join(',');
var flagsData=this.flagsMaster.getStr();
var flagsSettings=this.settingsFlagsMaster.getStr();
var gameItemsList=this.gameItems.getStr();
var gameItemsListDay=this.gameItemsDay.getStr();

var historyMiniChatStr='';
if(this.miniChatMsgs!=null && this.miniChatMsgs.length>0){
historyMiniChatStr=JSON.stringify(this.miniChatMsgs);
}

var curStyle1ItemsStr='';
if(this.curStyle1Items!=null && this.curStyle1Items.length>0){
curStyle1ItemsStr=JSON.stringify(this.curStyle1Items);
}

var arr=[this.money,this.kosti,this.pers,this.nickLength,this.dogsCount,this.mapLevel,this.actionItemsNums,this.actionItemsNumsPos,this.toysNumsItems,this.opyt,this.opyt_hour,this.opyt_day,this.popular,this.popularLevel,this.popularIcon,this.nickRainbow,this.nickRainbow_end,this.nickRainbow_trial,this.vip,this.vip_end,this.vip_trial,this.nickColor_pos,this.nickColor_end,this.nickColor_trial,this.giftFreeTime,this.quests1FreeTime,this.health,this.energy,this.changeEnergyTime,this.trainScene,this.mapsLevelMode,this.myWorldId,persPos,flagsData,flagsSettings,this.sex,this.nickChangeTime,this.level,ip,settingsStr,this.bantype,this.bantime,this.banChangeTime,gameItemsList,gameItemsListDay,this.gameMagicHand,missionVKListStr,historyMiniChatStr,this.curStyle1App,curStyle1ItemsStr,this.iconEmoji,this.actionNYItems,this.actionNYLevel,this.actionVal1/*,this.isVipHappy1*/];

var fields=['money','kostochki','pers','nickLength','dogsCount','mapLevel','actionItemsNums','actionItemsNumsPos','toysNumsItems','opyt','opyt_hour','opyt_day','popular','popularLevel','popularIcon','nickRainbow','nickRainbow_end','nickRainbow_trial','vip','vip_end','vip_trial','nickColor_pos','nickColor_end','nickColor_trial','gift_free_time','quests1_free_time','health','energy','energy_change_at','train_scene','mapsLevelMode','world_id','world_persPos','flags_data','flags_settings','sex','nickChangeTime','level','ip','settings','ban_type','ban_time','ban_change_time','gameItems','gameItemsDay','gameMagicHand','missionVKList','historyMiniChat','curStyle1','curStyle1Items','iconEmoji','actionNYItems','actionNYLevel','action_val1'/*,'isVipHappy1'*/];

if(isDisconnect){
fields.push('last_active');
arr.push(ts);
this.last_active_ts=ts;
}

var str3='';
for (var i = 0; i < fields.length; i++) {
var el=fields[i];
str3+=''+el+'=?';
if(i!=fields.length-1)str3+=', ';
}

var query='UPDATE users SET '+str3;

query+=' WHERE id=?';
arr.push(this.id);
return {id:this.id,query:query,arr:arr};
}

User.prototype.saveUserDB=function(cb){
var th=this;
if(this.id>0){
var obj=this.getUserSaveObjDB();
var idsDress=this.getDressItemsIDS();

if((th.lastDressItemsIDS && th.lastDressItemsIDS.length!=idsDress.length) || !th.lastDressItemsIDS){
th.lastDressItemsIDS=idsDress;
th.emit('user.updDressIds',idsDress);
}

mysql.query(obj.query, obj.arr, function(rows){
if(!rows){

}else{
if(typeof cb!=='undefined')cb.apply(th);
trace('save user '+th.id);
}

});

th.updateAuthOnlineTime();

}else{
if(typeof cb!=='undefined')cb.apply(th);
}
}

User.prototype.saveUserCallback=function(cb1){
if(this.id>0){
var obj=this.getUserSaveObjDB();
mysql.query(obj.query, obj.arr, function(rows){
if(typeof cb1!=='undefined'){
cb1(obj,rows!=null);
}
});
}
}


User.prototype.checkMissionVK=function(id){
for (var i = 0; i < this.missionVKList.length; i++) {
var el=this.missionVKList[i];
if(el==id)return true;
}
return false;
}

User.prototype.addMissionVK=function(id){
var res=this.checkMissionVK(id);
if(!res){
this.missionVKList.push(id);
return true;
}
return false;
}

User.prototype.resetUser=function(){
this.gameMagicHand=0;
this.mode=0;
this.sex=1;
this.level=1;
this.lastLevel=0;
this.dogsCount=0;
this.nick='Игрок '+this.id;
this.opyt=0;
this.popular=0;
this.pers=0;
//this.popularItemsList=[];
this.popularLevel=1;
this.popularPos=0;
this.flagsMaster.clear();
this.gameItems=new GameUsersItems();
this.gameItemsDay=new GameUsersItems();
this.saveUserDB();
this.updateFieldDB('mode',this.mode);
this.updateFieldDB('lastLevel',this.lastLevel);
this.updateFieldDB('nick',this.nick);
shopMaster.clearMoneyHistoryUser(this.id);
};

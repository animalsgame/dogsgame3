var isWin = /^win/.test(process.platform);

function trace(){
console.log.apply(console,arguments);
}

function eachPageArrayRev(arr,page,maxRows){
var a=[];
if(page<=0)page=1;
if(arr){
var num=(page-1)*maxRows;
for (var i=0; i < maxRows; i++) {
var pos=(arr.length-1)-num-i;
if(pos>=0 && pos<arr.length){
a.push(arr[pos]);
}else{
return a;
}
}
}
return a;
}

function eachPageArray(arr,page,maxRows){
var a=[];
if(page<=0)page=1;
var pos=(page-1)*maxRows;
for (var i=0; i < maxRows; i++) {
var pp=pos+i;
if(arr && pp<arr.length){
var ob=arr[pp];
a.push(ob);
}else{
return a;
}
}
return a;
}

function castInt(v){
var vv=parseInt(v);
if(isNaN(vv))vv=0;
return vv;
}

function shuffleArray(a){
if(a){
a.sort(function(a,b){
return 0.5-Math.random();
});
}
}

var https = require('https');
var urlQ = require('url');

// отказ от request модуля, чтобы не тянуть 400+ файлов
//var request=require('request');

function request(props, cb){
var postData = '';
var method = props.method || 'GET';
var chunks = [];
var isErrors = false;
var isClose = false;
var url = props.url;
var urlObj = urlQ.parse(url);
var result = {status:0, data:null};
if(props.form){
for (var n in props.form)postData += encodeURIComponent(n)+'='+encodeURIComponent(props.form[n])+'&';
}
if(postData)postData = postData.substr(0,postData.length-1);

var options = {method:method, hostname:urlObj.hostname, path:urlObj.path};
if(method != 'GET')options.headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData)};

var client = https.request(options, function(res){
result.status = res.statusCode;
res.on('data', function(chunk){chunks.push(chunk)});
});

client.on('error', function(e){
if(!isErrors){
isErrors = true;
if(cb)cb(e);
}
});

/*client.setTimeout(5000, function(){
client.destroy();
isClose = true;
});*/

client.on('close', function(){
if(isErrors || isClose)return;
if(result.status == 200){
result.data = Buffer.concat(chunks);
if(cb)cb(null, client, ''+result.data);
}else{
if(cb)cb({error:true});
}
});

if(method == 'POST')client.write(postData);
client.end();
}

var _mysql=require('mysql');
//var ByteArray=require('./ByteArrayClass');
var crypto=require('crypto');
var fs=require('fs');

var curEventType='feb';
var vkGroupIDInt=175397689;
var vkGroupID=''+vkGroupIDInt;
var pathMainMsgsHistory='./';
var pathSaveHistoryMsgsFileH=pathMainMsgsHistory;
var pathSaveHistoryMsgs=pathMainMsgsHistory;
var appVKInfo={id:6787147,secret:'h4pprDVRckPTzQA1IlZz'};
var appVKInfo2={id:7240475,secret:'W4AAa1H55i2LvIB9Jgm1'};
var appYGSecretKey=''; // ключ для подписи в яндекс играх, была готова авторизация в 2021 году
var vkTokenWallGroup=''; // токен для отправки постов на стену (в группе игры)
var appVKToken=''; // токен из настроек игры, чтобы отправлять уведомления от имени игры, устанавливать уровни / миссии в ленту активности
var vkGroupMessagesToken=''; // токен для отправки сообщений в лс от имени группы (результат модерации карты)
var secretKeyWeb='iJhEpglvgbUFuhc0YcrvdAWTHpnBQ8'; // ключ для работы с api в php
var secretKeyAnimalsGameSite='wRCJmRPRClZjWtYVCpNsuIy4UNbC9M'; // ключ для создания подписи ( авторизация через префикс site_ )
var portSrv=9050;

var dbName='dogsgame3';
var dbCharset='utf8mb4';
var dbPass='';

var adminIP='127.0.0.1';

var cmds=null;
var GameItemsUserType={BONE:1,BUDKA:2,MONEY:3,MONEY_KOSTI:4,STARS:5,BARK:6};
var GameItemsType={GIFTS:1};
var ShopItemsType={GIFTS:1};
var miniChatStack=[];
var chatTextColorList=['#f1a0b3','#a0ccf1','#88de79','#ff3bf8','#ffee0d','#3efbf4','#fcdbaa','#ffffff'];
var dbErrorLastTime=0;
var statusServer='wait';
var tableDialogsName='dialogsHistory';
var log=null;
var srv=null;
var topM=null;
var chatRooms={};
var mysql=null;
var event8martaObj=null;
var eventsActionMaster=null;
var mapsObjSelect=null;
var vkGroupApi=null;
var vkNotifyApi=null;
var vkGroupMessages=null;
var mapsMaster=null;
var worldMapsMaster=null;
var levelsMaster=null;
var gameItemsMaster=null;
var gameRoomsListMaster=null;
var subscriptionMaster=null;
var notifyMaster=null;
var jobMaster=null;
var minigameViktorinaRoom=null;
var topOpytUsersList=[];
var topPopularUsersList=[];
var koronaadminList=[];
var topScoresUsersList=null;
var topMaps1UsersList=null;
var mainCfgObj={};
var ModeUsersListV=[];
var requestsMaster=null;
var mainMap=null
//var mapsIdsSelectObj=null;
var curBoarKonkursData=null;
var dressMaster=null;
var shopMaster=null;
var userMaster=null;
var accessUsersMaster=null;
var statsUsers=null;
var allTsHour=0;
var allTsDay=0;
var allTsOpytUpd=0;
var allTsPopularUpd=0;
var allTsTopScoresUpd=0;
var allTsTopMaps1Upd=0;
var startServerTS=0;
var gameRoomsList=[];
var paymentsList=[];
var paymentsAllList=[];
var cmdsArr=[];
var tmInterval=5;
var MainRoom=null;
var ModRoom=null;
var SystemRoom=null;
//var ModMapsRoom=null;
var AllUsersRoom=null;
var dialogsMaster=null;
var opytTopObjEvent=null;
var popularTopObjEvent=null;
var moneyGetModInfo={moder:50,maps:50,moderM:30,mapsM:30};

var dressSortCategory=[4,5,1,2,3,0]; // для сортировки одежды, сначала очки, потом голова и тд, чтобы очки на шляпу не попадали, а под неё, это только на сервере, так как в клиентской части не узнать категорию одежды, она не передаётся.

var priceTesterGetMoney=200;
var mapLevelsUsers2=6;
var trainTimeSpeed=8;
var actionItems1Count=10;
var opytWinnerUser=30;
var opytWinnerUser2=60;
var winnerUserLapkiV=5;
var winnerUserLapkiV2=10;
var winnerNewScoreLapki=50;
var levelNewUserMoney=50;
var maxReportChatCount=3;
var bonusKostiA1=15;
var worldRooms=[];
var banList=[];
var worldStream=null;
var worldClientsLimit=50;
var worldClientsViewCount=15;
var regNewUserMoney=100;
var regNewUserKosti=0;
var appVersion=3;
var countUsersDB=0;
var maxEnergyValue=100;
var priceSaveMapServerNew=100;
var priceSaveMapServer=200;
var priceOffNickRainbow=10;
var priceBuyStyle1=50;
var priceChangeNickColor=20;
var priceChangeNickResetColor=10;
//var priceSendChatColorMsg=2;
var priceSendChatColorMsg=0;
var energyRestoreSeconds=60*2;
var banPriceMinute=30;
var minusGameRoomOpytExit=5;
var updateBanValueMinute=2;
var enableGuestAuth=true;
var ActiveMainGameRoom=null;
var startGameRoomWait=5;
var maxTimeWaitSecUFO=60;
var minGameRoomUsers=1;
var maxGameRoomUsers=5;
var maxMiniChatMsgsHistory=150;
var limitMessagesRoom=30;
var shopExchangeMoney=30;
//var priceChangeNick=300;
var priceChangeNick=0;
var changeNickObjTime={};
var defLengthNick=20;
var prizeKostiHoursArr=[20,19,18,17,16];
var prizeKostiDaysArr=[50,45,40,35,30];
var maxSymbolsChatMsg=120;
var maxSymbolsWorldChatMsg=120;
var maxFloodSymbolNum=6;
var persWorldSpeed=500;

var bonusTopOpytData={lastLevel:0,step:10,items:[
10,20,25,33,40,48,56,64,70,80,
90,100,120,140,160,180,200,230,260,280,
300,330,360,390,420,450,480,510,540,580,
650,720,770,830,870,900,970,1050,1150,1200,
1400,1600,1850,2000,2200,2450,2600,2800,3000,3300]};

/*var bonusTopOpytData={lastLevel:0,step:10,items:[10,50,100,200,400,600,800,1000,1300,1500,2000,2300,2600,3000,3200,3450,3660,3800,4000,4200,4400,4600,4800,5000,5200,5400,5600,5800,6000,6300,6500,6600,6800,7000,7200,7400,7600,7800,8100,8200]};
var kk3=1;
var step=150;
for (var i = 0; i < 10; i++) {
var minV=8500;
var vv=Math.floor(minV+(i*step));
bonusTopOpytData.items.push(vv);
}*/

//console.log(bonusTopOpytData.items.length,bonusTopOpytData.items);
var systemUser=null;
//var newYearUser=null;
var boarUser=null;
var noUser=null;
var modMapsUser=null;

var sslObj=null;

if(!isWin){
sslObj={type:'letsencrypt',path:'/etc/letsencrypt/live/ag6.ru'};
}

/*var dt=new Date();
dt.setTime(Date.now());
dt.setHours(0);
dt.setMinutes(0);
dt.setSeconds(0);
console.log(dt,Math.floor(dt.getTime()/1000));*/

var userObjectDef={id:0,login:null,ip:'-',nick:null,gameMagicHand:0,isBot:false,vip:0,vip_end:0,vip_trial:0,mapLevel:1,opyt_hour:0,opyt_day:0,levelsEditor:0,authDevice:'',dogsCount:0,block:0,tester:0,energy:100,myWorldId:0,modMapsAdv:0,changeEnergyTime:0,actionItemsNums:0,actionItemsNumsRnd:0,actionItemsNumsValV:0,actionItemsNumsPos:1,changePersTime:0,pers:0,money:0,kosti:0,opyt:0,bantime:0,bantype:0,lastBarkTS:0,banChangeTime:0,mapsLevelMode:0,popular:0,popularIcon:0,lastLevel:1,level:1,mode:0,sex:1,health:100,trainScene:0,trainStatus:'ok',tempTrainScene:0,trainTimeEnd:0,lastGiftSendTS:0,lastChatMsgTS:0,giftFreeTime:0,quests1FreeTime:0,nick_itemid:0,authTime:0,authTimeCheckVal:0,isModMaps:false,domain:'',nickLength:0,nickChangeTime:0,testerGetMoneyTS:0,modGetMoneyTS:0,modMapsMoneyTS:0,nickRainbow:0,nickRainbow_end:0,nickRainbow_trial:0,nickColor_pos:-1,nickColor_end:0,nickColor_trial:0,boarKonkurs:0,iconEmoji:0,settingsList:[],toysLevelItems:1,toysNumsItems:0,toysItemsNumsRnd:0,isVipHappy1:0,curStyle1App:0,curStyle1Items:null,actionNYItems:0,actionNYItemsRnd:0,actionNYLevel:0,actionVal1:0,actionEggRnd:0};
var ChatRoomFlags={DELETE_MSG:1<<1,BAN_ACCESS:1<<2,MSG_REPORT_ACCESS:1<<3,RESTORE_MSG:1<<4};
var DIALOG_DEF=0;
var DIALOG_ROOM_M=-1;
var DIALOG_PRIVATE_USER=1;
var MONEY_LAPKI=1;
var MONEY_KOSTI=2;
var USER_MODE_USER=0;
var USER_MODE_MODERATOR=1<<1;
var USER_MODE_ADMIN=1<<2;
var USER_MODE_SUPER_ADMIN=1<<3;
var USER_MODE_MOD_MAPS=1<<4;
var USER_MODE_MOD_MAPS_M=1<<5;
var USER_MODE_MODERATOR_M=1<<6;
//console.log(USER_MODE_MODERATOR|USER_MODE_ADMIN|USER_MODE_SUPER_ADMIN|USER_MODE_MOD_MAPS);
var USER_MODE_UNDEFINED=-1;

function getBonusLevelTop(v){
for (var i = 0; i < bonusTopOpytData.items.length; i++) {
var el=bonusTopOpytData.items[i];
if(el>v){
return i;
}
}
return bonusTopOpytData.items.length;
}

//console.log(getBonusLevelTop(4));


function declination(n,titles){
var cases=[2,0,1,1,1,2];
var n2=2;
if(n%100>4 && n%100<20)n2=2;
else{
n2=cases[5];
if(n%10<5)n2=cases[n%10];
}
return n+' '+titles[n2];  
}

function getTimeInfo(time){
var _seconds=time;
var _years=Math.floor(_seconds / (60*60*24*365));
_seconds-=_years*(60*60*24*365);
//_seconds-=_years*(60*60*24*30*12);
var _months=Math.floor(_seconds / (60*60*24*30));
_seconds-=_months*(60*60*24*30);
var _weeks=Math.floor(_seconds / (60*60*24*7));
_seconds-=_weeks*(60*60*24*7);
var _days=Math.floor(_seconds / (60*60*24));
_seconds-=_days*(60*60*24);
var _hours=Math.floor(_seconds / (60*60));
_seconds-=_hours*(60*60);
var _minuts=Math.floor(_seconds / 60);
_seconds-=_minuts*60;
return {years:_years,months:_months,weeks:_weeks,days:_days,hours:_hours,minuts:_minuts,seconds:_seconds};
}


function getBanTimeStr(time){
var timeInfo=getTimeInfo(time);
var s='';
if(timeInfo.years>0){
s+=declination(timeInfo.years,['год','года','лет']);
s+='. ';
}
if(timeInfo.months>0){
s+=declination(timeInfo.months,['месяц','месяца','месяцев']);
s+='. ';
}
if(timeInfo.weeks>0){
s+=declination(timeInfo.weeks,['неделю','недели','недель']);
s+='. ';
}
if(timeInfo.days>0){
s+=declination(timeInfo.days,['день','дня','дней']);
s+='. ';
}
if(timeInfo.hours>0){
s+=declination(timeInfo.hours,['час','часа','часов']);
s+='. ';
}
if(timeInfo.minuts>0){
s+=declination(timeInfo.minuts,['минуту','минуты','минут']);
s+='. ';
}
if(timeInfo.seconds>0){
s+=declination(timeInfo.seconds,['секунду','секунды','секунд']);
s+='. ';
}
return s;
}



function getChatHistoryDate(dt1,cb){
if(dt1 && dt1.length>0 && cb){
dt1=dt1.split('.').join('_');
var nm='ChatHistory_1_'+dt1;
var arr=[];

var path=pathSaveHistoryMsgs+'/'+nm;
try{
var bb=fs.readFileSync(path);
var ba=new ByteArray(bb);

var nn=0;
var posend=-1;

while(ba.available()>0){
var t=ba.readShort();
var time=ba.readInt();
var flags=ba.readByte();
var ot=ba.readInt();
var komu=ba.readInt();
var msg='';
msg=ba.readString();
//console.log(t,time,msg);
if(msg.length>0)
arr.push({t:t,time:time,ot:ot,komu:komu,msg:msg});
nn+=1;
}

var ids=[];
var usersObj={};
for (var i = 0; i < arr.length; i++) {
var el=arr[i];
if(el!=null){
if(el.ot!=0 && !(el.ot in usersObj)){
ids.push(el.ot);
usersObj[el.ot]=1;
}
if(el.komu!=0 && !(el.komu in usersObj)){
ids.push(el.komu);
usersObj[el.komu]=1;
}
}
}

var usersData={};
if(systemUser)usersData[systemUser.id]={id:systemUser.id,nick:systemUser.nick};
request({method:'POST',url:'https://ag6.ru/dogsgame3/api.php?c=users.get',form:{id:ids.join(',')},rejectUnauthorized:false},function(error, response, body) {
if(error){
}else{
var ob=jsonDecode(body);
if(ob!=null && 'args' in ob && ob.args.length>0)ob=ob.args[0];
if(ob!=null && Array.isArray(ob)){
for (var i = 0; i < ob.length; i++) {
var el=ob[i];
usersData[el.id]=el;
}
}


var ss='';

var createTime=function(ts){
var date = new Date();
date.setTime(ts*1000);
var strsec='';
var strmin='';
var strhour='';
var sec=date.getSeconds();
var min=date.getMinutes();
var hours=date.getHours();
if (sec<10)strsec = "0"+sec;
else strsec = ""+sec;
if (min < 10)strmin = "0"+min;
else strmin = ""+min;
if (hours < 10){
strhour = "0"+hours;
}
else strhour = ""+hours;
return "["+strhour+":"+strmin+":"+strsec+"]";
};


var ids2=[];
var nickList=[];
for(var n in usersData){
ids2.push(parseInt(n));
nickList.push(usersData[n].nick);
}

ss+='<style>html, body{background:#3B1F11;color:#c9e79f;font-family:Arial;font-size:18px;}</style>';

ss+='История за '+dt1+'<br />';
ss+='В истории '+arr.length+' сообщений<br />';
ss+='Информация об участниках<br />';

for (var i = 0; i < ids2.length; i++) {
ss+='id '+ids2[i]+' -> '+nickList[i]+'<br />'
}
ss+='<br />История сообщений<br />';

/*ss+='id игроков '+ids2.join(', ')+'<br />';
ss+='ники игроков '+ids2.join(', ')+'<br />';*/
ss+='<br />';

var evMsgType={};
evMsgType[MessageType.BAN]='БАН';
evMsgType[MessageType.UNBAN]='РАЗБАН';
evMsgType[MessageType.GIFT_MSG]='ПОДАРОК';
evMsgType[MessageType.NICK_CHANGE]='СМЕНА НИКА';

for (var i = 0; i < arr.length; i++) {
var el=arr[i];
if(el.t<0)el.t=0;
var t3=el.t;
var time=createTime(el.time);
var timeStr='';
var nick1='нет ника';
var nick2='нет ника';
if(el.ot in usersData){
nick1=usersData[el.ot].nick;
}
if(el.komu in usersData){
nick2=usersData[el.komu].nick;
}
ss+=''+time+' ';
if(t3 in evMsgType)ss+='<span style="color:#FFFFFF;">['+evMsgType[t3]+']</span> ';

if(el.t==MessageType.NICK_CHANGE){
ss+='(id '+el.ot+')';
}else{
ss+='(id '+el.ot+', '+nick1+')';
}
if(el.t==MessageType.BAN){
ss+=' забанил(а)';
if(el.komu!=0 && el.ot!=el.komu)ss+=' (id '+el.komu+', '+nick2+')';
var banTime=castInt(el.msg);
ss+=' <span style="color:#FFFFFF;">на '+getBanTimeStr(banTime)+'</span>';
}else if(el.t==MessageType.UNBAN){
ss+=' разбанил(а)';
if(el.komu!=0 && el.ot!=el.komu)ss+=' (id '+el.komu+', '+nick2+')';
}else if(el.t==MessageType.NICK_CHANGE){
ss+=' новый ник <span style="color:#FFFFFF;">'+el.msg+'</span>';
}else if(el.t==MessageType.GIFT_MSG){
ss+=' подарил(а)';
if(el.komu!=0 && el.ot!=el.komu)ss+=' (id '+el.komu+', '+nick2+')';
ss+=' <span style="color:#FFFFFF;">'+el.msg+'</span>';
}else{
if(el.komu!=0 && el.ot!=el.komu)ss+=' для (id '+el.komu+', '+nick2+')';
ss+=' '+el.msg;
}
if(i!=arr.length-1)ss+='<br />';
}

if(cb)cb(ss);
}
});

ba.ba=null;
ba=null;
}catch(e){
if(cb)cb(null);
}
}
}

function gcRun(){
var ts=getTimestamp();
var tm1=ts-(60*60*24*7);
var minichatTime=ts-(60*60*24*3);
var topHistoryTime=ts-(60*60*24*7);
var mailHistoryTime=ts-(60*60*24*5);
var statsUserTime=ts-(60*60*24*7);

// удаляем из истории мини чата смс которые старше 3-ёх дней
mysql.query('DELETE FROM minichat_history WHERE time<?', [minichatTime], function(rows){});

mysql.query('DELETE FROM top_history WHERE time<?', [topHistoryTime], function(rows){});

mysql.query('DELETE FROM mail WHERE time<?', [mailHistoryTime], function(rows){});
}

function getClientIp(req){
if(req){
var ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
if(ip.indexOf(':')>-1){
var spl=ip.split(':');
ip=spl[spl.length-1];
}
if(ip.length>1)return ip;
}
return '127.0.0.1';
}


function checkCountFindStr(str,num){
if(str!=null){
for (var i = 0; i < str.length; i++) {
var ch=str.charCodeAt(i);
if(ch!=32){
var q=String.fromCharCode(ch);
var ss=q;
for (var k = 0; k < num; k++)ss+=q;
if(str.indexOf(ss)>-1)return true;
}
}
}
return false;
}


function checkCountFindStr2(str,num){
if(str!=null){
if(str.length>2){
var ch=str.charAt(0);
var ch2=str.charAt(1);
var spl=str.split(ch+ch2);
if(spl.length-1>num){
return true;
}
}
}
return false;
}

var regCheckNumberFlood=/[0-9]{12,}/;
function CheckIsFloodMsg(msg){
var flood1=checkCountFindStr(msg,maxFloodSymbolNum);
var flood2=checkCountFindStr2(msg,maxFloodSymbolNum);
if(flood1 || flood2){
return true;
}
if(msg && regCheckNumberFlood.test(msg))return true;
return false;
}

var regDupWords=/(.)\1{1,}/g;
var regWordsNoSymbols=/[^a-zа-я]/gi;
function correctChatMessage(s,ob){
if(s!=null){
var spl=s.split(' ');
var str='';
for (var i = 0; i < spl.length; i++){
var ss=spl[i];
var ss5=ss;
if(ss5){
/*if(checkMsgTematika(ss5)){
ss='*emoji1*';
if(ob)ob.isTematika=true;
}*/
ss5=ss5.replace(regDupWords,'$1');
ss5=ss5.replace(regWordsNoSymbols,'');
}
if(checkMsgTematika(ss5)){
ss='*emoji1*';
if(ob)ob.isTematika=true;
}
//ss=ss3;
str+=ss;
if(i!=spl.length-1)str+=' ';
}
s=str;
}
return s;
}

var tematikaArrList=[];

function checkMsgTematika(s){
var v=false;
if(s){
for (var i = 0; i < tematikaArrList.length; i++){
var el=tematikaArrList[i];
if(s.indexOf(el)===0){
v=true;
break;
}
}
}
return v;
}


function MysqlMaster(dbName, initCB){
this.dbName = dbName;
this.cfgConnect=null;
this.mysql = _mysql;
this.db=null;
this.initCB = initCB;
this.changeStatusCB=null;
}
copyProps(MysqlMaster.prototype,{
init:function(host,user,pass,charset){
this.cfgConnect = {host:host, user:user, password:pass, database:this.dbName};
var th = this;
if(typeof charset!=='undefined')this.cfgConnect.charset=charset;
!(function handleDisconnect() {
th.db = th.mysql.createConnection(th.cfgConnect);
th.db.connect(function(err) {
if(err) { 
console.log('error when connecting to db:', err);
setTimeout(handleDisconnect, 2000);
}else{
if(th.changeStatusCB!=null)th.changeStatusCB('ok');
if(th.initCB){
th.initCB(th.db);
th.initCB=null;
}
}
});

th.db.on('error', function(err) {
if(th.changeStatusCB!=null)th.changeStatusCB('error');
handleDisconnect();
});
})()
},

queryOne:function(){
var query=arguments[0];
var q = arguments.length-1;
var fields=[];
var cbok=null;

if(q>1){
fields=arguments[1];
cbok=arguments[2];
}
this.query(query,fields,function(rows){
if(rows && rows.length>0){
if(cbok){
cbok(rows[0])
}
}
});
},

query:function(){
var query=arguments[0];
var q = arguments.length-1;
var fields=[];
var cbok=null;

if(q>1){
fields=arguments[1];
cbok=arguments[2];
}

this.db.query({sql:query,values:fields}, function(err, rows, fields){
if(err){
cbok(null);
}else{
if(cbok){
cbok(rows);
}
}
});
},

close:function(){
try{
this.db.destroy();
}catch(e){}
}

});




function FlagsMaster1(arr){
this.arr=arr;
}
FlagsMaster1.prototype.parseStr=function(s){
if(s!=null && s.length>0){
var arr=s.split(',');
this.arr=[];
if(arr!=null && arr.length>0){
for (var i = 0; i < arr.length; i++) {
var el=parseInt(arr[i]);
if(!isNaN(el))this.arr.push(el);
}
}
}
};
FlagsMaster1.prototype.getStr=function(){
if(this.arr==null)this.arr=[];
var s=this.arr.join(',');
return s;
};
FlagsMaster1.prototype.push=function(n){
n-=1;
if(n>-1 && n>this.arr.length-1){
var nn=(n+1)-this.arr.length;
for (var i = 0; i < nn; i++)this.arr.push(0);
return true;
}
return false;
};

FlagsMaster1.prototype.check=function(n,id){
n-=1;
if(n>-1 && n<this.arr.length){
var flag=this.arr[n];
return (1<<id & flag)>0;
}
return false;
};
FlagsMaster1.prototype.add=function(n,id){
if(!this.check(n,id)){
n-=1;
if(n>-1 && n<this.arr.length){
var flag=this.arr[n];
flag=flag|1<<id;
this.arr[n]=flag;
}
}
};
FlagsMaster1.prototype.del=function(n,id){
if(this.check(n,id)){
n-=1;
if(n>-1 && n<this.arr.length){
var flag=this.arr[n];
flag&=~1<<id;
this.arr[n]=flag;
return true;
}
}
return false;
};
FlagsMaster1.prototype.clear=function(){
this.arr=[];
};


function StatsUsersMaster(){
this.ob={};
this.ob2={};
}

copyProps(StatsUsersMaster.prototype,{
update:function(){},
updateStatsDB:function(userid,fields){},
plusCount:function(t,user){},
setValue:function(t,user,value){}
});

function VKApi(token){
this.token=token;
}
VKApi.prototype.api=function(cmd,params,cbok,cberr){
if(this.token && this.token.length > 0){
var url='https://api.vk.com/method/'+cmd+'?v=5.88&access_token='+this.token;
request({method:'POST',url:url,form:params}, function (error, response, body) {
	if(error){
		if(typeof cberr!='undefined')cberr(error);
	}else{
		var ob=null;
		try{
			ob=JSON.parse(body);
		}catch(e){
		}
	    if(typeof cbok!='undefined')cbok(ob);
	}
});
}else{
if(typeof cberr!='undefined'){
setTimeout(function(){cberr({});}, 0);
}
}
};

VKApi.prototype.sendMessageUserGroup=function(groupID,userid,msg,cb){
if(msg!=null){
var th=this;
th.api('messages.send',{group_id:groupID,user_ids:userid,message:msg},function(body){
if(typeof cb!=='undefined')cb(body);
});
}
};

VKApi.prototype.sendPartsIdsNotify=function(arr,msg,cb){
if(msg!=null){
var th=this;
if(arr.length>0){
var ids=arr.shift();
var idsStr=ids.join(',');
var obj={};
obj['user_ids']=''+idsStr;
obj['message']=msg;

th.api('secure.sendNotification',obj,function(body){
//console.log(body);
th.sendPartsIdsNotify(arr,msg,cb);
},function(){
th.sendPartsIdsNotify(arr,msg,cb);
});
}else{
if(typeof cb!='undefined')cb();
}
}
};

VKApi.prototype.setUserLevel=function(id,level){
var th=this;
var obj={user_id:id,activity_id:1,value:level};
th.api('secure.addAppEvent',obj,function(body){
//console.log(body);
},function(){});
};

VKApi.prototype.setMission=function(id,mid,cb){
var th=this;
var obj={user_id:id,activity_id:mid};
th.api('secure.addAppEvent',obj,function(body){
if(typeof cb!=='undefined')cb();
},function(){
if(typeof cb!=='undefined')cb();
});
};


VKApi.prototype.sendMission=function(u,mid,cb){
var th=this;
if(u!=null){
var prefixAuth=u.getPrefixAuth();
if(prefixAuth=='vk'){
var loginUser=u.login.substr(2);
if(!u.checkMissionVK(mid)){
th.setMission(loginUser,mid,function(){
u.addMissionVK(mid);
if(typeof cb!=='undefined')cb();
});
}
}
}
};

VKApi.prototype.sendMessageByIds=function(ids,msg,cb){
if(msg!=null){
var parts=[];
var maxItems=100;
var aa=[];
for (var i = 0; i < ids.length; i++) {
aa.push(ids[i]);
if(aa.length>=maxItems){
parts.push(aa);
aa=[];
}
}
if(aa.length>0)parts.push(aa);
this.sendPartsIdsNotify(parts,msg,cb);
//console.log(parts);
}
};


function GameItemsMaster(){
		this.dbTable='usersItems';
	}

	GameItemsMaster.prototype.addGameItemFunc1=function(type,itemid,ot,user,cb){
		this.addGameItemNumsFunc1(type,itemid,1,ot,user,cb)
	};
	
	GameItemsMaster.prototype.addGameItemNumsFunc1=function(type,itemid,nums,ot,user,cb){
		var th=this;
		this.getGameItemByUserID(type,itemid,ot,user,function(obj){
			var ts=getTimestamp();
			if(obj!=null){
			var nn=obj.num+nums;
			mysql.query('UPDATE '+th.dbTable+' SET num=?, time=? WHERE id=?', [nn,ts,obj.id], function(rows){
				var res=true;
				if(!rows)res=false;
				if(typeof cb!=='undefined')cb(res);
			});
			}else{
				mysql.query('INSERT INTO '+th.dbTable+' (type,itemid,ot,user,num,time) VALUES (?,?,?,?,?,?)', [type,itemid,ot,user,nums,ts], function(rows){
					var res=true;
					if(!rows)res=false;
					if(typeof cb!=='undefined')cb(res);
				});
			}
		});
	};

	GameItemsMaster.prototype.getGameItemByUserID=function(type,itemid,ot,user,cb){
		mysql.query('SELECT * FROM '+this.dbTable+' WHERE itemid=? AND type=? AND ot=? AND user=?', [itemid,type,ot,user], function(rows){
			var v=null;
			if(rows!=null && rows.length>0)v=rows[0];
			if(typeof cb!=='undefined')cb(v);
		});
	};

	GameItemsMaster.prototype.isExistsGameItemByUserID=function(type,itemid,user,cb){
		mysql.query('SELECT id FROM '+this.dbTable+' WHERE itemid=? AND type=? AND user=?', [itemid,type,user], function(rows){
			var v=false;
			if(rows!=null && rows.length>0)v=true;
			if(typeof cb!=='undefined')cb(v);
		});
	};

	GameItemsMaster.prototype.init=function(cb){
		if(typeof cb!=='undefined'){
			cb();
		}
	};
	
	
function GameUsersItems(){
this.itemsObj={};
}

GameUsersItems.prototype.countItem=function(id){
var v=0;
if(id in this.itemsObj)v=this.itemsObj[id];
return v;
};

GameUsersItems.prototype.plusItem=function(id,v){
if((id in this.itemsObj)==false)this.itemsObj[id]=0;
var vv=this.itemsObj[id];
this.itemsObj[id]=vv+v;
};

GameUsersItems.prototype.minusItem=function(id,v){
if(id in this.itemsObj){
var vv=this.itemsObj[id];
var nn=vv-v;
if(nn<=0){
delete this.itemsObj[id];
}else{
this.itemsObj[id]=nn;
}
}
};

GameUsersItems.prototype.parse=function(o){
if(o!=null){
this.itemsObj=o;    
}
};
GameUsersItems.prototype.getStr=function(){
var s='';
try{
s=JSON.stringify(this.itemsObj);
}catch(e){}
return s;
};


function CallUFOScene(){
		this.stream=null;
		this.isClose=false;
		this.id=0;
		this.userid=0;
		this.ownerid=0;
		this.init();
		this.tm=null;
	}

	CallUFOScene.prototype.addUser=function(u){
		if(this.stream!=null){
			this.stream.room.join(u.connect.connect);
		}
	};

	CallUFOScene.prototype.init=function(){
		var th=this;
		this.stream=srv.createStream();
		this.id=this.stream.id;
		th.stream.onClose=function(){
		th.isClose=true;
		trace('close stream UFO');
	};
		th.stream.setInOutHanler(function(connect,isIn){
		var u=connect.user;
		if(isIn){
		th.stream.sendConnect(connect,'init',[]);
	}else{
		if(u!=null && u.id==th.ownerid){
			th.close();
		}
	}
	});

	th.stream.on('a',function(t,ob){
	var u=this.user;
	if(u!=null && arguments.length>0 && u.id==th.ownerid){
		if(t=='end'){
			th.close();
		}else if(t=='msg' && arguments.length>1){
			if(ob!=null){
			var msg=SubstrTxtChatSize(ob,maxSymbolsWorldChatMsg);
			var msg2=correctChatMessage(msg);
			if(msg!=msg2)msg=msg2;
			msg=msg.trim();
			th.stream.send('ev',['msg',msg]);
			}
		}
	}
	});

	this.tm=setInterval(function(){
		th.close();
	},maxTimeWaitSecUFO*1000);

	};

	CallUFOScene.prototype.close=function(){
		if(!this.isClose){
			if(this.tm!=null){
				clearInterval(this.tm);
			}
			this.isClose=true;
			this.stream.remove();
		}
	};
	
	

function MiniGameViktorina(){
var th=this;
this.stream=srv.createStream();
this.id=this.stream.id;
this.users=[];
this.tm1=null;
this.curItem=null;
this.stream.onClose=function(){
th.isClose=true;
//if(this.tm1!=null)clearInterval(this.tm1);
trace('close stream viktorina');
};

this.stream.setInOutHanler(function(connect,isIn){
var u=connect.user;
if(isIn){
var r=th.addUser(u.id,connect);
trace('user in viktorina '+u.id,r);
th.stream.sendConnect(connect,'init',[]);
}else{
var r=th.removeUser(connect);
trace('user out viktorina '+u.id,r);
}
});
trace('create minigame viktorina stream '+th.id);
}

MiniGameViktorina.prototype.init=function(){
var th=this;
th.nextVopros(function(){
console.log(th.curItem); 
});
  
};

MiniGameViktorina.prototype.nextVopros=function(cb){
var th=this;
mysql.query('SELECT * FROM viktorina_zagadki ORDER BY RAND() LIMIT 1', [], function(rows){
if(rows!=null && rows.length>0){
var ob=rows[0];
th.curItem=ob;
}
if(typeof cb!=='undefined')cb();
});
};

MiniGameViktorina.prototype.addUser=function(id,connect){
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

MiniGameViktorina.prototype.removeUser=function(connect){
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


function DressMaster(){
this.items=[];
this.itemsObj={};
this.itemsCategory={};
this.dressSysDataAction=null;
}
DressMaster.prototype.init=function(cb){
		var th=this;
		mysql.query('SELECT * FROM shop_dress WHERE status=?', [1], function(rows){
		th.items=[];
		th.itemsObj={};
		th.itemsCategory={};
			if(rows){
				for (var i = 0; i < rows.length; i++) {
					var el=rows[i];
					var ob=th.parseDBObj(el);
					if(ob){
					th.items.push(ob);
					th.itemsObj[ob.id]=ob;
					var categ=ob.category;
					if(!(categ in th.itemsCategory))th.itemsCategory[categ]=[];
					var itemsArr=th.itemsCategory[categ];
					itemsArr.push(ob);
					}
				}
			}
			//console.log(th.itemsCategory);
			//console.log(th.items);
			th.reloadDressSystemAction();
			if(typeof cb!=='undefined')cb();
			/*var a2=th.getCategoryListRandom(3);
			for (var i = 0; i < a2.length; i++) {
			var ct=a2[i];
			var item=th.getItemRandomByCategory(ct,0);
			console.log(ct,item);
			}*/
			
		});
};

DressMaster.prototype.checkDressIdsSystem=function(ids,u){
var th=this;
var ob={};
var nums=0;
var ob5=th.dressSysDataAction;
if(ob5 && ob5.items){
var items=ob5.items;
if(items){
var allNum=items.length;
if(ids.length==allNum){
for (var i = 0; i < items.length; i++) {
var el=th.getItemByID(items[i]);
if(el)ob[el.id]=1;
}

if(ids){
for (var i = 0; i < ids.length; i++){
var idd=ids[i];
if(idd in ob)nums+=1;
}
}
if(nums>=allNum){
if(u && 'winnersUsers' in ob5 && ob5.winnersUsers){
for (var i = 0; i < ob5.winnersUsers.length; i++) {
if(ob5.winnersUsers[i]==u.id)return false;
}
ob5.winnersUsers.push(u.id);
th.saveDressSystemAction();
}
return true;
}
}
}
}
return false;
};

DressMaster.prototype.resetDressSystemAction=function(){
var th=this;
var ids2=[];
var dressSys=th.genDressSystemAction();
if(dressSys && dressSys.length>0){
if(dressSys){
for (var i = 0; i < dressSys.length; i++){
var el=dressSys[i];
ids2.push(el.id);
}
}
}
var perc=30+Math.floor(Math.random()*40);
th.dressSysDataAction={items:ids2,winnersUsers:[],prizePerc:perc};
th.saveDressSystemAction();
};

DressMaster.prototype.saveDressSystemAction=function(){
updatePropMainConfig('dress_system_data',this.dressSysDataAction);
};

DressMaster.prototype.reloadDressSystemAction=function(){
var th=this;
if(mainCfgObj.dress_system_data)th.dressSysDataAction=mainCfgObj.dress_system_data;

if(!th.dressSysDataAction){
th.resetDressSystemAction();
}
/*if(th.dressSystemItems){
var ids2=[];
for (var i = 0; i < th.dressSystemItems.length; i++)ids2.push(th.dressSystemItems[i].id);
ids2[ids2.length-1]=0;
console.log(ids2,th.checkDressIdsSystem(ids2));
}*/
};

DressMaster.prototype.genDressSystemAction=function(){
var th=this;
var arr=[];
var categNums=1+Math.floor(Math.random()*dressSortCategory.length);
if(categNums<3)categNums=3;
var a2=th.getCategoryListRandom(categNums);
if(a2){
for (var i = 0; i < a2.length; i++) {
var ct=a2[i];
var item=th.getItemRandomByCategory(ct,0);
if(item)arr.push(item);
}
}
return arr;
};

DressMaster.prototype.getItemRandomByCategory=function(t,priceType){
var th=this;
var v=null;
var arr=[];
t=castInt(t);
if(t in th.itemsCategory){
var categItems=th.itemsCategory[t];
v=th.getItemRandom(categItems,0);
}
return v;
};

DressMaster.prototype.getItemRandom=function(arr,priceType){
var th=this;
var v=null;
var a=[];
if(arr){
for (var i = 0; i < arr.length; i++) {
var el=arr[i];
if(el && el.price_type==priceType)a.push(el);
}
}
if(a.length>0)v=a.random();
return v;
};

DressMaster.prototype.getCategoryListRandom=function(num){
var th=this
var arr=[];
var a=[];
for(var n in th.itemsCategory){
var categ=castInt(n);
a.push(categ);
}

if(num>0){
shuffleArray(a);
if(num>a.length)num=a.length;
for (var i = 0; i < num; i++) {
arr.push(a[i]);
}
}
return arr;
};

DressMaster.prototype.reloadShopDressID=function(id,cb){
var th=this;
mysql.query('SELECT * FROM shop_dress WHERE id=?', [id], function(rows){
var ob=null;
if(rows && rows.length>0){
ob=th.parseDBObj(rows[0]);
}

if(ob){

var users=MainRoom.users;
for (var i = 0; i < users.length; i++) {
var u=users[i];
if(u!=null){
var dItems=u.dressItems;
if(dItems){
for (var k = 0; k < dItems.length; k++) {
var el=dItems[k];
if(el && el.itemid==ob.id){
if('category' in ob){
el.category=ob.category;
}
}
}
}
}
}

var item=th.getItemByID(ob.id);
if(item){
//console.log(item,ob);
if('category' in ob)item.category=ob.category;
if('price' in ob)item.price=ob.price;
if('price_type' in ob)item.price_type=ob.price_type;
if('status' in ob)item.status=ob.status;
if('name' in ob)item.name=ob.name;
if('bonus_opyt' in ob)item.bonus_opyt=ob.bonus_opyt;
}

if(cb)cb(true);
//console.log(ob);
}else{
if(cb)cb(false);
}

});
};


DressMaster.prototype.getBonusPercentByItemsIDS=function(arr){
var th=this;
var v=0;
if(arr && arr.length>0){
for (var i = 0; i < arr.length; i++) {
var id=arr[i];
var item=th.getItemByID(id);
if(item && item.bonus_opyt>0)v+=item.bonus_opyt;
}

var ob5=th.dressSysDataAction;
if(ob5 && 'prizePerc' in ob5 && ob5.prizePerc>0){
var v3=th.checkDressIdsSystem(arr,null);
if(v3){
var percV=ob5.prizePerc;
var bonusV=Math.floor(v*(percV/100));
if(bonusV>0)v+=bonusV;
}
}

}
return v;
};

DressMaster.prototype.parseDBObj=function(o){
if(o){
var ob={id:o['id'],category:o['category'],bonus_opyt:o['bonus_opyt'],name:o['name'],price:o['price'],price_type:o['price_type']};
return ob;
}
return null;
};

DressMaster.prototype.parseDBObjItemUser=function(o){
if(o){
var ob={id:o.id,itemid:o.itemid,category:o.category,end_time:o.end_time,status:o.status};
return ob;
}
return null;
};

DressMaster.prototype.getItemByID=function(id){
var th=this;
if(id>0){
if(id in th.itemsObj)return th.itemsObj[id];
/*for (var i = 0; i < th.items.length; i++) {
var el=th.items[i];
if(el && el.id==id)return el;
}*/
}
return null;
};

DressMaster.prototype.getItemExpireSecs=function(o){
var v=0;
if(o){
if(typeof o=='object'){
if('end_time' in o){
var tm=o.end_time-getTimestamp();
if(tm<0)tm=0;
v=tm;
}
}
}
return v;
};

DressMaster.prototype.getDressListByUserID=function(userid,cb){
var th=this;
if(userid>0){
var arr=[];
mysql.query('SELECT usersDress.*, shop_dress.category as category FROM usersDress INNER JOIN shop_dress on shop_dress.id=usersDress.itemid WHERE usersDress.user=?', [userid], function(rows){
if(rows && rows.length>0){
for (var i = 0; i < rows.length; i++) {
var el=th.parseDBObjItemUser(rows[i]);
if(el)arr.push(el);
}
}
if(typeof cb=='function')cb(arr);
});
}
};

DressMaster.prototype.updateDressItemStatus=function(id,status,cb){
var th=this;
if(id>0){
mysql.query('UPDATE usersDress SET status=? WHERE id=?', [status,id], function(rows){
if(rows){
if(typeof cb=='function')cb(true);
}else{
if(typeof cb=='function')cb(false);
}
});
}
};

DressMaster.prototype.isItemExpire=function(o){
var tm=this.getItemExpireSecs(o);
if(tm<=0)return true;
return false;
};


function NotifyMaster(){
		this.table1='notifyUsers';
		this.listItems=[];
		this.listItemsNoSave=[];
	}

	NotifyMaster.prototype.addNotifyV=function(userid,type,ot,args,isSave){
	var ts=getTimestamp();
	var t2='notify.type2';
	var ob={id:0,userid:userid,type:type,ot:ot,args:args,time:ts};
	if(isSave){
		this.listItems.push(ob);
	}else{
		this.listItemsNoSave.push(ob);
	}
	if(userid==0){
		if(MainRoom!=null)MainRoom.emitRoom(t2,type);
	}else{
		if(MainRoom!=null){
			var u=MainRoom.getUserByID(userid);
			if(u!=null){
				u.emit(t2,type);
			}
		}
	}
	}

	NotifyMaster.prototype.delNotifyByIDAndUserID=function(id,userid,cb){
		var th=this;
		mysql.query('SELECT * FROM '+th.table1+' WHERE id=? AND user=?', [id,userid], function(rows){
			if(rows!=null && rows.length>0){
				var el=rows[0];
				if(th.isDelMsgByType(el.type)){
					mysql.query('DELETE FROM '+th.table1+' WHERE id=?', [el.id], function(rows){
						if(rows){
							if(typeof cb!='undefined')cb(true);
						}else{
							if(typeof cb!='undefined')cb(false);
						}
					});
					
				}
			}else{
				if(typeof cb!='undefined')cb(false);
			}
		});
	}

	NotifyMaster.prototype.addNotifyDB=function(userid,type,ot,args,cb){
		var ts=getTimestamp();
		var argsStr='';
		if(args!=null)argsStr=jsonEncode(args);
		mysql.query('INSERT INTO '+this.table1+' (type,ot,user,args,time) VALUES (?,?,?,?,?)', [type,ot,userid,argsStr,ts], function(rows){
			var res=true;
			if(!rows)res=false;
			if(typeof cb!=='undefined')cb(res);
			});
	}

	NotifyMaster.prototype.getNotifyListByUser=function(id,cb,cberr){
		var th=this;
		var usersObj={};
		var arr=[];
		var users=[];

		for (var i = this.listItemsNoSave.length - 1; i >= 0; i--) {
			var el=this.listItemsNoSave[i];
			if(el.userid==id || el.userid==0){
			if((el.ot in usersObj)==false){
			usersObj[el.ot]=1
			users.push(el.ot);
			}
			var flags=0;
			var ob=[el.id,el.type,el.ot,el.args,el.time,flags];
			arr.push(ob);
			}
		}

		for (var i = this.listItems.length - 1; i >= 0; i--) {
			var el=this.listItems[i];
			if(el.userid==id || el.userid==0){
			if((el.ot in usersObj)==false){
			usersObj[el.ot]=1
			users.push(el.ot);
			}
			var flags=0;
			var ob=[el.id,el.type,el.ot,el.args,el.time,flags];
			arr.push(ob);
			}
		}

		mysql.query('SELECT * FROM '+this.table1+' WHERE user=? ORDER BY time DESC', [id], function(rows){
			if(!rows){
				if(typeof cberr!='undefined')cberr();
				return;
			}
			
			if(rows!=null){
				for (var i = 0; i < rows.length; i++) {
					var el=rows[i];
					if(el.ot!=0 && (el.ot in usersObj)==false){
						usersObj[el.ot]=1
						users.push(el.ot);
					}
					var args=jsonDecode(el.args);
					var flags=0;
					if(th.isDelMsgByType(el.type)){
						flags|=1<<1;
					}
					var ob=[el.id,el.type,el.ot,args,el.time,flags];
					arr.push(ob);
				}
			}

			if(typeof cb!=='undefined')cb({users:users,arr:arr});
		});
	}

	NotifyMaster.prototype.isDelMsgByType=function(t){
		if(t=='systemMsg')return false;
		return true;
	}

	NotifyMaster.prototype.init=function(cb){
		if(typeof cb!=='undefined')cb();
	}

	NotifyMaster.prototype.saveDB=function(){
		var th=this;
		if(th.listItems.length>0){
			var s1='';
			var aa=[];
			for (var i = 0; i < th.listItems.length; i++) {
			var el=th.listItems[i];
			s1+='(?,?,?,?,?)';
			if(i!=th.listItems.length-1)s1+=', ';
			var argsStr=jsonEncode(el.args);
			aa.push(el.type);
			aa.push(el.ot);
			aa.push(el.userid);
			aa.push(argsStr);
			aa.push(el.time);
		}

		mysql.query('INSERT INTO '+this.table1+' (type,ot,user,args,time) VALUES '+s1, aa, function(rows){
			if(!rows){

			}else{
				th.listItems=[];
			}
		});

		}
	}



function UserModeFunc(){
this.isUndefined = function(m){return m==USER_MODE_UNDEFINED;};
this.isModerator = function(m){return (USER_MODE_MODERATOR & m)>0;};
this.isModeratorM = function(m){return (USER_MODE_MODERATOR_M & m)>0;};
this.isAdmin = function(m){return (USER_MODE_ADMIN & m)>0;};
this.isSuperAdmin = function(m){return (USER_MODE_SUPER_ADMIN & m)>0;};
this.isModeratorMaps = function(m){return (USER_MODE_MOD_MAPS & m)>0;};
this.isModeratorMapsM = function(m){return (USER_MODE_MOD_MAPS_M & m)>0;};
this.isAdminOrSuperAdmin = function(m){
if(this.isAdmin(m) || this.isSuperAdmin(m))return true;
return false;
};
this.isAdminModerator = function(m){
if(this.isAdmin(m) || this.isSuperAdmin(m) || this.isModerator(m))return true;
return false;
};
this.isModerator2 = function(m){
if(this.isModerator(m) || this.isModeratorM(m))return true;
return false;
};
this.isModeratorMaps2 = function(m){
if(this.isModeratorMaps(m) || this.isModeratorMapsM(m))return true;
return false;
};
return this;
}

var UserMode = new UserModeFunc();

/*for(var n in UserMode){
global[n]=UserMode[n];
}*/


var _8martaPrizes=[];
var _8martaDays=[];
//var _8martaDaysTitles=['Подарки!','Подарки!','Подарки!'];
var _8martaDaysTitles=['-','-','-'];


function randMinMax(min,max){
var rand=min + Math.random() * (max - min);
return Math.round(rand);
}

function nextDay8marta(){
}

function getEvDayPrizeTitle(type,v){
if(typeof v=='undefined')v=0;
var ss='';
if(type=='opyt')ss=''+v+' опыта';
else if(type=='popular')ss=''+v+' популярности';
else if(type=='vip1')ss='золотой vip на день';
else if(type=='vip7')ss='золотой vip на неделю';
else if(type=='lapki')ss=v+' лапок';
else if(type=='kosti')ss=v+' косточек';
else if(type=='gift')ss='подарок';
else if(type=='nickRainbow')ss='радужный ник (на неделю)';
else if(type=='nickColor')ss='ник с выбором цвета (на неделю)';
return ss;
}

function isEndCurrentEventT2(user){
var findEvent=getCurrentEventT2(null);
if(findEvent && findEvent.days && findEvent.curDay<findEvent.days.length){
var dayObj=findEvent.days[findEvent.curDay];
if(user){
if(dayObj && dayObj.list){
var allLevels=dayObj.list.length;
if(user.actionNYLevel<allLevels){
}else{
return true;
}
}
}
return false;
}
return true;
}

function getCurrentEventT2(ev){
if(eventsActionMaster){
if(!ev)ev=eventsActionMaster.findEventByCollectionType('evDay');
if(ev && 'collectionData' in ev && ev.collectionData!=null){
var dt1=ev.collectionData;
if(dt1.type=='evDay'){
var ts=getTimestamp();
var dayTime=60*60*24;
var tm1=ts-ev.start_ts;
//tm1+=dayTime*1;
if(tm1<0)tm1=0;
var v=Math.floor(tm1/dayTime);
ev.num1=v;

if(v!=ev.lastday){
ev.lastday=v;

var allUsers=MainRoom.users;
for (var i = 0; i < allUsers.length; i++){
var u=allUsers[i];
if(u!=null){
u.actionNYLevel=0;
u.actionNYItems=0;
}
}

mysql.query('UPDATE users SET actionNYLevel=?, actionNYItems=?',[0,0],function(rows){});
mysql.query('UPDATE events_action SET lastday=? WHERE id=?',[v,ev.id],function(rows){});
}

if('data' in dt1){
var dt2=dt1.data;
if(dt2){
var days=dt2.list;
if(!days)days=[];
var ob={id:dt1.id,curDay:ev.num1,tt:ev.type,type:dt1.type,name:dt1.name,days:days};
return ob;
}
}
}
}
}
return null;
}

/*function getEvType2CurrentDay(){
if(eventType2Obj){
var v=0;
eventType2Obj.num1=v;
if(v<_8martaDays.length)return _8martaDays[v];
}
return null;
}*/

function add8martaPrize(n,type,v){
if(typeof v=='undefined')v=0;
var ss='';
if(type=='opyt')ss=''+v+' опыта';
else if(type=='popular')ss=''+v+' популярности';
else if(type=='vip1')ss='золотой vip на день';
else if(type=='vip7')ss='золотой vip на неделю';
else if(type=='lapki')ss=v+' лапок';
else if(type=='kosti')ss=v+' косточек';
else if(type=='gift')ss='подарок';
else if(type=='nickRainbow')ss='радужный ник (на неделю)';
else if(type=='nickColor')ss='ник с выбором цвета (на неделю)';
_8martaPrizes.push({n:n,type:type,v:v,title:ss});
}

/*
add8martaPrize(6,'vip1',0);
add8martaPrize(8,'gift',35);
add8martaPrize(7,'vip1',0);
add8martaPrize(6,'vip1',0);
add8martaPrize(8,'vip1',0);
add8martaPrize(8,'vip1',0);
add8martaPrize(6,'nickRainbow',0);
add8martaPrize(8,'gift',35);
add8martaPrize(8,'gift',26);
add8martaPrize(8,'gift',35);

add8martaPrize(7,'gift',35);
add8martaPrize(8,'gift',35);
add8martaPrize(8,'gift',35);
add8martaPrize(6,'kosti',800);
add8martaPrize(8,'gift',35);
add8martaPrize(8,'vip1',0);
add8martaPrize(7,'lapki',2000);
add8martaPrize(8,'vip1',0);
add8martaPrize(6,'kosti',1000);
add8martaPrize(8,'popular',800);

add8martaPrize(8,'nickColor',0);
add8martaPrize(7,'lapki',5000);

var arr2=[[8,"lapki",944],[7,"opyt",1088],[8,"lapki",1231],[7,"lapki",1375],[8,"opyt",1519],[7,"lapki",1663],[8,"lapki",1807],[7,"opyt",1952]];

for (var i = 0; i < arr2.length; i++){
var el=arr2[i];
var n1=el[0];
var tt=el[1];
var vv=el[2];
add8martaPrize(n1,tt,vv);
//console.log(n1,tt,vv);
}
_8martaDays.push(_8martaPrizes);
_8martaPrizes=[];
*/


add8martaPrize(6,'vip1',0);
add8martaPrize(8,'gift',35);
add8martaPrize(7,'vip1',0);
add8martaPrize(8,'gift',35);
add8martaPrize(8,'gift',26);
add8martaPrize(8,'gift',35);
add8martaPrize(8,'kosti',200);
add8martaPrize(7,'opyt',1000);
add8martaPrize(8,'popular',200);
add8martaPrize(8,'vip1',0);

add8martaPrize(7,'gift',26);
add8martaPrize(7,'opyt',3000);
add8martaPrize(8,'gift',26);
add8martaPrize(10,'lapki',3000);
add8martaPrize(9,'gift',35);
add8martaPrize(8,'gift',26);
add8martaPrize(9,'vip1',0);
add8martaPrize(8,'lapki',4000);
add8martaPrize(8,'opyt',5000);
add8martaPrize(10,'popular',400);

_8martaDays.push(_8martaPrizes);
_8martaPrizes=[];

add8martaPrize(8,'gift',35);
add8martaPrize(8,'gift',35);
add8martaPrize(7,'vip1',0);
add8martaPrize(8,'gift',35);
add8martaPrize(7,'gift',26);
add8martaPrize(8,'kosti',200);
add8martaPrize(7,'gift',26);
add8martaPrize(7,'opyt',5000);
add8martaPrize(9,'popular',200);
add8martaPrize(10,'vip1',0);

add8martaPrize(7,'opyt',3000);
add8martaPrize(7,'gift',26);
add8martaPrize(10,'lapki',3000);
add8martaPrize(8,'gift',26);
add8martaPrize(7,'opyt',3000);
add8martaPrize(9,'gift',35);
add8martaPrize(8,'gift',26);
add8martaPrize(8,'opyt',5000);
add8martaPrize(7,'popular',400);
add8martaPrize(10,'vip1',0);

_8martaDays.push(_8martaPrizes);
_8martaPrizes=[];



/*add8martaPrize(3,'vip1',0);
add8martaPrize(3,'gift',35);
add8martaPrize(3,'vip1',0);
add8martaPrize(4,'vip1',0);
add8martaPrize(3,'vip1',0);
add8martaPrize(4,'gift',26);
add8martaPrize(3,'gift',26);
add8martaPrize(3,'gift',26);
add8martaPrize(4,'nickColor',0);
add8martaPrize(4,'vip1',0);

add8martaPrize(3,'gift',35);
add8martaPrize(4,'gift',35);
add8martaPrize(3,'gift',35);
add8martaPrize(4,'gift',35);
add8martaPrize(4,'kosti',1500);
//add8martaPrize(4,'kosti',500);

_8martaDays.push(_8martaPrizes);
_8martaPrizes=[];

_8martaDays.push(_8martaPrizes);
_8martaPrizes=[];*/

/*add8martaPrize(4,'popular',400);
add8martaPrize(4,'gift',35);
add8martaPrize(4,'gift',35);
add8martaPrize(4,'popular',200);
add8martaPrize(3,'kosti',100);
add8martaPrize(4,'lapki',4000);
add8martaPrize(4,'gift',35);
add8martaPrize(3,'gift',26);
add8martaPrize(3,'kosti',200);
add8martaPrize(4,'lapki',5000);
add8martaPrize(4,'vip1',0);*/

/*var aa6789=[34,33,26,32,26,35,26,35,26,35,35,35,35,35,35];
var aa67892=[3,4,4,3,4,4,3,4,3,3,4,4,4,4,4];
for (var i = 0; i < aa6789.length; i++) {
add8martaPrize(aa67892[i],'gift',aa6789[i]);
}
_8martaDays.push(_8martaPrizes);
_8martaPrizes=[];*/


/*add8martaPrize(3,'vip1',0);
add8martaPrize(4,'nickRainbow',0);
add8martaPrize(4,'popular',400);
add8martaPrize(4,'vip1',0);
add8martaPrize(3,'nickColor',0);
add8martaPrize(4,'vip1',0);
add8martaPrize(4,'gift',35);
add8martaPrize(4,'vip1',0);
add8martaPrize(3,'gift',26);
add8martaPrize(4,'vip1',0);

add8martaPrize(4,'gift',35);
add8martaPrize(3,'vip1',0);
add8martaPrize(4,'popular',200);
add8martaPrize(3,'kosti',100);
add8martaPrize(4,'lapki',4000);
add8martaPrize(4,'gift',35);
add8martaPrize(3,'gift',26);
add8martaPrize(3,'kosti',200);
add8martaPrize(4,'lapki',5000);
add8martaPrize(4,'vip1',0);

_8martaDays.push(_8martaPrizes);
_8martaPrizes=[];*/

/*var k1=1.0;
for (var i = 0; i < 25; i++){
var n1=5;
var tt='lapki';
if(i%2==1)n1-=1;
if(i%3==1)tt='opyt';
k1+=0.1;
var vv=Math.floor(400*k1);
add8martaPrize(n1,tt,vv);
}
_8martaDays.push(_8martaPrizes);
_8martaPrizes=[];


var k1=1.0;
for (var i = 0; i < 30; i++){
var n1=5;
var tt='opyt';
if(i%2==1)n1+=1;
k1+=0.4;
var vv=Math.floor(400*k1);
add8martaPrize(n1,tt,vv);
}

_8martaDays.push(_8martaPrizes);
_8martaPrizes=[];

add8martaPrize(4,'vip1',0);
add8martaPrize(5,'nickRainbow',0);
add8martaPrize(5,'nickColor',0);
add8martaPrize(4,'popular',400);
add8martaPrize(4,'vip1',0);

add8martaPrize(5,'gift',35);
add8martaPrize(5,'gift',26);
add8martaPrize(5,'gift',32);
add8martaPrize(5,'gift',28);
add8martaPrize(5,'gift',26);

add8martaPrize(4,'popular',200);
add8martaPrize(5,'kosti',100);
add8martaPrize(4,'lapki',400);
add8martaPrize(5,'gift',28);
add8martaPrize(5,'gift',26);

_8martaDays.push(_8martaPrizes);
_8martaPrizes=[];
var nn=0
for (var i = 0; i < 15; i++){
var n1=5+i;
var vv=30*(i+1);
nn+=vv
add8martaPrize(n1,'kosti',vv);
}

_8martaDays.push(_8martaPrizes);
_8martaPrizes=[];

add8martaPrize(4,'popular',200);
add8martaPrize(5,'kosti',100);
add8martaPrize(4,'lapki',400);
add8martaPrize(4,'vip1',0);
add8martaPrize(5,'opyt',1000);
add8martaPrize(5,'opyt',1200);
add8martaPrize(4,'lapki',500);
add8martaPrize(5,'popular',300);
add8martaPrize(5,'gift',26);
add8martaPrize(4,'vip1',0);
add8martaPrize(5,'opyt',1100);
add8martaPrize(4,'lapki',400);
add8martaPrize(5,'opyt',1200);
add8martaPrize(5,'opyt',1400);
add8martaPrize(5,'vip1',0);
add8martaPrize(5,'popular',300);
add8martaPrize(5,'opyt',1000);
add8martaPrize(4,'lapki',500);
add8martaPrize(5,'kosti',100);
add8martaPrize(5,'gift',26);

_8martaDays.push(_8martaPrizes);
_8martaPrizes=[];
*/

function generateWebApiKeyUser(id){
var ts=getTimestamp();
var s=id+'_'+ts+'_'+secretKeyWeb;
var sign=id+'_'+ts+'_'+md5(s);
return sign;
}

function addBanList(id,name,time,access){
var ob={id:id,name:name,time:time,access:access};
banList.push(ob);
}

addBanList(1,'1 минута',60,0);
addBanList(2,'5 минут',60*5,0);
addBanList(3,'15 минут',60*15,0);
addBanList(4,'30 минут',60*30,0);
addBanList(5,'1 час',60*60,0);
addBanList(6,'день',60*60*24,USER_MODE_MODERATOR|USER_MODE_MODERATOR_M);
addBanList(7,'неделя',60*60*24*7,USER_MODE_MODERATOR);
addBanList(8,'месяц',60*60*24*30,USER_MODE_SUPER_ADMIN);

var popularList=[];

/*function addPopularLevel(arr){
popularList=arr;    
}
function addPopularPart(id,opyt){
var ob=[id,opyt];
return ob;
}
addPopularLevel([addPopularPart(1,50),addPopularPart(2,500),addPopularPart(3,5000),addPopularPart(4,20000)]);
*/

function isUserLoginExists(v,cb){
if(v!=null && v.length>0){
mysql.query('SELECT id FROM users WHERE login=?',[v],function(rows){
var qq=false;
if(rows && rows.length>0)qq=true;
if(cb)cb(qq);
});
}else{
if(cb)cb(false);
}
}

function findTextColorByPos(v){
if(v>-1 && v<chatTextColorList.length){
var vv=chatTextColorList[v];
return vv;
}
return null;
}


function resetItems2Func(){
if(MainRoom){
var allUsers=MainRoom.users;
for (var i = 0; i < allUsers.length; i++){
var u=allUsers[i];
if(u!=null){
u.actionNYLevel=0;
u.actionNYItems=0;
u.actionVal1=0;
}
}
}
mysql.query('UPDATE users SET actionNYLevel=?, actionNYItems=?, action_val1=?',[0,0,0],function(rows){});
}


function updateChangeNickTime(){
var ts=getTimestamp();
var arr=[];
for(var n in changeNickObjTime){
var tm=changeNickObjTime[n];
if(ts>=tm)arr.push(n);
}

if(arr.length>0){
for (var i = 0; i < arr.length; i++) {
var el=arr[i];
if(el in changeNickObjTime)delete changeNickObjTime[el];
}
}

}



function loadTopInfoCB(t,cb){
var tt='hour';
if(t=='day')tt='day';
if(t=='opyt'){
var ts=getTimestamp();
var tm=allTsOpytUpd-ts;
if(tm<=0)tm=0;
var o=topOpytUsersList;
o.time=tm;
if(cb)cb(o);
}else if(t=='popular'){
var ts=getTimestamp();
var tm=allTsPopularUpd-ts;
if(tm<=0)tm=0;
var o=topPopularUsersList;
o.time=tm;
if(cb)cb(o);
}else if(t=='scores'){
var ts=getTimestamp();
if(ts>=allTsTopScoresUpd){
reloadTopScoresUsers(function(dt){
var ts=getTimestamp();
var tm=allTsTopScoresUpd-ts;
var dt6=topScoresUsersParseList(dt);
if(tm<=0)tm=0;
var o={time:tm,data:dt6,allCount:dt.allCount};
if(cb)cb(o);
});
}else{
var tm=allTsTopScoresUpd-ts;
if(tm<=0)tm=0;
var dt6=topScoresUsersParseList(topScoresUsersList);
var o={time:tm,data:dt6,allCount:topScoresUsersList.allCount};
if(cb)cb(o);
}
}else if(t=='maps1'){
var ts=getTimestamp();
if(ts>=allTsTopMaps1Upd){
reloadTopMaps1Users(function(dt){
var ts=getTimestamp();
var tm=allTsTopMaps1Upd-ts;
if(tm<=0)tm=0;
var o={time:tm,data:dt};
if(cb)cb(o);
});
}else{
var tm=allTsTopMaps1Upd-ts;
if(tm<=0)tm=0;
var o={time:tm,data:topMaps1UsersList};
if(cb)cb(o);
}
}
else{
var o=topM.getDataObj(tt);
if(cb)cb(o);
}
}



function getTimestampByDate(month,day,hour,min){
var dt1=new Date();
var monthStr=''+month;
var dayStr=''+day;
var hourStr=''+hour;
var minStr=''+min;
var sec=25;
var year=dt1.getFullYear();
var secStr=''+sec;
if(month<10)monthStr='0'+monthStr;
if(day<10)dayStr='0'+dayStr;
if(hour<10)hourStr='0'+hourStr;
if(min<10)minStr='0'+minStr;
if(sec<10)secStr='0'+secStr;
var dt=new Date(year+'-'+monthStr+'-'+dayStr+'T'+hourStr+':'+minStr+':'+secStr);
var tm=Math.floor(dt.getTime()/1000);
return tm;
}

function generateSessionOwner(num){
//var alphabet = 'abcdefghijklmnopqrstuvwxyz';
var alphabet = '1234567890';
var pass = '';
for(var i=0;i<num;i++) {
var n=Math.floor(Math.random()*alphabet.length);
pass+=alphabet[n];
}
return pass;
}


function createSessionIDOwner(cb){
var id=generateSessionOwner(10)
mysql.query('SELECT * FROM sessions WHERE code=?', [id], function(rows){
var ob=null;
if(rows!=null && rows.length>0)ob=rows[0];
if(ob==null){
if(typeof cb!=='undefined')cb(id)
}else{
createSessionIDOwner(cb);
}
});
}

function getTimestampPrizeDay(){
var hour=20;
var dt2=new Date();
var hh=dt2.getHours();
if(hh>=hour)dt2.setDate(dt2.getDate()+1);
dt2.setHours(hour);
dt2.setMinutes(0);
dt2.setSeconds(0);
dt2.setMilliseconds(0);
var tm=Math.floor(dt2.getTime()/1000);
return tm;
}

function addPopularLevel(arr){
popularList.push(arr);
}
function addPopularPart(id,opyt){
var ob={id:id,v:opyt};
return ob;
}

function parsePopularListUser(arr){
var a=[];
if(arr!=null){
for (var i = 0; i < arr.length; i++) {
var el=arr[i];
a.push([el.id,el.v]);
}
}
return a;
}

function parsePopularList2(){
var a=[];
for (var i = 0; i < popularList.length; i++) {
var ell=popularList[i];
var aa=[];
for (var k = 0; k < ell.length; k++) {
var el=ell[k];
aa.push([el.id,el.v]);
}
a.push(aa);
}
return a;
}

function getInfoPopularIds(lvl,v){
var arr=[];
var a=popularList;
if((lvl-1)>=a.length)lvl=a.length;
if((lvl-1)<a.length){
for (var i = 0; i < lvl; i++) {
var q=a[i];
if(q.length>0){
var pos=1;
for (var k = 0; k < q.length; k++) {
var el=q[k];
if(v>=el.v)pos+=1;
}
if(pos>=q.length)pos=q.length;
if(i<lvl-1)pos=q.length;
for (var k = 0; k < pos; k++) {
var el=q[k];
arr.push(el.id);
}
/*var el0=q[0];
arr.push(el0.id);
for (var k = 1; k < q.length; k++) {
var el=q[k];
var res=false;
if(i==lvl-1){
if(v>=el.v)res=true;
}else{
res=true;
}
if(res)arr.push(el.id);
}*/
}
}
}
return arr;
}

function loadPopularListDB(cb){
var th=this;
mysql.query('SELECT * FROM popularlist ORDER BY id ASC', [], function(rows) {
popularList=[];
var ob={};
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
var idd=el.id;
var v=el.value;
var partV=el.part;
if(partV>0){
if(!(partV in ob)){
var a1=[];
ob[partV]=a1;
popularList.push(a1);
}
ob[partV].push(addPopularPart(idd,v));
}else{
popularList.push([addPopularPart(idd,v)]);
}
}
}
//console.log(popularList);
if(th)th.next();
if(typeof cb=='function')cb();
});
}


function loadKoronaAdminDB(cb){
var th=this;
mysql.query('SELECT * FROM koronaadmin WHERE active=? ORDER BY id ASC', [1], function(rows) {
koronaadminList=[];
var ob={};
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
var idd=el.id;
koronaadminList.push({id:el.id,name:el.name});
}
}
if(th)th.next();
if(typeof cb=='function')cb();
});
}


function reloadMainConfig(){
var th=this;
mainCfgObj={};
mysql.query('SELECT * FROM main_config',[],function(rows){
if(rows!=null && rows.length>0){
var el=rows[0];
for(var n in el){
var vv=el[n];
if(vv && typeof vv=='string'){
if(vv[0]=='{' || vv[0]=='[')vv=jsonDecode(vv);
}
if(n!='id'){
mainCfgObj[n]=vv;
//console.log(n,vv)
/*if(n=='bonusTop'){
bonusTopOpytData.items=[];
if(mainCfgObj.bonusTop)bonusTopOpytData.items=mainCfgObj.bonusTop;
}*/

}
}
}else{
mysql.query('INSERT INTO main_config (id) VALUES (?)', [1], function(rows){});
}
th.next();
});
}

function updatePropMainConfig(t,v,cb){
if(t){
mainCfgObj[t]=v;
if(typeof v=='object')v=jsonEncode(v);
mysql.query('UPDATE main_config SET '+t+'=?', [v], function(rows){
if(cb)cb(rows!=null);
});
}
}


function parseEventsList(arr){
var aa=[];
if(arr){
    
if(curBoarKonkursData && curBoarKonkursData.o2){
aa.push({id:-10,name:'кабанчик',type:'boar',o:curBoarKonkursData.o2});
}
    
for (var i = 0; i < arr.length; i++) {
var el=arr[i];
if(el.is_system==0){
var ob={id:el.id,name:el.name,type:el.type,o:null};
aa.push(ob);
}
}
}
return aa;
}

function updateAllUsersEventsList(){
var evList=eventsActionMaster.getActiveEventsList();
var arr=parseEventsList(evList);
AllUsersRoom.emitRoom('sendEvent','updEventsList',[arr]);
}

function addMailMsg(ot,komu,txt){
if(!txt)txt='';
var ts=getTimestamp();
mysql.query('INSERT INTO mail (txt,ot,user,time) VALUES (?,?,?,?)', [txt,ot,komu,ts], function(rows){

});
}

/*function KoronaAdminClass(){
var th=this;
th.addEmojiV(1,'Путешествует кукухой')
th.addEmojiV(2,'Йа пчёлка')
th.addEmojiV(3,'Кукарекууу')
th.addEmojiV(4,'Бууууу')
th.addEmojiV(5,'Празднует')
th.addEmojiV(6,'Ждёт новостей')
th.addEmojiV(7,'В поисках еды')
th.addEmojiV(8,'Колючий')
th.addEmojiV(9,'Ждёт подарок')
th.addEmojiV(10,'Владеет магией')
th.addEmojiV(11,'Считает деньги')
th.addEmojiV(12,'Рисует')
th.addEmojiV(13,'Поёт песни')
th.addEmojiV(14,'Слушает музыку')
th.addEmojiV(15,'У холодильника')
th.addEmojiV(16,'Изучает')
th.addEmojiV(17,'Ёлочка')
th.addEmojiV(18,'Тяф')
th.addEmojiV(19,'Огонь')
th.addEmojiV(20,'Слежу')
th.addEmojiV(21,'Люблю')
th.addEmojiV(22,'Колечко')
th.addEmojiV(23,'Бантик')
th.addEmojiV(24,'Письмо')

}

KoronaAdminClass.prototype.addEmojiV=function(id,name){
mysql.query('INSERT INTO koronaadmin (id,name) VALUES (?,?)', [id,name], function(rows){
});
};*/

/*addPopularLevel([addPopularPart(1,100),addPopularPart(2,3000)]);
addPopularLevel([addPopularPart(3,6000),addPopularPart(4,15000)]);
addPopularLevel([addPopularPart(5,50000)]);
addPopularLevel([addPopularPart(6,150000)]);
addPopularLevel([addPopularPart(7,250000)]);
addPopularLevel([addPopularPart(8,255000)]);
addPopularLevel([addPopularPart(9,260000)]);*/

//popularList=[];
var timer1=-1;
var timer2=-1;

var keyAuthV='';
//var keyAuthFilePath='dogsgame3Auth.txt';
//if(fs.existsSync(keyAuthFilePath))keyAuthV=''+fs.readFileSync(keyAuthFilePath);

function CmdsMaster(){
this.o={};
}
CmdsMaster.prototype.add=function(name,cb){
this.o[name]=cb;
};
CmdsMaster.prototype.remove=function(name){
if(name in this.o){
delete this.o[name];
}
};
CmdsMaster.prototype.isExists=function(name){
if(name in this.o)return true;
return false;
};
CmdsMaster.prototype.run=function(th,name,args){
if(name in this.o){
var cb=this.o[name];
if(cb!=null)cb.apply(th,args);
}
};


function AppData(){
this.isBinary=false;
this.ws=true;
}
AppData.prototype.sendData=function(th){
var args=[];
for (var i = 1; i < arguments.length; i++)args.push(arguments[i]);
var ob={args:args};
if(th!=null){
if(this.isBinary){
th.sendBinary(ob);
}else{
th.send(ob);
}
}
};

AppData.prototype.init=function(mainServer){
log=mainServer.log;
//log('init dogsgame3');
var srv1=this;
if('AnimalsGameServer' in this)srv=this.AnimalsGameServer;
//srv=this.AnimalsGameServer;

srv.addCmd=function(name,cb,mode){
var modeV=0;
if(typeof mode!='undefined')modeV=mode;

var ob={name:name,accessMode:modeV,cb:cb,callCount:0};
srv.cmds[name]=ob;

var aa=[];
if(modeV>0){
if((modeV & USER_MODE_MODERATOR)>0)aa.push('MODERATOR');
if((modeV & USER_MODE_ADMIN)>0)aa.push('ADMIN');
if((modeV & USER_MODE_SUPER_ADMIN)>0)aa.push('SUPER_ADMIN');
if((modeV & USER_MODE_MOD_MAPS)>0)aa.push('MODERATOR_MAPS');
}else{
aa.push('ALL');
}
ob.accessArr=aa;
cmdsArr.push(ob);
/*var ss=aa.join(', ');
console.log('addCmd',name,ss);*/
};

srv.cmdsCallback=function(cmd, params, args){
if(cmd!=null && cmd in srv.cmds){
var cmdO = srv.cmds[cmd];
++cmdO.callCount;
var user=params.getUserData("user");
var modeV=0;
var isAccess=false;
if(user!=null)modeV=user.mode;
if(cmdO.accessMode>0){
if(user!=null && (modeV & cmdO.accessMode)>0 && user.checkOriginalConnect(params))isAccess=true;
}else{
isAccess=true;
}
if(isAccess){
cmdO.cb.apply(params, args);   
}else{
//console.log('no access ' + cmd);
}
}else{
console.log('cmd ' + cmd + ' not found');
params.disconnect();
}
};

mainMap=new MainMapLevels();
topM=new PrizeTopMaster();
//dialogsMaster=new DialogsMaster();
mapsMaster=new MapsMaster();
worldMapsMaster=new WorldMapsMaster();
gameItemsMaster=new GameItemsMaster();
gameRoomsListMaster=new GameRoomsListMaster();
shopMaster=new ShopMaster();
dressMaster=new DressMaster();
//formulaMainZabeg=new FormulaMainZabeg();
/*homePersWorld=new PersHomeWorld();
homePersWorld.init();*/

jobMaster=new JobMaster();
requestsMaster=new RequestsUserMaster();
//eventsTimeMaster=new EventsTimeMaster();

subscriptionMaster=new SubscriptionMaster(function(userid,o,status){
if(o!=null){
var u=MainRoom.getUserByID(userid);
if(status=='create'){
if(u!=null){
u.nickRainbow=1;
u.updateFieldDB('nickRainbow',1);
MainRoom.emitRoom('nickRainbowEvent',u.id,u.nickRainbow);
//u.emit('notify.type1','Оформлена подписка "'+o.name+'"');
}
}else if(status=='cancel'){
if(u!=null){
u.nickRainbow=0;
u.updateFieldDB('nickRainbow',0);
MainRoom.emitRoom('nickRainbowEvent',u.id,0);
MainRoom.sendPrivateMsg(systemUser,u,'Отмена подписки "'+o.name+'"');
//u.emit('notify.type1','Отмена подписки "'+o.name+'"');
}
}else if(status=='renew'){
/*if(u!=null){
u.emit('notify.type1','Продление подписки "'+o.name+'" Стоимость '+o.price+'');
}*/
}
}
});

//if(!isWin){
vkGroupApi=new VKApi(vkTokenWallGroup);
vkNotifyApi=new VKApi(appVKToken);
vkGroupMessages=new VKApi(vkGroupMessagesToken);
//}

/*
var testVK=new VKApi(appVKToken);
testVK.api('users.get',{user_ids:'57028472'},function(o){
console.log(o);
});
*/

//vkNotifyApi.sendMessageByIds(['57028472'],'Проверка');
//vkNotifyApi.setUserLevel(57028472,25);

accessUsersMaster=new AccessUsersMaster();

statsUsers=new StatsUsersMaster();

userMaster=new UserMaster();
userMaster.initPopularList(popularList);

notifyMaster=new NotifyMaster();
eventsActionMaster=new EventsActionMaster();

/*newYearUser=new User(null);
newYearUser.parseObj({id:-5,nick:'Дед мороз',mode:-2,sex:2,popular:6000,popularLevel:2,iconEmoji:0});
*/
boarUser=new User(null);
boarUser.parseObj({id:-3,nick:'Кабанчик',mode:0,sex:2,popular:6000,popularLevel:2,iconEmoji:0});
boarUser.isBot=true;
systemUser=new User(null);
//systemUser.parseObj({id:-2,nick:'Дед мороз',mode:-2,sex:2,popular:0,popularLevel:2});
//systemUser.parseObj({id:-2,nick:'Система',mode:-2,sex:1,popular:0,popularLevel:2,iconEmoji:1});
//systemUser.parseObj({id:-2,nick:'Снегурочка',mode:-2,sex:1,popular:6000,popularLevel:2,iconEmoji:17});
//systemUser.parseObj({id:-2,nick:'Зимняя зима',mode:-2,sex:1,popular:6000,popularLevel:2,iconEmoji:1});

systemUser.parseObj({id:-2,nick:'Система',mode:-2,sex:1,popular:6000,popularLevel:2,iconEmoji:1});

noUser=new User(null);
noUser.id=-3;
noUser.nick='Неизвестно';
noUser.mode=noUser.id;

modMapsUser=new User(null);
modMapsUser.parseObj({id:-4,nick:'Модератор карт',popular:100});

mysql=new mainServer.modules.MysqlMaster(dbName,function(){
log('db ok');

//var kkq=new KoronaAdminClass();

function addCB(ob){
var q=function(){
var th=this;
if(typeof ob.init!='undefined'){
ob.init.call(ob,function(){th.next()});
}
};
return q;
}


var reloadTopOpytCB=function(){
var th=this;
reloadTopOpytUsers(function(arr){
topOpytUsersList=arr;
th.next();
});
};

var reloadTopPopularCB=function(){
var th=this;
reloadTopPopularUsers(function(arr){
topPopularUsersList=arr;
th.next();
});
};

var loader = new AsynchLoad([LoadCountUsersDB,loadPopularListDB,loadKoronaAdminDB,LoadPaymentsAllList,LoadPaymentsVKList,addCB(mainMap),addCB(topM),reloadTopOpytCB,reloadTopPopularCB,reloadMainConfig,addCB(mapsMaster),addCB(worldMapsMaster),addCB(notifyMaster),addCB(subscriptionMaster),addCB(gameItemsMaster),addCB(shopMaster),addCB(dressMaster),addCB(accessUsersMaster),addCB(eventsActionMaster)],function(){
statusServer='ok';
srv.httpsObj=sslObj;

srv.init('app',portSrv);

log('start dogsgame3 server');
//notifyMaster.addNotifyDB(1,'gift',0,'','',function(){});
//shopMaster.addMoneyHistory(1,1,15);
/*subscriptionMaster.cancelSubscribe(null.2,1,function(data){
console.log(data);
});*/
/*subscriptionMaster.subscribe(null;1,1,function(data){
console.log('subscribe',data);
});*/
});

});
mysql.changeStatusCB=function(v){
if(AllUsersRoom!=null){
var t='';
var txt1='';
if(v=='ok'){
t='db_ok';
statusServer='ok';
if(dbErrorLastTime>0){
var tm=getTimestamp()-dbErrorLastTime;
if(tm<=0)tm=0;
txt1='Соединение с базой данных восстановлено за '+tm+' сек';
dbErrorLastTime=0;
}
}
else if(v=='error'){
t='db_error';
statusServer='db_error';
txt1='Проблема с доступом к базе данных';
dbErrorLastTime=getTimestamp();
}

if(txt1!=''){

/*for (var i = 0; i < MainRoom.users.length; i++) {
var u=MainRoom.users[i];
MainRoom.sendPrivateMsg(systemUser,u,txt1);
}*/

if(ModRoom!=null)ModRoom.sendSystemMessage(txt1,true);
//if(SystemRoom!=null)SystemRoom.sendSystemMessage(txt1,true);

}

if(t!=''){
AllUsersRoom.emitRoom("serverStatus",t);
}
}
};

mysql.init('127.0.0.1','root',dbPass,dbCharset);
initServer();
cmds=new mainServer.CmdsMaster();

srv.httpsObj=null;
srv.init('app',portSrv+2);

return {commands:cmds,destroyLastActiveSec:0};
};
/*
AppData.prototype.queryLog=function(cmd,params){
log('query',cmd,params);
};*/
AppData.prototype.destroy=function(){
log('destroy dogsgame3');
if(mysql!=null)mysql.close();
if(timer1!=-1)clearInterval(timer1);
timer1=-1;
if(timer2!=-1)clearInterval(timer2);
timer2=-1;
var users=AllUsersRoom.users;
for (var i = 0; i < users.length; i++) {
var u=users[i];
if(u!=null){
u.saveUserDB();
u.allDisconnect();
}
srv.disconnect(u.connect);
}

var ar2=[];

for (var n in srv.streams)ar2.push(srv.streams[n]);
//console.log(ar2);
for (var i = 0; i < ar2.length; i++) {
var stream = srv.streams[n];
if(stream!=null)stream.remove();
}

};



function rectIntersect(x,y,w,h,px,py){
if((px >= Math.min(x,x+w)) && (px < Math.max(x,x+w)) && (py >= Math.min(y,y+h)) && (py < Math.max(y,y+h)))return true;
return false;
}


/*function stopServerFunc(){
MainRoom.saveMessagesFile();
saveMessagesAllRooms();
saveAllUsersCallback(0,function(errorsList){
if(errorsList.length>0){
trace('errrr',errorsList);
}else{
trace('ok');
//process.exit();
}

});
//setTimeout(function(){},5000);
}*/


function cloneObject(o){
if(o!=null){
if(typeof o=='object'){
if(Object.prototype.toString.call(o)==='[object Array]'){
var arr=[];
for (var i = 0; i < o.length; i++)arr.push(cloneObject(o[i]));
return arr;
}else{
var ob={};
for(var n in o)ob[n]=cloneObject(o[n]);
return ob;
}
}
}
return o;
}


function copyProps(th,props){
if(th!=null && props!=null){
for(var n in props){
var v=props[n];
if(v!=null && typeof v=='object')v=cloneObject(v);
th[n]=v;
}
}
}

//trace(checkCountFindStr('йййааааа',5));




function ChatMessagesTypeClass(){
this.MSG_USER=1;
this.PRIZE_MSG=2;
this.GIFT_MSG=3;
this.EVENT_MSG=4;
this.SYSTEM_MSG=5;
this.BAN=6;
this.UNBAN=7;
this.NICK_CHANGE=8;
}

var MessageType=new ChatMessagesTypeClass();


function ErrorTypeClass(){
this.ERROR=-1;
this.OK=1;
this.NO_ROOM=2;
this.NO_ONLINE=3;
this.BAN=4;
this.NO_MONEY=5;
this.NO_CHANGE=6;
this.EXISTS=7;
this.EMPTY=8;
this.TIME_EXISTS=9;
this.ACCESS_DENIED=10;
this.ERROR_DB=11;
this.NO_USER=12;
this.VERSION_ERROR=13;
this.ERROR_MESSAGE=14;
this.NO_ACCESS_WRITE=15;
this.WARN=16;
this.MAT=17;
}

var ErrorType=new ErrorTypeClass();


function strFill(s,delim,nums){
var n=nums;
var ss='';
if(nums<=0)n=0;
for (var i = 0; i < n; i++) {
ss+='?';
if(i!=n-1)ss+=delim;
}
return ss;
}


function md5(s){
var h = crypto.createHash('md5').update(s,'utf8').digest("hex");
return h;
}



function getBanUserInfo(user){
if(user!=null){
var isBan=user.isBan();
if(isBan || user.banChangeTime>0){
var ts=getTimestamp();
var bantime=user.bantime;
var expire=user.getExpireBanSecs();
var qw = Math.floor((Math.min(ts,user.bantime)-user.banChangeTime) / 60);
//var qw = Math.floor((ts - user.banChangeTime) / 60);
//var qw = Math.ceil(Math.max(0, bantime-user.banChangeTime) / 60);
//var price = Math.floor(Math.max(0, bantime-user.banChangeTime) / 60) * banPriceMinute;
var price = Math.ceil(Math.max(0, bantime-user.banChangeTime) / 60) * banPriceMinute;

if(UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode))price=0;

//if(!isBan)price=0;
var banexperience = Math.min(qw*2, 1000);
var banpopular = Math.min(qw*updateBanValueMinute,1000);
/*if(banexperience > 0 || banpopular > 0){
user.banChangeTime=ts;
if(banexperience>0)user.minusOpyt(banexperience);
if(banpopular>0)user.minusPopular(banpopular);
}*/
var v={expire:expire,priceExit:price,experience:banexperience,popular:banpopular};
//if(!isBan)user.banChangeTime=0;
return v;
}
}
return null;
}


function apiVM2Site(params,cb){
var kk2=keyAuthV;
//var kk2=null;
var url='https://ag6.ru';
if(params!=null && 'isLocal' in params)url='http://create2.game';
url+='/VM2AuthSite.php';
request({method:'POST',url:url,form:params},function(error, response, body) {
if(error){
if(kk2!=null && kk2.length>0 && params!=null && !('isLocal' in params)){
params.isLocal=1;
apiVM2Site(params,cb);
}else{
if(typeof cb!=='undefined')cb(null);
}
}else{
var ob=jsonDecode(body);
if(ob!=null && 'data' in ob)ob=ob.data;
if(typeof cb!=='undefined')cb(ob);
}
});
}


function getDateFormatStr(s,ts){
var dt = new Date();
dt.setTime(ts*1000);
var t=0;
var str='';
for (var i = 0; i < s.length; i++) {
var q=s[i];
if(q=="d"){
var qw=dt.getDate();
if(qw<10){
str += '0';
}
str += qw;
}else if(q=="m"){
var qw=dt.getMonth()+1;
if(qw<10)str += '0';
str += qw;
}else if(q=="Y"){
var qw=dt.getFullYear();
str += qw;
}else if(q=="H"){
var qw=dt.getHours();
if(qw<10)str += '0';
str += qw;
}else if(q=="i"){
var qw=dt.getMinutes();
if(qw<10)str += '0';
str += qw;
}else if(q=="s"){
var qw=dt.getSeconds();
if(qw<10)str += '0';
str += qw;
}else{
str += q;
}
}
return str;
}

function getBanByID(id){
for (var i = 0; i < banList.length; i++) {
var o=banList[i];
if(o.id==id)return o;
}
return null;
}

function getLimitByPage(page,limit){
page=parseInt(page);
if(page<1)page=1;
var start=Math.max(0,(page-1)*limit);
return start+","+limit;
}


function findAutoWorld(){
var a=[];
for (var i = 0; i < worldRooms.length; i++) {
var r=worldRooms[i];
var count=r.getCountClients();
if(count<worldClientsLimit){
a.push(r);
//trace(count,worldClientsLimit,worldRooms.length);
}
}
if(a.length>0){
a.sort(function(_a,_b){
var aa=_a.getCountClients();
var bb=_b.getCountClients();
if(aa<bb)return 1;
});
var ob=a[0];
return ob;
}
var c=new PersWorldMaster(0);
c.init();
//trace(c.id);
return c;
}


function UserMaster(){
		this.popularList=[];
	}

	UserMaster.prototype.banUserExitByID=function(id,isExitMsg){
		if(MainRoom!=null){
			var u=MainRoom.getUserByID(id);
			if(u!=null && u.isBan()){
				u.bantime=0;
				u.bantype=0;
				u.banChangeTime=0;
				u.emit('userEvent','exitBan');
				if(isExitMsg==true){
				MainRoom.sendMessageEvent('banExit',id,0,[]);
				}
			return true;
			}
			
			//MainRoom.sendPrivateMsg(systemUser,u,'Вы вышли из бана');
		}
		return false;
	}

UserMaster.prototype.initPopularList=function(a){
if(a!=null){
for (var i = 0; i < a.length; i++) {
var el=a[i];
var ob={};
ob.pos=i;
ob.name=el[0];
ob.value=el[1];
this.popularList.push(ob);
}
}
//this.getPopularInfoByValue(550)
}

UserMaster.prototype.loadListUsersMode=function(cb){
mysql.query('SELECT id, mode FROM users WHERE mode>?', [0], function(rows){
var arr=[];
if(rows!=null && rows.length>0){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
arr.push({id:el.id,mode:el.mode});
}
}
if(typeof cb!=='undefined')cb(arr);
});
}

UserMaster.prototype.checkUserDB=function(id,cb){
mysql.query('SELECT id FROM users WHERE id=?', [id], function(rows){
var v=false;
if(rows!=null && rows.length>0){
v=true;
}
if(typeof cb!=='undefined')cb(v);
});
}

UserMaster.prototype.getFriendsUser=function(id,cb){
mysql.query('SELECT * FROM friends WHERE user=?', [id], function(rows){
var arr=[];
if(rows!=null){
for (var i = 0; i < rows.length; i++){
var el=rows[i];
arr.push({id:el.id,txt:el.txt,user:el.userid});
}
}
if(typeof cb!=='undefined')cb(arr);
});
}

UserMaster.prototype.addFriendUser=function(initiatorid,id,txt,cb){
var th=this;
th.checkUserDB(id,function(r){
if(r && initiatorid!=id){
th.isFriendUser(initiatorid,id,function(v){
var vv=false;
if(v==false){
var ts=getTimestamp();
mysql.query('INSERT INTO friends (userid,user,txt,time) VALUES (?,?,?,?)', [id,initiatorid,txt,ts], function(rows){
if(rows!=null && 'insertId' in rows)vv=true;
if(typeof cb!=='undefined')cb(vv);
});
}else{
if(typeof cb!=='undefined')cb(vv);
} 
});
}else{
if(typeof cb!=='undefined')cb(false);
}
});
}


UserMaster.prototype.isFriendUser=function(initiatorid,id,cb){
mysql.query('SELECT id FROM friends WHERE user=? AND userid=?', [initiatorid,id], function(rows){
var v=false;
if(rows!=null && rows.length>0)v=true;
if(typeof cb!=='undefined')cb(v);
});
}

UserMaster.prototype.removeFriendUser=function(initiatorid,user,cb){
mysql.query('DELETE FROM friends WHERE user=? AND userid=?', [initiatorid,user], function(rows){
var v=false;
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
v=true;
}
if(typeof cb!=='undefined')cb(v);
});
}

UserMaster.prototype.updateTextFriendUser=function(initiatorid,user,txt,cb){
mysql.query('UPDATE friends SET txt=? WHERE user=? AND userid=?', [txt,initiatorid,user], function(rows){
var v=false;
if(rows!=null)v=true;
if(typeof cb!=='undefined')cb(v);
});
}

UserMaster.prototype.getPopularInfoByPart=function(v){
if(v<=0)v=0;
if(this.popularList.length>=v){
var vv=this.popularList[v];
return vv;
}
}

UserMaster.prototype.getPopularInfoByValue=function(v){
var pos=0;
for (var i = 0; i < this.popularList.length; i++) {
var el=this.popularList[i];
if(v>=el.value)pos+=1;
}

if(this.popularList.length-1>=pos){
if(this.popularList.length>0){
var vv=this.popularList[pos];
return vv;
}
}
//(this.popular-min)/(minNext-min)*100 as int
return null;
}


function LevelsMaster(){
this.cons=300;
this.prirost=1000;
}

LevelsMaster.prototype.GetPercentLevel=function(opyt, level){
/*var lvl=this.GetLevelByOpyt(opyt)
var nextOpyt=this.GetMinOpytCurrentLevel(lvl+1)
var q=Math.floor(opyt/nextOpyt*100)*/
var v1=this.GetMinOpytCurrentLevel(level)
var nextOpyt=this.GetMinOpytCurrentLevel(level+1)
var q=Math.floor((opyt-v1)/(nextOpyt-v1)*100)
return q
}

LevelsMaster.prototype.GetLevelByOpyt=function(s){ //получаем уровень
var dexp=s
var d=this.cons
for(var lvl=1; dexp-d >= 0;lvl++){
dexp=dexp-d
d=d+this.prirost
}
return lvl
}

LevelsMaster.prototype.GetMinOpytCurrentLevel=function(s){ // получаем опыт
var d=this.cons
var exp=0
if(s > 0){
for(var i = 0; s != this.GetLevelByOpyt(exp);i++){
exp=d+exp
d=this.prirost+d
}
}else{
return 1
}
return exp
}

LevelsMaster.prototype.GetLevelObjAndNextLevel=function(level){
var o={};
var v1=this.GetMinOpytCurrentLevel(level);
var nextOpyt=this.GetMinOpytCurrentLevel(level+1);
o.opyt=v1;
o.nextOpyt=nextOpyt;
return o;
};

function TimeEventsMaster(id,name){
this.id=id;
this.name=name;
this.list=[];
}

TimeEventsMaster.prototype.add=function(id,name,tm,eventCB){
var res=false;
for (var i = 0; i < this.list.length; i++) {
var ob=this.list[i];
if(ob.id==id){
res=true;
break;
}
}

if(!res){
var c = new TimeEvent(id,name,tm,eventCB);
this.list.push(c);
return c;
}
return null;
}


TimeEventsMaster.prototype.get=function(id){
for (var i = 0; i < this.list.length; i++) {
var ob=this.list[i];
if(ob.id==id)return ob;
}
return null;
}


TimeEventsMaster.prototype.remove=function(v){
if(v){
for (var i = 0; i < this.list.length; i++) {
var ob=this.list[i];
if(ob==v){
this.list.splice(i,1);
break;
}
}
}
}

TimeEventsMaster.prototype.update=function(ts){
for (var i = 0; i < this.list.length; i++) {
var ob=this.list[i];
var isEnd = ob.isEnd(ts);
if(isEnd){
ob.tm=-1;
if(ob.eventCB){
ob.eventCB.apply(ob);
}
}
}
}



function TimeEvent(id,name,tm,eventCB){
this.id=id;
this.name=name;
this.tm=tm;
this.eventCB=eventCB;
this.data=null;
}

TimeEvent.prototype.expireSecs=function(){
var ts = getTimestamp();
var v = this.tm-ts;
if(v<=0)v=0;
return v;
}

TimeEvent.prototype.isEnd=function(ts){
if(this.expireSecs() <= 0)return true;
return false;
}


function AsynchLoad(arr, cb, changeFunc){
this.arr=arr;
this.okCB = cb;
this.changeCB = null;
if(arguments.length>2){
this.changeCB=arguments[2];
}
this.cb=null;
this.pos=0;
this.load(arr.shift());
}

AsynchLoad.prototype.load=function(o){
if(o){
this.cb=o;
o.apply(this);
this.pos+=1;
if(this.changeCB){
this.changeCB(this.pos);
}
}
}


AsynchLoad.prototype.next=function(){
if(this.arr.length>0)this.load(this.arr.shift());
else {
this.cb=null;
this.okCB();
}
}



function EventsTimeMaster(){}

EventsTimeMaster.prototype.add=function(type,expirets,user){
if(typeof user=='undefined')user=0;
mysql.query('INSERT INTO eventsTime (type,ts,user) VALUES (?,?,?)', [type,expirets,user], function(rows){});
}

EventsTimeMaster.prototype.del=function(id,cb){
mysql.query('DELETE FROM eventsTime WHERE id=?', [id], function(rows){
if(typeof cb=='function')cb();
});
}

EventsTimeMaster.prototype.update=function(){
var th=this;
mysql.query('SELECT * FROM eventsTime', [], function(rows){
var ts=getTimestamp();
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var ob=rows[i];
var id=ob.id;
if(ts>=ob['ts']){
var type=ob.type;
var user=ob.user;
if(type=='nickRainbowCancel'){
var u=AllUsersRoom.getUserByID(user);
if(u!=null){
u.nickRainbow=0;
u.updateFieldDB('nickRainbow',0);
u.sendUpdateUserInfo();
th.del(id);
}
}
}
}
}
});
}

/*function updateRubiesByUserID(id,value,cb){
mysql.query('UPDATE users SET rubies=? WHERE id=?', [value,id], function(rows){
if(typeof cb!=='undefined')cb();
});
}
*/
//trace(rectIntersect(5,0,10,10,15,5));

function sendPrizeTop(t){
var a={};
if(t=='hour')a=topM.hourTop;
else if(t=='day')a=topM.dayTop;
var prizeCount=5;
var prizeUserAllNums=10;
var arr=topM.getWinnersList(t,prizeUserAllNums);

var missionid=6;

var winnersArr=[];

if(arr){
for (var i = 0; i < arr.length; i++) {
var ob=arr[i];
var prize=0;
if(t=='hour' && i<prizeKostiHoursArr.length){
prize=prizeKostiHoursArr[i];
}else if(t=='day' && i<prizeKostiDaysArr.length){
prize=prizeKostiDaysArr[i];
}
if(prize>0)winnersArr.push({user:ob.id,prize:prize,dogs:ob.v});
}
}

if(t=='hour' || t=='day'){
var ts=getTimestamp();
var st2=jsonEncode(winnersArr);
mysql.query('INSERT INTO top_history (type,data,time) VALUES (?,?,?)', [t,st2,ts], function(rows){});
}

if(t=='day'){
if(dressMaster)dressMaster.resetDressSystemAction();
}
//var arr=[];
/*for(var n in a){
var idd=parseInt(n);
var vv=a[n];
if(arr.length<prizeCount){
arr.push({id:idd,v:vv});
}else{
break;
}
}
arr.sort(function(_a,_b){
if(_a.v<_b.v)return 1;
});*/

var ids=[];
var loginNotifyVK=[];
var loginGiftsNotifyVK=[];
var giftid=0;

if(arr.length>prizeCount){
var aa2=[];
for (var i = 0; i < shopMaster.giftsList.length; i++) {
var el=shopMaster.giftsList[i];
if(/*el.price>=50 && */el.price<=100)aa2.push(el);
}

var giftObj=aa2.random();
if(giftObj!=null){
giftid=giftObj.itemid;
var giftObjInfo=null;
if(giftid in shopMaster.giftsObj)giftObjInfo=shopMaster.giftsObj[giftid];
for (var i=prizeCount; i <arr.length; i++) {
var el=arr[i];
var idd=el.id;
var u=AllUsersRoom.getUserByID(idd);
if(u!=null && giftObjInfo){
u.emit('userEvent','PresentUserGift',-2,giftObjInfo);
}
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,-2,idd,function(res){});
}

}
}

for (var i = 0; i < arr.length; i++) {
var ob=arr[i];
ids.push(ob.id);
}

var t1=0;
if(t=='day'){
t1=1;
missionid=7;
}

if(ids.length>0){

getUsersObjByIds(null,ids,function(aa){
for (var i = 0; i < aa.length; i++) {
var u=aa[i];
if(u!=null){
var prefixAuth=u.getPrefixAuth();
if(prefixAuth=='vk'){
var loginUser=u.login.substr(2);
var nm3='час';
if(t=='day')nm3='день';
var u2=AllUsersRoom.getUserByID(u.id);
//if(i<ids.length){
if(u2==null){
if(i<ids.length){
loginNotifyVK.push(loginUser);
}else{
loginGiftsNotifyVK.push(loginUser);
}
}

if(!u.checkMissionVK(missionid)){
if(vkNotifyApi!=null)vkNotifyApi.setMission(loginUser,missionid,function(){
u.addMissionVK(missionid);
});    
}


}
}
}

if(vkNotifyApi!=null){
if(loginNotifyVK.length>0){
vkNotifyApi.sendMessageByIds(loginNotifyVK,'Поздравляем! Вы лучший спасатель за '+nm3+'. Зайдите и дождитесь своей награды!');
}
if(loginGiftsNotifyVK.length>0){
vkNotifyApi.sendMessageByIds(loginGiftsNotifyVK,'Поздравляем! Вы лучший спасатель за '+nm3+'. Мы подарили вам подарок в игре!');
}
}

},0,true);
    
    
    
if(t=='hour'){
topM.clear('hour');

MainRoom.sendPrizeKostiMsg(t,ids,giftid);


/*getUsersObjByIds(null,[ids],function(aa){
for (var i = 0; i < aa.length; i++) {
var u=aa[i];
var prize=prizeKostiHoursArr[i];
if(u.connect==null && u.getCountConnects()<=0){
jobMaster.add('prizeKosti',u.id,prize,t1);
//jobMaster.add('addKosti',u.id,prize);
}else{
u.plusKosti(prize);
u.emit('userEvent','prizeWinner',prize,t1);
}
}
},0,true);*/

for (var i = 0; i < ids.length; i++) {
var idd=ids[i];
var u=AllUsersRoom.getUserByID(idd);
if(u!=null){
u.opyt_hour=0;
}
if(i<prizeKostiHoursArr.length){
var prize=prizeKostiHoursArr[i];
if(u!=null){
u.opyt_hour=0;
u.plusKosti(prize);
u.emit('userEvent','prizeWinner',prize,t1);
}else{
jobMaster.add('prizeKosti',idd,prize,t1);
}
}
}

trace('prize hour');
}else if(t=='day'){
MainRoom.sendPrizeKostiMsg(t,ids,giftid);
topM.clear('day');

for (var i = 0; i < AllUsersRoom.users.length; i++) {
var u=AllUsersRoom.users[i];
if(u!=null)u.opyt_day=0;
}

MainRoom.giftsHistoryObj={};

for (var i = 0; i < ids.length; i++) {
var idd=ids[i];
var u=AllUsersRoom.getUserByID(idd);
if(u!=null){
//u.opyt_hour=0;
u.opyt_day=0;
}
if(i<prizeKostiDaysArr.length){
var prize=prizeKostiDaysArr[i];
if(u!=null){
u.plusKosti(prize);
u.emit('userEvent','prizeWinner',prize,t1);
}else{
jobMaster.add('prizeKosti',idd,prize,t1);
}
}
}

for (var i = 0; i < AllUsersRoom.users.length; i++) {
var u=AllUsersRoom.users[i];
if(u!=null)u.giftFreeTime=0;
}

mysql.query('UPDATE users SET gift_free_time=?', [0], function(rows){});

trace('prize day');
}
}
}


levelsMaster=new LevelsMaster();


function isModMaps(u){
if(u!=null && u.isModMaps){
return true;
}
return false;
}


function jsonEncode(o){
if(o!=null){
try{
return JSON.stringify(o);
}catch(e){
}
}
return null;
}

function jsonDecode(o){
if(o!=null){
try{
return JSON.parse(o);
}catch(e){
}
}
return null;
}

function updateMiniChatMsgs(cb){
if(miniChatStack.length>0){

var arr=miniChatStack;
miniChatStack=[];

var params=[];
for (var i = 0; i < arr.length; i++) {
var el=arr[i]
params.push([el.msg,el.user,el.time]);
}

mysql.query('INSERT INTO minichat_history (txt,user,time) VALUES ?', [params], function(rows){
if(rows){
if(cb)cb();
}else{
miniChatStack=arr;
}
});
}else{
if(cb)cb();
}
}

function updateEnergyUser(u){
if(u!=null){
if(u.energy<maxEnergyValue){
var ts=getTimestamp();
if(u.changeEnergyTime==0)u.changeEnergyTime=ts;
var v=Math.floor((ts-u.changeEnergyTime) / energyRestoreSeconds);
if(v>0){
u.changeEnergyTime=ts;
u.plusEnergy(v);
}
//trace(v);
}else{
if(u.changeEnergyTime!=0)u.changeEnergyTime=0;
}
}
}

function saveAllDataSrv(){
saveAllUsersDB();
saveMessagesChatHistory();
if(statsUsers)statsUsers.update();
}

function saveAllUsersDB(){
var users=AllUsersRoom.users;
for (var i = 0; i < users.length; i++) {
var u=users[i];
if(u!=null){
u.saveUserDB();
}
}
}


/*function saveAllUsersCallback(i,cb,errorsSave){
if(typeof errorsSave==='undefined')errorsSave=[];
var users=AllUsersRoom.users;
if(i<users.length){
var client=users[i];
if(client!=null){
client.saveUserCallback(function(ob,noError){
++i;
if(!noError){
errorsSave.push(ob);
}
//trace(ob);
saveAllUsersCallback(i,cb,errorsSave);
});
}
}else{
cb(errorsSave);
}
}*/


function removeUserRoomsFunc(u){
if(u!=null){
AllUsersRoom.removeUser(u);
for(var k in chatRooms){
var rm=chatRooms[k];
rm.removeUser(u);
}
}
}



function updateBanUserInfo(user){
if(user!=null){
    
if(user.vip_end>0){
var ts=getTimestamp();
if(ts>=user.vip_end){
user.vip=0;
user.vip_end=0;
user.sendUpdateUserInfoCurID();

MainRoom.sendPrivateMsg(systemUser,user,'Закончилось время действия VIP');

}
}


if(user.nickColor_end>0){
var ts=getTimestamp();
if(ts>=user.nickColor_end){
user.nickColor_pos=0;
user.nickColor_end=0;
user.sendUpdateUserInfoCurID();
}
}

if(user.nickRainbow_end>0){
var ts=getTimestamp();
if(ts>=user.nickRainbow_end){
user.nickRainbow=0;
user.nickRainbow_end=0;
user.updateFieldDB('nickRainbow',0);
user.updateFieldDB('nickRainbow_end',0);
MainRoom.emitRoom('nickRainbowEvent',user.id,0);
}
}


    
var isBan=user.isBan();
if(user.banChangeTime>0){
var ts=getTimestamp();
var bantime=user.bantime;
var expire=user.getExpireBanSecs();
var qw = Math.floor((ts - user.banChangeTime) / 60);
var price = Math.ceil(Math.max(0, bantime-user.banChangeTime) / 60) * banPriceMinute;
//if(!isBan)price=0;
var banexperience = Math.min(qw*2, 1000);
var banpopular = Math.min(qw*updateBanValueMinute,1000);
if(banexperience > 0 || banpopular > 0){
user.banChangeTime=ts;
/*if(banexperience>0)user.minusOpyt(banexperience);
if(banpopular>0)user.minusPopular(banpopular);*/
}
var v={expire:expire,priceExit:price,experience:banexperience,popular:banpopular};
//if(!isBan)user.banChangeTime=0;
return v;
}
}
return null;
}

function checkDisconnectedUsers(){
var usersObj={};
var idsList=[];
var users=AllUsersRoom.users;
for (var i = 0; i < users.length; i++) {
var u=users[i];
if(u!=null){
var changeTime=u.banChangeTime;
updateEnergyUser(u);
updateBanUserInfo(u);
if(u.bantype>0){
var ts=getTimestamp();
if((u.bantime-ts)<=0){
if(changeTime==u.banChangeTime){
u.banChangeTime=ts-65;
updateBanUserInfo(u);
}
userMaster.banUserExitByID(u.id,true);
}
}

//u.plusOpyt(3);
//u.plusMoney(5);
if(u.checkAllDisconnected()){
var userid=u.id;
//if((userid in usersObj)==false){
u.saveUserDB(function(){
idsList.push(userid);
usersObj[userid]=1;
removeUserRoomsFunc(this);

if(u.id>0){
var ts=getTimestamp();
statsUsers.setValue('auth_end_time',u.id,ts);
}

if(idsList.length>0)MainRoom.emitRoom("usersExit",idsList,users.length);
});
//}
//removeUserRoomsFunc(u);
}else{
u.removeDisconnected();
}
}
}
if(idsList.length>0)MainRoom.emitRoom("usersExit",idsList,users.length);
}

function getTimestamp(){
return Math.floor(Date.now() / 1000);
}

function updateMoneyUserByID(user,money,cb){
mysql.query('UPDATE users SET money=? WHERE id=?', [money,user], function(rows){
if(typeof cb!=="undefined")cb(true);
});
}

function plusMoneyUserByID(user,money,cb){
mysql.query('UPDATE users SET money=money+? WHERE id=?', [money,user], function(rows){
if(typeof cb!=="undefined")cb(true);
});
}

function plusKostiUserByID(user,money,cb){
mysql.query('UPDATE users SET kostochki=kostochki+? WHERE id=?', [money,user], function(rows){
if(typeof cb!=="undefined")cb(true);
});
}

function updateKostiUserByID(user,money,cb){
mysql.query('UPDATE users SET kostochki=? WHERE id=?', [money,user], function(rows){
if(typeof cb!=="undefined")cb(true);
});
}

function insertSmilesFunc1(){
var a=[];
for (var i = 0; i < a.length; i++) {
var el=a[i];
mysql.query('INSERT INTO smiles (name,url) VALUES (?,?)', [el.name,el.v], function(rows){
});
}
}


function saveMapByUser(map,user,cb){
var ts=getTimestamp();
mysql.query('INSERT INTO maps (map,time,user) VALUES (?,?,?)', [map,ts,user], function(rows){
if(typeof cb!=="undefined")cb(rows.insertId);
});
}

function getRandomIdMap(cb){
mysql.query('SELECT id FROM maps ORDER BY RAND( ) LIMIT 1', [], function(rows){
var id=-1;
if(rows!=null && rows.length>0){
var ob=rows[0];
id=ob['id'];
}
if(typeof cb!=="undefined")cb(id);
});
}

function getMapsCountUsers(id,cb){
mysql.query('SELECT id FROM maps WHERE user=? AND status=?', [id,1], function(rows){
var v=0;
if(rows!=null && rows.length>0){
v=rows.length;
}
if(typeof cb!=="undefined")cb(v);
});
}

function packAllMapsFolder(folder,cb){
mysql.query('SELECT * FROM maps WHERE status=1 ORDER BY time DESC', [1], function(rows){
if(rows!=null && rows.length>0){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
var ob=parseMapObj(el);
var ba=new ByteArray();
ba.writeUTFBytes(jsonEncode(ob));
ba.pos=0;
folder.addFile(''+ob.id+'.json',ba);
}
}
if(typeof cb!=="undefined")cb();
});    
}

function packAllMapsZip(cb){
var JSZip = require("../jszip");
var zip = new JSZip();
mysql.query('SELECT * FROM maps WHERE status=1 ORDER BY time DESC', [1], function(rows){
if(rows!=null && rows.length>0){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
var ob=parseMapObj(el);
var ba=new ByteArray();
ba.writeUTFBytes(jsonEncode(ob.map));
zip.file(''+el.id+'.json',ba.ba);
}
}

zip.generateAsync({type:"nodebuffer",compression:"DEFLATE"}).then(function (content) {
if(typeof cb!=='undefined')cb(content);
});

});    
}

function parseMapObj(o){
var map=jsonDecode(o['map']);
var timeMap=0;
if(map!=null && 'time' in map)timeMap=map['time'];
if(map!=null){
var mapid=o['id'];
var statusMap=o['status'];
map['id']=mapid;
map['user']=o['user'];
map['status']=statusMap
map['timestamp']=o['time'];

var mapLvl=o['mapLevel'];
if(mapLvl<=0)mapLvl=1;
map['mapLevel']=mapLvl;

map.scoreValue=o['scoreValue'];
map.scoreCount=o['scoreCount'];
}
var oo={id:mapid,map:map,time:timeMap,timestamp:o['time'],user:o['user']};
if(statusMap==1){
var scoreVal=0;
if(map!=null){

map.statsInfo={likes:o.likes,dislikes:o.dislikes,winner:o.winnerCount,play:o.playCount,exit:o.exitCount,endtime:o.endtimeCount};
scoreVal=map.scoreValue;
}
var scoreUser=o['scoreUser'];
var ob3=null;
if(mapid in mapsMaster.updateScoresMapsObj){
ob3=mapsMaster.updateScoresMapsObj[mapid];
scoreVal=ob3.scoreLast;
scoreUser=ob3.user;
}

if(map!=null){

if(scoreVal>0){
map.scoreInfo={user:scoreUser,v:scoreVal};
}

var statsObj=mapsMaster.findMapStatsElByID(mapid);
if(statsObj!=null){
map.statsInfo.likes+=statsObj.likes;
map.statsInfo.dislikes+=statsObj.dislikes;
map.statsInfo.winner+=statsObj.winner;
map.statsInfo.play+=statsObj.play;
map.statsInfo.exit+=statsObj.exit;
map.statsInfo.endtime+=statsObj.endtime;
}
}


}

/*if('txt1' in o){
if(o.txt1!=null && o.txt1.length>0){
oo.txt1=o.txt1;
if(map!=null)map.txt1=o.txt1;
}
}*/

return oo;
}

/*function getRandomMapMysql(mapsLevelMode,level,cb){
var lvl2=mapLevelsUsers2;
var queryEasyMaps='SELECT * FROM maps WHERE status=1 AND mapLevel<'+lvl2+' AND scoreValue=0 ORDER BY RAND() LIMIT 1';
var query='SELECT * FROM maps WHERE status=1 AND mapLevel>='+lvl2+' AND scoreValue=0 ORDER BY RAND() LIMIT 1';

//var s1='SELECT maps.* FROM (SELECT id FROM maps ORDER BY RAND() LIMIT 1) AS ids JOIN maps ON maps.id = ids.id WHERE maps.status=1';
//var query=s1+' AND maps.mapLevel>='+lvl2+' AND maps.scoreValue=0';
//var queryEasyMaps=s1+' AND maps.mapLevel<'+lvl2+' AND maps.scoreValue=0';
//var query2=s1+' AND maps.mapLevel>='+lvl2+'';
//var queryEasyMaps2=s1+' AND maps.mapLevel<'+lvl2+'';


var queryEasyMaps2='SELECT * FROM maps WHERE status=1 AND mapLevel<'+lvl2+' ORDER BY RAND() LIMIT 1';
var query2='SELECT * FROM maps WHERE status=1 AND mapLevel>='+lvl2+' ORDER BY RAND() LIMIT 1';

var isEasy=false;
//var query='SELECT * FROM maps WHERE status=1 ORDER BY RAND() LIMIT 1';

if(level<lvl2){
isEasy=true;
}else{
if(mapsLevelMode==0){
isEasy=true;
}
}

//mapsObjSelect={type:'user',userid:1,mapLevel:6};

if(isEasy){
query=queryEasyMaps;
}

//if(mapsObjSelect){
//if(mapsObjSelect.type=='user' && level>=mapsObjSelect.mapLevel){
//var userid=mapsObjSelect.userid;
//query='SELECT * FROM maps WHERE status=1 AND mapLevel>='+mapsObjSelect.mapLevel+' AND user='+userid+' ORDER BY RAND() LIMIT 1';
//}
//}

//console.log(query);
mysql.query(query, [], function(rows){
var o=null;
if(rows!=null && rows.length>0)o=rows[0];
if(o!=null){
if(typeof cb!=="undefined")cb(o);   
}else{
if(isEasy){
query2=queryEasyMaps2;
}
mysql.query(query2, [], function(rows2){
var o=null;
if(rows2!=null && rows2.length>0)o=rows2[0];
if(typeof cb!=="undefined")cb(o);
});

}
});

}*/

/*function loadMapsAllFunc1(cb){
mapsIdsSelectObj=null;
var ob={};
var maps1=[];
var maps6=[];
//var mapsScores1=[];
//var mapsScores6=[];

ob['maps1']=maps1;
ob['maps6']=maps6;
//ob['mapsScores1']=mapsScores1;
//ob['mapsScores6']=mapsScores6;
mysql.query('SELECT id, mapLevel, scoreValue FROM maps WHERE status=1 ORDER BY RAND()', [], function(rows){
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
var mapid=el.id;
if(el.mapLevel>=mapLevelsUsers2){
maps6.push(mapid);
//if(el.scoreValue==0)mapsScores6.push(mapid);
}else{
maps1.push(mapid);
//if(el.scoreValue==0)mapsScores1.push(mapid);
}
}
}
mapsIdsSelectObj=ob;
if(typeof cb!=="undefined")cb(ob);
});
}*/

function getRandomMapMysql(mapsLevelMode,level,cb){
var lvl2=mapLevelsUsers2;
var queryEasyMaps='SELECT * FROM maps WHERE status=1 AND mapLevel<'+lvl2+' AND scoreValue=0 ORDER BY RAND() LIMIT 1';
var query='SELECT * FROM maps WHERE status=1 AND mapLevel>='+lvl2+' AND scoreValue=0 ORDER BY RAND() LIMIT 1';
var queryEasyMaps2='SELECT * FROM maps WHERE status=1 AND mapLevel<'+lvl2+' ORDER BY RAND() LIMIT 1';
var query2='SELECT * FROM maps WHERE status=1 AND mapLevel>='+lvl2+' ORDER BY RAND() LIMIT 1';

var isEasy=false;
if(level<lvl2){
isEasy=true;
}else{
if(mapsLevelMode==0){
isEasy=true;
}
}

/*if(mapsIdsSelectObj==null){
loadMapsAllFunc1(function(ob){
console.log(ob);
});
}*/

//mapsObjSelect={type:'user',userid:1,mapLevel:6};

if(isEasy){
query=queryEasyMaps;
}

//if(mapsObjSelect){
//if(mapsObjSelect.type=='user' && level>=mapsObjSelect.mapLevel){
//var userid=mapsObjSelect.userid;
//query='SELECT * FROM maps WHERE status=1 AND mapLevel>='+mapsObjSelect.mapLevel+' AND user='+userid+' ORDER BY RAND() LIMIT 1';
//}
//}

//console.log(query);
mysql.query(query, [], function(rows){
var o=null;
if(rows!=null && rows.length>0)o=rows[0];
if(o!=null){
if(typeof cb!=="undefined")cb(o);   
}else{
if(isEasy){
query2=queryEasyMaps2;
}
mysql.query(query2, [], function(rows2){
var o=null;
if(rows2!=null && rows2.length>0)o=rows2[0];
if(typeof cb!=="undefined")cb(o);
});

}
});

}

function getRandomMap(mapsLevelMode,level,cb){
var lvl2=mapLevelsUsers2;
var obb=mapsMaster.mapsIdsSelectObj;
var isEasy=false;
if(level<lvl2){
isEasy=true;
}else{
if(mapsLevelMode==0){
isEasy=true;
}
}

if(obb!=null){
var aa=obb.maps6;
if(isEasy)aa=obb.maps1;
if(aa.length>0){
var mapid=aa.pop();
mysql.query('SELECT * FROM maps WHERE id=?', [mapid], function(rows){
var o=null;
if(rows!=null && rows.length>0)o=parseMapObj(rows[0]);
if(typeof cb!=="undefined")cb(o);
});
}else{
if(!mapsMaster.isLoadMapsV1){
mapsMaster.isLoadMapsV1=true;
mapsMaster.loadMapsAllFunc2(obb,isEasy,function(){
//console.log(obb);
mapsMaster.isLoadMapsV1=false;
var aa1=obb.maps6;
if(isEasy)aa1=obb.maps1;
if(aa1.length>0){
getRandomMap(mapsLevelMode,level,cb);
}else{
if(typeof cb!=="undefined")cb(null);
}
});
}else{
if(typeof cb!=="undefined")cb(null);
}
//if(typeof cb!=="undefined")cb(null);
}
//console.log(aa);
}

/*getRandomMapMysql(mapsLevelMode,level,function(res){
var o=null;
if(res!=null){
o=parseMapObj(res);
}
if(typeof cb!=="undefined")cb(o);
});*/


/*var lvl2=mapLevelsUsers2;
//var queryEasyMaps='SELECT * FROM maps WHERE status=1 AND mapLevel<'+lvl2+' ORDER BY scoreValue ASC, RAND() LIMIT 1';
//var query='SELECT * FROM maps WHERE status=1 AND mapLevel>='+lvl2+' ORDER BY scoreValue ASC, RAND() LIMIT 1';
var queryEasyMaps='SELECT * FROM maps WHERE status=1 AND mapLevel<'+lvl2+' ORDER BY RAND() LIMIT 1';
var query='SELECT * FROM maps WHERE status=1 AND mapLevel>='+lvl2+' ORDER BY RAND() LIMIT 1';
var isEasy=false;
//var query='SELECT * FROM maps WHERE status=1 ORDER BY RAND() LIMIT 1';

if(level<lvl2){
isEasy=true;
}else{
if(mapsLevelMode==0){
isEasy=true;
}
}

//mapsObjSelect={type:'user',userid:1,mapLevel:6};

if(isEasy){
query=queryEasyMaps;
}

if(mapsObjSelect){
if(mapsObjSelect.type=='user' && level>=mapsObjSelect.mapLevel){
var userid=mapsObjSelect.userid;
query='SELECT * FROM maps WHERE status=1 AND mapLevel>='+mapsObjSelect.mapLevel+' AND user='+userid+' ORDER BY RAND() LIMIT 1';
}
}

//console.log(query);
mysql.query(query, [], function(rows){
var o=null;
if(rows!=null && rows.length>0){
o=parseMapObj(rows[0]);
}
if(typeof cb!=="undefined")cb(o);
});*/
}


function getModMapsIds(cb){
mysql.query('SELECT id FROM maps WHERE status=? ORDER BY id DESC', [0], function(rows){
var o=[];
if(rows!=null && rows.length>0){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
o.push(el.id);
}
}
if(typeof cb!=="undefined")cb(o);
});
}


function getMapsIdsByStatus(t,cb){
mysql.query('SELECT id FROM maps WHERE status=? ORDER BY id DESC', [t], function(rows){
var o=[];
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
o.push(el.id);
}
}
if(typeof cb!=="undefined")cb(o);
});
}

function findMapsIdsByUser(id,initiatorid,cb){
var s2='';
//if(id!=initiatorid)s2=' AND status=1';
mysql.query('SELECT id FROM maps WHERE user=?'+s2+' ORDER BY id DESC', [id], function(rows){
var o=[];
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
o.push(el.id);
}
}
if(typeof cb!=="undefined")cb(o);
});
}

function findMapsAllIds(cb){
//mysql.query('SELECT id FROM maps WHERE status=? ORDER BY id DESC', [1], function(rows){
mysql.query('SELECT id FROM maps WHERE status=1 ORDER BY id DESC', [], function(rows){
var o=[];
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
o.push(el.id);
}
}
if(typeof cb!=="undefined")cb(o);
});
}

function findMapsByIDS(ids,cb){ // поиск карт по определённым id
if(ids==null)ids=[];
var cc='';
for (var i = 0; i < ids.length; i++) {
ids[i]=parseInt(ids[i]);
cc+='?';
if(i!=ids.length-1)cc+=',';
}

mysql.query('SELECT * FROM maps WHERE id IN('+cc+')', ids, function(rows) {
var arr=[];
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var ob=parseMapObj(rows[0]);
arr.push(ob);
}

}
if(typeof cb!=="undefined")cb(arr);
});
}

function findMapByID(id,cb){
mysql.query('SELECT * FROM maps WHERE id=?', [id], function(rows){
var m=null;
if(rows!=null && rows.length>0){
var ob=parseMapObj(rows[0]);
m=new GameMap();
m.parseMap(ob.map);
}
if(typeof cb!=="undefined")cb(m);
});
}

function LoadCountUsersDB(){
var th=this;
mysql.query('SELECT COUNT(*) as count FROM users', [], function(rows) {
if(rows!=null && rows.length>0){
var o=rows[0];
countUsersDB=o['count'];
}
th.next();
});
}


function parseBanList(){
var a=[];
for (var i = 0; i < banList.length; i++) {
var el=banList[i];
var access=0;
if('access' in el)access=el.access;
//a.push({id:el.id,name:el.name,price:el.price});
a.push([el.id,el.name,el.time,access]);
}
return a;
}

function parseGiftsList(){
var a=[];
for (var i = 0; i < shopMaster.giftsList.length; i++) {
var el=shopMaster.giftsList[i];
//a.push({id:el.itemid,name:el.name,txt:el.txt,price:el.price,price_type:el.price_type,active:el.active});
a.push([el.itemid,el.name,el.txt,el.price,el.price_type,el.url,el.active]);
}
return a;
}

function LoadPaymentsVKList(){
paymentsList=[];
var th=this;
mysql.query('SELECT * FROM payment_price WHERE social=? AND type=?', ['vk','kosti'], function(rows) {
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
paymentsList.push({id:el.id,price:el.price,votes:el.votes});
}
}
th.next();
});
}

function LoadPaymentsAllList(){
paymentsAllList=[];
var th=this;
mysql.query('SELECT * FROM payment_price WHERE social=?', ['vk'], function(rows) {
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
paymentsAllList.push({id:el.id,type:el.type,price:el.price,votes:el.votes});
}
}
th.next();
});
}

function getPaymentItemByID(id){
for (var i = 0; i < paymentsAllList.length; i++) {
var el=paymentsAllList[i];
if(el.id==id)return el;
}
return null;
}

function isHttpsServer(){
if(!isWin){
return true;
}
return false;
}

function findUserByLogin(login,cb,cberr){
mysql.query('SELECT * FROM users WHERE login=?', [login], function(rows) {
var ob=null;
if(rows!=null){
if(rows.length>0)ob=rows[0];
}
if(typeof cb!=="undefined")cb(ob);
},function(){
if(typeof cberr!=='undefined')cberr();
});
}

function findUserByID(id,cb){
mysql.query('SELECT * FROM users WHERE id=?', [id], function(rows) {
var ob=null;
if(rows!=null){
if(rows.length>0)ob=rows[0];
}
if(typeof cb!=="undefined")cb(ob);
});
}



function SubstrTxtChatSize(txt,size){
if(txt.length>size)txt=txt.substr(0,size);
return txt;
}

function addChatRoom(id,name,type){
var c = new ChatRoom(null,id,name,type);
//trace("add chatRoom ID "+id,name);
chatRooms[c.id]=c;
return c;
}

function getUserInfoByID(id,cb){
getUsersObjByIds(null,[id],function(res){
var ob=null;
if(res!=null && res.length>0)ob=res[0];
if(typeof cb!=='undefined')cb(ob);
});
}


function reloadTopOpytUsers(cb){
var obb={users:[],items:[]};
if(opytTopObjEvent!=null){
var ts2=getTimestamp();
allTsOpytUpd=ts2+(60*5);
opytTopObjEvent.tm=allTsOpytUpd;
}

mysql.query('SELECT * FROM users ORDER BY opyt DESC LIMIT 50', [], function(rows) {
var res=[];
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var ob=rows[i];
var uu=new User(null);
uu.parseObj(ob);
obb.users.push(uu.id);
obb.items.push([uu.id,uu.opyt,uu.level]);
//console.log(uu.id,uu.opyt,uu.nick);
}
}
if(typeof cb!=='undefined')cb(obb);
});

}


function reloadTopPopularUsers(cb){
var obb={users:[],items:[]};
if(popularTopObjEvent!=null){
var ts2=getTimestamp();
allTsPopularUpd=ts2+(60*30);
popularTopObjEvent.tm=allTsPopularUpd;
}

mysql.query('SELECT * FROM users ORDER BY popularLevel DESC, popular DESC LIMIT 50', [], function(rows) {
var res=[];
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var ob=rows[i];
var uu=new User(null);
uu.parseObj(ob);
obb.users.push(uu.id);
obb.items.push([uu.id,uu.popular,uu.popularLevel]);
//console.log(uu.id,uu.opyt,uu.nick);
}
}
if(typeof cb!=='undefined')cb(obb);
});

}


function topScoresUsersParseList(oo){
if(oo!=null){
var a=[];
var o={data:a,allCount:oo.allCount};
var arr=oo.data;
if(arr!=null){
for (var i = 0; i < arr.length; i++) {
var el=arr[i];
a.push({user:el.user,nums:el.nums});
}
}
return o;
}
return null;
}

function topScoresFindByUserID(oo,user){
var a=[];
if(oo!=null){
var arr=oo.data;
if(arr!=null){
for (var i = 0; i < arr.length; i++) {
var el=arr[i];
if(el.user==user && 'list' in el){
a=el.list;
}
}
}
}
return a;
}

function reloadTopScoresUsers(cb){
var obb=[];
//if(scoresTopObjEvent!=null){
var ts2=getTimestamp();
allTsTopScoresUpd=ts2+(60*30);
topScoresUsersList=null;
//scoresTopObjEvent.tm=allTsTopScoresUpd;
//}
var limit=100;
var allCount=0;
mysql.query('SELECT id, scoreUser, scoreValue FROM maps WHERE status=1 AND scoreValue>0 ORDER BY scoreValue DESC', [], function(rows) {
var oo={};
var ar1=[];
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var ob=rows[i];
allCount+=1;
var scoreUser=ob['scoreUser'];
var scoreV=ob['scoreValue'];
var aa=null;
var ob2=null;
if(scoreUser in oo)ob2=oo[scoreUser];
else{
ob2={user:scoreUser,list:[],nums:0};
oo[scoreUser]=ob2;
ar1.push(ob2);
}
ob2.list.push({id:ob.id,v:scoreV});
ob2.nums+=1;
//console.log(ob);
}
}
//obb.items=oo;
//topScoresUsersList=obb;
//ar1.push({user:2,list:[1,2,3,4,5]});

ar1.sort(function(a1,a2){return a2.list.length-a1.list.length;});
var sort2Func=function(o1,o2){return o1.v-o2.v;};

if(ar1.length>limit)ar1=ar1.slice(0,limit);

for (var i = 0; i < ar1.length; i++) {
var a2=ar1[i];
a2.list.sort(sort2Func);
if(a2.list.length>limit)a2.list=a2.list.slice(0,limit);
}
//console.log(ar1);

obb=ar1;
topScoresUsersList={data:obb,allCount:allCount};
if(typeof cb!=='undefined')cb(topScoresUsersList);
});

}



function reloadTopMaps1Users(cb){
var obb={};
var ts2=getTimestamp();
allTsTopMaps1Upd=ts2+(60*30);
topMaps1UsersList=null;
var limit=100;
mysql.query('SELECT id, user FROM maps WHERE status=1', [], function(rows) {
var oo={};
var ar1=[];
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var ob=rows[i];
var userid=ob['user'];
var ob2=null;
if(userid in oo)ob2=oo[userid];
else{
ob2={user:userid,nums:0};
oo[userid]=ob2;
ar1.push(ob2);
}
ob2.nums+=1;
}
}

ar1.sort(function(a1,a2){return a2.nums-a1.nums;});
if(ar1.length>limit)ar1=ar1.slice(0,limit);
obb=ar1;
topMaps1UsersList=obb;
if(typeof cb!=='undefined')cb(obb);
});

}

function getUserInfoOne(initiator,userid,mode,cb){
if(typeof mode=='undefined')mode=0;
var initiatorid=0;
if(initiator!=null)initiatorid=initiator.id;

if(cb){
var user=AllUsersRoom.getUserByID(userid);
if(user){
cb(user.getACUObj1(initiatorid,mode));
}else{
mysql.query('SELECT * FROM users WHERE id=?', [userid], function(rows){
var ob=null;
if(rows && rows.length>0)ob=rows[0];
if(ob){
var uu=new User(null);
uu.parseObj(ob);
uu.loadUserDressItems(function(){
var res=uu.getACUObj1(initiatorid,mode);
cb(res);
});
}else{
cb(null);
}
});
}
}
}


function getUsersObjByIds(initiator,ids,cb,mode,isUser){
if(typeof mode=='undefined')mode=0;
if(typeof isUser=='undefined')isUser=false;
var initiatorid=0;
if(initiator!=null)initiatorid=initiator.id;
var res=[];
var idss=[];
var noIds=[];
var obj={};
for (var i=0; i < ids.length; i++) {
var id=parseInt(ids[i]);
if(id!=0 && !(id in obj)){
idss.push(id);
obj[id]=1;
}
}
if(idss.length>0){
for (var i = 0; i < idss.length; i++) {
var id=idss[i];
var user=AllUsersRoom.getUserByID(id);
if(user!=null){
if(isUser){
res.push(user);
}else{
res.push(user.getACUObj1(initiatorid,mode));   
}
}else{
noIds.push(id);
}
}
}else{
if(typeof cb=='function')cb(res);
return;
}

if(noIds.length>0){
var cc=strFill('?',',',noIds.length);
mysql.query('SELECT * FROM users WHERE id IN('+cc+')', noIds, function(rows) {
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var ob=rows[i];
var uu=new User(null);
uu.parseObj(ob);
if(isUser){
res.push(uu);
}else{
res.push(uu.getACUObj1(initiatorid,mode));   
}
}
}
if(typeof cb=='function')cb(res);
});


}else{
if(typeof cb=='function')cb(res);
}

}

function checkFileFolder(path){
try{
return fs.lstatSync(path).isDirectory();
}catch(e){}
return false;
}

function saveMessagesAllRooms(){
var nm='ChatCurHistory';
var v1=false;
var ob={};

for(var n in chatRooms){
var r=chatRooms[n];
var msgs=r.getMessagesList1();
ob[r.type]=msgs;
if(r.isAppendMsg){
r.isAppendMsg=false;
v1=true;
}
}

if(v1){
if(checkFileFolder(pathSaveHistoryMsgs)){
var path=pathSaveHistoryMsgs+'/'+nm;
try{
var ba=new ByteArray();
ba.writeObject(ob);
var wr=fs.createWriteStream(path, {'flags':'w+'});
wr.write(ba.getBytes());
wr.end();
}catch(e){
//console.log(e);
}
}
}

}

function restoreMessagesAllRooms(){
var nm='ChatCurHistory';
var path=pathSaveHistoryMsgs+'/'+nm;
try{
var bb=fs.readFileSync(path);
var ba=new ByteArray(bb);
var ob=ba.readObject();
if(ob!=null){
for(var n in ob){
if(n in chatRooms){
var r=chatRooms[n];
var msgs=ob[n];
r.messages=[];
//for (var i = 0; i < 150; i++)r.sendSystemMessage('тест',true);

if(msgs!=null){
//console.log('restoreee',msgs.length);

var p1=0;
if(msgs.length>=limitMessagesRoom)p1=msgs.length-limitMessagesRoom;
//msgs=msgs.slice(0,-limitMessagesRoom);
//console.log('restoreee',msgs.length);
var nyid=0;
//if(newYearUser)nyid=newYearUser.id;
for (var i = p1; i < msgs.length; i++) {
var el=msgs[i];
if(el.ot>-1 || /*el.ot==nyid ||*/ el.ot==boarUser.id){
r.messages.push(el);
r.isAddMsgEvent=true;
//if(r.messages.length>=limitMessagesRoom)break;
}
}
}

//r.messages=ob[n];
}
}
}
}catch(e){}
/*for(var n in chatRooms){
var r=chatRooms[n];
r.restoreMessagesCurFile();
}*/


//dialogsMaster.restoreAllDialogsRoom();

}


function saveMessagesChatHistory(){
MainRoom.saveMessagesFile();
if(ModRoom)ModRoom.saveMessagesFile();
saveMessagesAllRooms();
}

function initServer(){
srv.disconnectCB=function(){
this.disconnectV=true;
//trace("disconnect",this.user);
}

if(!isWin){
srv.Debug=false;
//srv.isBinary=1;
}
srv.type='ws';
srv.isBinary=1;
//delete srv.isBinary;
//srv.init('game',19942);


/*var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
}*/

var curTS=getTimestamp();

startServerTS=curTS;

var curDate = new Date();
curDate.setTime(curTS*1000);

var prizeEvents = new TimeEventsMaster(1,"prize");
var sysEvents=new TimeEventsMaster(-1,"sysEvents");

//var tsHour=curTS+(60*60);
//var ts1=Math.floor(curTS/1000);
//ts1-=(60*60*24);
//ts1-=(60*60);
//trace(ts1,curDate.getSeconds());

/*var allTsHour = curTS+((60-curDate.getMinutes())*60)-curDate.getSeconds();
allTsHour-=tmInterval;*/

/*var dayDt3 = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 1);
var allTsDay = curTS+((dayDt3.getTime() - curDate.getTime()) / 1000);
allTsDay-=tmInterval;*/

//trace(Math.floor((allTsHour-curTS)/60));


var dt=new Date();
var hours1=dt.getHours();
var min=dt.getMinutes();
if(hours1>=23)hours1+=1;
if(min>0){
//if(hours1>=23)dt.setDate(dt.getDate()+1);
dt.setHours(hours1+1);
dt.setMinutes(0);
dt.setSeconds(0);
dt.setMilliseconds(0);
}

/*var dt2=new Date();
var hh=dt2.getHours();
//if(hh>0){
dt2.setDate(dt2.getDate()+1);
dt2.setHours(0);
dt2.setMinutes(0);
dt2.setSeconds(0);
dt2.setMilliseconds(0);
//}*/

allTsHour=Math.floor(dt.getTime()/1000);
//allTsHour=Math.floor(Date.now()/1000)+30;
//allTsDay=Math.floor(dt2.getTime()/1000);
//allTsDay=getTimestampPrizeDay();
//var minutesV=Math.floor((allTsHour-getTimestamp())/60);
//console.log(minutesV);

var hourPrizeObj=prizeEvents.add(1,"hour",allTsHour,function(){
curTS=getTimestamp();

var dt=new Date();
var min=dt.getMinutes();
dt.setHours(dt.getHours()+1);
dt.setMinutes(0);
dt.setSeconds(0);
dt.setMilliseconds(0);

this.tm=Math.floor(dt.getTime()/1000);
allTsHour=this.tm;
  //this.tm=curTS+(60*60)-tmInterval;
  //log('prize hour '+new Date());
  sendPrizeTop('hour');
});

/*var dayPrizeObj=prizeEvents.add(2,"day",allTsDay,function(){
	curTS=getTimestamp();

this.tm=getTimestampPrizeDay();
allTsDay=this.tm;
sendPrizeTop('day');*/
/*var dt2=new Date();
var hh=dt2.getHours();
dt2.setDate(dt2.getDate()+1);
dt2.setHours(0);
dt2.setMinutes(0);
dt2.setSeconds(0);
dt2.setMilliseconds(0);
this.tm=Math.floor(dt2.getTime()/1000);
allTsDay=this.tm;*/
  //this.tm=curTS+(60*60*24)-tmInterval;
  //prizeEvents.remove(this)
  //log('prize day '+new Date());
  //sendPrizeTop('day');
  //nextDay8marta();
//});


var saveMsgsEvent=sysEvents.add(5,"saveMsgs",curTS+60,function(){
	curTS=getTimestamp();
  this.tm=curTS+60;
  saveMessagesChatHistory();
  topM.updateDB();
  updateMiniChatMsgs();
});
var saveMsgsEvent2=sysEvents.add(6,"saveMsgs3",curTS+5,function(){
curTS=getTimestamp();
this.tm=curTS+30;
if(eventsActionMaster)eventsActionMaster.update();
//if(statsUsers)statsUsers.update();
updateChangeNickTime();
saveMessagesAllRooms();
//if(dialogsMaster.isInit)dialogsMaster.saveRoomsAll();
});


var saveMsgsEvent2=sysEvents.add(7,"saveUsersDB",curTS+(60*3),function(){
curTS=getTimestamp();
this.tm=curTS+(60*3);
saveAllDataSrv();
});

var updateJob=sysEvents.add(10,"updateJob",curTS+(60*1),function(){
curTS=getTimestamp();
this.tm=curTS+(60*1);
jobMaster.update();
mapsMaster.update();
//if(statsUsers)statsUsers.update();
});

var updateStats=sysEvents.add(23,"updateStats",curTS+(60*2)+5,function(){
curTS=getTimestamp();
this.tm=curTS+(60*2)+5;
if(statsUsers)statsUsers.update();
});

/*var gcJob=sysEvents.add(17,"subscribeJob",curTS+20,function(){
curTS=getTimestamp();
this.tm=curTS+20;
subscriptionMaster.update(function(){
});
});*/
var gcTimeCheck=60*60*3;
var gcJob=sysEvents.add(17,"gcJob",curTS+gcTimeCheck,function(){
curTS=getTimestamp();
this.tm=curTS+gcTimeCheck;
gcRun();
});

var updateEventsTime=sysEvents.add(12,"updateEventsTime",curTS+30,function(){
curTS=getTimestamp();
this.tm=curTS+30;
var r8=isEndCurrentEventT2();
//eventsTimeMaster.update();
//notifyMaster.saveDB();
});

var updOpytTopSecs=60*5;

var ts1=getTimestamp();
allTsOpytUpd=ts1+updOpytTopSecs;
opytTopObjEvent=sysEvents.add(14,"topOpytUpd",allTsOpytUpd,function(){
reloadTopOpytUsers(function(arr){
topOpytUsersList=arr;
});
});

allTsPopularUpd=ts1+(60*30);
popularTopObjEvent=sysEvents.add(15,"topPopularUpd",allTsPopularUpd,function(){
reloadTopPopularUsers(function(arr){
topPopularUsersList=arr;
});
});


/*allTsTopScoresUpd=ts1+(60*30);
scoresTopObjEvent=sysEvents.add(16,"topScoresUpd",allTsTopScoresUpd,function(){
reloadTopScoresUsers(function(arr){
topScoresUsersList=arr;
});
});*/

/*var userModeEvent=sysEvents.add(16,"userModeEvent",ts1,function(){
curTS=getTimestamp();
this.tm=curTS+(60*30);
userMaster.loadListUsersMode(function(arr){
ModeUsersListV=[];
if(arr!=null){
for (var i = 0; i < arr.length; i++)ModeUsersListV.push(arr[i]);
}
//console.log(ModeUsersListV);
});
});*/


userMaster.loadListUsersMode(function(arr){
ModeUsersListV=[];
if(arr!=null){
for (var i = 0; i < arr.length; i++)ModeUsersListV.push(arr[i]);
}
});

//topM.updateDB();

AllUsersRoom=new ChatRoom(null,0,'MAIN',1);
MainRoom = addChatRoom(1,"общий чат",1);
ModRoom = addChatRoom(2,"администрация",2);
/*SystemRoom=addChatRoom(3,"система",3);

SystemRoom.addUser(systemUser);*/

MainRoom.addUser(systemUser);
//MainRoom.addUser(newYearUser);
//ModMapsRoom=addChatRoom(4,"мод. карт",4);
/*minigameViktorinaRoom=new MiniGameViktorina();
minigameViktorinaRoom.init();*/

restoreMessagesAllRooms();

//SystemRoom.sendMsgByUser(systemUser,null,'Комната только для уведомлений.','#FFCC00');

/*setTimeout(function(){
sendPrizeTop('hour');
},10000);*/

//sendPrizeTop('hour');

//MainRoom.sendPrizeHourMsg([1,2]);
//MainRoom.restoreMessagesCurFile();
//MainRoom.sendSystemMessage('Проверка:-[',true);

/*worldStream=findAutoWorld();*/

//notifyMaster.addNotifyV(0,'systemMsg',-2,['Привет)'],false);
//notifyMaster.addNotifyV(0,'msg',-2,['Привет)'],false);

//dialogsMaster.addRoom(DIALOG_DEF,1,'Беседа 1');
//requestsMaster.add('requestTester','Приглашаем вас стать тестером!',1,getTimestamp()+60);
//requestsMaster.add('requestModerator','Приглашаем вас на должность модератора чата!',1,getTimestamp()+60*1);
//requestsMaster.add('addKostiFree','5 косточек даром!',1,getTimestamp()+60,'5');
//requestsMaster.add('nickRainbow','Ник со цветами радуги на 2 минуты бесплатно!',1,getTimestamp()+60,getTimestamp()+(60*2));
//requestsMaster.add('addLapkiFree','30 лапок даром!',1,getTimestamp()+60,'30');
//requestsMaster.add('addHealth','100% здоровья даром!',1,getTimestamp()+60*2,'100');
/*requestsMaster.getRequestsListUser(1,function(a){
	trace(a)
})*/
//worldStream=new PersWorldMaster(0);
//worldStream.init();

timer1=setInterval(function(){
var ts=getTimestamp();
prizeEvents.update(ts);
sysEvents.update(ts);
checkDisconnectedUsers();
/*if(homePersWorld!=null){
homePersWorld.updateCountUsers();
}*/
},tmInterval*1000);

//jobMaster.add(1,1,500);
/*var st=srv.createStream(1);
st.setInOutHanler(function(connect,isIn){
if(isIn){
trace('in user');
st.sendConnect(connect,"init",'гав');
}else{
trace('out user');
}
});
st.on('aaa',function(oo){
trace('aaaaaaaaaaa',oo);
});*/


function insertSnapshotData(type,expire,data,cb){
var ts=getTimestamp();
mysql.query('INSERT INTO snapshots (type,data,expire,time) VALUES (?,?,?,?)', [type,data,expire,ts], function(rows){
if(!rows){
if(typeof cb!=='undefined')cb(null);
}else{
var v=null;
if('insertId' in rows)v={id:rows['insertId']};
if(typeof cb!=='undefined')cb(v);
}
});
}


function AuthFuncByLoginUser(th,login,obAccount,ob8){
findUserByLogin(login,function(u){
if(u!=null){
th.connect.disconnectV=false;

if(u.block==1){
//th.disconnect();
th.send(statusServer,-2);
return;
}

if(obAccount==null)obAccount={access:'',isOriginal:1};
var userid=u['id'];
var userOnline=MainRoom.getUserByID(userid);
if(!userOnline){
if(u!=null){
var uu=new User(th,obAccount);
uu.parseObj(u);
uu.loadUserDressItems();
uu.ip=uu.getIPConnect(th);
if('authDevice' in th)uu.authDevice=th.authDevice;
if('isNewVersion' in th)uu.isNewVersion=th.isNewVersion;
if(ob8 && 'authData' in ob8){
uu.vm2AuthLoginPass=ob8.authData;
}

AuthDataFunc1(th,uu,obAccount);
}
}else{
if('isOriginal' in obAccount){
userOnline.disconnectOwner();

MainRoom.sendPrivateMsg(systemUser,userOnline,'Хозяин страницы в сети');

}else if('code' in obAccount){
var acc=userOnline.findAccountByCode(obAccount.code);
if(acc!=null){
acc.disconnect();
}
}

if('authDevice' in th)userOnline.authDevice=th.authDevice;
if('isNewVersion' in th)userOnline.isNewVersion=th.isNewVersion;
userOnline.addConnect(th,obAccount);
//var ob2={ip:userOnline.getIPConnect(th)};
//MainRoom.sendPrivateMsg(systemUser,userOnline,'Произошёл вход на страницу с IP '+ob2.ip+'');
//if(ob2.ip!=userOnline.ip)notifyMaster.addNotifyV(userOnline.id,'systemMsg',0,['Произошёл вход на страницу с IP '+ob2.ip+''],true);
//userOnline.addConnect(th);
//userOnline.emitNoInitiator('authEventA',th.connect,[ob2]);
if(UserMode.isUndefined(u.mode)){
th.disconnect();
}else{
th.connect.user=userOnline;
th.connect.user.updateProps(u);
userOnline.connect=th;
AuthDataFunc1(th,th.connect.user,obAccount);
}
}
}else{
++countUsersDB;
var ts=getTimestamp();
var nick='Игрок '+countUsersDB;
mysql.query('INSERT INTO users (login,nick,level,lastLevel,opyt,health,popular,energy,money,kostochki,mode,reg_time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [login,nick,1,1,0,100,0,maxEnergyValue,regNewUserMoney,regNewUserKosti,USER_MODE_USER,ts], function(rows){
if(!rows){
th.send(statusServer,ErrorType.ERROR_DB);
}else{
AuthFuncByLoginUser(th,login,null,ob8);
}
});
}
},function(){
th.send(statusServer,ErrorType.ERROR_DB);
});
}

function generateGuestID(){
var id=Math.floor(Math.random()*1000000);
var users=AllUsersRoom.users;
for (var i = 0; i < users.length; i++) {
var u=users[i];
if(u!=null && u.id==-id && 'isGuest' in u && u.isGuest){
return generateGuestID();
}
}
return id;
}

function AuthFuncByVM2LoginPass(th,login,pass){
if(login!=null && login.length>0 && pass!=null && pass.length>0){
//var url='https://ag6.ru/VM2AuthSite.php';
apiVM2Site({login:login,pass:pass},function(oo){
if(oo==null){
th.send(statusServer,0);    
}else{
/*request({method:'POST',url:url,form:{login:login,pass:pass}},function(error, response, body) {
if(error){
th.send(statusServer,0);
}else{
var ob=jsonDecode(body);*/
//var oo=null;
//if(ob!=null && 'data' in ob)oo=ob.data;
if(oo!=null && 'isGuest' in oo){
var uu=new User(th,{access:''/*,isOriginal:1*/});
uu.isGuest=true;
var id=generateGuestID();
uu.parseObj({id:-id,nick:'Гость '+id,login:'guest'+id,money:5,mode:0});
uu.ip=uu.getIPConnect(th);
if('authDevice' in th)uu.authDevice=th.authDevice;
AuthDataFunc1(th,uu,null);

var guestsAccounts=getAccountsGuestIP(uu.ip);
if(guestsAccounts!=null && guestsAccounts.length>2){
var u1=guestsAccounts.shift();
if(u1!=null)u1.allDisconnect();
}

}else if(oo!=null && 'login' in oo && oo.login.length>0){
AuthFuncByLoginUser(th,oo.login,null,{authData:{login:login,pass:pass}});
}else{
th.send(statusServer,0);
}
}
});
}else{
th.send(statusServer,0);
}
}

function AuthFuncByLoginPass(th,login,pass){
if(login!=null && login.length>0 && pass!=null && pass.length>0){
var passs=md5(pass);
mysql.query('SELECT siteAuth.user, users.id, users.login FROM `siteAuth` INNER JOIN users on siteAuth.user=users.id WHERE siteAuth.login=? AND siteAuth.pass=?', [login,passs], function(rows) {
var ob=null;
if(rows!=null){
if(rows.length>0){
ob=rows[0];
AuthFuncByLoginUser(th,ob.login,null);
}else{
th.send(statusServer,0);
}
}
},function(){
th.send(statusServer,ErrorType.ERROR_DB);
});
}else{
th.send(statusServer,0);
}
}

function AuthFuncBySessKey(th,key){
if(key!=null && key.length>0){
mysql.query('SELECT sessions.code, sessions.access, sessions.user, users.id, users.login FROM `sessions` INNER JOIN users on sessions.user=users.id WHERE code=?', [key], function(rows) {
var ob=null;
if(rows!=null){
if(rows.length>0){
ob=rows[0];
AuthFuncByLoginUser(th,ob.login,{code:key,access:ob.access});
}else{
th.send(statusServer,0);
}
}
},function(){
th.send(statusServer,ErrorType.ERROR_DB);
});
}else{
th.send(statusServer,0);
}
}

function checkAuthGuest(th){
var ip='';
if(th!=null){
ip=th.clientIP();
if(ip=='1')ip='127.0.0.1';
}
if(enableGuestAuth && adminIP==ip){
return true;
}
return false;
}


function getChatRoomsUser(user){
var roomsList=[];
if(user!=null){
var userObj=user.getObj(user.id);
roomsList=[MainRoom.getObjDef()];
if(user){
//if(UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode)){
if(user.mode>0){
roomsList.push(ModRoom.getObjDef());
}

/*if(UserMode.isModeratorMaps(user.mode)){
roomsList.push(ModMapsRoom.getObjDef());
}*/

/*if(UserMode.isSuperAdmin(user.mode) || UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode) || UserMode.isModeratorMaps(user.mode)|| UserMode.isModeratorMapsM(user.mode)){
roomsList.push(SystemRoom.getObjDef());
}*/

}
}
return roomsList;
}

function AuthDataFunc1(th,uu,obAccount){
if(uu!=null){
var ts=getTimestamp();
//uu.nickRainbow=1;
uu.authTime=ts;
uu.authTimeCheckVal=ts;
th.connect.user=uu;

if(uu.id>0){
statsUsers.setValue('auth_first_time',uu.id,uu.authTime);
statsUsers.setValue('auth_end_time',uu.id,0);
}

if(obAccount!=null){
if(obAccount.access.length>0){
var accessArr=obAccount.access.split(',');
obAccount.access=accessArr;
}
}

AllUsersRoom.addUser(uu);
MainRoom.addUser(uu);
updateEnergyUser(uu);
updateBanUserInfo(uu);

if(uu.bantype>0){
if((uu.bantime-ts)<=0){
userMaster.banUserExitByID(uu.id,true);
}
}

var userObj=uu.getObj(uu.id);
var roomsList=[MainRoom.getObjDef()];
var user=th.getUserData("user");
if(user){
//if(UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode)){
if(user.mode>0){
ModRoom.addUser(uu);
roomsList.push(ModRoom.getObjDef());
}

/*if(UserMode.isModeratorMaps(user.mode)){
ModMapsRoom.addUser(uu);
roomsList.push(ModMapsRoom.getObjDef());
}*/

//if(UserMode.isSuperAdmin(user.mode)){
/*if(UserMode.isSuperAdmin(user.mode) || UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode) || UserMode.isModeratorMaps(user.mode) || UserMode.isModeratorMapsM(user.mode)){
SystemRoom.addUser(uu);
roomsList.push(SystemRoom.getObjDef());
}*/

}
//var curWorld=findAutoWorld();
var curWorld=null;
/*if(obAccount!=null){
console.log(obAccount);
}*/

//var persHomeWorldID=homePersWorld.stream.id;

//addMailMsg(0,uu.id,'вход в игру');

var webKeyApi=generateWebApiKeyUser(uu.id);
//var gifts=parseGiftsList();
var banListArr=parseBanList();
var flagsArr=uu.flagsMaster.arr;
var flagsSettings=uu.settingsFlagsMaster.arr;
var lvl2=uu.popularLevel-1;
/*if((uu.popularLevel-1)>popularList.length)lvl2=popularList.length-1;
var popularArr=parsePopularListUser(popularList[lvl2]);*/
var popularArr=parsePopularList2();
var srvTime=getTimestamp();
var tsSrv=getTimestamp()-startServerTS;

var giftFreeBonus=0;

if(uu.id>0 && srvTime>=uu.giftFreeTime){

var aa2=[];
for (var i = 0; i < shopMaster.giftsList.length; i++) {
var el=shopMaster.giftsList[i];
if(el.price<=500)aa2.push(el);
}
var giftObj=aa2.random();
if(giftObj!=null){
var giftid=giftObj.itemid;
giftFreeBonus=giftid;
if(vkNotifyApi!=null)vkNotifyApi.sendMission(uu,9);
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,-2,uu.id,function(res){});
}
uu.giftFreeTime=srvTime+(60*60*24);
}

//var streamViktorinaID=minigameViktorinaRoom.id;
var GameRoomsListMasterID=gameRoomsListMaster.id;
//var dressList=dressMaster.getDressListFrames();

var cfgObj={roomsListStream:GameRoomsListMasterID,/*viktorinaStream:streamViktorinaID,*//*webKey:webKeyApi,*//*,persHomeStream:persHomeWorldID,worldStream:curWorld.id,*/exchangeMoney:shopExchangeMoney,priceChangeNick:priceChangeNick,priceSendChatColorMsg:priceSendChatColorMsg,priceSaveMap:priceSaveMapServerNew,priceRetMapServer:priceSaveMapServer,defLengthNick:defLengthNick,waitGR:startGameRoomWait,priceGROpytExit:minusGameRoomOpytExit,/*gifts:gifts,*/banList:banListArr,popularList:popularArr,koronaadminList:koronaadminList,flags:flagsArr,flagsSettings:flagsSettings,prizeTopHour:prizeKostiHoursArr,prizeTopDay:prizeKostiDaysArr,actionItems1:actionItems1Count,actionItemsNums:uu.actionItemsNums,actionItemsNumsPos:uu.actionItemsNumsPos,giftFreeBonus:giftFreeBonus,chatMsgReportsMax:maxReportChatCount,startServerTS:tsSrv,serverTime:srvTime,/*dressList:dressList,*/chatTextColorList:chatTextColorList,priceChangeNickColor:priceChangeNickColor,priceChangeNickResetColor:priceChangeNickResetColor,priceOffNickRainbow:priceOffNickRainbow,priceTesterGetMoney:priceTesterGetMoney,priceBuyStyle1:priceBuyStyle1/*,ytuty:6.7889*/};

if(uu.isNewVersion){
delete cfgObj.koronaadminList;
}

if(uu.curStyle1Items!=null && uu.curStyle1Items.length>0)cfgObj.curStyle1Items=uu.curStyle1Items;

if(uu.curStyle1App!=0)cfgObj.curStyle1=uu.curStyle1App;

var evList=eventsActionMaster.getActiveEventsList();
cfgObj.eventsList=parseEventsList(evList);

if(uu.checkOriginalConnect(th)){
cfgObj.isOwner=1;
cfgObj.webKey=webKeyApi;
}

th.send(statusServer,ErrorType.OK,userObj,cfgObj,roomsList/*,paymentsList*/);
}
}


srv.addCmd('checkPayment',function(){
updateJob();
});

srv.addCmd('chat.getRoom',function(id){
var user=this.getUserData("user");
if(user){
if(id in chatRooms){
var r=chatRooms[id];
this.send(r.getObj(user));
}
}
});

srv.addCmd('chat.getRooms',function(){
var user=this.getUserData("user");
var th=this;
if(user!=null){
var arr=getChatRoomsUser(user);
th.send(arr);
}else{
th.send([]);
}
});
/*srv.addCmd('chat.getRooms',function(roomType){
var user=this.getUserData("user");
var th=this;
var roomtype=0;
if(user!=null){
if(arguments.length>0){
roomtype=parseInt(roomType);
}

if(roomtype==DIALOG_ROOM_M){
dialogsMaster.getRoomsListByUserDB(user.id,function(a){
th.send(a);
});
//var a=dialogsMaster.getRoomsListByUser(user,user.id);
//this.send(a);
}

}
});*/

/*srv.addCmd('user.saveSettings',function(aa){
if(arguments.length>0){
var user=this.getUserData("user");
if(user){
user.setSettingsStr(aa);
}
}
});*/


/*srv.addCmd('getRebus',function(skip,slovo){
var th=this;
if(arguments.length>1 && slovo!=null){
var user=this.getUserData("user");
if(user!=null){
rebusMaster.load(skip,slovo,function(cnt){
if(cnt!=null){
th.send(cnt);
}
});
}
}
});*/

srv.addCmd('utils.cmdExists',function(name){
var th=this;
var vv=0;
if(arguments.length>0){
var nmm=''+name;
if(nmm in srv.cmds)vv=1;
}
th.send(vv);
});

srv.addCmd('utils.resolveName',function(v){
var user=this.getUserData("user");
if(user!=null && arguments.length>0){
var ob=null;
this.send(ob);
}
});

srv.addCmd('user.changeMapsLevelMode',function(v){
if(arguments.length>0){
var user=this.getUserData("user");
if(user!=null){
if(v==1){
user.mapsLevelMode=1;
this.send(1);
}else if(v==0){
user.mapsLevelMode=0;
this.send(1);
}
}
}
});


srv.addCmd('user.setEmojiStatus',function(v){
if(arguments.length>0){
var user=this.getUserData("user");
if(user!=null){
var idd=parseInt(v);
if(isNaN(idd))idd=0;
user.iconEmoji=idd;
//user.sendUpdateUserInfoCurID();
MainRoom.emitRoom('user.updateUserEmojiStatus',user.id,idd);
this.send(1);
}
}
});

srv.addCmd('user.nickColorAction',function(t,arg1){
var th=this;
var changeSec=20;
if(arguments.length>0){
var user=this.getUserData("user");
if(user!=null){
var info=null;
var isOrig=user.checkOriginalConnect(this);
if('isGuest' in user && user.isGuest)isOrig=true;
if(user.isNickColor()){
var ts=getTimestamp();
var tm=user.nickColor_end-ts;
if(tm<=0)tm=0;
var freeV=0;
if(user.nickColor_pos==-2)freeV=1;
info={time:tm,free:freeV};
}
if(t=='info'){
var ob=info;
th.send(ob);
}else if(t=='set'){
if(isOrig){
var vv=parseInt(arg1);
if(vv>0 && info!=null){
var price=priceChangeNickColor;

if(user.isVip()){
if(user.vip==1)price=price-Math.floor(price*0.5);
}

if(info.free==1)price=0;
if(user.kosti>=price){
user.minusKosti(price);
user.nickColor_pos=vv;
user.sendUpdateUserInfoCurID();
th.send(ErrorType.OK);    
}else{
th.send(ErrorType.NO_MONEY);
}

}else{
th.send(ErrorType.ERROR);
}
}else{
th.send(ErrorType.ERROR);
}
}else if(t=='reset'){
if(isOrig){
if(info!=null && user.nickColor_pos>-1){
var price=priceChangeNickResetColor;
if(user.isVip()){
if(user.vip==1)price=price-Math.floor(price*0.5);
}


var ts=getTimestamp();
if(ts>=user.tsChangeNickColor){
user.tsChangeNickColor=ts+changeSec;
user.nickColor_pos=-1;
user.sendUpdateUserInfoCurID();
th.send(ErrorType.OK);  
}else{
th.send(ErrorType.TIME_EXISTS,user.tsChangeNickColor-ts);
}

/*if(user.kosti>=price){
user.minusKosti(price);
user.nickColor_pos=-1;
user.sendUpdateUserInfoCurID();
th.send(ErrorType.OK);    
}else{
th.send(ErrorType.NO_MONEY);
}*/

}else{
th.send(ErrorType.ERROR);
}
}else{
th.send(ErrorType.ERROR);
}
}
}
}
});



srv.addCmd('user.nickRainbowAction',function(t){
var th=this;
var changeSec=20;
if(arguments.length>0){
var user=this.getUserData("user");
if(user!=null){
var info=null;
var isOrig=user.checkOriginalConnect(this);
if(user.isNickRainbow()){
var ts=getTimestamp();
var tm=user.nickRainbow_end-ts;
if(tm<=0)tm=0;
info={time:tm};
}
if(t=='info'){
var ob=info;
th.send(ob);
}else if(t=='on'){
if(isOrig){
if(info!=null && user.nickRainbow==0){
var ts=getTimestamp();
if(ts>=user.tsChangeNickRainbow){
user.tsChangeNickRainbow=ts+changeSec;
user.nickRainbow=1;
user.sendUpdateUserInfoCurID();
th.send(ErrorType.OK);  
}else{
th.send(ErrorType.TIME_EXISTS,user.tsChangeNickRainbow-ts);
}
}else{
th.send(ErrorType.ERROR);
}
}else{
th.send(ErrorType.ERROR);
}
}else if(t=='off'){
if(isOrig){
if(info!=null && user.nickRainbow==1){
if(ts>=user.tsChangeNickRainbow){
user.tsChangeNickRainbow=ts+changeSec;
user.nickRainbow=0;
user.sendUpdateUserInfoCurID();
th.send(ErrorType.OK);
}else{
th.send(ErrorType.TIME_EXISTS,user.tsChangeNickRainbow-ts);
}
/*
var price=priceOffNickRainbow;
if(user.kosti>=price){
user.minusKosti(price);
user.nickRainbow=0;
user.sendUpdateUserInfoCurID();
th.send(ErrorType.OK);    
}else{
th.send(ErrorType.NO_MONEY);
}*/
}else{
th.send(ErrorType.ERROR);
}
}else{
th.send(ErrorType.ERROR);
}
}
}
}
});



srv.addCmd('user.getBonusFree',function(t){
var th=this;
var user=this.getUserData("user");
if(user!=null && arguments.length>0){
if(t=='bonusGroup'){
var money=bonusKostiA1;

if(!user.flagsMaster.check(1,5)){
user.flagsMaster.add(1,5);

user.plusKosti(money);
user.emit('userEvent','adminMoneyAdd',money,'kosti');
}
}
}
});

srv.addCmd('user.isOnline',function(ids){
var th=this;
var user=this.getUserData("user");
var aa=[];
if(user!=null && arguments.length>0 && ids!=null){
if(Array.isArray(ids)){
for (var i = 0; i < ids.length; i++) {
var userid=ids[i];
userid=parseInt(userid);
if(!isNaN(userid))userid=0;
var u=MainRoom.getUserByID(userid);
aa.push((u!=null) ? 1 : 0);
}
}else{
var idd=parseInt(ids);
if(isNaN(idd))idd=0;
var u=MainRoom.getUserByID(idd);
aa.push((u!=null) ? 1 : 0);
}
}
th.send(aa);
});

srv.addCmd('user.accountOwner',function(t,arg1,arg2){
var th=this;
var user=this.getUserData("user");
if(user!=null && user.checkOriginalConnect(this)){
var query1='SELECT * FROM sessions WHERE user=?';
var query2='SELECT * FROM sessions WHERE code=? AND user=?';
if(t=='info'){
var userid=user.id;
mysql.query(query1, [userid], function(rows){
var ob=null;
var rr=null;
if(rows!=null && rows.length>0)ob=rows[0];
if(ob!=null){
var spl=[];
if(ob.access.length>0)spl=ob.access.split(',');
rr={id:ob['code'],access:spl};
}
th.send(rr);
});

}else if(t=='create'){
var userid=user.id;
var accessV='';
/*mysql.query(query1, [userid], function(rows){
var ob=null;
var rr=null;
if(rows!=null && rows.length>0)ob=rows[0];
if(ob==null){
createSessionIDOwner(function(idd){
mysql.query('INSERT INTO sessions (code,access,user) VALUES (?,?,?)', [idd,accessV,userid], function(rows){
if(rows!=null && 'insertId' in rows){
rr={id:idd};
th.send(rr);
}else{
th.send(rr);
}
});   
    
});
}else{
th.send(null);
}
});*/
th.send(null);
}else if(t=='updateAccess'){
var userid=user.id;
var idd=''+arg1;
var accessV='';
if(typeof arg2!='undefined' && arg2!=null)accessV=''+arg2;
mysql.query(query2, [idd,userid], function(rows){
var ob=null;
var vv=0;

if(rows!=null && rows.length>0)ob=rows[0];
if(ob!=null){
mysql.query('UPDATE sessions SET access=? WHERE code=?', [accessV,idd], function(rows){
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
    
var acc=user.findAccountInfoByCode(idd);
if(acc!=null){
acc.access=accessV.split(',');
}
    
th.send(1);
}else{
th.send(0);
}
});
}else{
th.send(vv);
}
});

}else if(t=='del'){
var idd=''+arg1;
var vv=0;
mysql.query('DELETE FROM sessions WHERE code=? AND user=?', [idd,user.id], function(rows){
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
vv=1;

var acc=user.findAccountByCode(idd);
if(acc!=null){
acc.disconnect();
}

}
th.send(vv);
});
}
}
});


srv.addCmd('chat.giftsHistory1',function(id1,id2){
var th=this;
var user=this.getUserData("user");
if(user!=null){
var arr=[];
var nm=''+id1+'_'+id2;
var arr2=MainRoom.getGiftsHistoryByName(nm);
if(arr2!=null)arr=arr2;
th.send(arr);
}
});


srv.addCmd('user.sendBoxGifts',function(arr2,komu,isPrv){
var th=this;
var user=this.getUserData("user");
if(user!=null && user.checkAccessAccount('send_gifts',this) && user.checkAccessM('send_gifts') && arguments.length>1 && user.id!=komu){
var isPrivate=true;
if(arguments.length>2 && isPrv==0)isPrivate=false;
var nums=1;
var giftid=0;
var sec1=1;
var ts=getTimestamp();

if(arguments.length>1){
if(ts>=user.lastGiftSendTS){
user.lastGiftSendTS=ts+sec1;
var userid=castInt(komu);
if(userid<0){
MainRoom.sendPrivateMsg(systemUser,user,'Страницы с отрицательными id не могут получать подарки.');
th.send(ErrorType.ERROR);
return;
}

if(!accessUsersMaster.checkAccessUser2(userid,user.id,'send_gifts')){
th.send(ErrorType.ACCESS_DENIED);
return;
}
var giftObjInfo=null;
var priceLapki=0;
var priceKosti=0;
var allPopular=0;
var obj2={};
var ids=[];
var otID=user.id;
if(isPrivate)otID=0;
var otuser=user;
//if(isPrivate)otuser=newYearUser;
if(isPrivate)otuser=systemUser;
if(arr2 && arr2.length){
for (var i = 0; i < arr2.length; i++) {
var giftid=castInt(arr2[i]);
var giftItem=shopMaster.getItemByItemIDAndType(giftid,ShopItemsType.GIFTS);
if(!(giftid in obj2) && giftItem){
var price=giftItem.price;
obj2[giftid]=true;
ids.push(giftid);
if(giftItem.price_type==1)priceKosti+=price;
else priceLapki+=price;

if(user.id!=komu){
var popular=Math.floor(price/10);
if(giftItem.price_type==1)popular=Math.floor(price*2);
if(user.isVip()){
if(user.vip==1){
popular=popular+Math.floor(popular*0.3);
}else if(user.vip==2){
popular=popular+Math.floor(popular*0.2);
}
}
allPopular+=popular;
}

}
}
}

if(ids.length<=0){
th.send(ErrorType.ERROR);
return;
}


getUserInfoByID(userid,function(uObj){
if(uObj){
if(user.money>=priceLapki && user.kosti>=priceKosti){
if(priceLapki>0)user.minusMoney(priceLapki);
if(priceKosti>0)user.minusKosti(priceKosti);
//console.log(ids,priceLapki,priceKosti,allPopular)

mysql.query('INSERT INTO giftsBox (ot,komu,items) VALUES (?,?,?)', [otID,userid,jsonEncode(ids)], function(rows){
if(rows!=null && 'insertId' in rows){
if(allPopular>0)user.plusPopular(allPopular);

MainRoom.sendGiftsBox(otuser,uObj);

var komuUserV=AllUsersRoom.getUserByID(userid);
if(komuUserV!=null){
komuUserV.emit('userEvent','PresentGiftsBox',otuser.getACUObj1(0));
}

}else{

if(priceLapki>0)user.plusMoney(priceLapki);
if(priceKosti>0)user.plusKosti(priceKosti);
MainRoom.sendPrivateMsg(systemUser,user,'Сбой базы данных... Коробка для id '+userid+' не доставлена, мы вам вернули стоимость.');
th.send(ErrorType.ERROR);
}
});
th.send(ErrorType.OK);
}else{
th.send(ErrorType.NO_MONEY);
}
}else{
th.send(ErrorType.NO_USER);
}
});
}else{
th.send(ErrorType.TIME_EXISTS);
}
}else{
th.send(ErrorType.ERROR);
}
}else{
th.send(ErrorType.ACCESS_DENIED);
}
});



srv.addCmd('user.sendGift',function(itemid,komu,nums){
var th=this;
var user=this.getUserData("user");
if(user!=null && user.checkAccessAccount('send_gifts',this) && user.checkAccessM('send_gifts')){
if(typeof nums=='undefined')nums=1;
nums=parseInt(nums);
if(nums<=1)nums=1;
var maxGifts=500;
if(nums>maxGifts)nums=maxGifts;

var sec1=3;
var ts=getTimestamp();

if(arguments.length>1){
if(ts>=user.lastGiftSendTS){
user.lastGiftSendTS=ts+sec1;
var giftid=parseInt(itemid);
var userid=parseInt(komu);
if(isNaN(giftid))giftid=0;
if(userid<0 && userid!=systemUser.id && userid!=boarUser.id){
MainRoom.sendPrivateMsg(systemUser,user,'Страницы с отрицательными id не могут получать подарки.');
th.send(ErrorType.ERROR);
return;
}

if(!accessUsersMaster.checkAccessUser2(userid,user.id,'send_gifts')){
th.send(ErrorType.ACCESS_DENIED);
return;
}
var giftObjInfo=null;
if(giftid in shopMaster.giftsObj)giftObjInfo=shopMaster.giftsObj[giftid];
var giftObj=shopMaster.getItemByItemIDAndType(giftid,ShopItemsType.GIFTS);
if(giftObj!=null && giftObjInfo){
    
var isKosti=false;
if('price_type' in giftObj){
if(giftObj.price_type==1)isKosti=true;
}
    
getUserInfoByID(userid,function(uObj){
if(uObj!=null){
var price=giftObj.price*nums;
var res8=false;
if(isKosti){
if(user.kosti>=price)res8=true;    
}else{
if(user.money>=price)res8=true;
}

if(res8){
if(isKosti){
user.minusKosti(price);
}else{
user.minusMoney(price);
}

if(vkNotifyApi!=null)vkNotifyApi.sendMission(user,19);
var komuGiftUid=komu;

if(komu==boarUser.id && curBoarKonkursData){
komuGiftUid=curBoarKonkursData.boaruid;
}

gameItemsMaster.addGameItemNumsFunc1(GameItemsType.GIFTS,giftid,nums,user.id,komuGiftUid,function(res){
if(res){
//notifyMaster.addNotifyV(komu,'gift',user.id,[giftid],true);
//notifyMaster.addNotifyDB(komu,'gift',user.id,[giftid],function(){});
if(user.id!=komuGiftUid){
//notifyMaster.addNotifyV(komu,'gift',user.id,[giftid],true);
var popular=Math.floor(price/10);

if(isKosti){
popular=Math.floor(price*2);
}

if(user.isVip()){
if(user.vip==1){
popular=popular+Math.floor(popular*0.3);
}else if(user.vip==2){
popular=popular+Math.floor(popular*0.2);
}
}

//popular=popular*nums;
//console.log(popular,nums);
user.plusPopular(popular);
}

var ts=getTimestamp();
var findEl=null;
var allNums=nums;
for (var i = 0; i < MainRoom.saveMessages.length; i++) {
var el6=MainRoom.saveMessages[i];
if(el6 && el6.t==MessageType.GIFT_MSG && el6.ot==user.id && el6.komu==komu && el6.itemid==giftid){
findEl=el6;
break;
}
}

if(findEl){
findEl.nums+=nums;
allNums=findEl.nums;
}

var titleS2=''+giftObjInfo.name+' (цена '+price+')';
if(allNums>1)titleS2+=' в кол-ве '+allNums;

if(!findEl){
MainRoom.saveMessages.push({time:ts,t:MessageType.GIFT_MSG,ot:user.id,komu:komu,msg:null,itemid:giftid,nums:nums});
}/*else{
findEl.msg=titleS2;
}*/

var komuUserV=AllUsersRoom.getUserByID(komu);
if(komuUserV!=null){
MainRoom.sendGiftNumsMessage(user,komuUserV,[giftObjInfo],nums);
if(vkNotifyApi!=null)vkNotifyApi.sendMission(komuUserV,9);

komuUserV.emit('userEvent','PresentUserGift',user.id,giftObjInfo);
}else{
    
getUsersObjByIds(null,[komu],function(res){
var uObj=null;
var missionid=9;
if(res!=null && res.length>0)uObj=res[0];
if(uObj!=null){
MainRoom.sendGiftNumsMessage(user,uObj,[giftObjInfo],nums);
var prefixAuth=uObj.getPrefixAuth();
if(prefixAuth=='vk'){
var loginUser=uObj.login.substr(2);
if(!uObj.checkMissionVK(missionid) && vkNotifyApi!=null){
vkNotifyApi.setMission(loginUser,missionid,function(){
uObj.addMissionVK(missionid);
});
}
}
}
},0,true);
    
}

if(userid==systemUser.id){
var smileA=[':-[','*dance*',':-)','*rose*','*yahoo*'];
var v5=smileA.random();
//MainRoom.sendMsgByUser(systemUser,user,'Спасибо:-[');
MainRoom.sendMsgByOneUser(user,systemUser,user,'Спасибо'+v5)
}
th.send(ErrorType.OK);
}else{
if(isKosti){
user.plusKosti(price);
}else{
user.plusMoney(price);
}
MainRoom.sendPrivateMsg(systemUser,user,'Сбой базы данных... Подарок для id '+userid+' "'+giftObj.name+'" не доставлен, мы вам вернули стоимость подарка в размере '+price+'.');
th.send(ErrorType.ERROR);
}
});
}else{
th.send(ErrorType.NO_MONEY);
}
}else{
th.send(ErrorType.NO_USER);
}
});
}else{
th.send(ErrorType.ERROR);
}
}else{
th.send(ErrorType.TIME_EXISTS);
}
}else{
th.send(ErrorType.ERROR);
}
}else{
th.send(ErrorType.ACCESS_DENIED);
}
});


srv.addCmd('shop.buyStyle1',function(id){
var th=this;
var user=this.getUserData("user");
if(user!=null && arguments.length>0){
var idd=parseInt(id);
if(isNaN(idd))idd=0;
var price=priceBuyStyle1;
var vv=ErrorType.ERROR;
var ob1=null;
var isExists=false;
if(user.curStyle1Items!=null){
for (var i = 0; i < user.curStyle1Items.length; i++) {
var el=user.curStyle1Items[i];
if(el==idd)isExists=true;
}
}

if(!isExists){
if(user.kosti>=price){
user.minusKosti(price);
user.curStyle1App=idd;
if(user.curStyle1Items==null)user.curStyle1Items=[];
user.curStyle1Items.push(idd);
ob1=user.curStyle1Items;
vv=ErrorType.OK;
}else{
vv=ErrorType.NO_MONEY;
}
}
th.send(vv,ob1);
}
});


srv.addCmd('shop.paymentHistory',function(){
var th=this;
var user=this.getUserData("user");
if(user!=null){
shopMaster.getPaymentsHistoryByUser(user.id,function(arr){
th.send(ErrorType.OK,arr);
});
}
});

srv.addCmd('shop.getTrialItem',function(t){
var th=this;
var u=this.getUserData("user");
if(u!=null && arguments.length>0/* && u.checkOriginalConnect(this)*/){
if(t=='vip'){
if(u.vip_trial==0){
u.vip=1;
var ts=getTimestamp();
u.vip_end=ts+(60*15);
u.updateFieldDB('vip',u.vip);
u.sendUpdateUserInfoCurID();
u.vip_trial=1;
if(u.id>0)MainRoom.sendMessageEvent('addVipUser',u.id,0,[u.vip]);
MainRoom.sendPrivateMsg(systemUser,u,'Вы получили золотой VIP!');
th.send(1);
}else{
th.send(0);
}
}else if(t=='nickRainbow'){
if(u.nickRainbow_trial==0){
var ts=getTimestamp();
u.nickRainbow_end=ts+(60*15);
u.nickRainbow=1;
u.nickRainbow_trial=1;
u.sendUpdateUserInfoCurID();
u.updateFieldDB('nickRainbow',u.nickRainbow);
MainRoom.emitRoom('nickRainbowEvent',u.id,1);
th.send(1);
}else{
th.send(0);
}
}else if(t=='nickColor'){
if(u.nickColor_trial==0){
var ts=getTimestamp();
u.nickColor_end=ts+(60*15);
u.nickColor_trial=1;
u.nickColor_pos=-2;
u.sendUpdateUserInfoCur();
MainRoom.sendPrivateMsg(systemUser,u,'Теперь вы можете менять цвет ника');
th.send(1);
}else{
th.send(0);
}
}
}
});

srv.addCmd('shop.exchangeMoney',function(v){
if(arguments.length>0){
var user=this.getUserData("user");
if(user!=null && user.checkAccessAccount('money_exchange',this)){
if(v>0 && v<10000){
if(user.kosti>=v){
var v2=v*shopExchangeMoney;
user.minusKosti(v);
user.plusMoney(v2);
this.send(ErrorType.OK);


if(vkNotifyApi!=null)vkNotifyApi.sendMission(user,15);

addMailMsg(0,user.id,'обмен img://a2 '+v+' на img://a1 '+v2);

}else{
this.send(ErrorType.NO_MONEY);
}
}else{
this.send(0);
}

}else{
this.send(ErrorType.ACCESS_DENIED);
}
}
});


/*srv.addCmd('app.runFortuna',function(){
var user=this.getUserData("user");
var maxV=8;
if(user!=null){
var v=Math.floor(Math.random()*maxV)+1;
this.send(ErrorType.OK,v);
}
});*/


/*srv.addCmd('user.notifyList',function(t){
var th=this;
var user=this.getUserData("user");
if(user!=null){
notifyMaster.getNotifyListByUser(user.id,function(ob){
th.send(ErrorType.OK,ob);
},function(){
th.send(ErrorType.ERROR);
});

}
});*/

srv.addCmd('user.notifyDelete',function(id){
var th=this;
var user=this.getUserData("user");
if(user!=null && arguments.length>0){
if(isNaN(id))id=0;
notifyMaster.delNotifyByIDAndUserID(id,user.id,function(v){
if(v){
th.send(ErrorType.OK);
}else{
th.send(ErrorType.ERROR);
}
});
}
});

/*srv.addCmd('user.changeSex',function(v){
var th=this;
if(arguments.length>0){
var user=this.getUserData("user");
if(user!=null){
var s1=(v==2) ? 2 : 1;
var ts=getTimestamp();
if(ts>=user.nickChangeTime){
user.nickChangeTime=ts+(60*1);
if(user.sex!=s1){
user.sex=s1;
this.send(ErrorType.OK);
user.sendUpdateUserInfo();
//MainRoom.room.emit('user.changeSex',user.id,user.sex);
}else{
this.send(ErrorType.EXISTS);
}
}else{
this.send(ErrorType.TIME_EXISTS);
}
}
}
});*/

srv.addCmd('shop.changeNick',function(v,sex){
var th=this;
if(arguments.length>0){
var user=this.getUserData("user");
if(user!=null && user.checkOriginalConnect(this) && user.checkAccessM('nick_change')){
if(''+v.length>0){
var price=priceChangeNick;
if(user.isVip()){
if(user.vip==1)price=price-Math.floor(priceChangeNick*0.3);
else if(user.vip==2)price=price-Math.floor(priceChangeNick*0.2);
}
var checkFree=user.flagsMaster.check(1,3);
if(checkFree==false){
price=0;
//user.flagsMaster.add(1,3);
}

var isExp=true;
var ts=getTimestamp();
if(user.id in changeNickObjTime){
var tm2=changeNickObjTime[user.id];
if(ts<tm2)isExp=false;
}

if(isExp){
if(user.money>=price){
//v=correctChatMessage(v);

var isFlood=CheckIsFloodMsg(v);

var s3=correctChatMessage(v);
if(s3!=v)isFlood=true;
if(!isFlood){
var s1=sex;//(sex==2) ? 2 : 1;
if(s1<0)s1=1;
if(s1>3)s1=3;
var qq2=defLengthNick+(5*user.nickLength);

if(v.length>qq2)v=v.substr(0,qq2);

v=v.split("<").join("&lt;");
v=v.split(">").join("&gt;");

/*v=v.split("a").join("а");
v=v.split("e").join("е");
v=v.split("o").join("о");
v=v.split("p").join("р");
v=v.split("x").join("х");
v=v.split("c").join("с");

v=v.split("A").join("А");
v=v.split("E").join("Е");
v=v.split("O").join("О");
v=v.split("P").join("Р");
v=v.split("X").join("Х");
v=v.split("C").join("С");*/

if(user.nick!=v){
mysql.query('SELECT * FROM users WHERE nick=?', [v], function(rows){
var sz=0;		
if(rows!=null)sz=rows.length;
if(sz==0){
    
mysql.query('UPDATE users SET nick=? WHERE id=?', [v,user.id], function(rows){
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
mysql.query('SELECT id, nick FROM users WHERE id=?', [user.id], function(rows){
if(rows && rows.length>0){
var el1=rows[0];
user.nick=el1.nick;

if(user.sex!=s1)user.sex=s1;
if(checkFree==false)user.flagsMaster.add(1,3);
user.minusMoney(price);
th.send(ErrorType.OK,v);
user.sendUpdateUserInfo();

var rndV=20+Math.floor(Math.random()*40);

changeNickObjTime[user.id]=ts+rndV;

if(vkNotifyApi!=null)vkNotifyApi.sendMission(user,18);

MainRoom.saveMessages.push({time:ts,t:MessageType.NICK_CHANGE,ot:user.id,komu:0,msg:''+user.nick});

//addMailMsg(0,user.id,'смена ника на "'+user.nick+'"');

}else{
th.send(ErrorType.ERROR);
}
})
}else{
th.send(ErrorType.ERROR);
}
});

//MainRoom.room.emit('user.changeNick',user.id,v);

}else{
th.send(ErrorType.EXISTS);
}
});
}else{
th.send(ErrorType.NO_CHANGE);
}

}else{
th.send(ErrorType.WARN);
}

}else{
th.send(ErrorType.NO_MONEY);
}
}else{
th.send(ErrorType.TIME_EXISTS);
}
}else{
th.send(ErrorType.EMPTY);
}
}else{
th.send(ErrorType.ERROR);
}
}
});


srv.addCmd('chat.msgByUser',function(room,komu,msg,roomType,selectColorPos){
var user=this.getUserData("user");
var th=this;
if(user!=null){
var userid=user.id;
var ts=getTimestamp();
if(ts>=user.lastChatMsgTS){
user.lastChatMsgTS=ts+1;
if(roomType==DIALOG_PRIVATE_USER){
MainRoom.addMsgByUser(0,this,userid,komu,msg,roomType,{textColorPos:selectColorPos});
}else{
if(room in chatRooms){
var r=chatRooms[room];
var uniq=r.getUniqID();
var u=r.getUserByID(userid);
if(u!=null){
//var tm=setTimeout(function(){
r.addMsgByUser(uniq,th,userid,komu,msg,roomType,{textColorPos:selectColorPos});
//},2000);

}else{
this.send(ErrorType.ACCESS_DENIED);
}
}else{
this.send(ErrorType.NO_ROOM);
}
}
}else{
this.send(ErrorType.TIME_EXISTS);
}
}

});

srv.addCmd('chat.onlineUsersIds',function(room){
var ob={countUsers:0,users:[]};
if(room in chatRooms){
var r=chatRooms[room];
var userid=this.connect.user.id;
var u=r.getUserByID(userid);
if(u!=null){
ob.users=r.getOnlineUsersIds();
ob.countUsers=r.getCountClients();
}
}
this.send(ob);
});

srv.addCmd('chat.onlineUsersList',function(room,page){
var ob={countUsers:0,users:[]};
if(room in chatRooms){
var r=chatRooms[room];
var userid=this.connect.user.id;
var u=r.getUserByID(userid);
if(u!=null){
if(page>0){
}else{
page=1;
}
ob.users=r.getOnlineUsersList(page);
ob.countUsers=r.getCountClients();
}
}
this.send(ob);
});

srv.addCmd('chat.clearHistory',function(room){
var user=this.getUserData("user");
var v=-1;
if(user!=null){
if(room in chatRooms){
var r=chatRooms[room];
var userid=user.id;
var u=r.getUserByID(userid);
if(u!=null && r.isOwnerUser(userid)){
r.clearMessages();
v=ErrorType.OK;
}
}
this.send(v);
}
});


srv.addCmd('chat.reportMsg',function(room,id,t){
var user=this.getUserData("user");
if(user!=null){
if(room in chatRooms){
var r=chatRooms[room];
var userid=this.connect.user.id;
var u=r.getUserByID(userid);
if(u!=null){
var flags=r.getRoomFlags(user);
if((ChatRoomFlags.MSG_REPORT_ACCESS & flags)>0){
r.reportMsgUser(this,id,t);
}

//trace('aaaa');
}
}
}
});

srv.addCmd('chat.getReportMsgInfo',function(room,id){
var user=this.getUserData("user");
if(user!=null){
if(room in chatRooms){
var r=chatRooms[room];
var userid=user.id;
var u=r.getUserByID(userid);
if(u!=null){
this.send(r.getListReportsMsg(id));
}
}
}
});

srv.addCmd('chat.deleteMsg',function(room,id){
var user=this.getUserData("user");
if(user!=null && (UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode))){
if(room in chatRooms){
var r=chatRooms[room];
var flags=r.getRoomFlags(user);
var u=r.getUserByID(user.id);
if(u!=null && user.checkOriginalConnect(this)){
if((ChatRoomFlags.DELETE_MSG & flags)>0){
r.removeMessage('del',id,user);
}
}
}
}
});

srv.addCmd('chat.deleteMsgFull',function(room,id){
var user=this.getUserData("user");
if(user!=null){
if(room in chatRooms){
var r=chatRooms[room];
var flags=r.getRoomFlags(user);
var u=r.getUserByID(user.id);
if(u!=null && user.checkOriginalConnect(this)){
if((ChatRoomFlags.DELETE_MSG & flags)>0 && UserMode.isSuperAdmin(user.mode)){
r.removeMessageFull(id);
}
}
}
}
},USER_MODE_SUPER_ADMIN);

srv.addCmd('chat.getMsgsInfoByUserID',function(room,id){
var user=this.getUserData("user");
var arr=[];
if(user!=null){
if(room in chatRooms){
var r=chatRooms[room];
var flags=r.getRoomFlags(user);
var u=r.getUserByID(user.id);
if(u!=null){
if((ChatRoomFlags.DELETE_MSG & flags)>0){
arr=r.getMsgsInfoByUserID(id);
//r.removeMessageFull(id);
}
}
}
this.send(arr);
}
});

srv.addCmd('chat.restoreMsg',function(room,id){
var user=this.getUserData("user");
if(user!=null && (UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode))){
if(room in chatRooms){
var r=chatRooms[room];
var flags=r.getRoomFlags(user);
var u=r.getUserByID(user.id);
if(u!=null && user.checkOriginalConnect(this)){
if((ChatRoomFlags.RESTORE_MSG & flags)>0){
r.restoreMessage(id,user);
}
}
}
}
});

/*srv.addCmd('subscribe',function(t,id){
var user=this.getUserData("user");
var th=this;
if(user!=null){
var userid=user.id;
if(arguments.length>0){
if(arguments.length>1)id=parseInt(id);
if(isNaN(id))id=0;
if(t=='getList'){
subscriptionMaster.getSubscribeUserArr(userid,function(arr){
th.send(ErrorType.OK,arr);
});
}else if(t=='info'){
var obj=subscriptionMaster.getItemByID(id);
if(obj!=null){
th.send(ErrorType.OK,subscriptionMaster.parseItemInfoObj(obj));
}else{
th.send(ErrorType.ERROR);
}
}else if(t=='create'){
subscriptionMaster.subscribe(user,id,user.id,function(ob){
var r1=ErrorType.ERROR;
if(ob!=null){
if(ob.status==SubscribeStatus.OK)r1=ErrorType.OK;
else if(ob.status==SubscribeStatus.NO_MONEY)r1=ErrorType.NO_MONEY;
else if(ob.status==SubscribeStatus.EXISTS)r1=ErrorType.EXISTS;
}
th.send(r1);
});
}else if(t=='cancel'){
subscriptionMaster.getSubscribeByID(id,userid,function(res){
if(res!=null){
var subscribeid=res['subscribe_id'];
var obj=subscriptionMaster.getItemByID(subscribeid);
if(obj!=null){
subscriptionMaster.cancelSubscribe(obj,id,userid,function(ob){
if(ob!=null && ob.status==SubscribeStatus.OK){
th.send(ErrorType.OK);
}else{
th.send(ErrorType.ERROR);
}
});

}else{
th.send(ErrorType.ERROR);
}
}else{
th.send(ErrorType.ERROR);
}
});
}
}
}
});*/


srv.addCmd('user.getBanInfo',function(userid){
var idd=0;
var th=this;
var vv=null;
if(arguments.length>0)idd=parseInt(userid);
if(isNaN(idd))idd=0;
var user=this.getUserData("user");
if(idd!=0 && user.checkOriginalConnect(this) && (UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode))){
var u=MainRoom.getUserByID(idd);
if(u!=null)vv=getBanUserInfo(u);
th.send(vv);
}else{
if(user!=null)vv=getBanUserInfo(user);
th.send(vv);
}
});


srv.addCmd('user.exitBan',function(isPay){
var u=this.getUserData("user");
var th=this;
var vv=ErrorType.ERROR;
if(u!=null){
var ts=getTimestamp();
var banInfo=getBanUserInfo(u);
if(banInfo!=null && u.bantype>0){
if(isPay==1){ // если выход за валюту
if(u.checkOriginalConnect(this) && u.checkAccessM('chat_banexit')){
var price=banInfo.priceExit;
if(price<=0)price=0;
if(u.money>=price){
u.minusMoney(price);
vv=ErrorType.OK;
}else{
vv=ErrorType.NO_MONEY;
}
}else{
th.send(ErrorType.ACCESS_DENIED);
}
}else if((u.bantime-ts)<=0){ // если бан закончился
vv=ErrorType.OK;
var ts=getTimestamp();
u.banChangeTime=ts-65;
updateBanUserInfo(u);
}
}

if(vv==ErrorType.OK){
userMaster.banUserExitByID(u.id,true);
}
th.send(vv);
}else{
th.send(ErrorType.ACCESS_DENIED);
}
});


srv.addCmd('user.getUserInfo',function(userid){
var user=this.getUserData("user");
var th=this;
if(user!=null && arguments.length>0){

if(isNaN(userid))userid=0;

var mode=user.mode;
if(!user.checkOriginalConnect(this))mode=0;

getUserInfoOne(user,userid,mode,function(uObj){
if(userid==boarUser.id && curBoarKonkursData==null){
uObj=null
}

if(uObj!=null){
th.send(ErrorType.OK,uObj);
}else{
th.send(ErrorType.ERROR);
}
});

/*getUsersObjByIds(user,[userid],function(res){
var uObj=null;
if(res!=null && res.length>0)uObj=res[0];

if(userid==boarUser.id && curBoarKonkursData==null){
uObj=null
}

if(uObj!=null){
th.send(ErrorType.OK,uObj);
}else{
th.send(ErrorType.ERROR);
}
},mode);*/

}
});

srv.addCmd('user.friendsAction',function(t,userid){
var user=this.getUserData("user");
var th=this;
if(typeof userid=='undefined')userid=0;
userid=parseInt(userid);
if(user!=null && arguments.length>0){
if(t=='get'){
userMaster.getFriendsUser(user.id,function(a){
th.send(a)
});
}else if(t=='remove' && user.checkOriginalConnect(this)){
userMaster.removeFriendUser(user.id,userid,function(v){
var vv=0;
if(v==true)vv=1;
th.send(vv);
});
}else if(t=='add' && user.checkOriginalConnect(this)){
userMaster.addFriendUser(user.id,userid,'',function(v){
var vv=0;
if(v==true)vv=1;
th.send(vv);
});
}else if(t=='updateText' && user.checkOriginalConnect(this)){
var txtV='';
if(arguments.length>2)txtV=arguments[2];
if(txtV==null)txtV='';
var maxW=60;
if(txtV.length>maxW)txtV=txtV.substr(0,maxW);
userMaster.updateTextFriendUser(user.id,userid,txtV,function(v){
var vv=0;
if(v==true)vv=1;
th.send(vv);
});
}

}
});



srv.addCmd('user.accessSettingsAction',function(t1,t,userid){
var user=this.getUserData("user");
var th=this;

var uid=user.id;
var rr=true;
if(t1=='a'){
if(UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode)){
uid=0;
}else{
rr=false;
}
}

if(typeof userid=='undefined')userid=0;
userid=parseInt(userid);
if(user!=null && arguments.length>0){
if(t=='get'){
var accessList=accessUsersMaster.accessUserInfo1;
if(rr){
if(t1=='a'){
accessList=[];
if(UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode)){
accessList=accessUsersMaster.accessMyInfo1;
//accessList=accessList.concat(accessUsersMaster.accessModInfo1);
}
/*if(UserMode.isSuperAdmin(user.mode)){
accessList=accessUsersMaster.accessMyInfo1;
}*/

}
    
accessUsersMaster.getAccessListUsers(uid,function(a){
th.send(accessList,a);
});
}
}else if(t=='getList'){
th.send(accessUsersMaster.allAccessList);
}

else if(t=='remove' && user.checkOriginalConnect(this)){
if(t1=='a' && !UserMode.isModerator(user.mode)){
rr=false;
}
if(rr){
accessUsersMaster.removeAccessUser(uid,userid,function(v){
var vv=0;
if(v==true)vv=1;
th.send(vv);
});
}else{
th.send(0);
}
}else if(t=='add' && user.checkOriginalConnect(this)){
if(t1=='a' && !UserMode.isModerator(user.mode)){
rr=false;
}
if(rr){
var arr6=[];
if(t1=='a'){
arr6=accessUsersMaster.getAccessUserByMod1(0);
}else{
arr6=accessUsersMaster.accessUserInfo1;
}
accessUsersMaster.addUser(uid,userid,arr6,function(v){
var vv=0;
if(v==true)vv=1;
th.send(vv);
});
}else{
th.send(0);
}
}else if(t=='updateAccess' && user.checkOriginalConnect(this)){
if(t1=='a' && !UserMode.isModerator(user.mode)){
rr=false;
}
if(rr){
var ar=[];
var arg2=null;
if(arguments.length>3)arg2=arguments[3];
if(arg2!=null && arg2 instanceof Array)ar=arg2;

var curAccessObj={};
var accessObj2={};
var accessObj3={};
var accessV=accessUsersMaster.getAccessListInfoByArr(accessUsersMaster.accessUserInfo1);
var access=[];
if(t1=='a'){
accessV=accessUsersMaster.allAccessList;
if(userid in accessUsersMaster.usersOne){
access=accessUsersMaster.usersOne[userid];
}
}else{
var aa8=accessUsersMaster.getAccess1(uid,userid);
if(aa8!=null)access=aa8;
}

for (var i = 0; i < access.length; i++) {
var el=access[i];
accessObj2[el]=1;
}

for (var i = 0; i < accessV.length; i++) {
var el=accessV[i];
var qq=el.id;
if(t1=='a' && 'mode' in el){
if(el.mode>0 && (user.mode & el.mode)>0)curAccessObj[qq]=1;
}else{
curAccessObj[qq]=1;
}
}

for (var i = ar.length - 1; i >= 0; i--) {
var el=ar[i];
accessObj3[el]=1;
if(!(el in curAccessObj))ar.splice(i,1);
}

for(var n in curAccessObj){
if(n in accessObj3){
accessObj2[n]=1;
}else{
if(n in accessObj2)delete accessObj2[n];
}
}

var arr2=[];
for(var n in accessObj2)arr2.push(n);

//console.log('888',accessV,'--',ar,'+++',curAccessObj,'---',access);
accessUsersMaster.updateAccessUser(uid,userid,arr2,function(v){
var vv=0;
if(v==true)vv=1;
th.send(vv);
});
}else{
th.send(0);
}
}

}
});





srv.addCmd('user.accessSettingsRedirAction',function(t1,t,userid,a1){
var user=this.getUserData("user");
var th=this;

if(user!=null && UserMode.isModerator(user.mode) && user.checkOriginalConnect(this)){
var uid=0;
var rr=true;
if(user!=null && arguments.length>0){
if(t=='get'){
accessUsersMaster.getAccessListRedirUsers(function(a){
th.send(a);
});
}else if(t=='remove'){
if(typeof userid=='undefined')userid=0;
userid=parseInt(userid);
accessUsersMaster.removeAccessUserRedir(userid,function(v){
var vv=0;
if(v==true)vv=1;
th.send(vv);
});
}else if(t=='add'){
var arr6=[];
var ids=[];
if(typeof userid=='string'){
var arr6=userid.split(' ');
for (var i = 0; i < arr6.length; i++) {
var idd=parseInt(arr6[i]);
if(isNaN(idd))idd=0;
if(idd!=0){
ids.push(idd);
}
}
}
accessUsersMaster.addUserRedir(ids,function(v){
var vv=0;
if(v==true)vv=1;
th.send(vv);
});
}else if(t=='update'){
if(isNaN(a1))a1=0;
var ids=[];
if(typeof userid=='string'){
var arr6=userid.split(' ');
for (var i = 0; i < arr6.length; i++) {
var idd=parseInt(arr6[i]);
if(isNaN(idd))idd=0;
if(idd!=0){
ids.push(idd);
}
}
}

accessUsersMaster.updateAccessUsersRedir(a1,ids,function(v){
var vv=0;
if(v==true)vv=1;
th.send(vv);
});
}
}
}
});




srv.addCmd('user.dressStatus',function(id,status){
var user=this.getUserData("user");
var th=this;
if(user!=null && arguments.length>1){
id=castInt(id);
status=castInt(status);

mysql.query('SELECT * FROM usersDress WHERE id=? AND user=?', [id,user.id], function(rows){
var ob=null;
if(rows!=null && rows.length>0)ob=rows[0];
if(ob){

var item=dressMaster.getItemByID(ob.itemid);
if(item){
var allTime=dressMaster.getItemExpireSecs(ob);
if(allTime>0){
if(status==0){
user.disableDressItemUser(ob,function(){
th.send('ok');
});
}else if(status==1){
ob.category=item.category;
user.addDressItemUser(ob,function(){
th.send('ok');
});
}
}else{
if(status==2){
mysql.query('DELETE FROM usersDress WHERE id=?', [id], function(rows){
if(rows!=null){
user.removeDressItemUser(id);
//console.log(user.dressItems);
th.send('ok');
}else{
th.send('error');
}
})
}else{
th.send('expired');
}
}
}else{
th.send('no_item');
}
}else{
th.send('error');
}
})
}
});


srv.addCmd('user.getDressInfo',function(userid){
var user=this.getUserData("user");
var th=this;
if(user!=null && arguments.length>0){
th.send([]);
//if(isNaN(userid))userid=0;

/*getUsersObjByIds(null,[userid],function(res){
var uObj=null;
if(res!=null && res.length>0)uObj=res[0];
if(uObj!=null){
th.send(uObj.dressItems);
}else{
th.send([]);
}
},0,true);*/
}
});

srv.addCmd('chat.banUser',function(id,userid){
var user=this.getUserData("user");
var th=this;
if(user!=null){
//var isOrig=user.checkOriginalConnect(this);
//console.log('orig',isOrig);
if(user.checkOriginalConnect(this) && (UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode))){
var banInfo=getBanByID(id);
var ot=user.id;
if(banInfo!=null){
var u=MainRoom.getUserByID(userid);
if(u!=null){
if(u.id>0){
if(u.bantype<banInfo.id){
var ts=getTimestamp();
var expire=ts+banInfo.time;
u.bantype=banInfo.id;
u.bantime=expire;
u.banChangeTime=ts;
MainRoom.sendMessageEvent('banUser',user,u,[banInfo.id]);
MainRoom.saveMessages.push({time:ts,t:MessageType.BAN,ot:user.id,komu:userid,banTime:banInfo.time,msg:null});
u.emit('userEvent','ban',{type:u.bantype,time:banInfo.time,ot:ot});
th.send(ErrorType.OK);

addMailMsg(ot,userid,'бан '+banInfo.name);

statsUsers.plusCount('ban',u.id);
statsUsers.plusCount('mod_ban',user.id);

}else{
th.send(ErrorType.ERROR);
}
}else{
th.send(ErrorType.ERROR);
}
}else{
    
getUsersObjByIds(null,[userid],function(res){
var uObj=null;
if(res!=null && res.length>0)uObj=res[0];
if(uObj!=null && uObj.bantype<banInfo.id){
var ts=getTimestamp();
var expire=ts+banInfo.time;
uObj.bantype=banInfo.id;
uObj.bantime=expire;
uObj.banChangeTime=ts;

mysql.query('UPDATE users SET ban_type=?, ban_time=?, ban_change_time=? WHERE id=?', [uObj.bantype,uObj.bantime,uObj.banChangeTime,uObj.id], function(rows){
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
MainRoom.saveMessages.push({time:ts,t:MessageType.BAN,ot:user.id,komu:userid,banTime:banInfo.time});
MainRoom.sendMessageEvent('banUser',user,uObj,[banInfo.id]);
th.send(ErrorType.OK);

addMailMsg(ot,userid,'бан '+banInfo.name);

statsUsers.plusCount('ban',userid);
statsUsers.plusCount('mod_ban',user.id);

}else{
th.send(ErrorType.ERROR);
}
});
}else{
th.send(ErrorType.ERROR);
}
},0,true);

}
}else{
th.send(ErrorType.ERROR);
}
}else{
th.send(ErrorType.ACCESS_DENIED);
}
}
});


srv.addCmd('chat.unbanUser',function(userid){
var user=this.getUserData("user");
var th=this;
if(user!=null){
if(user.checkOriginalConnect(this) && (UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode))){
var u=MainRoom.getUserByID(userid);
if(u!=null){
var res=userMaster.banUserExitByID(userid,false);
if(res){
var ts=getTimestamp();
MainRoom.sendMessageEvent('unbanUser',user,u,[]);
MainRoom.saveMessages.push({time:ts,t:MessageType.UNBAN,ot:user.id,komu:userid,msg:''});
th.send(ErrorType.OK);

addMailMsg(user.id,userid,'разбан');

statsUsers.plusCount('unban',u.id);
statsUsers.plusCount('mod_unban',user.id);

}else{
th.send(ErrorType.ERROR);
}
}else{
    
getUsersObjByIds(null,[userid],function(res){
var uObj=null;
if(res!=null && res.length>0)uObj=res[0];
if(uObj!=null && uObj.isBan()){
uObj.bantype=0;
uObj.bantime=0;
uObj.banChangeTime=0;
mysql.query('UPDATE users SET ban_type=?, ban_time=?, ban_change_time=? WHERE id=?', [0,0,0,uObj.id], function(rows){
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
var ts=getTimestamp();
MainRoom.saveMessages.push({time:ts,t:MessageType.UNBAN,ot:user.id,komu:userid,msg:''});
MainRoom.sendMessageEvent('unbanUser',user,uObj,[]);
th.send(ErrorType.OK);

addMailMsg(user.id,userid,'разбан');

statsUsers.plusCount('unban',userid);
statsUsers.plusCount('mod_unban',user.id);

}else{
th.send(ErrorType.ERROR);
}
});
}else{
th.send(ErrorType.ERROR);
}
},0,true);
    
}
}else{
th.send(ErrorType.ACCESS_DENIED);
}
}
});


srv.addCmd('chat.getUserModeList',function(){
var user=this.getUserData("user");
var th=this;
if(user!=null){
var a=[];
if(ModeUsersListV!=null){
for (var i = 0; i < ModeUsersListV.length; i++) {
var el=ModeUsersListV[i];
a.push(el);
}
}
th.send(a);
}
});

srv.addCmd('chat.eyeMsg',function(roomid,uniq){
var user=this.getUserData("user");
var th=this;
var res='error';
if(user!=null && arguments.length>1 && (UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode))){
roomid=castInt(roomid);
var room=null;
if(roomid in chatRooms){
room=chatRooms[roomid];
}
if(room!=null && uniq!=null){
var uniqq=''+uniq;

var ob=room.getMessageByID(uniqq);
if(ob && 'modAction' in ob && ob.modAction){
if(!('showMsgObj' in ob))ob.showMsgObj={users:[]};
var ob3=ob.showMsgObj;
var findU=null;
if(ob3){
for (var i = 0; i < ob3.users.length; i++) {
var el=ob3.users[i];
if(el && el.id==user.id){
findU=el;
break;
}
}
}

if(findU==null){
findU={id:user.id,nick:user.nick,n:0};
ob3.users.push(findU);
}
if(findU)++findU.n;

statsUsers.plusCount('mod_eyemsg',user.id);

th.send({msg:ob.msg,users:ob3.users});
}else{
th.send(null);
}
//trace(uniqq,ob);
}
}
});


srv.addCmd('shop.checkPayment',function(){
var user=this.getUserData("user");
if(user!=null){
jobMaster.update();
}
});

srv.addCmd('shop.paymentsList',function(){
var user=this.getUserData("user");
if(user!=null){
this.send(paymentsList);
}
});

srv.addCmd('shop.giftsList',function(){
var user=this.getUserData("user");
if(user!=null){
var gifts=parseGiftsList();
this.send(gifts);
}
});

srv.addCmd('shop.buyDress',function(itemid,days){
var th=this;
var user=this.getUserData("user");
if(user!=null && arguments.length>1){
itemid=castInt(itemid);
days=castInt(days);
var item=dressMaster.getItemByID(itemid);
if(item){
var minDays=1;
var maxDays=30;
var dayTime=60*60*24;
if(days>0 && days>=minDays && days<=maxDays){
var price=item.price*days;
var popular=Math.floor(price/10);
var expireTime=dayTime*days;
var isKosti=false;
var checkOK=false;
var priceType='money';
if(item.price_type==1){
isKosti=true;
priceType='kosti';
popular=Math.floor(price*2);
}

if(isKosti){
if(user.kosti>=price)checkOK=true;    
}else{
if(user.money>=price)checkOK=true;
}

//user.plusPopular(vv);

if(checkOK){

mysql.query('SELECT * FROM usersDress WHERE itemid=? AND user=?', [item.id,user.id], function(rows){
var ob=null;
if(rows!=null && rows.length>0)ob=rows[0];
if(ob){
var rowid=ob.id;
var allTime=dressMaster.getItemExpireSecs(ob);
var newTime=allTime+expireTime;
var allDays=Math.ceil(newTime/dayTime);

if(allDays>maxDays){
th.send('max_days');
}else{
var tm2=getTimestamp()+newTime;

user.minusMoneyType(price,priceType);

mysql.query('UPDATE usersDress SET end_time=? WHERE id=?', [tm2,rowid], function(rows){
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
if(popular>0)user.plusPopular(popular);

ob.end_time=tm2;
ob.category=item.category;
user.addDressItemUser(dressMaster.parseDBObjItemUser(ob));

th.send('ok');
//console.log(allTime,allDays);
}else{
user.plusMoneyType(price,priceType);
th.send('error');
}
});
}
}else{
var ts=getTimestamp()
var tm=ts+expireTime;
var statusV=1;
user.minusMoneyType(price,priceType);

mysql.query('INSERT INTO usersDress (itemid,buy_time,end_time,user,status) VALUES (?,?,?,?,?)', [item.id,ts,tm,user.id,statusV], function(rows){
if(rows!=null && 'insertId' in rows){
var idd=0;
if(rows!=null && 'insertId' in rows)idd=parseInt(rows.insertId);

if(popular>0)user.plusPopular(popular);

if(idd>0){
var itemObj=dressMaster.parseDBObjItemUser({id:idd,category:item.category,itemid:item.id,end_time:tm,status:statusV});
user.addDressItemUser(itemObj);
}

th.send('ok');
}else{
user.plusMoneyType(price,priceType);
th.send('error');
}
});

}
});

}else{
th.send('no_money');
}

}else{
th.send('error');
}
}else{
th.send('no_item');
}
}
});

srv.addCmd('user.myGiftsList',function(){
var th=this;
var user=this.getUserData("user");
if(user!=null){
var vip=0;
if(user.isVip())vip=user.vip;
shopMaster.getGiftsUser(vip,user.id,function(o){
th.send(o);
});
}
});

srv.addCmd('user.quests1Act',function(t){
var th=this;
var user=this.getUserData("user");
if(user!=null && arguments.length>0){
var ts=getTimestamp();
var tm=0;
if(user.quests1FreeTime>0)tm=user.quests1FreeTime-ts;
if(tm<=0)tm=0;
if(t=='get'){
var arr=shopMaster.questsDogs;
var o={items:[],time:tm};
if(tm==0)o.items=arr;
th.send(o);
}else if(t=='run'){
var idd=0;
var vv=ErrorType.ERROR;
if(arguments.length>1)idd=parseInt(arguments[1]);
if(isNaN(idd))idd=0;
var itemObj=shopMaster.getQuests1ByID(idd);
if(itemObj!=null && tm==0){
var numsV=itemObj['nums'];
var type=itemObj['prize_type'];
var giftid=itemObj['itemid'];
if(type=='gift'){
var giftObj=shopMaster.getItemByItemIDAndType(giftid,ShopItemsType.GIFTS);
if(giftObj!=null){
var giftObjInfo=null;
if(giftid in shopMaster.giftsObj)giftObjInfo=shopMaster.giftsObj[giftid];
if(giftObjInfo){
if(user.dogsCount>=numsV){
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,-2,user.id,function(res){
user.emit('userEvent','PresentUserGift',-2,giftObjInfo);
user.quests1FreeTime=ts+(60*60*6);
user.minusDogs(numsV);
vv=ErrorType.OK;
th.send(vv);
});

return;
}else{
vv=ErrorType.NO_MONEY;
}
}
}
}
}
th.send(vv);

}else if(t=='resetTime'){
var vv=ErrorType.ERROR;
var price=10;
if(user.quests1FreeTime>0){
if(user.kosti>=price){
user.minusKosti(price);
user.quests1FreeTime=0;
vv=ErrorType.OK;
}else{
vv=ErrorType.NO_MONEY;
}
}
th.send(vv);
}
}
});


srv.addCmd('user.getVipInfo',function(){
var th=this;
var user=this.getUserData("user");
if(user!=null){
var vip=0;
var time=0;
if(user.isVip()){
vip=user.vip;
time=user.vip_end-getTimestamp();
if(time<=0)time=0;
}
th.send({vip:vip,time:time});
}
});


srv.addCmd('shop.sellGift',function(id,nums){
var th=this;
var user=this.getUserData("user");
if(user!=null && user.checkAccessAccount('sell_gifts',this)){
var idd=0;
if(arguments.length>0)idd=parseInt(id);
if(isNaN(idd))idd=0;
if(arguments.length>1)nums=parseInt(nums);
if(isNaN(nums))nums=0;
if(nums<=1)nums=1;
var vip=0;
if(user.isVip())vip=user.vip;
shopMaster.sellPriceGiftIDByUser(vip,user.id,idd,nums,function(o){
if(o!=null){
var price=o.price;
user.plusMoney(price);
}
th.send(o);
});
}else{
th.send(null);
}
});


srv.addCmd('shop.getPriceSellGifts',function(){
var th=this;
var user=this.getUserData("user");
if(user!=null){
var vip=0;
if(user.isVip())vip=user.vip;
shopMaster.getSellPriceGiftsUser(vip,user.id,function(v){
var o=null;
if(v>-1)o={price:v};
th.send(o);
});
}
});

srv.addCmd('shop.sellAllGifts',function(){
var th=this;
var user=this.getUserData("user");
if(user!=null && user.checkAccessAccount('sell_gifts',this)){
var vip=0;
if(user.isVip())vip=user.vip;
shopMaster.getSellPriceGiftsUser(vip,user.id,function(v){
if(v>-1){
    
shopMaster.removeAllGiftsUser(user.id,function(res){
if(res){
if(v>0)user.plusMoney(v);
th.send(true);

if(v>0)addMailMsg(0,user.id,'продажа подарков img://a1 +'+v);

}else{
th.send(false);
}
});
    
}else{
th.send(false);
}
});
}else{
th.send(false);
}
});


srv.addCmd('historySkipStart',function(){
var user=this.getUserData("user");
if(user!=null){
user.flagsMaster.add(1,1);
}
});

srv.addCmd('tutorialSkip',function(){
var user=this.getUserData("user");
if(user!=null){
if(!user.flagsMaster.check(1,4)){
user.flagsMaster.add(1,4);
//user.plusDogs(3);
}
}
});


srv.addCmd('user.saveSettings',function(v){
var user=this.getUserData("user");
if(user!=null && arguments.length>0){
var ss=''+v;
user.settingsFlagsMaster.parseStr(ss);
}
});

/*srv.addCmd('user.restoreHealth',function(){
var user=this.getUserData("user");
if(user!=null){
var price=20;
if(user.health<100 && user.money>=price){
user.minusMoney(price);
user.health=100;
user.updateHealth(user.health);
}
}
});


srv.addCmd('TrainWorld',function(t){
var user=this.getUserData("user");
var th=this;
var trainTime=trainTimeSpeed;
if(trainTime>2)trainTime+=2;
if(user!=null && arguments.length>0){
var ts=getTimestamp();
if(t==-1){ // check
if(ts>=user.trainTimeEnd){
user.trainScene=user.tempTrainScene;
user.trainStatus='ok';
user.tempTrainScene=0;
user.trainTimeEnd=0;
}else{
user.trainStatus='train';
}
th.send(user.trainScene,user.trainStatus);
}else{
user.trainStatus='train';
user.tempTrainScene=t;
user.trainTimeEnd=ts+trainTime;
th.send(1,t,user.trainStatus);
}
//setTimeout(function(){
//th.send(1,t,user.trainStatus);
//},1500);
}
});

srv.addCmd('getWorld',function(){
var user=this.getUserData("user");
var th=this;
if(user!=null){
th.send(user.trainScene);
}
});*/

srv.addCmd('requestAction',function(reqid, t){
var user=this.getUserData("user");
var th=this;
if(user!=null && arguments.length>1){
reqid=parseInt(reqid);
requestsMaster.getRequestUserByReqID(reqid,user.id,function(o){
if(o!=null){
if(t==1){
var ts=getTimestamp();
if(ts<o['expire']){
if(o['status']==0){
requestsMaster.updateRequestStatusByID(reqid,1);
requestsMaster.update(o);
th.send(1);
}else{
if(o['status']==1)th.send(3);
else th.send(4);
}
}else{
th.send(2);
}
}else{
if(o['status']==0){
requestsMaster.updateRequestStatusByID(reqid,2);
th.send(1);
}else{
th.send(1);
}
}
}else{
th.send(0);
}
});
}
});


srv.addCmd('user.setStyle1',function(v){
var th=this;
var user=this.getUserData("user");
if(user!=null && arguments.length>0){
var idd=parseInt(v);
if(isNaN(idd))idd=0;
var isExists=false;
var freeStyleID=2;
if(idd==freeStyleID){
isExists=true;
}

if(idd!=0){
if(user.curStyle1Items!=null){
for (var i = 0; i < user.curStyle1Items.length; i++) {
var el=user.curStyle1Items[i];
if(el==idd)isExists=true;
}
}
}else{
isExists=true;
}

if(isExists){
user.curStyle1App=idd;
th.send(1);    
}else{
th.send(0);
}
}
});

srv.addCmd('user.getRequestsList',function(){
var user=this.getUserData("user");
var th=this;
if(user!=null){
requestsMaster.getRequestsListUser(user.id,function(a){
th.send(a);
});
}
});


srv.addCmd('world.callUFO',function(userid){
var user=this.getUserData("user");
if(user!=null && arguments.length>0){
var u=MainRoom.getUserByID(userid);
if(u!=null && u.getCountConnects()>0){
if(user.checkOriginalConnect(this) && (UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode))){
if(user.ufoInitiatorCl!=null && user.ufoInitiatorCl.userid!=u.id){
user.ufoInitiatorCl.close();
user.ufoInitiatorCl=null;
}
var isActive=false;
if(u.ufoCurUser!=null && !u.ufoCurUser.isClose)isActive=true;
if(!isActive){
if(ModRoom!=null)ModRoom.sendMessageEvent('callUFO',user.id,u.id,[]);
//if(SystemRoom!=null)SystemRoom.sendMessageEvent('callUFO',user.id,u.id,[]);


var c=new CallUFOScene();
c.ownerid=user.id;
c.userid=u.id;
u.ufoCurUser=c;
user.ufoInitiatorCl=c;
u.emit('callUFO',user.id,c.id);
if(user.id!=u.id)user.emit('callUFO',user.id,c.id);
this.send(ErrorType.OK,c.id);
}else{
this.send(ErrorType.EXISTS);
}
}else{
this.send(ErrorType.ACCESS_DENIED);
}
}else{
this.send(ErrorType.NO_ONLINE);
}
}
});

srv.addCmd('auth',function(version,keyv,authDevice,isNewVersion,protocolVersion){
var th=this;
if(statusServer=='ok'){
if(arguments.length>=2 && keyv!==null){
if(version==appVersion){
var origKeyV=keyv;
if(typeof keyv!='string')keyv='';
if(typeof authDevice!='string')authDevice='';
if(keyv.length<=0)keyv=keyAuthV;
var args=keyv.split('_');
if(typeof origKeyV=='object' && Array.isArray(origKeyV))args=origKeyV;
var authType=args.shift();
th.authDevice=authDevice;
if(isNewVersion==1)th.isNewVersion=true;
else th.isNewVersion=false;
if(protocolVersion==2 && th.connect)th.connect.isWriteObj=true;
if(authType=='vk' && args.length>1){
var uid=args[0];
var authkey=args[1];
var login='vk'+uid;
if(authkey==md5(appVKInfo['id']+"_"+uid+"_"+appVKInfo['secret'])){
AuthFuncByLoginUser(th,login,null);
}else if(authkey==md5(appVKInfo2['id']+"_"+uid+"_"+appVKInfo2['secret'])){
AuthFuncByLoginUser(th,login,null);
}else{
th.send(statusServer,0);
}
}else if(authType=='reg' && args.length>2){
var tm1=args[0];
var uid=args[1];
var authkey=args[2];
var arr22=[5,8,2,6,7,3,9,3,0,4,2,8,2,9,4,7,2,1];
//console.log('regg',login);
if(authkey==md5(''+tm1+'_'+uid+'_'+arr22.join(','))){
var login='reg'+tm1+uid;
AuthFuncByLoginUser(th,login,null);
}else{
th.send(statusServer,0);
}
}else if(authType=='yg' && args.length>0){
var signature=args[0];
var uniqUser=null;
var spl2=signature.split('.');
if(spl2 && spl2.length>1){
var sign=spl2[0];
var data=spl2[1];
var s6=Buffer.from(data,'base64').toString('utf8');
var hmac=crypto.createHmac('sha256',appYGSecretKey);
hmac.update(s6);
if(sign==hmac.digest('base64')){
var dt1=jsonDecode(s6);
if(dt1 && 'data' in dt1 && dt1.data!=null && 'uniqueID' in dt1.data){
var q2=dt1.data['uniqueID'];
if(q2 && q2.length>0)uniqUser=q2;
}
}
}

if(uniqUser!=null){
var login='yg'+uniqUser;
AuthFuncByLoginUser(th,login,null);
}else{
th.send(statusServer,0);
}
}else if(authType=='site' && args.length>2){
var login=args[0];
var ts=args[1];
var authkey=args[2];

if(authkey==md5(login+"_"+ts+"_"+secretKeyAnimalsGameSite)){
AuthFuncByLoginUser(th,login,null);
}else{
th.send(statusServer,0);
}
}

else if(authType=='sess'){
var keyy='';
if(args.length>0)keyy=args[0];
AuthFuncBySessKey(th,keyy);
}else if(authType=='auth'){
if(args.length>1){
//AuthFuncByLoginPass(th,args[0],args[1]);
AuthFuncByVM2LoginPass(th,args[0],args[1]);
}
}else if(authType=='guest' && checkAuthGuest(th)){
var uu=new User(th,{access:'',isOriginal:1});
var id=Math.floor(Math.random()*1000000);
//var tpers=Math.floor(Math.random()*2)+1;
var tpers=0;
uu.parseObj({id:-id,nick:'Гость '+id,login:'guest'+id,pers:tpers,money:5,mode:0,energy:maxEnergyValue});
uu.ip=uu.getIPConnect(th);
AuthDataFunc1(th,uu,null);
}
else{
th.send(statusServer,0);
}
}else{
th.send(statusServer,ErrorType.VERSION_ERROR);
}
}else{
th.send(statusServer,0);
}
}else{
th.send(statusServer);
}
});

srv.addCmd('ping',function(){
this.send(1);
});

srv.addCmd('users.get',function(aa){
var th=this;
var ids=[];
if(arguments.length>0)ids=aa;
getUsersObjByIds(this,ids,function(res){
th.send(res);
});
});


srv.addCmd('updUser',function(){});


srv.addCmd('maps.get',function(id){
var th=this;
if(typeof id!=="undefined"){
var ids=[];
if(typeof id==="string")ids.push(parseInt(id));
else{
ids=id;
}
findMapsByIDS(ids,function(arr){
th.send(arr);
});
}else{
th.send([]);
}
});


srv.addCmd('maps.getMapsIdsByUser',function(id){
var th=this;
var user=this.getUserData("user");
if(user!=null){
if(typeof id!=="undefined"){
findMapsIdsByUser(id,user.id,function(arr){
th.send(arr);
});
}else{
th.send([]);
}
}
});


srv.addCmd('maps.getMapsIdsStatus',function(t){
var th=this;
var user=this.getUserData("user");
if(user!=null && arguments.length>0){
//if((UserMode.isModeratorMaps(user.mode) || UserMode.isModeratorMapsM(user.mode))){
t=parseInt(t);
if(isNaN(t))t=0;
getMapsIdsByStatus(t,function(arr){
th.send(arr);
});
/*}else{
th.send([]);
}*/
}else{
th.send([]);
}
});

/*srv.addCmd('maps.getRandomMap',function(){
var th=this;
var ids=[];
getRandomMap(0,1,function(o){
th.send(o);
});
});*/

srv.addCmd('maps.getAllMapsIds',function(){
var th=this;
var user=this.getUserData("user");
if(user!=null){
findMapsAllIds(function(arr){
th.send(arr);
});
}else{
th.send([]);
}
});

srv.addCmd('maps.savemap',function(map){
var th=this;
var user=this.getUserData("user");
if(arguments.length>0 && user!=null && user.checkAccessAccount('send_maps_moderation',this) && user.checkAccessM('send_maps_moderation')){
var userid=user.id;
var price=priceSaveMapServerNew;
//price=0;
if(user.money>=price){

if(map && map.length<=0xFFFF){
    
var mapObj=jsonDecode(map);
var mapCl=null;
if(mapObj){
mapCl=new GameMap();
mapCl.parseMap(mapObj);
}

if(mapCl){
var matText=mapCl.checkTextMat();
if(matText){
th.send(3);
}else{
user.minusMoney(price);
saveMapByUser(map,userid,function(id){
if(vkNotifyApi!=null)vkNotifyApi.sendMission(user,10);
MainRoom.sendMessageEvent('mapsAction',user.id,0,[id,'mod']);
MainRoom.sendPrivateMsg(systemUser,user,'Ваша карта '+id+' отправлена на модерацию.');
//MainRoom.sendSystemMessage('Новая карта на модерации ID '+id,true);
th.send(1,id);
});
}
}else{
th.send(0);
}

}else{
th.send(0);
}
}else{
th.send(2);
}
}else{
th.send(0);
}
});


/*srv.addCmd('maps.updatemap',function(id,map){
var th=this;
var user=this.getUserData("user");
if(arguments.length>1 && user!=null && UserMode.isModeratorMaps(user.mode) && user.checkOriginalConnect(this) && user.modMapsAdv==1){
if(map==null)map='';
mysql.query('UPDATE maps SET map=? WHERE id=?', [map,id], function(rows){
if(rows!=null){
th.send(1);
if(SystemRoom!=null)SystemRoom.sendMessageEvent('mapsAction',user.id,0,[id,'update']);
MainRoom.sendMessageEvent('mapsAction',user.id,0,[id,'update']);

}else{
th.send(0);
}
});

}else{
th.send(0);
}
},USER_MODE_MOD_MAPS);*/


srv.addCmd('maps.updatemapuser',function(id,map){
var th=this;
var user=this.getUserData("user");
if(arguments.length>1 && user!=null && user.checkOriginalConnect(this) && map!=null){

mysql.query('SELECT id, status, user FROM maps WHERE id=?', [id], function(rows){
var ob=null;
if(rows!=null && rows.length>0)ob=rows[0];
if(ob!=null){
var r1=false;
var isCheckMat=false;
if(UserMode.isModeratorMaps(user.mode) && user.modMapsAdv==1){
r1=true;
}else if(ob.status==0 && ob.user==user.id){
r1=true;
isCheckMat=true;
}

if(r1 && map && map.length<=0xFFFF){
var mapObj=jsonDecode(map);
var mapCl=null;
if(mapObj){
mapCl=new GameMap();
mapCl.parseMap(mapObj);
}

if(mapCl){
var matText=mapCl.checkTextMat();
if(isCheckMat && matText){
th.send(2);
}else{
var ts=getTimestamp();
mysql.query('UPDATE maps SET map=?, update_user=?, update_time=? WHERE id=?', [map,user.id,ts,id], function(rows){
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
th.send(1);

if(UserMode.isModeratorMaps(user.mode) && user.modMapsAdv==1){
//if(SystemRoom!=null)SystemRoom.sendMessageEvent('mapsAction',user.id,0,[id,'update']);
MainRoom.sendMessageEvent('mapsAction',user.id,0,[id,'update']);
}

}else{
th.send(0);
}
});
}
}else{
th.send(0);
}
}else{
th.send(0);
}

}else{
th.send(0);
}
});

}else{
th.send(0);
}
});

srv.addCmd('maps.updateWorldMap',function(id,map){
var th=this;
var user=this.getUserData("user");
if(arguments.length>1 && user!=null && user.checkOriginalConnect(this) && map!=null){
var mapObj=jsonDecode(map);
if(mapObj!=null){
if(typeof mapObj=='object' && 'time' in mapObj)delete mapObj.time;
var mapStr=jsonEncode(mapObj);
var ts=getTimestamp();
if(mapStr && mapStr.length<=0xFFFF){
    
var mapObj=jsonDecode(mapStr);
var mapCl=null;
if(mapObj){
mapCl=new GameMap();
mapCl.parseMap(mapObj);
}

if(mapCl){
var matText=mapCl.checkTextMat();
if(matText){
th.send(2);
return;
}
mysql.query('UPDATE worldMaps SET map=?, time=? WHERE id=? AND user=?', [mapStr,ts,id,user.id], function(rows){
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
var wo=worldMapsMaster.findWorldOnlineListByID(id);
if(wo!=null && wo.length>0){
worldMapsMaster.findWorldMapByID(id,function(ob){
if(ob!=null){
for (var i = 0; i < wo.length; i++) {
var el=wo[i];
el.m=ob;
}
}    
});
}
worldMapsMaster.updateMapDataByID(id,mapObj,ts);
th.send(1);
}else{
th.send(0);
}
});
}
}else{
th.send(0);
}
}else{
th.send(0);
}
}else{
th.send(0);
}
},USER_MODE_SUPER_ADMIN);


srv.addCmd('maps.deletemap',function(id){
var th=this;
var user=this.getUserData("user");
if(user!=null && user.checkOriginalConnect(this)){
var isAccess=false;
var isAdminA=false;
var mapid=0;
if(arguments.length>0){
mapid=parseInt(id);
if(isNaN(mapid))mapid=0;
}
if(UserMode.isSuperAdmin(user.mode)){
isAccess=true;
isAdminA=true;
}

mysql.query('SELECT id, status, user FROM maps WHERE id=?', [mapid], function(rows){
var ob=null;
if(rows!=null && rows.length>0)ob=rows[0];
if(ob){

if(ob.user==user.id){
if(ob.status!=0 && ob.status!=1)isAccess=true;
}

if(isAccess){
mysql.query('DELETE FROM maps WHERE id=?', [mapid], function(rows){
if(rows!=null){
th.send(1);
if(isAdminA){
var msg='Карта id '+mapid+' удалена.';
MainRoom.sendMsgByUser(user,null,msg);
//if(SystemRoom!=null)SystemRoom.sendMsgByUser(user,null,msg);
}
}else{
th.send(0);
}
});
}else{
th.send(0);
}

}else{
th.send(0);
}
});

}else{
th.send(0);
}
});


srv.addCmd('maps.changestatus',function(id,t,txt){
var th=this;
var user=this.getUserData("user");
var txt2='';
if(arguments.length>2)txt2=''+txt;
if(txt2!=null){
txt2=SubstrTxtChatSize(txt2,100);
}
if(user!=null && user.checkOriginalConnect(this) && (UserMode.isModeratorMaps(user.mode) || UserMode.isModeratorMapsM(user.mode))){

if(t==0){

mysql.query('SELECT id, status, user FROM maps WHERE id=?', [id], function(rows){
var ob=null;
if(rows!=null && rows.length>0)ob=rows[0];
if(ob!=null && ob.status!=0 && UserMode.isModeratorMaps(user.mode)){
mysql.query('UPDATE maps SET status=? WHERE id=?', [0,id], function(rows){
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
th.send(1);
}else{
th.send(0);
}
});
}else{
th.send(0);
}
});
}else if(t==1 || t==2){
    
mysql.query('SELECT id, status, user, approved_user, approved_time, cancel_user, cancel_time, is_approved FROM maps WHERE id=? AND status=?', [id,0], function(rows){
var ob=null;
if(rows!=null && rows.length>0)ob=rows[0];
if(ob!=null){
var isApproved=false;
if(ob.is_approved==1)isApproved=true;
var approved_user=ob.approved_user;
var approved_time=ob.approved_time;
var approved_userOrig=approved_user;

var cancel_user=ob.cancel_user;
var cancel_time=ob.cancel_time;
var cancel_userOrig=cancel_user;

var ts2=getTimestamp();

if(t==1 && approved_user==0){
approved_user=user.id;
approved_time=ts2;
}

if(t==2 && cancel_user==0){
cancel_user=user.id;
cancel_time=ts2;
}

var userid=ob['user'];
var price=priceSaveMapServer;
if(t==1){
mysql.query('UPDATE maps SET status=?, approved_user=?, approved_time=?, is_approved=? WHERE id=?', [1,approved_user,approved_time,1,id], function(rows){
    
if(!isApproved){
    
getMapsCountUsers(userid,function(countMaps){
if(countMaps>50){
price+=100;
}
if(countMaps>100){
price+=100;
}

if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
th.send(1);

var msg='Карта id '+id+' была одобрена.';
var msg2=msg;
msg2+='\nКарту можно увидеть тут https://ag6.ru/48/m/'+id;
msg2+='\nКарту проверял модератор карт (ID '+user.id+') '+user.nick;
MainRoom.sendMessageEvent('mapsAction',user.id,0,[id,'add']);

//if(SystemRoom!=null)SystemRoom.sendMessageEvent('mapsAction',user.id,0,[id,'add']);

addMailMsg(user.id,userid,'карта '+id+' img://successIcon1');

statsUsers.plusCount('modmaps_approved',user.id);

//MainRoom.sendMsgByUser(modMapsUser,null,msg);
//MainRoom.sendSystemMessage(msg,true);
var u=AllUsersRoom.getUserByID(userid);
if(u!=null){
u.plusMoney(price);
//MainRoom.sendPrivateMsg(user,u,msg);
}else{
plusMoneyUserByID(userid,price,function(){
th.send(1);
});
}


if(vkGroupMessages!=null){
getUsersObjByIds(null,[userid],function(aa){
for (var i = 0; i < aa.length; i++) {
var u=aa[i];
if(u!=null){
var prefixAuth=u.getPrefixAuth();
if(prefixAuth=='vk'){
var loginUser=u.login.substr(2);
vkGroupMessages.sendMessageUserGroup(vkGroupID,loginUser,msg2,function(o){});
}
}
}
},0,true);
}

}else{
th.send(0);
}


});
}else{

if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
th.send(1);
console.log(8);
MainRoom.sendMessageEvent('mapsAction',user.id,0,[id,'add']);
}

}
    
});
}else if(t==2){ // отклонена
//var query='DELETE FROM maps WHERE id=?';

if(txt2==null)txt2='';

var query='UPDATE maps SET status=3, cancel_user=?, cancel_time=?, txt1=? WHERE id=?';
mysql.query(query, [cancel_user,cancel_time,txt2,id], function(rows){
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
th.send(1);

if(cancel_userOrig==0){
var msg='Карта id '+id+' была отклонена';
if(txt2!=null && txt2.length>0)msg=msg+' ('+txt2+')';
var msg2=msg;
msg2+='\nКарту можно увидеть тут https://ag6.ru/48/m/'+id;
msg2+='\nКарту проверял модератор карт (ID '+user.id+') '+user.nick;

addMailMsg(user.id,userid,'карта '+id+' img://DeleteMsg');

statsUsers.plusCount('modmaps_cancel',user.id);

//msg+='.';
if(vkGroupMessages!=null){
getUsersObjByIds(null,[userid],function(aa){
for (var i = 0; i < aa.length; i++) {
var u=aa[i];
if(u!=null){
var prefixAuth=u.getPrefixAuth();
if(prefixAuth=='vk'){
var loginUser=u.login.substr(2);
vkGroupMessages.sendMessageUserGroup(vkGroupID,loginUser,msg2,function(o){});
}
}
}
},0,true);
}

//if(SystemRoom!=null)SystemRoom.sendMessageEvent('mapsAction',user.id,0,[id,'cancel',txt2]);

//MainRoom.sendSystemMessage(msg,true);
//MainRoom.sendMsgByUser(modMapsUser,null,msg);
var u=AllUsersRoom.getUserByID(userid);
if(u!=null){
//MainRoom.sendPrivateMsg(user,u,msg);
}

}

MainRoom.sendMessageEvent('mapsAction',user.id,0,[id,'cancel',txt2]);

}else{
th.send(0);
}
});
} 
    
}else{
th.send(0);
} 
});

}else if(UserMode.isModeratorMaps(user.mode) && (t==3 || t==4)){
var statusV=1;
if(t==3)statusV=2;
var txt3='';
var msg2='';
if(statusV==2){
msg2='заблокирована';
if(txt2 && txt2.length>0){
txt3=txt2;
msg2+=' ('+txt2+')';
}
}else{
msg2='одобрена';
}
mysql.query('UPDATE maps SET status=?, txt1=? WHERE id=?', [statusV,txt3,id], function(rows){
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
th.send(1);

MainRoom.sendMessageEvent('mapsAction',user.id,0,[id,'changeStatus',msg2]);

//if(SystemRoom!=null)SystemRoom.sendMessageEvent('mapsAction',user.id,0,[id,'changeStatus',msg2]);

/*var msg2='карта '+id;
if(t==3)msg2+=' заблокирована';
else if(t==4)msg2+=' разблокирована';*/

}else{
th.send(0);
}
});
}else{
th.send(0);
}

}else{
th.send(0);
}
});





srv.addCmd('maps.changestatusLevel',function(id,t){
var th=this;
var lvl2=mapLevelsUsers2;
var user=this.getUserData("user");
if(user!=null && user.checkOriginalConnect(this) && (UserMode.isModeratorMaps(user.mode) || UserMode.isModeratorMapsM(user.mode))){
if(t==0 || t==1){
var lvlNew=0;
if(t==1)lvlNew=lvl2;
mysql.query('UPDATE maps SET mapLevel=? WHERE id=?', [lvlNew,id], function(rows){
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
th.send(1);
if(lvlNew<=0)lvlNew=1;
MainRoom.sendMessageEvent('mapsAction',user.id,0,[id,'changeLevel',lvlNew]);

//if(SystemRoom!=null)SystemRoom.sendMessageEvent('mapsAction',user.id,0,[id,'changeLevel',lvlNew]);

}else{
th.send(0);
}
});
}else{
th.send(0);
}
}else{
th.send(0);
}
});


srv.addCmd('top.getScoresUser',function(idd){
var th=this;
var user=this.getUserData("user");
if(user!=null){
if(arguments.length>0){
var userid=parseInt(idd);
if(isNaN(userid))userid=0;
var arr=[];
if(topScoresUsersList!=null){
arr=topScoresFindByUserID(topScoresUsersList,userid);
}
this.send(arr);
}
}
});

srv.addCmd('app.getTop',function(t){
var th=this;
var user=this.getUserData("user");
if(user!=null){
if(arguments.length>0){

loadTopInfoCB(t,function(o){
th.send(o);
});

if(vkNotifyApi!=null && !('isOpenTop1' in user)){
user.isOpenTop1=1;
vkNotifyApi.sendMission(user,14);
}

}
}
});

/*
srv.addCmd('getAutoWorld',function(){
var o=findAutoWorld();
if(o!=null){
var ob=o.getWorldInfoObj();
this.send(ob);
}else{
this.send(null);
}
});*/

function getRandomInt(min, max) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
}

srv.addCmd('game.boarAct1',function(t,arg1,arg2){
var th=this;
var user=th.getUserData("user");
if(user!=null && arguments.length>0 && user.boarKonkurs==1){
var isAccess=false;
var isAccessOrig=false;
var resSend=true;
var tt='';
if(user.boarKonkurs==1){
isAccess=true;
if(user.checkOriginalConnect(this))isAccessOrig=true;
}

if(isAccess){
var dt={v:0};
if(t=='info'){
if(curBoarKonkursData!=null){
dt.v=1;
dt.data=curBoarKonkursData;
}
}else if(t=='infoUsers'){
if(curBoarKonkursData!=null){
dt.v=1;
var aa2=[];
for (var i = 0; i < curBoarKonkursData.winnerUsers.length; i++) {
var el=curBoarKonkursData.winnerUsers[i];
if(el)aa2.push({id:el.id,nums:el.nums});
}
dt.data=aa2;
}
}else if(t=='create'){
if(isAccessOrig){
var giftid=0;
var isPostVK=false;
var isPrivatePost=true;
if(typeof arg1=='object' && Array.isArray(arg1)){
if(arg1.length>3){
tt=arg1[0];
giftid=parseInt(arg1[1]);
if(isNaN(giftid))giftid=0;
if(arg1[2]==true)isPostVK=true;
//if(arg1[3]==true)isPrivatePost=true;
}
}

if(giftid>0){
var giftObj=shopMaster.getItemByItemIDAndType(giftid,ShopItemsType.GIFTS);
if(giftObj!=null){
//th.resSend=false;
var vkPostID=0;
var boarID=getRandomInt(1,5000);
var giftInfo={id:giftid,name:giftObj.name,url:giftObj.url};
var obb2={id:boarID,giftInfo:giftInfo};
var obb={type:'boar',giftInfo:giftInfo,boarID:boarID,winnerUsers:[],o2:obb2};
obb.boaruid=user.id;
var cb2=function(){
if(isPrivatePost){
if(tt=='t1'){
obb.vkPostID=vkPostID;
var users=AllUsersRoom.users;
for (var i = 0; i < users.length; i++) {
var u=users[i];
if(u!=null){
var msgV='Кабанчик уже в забегах, когда встретите его, нажмите на него левой кнопкой мыши! Приз - '+giftObj.name;
//var msgV='Кабанчик ('+boarID+') уже в забегах, когда встретите его, нажмите на него левой кнопкой мыши! Приз - '+giftObj.name;
/*var msgV='Кабанчик ('+boarID+') уже в забегах, ищите его и делайте скриншот, отправьте скриншот в группу игры, ваш id '+u.id+', приз - '+giftObj.name+' ';
if(vkPostID>0){
msgV+='it://vkwall'+vkPostID;  
}else{
msgV+='it://vkgroup';
}*/
//MainRoom.sendPrivateMsg(systemUser,u,msgV);
}
}
MainRoom.sendSystemMessage(msgV,true);
//AllUsersRoom.emitRoom('sendEvent','boarKonkursData',[obb2]);
}
}
};

dt.v=1;
curBoarKonkursData=obb;
MainRoom.addUser(boarUser);
updateAllUsersEventsList();
if(vkGroupApi!=null && isPostVK){
if(tt=='t1'){
//var msgPost='Это тестовая запись, не обращайте внимание.\n';
var msgPost='';
//msgPost+='Внимание, это тестовый пост для конкурса "кабанчик" его нет в забегах сейчас!\n\n';
msgPost+='Кабанчик\nОчень ловкий и хитрый игрок, который будет прятаться от вас.\nВаша задача - Найти Кабанчика и нажать на него левой кнопкой мыши.\nПобедитель получает подарок - '+giftObj.name+'.';
//msgPost+='Кабанчик ('+boarID+')\nОчень ловкий и хитрый игрок, который будет прятаться от вас.\nВаша задача - Найти Кабанчика и сделать скриншот забега с ним. После чего отправить его в комментарии под этим постом.\n❗Важно❗\nНа скриншоте должен быть виден ник Кабанчик ('+boarID+') и не забывайте указывать свой игровой ID (идентификатор), который вы найдете в разделе "Информация".\nПобедитель получает подарок - '+giftObj.name+'.';
vkGroupApi.api('wall.post',{owner_id:-vkGroupIDInt,attachments:'https://vk.com/app'+appVKInfo.id+'',message:msgPost},function(o){
if(o!=null && 'response' in o)o=o.response;
if(o!=null && 'post_id' in o){
vkPostID=o['post_id'];
}
cb2();
});
}
}else{
cb2();
}

}
}

}
}else if(t=='stop'){
if(isAccessOrig){
    
/*if(typeof arg1=='object' && Array.isArray(arg1)){
if(curBoarKonkursData!=null){
var usersIds=arg1;
var giftid=curBoarKonkursData.giftInfo.id;
var nn2=usersIds.length;
resSend=false;
getUsersObjByIds(null,usersIds,function(res){
var nn=0;
if(res!=null)nn=res.length;
if(nn==nn2){
var txt1='за конкурс "кабанчик"';
if(res!=null){
for (var i = 0; i < res.length; i++) {
var uu=res[i];
(function(u){
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,-2,u.id,function(res){
MainRoom.sendGiftMessage(systemUser,u,[giftid],txt1);
var userOnline=MainRoom.getUserByID(u.id);
if(userOnline!=null)userOnline.emit('userEvent','PresentUserGift',-2,giftid);
});
})(uu);
}
}
var dt2=curBoarKonkursData;
if(vkGroupMessages!=null && 'vkPostID' in dt2 && dt2.vkPostID!=0){
vkGroupMessages.api('wall.createComment',{owner_id:-vkGroupIDInt,post_id:dt2.vkPostID,attachments:'',message:'Конкурс завершён.'},function(o){
if(o!=null && 'response' in o)o=o.response;
});
}


curBoarKonkursData=null;
dt.v=1;
th.send(dt);
}else{
th.send(dt);
}

});

}
}*/


if(curBoarKonkursData!=null){
var usersIds=[];

for (var i = 0; i < curBoarKonkursData.winnerUsers.length; i++) {
var el=curBoarKonkursData.winnerUsers[i];
usersIds.push(el.id);
}

var giftid=curBoarKonkursData.giftInfo.id;
var giftObjInfo=null;
if(giftid in shopMaster.giftsObj)giftObjInfo=shopMaster.giftsObj[giftid];
//var nn2=usersIds.length;
resSend=false;

var dt2=curBoarKonkursData;
if(vkGroupMessages!=null && 'vkPostID' in dt2 && dt2.vkPostID!=0){
vkGroupMessages.api('wall.createComment',{owner_id:-vkGroupIDInt,post_id:dt2.vkPostID,attachments:'',message:'Конкурс завершён.'},function(o){
if(o!=null && 'response' in o)o=o.response;
});
}

MainRoom.sendSystemMessage('Конкурс Кабанчик завершён!',true);
MainRoom.removeUser(boarUser);
MainRoom.emitRoom("usersExit",[boarUser.id],MainRoom.users.length);
curBoarKonkursData=null;
updateAllUsersEventsList();
dt.v=1;
th.send(dt);

/*getUsersObjByIds(null,usersIds,function(res){
var nn=0;
if(res!=null)nn=res.length;
if(nn==nn2){
var txt1='за конкурс "кабанчик ('+curBoarKonkursData.boarID+')"';
if(res!=null){
for (var i = 0; i < res.length; i++) {
var uu=res[i];
(function(u){
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,-2,u.id,function(res){
var userOnline=MainRoom.getUserByID(u.id);
if(userOnline!=null && giftObjInfo)userOnline.emit('userEvent','PresentUserGift',-2,giftObjInfo);
});
})(uu);
MainRoom.sendGiftMessage(systemUser,uu,[giftid],txt1);
}
}
var dt2=curBoarKonkursData;
if(vkGroupMessages!=null && 'vkPostID' in dt2 && dt2.vkPostID!=0){
vkGroupMessages.api('wall.createComment',{owner_id:-vkGroupIDInt,post_id:dt2.vkPostID,attachments:'',message:'Конкурс завершён.'},function(o){
if(o!=null && 'response' in o)o=o.response;
});
}

if(dt2){
var msgV='Конкурс Кабанчик завершён!';
//var msgV='Конкурс Кабанчик ('+dt2.boarID+') завершён!';
//var users=AllUsersRoom.users;
//for (var i = 0; i < users.length; i++) {
//var u=users[i];
//if(u!=null){
//MainRoom.sendPrivateMsg(systemUser,u,msgV);
//}
//}
MainRoom.sendSystemMessage(msgV,true);
}
//AllUsersRoom.emitRoom('sendEvent','boarKonkursData',[null]);
curBoarKonkursData=null;
updateAllUsersEventsList();
dt.v=1;
th.send(dt);
}else{
th.send(dt);
}

});*/

}



}
}
if(resSend)th.send(dt);

}
}
});


srv.addCmd('game.boarActCl',function(id){
var th=this;
var user=th.getUserData("user");
if(user!=null && arguments.length>0){
id=parseInt(id);
if(isNaN(id))id=0;
var res='err';
if(curBoarKonkursData && curBoarKonkursData.boarID==id){
    
var ids=curBoarKonkursData.winnerUsers;
var isFind=null;
var isIP=false;
for (var i = 0; i < ids.length; i++) {
var ob=ids[i];
if(ob.id==user.id || ob.ip==user.ip){
isFind=ob;
if(ob.ip==user.ip)isIP=true;
break;
}
}
if(!isFind){
ids.push({id:user.id,ip:user.ip,nums:1});
res='ok';

var giftid=curBoarKonkursData.giftInfo.id;
var giftObjInfo=null;
if(giftid in shopMaster.giftsObj)giftObjInfo=shopMaster.giftsObj[giftid];

var prizeTxt='';
if(giftObjInfo){
prizeTxt=''+giftObjInfo.name;
}

var arr=['Кабанчику не удалось убежать от','Вот это удача!','Жена кабанчика и то не может так быстро поймать, а тебе удалось!'];
var tx2=arr.random();
var tx3='подарок - '+prizeTxt;
var msg=tx2+'\nID '+user.id+' ('+user.nick+')\nДержи '+tx3+'!';
//trace(msg);

var txt1='за конкурс "кабанчик"';
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,-2,user.id,function(res){
var userOnline=MainRoom.getUserByID(user.id);
if(userOnline!=null && giftObjInfo)userOnline.emit('userEvent','PresentUserGift',-2,giftObjInfo);
});
MainRoom.sendGiftMessage(systemUser,user,[giftid],txt1);

var dt2=curBoarKonkursData;
if(vkGroupMessages!=null && 'vkPostID' in dt2 && dt2.vkPostID!=0){
vkGroupMessages.api('wall.createComment',{owner_id:-vkGroupIDInt,post_id:dt2.vkPostID,attachments:'',message:msg},function(o){
if(o!=null && 'response' in o)o=o.response;
});
}

}else{
//if(!isIP)++ob.nums;
++ob.nums;
res='exists';
}
}
th.send(res);
}
});

srv.addCmd('game.loadLevels',function(){
var th=this;
var user=th.getUserData("user");
if(user!=null){
var map=mainMap.getMapByLevel(user.mapLevel);
var localLevel=mainMap.getLocalLevel(user.mapLevel);
var ob={level:user.mapLevel,localLevel:localLevel,map:jsonEncode(map)};
th.send(ob);
/*mysql.query('SELECT * FROM mainMap WHERE id=?', [1], function(rows){
var ts=getTimestamp();
if(rows!=null){
var mapOb=null;
if(rows.length>0)mapOb=rows[0].data;
var ob={dogsCount:user.dogsCount,level:user.mapLevel,map:jsonDecode(mapOb)};
th.send(ob);  
}
});*/
 
}
});

srv.addCmd('navWorldRoom',function(t){
var th=this;
var user=th.getUserData("user");
if(user!=null && arguments.length>0){
//var tt=''+t;
var tt=parseInt(t);
if(isNaN(tt))tt=0;
var isOrig=user.checkOriginalConnect(this);
if(isOrig){
//var ob=worldMapsMaster.findMapByType(tt);

/*var ob=worldMapsMaster.findMapByID(tt);
if(ob!=null){
var world=worldMapsMaster.findAutoWorld(ob);
if(world!=null){
var streamid=world.stream.id;
var mapStr=jsonEncode(ob.map.map);
var oo={id:ob.id,name:ob.name,map:mapStr};
th.send(1,streamid,oo);
}else{
th.send(0);
}
}else{
th.send(0);
}*/

worldMapsMaster.findWorldMapByUserID(tt,function(ob){
if(ob!=null){
if(ob.map!=null){
var world=worldMapsMaster.findAutoWorld(ob);
if(world!=null){
var streamid=world.stream.id;
//var mapStr=jsonEncode(ob.map.map);
world.addUser(user,true);
var users=world.getUsersList();
var oo={id:ob.id,name:ob.name,user:ob.user,map:ob.map.map,users:users,arr2:world.itemsIds};
th.send(1,streamid,oo);
}else{
th.send(0);
}
}else{
th.send(0);
}
}else{
th.send(0);
}    
});


}else{
th.send(2);
}
}
});

srv.addCmd('game.LevelsEditorCmd',function(t,arg1,arg2,arg3){
var th=this;
var user=th.getUserData("user");
if(user!=null && user.levelsEditor==1){
var isOrig=user.checkOriginalConnect(this);
if(t=='loadMapByID'){
var map=mainMap.getMapByID(arg1);
var ob=map;
th.send(ob);
}else if(t=='loadMapsInfo'){
var maps=mainMap.maps;
var ob=[];
for (var i = 0; i < maps.length; i++) {
var el=maps[i];
ob.push({id:el.id,name:el.name,levelsCount:el.map.length});
}
th.send(ob);
}else if(t=='saveMap' && isOrig){
var mapID=arg1;
var dt=arg2;

mysql.query('UPDATE mainMap SET data=? WHERE id=?', [dt,mapID], function(rows){
var map=mainMap.getMapByID(mapID);
if(map!=null){
map.map=jsonDecode(dt);
mainMap.parseAllMaps();
}
th.send(1);
});

}else if(t=='changeNameMap' && isOrig){
var mapID=arg1;
var dt=arg2;

mysql.query('UPDATE mainMap SET name=? WHERE id=?', [dt,mapID], function(rows){
var map=mainMap.getMapByID(mapID);
if(map!=null)map.name=dt;
th.send(1);
});

}else if(t=='createMap' && isOrig){
var nm=arg1;
var dt=jsonEncode([]);
mysql.query('INSERT INTO mainMap (name,data) VALUES (?,?)', [nm,dt], function(rows){
mainMap.reload(function(){
var idd=0;
if(rows!=null && 'insertId' in rows)idd=parseInt(rows.insertId);
th.send(1,idd); 
});
});
}
}
});

srv.addCmd('game.unlockLevel',function(id){
var th=this;
if(arguments.length<=0)id=0;
var user=th.getUserData("user");
if(user!=null){
var v='error';
var price=0;
var ev='';
var lvl=user.mapLevel;
var localLevel=mainMap.getLocalLevel(user.mapLevel);
if(user.mapLevel+1==id){
var mapCur=mainMap.getMapByLevel(user.mapLevel,false);

var infoMap=mainMap.getMapInfoByLocalLevel(mapCur,localLevel+1);

var targetCount=mainMap.getTargetCountMap(infoMap);
if(targetCount>0){
price=targetCount;
}
//console.log('aaa',targetCount);

if(user.dogsCount>=price){
v='ok';
localLevel+=1;
var actions=mainMap.getActionsListLevel(infoMap);

if(actions!=null){
for (var i = 0; i < actions.length; i++) {
var el=actions[i];
var tt=el.t;
var vv=parseInt(el.v);
if(isNaN(vv))vv=0;
if(vv>0){
if(tt==1){ // опыт
user.plusOpyt(vv);
}else if(tt==2){ // лапки
user.plusMoney(vv);
}else if(tt==3){ // косточки
user.plusKosti(vv);
}else if(tt==10){ // other
if(vv==1){
var opytV=1000;
user.plusOpyt(opytV);
user.emit('userEvent','openItemsMapLevel',1,opytV);  
}
}else if(tt==15){ // подарок
var giftid=vv;
var giftObj=shopMaster.getItemByItemIDAndType(giftid,ShopItemsType.GIFTS);
if(giftObj!=null){
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,-2,user.id,function(res){
//MainRoom.sendGiftMessage(systemUser,user,[giftid],txt1);
//user.emit('userEvent','PresentUserGift',-2,giftid);
});
}

}
}
}
}

var mapV=mainMap.getMapByLevel(user.mapLevel);
if(mapV!=null && localLevel>=mapV.map.length){
user.mapLevel+=1;
lvl+=1;
ev='end';
}else{
lvl+=1;
}
user.mapLevel+=1;
//user.plusOpyt(10*user.mapLevel);
user.minusDogs(price);
}else{
v='no';
localLevel=price;
}

}else{
v='lock';
}
//var localLevel=mainMap.getLocalLevel(user.mapLevel);
th.send(v,localLevel,lvl,ev);
 
}
});


function removeGameRoom(r){
if(r!=null){
for (var i = 0; i < gameRoomsList.length; i++) {
var el=gameRoomsList[i];
if(el==r){
gameRoomsList.splice(i,1);
//console.log('room del');
return true;
}
}
}
return false;
}

function findAutoGameRoom(user,cb){
if(user!=null){
var findRoom=null;
for (var i = 0; i < gameRoomsList.length; i++) {
var el=gameRoomsList[i];
var ulevel=user.level;
//if(user.mapsLevelMode==1)ulevel=1;
if(el!=null && el.t2==0 && el.map!=null && !el.isPlayRoom && el.isActive()){
//if((user.mapsLevelMode==0 && ulevel>=mapLevelsUsers2 && el.map.mapLevel>1) || ulevel>=el.map.mapLevel){
//if((user.mapsLevelMode==0 && ulevel>=el.map.mapLevel) || ulevel>=el.map.mapLevel){
//if(ulevel>=el.map.mapLevel){
if(user.mapsLevelMode==1 && ulevel>=mapLevelsUsers2 && el.map.mapLevel>=mapLevelsUsers2){ // сложные карты
findRoom=el;
break;
}else if(user.mapsLevelMode==0 && el.map.mapLevel<mapLevelsUsers2){ // лёгкие карты
findRoom=el;
break;
}

}
}

if(findRoom!=null){
//console.log('find room',user.id,findRoom.map.id,findRoom.map.mapLevel);
if(cb!=null)cb(findRoom);
}else{
getRandomMap(user.mapsLevelMode,user.level,function(oo){
if(oo!=null){
//if(ActiveMainGameRoom==null || !ActiveMainGameRoom.isActive()){
var mapCl=new GameMap();
mapCl.parseMap(oo.map);
var r=new GameRoom(1,mapCl,null,'def');
r.closeCB=function(room){
removeGameRoom(room);
};
gameRoomsList.push(r);
if(cb!=null)cb(r);
gameRoomsListMaster.sendEventZabegGameRoom('add',r);
}else{
if(cb!=null)cb(null);
}
});
}
}
}



function findAutoGameRoomByName(user,nameRoom,mapid,mapObj,cb){
var findRoom=null;
for (var i = 0; i < gameRoomsList.length; i++) {
var el=gameRoomsList[i];
if(el!=null && el.map!=null && el.roomName==nameRoom && !el.isPlayRoom && el.isActive()){
findRoom=el;
break;
}
}

if(findRoom!=null){
//console.log('find room',user.id,findRoom.map.id,findRoom.map.mapLevel);
if(cb!=null)cb(findRoom);
}else{
    
var loadMap=function(oo){
if(oo!=null){
var mapCl=new GameMap();
mapCl.parseMap(oo.map);
var r=new GameRoom(1,mapCl,null,'myroom');
r.t2=1;
r.roomName=nameRoom;
r.closeCB=function(room){
removeGameRoom(room);
};
gameRoomsList.push(r);
if(cb!=null)cb(r);
gameRoomsListMaster.sendEventZabegGameRoom('add',r);
}else{
if(cb!=null)cb(null);
}
};

if(mapObj!=null){
loadMap(mapObj);
}else{
findMapsByIDS([mapid],function(aa){
var oo=null;
if(aa.length>0)oo=aa[0];
if(oo==null){
getRandomMap(user.mapsLevelMode,user.level,function(oo){
loadMap(oo);
});
}else{
loadMap(oo);
}
});
}
}
}



srv.addCmd('game.startRoom',function(){
var th=this;
var user=this.getUserData("user");
if(user!=null){
if(!user.checkAccessM('game_zabeg')){
th.send(0);
return;
}
/*findMapsByIDS([37],function(aa){
var oo=null;
if(aa.length>0)oo=aa[0];*/

var findRoom=null;
for (var i = 0; i < gameRoomsList.length; i++) {
var el=gameRoomsList[i];
if(el!=null && /*!el.isPlayRoom && el.isActive() &&*/ user.id in el.waitUsersIds){
findRoom=el;
break;
}
}

if(findRoom!=null){
th.send(2);
}else{
findAutoGameRoom(user,function(r){
if(r!=null){
var ts=getTimestamp();
var tm=r.waitTimeStart-ts;
if(tm<=0)tm=0;
th.send(1,tm,r.stream.id);
}else{
th.send(0);
}
});    
}

/*getRandomMap(0,1,function(oo){
if(oo!=null){
if(ActiveMainGameRoom==null || !ActiveMainGameRoom.isActive()){
var mapCl=new GameMap();
mapCl.parseMap(oo.map);
ActiveMainGameRoom=new GameRoom(1,mapCl,null);
th.send(1,ActiveMainGameRoom.stream.id);
}else{
th.send(1,ActiveMainGameRoom.stream.id);
}
}
});*/
  
/*getRandomMap(0,1,function(oo){
if(oo!=null){
if(ActiveMainGameRoom==null || !ActiveMainGameRoom.isActive()){
var mapCl=new GameMap();
mapCl.parseMap(oo.map);
ActiveMainGameRoom=new GameRoom(1,mapCl,null);
}
th.send(1,ActiveMainGameRoom.stream.id);
}
}else{
th.send(0);
}
});*/


if(vkNotifyApi!=null)vkNotifyApi.sendMission(user,13);
}
});



srv.addCmd('game.getRoomsList',function(type){
var th=this;
var user=this.getUserData("user");
if(user!=null){
/*if(!user.checkAccessM('game_zabeg')){
th.send(0);
return;
}*/

var tt='';
var gt=null;
if(arguments.length>0)tt=''+type;
if(tt=='def')gt='def';
else if(tt=='lapki')gt='lapki';
else if(tt=='room')gt='myroom';
var arr=[];
var findRoom=null;
var ts=getTimestamp();
for (var i = 0; i < gameRoomsList.length; i++) {
var el=gameRoomsList[i];
if(el!=null && el.gameType==gt/* && !el.isPlayRoom && el.isActive()*/){
var tm=el.waitTimeStart-ts;
if(tm<=0)tm=0;
var nm='';
var usersIds=el.getRoomUsersIds();
if(el.roomName!=null && el.roomName.length>0)nm=el.roomName;
arr.push({name:nm,stream:el.stream.id,waitTime:tm,users:usersIds});
}
}


this.send(arr);

/*if(findRoom!=null){
th.send(2);
}else{*/

/*findAutoGameRoom(user,function(r){
if(r!=null){
var ts=getTimestamp();
var tm=r.waitTimeStart-ts;
if(tm<=0)tm=0;
th.send(1,tm,r.stream.id);
}else{
th.send(0);
}
}); */

//}
}
});






srv.addCmd('game.createRoom',function(ttt,name,mapidd,mapStr){
var th=this;
var user=this.getUserData("user");
var nameRoom='';
var mapid=0;
var mapObj=null;
if(arguments.length>2){
nameRoom=name;
if(nameRoom==null)nameRoom='';
mapid=parseInt(mapidd);
if(isNaN(mapid))mapid=0;
}
if(user!=null){

if(arguments.length>3){
if(typeof mapStr=='string'){
var ob2=jsonDecode(mapStr);
if(ob2!=null){
var ts=getTimestamp();
mapObj=parseMapObj({id:0,map:mapStr,mapLevel:0,user:user.id,status:1,time:ts});
}
}
}

var findRoom=null;
var findRoom2=null;
if(ttt=='create'){
for (var i = 0; i < gameRoomsList.length; i++) {
var el=gameRoomsList[i];
if(el!=null && el.map!=null && el.t2==1 && el.roomName==nameRoom){
findRoom=el;
break;
}
}
}
if(findRoom!=null){
th.send(2);
}else{
    
if(ttt=='join'){
for (var i = 0; i < gameRoomsList.length; i++) {
var el=gameRoomsList[i];
if(el!=null && el.map!=null && el.t2==1 && el.roomName==nameRoom){
findRoom2=el;
break;
}
}

if(findRoom2==null){
th.send(3);
return;
}

}



findAutoGameRoomByName(user,nameRoom,mapid,mapObj,function(r){
if(r!=null){
var ts=getTimestamp();
var tm=r.waitTimeStart-ts;
if(tm<=0)tm=0;
    
th.send(1,tm,r.stream.id);
}else{
th.send(0);
}
});    

}
}
});

srv.addCmd('admin.adminCmd',function(t,userid,arg1,arg2,arg3){
var th=this;
var user=th.getUserData("user");
if(user!=null && user.checkOriginalConnect(this) && UserMode.isSuperAdmin(user.mode)){
    
var getUser2=function(id,cb){
var u=AllUsersRoom.getUserByID(id);
if(u){
if(cb)cb(u);
}else{
getUsersObjByIds(null,[id],function(res){
var uObj=null;
if(res!=null && res.length>0)uObj=res[0];
if(cb)cb(uObj);
},0,true);
}
};
    
    
var cb3=function(tt,u){
var find1=null;
for (var i = 0; i < ModeUsersListV.length; i++) {
var el=ModeUsersListV[i];
if(el.id==u.id){
find1=el;
}
}

if(tt=='del'){
if(find1!=null){
find1.mode=u.mode;
if(u.mode==0){
for (var i = 0; i < ModeUsersListV.length; i++) {
var el=ModeUsersListV[i];
if(el.id==userid){
ModeUsersListV.splice(i,1);
}
}
}
}    
}else if(tt='add'){
if(find1==null){
ModeUsersListV.push({id:u.id,mode:u.mode})
}else{
find1.mode=u.mode;
}
}
};
    
if(t=='saveData'){
topM.updateDB();
saveAllDataSrv();
th.send(1);
}else if(t=='addModMaps'){
var u=AllUsersRoom.getUserByID(userid);
if(u!=null && !UserMode.isModeratorMaps(u.mode)){
var ts=getTimestamp();
u.mode=u.mode|USER_MODE_MOD_MAPS;
u.updateFieldDB('mode',u.mode);
/*u.modMapsMoneyTS=ts+(60*60*24*7);
u.updateFieldDB('modmaps_getmoney_time',u.modMapsMoneyTS);*/
u.sendUpdateUserInfo();
MainRoom.sendMessageEvent('addModMaps',u.id,0,[]);
th.send(1);

cb3('add',u);

}else{
th.send(0);
}
}else if(t=='removeModMaps'){
var u=AllUsersRoom.getUserByID(userid);
if(u!=null && UserMode.isModeratorMaps(u.mode)){
u.mode&=~USER_MODE_MOD_MAPS;
u.updateFieldDB('mode',u.mode);
u.sendUpdateUserInfo();
th.send(1);

cb3('del',u);

}else{
th.send(0);
}  
}



else if(t=='addModerator'){
var u=AllUsersRoom.getUserByID(userid);
if(u!=null && !UserMode.isModerator(u.mode)){
var ts=getTimestamp();
u.mode=u.mode|USER_MODE_MODERATOR;
u.updateFieldDB('mode',u.mode);
/*u.modGetMoneyTS=ts+(60*60*24*7);
u.updateFieldDB('mod_getmoney_time',u.modGetMoneyTS);*/
u.sendUpdateUserInfo();
ModRoom.addUser(u);
MainRoom.sendMessageEvent('addModerator',u.id,0,[]);
//MainRoom.sendPrivateMsg(systemUser,u,'Вы теперь модератор чата*clapping*');
th.send(1);
cb3('add',u);
}else{
th.send(0);
}
}else if(t=='removeModerator'){
getUser2(userid,function(u){
if(u!=null && UserMode.isModerator(u.mode)){
u.mode&=~USER_MODE_MODERATOR;
u.updateFieldDB('mode',u.mode);
u.sendUpdateUserInfo();
ModRoom.removeUser(u);
MainRoom.sendMessageEvent('removeModerator',u.id,0,[]);
th.send(1);
cb3('del',u);
}else{
th.send(0);
}
});
}else if(t=='updGiftsList'){
shopMaster.init(function(){
th.send(1);
AllUsersRoom.emitRoom('sendEvent','updGiftsList');
});
}else if(t=='updQuests1'){
shopMaster.initQuests1(function(){
th.send(1);
});
}else if(t=='updDress'){
dressMaster.init(function(){
th.send(1);
//var dressList=[];
//AllUsersRoom.emitRoom('sendEvent','updDressList',[dressList]);
});
}else if(t=='updAccessV'){
accessUsersMaster.reload(function(){
th.send(1);
});
}else if(t=='sendSystemMsg'){
var msgV=''+arg1;
if(msgV.length>0){
if(arg2 && typeof arg2=='string' && arg2.length>0){
var sysNick=''+arg2;
var u2=new User(null);
u2.parseObj({id:-2,nick:sysNick,mode:-2,sex:1,popular:6000,popularLevel:2,iconEmoji:1});
u2.sysMod=true;
MainRoom.sendSystemMessageUser(u2,msgV,true);
}else{
MainRoom.sendSystemMessage(msgV,true);
}
th.send(1);
}
}else if(t=='sendSystemHtmlMsg'){
var msgV=''+arg1;
if(msgV.length>0){
MainRoom.sendHtmlMessage(msgV,true);
th.send(1);
}
}else if(t=='sendNotifyA'){
var msgV=''+arg1;
if(msgV.length>0){
AllUsersRoom.emitRoom('sendEvent','notifyInfo1',[msgV]);
th.send(1);
}
}else if(t=='sendNotifyB'){
var msgV=''+arg1;
if(msgV.length>0){
AllUsersRoom.emitRoom('sendEvent','notifyInfoPopup',[msgV]);
th.send(1);
}
}else if(t=='sendNotifyC'){
var msgV=''+arg1;
if(msgV.length>0){
var idsArr=null;
if(arg2){
var s4=''+arg2;
if(s4!='all'){
idsArr=s4.split(',');
}
}

if(idsArr && idsArr.length>0){
for (var i = 0; i < idsArr.length; i++) {
var idd=castInt(idsArr[i]);
if(idd>0){
var u=AllUsersRoom.getUserByID(idd);
if(u)MainRoom.sendPrivateMsg(systemUser,u,msgV);
}
}   
}else{
var users=AllUsersRoom.users;
for (var i = 0; i < users.length; i++) {
var u=users[i];
if(u!=null){
MainRoom.sendPrivateMsg(systemUser,u,msgV);
}
}
}
th.send(1);
}
}else if(t=='mapsResetScores'){
mapsMaster.clearScores(function(){
th.send(1); 
});
}else if(t=='resetItems2'){
    
var allUsers=MainRoom.users;
for (var i = 0; i < allUsers.length; i++){
var u=allUsers[i];
if(u!=null){
u.actionNYLevel=0;
u.actionNYItems=0;
u.actionVal1=0;
}
}

mysql.query('UPDATE users SET actionNYLevel=?, actionNYItems=?, action_val1=?',[0,0,0],function(rows){
th.send(1);
});

}else if(t=='topPrizeHour'){
sendPrizeTop('hour');
th.send(1); 
}else if(t=='topPrizeDay'){
sendPrizeTop('day');
th.send(1); 
}else if(t=='updateMapsIds1'){
mapsMaster.isLoadMapsV1=true;
mapsMaster.loadMapsAllFunc1(function(){
mapsMaster.isLoadMapsV1=false;
th.send(1);
});
}else if(t=='updEventsList'){
eventsActionMaster.reload(function(){
th.send(1);
});
}else if(t=='sendUpdPage'){
var idsArr=null;
var args2=['sendEvent','refreshPage'];
if(arg1){
var s4=''+arg1;
if(s4!='all')idsArr=s4.split(',');
}

if(idsArr && idsArr.length>0){
for (var i = 0; i < idsArr.length; i++) {
var idd=castInt(idsArr[i]);
if(idd>0){
var u=AllUsersRoom.getUserByID(idd);
if(u)u.emit.apply(u,args2);
}
}
}else{
var users=AllUsersRoom.users;
for (var i = 0; i < users.length; i++) {
var u=users[i];
if(u!=null && u.id!=user.id){
u.emit.apply(u,args2);
}
}
}
th.send(1);
}else if(t=='sendGiftAllOnline' && typeof arg1!=='undefined'){
var giftid=parseInt(arg1);
if(isNaN(giftid))giftid=0;
var giftObj=shopMaster.getItemByItemIDAndType(giftid,ShopItemsType.GIFTS);
var giftObjInfo=null;
if(giftid in shopMaster.giftsObj)giftObjInfo=shopMaster.giftsObj[giftid];
if(giftObj!=null && giftObjInfo){
var txt1='';    
var users=MainRoom.users;
for (var i = 0; i < users.length; i++) {
var u=users[i];
if(u!=null){
(function(u){
if(u.id>0){
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,-2,u.id,function(res){
u.emit('userEvent','PresentUserGift',-2,giftObjInfo);
});
}
})(u);
}
}

if(users.length>0){
MainRoom.sendGiftAllUsersMessage(systemUser,[giftid],txt1);
}
    
    
th.send(1);
}else{
th.send(0);
}
 
}/*else if(t=='statsCmdsV'){
var arr=[];
for (var i = 0; i < cmdsArr.length; i++) {
var ob=cmdsArr[i];
arr.push([ob.name,ob.accessMode,ob.callCount]);
//arr.push({name:ob.name,access:ob.accessMode,callCount:ob.callCount});
}
th.send(arr);
}*/

else{
th.send(0);
}
}
},USER_MODE_SUPER_ADMIN);


srv.addCmd('admin.statsCmdsInfo',function(){
var th=this;
var user=th.getUserData("user");
if(user!=null && UserMode.isAdminModerator(user.mode)){
var arr=[];
for (var i = 0; i < cmdsArr.length; i++) {
var ob=cmdsArr[i];
arr.push([ob.name,ob.accessMode,ob.callCount]);
//arr.push({name:ob.name,access:ob.accessMode,callCount:ob.callCount});
}
th.send(arr);
}else{
th.send([]);
}
});

function getAccountsGuestIP(ip){
var a=[];
if(ip!=null){
var users=AllUsersRoom.users;
for (var i = 0; i < users.length; i++) {
var u=users[i];
if(u!=null && 'ip' in u && ip==u.ip){
if('isGuest' in u && u.isGuest)a.push(u);
}
}
}
return a;
}


function getLeftAccountsListIDSByUserID(id,cb){
var arr=[];
var obj1={};

getUsersObjByIds(null,[id],function(res){
var uObj=null;
if(res!=null && res.length>0)uObj=res[0];
if(uObj!=null){
var ip=''+uObj.ip;
var users=AllUsersRoom.users;
for (var i = 0; i < users.length; i++) {
var u=users[i];
if(u!=null && u.id!=id && 'ip' in u && ip.length>0 && ip==u.ip){
if((u.id in obj1)==false){
obj1[u.id]=1;
arr.push(u.id);
}
}
}

if(ip!=null && ip.length>0){
mysql.query('SELECT id, ip FROM users WHERE ip=?', [ip], function(rows) {
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
if(ip==el.ip && el.id!=id){
if((el.id in obj1)==false){
obj1[el.id]=1;
arr.push(el.id);
}
}
}
}

if(typeof cb!=='undefined')cb(arr);

});
}else{
if(typeof cb!=='undefined')cb(arr);
}

}else{
if(typeof cb!=='undefined')cb([]);
}
},0,true);
    
}

srv.addCmd('admin.setUserMoney',function(userid,moneyType,t,val){
var th=this;
var user=th.getUserData("user");
if(user!=null && user.checkOriginalConnect(this) && UserMode.isSuperAdmin(user.mode)){
var money=parseInt(val);

var u=AllUsersRoom.getUserByID(userid);
if(u!=null){
if(moneyType=='lapki'){
if(t==1){
u.plusMoney(money);
if(money>0){
u.emit('userEvent','adminMoneyAdd',money,'lapki');    
}

}else if(t==2){
u.money=money;
u.plusMoney(0);
}

th.send(1);
}else if(moneyType=='kosti'){
if(t==1){
u.plusKosti(money);
if(money>0){
u.emit('userEvent','adminMoneyAdd',money,'kosti');    
}
}else if(t==2){
u.kosti=money;
u.plusKosti(0);
}
th.send(1);
}
}else{
if(moneyType=='lapki'){
if(t==1){
plusMoneyUserByID(userid,money,function(){
th.send(1);
});    
}else if(t==2){
updateMoneyUserByID(userid,money,function(){
th.send(1);
});
}
}else if(moneyType=='kosti'){
if(t==1){
plusKostiUserByID(userid,money,function(){
th.send(1);
});    
}else if(t==2){
updateKostiUserByID(userid,money,function(){
th.send(1);
});
}
}
}
}else{
th.send(0);
}
},USER_MODE_SUPER_ADMIN);


srv.addCmd('admin.changeNick',function(userid,val){
var th=this;
var user=th.getUserData("user");
if(user!=null && user.checkOriginalConnect(this) && UserMode.isSuperAdmin(user.mode)){
var u=AllUsersRoom.getUserByID(userid);
if(u!=null){
var defNick='Игрок '+userid;
if(val==null)val=defNick
if(val.length<=0)val=defNick;
u.updateNick(val);
u.sendUpdateUserInfo();
th.send(1);
}else{
    
mysql.query('UPDATE users SET nick=? WHERE id=?', [val,userid], function(rows){
th.send(1);
});
    
}
}else{
th.send(0);
}
},USER_MODE_SUPER_ADMIN);


srv.addCmd('admin.eventsAPanel',function(t,arg1,arg2){
var th=this;
var user=th.getUserData("user");
if(user!=null && user.checkOriginalConnect(this) && UserMode.isSuperAdmin(user.mode)){
if(t=='get'){
eventsActionMaster.getListDB(function(arr){
th.send(arr,getTimestamp()); 
});
}else if(t=='add2'){
var obj=null;
if(arg1 && typeof arg1=='object')obj=arg1;

if(obj && 'name' in obj && obj.name && 'type' in obj && obj.type){
var ts=getTimestamp();
var start_ts=0;
var end_ts=0;
var dayTime=60*60*24;
var collid=0;
var name=obj.name;
var type=obj.type;
if('collid' in obj)collid=castInt(obj.collid);
if('startTime' in obj)start_ts=castInt(obj.startTime);

if(start_ts>0 && start_ts>=ts){
mysql.query('SELECT * FROM events_collections WHERE id=?', [collid], function(rows){
var el=null;
if(rows && rows.length>0)el=rows[0];
if(el){
var allDays=0;
var items=jsonDecode(el.items);
if(items && items.list && items.list.length>0)allDays=items.list.length;
if(allDays>0){
end_ts=start_ts+(dayTime*allDays);

mysql.query('INSERT INTO events_action (name,type,collectionid,start_ts,end_ts,create_time) VALUES (?,?,?,?,?,?)', [name,type,collid,start_ts,end_ts,ts], function(rows){
if(rows!=null && 'insertId' in rows){
var rowid=rows.insertId;
var ob={id:rowid,name:name,type:type,start_ts:start_ts,end_ts:end_ts,create_time:ts,is_start:0,is_end:0,num1:0,is_system:0,time_sec:0,lastday:0};

ob.collectionData={id:el.id,name:el.name,type:el.type,data:items};

eventsActionMaster.waitList.push(ob);
th.send('ok');
}else{
th.send('error','Ошибка при записи события.');
}
});

//th.send('ok');
}else{
th.send('error','Кол-во дней в коллекции 0');
}
}else{
th.send('error','Коллекция не найдена.');
}
});
}else{
th.send('error','Некорректная дата запуска.');
}

//console.log(collid,start_ts,obj)
/*mysql.query('INSERT INTO events_action (name,type,collectionid,start_ts,end_ts,create_time) VALUES (?,?,?,?,?,?)', [name,type,collid,start_ts,end_ts,ts], function(rows){
if(rows!=null && 'insertId' in rows){
var rowid=rows.insertId;
var ob={id:rowid,name:name,type:type,start_ts:start_ts,end_ts:end_ts,create_time:ts,is_start:0,is_end:0,num1:0,is_system:0,time_sec:0,lastday:0};
eventsActionMaster.waitList.push(ob);
th.send('ok');
}else{
th.send('error');
}
});*/
}else{
th.send('error');
}

}else if(t=='add'){
var tt=''+arg1;
var ev2=eventsActionMaster.findEventItemType(tt);
if(ev2==null){
var ts=getTimestamp();
/*if(tt=='egg'){
eventsActionMaster.add('Пасха',tt,ts,ts+(60*60*24*3));
th.send(true);
}*/

/*if(tt=='9may'){
var tm1=getTimestampByDate(5,8,0,0);
eventsActionMaster.add('9 мая',tt,tm1,tm1+(60*60*24*2));
//eventsActionMaster.add('9 мая',tt,ts,ts+(60*60*24*3));
th.send(true);
}*/
/*if(tt=='birthday'){
eventsActionMaster.add('День Рождения',tt,ts,ts+(60*60*24));
//eventsActionMaster.add('9 мая',tt,ts,ts+(60*60*24*3));
th.send(true);
}*/
/*if(tt=='shkola'){
eventsActionMaster.add('Школа',tt,ts,ts+(60*60*24*3));
//eventsActionMaster.add('9 мая',tt,ts,ts+(60*60*24*3));
th.send(true);
}*/

/*if(tt=='halloween'){
var tm1=getTimestampByDate(10,29,0,0);
//tm1=ts;
eventsActionMaster.add('Хэллоуин',tt,tm1,tm1+(60*60*24*3));
th.send(true);
}*/
/*if(tt=='feb'){
var days=_8martaDays.length;
var tm1=getTimestampByDate(02,22,0,0);
tm1=ts+15;
eventsActionMaster.add('23 февраля',tt,tm1,tm1+(60*60*24*days));
th.send(true);
}
else{*/
th.send(false);
//}
}else{
th.send(false);
}
}else if(t=='remove'){
var idd=0;
if(typeof arg1!=='undefined')idd=parseInt(arg1);
if(isNaN(idd))idd=0;
eventsActionMaster.removeByID(idd,function(res){
th.send(res);
});
}
}
});


srv.addCmd('user.testerGetMoney',function(t){
var th=this;
var user=th.getUserData("user");
if(arguments.length>0 && user!=null && user.checkOriginalConnect(this) && user.isTester()){
var price=priceTesterGetMoney;
var ts=getTimestamp();
var tm=0;
if(ts>=user.testerGetMoneyTS){
}else{
tm=user.testerGetMoneyTS-ts;
if(tm<=0)tm=0;
}
if(t==0){
th.send(1,{time:tm,money:price});
}else if(t==1){
if(tm<=0){
user.testerGetMoneyTS=ts+(60*60*24*30);
user.updateFieldDBRes('tester_getmoney_time',user.testerGetMoneyTS,function(rr){
if(rr){
user.plusKosti(price);
user.emit('userEvent','adminMoneyAdd',price,'kosti');
th.send(1);
}
});
}else{
th.send(0);
}
}
}else{
th.send(0);
}
});


srv.addCmd('mod.modCmd',function(t,userid,arg1,arg2,arg3){
var th=this;
var user=th.getUserData("user");
if(user!=null && user.checkOriginalConnect(this) && (UserMode.isSuperAdmin(user.mode) || UserMode.isModerator(user.mode) || UserMode.isModeratorMaps(user.mode) || UserMode.isModeratorM(user.mode) || UserMode.isModeratorMapsM(user.mode))){

var getUser2=function(id,cb){
var u=AllUsersRoom.getUserByID(id);
if(u){
if(cb)cb(u);
}else{
getUsersObjByIds(null,[id],function(res){
var uObj=null;
if(res!=null && res.length>0)uObj=res[0];
if(cb)cb(uObj);
},0,true);
}
};

var cb3=function(tt,u){
var find1=null;
for (var i = 0; i < ModeUsersListV.length; i++) {
var el=ModeUsersListV[i];
if(el.id==u.id){
find1=el;
}
}

if(tt=='del'){
if(find1!=null){
find1.mode=u.mode;
if(u.mode==0){
for (var i = 0; i < ModeUsersListV.length; i++) {
var el=ModeUsersListV[i];
if(el.id==userid){
ModeUsersListV.splice(i,1);
}
}
}
}    
}else if(tt='add'){
if(find1==null){
ModeUsersListV.push({id:u.id,mode:u.mode})
}else{
find1.mode=u.mode;
}
}
};

if(t=='addModMaps'){
getUser2(userid,function(u){
if(u!=null){
var v2=false;
if(UserMode.isSuperAdmin(user.mode)){
    
if(arg1=='m'){
if(UserMode.isModeratorMaps(u.mode))u.mode&=~USER_MODE_MOD_MAPS;
if(UserMode.isModeratorMapsM(u.mode))u.mode&=~USER_MODE_MOD_MAPS_M;
u.mode=u.mode|USER_MODE_MOD_MAPS_M;
v2=true;
}else{
if(!UserMode.isModeratorMaps(u.mode)){
u.mode=u.mode|USER_MODE_MOD_MAPS;
if(UserMode.isModeratorMapsM(u.mode))u.mode&=~USER_MODE_MOD_MAPS_M;
v2=true;
}
}

}else if(UserMode.isModeratorMaps(user.mode)){
if(!UserMode.isModeratorMaps(u.mode) && !UserMode.isModeratorMapsM(u.mode)){
u.mode=u.mode|USER_MODE_MOD_MAPS_M;
v2=true;
arg1='m';
}
}
if(v2){
var arr1=[];
if(arg1=='m')arr1.push('m');
var ts=getTimestamp();
u.updateFieldDB('mode',u.mode);
/*u.modMapsMoneyTS=ts+(60*60*24*7);
u.updateFieldDB('modmaps_getmoney_time',u.modMapsMoneyTS);*/
u.sendUpdateUserInfo();
ModRoom.addUser(u);
MainRoom.sendMessageEvent('addModMaps',u.id,0,arr1);

addMailMsg(user.id,u.id,'назначение на должность img://modMapsIcon');

th.send(1);
cb3('add',u);
}else{
th.send(0);
}
}else{
th.send(0);
}
});
}else if(t=='removeModMaps'){
getUser2(userid,function(u){
if(u!=null){
var v2=false;
if(UserMode.isSuperAdmin(user.mode)){ // администратор может полностью снимать с должности
if(UserMode.isModeratorMaps(u.mode)){
u.mode&=~USER_MODE_MOD_MAPS;
v2=true;
}
if(UserMode.isModeratorMapsM(u.mode)){
u.mode&=~USER_MODE_MOD_MAPS_M;
v2=true;
}
}else if(userid!=user.id && UserMode.isModeratorMaps(user.mode)){ // старшие модераторы могут снимать только младших модераторов
if(UserMode.isModeratorMapsM(u.mode)){
u.mode&=~USER_MODE_MOD_MAPS_M;
v2=true;
}
}

if(v2){
u.updateFieldDB('mode',u.mode);
u.sendUpdateUserInfo();
ModRoom.removeUser(u);
th.send(1);
cb3('del',u);
MainRoom.sendMessageEvent('removeModMaps',u.id,0);

addMailMsg(user.id,u.id,'снятие с должности img://modMapsIcon');

}else{
th.send(0);
}
}else{
th.send(0);
}
});
}else if(t=='addModerator'){
getUser2(userid,function(u){    
if(u!=null){
var v2=false;
if(UserMode.isSuperAdmin(user.mode)){

if(arg1=='m'){
if(UserMode.isModerator(u.mode))u.mode&=~USER_MODE_MODERATOR;
if(UserMode.isModeratorM(u.mode))u.mode&=~USER_MODE_MODERATOR_M;
u.mode=u.mode|USER_MODE_MODERATOR_M;
v2=true;
}else{
if(!UserMode.isModerator(u.mode)){
u.mode=u.mode|USER_MODE_MODERATOR;
if(UserMode.isModeratorM(u.mode))u.mode&=~USER_MODE_MODERATOR_M;
v2=true;
}
}
/*if(!UserMode.isModerator(u.mode)){
u.mode=u.mode|USER_MODE_MODERATOR;
if(UserMode.isModeratorM(u.mode))u.mode&=~USER_MODE_MODERATOR_M;
v2=true;
}*/
}else if(UserMode.isModerator(user.mode)){
if(!UserMode.isModerator(u.mode) && !UserMode.isModeratorM(u.mode)){
u.mode=u.mode|USER_MODE_MODERATOR_M;
v2=true;
arg1='m';
}
}
if(v2){
var arr1=[];
if(arg1=='m')arr1.push('m');
var ts=getTimestamp();
u.updateFieldDB('mode',u.mode);

/*u.modGetMoneyTS=ts+(60*60*24*7);
u.updateFieldDB('mod_getmoney_time',u.modGetMoneyTS);*/
u.sendUpdateUserInfo();
ModRoom.addUser(u);
MainRoom.sendMessageEvent('addModerator',u.id,0,arr1);
//MainRoom.sendPrivateMsg(systemUser,u,'Вы теперь модератор чата*clapping*');

th.send(1);
cb3('add',u);

addMailMsg(user.id,u.id,'назначение на должность img://modChatIcon');

}else{
th.send(0);
}
}else{
th.send(0);
}
});
/*else if(t=='addModerator'){
var u=AllUsersRoom.getUserByID(userid);
if(u!=null && !UserMode.isModerator(u.mode)){
var ts=getTimestamp();
u.mode=u.mode|USER_MODE_MODERATOR;
u.updateFieldDB('mode',u.mode);
u.modGetMoneyTS=ts+(60*60*24*7);
u.updateFieldDB('mod_getmoney_time',u.modGetMoneyTS);
u.sendUpdateUserInfo();
ModRoom.addUser(u);
MainRoom.sendMessageEvent('addModerator',u.id,0,[]);
//MainRoom.sendPrivateMsg(systemUser,u,'Вы теперь модератор чата*clapping*');
th.send(1);
cb3('add',u);
}else{
th.send(0);
}*/
}else if(t=='removeModerator'){
getUser2(userid,function(u){
if(u!=null){
var v2=false;
if(UserMode.isSuperAdmin(user.mode)){ // администратор может полностью снимать с должности
if(UserMode.isModerator(u.mode)){
u.mode&=~USER_MODE_MODERATOR;
v2=true;
}
if(UserMode.isModeratorM(u.mode)){
u.mode&=~USER_MODE_MODERATOR_M;
v2=true;
}
}else if(userid!=user.id && UserMode.isModerator(user.mode)){ // старшие модераторы могут снимать только младших модераторов
if(UserMode.isModeratorM(u.mode)){
u.mode&=~USER_MODE_MODERATOR_M;
v2=true;
}
}

if(v2){
u.updateFieldDB('mode',u.mode);
u.sendUpdateUserInfo();
ModRoom.removeUser(u);
MainRoom.sendMessageEvent('removeModerator',u.id,0,[]);
th.send(1);
cb3('del',u);

addMailMsg(user.id,u.id,'снятие с должности img://modChatIcon');

}else{
th.send(0);
}
}else{
th.send(0);
}
});
}
else if(t=='getLeftAccountsID'){
if(UserMode.isSuperAdmin(user.mode) || UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode) || UserMode.isModeratorMaps(user.mode)){
getLeftAccountsListIDSByUserID(userid,function(arr){
th.send(arr);
});
}else{
th.send([]);
}
}else if(t=='getHistoryMiniChat'){
var res2=false;
if(user.mode>0)res2=true;
if(res2){
getUsersObjByIds(null,[userid],function(res){
var uObj=null;
if(res!=null && res.length>0)uObj=res[0];
if(uObj!=null){
var ar2=[];

var res3=false;
if(UserMode.isSuperAdmin(user.mode) || UserMode.isModerator(user.mode)/* || UserMode.isModeratorMaps(user.mode)*/){
res3=true;
}else if(UserMode.isModeratorM(user.mode)/* && uObj.mode==0*/){
res3=true;
}

var cb7=function(){
mysql.query('SELECT * FROM minichat_history WHERE user=? ORDER BY time DESC LIMIT ?,?', [userid,0,maxMiniChatMsgsHistory], function(rows){
var ar3=[];
if(rows && rows.length>0){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
ar3.push({time:el.time,msg:el.txt});
}
}
th.send(ar3);
});
};

if(res3){

updateMiniChatMsgs(cb7);

}else{
th.send([]);
}

/*if(res3 && uObj.miniChatMsgs!=null){
for (var i = uObj.miniChatMsgs.length - 1; i >= 0; i--) {
ar2.push(uObj.miniChatMsgs[i])
}
}
//if(!res3)ar2.push({});
th.send(ar2);*/



}else{
th.send([]);
}
},0,true);
}else{
th.send([]);
}   

}else if(t=='getHistoryMiniChatPage'){
var res2=false;
if(user.mode>0)res2=true;
if(res2){
    
var page=castInt(arg1);
var limit=30;
var pageObj=null;
var uObj=null;
var query='minichat_history WHERE user=?';
var ar2=[];

var res3=false;
if(UserMode.isSuperAdmin(user.mode) || UserMode.isModerator(user.mode)/* || UserMode.isModeratorMaps(user.mode)*/){
res3=true;
}else if(UserMode.isModeratorM(user.mode)/* && uObj.mode==0*/){
res3=true;
}

var cb8=function(pp){
var arr4=[userid,pp,limit];
if(userid==0)arr4=[pp,limit];
mysql.query('SELECT * FROM '+query+' ORDER BY time DESC LIMIT ?,?', arr4, function(rows){
var ar3=[];
if(rows && rows.length>0){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
ar3.push({user:el.user,time:el.time,msg:el.txt});
}
}
var acuObj=null;
if(uObj)acuObj=uObj.getACUObj1(0);
th.send(acuObj,ar3,pageObj);
});
};

var cb7=function(){
if(page>1){
var pp=(page-1)*limit;
cb8(pp);
}else{
var arr5=[]
if(userid!=0)arr5.push(userid);
mysql.query('SELECT COUNT(*) as count FROM '+query, arr5,function(rows){
if(rows && rows.length>0){
var ell=rows[0];
var total_results=ell.count;
var total_pages=Math.ceil(total_results/limit);
if(page>total_pages)page=total_pages;
var pp=(page-1)*limit;
pageObj={total:total_results,pages:total_pages};
cb8(pp);
}
});
}

};
    
if(userid==0){
query='minichat_history';
if(res3){
updateMiniChatMsgs(cb7);
}else{
th.send([]);
}
}else{
    
getUsersObjByIds(null,[userid],function(res){
//var uObj=null;
if(res!=null && res.length>0)uObj=res[0];
if(uObj!=null){
if(res3){
updateMiniChatMsgs(cb7);
}else{
th.send([]);
}
}else{
th.send([]);
}
},0,true);
}
}else{
th.send([]);
}   

}else if(t=='chatHistory'){
if(UserMode.isModerator(user.mode) && arg1){
var dt=''+arg1;
getChatHistoryDate(dt,function(ss){
if(ss){
dt=dt.split('.').join('_');
var keyQ='pTxgMw9awKKHm99PMBbA';
var fileNm='history_'+dt+'_'+md5(dt+'_'+keyQ)+'.html';

var path2=pathSaveHistoryMsgsFileH+'/'+fileNm;
try{
fs.writeFileSync(path2,ss);
th.send(1,fileNm);
var s3=dt.split('_').join('.');
addMailMsg(0,user.id,'запрос истории чата за '+s3);

}catch(e){
th.send(0);
}

}else{
th.send(0);
}
});
}else{
th.send(0);
}

}else if(t=='getUserInfoOther'){

mysql.query('SELECT id, last_active, dogsCount, mapLevel, actionItemsNums, reg_time, nickRainbow FROM users WHERE id=?', [userid], function(rows) {
var uObj=null;
if(rows!=null && rows.length>0){
uObj=rows[0];
}

if(uObj!=null){
var arr=[];

var u=AllUsersRoom.getUserByID(userid);
if(u!=null){
uObj['dogsCount']=u.dogsCount;
uObj['mapLevel']=u.mapLevel;
uObj['actionItemsNums']=u.actionItemsNums;
uObj['nickRainbow']=u.nickRainbow;
}

arr.push({k:'reg_time',v:uObj['reg_time']});
arr.push({k:'dogsCount',v:uObj['dogsCount']});
arr.push({k:'mapLevel',v:uObj['mapLevel']});
arr.push({k:'actionItemsNums',v:uObj['actionItemsNums']});

var q1='нет';
if(uObj['nickRainbow']==1)q1='да';
arr.push({k:'nickRainbow',v:q1});

arr.push({k:'last_active',v:uObj['last_active']});
th.send(arr);
}else{
th.send([]);
}

});

}
}
});

srv.addCmd('mod.getBanInfo',function(userid){
var idd=0;
var th=this;
var vv=null;
if(arguments.length>0)idd=parseInt(userid);
if(isNaN(idd))idd=0;
var user=this.getUserData("user");
if(user!=null && user.checkOriginalConnect(this) && (UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode))){
getUsersObjByIds(user,[idd],function(res){
var uObj=null;
if(res!=null && res.length>0)uObj=res[0];
if(uObj!=null){
vv=getBanUserInfo(uObj);
}
th.send(vv);
},user.mode,true);
}else{
th.send(vv);   
}
});


srv.addCmd('mod.kickUser',function(userid){
var th=this;
var user=th.getUserData("user");
if(user!=null && user.checkOriginalConnect(this) && UserMode.isModerator(user.mode)){
var u=AllUsersRoom.getUserByID(userid);
if(u!=null && u.id>0){
u.allDisconnect();

if(ModRoom!=null)ModRoom.sendMsgByUser(user,null,'кикнут id '+userid+' "'+u.nick+'"','#FFCC00');
//if(SystemRoom!=null)SystemRoom.sendMsgByUser(user,null,'кикнут id '+userid+' "'+u.nick+'"','#FFCC00');

th.send(1);
}else{
th.send(0);
}
}else{
th.send(0);
}
},USER_MODE_MODERATOR);

srv.addCmd('mod.getMoneyMod',function(t){
var th=this;
var user=th.getUserData("user");
if(arguments.length>0 && user!=null && user.checkOriginalConnect(this) && (UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode))){
var price=moneyGetModInfo.moder;
if(UserMode.isModeratorM(user.mode))price=moneyGetModInfo.moderM;
var ts=getTimestamp();
var tm=0;
if(ts>=user.modGetMoneyTS){
}else{
tm=user.modGetMoneyTS-ts;
if(tm<=0)tm=0;
}
if(t==0){
th.send(1,{time:tm,money:price});
}else if(t==1){
if(tm<=0){
user.modGetMoneyTS=ts+(60*60*24);
user.updateFieldDBRes('mod_getmoney_time',user.modGetMoneyTS,function(rr){
if(rr){
user.plusKosti(price);
user.emit('userEvent','adminMoneyAdd',price,'kosti');
th.send(1);
}
});
}else{
th.send(0);
}
}
}else{
th.send(0);
}
});


srv.addCmd('mod.getMoneyModMaps',function(t){
var th=this;
var user=th.getUserData("user");
if(arguments.length>0 && user!=null && user.checkOriginalConnect(this) && (UserMode.isModeratorMaps(user.mode) || UserMode.isModeratorMapsM(user.mode))){
var price=moneyGetModInfo.maps;
if(UserMode.isModeratorMapsM(user.mode))price=moneyGetModInfo.mapsM;

var ts=getTimestamp();
var tm=0;
if(ts>=user.modMapsMoneyTS){
}else{
tm=user.modMapsMoneyTS-ts;
if(tm<=0)tm=0;
}
if(t==0){
th.send(1,{time:tm,money:price});
}else if(t==1){
if(tm<=0){
user.modMapsMoneyTS=ts+(60*60*24);
user.updateFieldDBRes('modmaps_getmoney_time',user.modMapsMoneyTS,function(rr){
if(rr){
user.plusKosti(price);
user.emit('userEvent','adminMoneyAdd',price,'kosti');
th.send(1);
}
});
}else{
th.send(0);
}
}
}else{
th.send(0);
}
});

srv.addCmd('mod.changeNickUser',function(userid){
var th=this;
var user=th.getUserData("user");
if(user!=null && user.checkOriginalConnect(this) && (UserMode.isModerator(user.mode) || UserMode.isModeratorM(user.mode)) && userid>0){
var nickV='Игрок '+userid;
var u=AllUsersRoom.getUserByID(userid);
if(u!=null){
if(u.nick!=nickV){
var lastNick=u.nick;
u.updateNick(nickV);
u.sendUpdateUserInfo();
th.send(1);

if(ModRoom!=null)ModRoom.sendMsgByUser(user,null,'изменён ник у id '+userid+', с '+lastNick+' на '+nickV,'#FFCC00');
//if(SystemRoom!=null)SystemRoom.sendMsgByUser(user,null,'изменён ник у id '+userid+', с '+lastNick+' на '+nickV,'#FFCC00');

addMailMsg(user.id,userid,'ник изменён на стандартный');

statsUsers.plusCount('mod_nickchange',user.id);

}else{
th.send(2);    
}
}else{

getUsersObjByIds(null,[userid],function(res){
var uObj=null;
if(res!=null && res.length>0)uObj=res[0];
if(uObj!=null){
if(uObj.nick!=nickV){
var lastNick=uObj.nick;
uObj.updateNick(nickV);
th.send(1);
if(ModRoom!=null)ModRoom.sendMsgByUser(user,null,'изменён ник у id '+userid+', с '+lastNick+' на '+nickV,'#FFCC00');
//if(SystemRoom!=null)SystemRoom.sendMsgByUser(user,null,'изменён ник у id '+userid+', с '+lastNick+' на '+nickV,'#FFCC00');

addMailMsg(user.id,userid,'ник изменён на стандартный');

statsUsers.plusCount('mod_nickchange',user.id);

}else{
th.send(2);
}
}else{
th.send(0);
}
},0,true);
}
}else{
th.send(0);
}
});

srv.addCmd('user.saveLogin',function(v){
var th=this;
var user=this.getUserData('user');
if(user!=null && arguments.length>0){
var loginV=''+v;
if(loginV.length>2 && user.login && user.login.length>3 && user.login.substr(0,3)=='reg'){
isUserLoginExists(loginV,function(vv){
if(vv){
th.send('exists');
}else{
user.updateFieldDBRes('login',loginV,function(v){
if(v){
user.login=loginV;
th.send('ok');
}else{
th.send('error');
}
});
}
});
}
}else{
th.send('error');
}
});


srv.addCmd('user.setIconPopular',function(v){
var th=this;
var user=this.getUserData('user');
if(user!=null && arguments.length>0){
v=castInt(v);
var res='err';
/*if(v==0 && user.popularIcon!=0){
res='ok';
}else{*/
var arr=getInfoPopularIds(user.popularLevel,user.popular);
for (var i = 0; i < arr.length; i++) {
var el=arr[i];
if(el==v && v!=user.popularIcon)res='ok';
}
//}
if(res=='ok'){
user.popularIcon=v;
user.sendUpdateUserInfoCurID();
}
th.send(res);
}
});


srv.addCmd('world.create',function(mapid,mapStr){
var user=this.getUserData("user");
var th=this;
if(user!=null && arguments.length>0){
mapid=castInt(mapid);

if(!user.checkAccessM('create_world')){
th.send(0);
return;
}

var map='';
if(mapStr!=null && mapStr.length>0){
map=mapStr;
mapid=0;
}

var isOrig=user.checkOriginalConnect(this);
if(isOrig){
worldMapsMaster.findWorldMapByUserID(user.id,function(ob){
if(ob!=null){
var rr=true;
if(map && map.length>0xFFFF){
rr=false;
}
if(rr){
    
var mapObj=jsonDecode(map);
var mapCl=null;
if(mapObj){
mapCl=new GameMap();
mapCl.parseMap(mapObj);
}

if(mapCl){
var matText=mapCl.checkTextMat();
if(matText){
th.send(2);
return;
}
}    
    
mysql.query('UPDATE worldMaps SET mapid=?, map=? WHERE id=?', [mapid,map,ob.id], function(rows){
th.send(ob.id);
});
}else{
th.send(0);
}
}else{
var name='Без имени';
var ts=getTimestamp();
mysql.query('INSERT INTO worldMaps (name,type,mapid,user,map,time) VALUES (?,?,?,?,?,?)', [name,'',mapid,user.id,map,ts], function(rows){
if(rows!=null && 'insertId' in rows){
var rowid=castInt(rows.insertId);
th.send(rowid);
}else{
th.send(0);
}
});
}
});
}else{
th.send(0);
}
}
});

srv.addCmd('shop.checkAccessPayVM2',function(){
var th=this;
var user=th.getUserData("user");
if(user!=null){
var isOrig=user.checkOriginalConnect(this);
if(isOrig && user.vm2AuthLoginPass!=null){
th.send(1);
}else{
th.send(0);
}
}
});

srv.addCmd('shop.buyItemVM2',function(itemid){
var th=this;
var user=th.getUserData("user");
if(user!=null){
var itemm=0;
var errStr='error';
if(arguments.length>0)itemm=parseInt(itemid);
if(isNaN(itemm))itemm=0;
var item=getPaymentItemByID(itemm);
var isOrig=user.checkOriginalConnect(this);
if(item!=null && item.votes>0 && isOrig && user.vm2AuthLoginPass!=null){
var login=user.vm2AuthLoginPass.login;
var pass=user.vm2AuthLoginPass.pass;
var price=item.votes;
apiVM2Site({login:login,pass:pass,c:'pay',price:price},function(ob){
if(typeof ob=='object'){
    
}else{
ob={};
}
var oo=ob;
if(oo!=null && 'status' in oo){
if(oo.status==1){
if(item.type=='kosti'){
jobMaster.updateItemObj({type:'addKosti',user:user.id,value:item.price});
}else{
jobMaster.updateItemObj({type:item.type,user:user.id});
}

th.send('ok');
}else if(oo.status==0){
th.send('no_money');
}else if(oo.status==-1){
//jobMaster.updateItemObj({type:item.type,user:user.id});
th.send('no_access');
}else{
th.send(errStr);
}
}else{
th.send(errStr);
}
});

}else{
th.send(errStr);
}
}
});

srv.addCmd('action1',function(eventid,t){
var th=this;
var user=this.getUserData("user");
if(user!=null){
var evid=castInt(eventid);

var findEvent=eventsActionMaster.findEventByID(evid);
var isEndEv=false;
var evInfo=null;
var dayObj=null;
var n5=0;
if(findEvent && eventsActionMaster.isEnd(findEvent))isEndEv=true;
if(findEvent){
evInfo=getCurrentEventT2(findEvent);
n5=findEvent.num1;
if(evInfo && evInfo.type=='evDay'){
if(evInfo.days && n5<evInfo.days.length)dayObj=evInfo.days[n5];
}
}

if(t=='info'){
var ts=getTimestamp();
if(findEvent && !isEndEv && dayObj){
var endTime=0;
if(ts<findEvent.end_ts)endTime=findEvent.end_ts-ts;
if(endTime<=0)endTime=0;
var nn=user.actionNYItems;
var allLevels=dayObj.list.length;
var curDay=n5+1;
var info=null;
var titleV=dayObj.name;
var nm2=''+evInfo.name;

if(user.actionNYLevel<allLevels){
var ob=dayObj.list[user.actionNYLevel];
info={n:ob.n};
}

th.send({status:'ok',nums:nn,level:user.actionNYLevel,allLevels:allLevels,info:info,name:titleV,title:nm2,curDay:curDay,endTime:endTime,end_ts:findEvent.end_ts});
}else{
var waitEv=eventsActionMaster.findWaitEventByID(evid);
if(waitEv){
th.send({status:'wait',title:waitEv.name,ts:ts,start_ts:waitEv.start_ts,end_ts:waitEv.end_ts});
}else{
th.send(null);
}
}
}else if(t=='b1'){
/*var txt=null;
if(findEvent && !isEndEv && user.actionVal1==0){
user.actionVal1=1;
var v=30000;
user.plusOpyt(v);
txt='Вы нашли тайный бонус, получено '+v+' опыта :)';
}
th.send(txt);*/
}else if(t=='run'){

var res='error';
var txt=null;

if(findEvent && !isEndEv && dayObj){
var allLevels=dayObj.list.length;

if(user.actionNYLevel<allLevels){
var ob=dayObj.list[user.actionNYLevel];
var vv=ob.v;
if(user.actionNYItems>=ob.n){
    
/*if(user.id==2490){
var tm1=getTimestampByDate(5,1,0,0);
if(getTimestamp()<tm1){
th.send({v:'error',txt:'Вы не можете участвовать в этом событии.'})
return
}
}*/
if(user.id==27895){
var tm1=getTimestampByDate(5,9,0,0);
if(getTimestamp()<tm1){
th.send({v:'error',txt:'Доступ к событию ограничен.<br />Вы не можете участвовать в этом событии.<br />Причина: нарушения, и пожелание смерти администрации.'})
return
}
}
    
user.actionNYItems-=ob.n;
user.actionNYLevel+=1;
if(ob.type=='gift'){

var giftObj=shopMaster.getItemByItemIDAndType(vv,ShopItemsType.GIFTS);
if(giftObj!=null){
txt='Подарок - '+giftObj.name;
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,vv,-2,user.id,function(res){
});
}

}else{
txt='Приз: '+getEvDayPrizeTitle(ob.type,vv);
if(ob.type=='opyt'){
user.plusOpyt(vv);
}else if(ob.type=='popular'){
user.plusPopular(vv);
}else if(ob.type=='vip1'){
var vipTimeEnd=user.vip_end;
var ts=getTimestamp();
if(ts>=user.vip_end)vipTimeEnd=ts;
user.vip_end=vipTimeEnd+(60*60*24);
if(user.vip!=1){
user.vip=1;
user.updateFieldDB('vip',user.vip);
user.sendUpdateUserInfoCurID();
}
}else if(ob.type=='vip7'){
var vipTimeEnd=user.vip_end;
var ts=getTimestamp();
if(ts>=user.vip_end)vipTimeEnd=ts;
user.vip_end=vipTimeEnd+(60*60*24*7);
if(user.vip!=1){
user.vip=1;
user.updateFieldDB('vip',user.vip);
user.sendUpdateUserInfoCurID();
}
}else if(ob.type=='nickRainbow'){
var ts=getTimestamp();
var vTimeEnd=user.nickRainbow_end;
if(ts>=user.nickRainbow_end)vTimeEnd=ts;
user.nickRainbow_end=vTimeEnd+(60*60*24*7);
user.nickRainbow=1;
user.updateFieldDB('nickRainbow',user.nickRainbow);
MainRoom.emitRoom('nickRainbowEvent',user.id,1);
user.sendUpdateUserInfoCurID();
}else if(ob.type=='nickColor'){
var ts=getTimestamp();
var vTimeEnd=user.nickColor_end;
if(ts>=user.nickColor_end)vTimeEnd=ts;
user.nickColor_end=vTimeEnd+(60*60*24*7);
user.nickColor_pos=-2;
user.sendUpdateUserInfoCur();
MainRoom.sendPrivateMsg(systemUser,user,'Теперь вы можете менять цвет ника');
}else if(ob.type=='lapki'){
user.plusMoney(vv);
}else if(ob.type=='kosti'){
user.plusKosti(vv);
}
}
res='ok';
}else{
res='no';
}
}
}
th.send({v:res,txt:txt});

}

}
});


/*st.waitTime=5;
st.time=10;
st.setMinMaxClients(1,7);
st.start();*/
}
//module.exports=AppData;

//var lvl=levelsMaster.GetLevelByOpyt(5000);
//console.log('lvl',lvl);;

var app=null;
//var AnimalsGameServer=require('./AnimalsGameServer');
srv = new AnimalsGameServer();
//srv=new AnimalsGameServer.Server();
if(!isWin)srv.Debug=false;
srv.type='ws';
srv.isBinary=1;
var dtHandler=srv.dataHandler;
srv.dataHandler=function(socket,ar){
var message=null;
try{
if(ar instanceof Buffer){
var baa=new ByteArray(ar);
message=baa.readObject();
}else if(typeof ar=='string'){
message=jsonDecode(ar);
}
var appName=message.shift();
dtHandler.apply(this,[socket,message]);
}catch(e){
console.log(e);
}
};
//srv.init('app',9050);

//srv.httpsObj={type:'letsencrypt',path:'/etc/letsencrypt/live/ag6.ru'};

setTimeout(function(){
app=new AppData();
app.init({CmdsMaster:CmdsMaster,log:trace,modules:{MysqlMaster:MysqlMaster}});    
},1000);
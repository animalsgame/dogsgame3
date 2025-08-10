function RequestsUserMaster(){}
RequestsUserMaster.prototype.updateRequestStatusByID=function(id,t){
mysql.query('UPDATE requestsList SET status=? WHERE uniq=?', [t,id], function(rows){
});
}

RequestsUserMaster.prototype.getRequestUserByReqID=function(id,userid,cb){
mysql.query('SELECT * FROM requestsList WHERE uniq=? AND user=? AND active=?', [id,userid,1], function(rows) {
if(rows!=null){
if(rows.length>0){
cb(rows[0]);
}else{
cb(null);
}
}else{
cb(null);
}
});
}

RequestsUserMaster.prototype.getUniqID=function(cb){
var th=this;
var rnd=Math.floor(Math.random()*1000000);
mysql.query('SELECT * FROM requestsList WHERE uniq=?', [rnd], function(rows) {
if(rows!=null){
if(rows.length>0){
th.getUniqID(cb);
}else{
cb(rnd);
}
}
});
}

RequestsUserMaster.prototype.getRequestsListUser=function(userid,cb){
mysql.query('SELECT * FROM requestsList WHERE user=? AND active=? AND status=?', [userid,1,0], function(rows) {
var arr=[];
var ts=getTimestamp();
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
if(ts<el['expire']){
var expireSec=el['expire']-ts;
if(expireSec<=0)expireSec=0;
el['expire']=expireSec;
if(expireSec>0){
arr.push(el);
}
}
}
}
cb(arr);
});
}



RequestsUserMaster.prototype.add=function(type,txt,user,expirets,data){
var ts=getTimestamp();
if(typeof data=='undefined')data='';
this.getUniqID(function(uniqid){
mysql.query('INSERT INTO requestsList (uniq,type,txt,data,user,time,expire,status,active) VALUES (?,?,?,?,?,?,?,?,?)', [uniqid,type,txt,''+data,user,ts,expirets,0,1], function(rows){

});
});
}

RequestsUserMaster.prototype.del=function(id,cb){
mysql.query('DELETE FROM requestsList WHERE uniq=?', [id], function(rows){
if(typeof cb=='function')cb();
});
}

RequestsUserMaster.prototype.update=function(ob){
var th=this;
if(ob!=null){
var id=ob.id;
var type=ob.type;
var data=ob.data;
var user=ob.user;
var u=AllUsersRoom.getUserByID(user);
if(type=='requestModerator'){
if(!UserMode.isModerator(u.mode)){
u.mode|=USER_MODE_MODERATOR;
u.sendUpdateUserInfo();
u.updateFieldDB('mode',u.mode);
}

}else if(type=='requestTester'){
if(!u.isTester()){
u.tester=1;
u.updateFieldDB('tester',1);
u.sendUpdateUserInfoCur();

MainRoom.sendMessageEvent('requestTester',u.id,0,[]);

MainRoom.sendPrivateMsg(systemUser,u,'Вы стали тестером!');
}
}

else if(type=='addLapkiFree'){
var money=parseInt(data);
if(isNaN(money))money=0;
if(money>0){
u.plusMoney(money);
}
}else if(type=='addKostiFree'){
var money=parseInt(data);
if(isNaN(money))money=0;
if(money>0){
u.plusKosti(money);
//u.connect.emit('buyMoneyUser','kosti',money);
}
}else if(type=='addHealth'){
var vv=parseInt(data);
if(isNaN(vv))vv=0;
if(vv>0){
u.plusHealth(vv);
}
}else if(type=='nickRainbow'){
u.nickRainbow=1;
u.updateFieldDB('nickRainbow',1);
u.sendUpdateUserInfo();
var expireV=parseInt(data);
eventsTimeMaster.add('nickRainbowCancel',expireV,u.id);
}
}
}
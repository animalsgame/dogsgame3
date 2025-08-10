function JobMaster(){
}

JobMaster.prototype.add=function(type,user,v,tt){
if(typeof tt=='undefined')tt=0;
mysql.query('INSERT INTO job (type,user,value,t1) VALUES (?,?,?,?)', [type,user,v,tt], function(rows){
});
}

JobMaster.prototype.del=function(id,cb){
if(id!=0){
mysql.query('DELETE FROM job WHERE id=?', [id], function(rows){
if(typeof cb=='function')cb();
});
}
}

JobMaster.prototype.update=function(){
var th=this;
mysql.query('SELECT * FROM job', [], function(rows){
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var ob=rows[i];
th.updateItemObj(ob);
}
}
});
}

JobMaster.prototype.updateItemObj=function(ob){
var th=this;
if(ob!=null){
var id=0;
if('id' in ob)id=ob.id;
var type=ob.type;
var user=ob.user;
var t1='';
if('t1' in ob)t1=ob.t1;

if(type=='addAdminLapki'){
var money=parseInt(ob.value);
if(isNaN(money))money=0;
var u=AllUsersRoom.getUserByID(user);
if(u!=null){
u.plusMoney(money);
u.emit('userEvent','adminMoneyAdd',money,'lapki');    
th.del(id);
}
}else if(type=='addAdminKosti'){
var money=parseInt(ob.value);
if(isNaN(money))money=0;
var u=AllUsersRoom.getUserByID(user);
if(u!=null){
u.plusKosti(money);
u.emit('userEvent','adminMoneyAdd',money,'kosti');    
th.del(id);
}
}else if(type=='addKosti'){
var money=parseInt(ob.value);
if(isNaN(money))money=0;

var u=AllUsersRoom.getUserByID(user);
if(u!=null){
u.plusKosti(money);
u.emit('buyMoneyUser','kosti',money);
th.del(id);

addMailMsg(0,user,'пополнение img://a2 +'+money);

}

//plusMoneyUserByID(user,money);
//mysql.query('DELETE FROM job WHERE id=?', [id], function(rows){});
}else if(type=='prizeKosti'){
var money=parseInt(ob.value);
if(isNaN(money))money=0;

var u=AllUsersRoom.getUserByID(user);
if(u!=null){
u.plusKosti(money);
u.emit('userEvent','prizeWinner',money,t1);
th.del(id);
}

//plusMoneyUserByID(user,money);
//mysql.query('DELETE FROM job WHERE id=?', [id], function(rows){});
}else if(type=='nickRainbow'){
var u=AllUsersRoom.getUserByID(user);
if(u!=null){
u.nickRainbow=1;
/*if(t1==1)u.nickRainbow=1;
else u.nickRainbow=0;*/
u.updateFieldDB('nickRainbow',u.nickRainbow);
MainRoom.emitRoom('nickRainbowEvent',u.id,t1);
//u.connect.emit('buyMoneyUser','kosti',money);
th.del(id);
//if(t1==1){
if(vkNotifyApi!=null)vkNotifyApi.sendMission(u,12);   
//}

}

//plusMoneyUserByID(user,money);
//mysql.query('DELETE FROM job WHERE id=?', [id], function(rows){});
}else if(type=='addNickRainbowWeek'){
var u=AllUsersRoom.getUserByID(user);
if(u!=null){
var ts=getTimestamp();

var vTimeEnd=u.nickRainbow_end;
if(ts>=u.nickRainbow_end){
vTimeEnd=ts;
}
u.nickRainbow_end=vTimeEnd+(60*60*24*7);
u.nickRainbow=1;
u.updateFieldDB('nickRainbow',u.nickRainbow);
MainRoom.emitRoom('nickRainbowEvent',u.id,1);
u.sendUpdateUserInfoCurID();
th.del(id);
if(vkNotifyApi!=null)vkNotifyApi.sendMission(u,12); 
}
}else if(type=='addNickColorWeek'){
var u=AllUsersRoom.getUserByID(user);
if(u!=null){
var ts=getTimestamp();

var vTimeEnd=u.nickColor_end;
if(ts>=u.nickColor_end){
vTimeEnd=ts;
}
u.nickColor_end=vTimeEnd+(60*60*24*7);
u.nickColor_pos=-2;
u.sendUpdateUserInfoCur();
MainRoom.sendPrivateMsg(systemUser,u,'Теперь вы можете менять цвет ника');

th.del(id);
}
}else if(type=='addTester'){
var u=AllUsersRoom.getUserByID(user);
if(u!=null){
u.tester=1;
u.updateFieldDB('tester',1);
u.sendUpdateUserInfoCur();

MainRoom.sendMessageEvent('requestTester',u.id,0,[]);
MainRoom.sendPrivateMsg(systemUser,u,'Вы стали тестером!');
th.del(id);

if(vkNotifyApi!=null)vkNotifyApi.sendMission(u,11);

}
//plusMoneyUserByID(user,money);
//mysql.query('DELETE FROM job WHERE id=?', [id], function(rows){});
}else if(type=='addVipDayGold'){
var u=AllUsersRoom.getUserByID(user);
if(u!=null){
var s2='золотой';
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

//u.vip_end=ts+(60*60*24);
u.vip_end=vipTimeEnd+(60*60*24);
u.updateFieldDB('vip',u.vip);
u.sendUpdateUserInfoCurID();
MainRoom.sendMessageEvent('addVipUser',u.id,0,[u.vip]);
MainRoom.sendPrivateMsg(systemUser,u,'Вы получили '+s2+' VIP!');

th.del(id);
}
}else if(type=='addVipGold'){
var u=AllUsersRoom.getUserByID(user);
if(u!=null){
var s2='золотой';
//if(t1==1)s2='золотой';
//else if(t1==2)s2='серебряный';

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

var ts=getTimestamp();

u.vip_end=vipTimeEnd+(60*60*24*7);
//u.vip_end=ts+60;
u.updateFieldDB('vip',u.vip);
u.sendUpdateUserInfoCurID();
MainRoom.sendMessageEvent('addVipUser',u.id,0,[u.vip]);
MainRoom.sendPrivateMsg(systemUser,u,'Вы получили '+s2+' VIP!');

th.del(id);
}
}else if(type=='addVipSilver'){
var u=AllUsersRoom.getUserByID(user);
if(u!=null){
var s2='серебряный';

var vipTimeEnd=u.vip_end;

var ts=getTimestamp();
if(ts>=user.vip_end){
vipTimeEnd=ts;
}else if(u.vip==0){
vipTimeEnd=ts;
}else if(u.vip!=2){
vipTimeEnd=ts;
}

u.vip=2;
var ts=getTimestamp();
u.vip_end=vipTimeEnd+(60*60*24*7);
u.updateFieldDB('vip',u.vip);
u.sendUpdateUserInfoCurID();

MainRoom.sendMessageEvent('addVipUser',u.id,0,[u.vip]);
MainRoom.sendPrivateMsg(systemUser,u,'Вы получили '+s2+' VIP!');

th.del(id);
}
}/*else if(type=='resetAccount'){
var u=AllUsersRoom.getUserByID(user);
if(u!=null){
u.resetUser();
u.disconnect();
th.del(id);
}
}*/else if(type=='addNickLength'){
var u=AllUsersRoom.getUserByID(user);
if(u!=null){
var nickLen=u.nickLength+1;
if(nickLen<=3){
u.nickLength=nickLen;
u.updateFieldDB('nickLength',nickLen);
u.sendUpdateUserInfoCur();
MainRoom.sendPrivateMsg(systemUser,u,'Добавлено +5 символов для ника');
}
th.del(id);
}
}

/*else if(type==90){
var money=parseInt(ob.value);
if(isNaN(money))money=0;

var u=AllUsersRoom.getUserByID(user);
if(u!=null){
u.plusRubies(money);

//u.emit('updateMoneyUser',u.connect.user.money);
th.del(id);
}

//plusMoneyUserByID(user,money);
//mysql.query('DELETE FROM job WHERE id=?', [id], function(rows){});
}*//*else if(type==2){
var money=priceSaveMapServer;
var u=MainRoom.getUserByID(user);
if(u!=null && 'connect' in u && 'user' in u.connect && u.connect.user!=null){
u.connect.user.plusMoney(money);
th.del(id);
}
}*/

}
}

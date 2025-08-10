function AccessUsersMasterData(user){
this.user=user;
this.items={};
}
AccessUsersMasterData.prototype.getCountUsers=function(){
var v=0;
for(var n in this.items){
v+=1;
}
return v;
};

AccessUsersMasterData.prototype.isAccessUser=function(user){
var th=this;
if(user in th.items){
return true;
}
return false;
};

AccessUsersMasterData.prototype.getAccessUser=function(user){
var th=this;
if(user in th.items){
return th.items[user];
}
return null;
};
AccessUsersMasterData.prototype.addUser=function(user,access){
var th=this;
if((user in th.items)==false){
th.items[user]=access;
}else{
th.items[user]=access;
}
};
AccessUsersMasterData.prototype.removeUser=function(user){
var th=this;
if(user in th.items){
delete th.items[user];
}
};
AccessUsersMasterData.prototype.updateAccess=function(user,access){
var th=this;
if((user in th.items)==false){
th.items[user]=access;
}else{
th.items[user]=access;
}
};

function AccessUsersMaster(){
var th=this;
this.accessUsersRedirect=[];
this.items={};
this.usersOne={};

this.accessMyInfo1=[];
this.accessUserInfo1=['private_msg','chat_msgByUser','send_gifts'];
this.accessModInfo1=['chat_msg_report','chat','minichat','chat_capslock','nick_change'];

this.allAccessList=[
{id:'chat_msg_report',name:'жалобы на сообщения',info:'разрешить жаловаться на сообщения',v:true},
{id:'chat',name:'сообщения в чат',info:'отправка сообщений в чат',v:true},
{id:'minichat',name:'сообщения в мини чат (в забегах)',info:'отправка сообщений в забегах',v:true},
{id:'chat_capslock',name:'отправка сообщения с капсом (большие буквы)',info:'отправка сообщений с большими буквами',v:true},
{id:'nick_change',name:'смена ника',info:'разрешить менять ник',v:true},

{id:'chat_msgByUser',name:'сообщения которые адресованы',info:'отправка сообщений которые адресованы',v:true,mode:USER_MODE_SUPER_ADMIN},
{id:'send_gifts',name:'дарить подарки',info:'разрешить дарить подарки',v:true,mode:USER_MODE_SUPER_ADMIN},
{id:'private_msg',name:'сообщения в приват',info:'отправка сообщений в приват',v:true,mode:USER_MODE_SUPER_ADMIN},
{id:'send_maps_moderation',name:'отправка карты на модерацию',info:'разрешить отправку карт на модерацию',v:true/*,mode:USER_MODE_SUPER_ADMIN*/},
{id:'chat_banexit',name:'выход из бана',info:'разрешить выходить из бана',v:true,mode:USER_MODE_SUPER_ADMIN},
{id:'game_zabeg',name:'общий забег',info:'разрешить вход в общий забег',v:true,mode:USER_MODE_SUPER_ADMIN},
{id:'create_world',name:'создание мира',info:'разрешить создание мира',v:true}
];

for (var i = 0; i < th.allAccessList.length; i++) {
var el=th.allAccessList[i];
this.accessMyInfo1.push(el.id);
}

}

AccessUsersMaster.prototype.getAccessUsersRedirect=function(id){
var arr=[];
for (var i = 0; i < this.accessUsersRedirect.length; i++) {
var el=this.accessUsersRedirect[i];
if(el!=null && 'users' in el){
for (var k = 0; k < el.users.length; k++) {
if(id==el.users[k]){
return el.users;
}
}
}
}
return arr;
};


AccessUsersMaster.prototype.isAccess1=function(initiatorid,id){
if(initiatorid in this.items){
var q=this.items[initiatorid];
if(q!=null){
var v=q.isAccessUser(id);
return v;
}
}
return false;
};


AccessUsersMaster.prototype.getAccess1=function(initiatorid,id){
if(initiatorid in this.items){
var q=this.items[initiatorid];
if(q!=null){
var v=q.getAccessUser(id);
return v;
}
}
return null;
};

AccessUsersMaster.prototype.getCountUsers1=function(initiatorid,id){
var v=0;
if(initiatorid in this.items){
var q=this.items[initiatorid];
if(q!=null){
v=q.getCountUsers(id);
}
}
return v;
};

AccessUsersMaster.prototype.findAccessInfoByID=function(id){
if(id!=null){
for (var i = 0; i < this.allAccessList.length; i++) {
var el=this.allAccessList[i];
if(el.id==id)return el;
}
}
return null;
};

AccessUsersMaster.prototype.init=function(cb){
var th=this;
th.reload(cb);
};


AccessUsersMaster.prototype.getAccessCl=function(user){
var th=this;
var q=null;
if(user in th.items){
q=th.items[user];
}
if(q!=null)return q;
return null;
};

AccessUsersMaster.prototype.addAccessUser2=function(user,userid,access){
var th=this;
var q=null;
if((user in th.items)==false){
q=new AccessUsersMasterData(user);
th.items[user]=q;
}else{
q=th.items[user];
}
if(q!=null){
q.addUser(userid,access);
}
};

AccessUsersMaster.prototype.getAccessListInfoByArr=function(a){
var th=this;
var arr=[];
if(a!=null){
for (var i = 0; i < a.length; i++) {
var ss=a[i];
var el=th.findAccessInfoByID(ss);
if(el!=null)arr.push(el);
}
}
return arr;
};

AccessUsersMaster.prototype.getAccessUserByMod1=function(id){
var th=this;
if(id in th.usersOne){
var vv=th.usersOne[id];
return vv;
}
return th.accessMyInfo1;
};

AccessUsersMaster.prototype.checkAccessUserOne=function(id,v){
var th=this;
if(id in th.usersOne){
var access=th.usersOne[id];
for (var i = 0; i < access.length; i++) {
var el=access[i];
if(el==v)return true;
}
}else{
return true;
}
return false;
};

AccessUsersMaster.prototype.checkAccessUser2=function(ot,komu,v){
var th=this;
var vv=th.isAccess1(ot,komu);
if(vv){
var q=th.items[ot];
var arr=q.getAccessUser(komu);
if(arr!=null){
for (var i = 0; i < arr.length; i++) {
var el=arr[i];
if(el==v)return true;
}
}
}else{
return true;
}
return false;
};

AccessUsersMaster.prototype.reload=function(cb){
var th=this;
mysql.query('SELECT * FROM accessUsers', [], function(rows){
th.items=[];
th.usersOne={};
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
var user=el.user;
var userid=el.userid;
var q=null;

var access=[];
if(el.access.length>0){
access=el.access.split(',');
}

if(user==0){
if(el.updateTime!=0){
var qq=null;
th.usersOne[userid]=access;
}
}else{
if(el.updateTime!=0){
th.addAccessUser2(user,userid,access);
}
}
}
}


mysql.query('SELECT * FROM accessUsersRedirect', [], function(rows){
th.accessUsersRedirect=[];
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
var users=el.users;
var ids=[];
if(users.length>0)ids=users.split(',');
for(var k=0; k < ids.length; k++)ids[k]=parseInt(ids[k]);
var ob={id:el.id,users:ids,time:el.time};
th.accessUsersRedirect.push(ob);
}
}
if(typeof cb!=='undefined')cb();
//console.log(th.accessUsersRedirect);
});

});
};

AccessUsersMaster.prototype.getAccessListUsers=function(id,cb){
var th=this;
mysql.query('SELECT * FROM accessUsers WHERE user=?', [id], function(rows){
var arr=[];
if(id!=0){
var myAccess=th.getAccessUserByMod1(id);
arr.push({access:myAccess,user:id});
}
if(rows!=null){
for (var i = 0; i < rows.length; i++){
var el=rows[i];
var access=[];
if(el.access.length>0){
access=el.access.split(',');
}
var obb={access:access,user:el.userid};
if(el.updateTime==0)obb.isFirst=true;
arr.push(obb);
}
}
if(typeof cb!=='undefined')cb(arr);
});
}

AccessUsersMaster.prototype.getAccessListRedirUsers=function(cb){
var th=this;
mysql.query('SELECT * FROM accessUsersRedirect', [], function(rows){
var arr=[];
if(rows!=null){
for (var i = 0; i < rows.length; i++){
var el=rows[i];
var ids=[];
if(el.users.length>0){
ids=el.users.split(',');
}
for(var k=0; k < ids.length; k++)ids[k]=parseInt(ids[k]);
var obb={id:el.id,users:ids};
arr.push(obb);
}
}
if(typeof cb!=='undefined')cb(arr);
});
}

AccessUsersMaster.prototype.addUser=function(initiatorid,id,access,cb){
var th=this;
userMaster.checkUserDB(id,function(r){
var v2=initiatorid!=id;
if(initiatorid==0)v2=true;
if(v2){
if(ModeUsersListV!=null){
for (var i = 0; i < ModeUsersListV.length; i++) {
var el=ModeUsersListV[i];
if(el.id==id){
v2=false;
break;
}
}
}
}

if(r && v2){
th.isExistsUser(initiatorid,id,function(v){
var vv=false;
if(v==false){
if(typeof access=='undefined')access=[];
if(access==null)access=[];
var accessStr='';
if(access.length>0)accessStr=access.join(',');
var ts=getTimestamp();
mysql.query('INSERT INTO accessUsers (userid,access,user,time) VALUES (?,?,?,?)', [id,accessStr,initiatorid,ts], function(rows){
if(rows!=null && 'insertId' in rows)vv=true;
if(vv==true){
if(initiatorid==0){
th.usersOne[id]=access;
}else{
th.addAccessUser2(initiatorid,id,access);
}
}
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



AccessUsersMaster.prototype.addUserRedir=function(ids,cb){
var th=this;
if(ids!=null && ids.length>0){
var str1=ids.join(',');
var ts=getTimestamp();
mysql.query('INSERT INTO accessUsersRedirect (users,time) VALUES (?,?)', [str1,ts], function(rows){
var vv=false;
if(rows!=null && 'insertId' in rows)vv=true;
if(vv==true){
var rowid=rows['insertId'];
var ob={id:rowid,users:ids,time:ts};
th.accessUsersRedirect.push(ob);
}
if(typeof cb!=='undefined')cb(vv);
});
}else{
if(typeof cb!=='undefined')cb(false);
}
}






AccessUsersMaster.prototype.removeAccessUser=function(initiatorid,user,cb){
var th=this;
mysql.query('DELETE FROM accessUsers WHERE user=? AND userid=?', [initiatorid,user], function(rows){
var v=false;
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
v=true;
if(initiatorid==0){
if(user in th.usersOne){
delete th.usersOne[user];
}
}else{
    
var q=th.getAccessCl(initiatorid);
if(q!=null){
q.removeUser(user);
console.log(q);
var nn=q.getCountUsers();
if(nn<=0 && initiatorid in th.items){
delete th.items[initiatorid];
//console.log('del access',initiatorid);
}
}
    
}
}
if(typeof cb!=='undefined')cb(v);
});
}




AccessUsersMaster.prototype.removeAccessUserRedir=function(id,cb){
var th=this;
mysql.query('DELETE FROM accessUsersRedirect WHERE id=?', [id], function(rows){
var v=false;
if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
v=true;
for (var i = 0; i < th.accessUsersRedirect.length; i++) {
var el=th.accessUsersRedirect[i];
if(el!=null && 'id' in el && el.id==id){
th.accessUsersRedirect.splice(i,1);
break;
}
}
}
if(typeof cb!=='undefined')cb(v);
});
}



AccessUsersMaster.prototype.updateAccessUser=function(initiatorid,user,access,cb){
var th=this;
if(typeof access=='undefined')access=[];
if(access==null)access=[];
var accessStr='';
var ts=getTimestamp();
if(access.length>0)accessStr=access.join(',');
mysql.query('UPDATE accessUsers SET access=?, updateTime=? WHERE user=? AND userid=?', [accessStr,ts,initiatorid,user], function(rows){
var v=false;
if(rows!=null)v=true;
if(v==true){
if(initiatorid==0){
th.usersOne[user]=access;
}else{
th.addAccessUser2(initiatorid,user,access);
}
}
if(typeof cb!=='undefined')cb(v);
});
}


AccessUsersMaster.prototype.updateAccessUsersRedir=function(id,ids,cb){
var th=this;
if(ids!=null && ids.length>0){
var ts=getTimestamp();
var str1=ids.join(',');
mysql.query('UPDATE accessUsersRedirect SET users=? WHERE id=?', [str1,id], function(rows){
var v=false;
if(rows!=null)v=true;
if(v==true){
for (var i = 0; i < th.accessUsersRedirect.length; i++) {
var el=th.accessUsersRedirect[i];
if(el!=null && 'id' in el && el.id==id){
el.users=ids;
break;
}
}
}
if(typeof cb!=='undefined')cb(v);
});
}else{
if(typeof cb!=='undefined')cb(false);
}
}


AccessUsersMaster.prototype.isExistsUser=function(initiatorid,id,cb){
mysql.query('SELECT id FROM accessUsers WHERE user=? AND userid=?', [initiatorid,id], function(rows){
var v=false;
if(rows!=null && rows.length>0)v=true;
if(typeof cb!=='undefined')cb(v);
});
}
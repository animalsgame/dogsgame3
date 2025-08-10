function ChatMsg(id,type,time){
		this.id=id;
		this.time=time;
		this.type=type;
		this.reportsCount=0;
		this.msg='';
		this.ot=0;
		this.komu=0;
	}


function DialogRoom(type,ownerid,id,name){
		this.id=id;
		this.name=name;
		this.type=type;
		this.ot=0;
		this.komu=0;
		this.ownerid=ownerid;
		this.users=[];
		this.modeUsers=[];
		this.room=new ChatRoom(this,id,name,type);
		chatRooms[id]=this.room;
	}

	DialogRoom.prototype.getUsersIds=function(){
		return this.users;
	}

	DialogRoom.prototype.addUser=function(id){
		var q=this.isExistsUserID(id);
		if(!q){
		this.users.push(id);
		}
	}

	DialogRoom.prototype.addModeUser=function(id){
		var q=this.isModeUsers(id);
		if(!q){
		this.modeUsers.push(id);
		}
	}

	DialogRoom.prototype.removeUserByID=function(id){
		for (var i = 0; i < this.users.length; i++) {
		var idd=this.users[i];
		if(idd==id){
			this.users.splice(i,1);
			return true;
		}
		}
		for (var i = 0; i < this.modeUsers.length; i++) {
		var idd=this.modeUsers[i];
		if(idd==id){
			this.modeUsers.splice(i,1);
			return true;
		}
		}
		return false;
	}

	DialogRoom.prototype.getMessagesList=function(){
		var a=this.room.getMessagesList1();
		return a;
	}

	DialogRoom.prototype.isModeUsers=function(id){
		if(this.isOwnerUser(id))return true;
		for (var i = 0; i < this.modeUsers.length; i++) {
		var idd=this.modeUsers[i];
		if(idd==id)return true;
		}
		return false;
	}

	DialogRoom.prototype.isOwnerUser=function(id){
		if(this.ownerid!=0 && this.ownerid==id)return true;
		return false;
	}

	DialogRoom.prototype.isExistsUserID=function(id){
		for (var i = 0; i < this.users.length; i++) {
		var idd=this.users[i];
		if(idd==id)return true;
		}
		return false;
	}

	DialogRoom.prototype.saveRoomDB=function(cb){
		var r=this;
		var msgs=r.room.getMessagesList1();
		var usersStr=jsonEncode(r.getUsersIds());
		var msgsStr=jsonEncode(msgs);
		var nm='dialogsHistory';
		mysql.query('SELECT * FROM '+nm+' WHERE room=?', [r.id], function(rows){
			if(rows!=null && rows.length>0){

			mysql.query('UPDATE '+nm+' SET name=?, data=?, users=? WHERE room=?', [r.name,msgsStr,usersStr,r.id], function(rows){
				if(typeof cb!=='undefined')cb();
			});
			}else{

				mysql.query('INSERT INTO '+nm+' (room,name,data,owner,users) VALUES (?,?,?,?,?)', [r.id,r.name,msgsStr,r.ownerid,usersStr], function(rows){
					if(typeof cb!=='undefined')cb();
				});

			}
			
		});
	}

	DialogRoom.prototype.clearMessages=function(){

	}

	DialogRoom.prototype.getObjInfo=function(u){
		var flags=this.room.getRoomFlags(u);
		return [this.id,this.name,this.type,this.ot,this.komu,this.ownerid,flags];
	}
	

function DialogsMaster(){
		this.rooms=[];
		this.isInit=false;
	}

	DialogsMaster.prototype.getUniqID=function(){
	var rnd=1+Math.floor(Math.random()*100000);
	for (var i = 0; i < this.rooms.length; i++) {
	var r=this.rooms[i];
	if(r.id==rnd)return this.getUniqID();
	}
	for(var n in chatRooms){
		var rm=chatRooms[n];
		if(rm.id==rnd)return getUniqID();
	}
	return rnd;
	}

	DialogsMaster.prototype.addRoom=function(type,ownerid,name){
		var id=this.getUniqID();
		var c = this.addRoomByID(id,type,ownerid,name);
		return c;
	}

	DialogsMaster.prototype.addRoomByID=function(type,id,ownerid,name){
		var c = new DialogRoom(type,ownerid,id,name);
		this.rooms.push(c);
		c.addUser(ownerid);
		return c;
	}

	DialogsMaster.prototype.getRoomByID=function(id){
	for (var i = 0; i < this.rooms.length; i++) {
	var r=this.rooms[i];
	if(r.id==id)return r;
	}
	return null;
	}

	DialogsMaster.prototype.getRoomsListByUser=function(u,id){
		var a=[];
		for (var i = 0; i < this.rooms.length; i++) {
		var el=this.rooms[i];
		if(el.isExistsUserID(id))a.push(el.getObjInfo(u));
		//if(el.ownerid==id)a.push(el.getObjInfo());
		}
		return a;
	}


	DialogsMaster.prototype.getRoomsListByUserDB=function(id,cb){
		var a=[];

		mysql.query('SELECT * FROM dialogsHistory WHERE owner=?', [id], function(rows){
			if(rows!=null){
				for (var i = 0; i < rows.length; i++) {
					var o=rows[i];
					var msgs=jsonDecode(o.data);
					var users=jsonDecode(o.users);
					var flags=0;
					var aa=[o.room,o.name,DIALOG_DEF,0,0,o.owner,flags];
					a.push(aa);
				}
			}
			if(typeof cb!=='undefined')cb(a);
		
		});

		
	}

	DialogsMaster.prototype.saveRoomsAll=function(){
		var th=this;
		for (var i = 0; i < th.rooms.length; i++) {
		var r=th.rooms[i];
		if(r.room.isAddMsgEvent){
			r.saveRoomDB();
			r.room.isAddMsgEvent=false;
		}
		}
		/*mysql.query('DELETE FROM dialogsHistory', [], function(rows){
		for (var i = 0; i < th.rooms.length; i++) {
		var r=th.rooms[i];
		var msgs=r.room.getMessagesList1();
		var usersStr=jsonEncode(r.getUsersIds());
		var msgsStr=jsonEncode(msgs);
		mysql.query('INSERT INTO dialogsHistory (room,name,data,owner,users) VALUES (?,?,?,?,?)', [r.id,r.name,msgsStr,r.ownerid,usersStr], function(rows){
		});
		}
		});*/
	}


	DialogsMaster.prototype.restoreAllDialogsRoom=function(){
		var th=this;
		mysql.query('SELECT * FROM dialogsHistory', [], function(rows){
			if(rows!=null){
				for (var i = 0; i < rows.length; i++) {
					var o=rows[i];
					var msgs=jsonDecode(o.data);
					var users=jsonDecode(o.users);
					var rr=th.addRoomByID(DIALOG_DEF,o.room,o.owner,o.name);
					rr.users=users;
					rr.room.pushMessagesList(msgs);
				}
			}
			th.isInit=true;
		});
	}





function ChatRoom(dialogRoom,id,name,type){
this.id=id;
this.name=name;
this.type=type;
this.flags=0;
this.messages=[];
this.curMsgID=0;
this.isAppendMsg=false;
this.ot=0;
this.komu=0;
this.ownerid=0;
this.users=[];
this.giftsHistoryObj={};
this.modeUsers=[];
//this.room=srv.rooms.get("chat_"+id);
this.saveMessages=[];
this.saveMessagesGroup=[];
this.otherUsers=[];
this.dialogRoom=dialogRoom;
this.isAddMsgEvent=false;
this.reportsMsgsObj={}
}

ChatRoom.prototype.getGiftsHistoryByName=function(s){
if(s!=null && s in this.giftsHistoryObj){
var el=this.giftsHistoryObj[s];
return el;
}
return null;
};

ChatRoom.prototype.pushGiftsHistoryItem=function(s,giftid,nums){
if(s!=null){
if(!(s in this.giftsHistoryObj))this.giftsHistoryObj[s]=[];
var arr=this.giftsHistoryObj[s];
if(nums>0){
var itemObj=null;
for (var i = 0; i < arr.length; i++) {
var el=arr[i];
if(el.id==giftid){
itemObj=el;
break;
}
}
if(itemObj==null){
arr.push({id:giftid,nums:nums});
}else{
itemObj.nums+=nums;
}
}
}
};

ChatRoom.prototype.addReportMsg=function(id,t,user){
if(id!=null){
var o=this.findReportMsgByID(id);
if(user!=null){
if(o==null){
o=[];
this.reportsMsgsObj[id]=o;
}
}
if(o!=null){
var vv=this.checkExistsReportMsgUser(o,user);
if(!vv){
o.push({t:t,userid:user.id,ip:user.ip});
return true;   
}
}
}
return false;
}

ChatRoom.prototype.checkExistsReportMsgUser=function(msg,u){
if(msg!=null && u!=null){
for (var i = 0; i < msg.length; i++) {
var el=msg[i];
if(el.userid==u.id)return true;
if(el.ip==u.ip)return true;
}
}
return false;
}

ChatRoom.prototype.findReportMsgByID=function(id){
if(id!=null && id in this.reportsMsgsObj){
return this.reportsMsgsObj[id];
}
return null;
}

ChatRoom.prototype.delReportMsgByID=function(id){
if(id!=null && id in this.reportsMsgsObj){
delete this.reportsMsgsObj[id];
return true;
}
return false;
}

ChatRoom.prototype.checkMaxReportsMsgByReportType=function(id,t){
var o=this.findReportMsgByID(id);
var n=0;
if(o!=null){
for (var i = 0; i < o.length; i++) {
var el=o[i];
if(el.t==t)n+=1;
}
}
return n>=maxReportChatCount;
}

ChatRoom.prototype.getListReportsMsg=function(id){
var o=this.findReportMsgByID(id);
var arr=[];
if(o!=null){
for (var i = 0; i < o.length; i++) {
var el=o[i];
arr.push({id:el.userid,t:el.t});
}
}
return arr;
}


ChatRoom.prototype.addOtherUser=function(u){
if(u!=null){
this.otherUsers.push(u);
}
}


ChatRoom.prototype.getRoomFlags=function(u){
var flags=this.flags;
if(this.id==1){
flags|=ChatRoomFlags.MSG_REPORT_ACCESS;
}

if(this.dialogRoom!=null){
if(this.dialogRoom.isOwnerUser(u.id)){
flags|=ChatRoomFlags.DELETE_MSG;
}
}else{
if(u!=null){
if(UserMode.isAdminModerator(u.mode) || (UserMode.isModeratorM(u.mode))){
flags|=ChatRoomFlags.RESTORE_MSG;
/*if(UserMode.isSuperAdmin(u.mode)){
flags|=ChatRoomFlags.RESTORE_MSG;
}*/
if(this.id==2){ // moderators
if(UserMode.isSuperAdmin(u.mode)){
flags|=ChatRoomFlags.DELETE_MSG;
}
}else if(this.id==3){ // system
if(UserMode.isSuperAdmin(u.mode)){
flags|=ChatRoomFlags.DELETE_MSG;
}
}else{
flags|=ChatRoomFlags.DELETE_MSG;
}
//flags|=ChatRoomFlags.DELETE_MSG;
flags|=ChatRoomFlags.BAN_ACCESS;
}
}
}
return flags;
}

ChatRoom.prototype.getMessagesList1=function(){
var msgs=[];
for (var i = 0; i < this.messages.length; i++) {
var el=this.messages[i];
var obb=cloneObject(el);
if(typeof obb.ot=='object')obb.ot=obb.ot.id;
if(obb.komu!=null && typeof obb.komu=='object'){

if(Array.isArray(obb.komu)){
var ids=[];
for (var k = 0; k < obb.komu.length; k++) {
var el2=obb.komu[k];
if(el2!=null){
if(typeof el2=='object')
ids.push(el2.id);
else{
ids.push(el2);
}
}
}
obb.komu=ids;
}
}
else{
//obb.komu=obb.komu;
}
msgs.push(obb);
}
return msgs;
}

ChatRoom.prototype.pushMessagesList=function(a){
if(a!=null){
for (var i = 0; i < a.length; i++){
var m=a[i];
this.messages.push(m);
}
}
}

ChatRoom.prototype.getCountClients=function(){
var v=0;
var objUsers={};
var clients=this.users;
for (var i = 0; i < clients.length; i++) {
var user=clients[i];
if(user!=null && (user.id in objUsers)==false){
objUsers[user.id]=1;
++v;
}
}
v+=this.otherUsers.length;
if(this.dialogRoom!=null){
var ids=this.dialogRoom.getUsersIds();
if(ids!=null)v+=ids.length;
}
return v;
}

ChatRoom.prototype.getOnlineUsersList=function(page){
var users=[];
var limit=50;
if(page<=0)page=1;
var objUsers={};
var clients=this.users;
var pageArr=eachPageArrayRev(clients,page,limit);
for (var i = 0; i < pageArr.length; i++){
//for (var i = pageArr.length - 1; i >= 0; i--) {
var user=pageArr[i];
if(user!=null && (user.id in objUsers)==false){
objUsers[user.id]=1;
users.push(user.getACUObj1(0));
}
}
return users;
}


ChatRoom.prototype.getOnlineUsersIds=function(){
var users=[];
var objUsers={};
var clients=this.users;
for (var i = clients.length - 1; i >= 0; i--) {
var user=clients[i];
if(user!=null && (user.id in objUsers)==false){
objUsers[user.id]=1;
users.push(user.id);
}
}

if(this.dialogRoom!=null){
var ids=this.dialogRoom.getUsersIds();
if(ids!=null){
for (var i = ids.length - 1; i >= 0; i--) {
var user=AllUsersRoom.getUserByID(ids[i]);
if(user!=null){
if((user.id in objUsers)==false){
objUsers[user.id]=1;
users.push(user.id);
}
}
}
}
}

for (var i = this.otherUsers.length - 1; i >= 0; i--) {
var u=this.otherUsers[i];
users.push(u.id);
}
return users;
}

ChatRoom.prototype.getObj=function(u){
var users=this.getOnlineUsersIds();
var countUsers=this.getCountClients();
var flags=this.getRoomFlags(u);
var msgs=this.getRoomMessages2();
/*for (var i = 0; i < this.messages.length; i++) {
var el=this.messages[i];
if('delUserID' in el){

}else{
msgs.push(el);
}
}*/



var ob={id:this.id,name:this.name,messages:msgs,users:users,countUsers:countUsers,flags:flags};
return ob;
}

ChatRoom.prototype.parseRoomMessage=function(el){
if(el!=null){
var obb=cloneObject(el);
if(obb && 'showMsgObj' in obb)delete obb.showMsgObj;
if(obb!=null && 'modAction' in obb && obb.modAction!=null){
if('msg' in obb)obb.msg='';
obb.isSend=false;
}else{
if(obb!=null)
obb.isSend=true;
}

if(typeof obb.ot=='object')obb.ot=obb.ot.id;
if(obb.komu!=null && typeof obb.komu=='object'){
if(Array.isArray(obb.komu)){
var ids=[];
for (var k = 0; k < obb.komu.length; k++) {
var el2=obb.komu[k];
if(el2!=null){
if(typeof el2=='object')
ids.push(el2.id);
else{
ids.push(el2);
}
}
}
obb.komu=ids;
}
}
return obb;
}
return null;
};

ChatRoom.prototype.getRoomMessages2=function(){
var msgs=[];
for (var i = 0; i < this.messages.length; i++) {
var el=this.messages[i];

/*if('delUserID' in el){

}else if('isHide' in el && el.isHide==true){

}else{*/
var obb=this.parseRoomMessage(el);
msgs.push(obb);
//}
}
return msgs;
}

ChatRoom.prototype.getObjDef=function(){
var ob={id:this.id,name:this.name};
return ob;
}

ChatRoom.prototype.getUniqID=function(){
//++this.curMsgID;
/*var rnd=1+Math.floor(Math.random()*100000);
for (var i = 0; i < this.messages.length; i++) {
var msg=this.messages[i];
if(r.id==rnd)return this.getUniqID();
}
return rnd;*/
return (Date.now()+Math.floor(Math.random())).toString(36);
//return ''+this.curMsgID;
};

/*ChatRoom.prototype.moveMessageRoom=function(room,msg){
if(room != null&&msg!=null){
this.removeMessage(null,msg.id);
if(msg.args&&msg.args.length>0){
msg.args[0]=room.id;
}
room.messages.push(msg);
}
}*/

ChatRoom.prototype.restoreMessage=function(id,user){
var msgObj=this.getMessageByID(id);
if(msgObj!=null && 'modAction' in msgObj){
delete msgObj['modAction'];
var mm=this.parseRoomMessage(msgObj);
this.updateMessageSrv(mm);
if(user)statsUsers.plusCount('mod_restoremsg',user.id);
}
}
    
    
ChatRoom.prototype.reportMsgUser=function(connect,id,t){
var msgObj=this.getMessageByID(id);
var cm='reportChatMsg';
if(msgObj!=null){
var uu=connect.getUserData("user");
if(uu!=null){
var otMsg=0;

if('ot' in msgObj){
var ott=msgObj.ot;
if(typeof ott=='number'){
otMsg=ott;
}else if('id' in ott)otMsg=ott.id;
}

if(!uu.checkAccessM('chat_msg_report')){
connect.send(4);
return;
}

if(otMsg==uu.id){
connect.send(3);
return;
}

if(otMsg==-2){
connect.send(0);
return;
}
    
var v2=this.addReportMsg(id,t,uu);
if(!v2){
connect.send(2);
return;
}

}

++msgObj.reportsCount;
this.isAddMsgEvent=true;
var isMaxV=this.checkMaxReportsMsgByReportType(id,t);
//if(msgObj.reportsCount>=maxReportChatCount){
if(isMaxV){
this.removeMessage('report',id);
connect.send(1);
//this.emitRoom(cm,this.id,id,t);
//this.changeTextMessage(id,'удалено');
}else{
connect.send(1);
if(this.dialogRoom!=null){
var ids=this.dialogRoom.getUsersIds();
if(ids!=null){
for (var i = 0; i < ids.length; i++) {
var userr=AllUsersRoom.getUserByID(ids[i]);
if(userr!=null){
userr.emit(cm,this.id,id,t);
}
}
}
}else{
this.emitRoom(cm,this.id,id,t);
}
}
}else{
connect.send(0);
}
}

ChatRoom.prototype.changeTextMessage=function(id,msg){
for (var i = 0; i < this.messages.length; i++) {
var msg1=this.messages[i];
if(msg1.id==id){
msg1.msg=msg;
this.emitRoom("changeChatMsg",this.id,id,msg);
break;
}
}
}


ChatRoom.prototype.removeMessageFull=function(id){
var res=false;
for (var i = 0; i < this.messages.length; i++) {
var msg1=this.messages[i];
if(msg1.id==id){
//msg1.delUserID=0;
//msg1.isHide=true;
this.messages.splice(i,1);
this.delReportMsgByID(id);
res=true;
break;
}
}
var cm='chatRmvMsg';
if(res){
this.isAddMsgEvent=true;
if(this.dialogRoom!=null){
var ids=this.dialogRoom.getUsersIds();
if(ids!=null){
for (var i = 0; i < ids.length; i++) {
var user=AllUsersRoom.getUserByID(ids[i]);
if(user!=null){
user.emit(cm,this.id,[id]);
}
}
}
}else{
this.emitRoom(cm,this.id,[id]);
}
}
}

ChatRoom.prototype.updateMessageSrv=function(msg){
if(msg!=null){
this.emitRoom("updChatMsgO",this.id,msg);
}
}

ChatRoom.prototype.getMsgsInfoByUserID=function(id){
var arr=[];
for (var i = 0; i < this.messages.length; i++) {
var msg1=this.messages[i];
var otid=-1;
/*if('isHide' in msg1 && msg1.isHide==true){
    
}else{*/
if('ot' in msg1){
if(msg1.ot!=null){
if(typeof msg1.ot=='number')otid=msg1.ot;
else if(typeof msg1.ot=='object' && 'id' in msg1.ot){
otid=msg1.ot.id;
}
}
}
if(otid==id){
var type=0;
if('type' in msg1)type=msg1.type;
var ob={id:msg1.id,type:type};
arr.push(ob);
}
//}
}
return arr;
};




ChatRoom.prototype.getMessagesByUserID=function(id){
var arr=[];
for (var i = 0; i < this.messages.length; i++) {
var msg1=this.messages[i];
var otid=-1;
if('isHide' in msg1 && msg1.isHide==true){
    
}else{
if('ot' in msg1){
if(msg1.ot!=null){
if(typeof msg1.ot=='number')otid=msg1.ot;
else if(typeof msg1.ot=='object' && 'id' in msg1.ot){
otid=msg1.ot.id;
}
}
}
if(otid==id){
arr.push(msg1);
}
}
}
return arr;
};





ChatRoom.prototype.removeMessage=function(t,id,user,descTxt){
var res=false;
var delID=0;
if(typeof user!=='undefined' && user!=null)delID=user.id;
for (var i = 0; i < this.messages.length; i++) {
var msg1=this.messages[i];
if(msg1.id==id){
if(('modAction' in msg1)==false){
var tt='del';
if(t=='report'){
msg1.modAction={t:'report'};
msg1.reportsCount=0;
}else{
msg1.modAction={t:'del',user:delID};
}

if(typeof descTxt!=='undefined'){
var txt4=''+descTxt;
msg1.modAction.desc=txt4;
}

var msgobj=this.parseRoomMessage(msg1)
this.updateMessageSrv(msgobj);

//msg1.delUserID=delID;
this.delReportMsgByID(id);
//this.messages.splice(i,1);
res=true;
}
break;
}
}
var cm='chatRmvMsg';
if(res){
this.isAddMsgEvent=true;
var idStr='';
/*if(delID!=0 && t=='del'){
idStr='id '+delID;
this.changeTextMessage(id,'Удалено модератором '+idStr);
}*/

if(user)statsUsers.plusCount('mod_delmsg',user.id);

if(this.dialogRoom!=null){
var ids=this.dialogRoom.getUsersIds();
if(ids!=null){
for (var i = 0; i < ids.length; i++) {
var user=AllUsersRoom.getUserByID(ids[i]);
if(user!=null){
user.emit(cm,this.id,[id]);
}
}
}
}else{
//this.emitRoom(cm,this.id,[id]);
}
}
}

/*ChatRoom.prototype.removeMessagesByUser=function(id){
var arrr=[];
for (var i = 0; i < this.messages.length; i++) {
var msg1=this.messages[i];
if(msg1.ot==id){
//this.messages.splice(i,1);
arrr.push(msg1.id);
}
}
}*/

ChatRoom.prototype.addUser=function(u){
if(u!=null){
this.removeUser(u,true);
if(this.id>0){
this.emitRoom("userIn",this.id,u.getACUObj1(0));
}
this.users.push(u);
//this.room.join(o.connect);
}
}

ChatRoom.prototype.removeUser=function(uu,noNotify){
if(uu!=null){
for (var i = 0; i < this.users.length; i++) {
var client=this.users[i];
if(client.id==uu.id){
this.users.splice(i,1);
if(!noNotify && this.id>0)client.emit('roomOut',this.id,uu.id);
break;
}
}
}
}


ChatRoom.prototype.isOwnerUser=function(id){
if(this.dialogRoom!=null && this.dialogRoom.isOwnerUser(id)){
return true;
}
return false;
}

ChatRoom.prototype.getMessageByID=function(id){
for (var i = 0; i < this.messages.length; i++) {
var o=this.messages[i];
if(o.id==id)return o;
}
return null;
}


ChatRoom.prototype.getUserByID=function(id){
if(id==-2)return systemUser;
if(id==-3 && curBoarKonkursData)return boarUser;
if(id==-5)return newYearUser;
if(this.dialogRoom!=null){
if(this.dialogRoom.isExistsUserID(id)){
var uu=AllUsersRoom.getUserByID(id);
if(uu!=null)return uu;
}
}

for (var i = 0; i < this.users.length; i++) {
var user=this.users[i];
if(user!=null && user.id==id)return user;
}
for (var i = 0; i < this.otherUsers.length; i++) {
var user=this.otherUsers[i];
if(user!=null && user.id==id)return user;
}
return null;
}


ChatRoom.prototype.sendPrivateMsg=function(ot,komu,msg,textColor){
var th=this;
if(ot!=null && komu!=null && msg!=null && msg.length>0){
if(komu.id==-2 || komu.getCountConnects()>0){
var uid1=ot.id;
if(komu.id==-2){
uid1=komu.id;
komu=ot;

if(msg.toLowerCase()=='хочу подарок'){
if(!komu.flagsMaster.check(1,2)){
var giftObj=shopMaster.giftsList.random();
if(giftObj!=null){
komu.flagsMaster.add(1,2);
msg='Держи '+giftObj.name+'';
var giftid=giftObj.id;
gameItemsMaster.addGameItemFunc1(GameItemsType.GIFTS,giftid,uid1,komu.id,function(res){
//MainRoom.sendGiftMessage(systemUser,komu.id,[giftid]);
th.sendGiftMessage(systemUser,komu,[giftid],'за тайную акцию "хочу подарок"');
});
}
}else{
msg='уже дарила подарок:-[';
}
}else{
var uniq=this.getUniqID();
return {uniq:uniq,ts:getTimestamp()};
}

}
var uniq=this.getUniqID();
var ts=getTimestamp();
var msgObj=new ChatMsg(uniq,MessageType.MSG_USER,ts);
msgObj.ot=ot.getACUObj1(0);
msgObj.komu=null;
msgObj.msg=msg;
msgObj.userid=uid1;
if(textColor!=null)msgObj.textColor=textColor;

komu.emit('chatMsg',this.id,msgObj,DIALOG_PRIVATE_USER);

uniq=this.getUniqID();

return {uniq:uniq,ts:ts};
}
}
return null;
}

ChatRoom.prototype.addMsgByUser=function(uniq,u, ot, komu, msg, roomType, obj8){
if(msg!=null){
if(typeof obj8=='undefined')obj8={};
if(typeof obj8!='object')obj8={};
var msgColorHex=null;
if(obj8!=null && 'textColorPos' in obj8){
msgColorHex=findTextColorByPos(obj8.textColorPos);
}

var komuid=0;
if(komu instanceof Array && komu.length>0){
komuid=komu[0];
if(isNaN(komuid))komuid=0;
}
var ts = getTimestamp();
var user=u.getUserData("user");
if(user!=null){
if(UserMode.isSuperAdmin(user.mode) && user.checkAccessAccount('chat',u) && user.checkOriginalConnect(u)){
if(msg.length>0){
if(msg[0]=="/"){
var str=msg.substr(1);
var spl1=str.split('@');
if(spl1.length>0){
var tcmd=spl1.shift();
if(tcmd=='sendEvent'){
var t1=spl1.shift();
AllUsersRoom.emitRoom('sendEvent',t1,spl1);
}
/*else if(tcmd=='addRequest' && spl1.length>1){
var userr=this.getUserByID(komuid);
var tt=spl1[0];
var vv=spl1[1];

if(userr!=null){
if(tt=='addLapkiFree'){
var moneyV=parseInt(vv);
if(isNaN(moneyV))moneyV=0;
requestsMaster.add(tt,vv+' лапок даром!',userr.id,getTimestamp()+60,''+moneyV);
}else if(tt=='nickRainbow2Min'){
requestsMaster.add('nickRainbow','Ник со цветами радуги на 2 минуты бесплатно!',userr.id,getTimestamp()+60,getTimestamp()+(60*2));
}else if(tt=='requestTester'){
requestsMaster.add('requestTester','Приглашаем вас стать тестером!',userr.id,getTimestamp()+15);
}
//userr.emit('loadRequests');
}



//AllUsersRoom.emitRoom('sendEvent',t1,spl1);
}else if(tcmd=='changePers' && spl1.length>0){
var userr=this.getUserByID(komuid);
var tt=parseInt(spl1[0]);
if(isNaN(tt))tt=0;
if(tt>4)tt=0;
if(userr!=null){
userr.pers=tt;
userr.updateFieldDB('pers',tt);
userr.emit('user.updateUserInfo',userr.getACUObj1());
}
}
else if(tcmd=='stopServer'){
//stopServerFunc();
}*/
}
}
}
}else{
var maxLen=maxSymbolsChatMsg;
if(UserMode.isModerator2(user.mode) || UserMode.isModeratorMaps2(user.mode))maxLen=200;
msg=SubstrTxtChatSize(msg,maxLen);
}

if(user.isBan() && roomType!=DIALOG_PRIVATE_USER){
u.send(ErrorType.BAN,user.getExpireBanSecs());
return;
}

var komuUsers=[];
var komuIds=[];
if(Array.isArray(komu)){
var sz1=komu.length;
if(sz1>=3)sz1=3;
if(sz1>0){
if(sz1==1){
var id1=komu[0];
var komuData=this.getUserByID(id1);
if(komuData!=null){
var komuuser=komuData.getACUObj1(0);
komuUsers.push(komuuser);
komuIds.push(komuuser.id);
}else{
u.send(ErrorType.NO_ONLINE);
return;
}
}else{
for (var i = 0; i < sz1; i++) {
var el2=komu[i];
if(typeof el2=='number'){
komuUsers.push(el2);
komuIds.push(el2);
}
}
}
}
}else{
komuUsers.push(komu);
komuIds.push(komu);
}

//var isKomu=false;
/*if(komu!=0){
if(user.id==komu){
komu=0;
}else{
isKomu=true;
}
}*/
/*var komuuser=null;
if(isKomu){
var komuData=this.getUserByID(komu);
if(komuData!=null){
komuuser=komuData.getACUObj1(0);
}else{
u.send(ErrorType.NO_ONLINE);
return;
}
}*/
var obj3={};
var obj9={};
var msg2=correctChatMessage(msg,obj9);
var isMatMsg=false;
var isChangeMsg=false;
var isMsgTematika=false;
if(msg!=msg2){
isMatMsg=true;
if('isTematika' in obj9 && obj9.isTematika)isMsgTematika=true;
msg2=msg;
//isChangeMsg=true;
//msg=msg2;
}
var isSaveMsg=true;

if(!user.checkAccessM('chat_capslock')){
var origMsg=msg;
msg=msg.toLowerCase();
if(origMsg!=msg){
msg2=msg;
isChangeMsg=true;
//isMatMsg=true;
}
}

if(roomType==DIALOG_PRIVATE_USER){
if(user.checkAccessAccount('private',u) && user.checkAccessM('private_msg')){
if(komuUsers.length>0){
var uu=komuUsers[0];
var komuData=this.getUserByID(uu.id);
if(komuData!=null){

if(!accessUsersMaster.checkAccessUser2(uu.id,user.id,'private_msg')){
u.send(ErrorType.ACCESS_DENIED);
return;
}

if(isMatMsg){
statsUsers.plusCount('private_mat',user.id);
u.send(ErrorType.MAT);
return;
}


if(msgColorHex!=null){
var price=priceSendChatColorMsg;
if(user.isVip()){
if(user.vip==1){
//price=1;
price=0
}
}
if(user.kosti>=price){
if(price>0){
user.minusKosti(price);
}
}else{
u.send(ErrorType.NO_MONEY);
return;
}
}

/*if(komuData.id==-2){
//var ts=getTimestamp();
//u.send(ErrorType.OK,0);
}else{*/
var res1=this.sendPrivateMsg(user,komuData,msg,msgColorHex);
if(res1!=null){

statsUsers.plusCount('private_msgs',user.id);

u.send(ErrorType.OK,this.id,res1.ts,res1.uniq,roomType);
}else{
u.send(ErrorType.NO_ACCESS_WRITE);
}
//}

/*if(uu.id==-2 || komuData.getCountConnects()>0){
var uid1=user.id;

if(uu.id==-2){
uid1=komuData.id;
komuData=user;
}

var msgObj=new ChatMsg(uniq,MessageType.MSG_USER,ts);
msgObj.ot=uid1;
msgObj.komu=null;
msgObj.msg=msg;
msgObj.userid=uid1;

komuData.emit('chatMsg',this.id,msgObj,roomType);
u.send(ErrorType.OK,this.id,ts,uniq,roomType);
}else{
u.send(ErrorType.NO_ACCESS_WRITE);
}*/

}else{
u.send(ErrorType.NO_ONLINE);
}
}else{
u.send(ErrorType.NO_ONLINE);
}
}else{
u.send(ErrorType.ACCESS_DENIED);
}
}else{
 
if(this.type==3){ // system room
if(!UserMode.isSuperAdmin(user.mode)){
u.send(ErrorType.ACCESS_DENIED);
return;
}
}
 
 
if(!user.checkAccessM('chat')){
u.send(ErrorType.ACCESS_DENIED);
return;
}
    
if(!user.checkAccessAccount('chat',u)){
u.send(ErrorType.ACCESS_DENIED);
return;
}


/*if(!accessUsersMaster.checkAccessUserOne(user.id,'chat')){
u.send(ErrorType.ACCESS_DENIED);
return;
}*/


if(komuUsers.length>0){
var uu=komuUsers[0];

var id1=uu;
if(typeof id1=='object' && 'id' in id1)id1=id1.id;

if(id1==boarUser.id && curBoarKonkursData==null){
u.send(ErrorType.NO_ACCESS_WRITE);
return;
}

if(id1<=0 && id1!=-2 && id1!=-5 && id1!=boarUser.id){
u.send(ErrorType.NO_ACCESS_WRITE);
return;
}

if(!user.checkAccessM('chat_msgByUser')){
u.send(ErrorType.ACCESS_DENIED);
return;
}

if(!accessUsersMaster.checkAccessUser2(id1,user.id,'chat_msgByUser')){
u.send(ErrorType.ACCESS_DENIED);
return;
}

}


if(msgColorHex!=null){
var price=priceSendChatColorMsg;
if(user.isVip()){
if(user.vip==1){
//price=1;
price=0
}
}
if(user.kosti>=price){
if(price>0){
user.minusKosti(price);
}
}else{
u.send(ErrorType.NO_MONEY);
return;
}
}

var otUser=user.getACUObj1(0);
if(this.id==1 && curBoarKonkursData && curBoarKonkursData.boaruid==user.id){
otUser=boarUser.getACUObj1(0);
obj3.ot=otUser;
}
var msgObj=new ChatMsg(uniq,MessageType.MSG_USER,ts);
msgObj.ot=otUser;
msgObj.komu=komuUsers;
msgObj.msg=msg;
if(msgColorHex!=null)msgObj.textColor=msgColorHex;
//msgObj.textColor='#00FFFF';


var uu=u.getUserData("user");

var missionid=8;
var prefixAuth=uu.getPrefixAuth();
if(prefixAuth=='vk'){
var loginUser=uu.login.substr(2);
if(!uu.checkMissionVK(missionid)){
if(vkNotifyApi!=null)vkNotifyApi.setMission(loginUser,missionid,function(){
uu.addMissionVK(missionid);
});    
}
}

var isSendByIds=false;

var a1={time:ts,t:msgObj.type,ot:ot,komu:komuIds,msg:msg};

if(this.id==1 && curBoarKonkursData && curBoarKonkursData.boaruid==user.id)a1.ot=boarUser;

var myMsgs=this.getMessagesByUserID(user.id);
if(myMsgs!=null && myMsgs.length>0){
for (var i = 0; i < myMsgs.length; i++) {
var el=myMsgs[i];
if(el!=null && 'type' in el && el.type==1){
if('msg' in el && el.msg.toLowerCase()==msg.toLowerCase()){
this.removeMessageFull(el.id);
}
}
}
}

var usersList2=accessUsersMaster.getAccessUsersRedirect(user.id);
if(usersList2!=null && usersList2.length>0){
isSendByIds=true;
}

u.send(ErrorType.OK,this.id,ts,uniq,this.type,obj3);

if(isSendByIds){
this.saveMessagesGroup.push(a1);
this.emitUsersIdsRoomNoInitiator('chatMsg',usersList2,u.connect,this.id,msgObj,roomType);  
}else{

statsUsers.plusCount('chat_msgs',user.id);
    
/*if(isMatMsg){
var msgObj=new ChatMsg(0,MessageType.MSG_USER,ts);
msgObj.ot=-2;
msgObj.komu=user.getACUObj1(0);
msgObj.msg='В сообщении есть плохие слова.';
u.emit('chatMsg',this.id,msgObj,roomType);
u.emit('chatRmvMsg',this.id,[uniq]);
return;
}*/

this.saveMsg(msgObj);
this.saveMessages.push(a1);
this.emitRoomNoInitiator('chatMsg',u.connect,this.id,msgObj,roomType);
}

var isFlood=CheckIsFloodMsg(msg);
if(isFlood)isMatMsg=true;
if(isMatMsg){
var tx6='плохие слова';
if(isFlood)tx6='флуд';
if(isMsgTematika)tx6='тематика';
if(isFlood){
statsUsers.plusCount('flood',user.id);
}else{
statsUsers.plusCount('mat',user.id);
}
this.removeMessage('del',uniq,systemUser,tx6);
}

/*var isFlood=CheckIsFloodMsg(msg);
if(isFlood){
this.removeMessageFull(uniq);

var msgObj=new ChatMsg(0,MessageType.MSG_USER,ts);
msgObj.ot=-2;
msgObj.komu=user.getACUObj1(0);
msgObj.msg='Не растягивайте сильно буквы, это флуд.';
//msgObj.msg='Я нашла флуд, не растягивайте сильно буквы.';
u.emit('chatMsg',this.id,msgObj,roomType);

//this.room.emit("chatRmvMsg",this.id,[uniq]);
//this.changeTextMessage(uniq,'Здесь был флуд');
}*/
if(isChangeMsg)this.changeTextMessage(uniq,msg2);
//if(msg.trim().length<=0)this.room.emit("chatRmvMsg",this.id,[uniq]);
if(msg.trim().length<=0)this.removeMessageFull(uniq);
}
}else{
u.send(ErrorType.ACCESS_DENIED);
}
}
}


ChatRoom.prototype.sendMsgByUser=function(ot,komu,msg,textColor){
if(ot!=null){
var uniq=this.getUniqID();
var ts=getTimestamp();
var komuIds=[];
var komuUsers=[];
if(komu!=null){
komuIds.push(komu.id);
komuUsers.push(komu.getACUObj1(0));
}

var msgObj=new ChatMsg(uniq,MessageType.MSG_USER,ts);
msgObj.ot=ot.getACUObj1(0);
msgObj.komu=komuUsers;
msgObj.msg=msg;
if(typeof textColor!=='undefined'){
msgObj.textColor=textColor;
}
//msgObj.textColor='#00FFFF';
this.saveMsg(msgObj);
var a1={time:ts,t:msgObj.type,ot:ot,komu:komuIds,msg:msg};
this.saveMessages.push(a1);
this.emitRoom('chatMsg',this.id,msgObj,DIALOG_DEF);
}
}


ChatRoom.prototype.sendMsgByOneUser=function(u,ot,komu,msg,textColor){
if(u!=null && ot!=null){
var uniq=this.getUniqID();
var ts=getTimestamp();
var komuIds=[];
var komuUsers=[];
if(komu!=null){
komuIds.push(komu.id);
komuUsers.push(komu.getACUObj1(0));
}
var msgObj=new ChatMsg(uniq,MessageType.MSG_USER,ts);
msgObj.ot=ot.getACUObj1(0);
msgObj.komu=komuUsers;
msgObj.msg=msg;
if(typeof textColor!=='undefined'){
msgObj.textColor=textColor;
}
//msgObj.textColor='#00FFFF';
//this.saveMsg(msgObj);
u.emit.apply(u,['chatMsg',this.id,msgObj,DIALOG_DEF]);
}
}

ChatRoom.prototype.sendMessageEvent=function(t,ot,komu,args){
if(typeof args=='undefined')args=[];
if(ot && typeof ot=='object' && 'getACUObj1' in ot)ot=ot.getACUObj1(0);
if(komu && typeof komu=='object' && 'getACUObj1' in komu)komu=komu.getACUObj1(0);
if(args==null)args=[];
var ts=getTimestamp();
var uniq=this.getUniqID();

var msgObj=new ChatMsg(uniq,MessageType.EVENT_MSG,ts);
msgObj.ot=ot;
msgObj.st=t;
msgObj.komu=[komu];
msgObj.args=args;
this.saveMsg(msgObj);

var a1={time:ts,t:msgObj.t,ot:msgObj.ot,komu:msgObj.komu,args:args};
//this.saveMessages.push(a1);
this.emitRoom('chatMsg',this.id,msgObj,0);
}

ChatRoom.prototype.sendChatEvent=function(type,args){
var cm='chatEvent';
this.emitRoom(cm,this.id,type,args);
}

/*ChatRoom.prototype.getUniqMessage=function(){
var r=true;
do{
var uniq=Math.floor(Math.random()*1000000);
var a=this.messages.find(function(){this.id==uniq});
if(a.length==0){r=false;}
}while(r);
}*/

ChatRoom.prototype.sendPrizeKostiMsg=function(t,users,giftid){
/*var ts=getTimestamp();
var uniq=this.getUniqID();
var msgObj=new ChatMsg(uniq,MessageType.PRIZE_MSG,ts);
msgObj.users=users;
this.saveMsg(msgObj);
var a1={time:ts,t:msgObj.t,users:users};
this.saveMessages.push(a1);
this.emitRoom("chatMsg",this.id,msgObj);*/

this.sendMessageEvent('prizeTopMsg',0,0,[users,t,giftid]);

}

ChatRoom.prototype.sendSystemMessage=function(msg,save){
save=save||false;
if(msg!=null){
var uniq=this.getUniqID();
var ts = getTimestamp();
var ot=-2;
var komu=0;
//var msgObj={time:ts,id:uniq,ot:ot,komu:komu,t:MessageType.SYSTEM_MSG};
var msgObj=new ChatMsg(uniq,MessageType.SYSTEM_MSG,ts);
msgObj.ot=ot;//systemUser.getACUObj1();
msgObj.msg=msg;
msgObj.textColor='#FFCC00';
if(save){
this.saveMsg(msgObj);
var a1={time:ts,t:msgObj.type,ot:ot,komu:komu,msg:msg};
this.saveMessages.push(a1);
}
this.emitRoom("chatMsg",this.id,msgObj);
}
}

ChatRoom.prototype.sendSystemMessageUser=function(u,msg,save){
save=save||false;
if(msg!=null && u!=null){
var uniq=this.getUniqID();
var ts = getTimestamp();
var ot=-2;
var komu=0;
var msgObj=new ChatMsg(uniq,MessageType.SYSTEM_MSG,ts);
msgObj.ot=u.getACUObj1(0);
msgObj.msg=msg;
msgObj.textColor='#FFCC00';
if(save){
this.saveMsg(msgObj);
var a1={time:ts,t:msgObj.type,ot:ot,komu:komu,msg:msg};
this.saveMessages.push(a1);
}
this.emitRoom("chatMsg",this.id,msgObj);
}
}

ChatRoom.prototype.sendHtmlMessage=function(msg,save){
save=save||false;
if(msg!=null){
var uniq=this.getUniqID();
var ts = getTimestamp();
var msgObj=new ChatMsg(uniq,'html',ts);
msgObj.ot=0;
msgObj.html=msg;
if(save){
this.saveMsg(msgObj);
}
this.emitRoom("chatMsg",this.id,msgObj);
}
}

ChatRoom.prototype.sendGiftMessage=function(user,komu,gifts,msg){
if(typeof msg=='undefined')msg='';
if(msg==null)msg='';
/*var uniq=this.getUniqID();
var ts = getTimestamp();
if(user!=null){
var msgObj=new ChatMsg(uniq,MessageType.GIFT_MSG,ts);
msgObj.ot=user.id;
msgObj.komu=komu;
msgObj.items=gifts;
//var msgObj={time:ts,id:uniq,t:3,ot:-2,args:[this.id,user.id,users,gifts]};
var a1={time:ts,t:msgObj.t,ot:msgObj.ot,komu:msgObj.komu,items:msgObj.items};
this.saveMessages.push(a1);
this.saveMsg(msgObj);
this.emitRoom("chatMsg",this.id,msgObj);
}*/
/*if(typeof komu.getACUObj1!=='undefined')komu=komu.getACUObj1(0);


var komuid=this.getUserIDByObj(komu);
var nm=''+user.id+'_'+komuid;
var giftV=this.getUserIDByObj(gifts);
this.pushGiftsHistoryItem(nm,giftV,1);

this.sendMessageEvent('giftMsg',user.id,komu,[gifts,msg]);*/
this.sendGiftNumsMessage(user,komu,gifts,1,msg);

}

ChatRoom.prototype.getUserIDByObj=function(o){
var v=-1;
if(o!=null){
if(typeof o=='number')v=o;
else if(typeof o=='object'){
if('id' in o){
v=o.id;
}else if(Array.isArray(o)){
if(o.length>0){
for (var i = 0; i < o.length; i++) {
var el=o[i];
var vv=this.getUserIDByObj(el);
if(vv!=-1)return vv;
}
}
}
}
}
return v;
};

ChatRoom.prototype.sendGiftsBox=function(user,komu){
var uObj=user.getACUObj1(0);
if(typeof komu.getACUObj1!=='undefined')komu=komu.getACUObj1(0);
var komuid=this.getUserIDByObj(komu);
this.sendMessageEvent('giftsBoxMsg',uObj,komu);
};

ChatRoom.prototype.sendGiftNumsMessage=function(user,komu,gifts,nums,msg){
if(typeof msg=='undefined')msg='';
if(msg==null)msg='';
//if(typeof komu.getACUObj1!=='undefined')komu=komu.getACUObj1(0);
var otUser=user.getACUObj1(0);
var komuid=this.getUserIDByObj(komu);

for (var i = 0; i < this.messages.length; i++) {
var msg1=this.messages[i];
var otid=-1;
var komu2=-1;
if('isHide' in msg1 && msg1.isHide==true){
}else{
if('ot' in msg1){
otid=this.getUserIDByObj(msg1.ot);
}

if('komu' in msg1){
komu2=this.getUserIDByObj(msg1.komu);
}

if(otid==user.id && komuid==komu2 && 'st' in msg1 && msg1.st=='giftMsg'){
this.removeMessageFull(msg1.id);
}
}
}
var nm=''+user.id+'_'+komuid;
var giftV=this.getUserIDByObj(gifts);
this.pushGiftsHistoryItem(nm,giftV,nums);

this.sendMessageEvent('giftMsg',otUser,komu,[gifts,msg,nums]);

}

ChatRoom.prototype.sendGiftAllUsersMessage=function(user,gifts,msg){
if(typeof msg=='undefined')msg='';
if(msg==null)msg='';

/*var komuid=user.id;
for (var i = 0; i < this.messages.length; i++) {
var msg1=this.messages[i];
var otid=-1;
var komu2=-1;
if('isHide' in msg1 && msg1.isHide==true){
}else{
if('ot' in msg1){
otid=this.getUserIDByObj(msg1.ot);
}

if('komu' in msg1){
komu2=this.getUserIDByObj(msg1.komu);
}

if(otid==-2 && komuid==komu2 && 'st' in msg1 && msg1.st=='giftMsg'){
this.removeMessageFull(msg1.id);
}
}
}
var nm='-2_'+komuid;
var giftV=this.getUserIDByObj(gifts);
this.pushGiftsHistoryItem(nm,giftV,1);*/


this.sendMessageEvent('giftAllUsersMsg',user.id,null,[gifts,msg]);
}


ChatRoom.prototype.emitRoom=function(t){
var a=[t];
for (var i = 1; i < arguments.length; i++)a.push(arguments[i]);
if(this.dialogRoom!=null){
var ids=this.dialogRoom.getUsersIds();
if(ids!=null){
for (var i = 0; i < ids.length; i++) {
var userr=AllUsersRoom.getUserByID(ids[i]);
if(userr!=null){
userr.emit.apply(userr,a);
}
}
}
}else{
for (var i = 0; i < this.users.length; i++) {
var u=this.users[i];
u.emit.apply(u,a);
}
//this.room.emit.apply(this.room,a);
}
}

ChatRoom.prototype.emitRoomNoInitiator=function(t,connect){
var arr=[];
for (var i = 2; i < arguments.length; i++)arr.push(arguments[i]);
if(this.dialogRoom!=null){
var ids=this.dialogRoom.getUsersIds();
if(ids!=null){
for (var i = 0; i < ids.length; i++) {
var userr=AllUsersRoom.getUserByID(ids[i]);
if(userr!=null){
userr.emitNoInitiator(t,connect,arr);
}
}
}
}else{
for (var i = 0; i < this.users.length; i++) {
var u=this.users[i];
u.emitNoInitiator(t,connect,arr);
}
}
}


ChatRoom.prototype.emitUsersIdsRoomNoInitiator=function(t,ids,connect){
var arr=[];
for (var i = 3; i < arguments.length; i++)arr.push(arguments[i]);
if(ids!=null){
for (var i = 0; i < ids.length; i++) {
var userr=AllUsersRoom.getUserByID(ids[i]);
if(userr!=null){
userr.emitNoInitiator(t,connect,arr);
}
}
}
}



ChatRoom.prototype.getMessagesCount=function(){
var v=0;
for (var i = 0; i < this.messages.length; i++) {
var el=this.messages[i];
if('delUserID' in el){
}else if('isHide' in el && el.isHide==true){
}else{
++v;
}
}
return v;
}

ChatRoom.prototype.saveMsg=function(o){
this.messages.push(o);
this.isAddMsgEvent=true;
this.isAppendMsg=true;
//var count=this.getMessagesCount();
if(this.messages.length>limitMessagesRoom)this.messages.shift();
}

ChatRoom.prototype.clearMessages=function(){
this.messages=[];
this.saveMessages=[];
this.isAddMsgEvent=true;
if(this.dialogRoom!=null)this.dialogRoom.clearMessages();
this.sendSystemMessage('Чат очищен',true);
//this.sendChatEvent('clearHistory',[]);
this.reloadRoomEvent();
}

ChatRoom.prototype.reloadRoomEvent=function(){
this.sendChatEvent('reload',[]);
}

/*ChatRoom.prototype.saveMessagesFile=function(){
if(this.saveMessages.length>0){
var dt=getDateFormatStr("d_m_Y",Date.now()/1000);
var nm='ChatHistory_'+this.type+'_'+dt;
var path=pathSaveHistoryMsgs+'/'+nm;
var wr=fs.createWriteStream(path, {'flags': 'a+'});
var ba=new ByteArray();
for (var i = 0; i < this.saveMessages.length; i++) {
var el=this.saveMessages[i];
var flags=0;
var t=el.t;
if(!el.msg)el.msg=' ';
//if(tt=='msgUser')t=1;
//else if(tt=='msgSystem')t=2;
ba.writeShort(t);
ba.writeInt(el.time);
ba.writeByte(flags);
ba.writeInt(el.ot);
ba.writeInt(el.komu);
ba.writeString(el.msg);
//ba.writeObject(el);
}
wr.write(ba.getBytes());
wr.end();
this.saveMessages=[];
}
this.saveMessagesGroupFile();
}*/

ChatRoom.prototype.saveMessagesFile=function(){
var th=this
if(th.saveMessages.length>0){
    
var arr=th.saveMessages;
th.saveMessages=[];

var allowTypeMsgs={};
allowTypeMsgs[MessageType.MSG_USER]=1;
allowTypeMsgs[MessageType.SYSTEM_MSG]=3;
allowTypeMsgs[MessageType.BAN]=4;
allowTypeMsgs[MessageType.UNBAN]=5;
allowTypeMsgs[MessageType.NICK_CHANGE]=6;
allowTypeMsgs[MessageType.GIFT_MSG]=7;

var params=[];

for (var i = 0; i < arr.length; i++){
var el=arr[i];
var ts=0;
if('time' in el)ts=el.time;
var t=0;
var tt=el.t;
var msg=null;
var ot=th.getUserIDByObj(el.ot);
var komu=th.getUserIDByObj(el.komu);
if(ot==-1)ot=0;
if(komu==-1)komu=0;
var itemid=0;
var nums=0;
var a1=0;
var a2=0;
if(tt!=null && tt in allowTypeMsgs){
t=allowTypeMsgs[tt];
if('msg' in el && el.msg)msg=el.msg;
if(tt==MessageType.SYSTEM_MSG)ot=systemUser.id;
else if(tt==MessageType.BAN){
a1=el.banTime;
}else if(tt==MessageType.GIFT_MSG){
itemid=el.itemid;
nums=el.nums;
}
params.push([th.id,t,itemid,nums,ot,komu,a1,a2,msg,ts]);
}
}

/*
if(params.length>0){
mysql.query('INSERT INTO dogs4_history.chat_history (roomid,type,itemid,nums,ot,komu,a1,a2,msg,time) VALUES ?', [params], function(rows){
if(rows){
}else{
th.saveMessages=arr;
}
});
}
*/

}

th.saveMessagesGroupFile();
}


ChatRoom.prototype.saveMessagesGroupFile=function(){
if(this.saveMessagesGroup.length>0){
var dt=getDateFormatStr("d_m_Y",Date.now()/1000);
var nm='ChatHistoryGroup_'+this.type+'_'+dt;
var path=pathSaveHistoryMsgs+'/'+nm;
var wr=fs.createWriteStream(path, {'flags': 'a+'});
var ba=new ByteArray();
for (var i = 0; i < this.saveMessagesGroup.length; i++) {
var el=this.saveMessagesGroup[i];
var flags=0;
var t=el.t;
//if(tt=='msgUser')t=1;
//else if(tt=='msgSystem')t=2;
ba.writeShort(t);
ba.writeInt(el.time);
ba.writeByte(flags);
ba.writeInt(el.ot);
ba.writeInt(el.komu);
ba.writeString(el.msg);
/*if(t==MessageType.PRIZE_MSG){
ba.writeObject(el.users);
}*/
//ba.writeObject(el);
}
wr.write(ba.getBytes());
wr.end();
this.saveMessagesGroup=[];
}
}

/*ChatRoom.prototype.saveMessagesCurFile=function(){
if(this.messages.length>0){
var nm='ChatCurHistory_'+this.type;
var path=pathSaveHistoryMsgs+'/'+nm;
var wr=fs.createWriteStream(path, {'flags':'w+'});
var ba=new ByteArray();
ba.writeObject(this.messages);
wr.write(ba.getBytes());
wr.end();
}
}

ChatRoom.prototype.restoreMessagesCurFile=function(){
var nm='ChatCurHistory_'+this.type;
var path=pathSaveHistoryMsgs+'/'+nm;
try{
var bb=fs.readFileSync(path);
var ba=new ByteArray(bb);
var msgs=ba.readObject();
this.messages=msgs;
}catch(e){
}
}*/
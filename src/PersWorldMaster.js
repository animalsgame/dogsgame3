function PersWorldMaster(id){
		this.id=id;
		this.parent=null;
		this.stream=null;
		this.users=[];
		this.otherUsers=[];
		this.activeRoom=null;
		this.botUserPosAdminV=0;
		this.list=[];
		worldRooms.push(this);
	}


	PersWorldMaster.prototype.getWorldInfoObj=function(){
		var streamid=0;
		if(this.stream!=null)streamid=this.stream.id;
		var o={id:this.id,streamid:streamid};
		return o;
	}

	PersWorldMaster.prototype.getCountClients=function(){
		var v=this.users.length;
		v+=this.otherUsers.length;
		return v;
	}

	PersWorldMaster.prototype.addWorld=function(o){
		if(o!=null){
			o.parent=this;
			this.list.push(o);
		}
	}

	PersWorldMaster.prototype.addOtherUser=function(o){
		if(o!=null){
			this.otherUsers.push(o);
		}
	}

	PersWorldMaster.prototype.sendAddUser=function(o){
		if(o!=null){
			var userObj=o.getACUObj1(0);
			this.stream.send("addUser",[userObj]);
		}
	}

	PersWorldMaster.prototype.getUserByID=function(id){
		for (var k = 0; k < this.users.length; k++) {
		var u=this.users[k];
		if(u!=null && u.id==id)return u;
		}
		return null;
	}

	PersWorldMaster.prototype.getUsersList=function(){
		var a=[];
		for (var k = 0; k < this.users.length; k++) {
		var u=this.users[k];
		if(u!=null)a.push(u.getACUObj1(0));
		}
		for (var k = 0; k < this.otherUsers.length; k++) {
		var u=this.otherUsers[k];
		if(u!=null)a.push(u.getACUObj1(0));
		}
		return a;
	}

	PersWorldMaster.prototype.addUser=function(v){
		if(v!=null){
		if(v.id==1)this.botUserPosAdminV=0;
		this.removeUser(v)
		this.users.push(v);
		}
	}

	PersWorldMaster.prototype.removeUser=function(v){
		if(v!=null){
			for (var i = 0; i < this.users.length; i++) {
				var el=this.users[i];
				if(el!=null && el.id==v.id){
					this.users.splice(i,1);
					break;
				}
			}
		}
	}

	PersWorldMaster.prototype.sendPersMove=function(u,x,y,storona,persWorldSpeed){
		if(u!=null){
			this.stream.send("persMove",[u.id,x,y,storona,persWorldSpeed]);
		}
	}

	PersWorldMaster.prototype.init=function(){
		var th=this;
		this.stream=srv.createStream();
		this.id=this.stream.id;
		th.stream.setInOutHanler(function(connect,isIn){
		var u=connect.user;
		if(isIn){
		var nums=th.getCountClients();
		/*if(nums>=worldClientsLimit){
		th.stream.sendConnect(connect,'limitClients',[]);
		}else{*/
		th.addUser(u);
		var users=th.getUsersList();
		var userObj=u.getACUObj1(0);
		th.stream.sendConnect(connect,'init',[users]);
		th.stream.sendNoInitiator(connect,"addUser",[userObj]);
		//}
			//trace('cc',th.getCountClients());
		
		//trace('in user',u.id);
	}else{
		th.removeUser(u);
		th.stream.sendNoInitiator(connect,"removeUser",[u.id]);
		//trace('out user',u.id);
	}
	});

	th.stream.on('persMove',function(x,y,storona){
	if(arguments.length>2){
	var u=this.user;
	if(u!=null){
	var userid=u.id;
	u.persXYArr=[x,y,storona];
	var args=[userid,x,y,storona,persWorldSpeed];
	th.stream.sendNoInitiator(this,"persMove",args);
	//th.stream.send("persMove",args);
	}
	}
	});

	th.stream.on('chatMsg',function(msg){
	if(arguments.length>0){
	var u=this.user;
	th.sendChatMsg(u,msg);
	}
	});


	th.stream.on('chatMsgStart',function(){
	var u=this.user;
	if(u!=null && !u.isBan()){
	var userid=u.id;
	th.stream.send("chatMsgStart",[userid]);
	}
	});

	th.stream.on('game.startRoom',function(){
	var u=this.user;
	var th2=this;
	if(u!=null){
	if(u.energy>0){
	u.minusEnergy(1);
	getRandomMap(function(oo){
	if(oo!=null){
	if(th.activeRoom==null || !th.activeRoom.isActive()){
	var mapCl=new GameMap();
	mapCl.parseMap(oo.map);
	th.activeRoom=new GameRoom(1,mapCl,th);
	}
	th.stream.sendConnect(th2,'gameRoomEvent',['init',th.activeRoom.stream.id]);
	//th.send(1,th.activeRoom.stream.id);
}else{
	u.plusEnergy(1);
	th.stream.sendConnect(th2,'gameRoomEvent',['error1']);
}
	});
	}else{
	th.stream.sendConnect(th2,'gameRoomEvent',['noEnergy']);
	}
	
	}
	});

	}

	PersWorldMaster.prototype.sendGameRoomEvent=function(t,args){
		if(typeof args=='undefined')args=[];
		var a=[t];
		for (var i = 0; i < args.length; i++)a.push(args[i]);
		this.stream.send('gameRoomEvent',a);
	}

	PersWorldMaster.prototype.sendChatMsg=function(u,msg){
	if(u!=null && !u.isBan()){
	var userid=u.id;
	if(msg.length>0){
	msg=SubstrTxtChatSize(msg,maxSymbolsWorldChatMsg);
	var msg2=correctChatMessage(msg);
	if(msg!=msg2)msg=msg2;
	var isFlood=CheckIsFloodMsg(msg);
	msg=msg.trim();
	if(isFlood){
	msg='Здесь был флуд';
	}
	this.stream.send("chatMsg",[userid,msg]);
	/*if(!isFlood){
	if(msg.length>0){
	this.stream.send("chatMsg",[userid,msg]);
	}
	}*/
	}
	}
	}
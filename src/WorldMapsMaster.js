var worldRoomClientsLimit=1000;

function WorldGameMap(){
this.id=0;
this.time=0;
this.map=null;
this.pers={x:0,y:0};
this.user=0;
}

WorldGameMap.prototype.parseMap=function(o){
if(o!=null){
if('id' in o)this.id=o['id'];
if('time' in o)this.time=o['time'];
if('user' in o)this.user=o['user'];
if('pers' in o && typeof o.pers=='object'){
if(typeof o.pers.x=='number')this.pers.x=o.pers.x;
if(typeof o.pers.y=='number')this.pers.y=o.pers.y;
}
this.map=o;
}
};


function WorldMapsMaster(){
this.mapsScenes=[];
this.worldRooms=[];
}
WorldMapsMaster.prototype.init=function(cb){
if(typeof cb=='function')cb();
//this.reload(cb);
};
WorldMapsMaster.prototype.findMapByType=function(t){
if(t!=null){
for (var i = 0; i < this.mapsScenes.length; i++) {
var el=this.mapsScenes[i];
if(el.type==t){
return el;
}
}
}
return null;
};
WorldMapsMaster.prototype.findMapByID=function(t){
if(t!=null){
for (var i = 0; i < this.mapsScenes.length; i++) {
var el=this.mapsScenes[i];
if(el.id==t){
return el;
}
}
}
return null;
};
WorldMapsMaster.prototype.updateMapDataByID=function(id,o,ts){
var mm=this.findMapByID(id);
if(o!=null && mm!=null){
o.user=mm.user;
o.timestamp=ts;
mm.ts=ts;
if('time' in o)delete o.time;
var m=new WorldGameMap();
m.parseMap(o);
mm.map=m;
}
return null;
};


WorldMapsMaster.prototype.findWorldOnlineListByID=function(id){
var a=[];
for (var i = 0; i < this.worldRooms.length; i++) {
var r=this.worldRooms[i];
if(r!=null && r.m!=null && r.m.id==id){
a.push(r);
}
}
return a;
};

WorldMapsMaster.prototype.findAutoWorld=function(m){
var a=[];
if(m!=null){
for (var i = 0; i < this.worldRooms.length; i++) {
var r=this.worldRooms[i];
var count=r.getCountClients();
if(r.user==m.user && count<worldRoomClientsLimit){
a.push(r);
//trace(count,worldRoomClientsLimit,worldRooms.length);
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
var c=new WorldRoomDef(0,m);
c.worldMaster=this;
this.worldRooms.push(c);
c.init();
//trace(c.id);
return c;
}
return null;
};

WorldMapsMaster.prototype.parseDBObj=function(o){
var th=this;
if(o!=null){
var mapObj=jsonDecode(o.map);
if(mapObj!=null){
mapObj.user=o['user'];
var ts=o.time;
//mapObj.timestamp=getTimestamp();
mapObj.timestamp=ts;
//var m=new WorldGameMap();
var m=new GameMap();
m.parseMap(mapObj);
m.user=o.user;
var ob={id:o.id,name:o.name,type:o.type,user:o.user,map:m,ts:ts};
return ob;
}
}
return null;
};

WorldMapsMaster.prototype.parseDBObj2=function(o,m){
var th=this;
if(o!=null){
var ts=o.time;
if(m==null){
var mapObj=jsonDecode(o.map);
if(mapObj!=null){
mapObj.user=o['user'];
//mapObj.timestamp=getTimestamp();
mapObj.timestamp=ts;
//var m=new WorldGameMap();
var mm=new GameMap();
mm.parseMap(mapObj);
mm.user=o.user;
m=mm;
}
}
var ob={id:o.id,name:o.name,type:o.type,user:o.user,map:m,ts:ts};
return ob;
}
return null;
};

WorldMapsMaster.prototype.findWorldMapByID=function(id,cb){
var th=this;
mysql.query('SELECT * FROM worldMaps WHERE id=?', [id], function(rows){
var ob=null;
var m=null;
var mapid=0;
if(rows!=null && rows.length>0)ob=rows[0];
if(ob)mapid=ob.mapid;
if(ob){
if(mapid==0){
m=th.parseDBObj2(ob,null);
if(cb)cb(m);
}else if(mapid!=0){
findMapByID(mapid,function(mm){
if(mm){
m=th.parseDBObj2(ob,mm);
}
if(cb)cb(m);
});
}
}else{
if(cb)cb(null);
}
});
};

WorldMapsMaster.prototype.findWorldMapByUserID=function(id,cb){
var th=this;
mysql.query('SELECT * FROM worldMaps WHERE user=?', [id], function(rows){
var ob=null;
var m=null;
var mapid=0;
if(rows!=null && rows.length>0)ob=rows[0];
if(ob)mapid=ob.mapid;
if(ob){
if(mapid==0){
m=th.parseDBObj2(ob,null);
if(cb)cb(m);
}else if(mapid!=0){
findMapByID(mapid,function(mm){
if(mm){
m=th.parseDBObj2(ob,mm);
}else{
m=th.parseDBObj2(ob,null);
}
if(cb)cb(m);
});
}
}else{
if(cb)cb(null);
}
});
};

WorldMapsMaster.prototype.reload=function(cb){
var th=this;
this.mapsScenes=[];
mysql.query('SELECT * FROM worldMaps', [], function(rows){
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var o=rows[i];

var ob=th.parseDBObj(o);
if(ob!=null){
th.mapsScenes.push(ob);
}
}
}
//var obb=th.findMapByType('park');
//console.log('pp',obb);
if(typeof cb=='function')cb();
});  
};


function WorldRoomDef(id,m){
		this.id=id;
		this.m=m;
		this.map=m;
		this.user=0;
		if(m)this.user=m.user;
		this.stream=null;
		this.gameType='world';
		this.users={};
		this.usersList=[];
		this.otherUsers=[];
		this.activeRoom=null;
		this.botUserPosAdminV=0;
		this.worldMaster=null;
		this.isDestroy=false;
		this.persPosObj={};
		this.itemsIds=[1,2,0];
	}


	/*WorldRoomDef.prototype.getWorldInfoObj=function(){
		var streamid=0;
		if(this.stream!=null)streamid=this.stream.id;
		var users=this.getUsersList();
		var o={id:this.id,streamid:streamid,users:users};
		return o;
	};*/

	WorldRoomDef.prototype.getCountClients=function(){
		var v=this.usersList.length;
		v+=this.otherUsers.length;
		return v;
	};

	WorldRoomDef.prototype.addOtherUser=function(o){
		if(o!=null){
			this.otherUsers.push(o);
		}
	};

	WorldRoomDef.prototype.sendAddUser=function(o){
		if(o!=null){
			var userObj=o.getACUObj1(0);
			this.stream.send("addUser",[userObj]);
		}
	};

	WorldRoomDef.prototype.getUserByID=function(id){
		for (var k = 0; k < this.usersList.length; k++) {
		var u=this.usersList[k];
		if(u!=null && u.id==id)return u;
		}
		return null;
	};

	WorldRoomDef.prototype.getUsersList=function(){
	    var th=this;
		var a=[];
		for (var k = 0; k < this.usersList.length; k++) {
		var u=this.usersList[k];
		if(u!=null){
		var idd=u.id;
		var ob=th.getUserObjWorld(u);
		a.push(ob);
		}
		}
		for (var k = 0; k < this.otherUsers.length; k++) {
		var u=this.otherUsers[k];
		if(u!=null)a.push(u.getACUObj1(0));
		}
		return a;
	};
	
	WorldRoomDef.prototype.isUserOwner=function(u){
	    var th=this;
	    var idd=0;
	    if(th.m!=null){
	    if(typeof u=='object'){
	        if('id' in u)idd=u.id;
	    }else if(typeof u=='number'){
	        idd=u;
	    }
	    if(th.m.user==idd)return true;
	    }
	    return false;
	}
	
	WorldRoomDef.prototype.getUserObjWorld=function(u){
	   var th=this;
	   if(u!=null){
	   var ob=u.getACUObj1(0);
	   var idd=u.id;
	   if(idd in th.persPosObj){
	   var pp=th.persPosObj[idd];
	   ob.persXY=[pp[0],pp[1]];
	   }
	   //ob.mode=0;
	   if(idd in th.users){
	       var u2=th.users[idd];
	       if(u2){
	       ob.itemsProps={item1:u2.item1,item2:u2.item2,isViewer:u2.isViewerMode};
	       }
	   }
	   /*if(th.isUserOwner(idd)){
	       ob.mode|=USER_MODE_SUPER_ADMIN;
	   }*/
	   
	   return ob;
	   }
	   return null;
	}

	WorldRoomDef.prototype.addUser=function(v,isStream){
		if(v!=null){
		if(v.id==1)this.botUserPosAdminV=0;
		this.removeUser(v)
		this.usersList.push(v);
		var ob={item1:0,item2:0,item3:0,out:0,open1:0,isViewerMode:false,user:v};
		this.users[v.id]=ob;
		/*if(isStream==true && this.stream!=null){
		var userObj=this.getUserObjWorld(v);
		
		for (var i = 0; i < v.connectsList.length; i++) {
		var c=v.connectsList[i];
		if(c!=null && c.connect!=null){
		this.stream.sendNoInitiator(c.connect,"addUser",[userObj]);
		}
		}
		//this.stream.sendNoInitiator(connect,"addUser",[userObj]);
		}*/
		}
	};
	
	WorldRoomDef.prototype.sendConnect=function(u,t,args){
	    var th=this;
	    if(typeof args=='undefined')args=[];
		if(u!=null && th.stream!=null){
		for (var i = 0; i < u.connectsList.length; i++) {
		var c=u.connectsList[i];
		if(c!=null && c.connect!=null){
		th.stream.sendConnect(c.connect,t,args);
		}
		}
		}
	};

	WorldRoomDef.prototype.removeUser=function(v){
		if(v!=null){
		    var idd=v.id;
			for (var i = 0; i < this.usersList.length; i++) {
				var el=this.usersList[i];
				if(el!=null && el.id==idd){
					this.usersList.splice(i,1);
					break;
				}
			}
			if(typeof idd!=='undefined'){
			    if(idd in this.users){
			        delete this.users[idd];
			    }
			}
		}
	};
	
	WorldRoomDef.prototype.destroyWorld=function(){
		if(this.worldMaster!=null && !this.isDestroy){
		    var arr=this.worldMaster.worldRooms;
			for (var i = 0; i < arr.length; i++) {
				var el=arr[i];
				if(el!=null && el==this){
					arr.splice(i,1);
					if(this.stream!=null)this.stream.remove();
					this.stream=null;
					this.worldMaster=null;
					this.isDestroy=true;
					return true;
				}
			}
		}
		return false;
	};
	
	WorldRoomDef.prototype.kickAllUsers=function(u){
	    var th=this;
		if(u && th.stream!=null){
		   for (var i = 0; i < th.usersList.length; i++) {
		       var el=th.usersList[i];
		       if(el && el.id!=u.id){
		           el.sendStream(th.stream,'popupMsg',['Хозяин исключил вас из мира.']);
		           for (var k = 0; k < el.connectsList.length; k++) {
		               var qq=el.connectsList[k];
		               if(qq && qq.connect){
		                   th.stream.sendConnect(qq.connect,'close');
		                   th.stream.leave(qq.connect);
		               }
		           }
		       }
		   } 
		}
	};
	
	WorldRoomDef.prototype.resetAllPersPos=function(){
	    var th=this;
		if(th.stream!=null){
		   for (var i = 0; i < th.usersList.length; i++) {
		       var el=th.usersList[i];
		       if(el){
		           el.sendStream(th.stream,'resetAllPersPos',[]);
		       }
		   }
		   th.persPosObj={};
		}
	};
	
	WorldRoomDef.prototype.resetAllKeys=function(){
	    var th=this;
		if(th.stream!=null){
		   for (var i = 0; i < th.usersList.length; i++) {
		       var el=th.usersList[i];
		       if(el){
		           if(el.id in th.users){
		               var u2=th.users[el.id];
		               if(u2){
		                   u2.item1=0;
		                   u2.item2=0;
		               }
		           }
		           el.sendStream(th.stream,'resetAllKeys',[]);
		       }
		   }
		}
	};

	WorldRoomDef.prototype.init=function(){
		var th=this;
		this.stream=srv.createStream();
		this.id=this.stream.id;
		trace('create world stream '+th.id);
		th.stream.onClose=function(){
		    //trace('close world stream '+th.id);
		};
		
		th.stream.setInOutHanler(function(connect,isIn){
		var u=connect.user;
		if(isIn){
		//var nums=th.getCountClients();
		//if(nums>=worldClientsLimit){
		//th.stream.sendConnect(connect,'limitClients',[]);
		//}else{
		//th.addUser(u);
		//var users=th.getUsersList();
		var userObj=th.getUserObjWorld(u);
		//th.stream.sendConnect(connect,'init',[users]);
		th.stream.sendNoInitiator(connect,"addUser",[userObj]);
		//}
		//trace('cc',th.getCountClients());
		
		//trace('in user',u.id);
	}else{
		th.removeUser(u);
		th.stream.sendNoInitiator(connect,"removeUser",[u.id]);
		var nums=th.getCountClients();
		if(nums==0){
		th.destroyWorld();
		}
		//trace('out user',u.id);
	}
	});
	
	
	
	
th.stream.on("getItem",function(idd,arg1){
var u=th.users[this.user.id];
var u2=this["user"];
var userid=u2["id"];
var t=0;
if(u!=null){
if(arguments.length>0){
t=idd;
}
if(t==1){
if(u.item1==0 && u.item2==0){
u.item1=1;
th.stream.send("getItem",[userid,1]);
}
}else if(t==2){
if(u.item1==1 && u.item3==0){
//u.item3=1;
u.item1=0;
u.item2=0;
//u.open1=0;
th.stream.send('resetPersPos',[userid]);
}
}
}
});
	
	
	th.stream.on("deleteWorld",function(){
	var u=this["user"];
	var userid=u["id"];
	var res=0;
	if(th.m!=null && th.isUserOwner(userid)){
	    
	mysql.query('DELETE FROM worldMaps WHERE id=?', [th.m.id], function(rows){
	   var v=false;
	   if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0)v=true;
	   if(v){
	   if(th.stream)th.stream.send('popupMsg',['Мир был удалён хозяином.']);
	   th.destroyWorld();
	   }
	});
	
	}
	//th.sendConnect(u,'popupAct1',[res]);
	});
	
	th.stream.on("ownerCmd",function(t,arg1,arg2){
	var u=this["user"];
	var userid=u["id"];
	var res=0;
	if(th.m!=null && th.isUserOwner(userid)){
	if(t=='deleteWorld'){
	mysql.query('DELETE FROM worldMaps WHERE id=?', [th.m.id], function(rows){
	   var v=false;
	   if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0)v=true;
	   if(v){
	   if(th.stream)th.stream.send('popupMsg',['Мир был удалён хозяином.']);
	   th.destroyWorld();
	   }
	});
	}else if(t=='kickUsers'){
	    th.kickAllUsers(u);
	    u.sendStream(th.stream,'popupMsg',['Действие выполнено.']);
	}else if(t=='resetPos'){
	    th.resetAllPersPos();
	    u.sendStream(th.stream,'popupMsg',['Действие выполнено.']);
	}else if(t=='changeName'){
	    if(typeof arg1=='string'){
	        if(arg1.length>20)arg1=arg1.substr(0,20);
	        var isFlood=CheckIsFloodMsg(arg1);
	        var s3=correctChatMessage(arg1);
	        if(s3!=arg1)isFlood=true;
	        if(isFlood){
	        u.sendStream(th.stream,'popupMsg',['Имя нарушает правила, придумайте другое имя.']);    
	        }else{
	   mysql.query('UPDATE worldMaps SET name=? WHERE id=?', [arg1,th.m.id], function(rows){
	   th.m.name=arg1;
	   if(th.stream)th.stream.send('changeWorldName',[arg1]);
	   u.sendStream(th.stream,'popupMsg',['Имя для мира изменено.']);
	  });  
	        }
	    }
	    //u.sendStream(th.stream,'popupMsg',['Действие выполнено.']);
	}else if(t=='resetAllKeys'){
	    th.resetAllKeys();
	    u.sendStream(th.stream,'popupMsg',['Действие выполнено.']);
	}
	
	}
	//th.sendConnect(u,'popupAct1',[res]);
	});
	
	/*th.stream.on("setMainWorld",function(){
	var u=this["user"];
	var userid=u["id"];
	var res=0;
	if(th.m!=null && th.isUserOwner(userid)){
	if(th.m.id!=u.myWorldId){
	    u.myWorldId=th.m.id;
	    res=1;
	    u.sendUpdateUserInfo();
	}
	//th.stream.send('popupMsg',['Мир установлен как главный.']);
	}
	th.sendConnect(u,'popupAct1',[res]);
	});*/
	
	/*th.stream.on("resetPersPos",function(){
	var u=this["user"];
	var userid=u["id"];
	var prms=[userid,'no',th.m.map.pers.x,th.m.map.pers.y];
	u.persXYArr=null;
	if(userid in th.persPosObj)delete th.persPosObj[userid];
	th.stream.send('move',prms);
	});*/
	
	initStreamGameRoom.call(th);
	};
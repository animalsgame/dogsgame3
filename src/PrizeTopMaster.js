function PrizeTopMaster(){
		this.hourTop={};
		this.dayTop={};
		this.allOpytDay=0;
	}

	PrizeTopMaster.prototype.init=function(cb){
		var th=this;
		/*this.addUser(1,5);
		this.addUser(2,8);
		this.addUser(2,8);*/

		/*mysql.query('SELECT * FROM prizes_top', [], function(rows){
			
			if(rows!=null){
				for (var i = 0; i < rows.length; i++) {
					var o=rows[i];
					th.addUserT(o.type,o.user,o.v);
				}
			}
			if(typeof cb=='function')cb.apply(th);
		});*/
		
		mysql.query('SELECT id, opyt_hour FROM users WHERE opyt_hour>0', [], function(rows){
			
			if(rows!=null){
				for (var i = 0; i < rows.length; i++) {
					var o=rows[i];
					th.addUserT(1,o.id,o.opyt_hour);
				}
			}
			
			mysql.query('SELECT id, opyt_day FROM users WHERE opyt_day>0', [], function(rows){
			
			if(rows!=null){
				for (var i = 0; i < rows.length; i++) {
					var o=rows[i];
					th.addUserT(2,o.id,o.opyt_day);
				}
			}
			th.checkBonusData();
			if(typeof cb=='function')cb.apply(th);
		});
			
			//if(typeof cb=='function')cb.apply(th);
		});
		

		/*this.updateDB(function(){

		});*/
	}
	
	PrizeTopMaster.prototype.checkBonusData=function(isMsg,t){
	    var lvl=getBonusLevelTop(this.allOpytDay);
	    //if(t)lvl=bonusTopOpytData.items.length;
		if(bonusTopOpytData.lastLevel!=lvl){
		    bonusTopOpytData.lastLevel=lvl;
		    var koef=bonusTopOpytData.step*lvl;
		    if(MainRoom && isMsg){
		        var msgV='Бонусный опыт теперь '+koef+'% Спасайте собачек в забегах';
		        if(lvl<bonusTopOpytData.items.length)msgV+=', и бонус будет увеличиваться!';
		        else msgV+='!';
		        MainRoom.sendSystemMessage(msgV,true);
		    }
		}
	}
	
	PrizeTopMaster.prototype.addUser=function(id,v){
		if(!(id in this.hourTop))this.hourTop[id]={v:0,lastV:-1};
		if(!(id in this.dayTop))this.dayTop[id]={v:0,lastV:-1};
		var hourObj=this.hourTop[id];
		var dayObj=this.dayTop[id];
		hourObj.v+=v;
		dayObj.v+=v;
		this.allOpytDay+=v;
		this.checkBonusData(true);
	}


	PrizeTopMaster.prototype.addUserT=function(type,id,v){
		if(type==1){
		    if(!(id in this.hourTop))this.hourTop[id]={v:v,lastV:v};
		}
		else if(type==2){
		    if(!(id in this.dayTop)){
		        this.dayTop[id]={v:v,lastV:v};
		        this.allOpytDay+=v;
		    }
		}
	}

	PrizeTopMaster.prototype.clear=function(type,cb){
		var th=this;
		var t=0;
		if(type=='hour')t=1;
		else if(type=='day')t=2;
		if(t==1)th.hourTop={};
		else if(t==2){
		th.dayTop={};
		th.allOpytDay=0;
		th.checkBonusData();
		}
		var field='opyt_hour';
		if(type=='day')field='opyt_day';
		mysql.query('UPDATE users SET '+field+'=0', [], function(rows){
		if(typeof cb=='function')cb.apply();
		});
		
		/*mysql.query('DELETE FROM prizes_top WHERE type=?', [t], function(rows){
		if(typeof cb=='function')cb();
		});*/
	}
	
	PrizeTopMaster.prototype.selectTopUsersExists=function(t,cb){
	    var ob={};
	    mysql.query('SELECT * FROM prizes_top WHERE type=?', [t], function(rows){
			
			if(rows!=null){
				for (var i = 0; i < rows.length; i++) {
					var o=rows[i];
					var id=o.user;
					ob[id]=1;
				}
			}
			if(typeof cb=='function')cb(ob);
		});
	};
	
	
	PrizeTopMaster.prototype.updateDBTopRows=function(t,n,arr,cb){
	    var th=this;
	    if(n<arr.length){
	        var ob=arr[n];
	        mysql.query('UPDATE prizes_top SET v=? WHERE user=? AND type=?', [ob.v,ob.user,t], function(rows){
			th.updateDBTopRows(t,n+1,arr,cb);
		  });
	    }else{
	        if(typeof cb=='function')cb();
	    }
	}
	
	PrizeTopMaster.prototype.updateTopTypeDB=function(t,cb){
	    var th=this;
	    
	    	th.selectTopUsersExists(t,function(ob){
	    	var a=th.hourTop;
	    	if(t==2)a=th.dayTop;
		    var insertArr=[];
		    var updateArr=[];
		    for(var n in a){
			var user=parseInt(n);
			var obb=a[user];
			var v=obb.v;
			//console.log(obb,ob);
			if((user in ob)==false){
			insertArr.push([user,v,t]);
			}else if(v!=obb.lastV){
			obb.lastV=v;
			updateArr.push({user:user,v:v});
			}
		    }
		    if(insertArr.length>0){
		  mysql.query('INSERT INTO prizes_top (user,v,type) VALUES ?', [insertArr], function(rows){
			if(updateArr.length>0){
			    th.updateDBTopRows(t,0,updateArr,function(){
			        if(typeof cb=='function')cb();
			    });
			}else{
			   if(typeof cb=='function')cb();
			}
		  });
		    }else if(updateArr.length>0){
		        th.updateDBTopRows(t,0,updateArr,function(){
			        if(typeof cb=='function')cb();
			    });
		    }else{
		        if(typeof cb=='function')cb();
		    }
		});
	    
	}

	PrizeTopMaster.prototype.updateDB=function(cb){
		var th=this;
		
		/*th.updateTopTypeDB(1,function(){
		    if(typeof cb=='function')cb();
		});*/
		
		/*th.updateTopTypeDB(2,function(){
		    if(typeof cb=='function')cb();
		});*/
		
		
		/*for(var n in th.dayTop){
			var user=parseInt(n);
			var v=th.dayTop[n];
			arr1.push([user,v,2]);
		}*/
		
		/*mysql.query('DELETE FROM prizes_top', [], function(rows){
		mysql.query('INSERT INTO prizes_top (user,v,type) VALUES ?', [arr1], function(rows){
			if(typeof cb=='function')cb();
		});
		});*/

		
	}

PrizeTopMaster.prototype.getWinnersList=function(t,nums){
var arr=[];
var a=this.hourTop;
if(t=='day')a=this.dayTop;
for(var n in a){
var idd=parseInt(n);
var obb=a[n];
var vv=obb.v;
arr.push({id:idd,v:vv});
}
/*arr.sort(function(_a,_b){
if(_a.v<_b.v)return 1;
});*/
/*arr.sort(function(a,b){
if(a.v < b.v)return 1;
else if (b.v < a.v)return -1;
return 0;
});*/

arr.sort(function(a,b){
return b.v-a.v;
});

if(nums>0 && arr.length>nums)arr.splice(nums);
return arr;
};

	PrizeTopMaster.prototype.getDataObj=function(t){
	    var vv=this.getWinnersList(t,100);
	    var ids=[];
	    for (var i = 0; i < vv.length; i++) {
	        var el=vv[i];
	        ids.push(el.id);
	    }
	    var ts=allTsHour-getTimestamp();
	    if(t=='day'){
	        var ev=eventsActionMaster.findEventByType('prizeDay');
	        if(ev){
	            ts=ev.end_ts-getTimestamp();
	        }
	        //ts=allTsDay-getTimestamp();
	    }
	    if(ts<=0)ts=0;
		return {users:ids,items:vv,time:ts};
	}
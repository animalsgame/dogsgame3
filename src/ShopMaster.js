function ShopMaster(){
		this.itemsList=[];
		this.giftsList=[];
		this.giftsListLapkiPrice=[];
		this.giftsObj={};
		this.questsDogs=[];
	}
	
	
	ShopMaster.prototype.getQuests1ByID=function(id){
	    for (var i = 0; i < this.questsDogs.length; i++) {
	        var el=this.questsDogs[i];
	        if(el.id==id)return el;
	    }
	    return null;
	};
	
	ShopMaster.prototype.initQuests1=function(cb){
	    var th=this
	    th.questsDogs=[];
	    mysql.query('SELECT * FROM quests1_dogs WHERE active=?', [1], function(rows){
			if(rows!=null){
				for (var i = 0; i < rows.length; i++) {
					var el=rows[i];
					var ob={id:el.id,nums:el.nums,prize_type:el.prize_type,itemid:el.itemid,active:el.active};
					if(ob.prize_type=='gift'){
					var giftObj=null;
					if(ob.itemid in th.giftsObj)giftObj=th.giftsObj[ob.itemid];
					if(giftObj){
					ob.giftItem=giftObj;
					th.questsDogs.push(ob);
					}
					}else{
					th.questsDogs.push(ob);
					}
					
				}
			}
			if(typeof cb!=='undefined')cb();
		});
	};
	
	ShopMaster.prototype.getSellPriceGiftObj=function(vip,o,nums){
	    if(o!=null){
			 //var nums=1;
			 var itemObj=o;
			 if(typeof nums=='undefined'){
			     if('num' in o)nums=o['num'];
			     else{
			         nums=1;
			     }
			 }
			 //if('num' in o)nums=o['num'];
			 var price=itemObj['price'];
			 if('price_type' in itemObj){
			 if(itemObj.price_type==1)price=price*10;
			 }
			 var koef=0.5;
			 if(vip==1)koef=0.7;
			 else if(vip==2)koef=0.6;
			 var allPrice=Math.floor((price*nums)*koef);
			 return allPrice;
			
	    }
	    return -1;
	}
	/*ShopMaster.prototype.getSellPriceGiftObj=function(vip,o,nums){
	    if(o!=null){
	        var itemid=o['itemid'];
	        var itemObj=this.getItemByItemIDAndType(itemid,ShopItemsType.GIFTS);
			if(itemObj!=null){
			 //var nums=1;
			 if(typeof nums=='undefined'){
			     if('num' in o)nums=o['num'];
			     else{
			         nums=1;
			     }
			 }
			 //if('num' in o)nums=o['num'];
			 var price=itemObj['price'];
			 if('price_type' in itemObj){
			 if(itemObj.price_type==1)price=price*10;
			 }
			 var koef=0.5;
			 if(vip==1)koef=0.7;
			 else if(vip==2)koef=0.6;
			 var allPrice=Math.floor((price*nums)*koef);
			 return allPrice;
			}
	    }
	    return -1;
	}*/
	
	ShopMaster.prototype.removeAllGiftsUser=function(userid,cb){
	    var th=this;
	    var v=-1;
		mysql.query('DELETE FROM usersItems WHERE type=? AND user=?', [1,userid], function(rows){
			if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
					     if(typeof cb!=='undefined')cb(true);
					 }else{
					     if(typeof cb!=='undefined')cb(false);
					 }
		});
	};
	
	ShopMaster.prototype.getQueryMyGifts=function(){
	    var tbl1='shop';
	    var q='SELECT usersItems.id as idd, '+tbl1+'.id as itemid, '+tbl1+'.name as gift_name, '+tbl1+'.price as price, '+tbl1+'.price_type as price_type, usersItems.num as num FROM usersItems INNER JOIN '+tbl1+' ON '+tbl1+'.id=usersItems.itemid WHERE usersItems.type=? AND usersItems.user=?';
	    return q;
	};
	
	ShopMaster.prototype.getSellPriceGiftsUser=function(vip,userid,cb){
	    var th=this;
	    var v=-1;
	    var query=th.getQueryMyGifts();
	    mysql.query(query, [1,userid], function(rows){
		//mysql.query('SELECT * FROM usersItems WHERE type=? AND user=?', [1,userid], function(rows){
			if(rows!=null){
				if(v==-1)v=0;
				for (var i = 0; i < rows.length; i++) {
					var el=rows[i];
					var itemid=el['itemid'];
					var num=el['num'];
					
					var price=th.getSellPriceGiftObj(vip,el);
					if(price>-1){
					    v+=price;
					}
					/*var itemObj=th.getItemByItemIDAndType(itemid,ShopItemsType.GIFTS);
					if(itemObj!=null){
					    var price=itemObj['price'];
					    var allPrice=Math.floor((price*num)*0.5);
					    v+=allPrice;
					}*/
				}
			}
			if(typeof cb!=='undefined')cb(v);
		});
	}
	
	
	ShopMaster.prototype.sellPriceGiftIDByUser=function(vip,userid,id,nums,cb){
	    var th=this;
	    if(nums<=1)nums=1;
	    var query=th.getQueryMyGifts();
	    query+=' AND usersItems.id=?'
		//mysql.query('SELECT * FROM usersItems WHERE id=? AND type=? AND user=?', [id,1,userid], function(rows){
		mysql.query(query, [1,userid,id], function(rows){
			if(rows!=null){
			    var el=null;
			    if(rows.length>0)el=rows[0];
				if(el!=null){
				    var idd=el['idd'];
				    var num=el['num'];
				    if(nums>=num)nums=num;
				    var price=th.getSellPriceGiftObj(vip,el,nums);
					if(price>-1){
					 num-=nums;
					 if(nums<0)nums=0;
					 
					 if(num<=0){
					 mysql.query('DELETE FROM usersItems WHERE id=?', [idd], function(rows2){
					 if(rows2!=null && 'affectedRows' in rows2 && rows2.affectedRows>0){
					     var res={price:price};
					     if(typeof cb!=='undefined')cb(res);
					 }else{
					     if(typeof cb!=='undefined')cb(null);
					 }
					 });
					 }else{
					 mysql.query('UPDATE usersItems SET num=? WHERE id=?', [num,idd], function(rows2){
					 if(rows2!=null && 'affectedRows' in rows2 && rows2.affectedRows>0){
					     var res={price:price};
					     if(typeof cb!=='undefined')cb(res);
					 }else{
					     if(typeof cb!=='undefined')cb(null);
					 }
					 });
					 }
					 
					}
				}else{
				    if(typeof cb!=='undefined')cb(null);
				}
			}else{
			    if(typeof cb!=='undefined')cb(null);
			}
			
		});
	}
	
	ShopMaster.prototype.getGiftsUser=function(vip,userid,cb){
	    var th=this;
		var count=0;
		var arr=[];
		var users={};
		var usersIds=[];
		mysql.query('SELECT id,ot,itemid,num FROM usersItems WHERE type=? AND user=? ORDER BY ot ASC', [1,userid], function(rows){
			if(rows!=null){
				for (var i = 0; i < rows.length; i++) {
					var el=rows[i];
					var ot=el['ot'];
					var num=el['num'];
					count+=num;
					if((ot in users)==false){
					    users[ot]=[];
					    usersIds.push(ot);
					}
					users[ot].push([el['id'],el['itemid'],num]);
				}
				
				for (var i = 0; i < usersIds.length; i++) {
				    var idd=usersIds[i];
				    arr.push([idd,users[idd]]);
				}
				/*for(var n in users){
				    var idd=parseInt(n);
				    arr.push([idd,users[n]]);
				    //usersIds.push(idd);
				}*/
			}
			
			th.getSellPriceGiftsUser(vip,userid,function(sell){
			    var ob={sellPrice:sell,count:count,items:arr,users:usersIds};
			    if(typeof cb!=='undefined')cb(ob);
			});
			
			//var sell=0;
			//var ob={sellPrice:sell,count:count,items:arr,users:usersIds};
			
			
		});
	}

	ShopMaster.prototype.addMoneyHistory=function(userid,type,value,cb){
		var ts=getTimestamp();
		mysql.query('INSERT INTO moneyHistory (type,value,user,time) VALUES (?,?,?,?)', [type,value,userid,ts], function(rows){
			var res=true;
			if(!rows)res=false;
			if(typeof cb!=='undefined')cb(res);
			});
	}
	
	ShopMaster.prototype.clearMoneyHistoryUser=function(userid,cb){
		mysql.query('DELETE FROM moneyHistory WHERE user=?', [userid], function(rows){
		  if(typeof cb=='function')cb();
		});
	}

	ShopMaster.prototype.getPaymentsHistoryByUser=function(id,cb){
		var th=this;
		mysql.query('SELECT * FROM moneyHistory WHERE user=? ORDER BY time DESC', [id], function(rows){
			var arr=[];
			if(rows!=null){
				for (var i = 0; i < rows.length; i++) {
					var el=rows[i];
					var ob=[el.id,el.type,el.value,el.time];
					arr.push(ob);
				}
			}

			if(typeof cb!=='undefined')cb(arr);
		});
	}

	ShopMaster.prototype.getItemsListByType=function(type){
		var a=[];
		for (var i = 0; i < this.itemsList.length; i++) {
			var el=this.itemsList[i];
			if(el.type==type)a.push(el);
		}
		return a;
	}

	ShopMaster.prototype.getItemByItemIDAndType=function(itemid,type){
		for (var i = 0; i < this.itemsList.length; i++) {
			var el=this.itemsList[i];
			if(el.itemid==itemid && el.type==type){
				return el;
			}
		}
		return null;
	}

	ShopMaster.prototype.init=function(cb){
		var th=this;
		th.itemsList=[];
		th.giftsList=[];
		th.giftsListLapkiPrice=[];
		th.giftsObj={};
		mysql.query('SELECT * FROM shop WHERE active=?', [1], function(rows){
			if(rows!=null){
				for (var i = 0; i < rows.length; i++) {
					var el=rows[i];
					var tt=el['type'];
					th.itemsList.push(el);
				}
			}
			
			var arr2=th.getItemsListByType(ShopItemsType.GIFTS);
			if(arr2!=null){
			for (var i = 0; i < arr2.length; i++) {
			var el=arr2[i];
			th.giftsList.push(el);
			if(el.price_type==0)th.giftsListLapkiPrice.push(el);
			th.giftsObj[el.id]={id:el.id,name:el.name,price:el.price,url:el.url};
			}
			}
			
			th.giftsListLapkiPrice.sort(function(a,b){return a.price-b.price;})
			//th.giftsList=th.getItemsListByType(ShopItemsType.GIFTS);
			th.giftsList.sort(function(a,b){
				return a.price-b.price;
			});
			/*th.giftsList.sort(function(a,b){
				if (a.price < b.price) return -1; 
				if (a.price > b.price) return 1;  
				return 0;
			});*/
			//console.log(th.giftsList);
			th.initQuests1(cb);


			//if(typeof cb!=='undefined')cb();
		});
	}
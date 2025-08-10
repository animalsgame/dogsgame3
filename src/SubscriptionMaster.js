var SubscribeStatus={ERROR:-1,OK:1,EXISTS:2,NO_MONEY:3};
function SubscriptionMaster(callback){
		this.callback=callback;
		this.dbTable1='shop_subscription';
		this.dbTable2='subscription_users';
		this.items=[];
	}

	SubscriptionMaster.prototype.parseItemInfoObj=function(o){
		if(o!=null){
			var period=o.period*60;
			if(o.price_type==3){ // если голоса вк, то период будет в днях, переводим в секунды
				period=60*60*24*o.period;
			}
			var ob={id:o.id,name:o.name,period:period,price_type:o.price_type,price:o.price};
			return ob;
		}
		return null;
	}

	SubscriptionMaster.prototype.parseItemUserSubscribeInfoObj=function(o){
		if(o!=null){
			var item=this.getItemByID(o['subscribe_id']);
			if(item!=null){
			var period=item.period*60;
			if(item.price_type==3){
				period=60*60*24*item.period;
			}
			var ob={id:o.id,name:item.name,period:period,expire:o.expire,price_type:item.price_type,price:item.price};
			return ob;
			}
		}
		return null;
	}

	SubscriptionMaster.prototype.getItemByID=function(id){
		for (var i = 0; i < this.items.length; i++) {
			var el=this.items[i];
			if(el.id==id)return el;
		}
		return null;
	}

	SubscriptionMaster.prototype.init=function(cb){
		var th=this;
		mysql.query('SELECT * FROM '+th.dbTable1, [], function(rows){
			if(rows!=null){
				for (var i = 0; i < rows.length; i++) {
					var el=rows[i];
					th.items.push(el);
				}
			}
			if(typeof cb!=='undefined')cb();
		});
	}

	SubscriptionMaster.prototype.getSubscribeByID=function(id,userid,cb){
		var th=this;
		mysql.query('SELECT * FROM '+th.dbTable2+' WHERE id=? AND user=?', [id,userid], function(rows){
			var res=null;
			if(rows!=null && rows.length>0){
				res=rows[0];
			}
			if(typeof cb!=='undefined')cb(res);
		});
	}

	SubscriptionMaster.prototype.getSubscribeUserBySubscribeID=function(id,userid,cb){
		var th=this;
		mysql.query('SELECT * FROM '+th.dbTable2+' WHERE subscribe_id=? AND user=?', [id,userid], function(rows){
			var res=null;
			if(rows!=null && rows.length>0){
				res=rows[0];
			}
			if(typeof cb!=='undefined')cb(res);
		});
	}

	SubscriptionMaster.prototype.getSubscribeUserArr=function(userid,cb){
		var th=this;
		mysql.query('SELECT * FROM '+th.dbTable2+' WHERE user=?', [userid], function(rows){
			var arr=[]
			if(rows!=null && rows.length>0){
				for (var i = 0; i < rows.length; i++) {
				var el=rows[i];
				var obb=th.parseItemUserSubscribeInfoObj(el);
				if(obb!=null){
					arr.push(obb);
				}
				}
			}
			if(typeof cb!=='undefined')cb(arr);
		});
	}

	SubscriptionMaster.prototype.subscribe=function(user,id,userid,cb){
		var th=this;
		var result={status:SubscribeStatus.ERROR,userid:userid,id:id};
		th.getSubscribeUserBySubscribeID(id,userid,function(ob2){
		if(ob2==null){
		var ts=getTimestamp();
		var obj=th.getItemByID(id);
		var res=true;
		if(user!=null){
		res=false;
		var moneyObj=th.getMoneyTypeByItemObj(obj);
		if(moneyObj!=null){
			var price=moneyObj.price;
			var field1=moneyObj.moneyField;
			if(field1 in user){
			var moneyV=user[field1];
			if(moneyV>=price){
			if(field1=='money'){
			user.minusMoney(price);
			res=true;			
			}else if(field1=='kosti'){
			user.minusKosti(price);
			res=true;
			}
			}else{
				result.status=SubscribeStatus.NO_MONEY;
				if(typeof cb!='undefined')cb(result);
				return;
			}
			}
		
		}
		}

		if(obj!=null && res){
		var periodMin=parseInt(obj['period']);
		var expire=ts+(periodMin*60);
		mysql.query('INSERT INTO '+th.dbTable2+' (subscribe_id,expire,time,user) VALUES (?,?,?,?)', [id,expire,ts,userid], function(rows){
					if(!rows){
					}else{
						result.status=SubscribeStatus.OK;
						if(th.callback!=null)th.callback(userid,obj,'create');
					}
					if(typeof cb!=='undefined')cb(result);
				});
		}else{
			if(typeof cb!=='undefined')cb(result);
		}
			}else{
				result.status=SubscribeStatus.EXISTS;
				if(typeof cb!='undefined')cb(result);
			}
		});
		
	}


	SubscriptionMaster.prototype.getMoneyTypeByItemObj=function(o){
		if(o!=null){
			var moneyType=o['price_type'];
			var price=o['price'];
			var moneyField='';
			if(moneyType==1)moneyField='money';
			else if(moneyType==2)moneyField='kosti';
			var ob={price:price,type:moneyType,moneyField:moneyField};
			return ob;
		}
		return null;
	}

	SubscriptionMaster.prototype.renewSubscribeObj=function(ts,id,obj,userid,cb){
		var th=this;
		if(obj!=null){
		var periodMin=parseInt(obj['period']);
		var expire=ts+(periodMin*60);
		var r1=false;
		var moneyObj=th.getMoneyTypeByItemObj(obj);
		if(moneyObj!=null){
			var price=moneyObj.price;
			var userr=MainRoom.getUserByID(userid);
					if(userr!=null){
					var field1=moneyObj.moneyField;
					if(field1 in userr){
					var moneyV=userr[field1];
					if(moneyV>=price){
						var field2='';
						if(field1=='money'){
							field2='money';
							userr.minusMoney(price);
							r1=true;
						}else if(field1=='kosti'){
							field2='kostochki';
							userr.minusKosti(price);
							r1=true;
						}

						if(field2!=''){
							var moneyV=userr[field1];
							userr.updateFieldDB(field2,moneyV,function(){
							});
						}

					}else{
						th.cancelSubscribe(obj,id,userid,function(ob4){
						});
					}
					}
					if(r1){
					mysql.query('UPDATE '+th.dbTable2+' SET expire=? WHERE id=?', [expire,id], function(rows){
						if(!rows){
						}else{
							if(th.callback!=null)th.callback(userid,obj,'renew');
							if(typeof cb!='undefined')cb();
						}
					});
					}
		}
		}
		}
	}


	SubscriptionMaster.prototype.cancelSubscribe=function(obj,id,userid,cb){
		var th=this;
		var query='DELETE FROM '+th.dbTable2+' WHERE id=? AND user=? AND cancel=?';
		//query='UPDATE '+th.dbTable2+' SET cancel=? WHERE id=? AND user=?';
		mysql.query(query, [id,userid,0], function(rows){
			//mysql.query(query, [1,id,userid], function(rows){
			var res={id:id,userid:userid,status:SubscribeStatus.ERROR};
			if(rows!=null && 'affectedRows' in rows && rows.affectedRows>0){
				res.status=SubscribeStatus.OK;
				if(th.callback!=null)th.callback(userid,obj,'cancel');
			}

			if(typeof cb!='undefined')cb(res);
		});
	}

	SubscriptionMaster.prototype.update=function(cb){
		var th=this;
		var ts=getTimestamp();
		mysql.query('SELECT * FROM '+th.dbTable2+' WHERE cancel=? AND ? > expire', [0,ts], function(rows){
			if(rows!=null){
				for (var i = 0; i < rows.length; i++) {
					var el=rows[i];
					var obj=th.getItemByID(el['subscribe_id']);
					if(obj!=null){
					var userid=el['user'];
					th.renewSubscribeObj(ts,el['id'],obj,userid,function(res){
					});
					}
				}
				}
			
			if(typeof cb!=='undefined')cb();
		});
	}

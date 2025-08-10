function EventsActionMaster(){
this.list=[];
this.waitList=[];
this.isFirstInit=false;
}

function copyPropsEvA(th,props){
if(th!=null && props!=null){
for(var n in props)th[n]=props[n];
}
}

copyPropsEvA(EventsActionMaster.prototype,{

init:function(cb){
this.reload(cb);
},

isEnd:function(o){
var ts=getTimestamp();
if(o && o.is_end==1)return true;
if(o && o.is_start==1 && ts>=o.end_ts){
return true;
}
return false;
},

notifyAllUsers:function(t,el){
if(MainRoom!=null){
var allUsers=MainRoom.users;
for (var i = 0; i < allUsers.length; i++){
var u=allUsers[i];
if(u!=null){
u.emit('ev2',t,el);
}
}
}
},

findWaitEventByID:function(id){
var th=this;
for (var i = 0; i < th.waitList.length; i++) {
var el=th.waitList[i];
if(el.id==id)return el;
}
return null;
},

getActiveEventsList:function(){
var th=this;
var arr=[];
for (var i = 0; i < th.list.length; i++) {
var el=th.list[i];
if(!th.isEnd(el)){
arr.push(el);
}
}
return arr;
},

findEventByCollectionType:function(t){
var th=this;
for (var i = 0; i < th.list.length; i++) {
var el=th.list[i];
if(el && 'collectionData' in el && el.collectionData){
var dt1=el.collectionData;
if(dt1.type==t)return el;
}
}
return null;
},

findEventByID:function(id){
var th=this;
for (var i = 0; i < th.list.length; i++) {
var el=th.list[i];
//if(el.id==id && !th.isEnd(el))return el;
if(el.id==id)return el;
}
return null;
},

findEventByType:function(t){
var th=this;
for (var i = 0; i < th.list.length; i++) {
var el=th.list[i];
if(el.type==t && !th.isEnd(el))return el;
}
return null;
},

findEventItemType:function(t){
var th=this;
for (var i = 0; i < th.waitList.length; i++) {
var el=th.waitList[i];
if(el.type==t)return el;
}
for (var i = 0; i < th.list.length; i++) {
var el=th.list[i];
if(el.type==t)return el;
}
return null;
},

removeByID:function(id,cb){
var th=this;

var cb1=function(aa){
if(aa){
for (var i = 0; i < aa.length; i++) {
var el=aa[i];
if(el.id==id){
aa.splice(i,1);
return true;
}
}
}
return false;
};


mysql.query('SELECT * FROM events_action WHERE id=?',[id],function(rows){
var el=null;
var res=false;
if(rows && rows.length>0){
el=th.parseDBObj(rows[0]);
}

if(el){
mysql.query('DELETE FROM events_action WHERE id=?',[id],function(rows){
if(rows)res=true;

cb1(th.list);
cb1(th.waitList);
th.eventAction('end',el);
if(typeof cb=='function')cb(res);
});
}else{
if(typeof cb=='function')cb(res);
}

});

},

parseDBObj:function(el){
if(el){
var ob={id:el.id,name:el.name,type:el.type,start_ts:el.start_ts,end_ts:el.end_ts,create_time:el.create_time,is_start:el.is_start,is_end:el.is_end,num1:el.num1,lastday:el.lastday,is_system:el.is_system,time_sec:el.time_sec};
return ob;
}
return null;
},

getListDB:function(cb){
var th=this;
var arr=[];
mysql.query('SELECT * FROM events_action',[],function(rows){
if(rows && rows.length>0){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
var ob=th.parseDBObj(el);
arr.push(ob);
}
}
if(typeof cb=='function')cb(arr);
});
},

addPrizeDayEvent:function(){
var th=this;
var ts=getTimestamp();
var tmDay=getTimestampPrizeDay();
th.add('Призы за день','prizeDay',ts,tmDay,{system:true});
},


reload:function(cb){
var th=this;
var collTable='events_collections';
mysql.query('SELECT events_action.*, '+collTable+'.id as collid, '+collTable+'.name as collname, '+collTable+'.type as colltype, '+collTable+'.items as collectionData FROM events_action LEFT OUTER JOIN events_collections ON events_collections.id=events_action.collectionid',[],function(rows){
//mysql.query('SELECT * FROM events_action',[],function(rows){
//var isEvent8marta=null;

th.waitList=[];
th.list=[];

if(rows && rows.length>0){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
var r1=true;
var ob=th.parseDBObj(el);
/*if(el.type=='8marta'){
isEvent8marta=ob;
}*/

if(el.collid!=null && el.collid!=0){
r1=false;
var dt1=null;
if(el.collectionData!=null && el.collectionData.length>0){
dt1=jsonDecode(el.collectionData);
}
if(dt1){
r1=true;
ob.collectionData={id:el.collid,name:el.collname,type:el.colltype,data:dt1};
}
}

//trace(ob)

if(ob.is_start==0){
th.waitList.push(ob);
}else{
if(!th.isEnd(ob)){
th.list.push(ob);
}
}

}
//console.log(th.list);
}

//eventType2Obj=th.findEventByType('halloween');
//eventType2Obj=th.findEventByType(curEventType);

if(!th.isFirstInit){
var prizeDayEv=th.findEventByType('prizeDay');
if(prizeDayEv==null)th.addPrizeDayEvent();
}

th.isFirstInit=true;
/*if(!isEvent8marta){
var tm1=getTimestampByDate(3,7,0,0);*/
/*console.log(tm1);
var dt2=new Date();
dt2.setMinutes(dt2.getMinutes()+1);
dt2.setSeconds(0);
var tm1=Math.floor(dt2.getTime()/1000);
th.add('8 марта','8marta',tm1,tm1+(60*10));*/
/*th.add('8 марта','8marta',tm1,tm1+(60*60*24*7));
}*/

//event8martaObj=th.findEventByType('8marta');


//console.log('88',event8martaObj);

/*setInterval(function(){
nextDay8marta();
},35000);*/

if(typeof cb=='function')cb();
});
},

add:function(name,type,start_ts,end_ts,props){
var th=this;
var isSys=0;
var timeSec=0;
if(props){
if('time_sec' in props)timeSec=props.time_sec;
if('system' in props && props.system)isSys=1;
}
var ts=getTimestamp();
mysql.query('INSERT INTO events_action (name,type,time_sec,start_ts,end_ts,create_time,is_system) VALUES (?,?,?,?,?,?,?)', [name,type,timeSec,start_ts,end_ts,ts,isSys], function(rows){
if(rows!=null && 'insertId' in rows){

var rowid=rows.insertId;
var ob={id:rowid,name:name,type:type,start_ts:start_ts,end_ts:end_ts,create_time:ts,is_start:0,is_end:0,num1:0,is_system:isSys,time_sec:timeSec,lastday:0};
th.waitList.push(ob);
th.eventAction('add',ob);
}
});
},

/*add:function(name,type,start_ts,end_ts){
var th=this;
var ts=getTimestamp();
mysql.query('INSERT INTO events_action (name,type,start_ts,end_ts,create_time) VALUES (?,?,?,?,?)', [name,type,start_ts,end_ts,ts], function(rows){
if(rows!=null && 'insertId' in rows){

var rowid=rows.insertId;
var ob={id:rowid,name:name,type:type,start_ts:start_ts,end_ts:end_ts,create_time:ts,is_start:0,is_end:0,num1:0,lastday:0};
th.waitList.push(ob);
th.eventAction('add',ob);
}
});
},*/

eventAction:function(t,el){
var th=this;
//var t5=curEventType;
if(el){
if(t=='add'){
console.log('add event',el);
}else if(t=='start'){
console.log('start event',el);
//if(el.type=='8marta')event8martaObj=el;
/*if(el.type==t5)eventType2Obj=el;
if(el.type==t5){
resetItems2Func();
}*/

if('collectionData' in el && el.collectionData && 'type' in el.collectionData && el.collectionData.type=='evDay'){
resetItems2Func();
}

if(el.is_system==0)updateAllUsersEventsList();
//th.notifyAllUsers('startEvent',el);
}else if(t=='end'){
console.log('end event',el);
//if(el.type==t5)eventType2Obj=null;

if(el.type=='prizeDay'){
th.addPrizeDayEvent();
sendPrizeTop('day');
}

//if(el.type=='8marta')event8martaObj=null;
if(el.is_system==0)updateAllUsersEventsList();
//th.notifyAllUsers('endEvent',el);
}
}
},

update:function(){
var th=this;
var ts=getTimestamp();
var poss=[];
for (var i = 0; i < th.waitList.length; i++) {
var el=th.waitList[i];
//console.log(el.start_ts-ts);
if(el.is_start==0 && ts>=el.start_ts){
el.is_start=1;
poss.push(i);
th.list.push(el);
th.eventAction('start',el);
mysql.query('UPDATE events_action SET is_start=? WHERE id=?', [1,el.id], function(rows){

});

}
}

if(poss.length>0){
poss.sort(function(a,b){return b-a;});
for (var i = poss.length-1; i >= 0; i--){
var pp=poss[i];
th.waitList.splice(pp,1);
}
poss=[];
}


for (var i = 0; i < th.list.length; i++) {
var el=th.list[i];
if(el.is_start==1 && el.is_end==0 && ts>=el.end_ts){
el.is_end=1;
poss.push(i);
th.eventAction('end',el);
mysql.query('DELETE FROM events_action WHERE id=?', [el.id], function(rows){
});
/*mysql.query('UPDATE events_action SET is_end=? WHERE id=?', [1,el.id], function(rows){
});*/
}
}

if(poss.length>0){
poss.sort(function(a,b){return b-a;});
for (var i = poss.length-1; i >= 0; i--){
var pp=poss[i];
th.list.splice(pp,1);
}
}


}

});
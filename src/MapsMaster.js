function MapsMaster(){
this.updateStatsItems=[];
this.updateScoresMaps=[];
this.updateScoresMapsObj={};
this.mapsIdsSelectObj=null;
this.isLoadMapsV1=false;
}
MapsMaster.prototype.init=function(cb){
var th=this;
th.loadMapsAllFunc1(function(ob){
if(typeof cb!=='undefined')cb();
});
};


MapsMaster.prototype.loadMapsAllFunc1=function(cb){
var th=this;
var limitPlay=20;
th.mapsIdsSelectObj=null;
var ob={};
var maps1=[];
var maps6=[];
/*var mapsScores1=[];
var mapsScores6=[];*/

ob['maps1']=maps1;
ob['maps6']=maps6;
/*ob['mapsScores1']=mapsScores1;
ob['mapsScores6']=mapsScores6;*/

mysql.query('SELECT id, mapLevel, scoreValue FROM maps WHERE playCount<'+limitPlay+' AND status=1 ORDER BY RAND()', [], function(rows){
if(rows!=null && rows.length>100){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
var mapid=el.id;
if(el.mapLevel>=mapLevelsUsers2){
maps6.push(mapid);
//if(el.scoreValue==0)mapsScores6.push(mapid);
}else{
maps1.push(mapid);
//if(el.scoreValue==0)mapsScores1.push(mapid);
}
}
//console.log(maps6,maps1)
th.mapsIdsSelectObj=ob;
if(typeof cb!=="undefined")cb(ob);
}else{

mysql.query('SELECT id, mapLevel, scoreValue FROM maps WHERE status=1 ORDER BY RAND()', [], function(rows){
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
var mapid=el.id;
if(el.mapLevel>=mapLevelsUsers2){
maps6.push(mapid);
//if(el.scoreValue==0)mapsScores6.push(mapid);
}else{
maps1.push(mapid);
//if(el.scoreValue==0)mapsScores1.push(mapid);
}
}
}
th.mapsIdsSelectObj=ob;
if(typeof cb!=="undefined")cb(ob);
});

}
});

};


MapsMaster.prototype.loadMapsAllFunc2=function(ob,isEasy,cb){
var th=this;
if(ob!=null){
mysql.query('SELECT id, mapLevel, scoreValue FROM maps WHERE status=1 ORDER BY RAND()', [], function(rows){
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
var mapid=el.id;
if(isEasy){
if(el.mapLevel>=mapLevelsUsers2){
}else{
ob.maps1.push(mapid);
}
}else{
if(el.mapLevel>=mapLevelsUsers2){
ob.maps6.push(mapid);
}
}
}
}
if(typeof cb!=="undefined")cb();
});
}
};

MapsMaster.prototype.update=function(){
var th=this;
this.updateAllStatsMap();
this.updateAllScoresMap();
};

MapsMaster.prototype.updateAllStatsMap=function(){
var th=this;
if(th.updateStatsItems.length>0){
var el=th.updateStatsItems[0];
th.updateStatsMapByID(el.id,el,function(v){
if(v==true){
th.updateStatsItems.shift();
}
th.updateAllStatsMap();
});
}
};

MapsMaster.prototype.updateStatsMapByID=function(id,o,cb){
var th=this;
if(o!=null){
//console.log('update map stats',id,o);

mysql.query('UPDATE maps SET likes=likes+?, dislikes=dislikes+?, winnerCount=winnerCount+?, playCount=playCount+?, exitCount=exitCount+?, endtimeCount=endtimeCount+? WHERE id=?', [o.likes,o.dislikes,o.winner,o.play,o.exit,o.endtime,id], function(rows){
if(rows!=null && 'affectedRows' in rows){
if(typeof cb!=='undefined')cb(true);
}else{
if(typeof cb!=='undefined')cb(false);
}
});
}
};

MapsMaster.prototype.removeMapStatsInfoByID=function(id){
var th=this;
for (var i = 0; i < th.updateStatsItems.length; i++) {
var el=th.updateStatsItems[i];
if(el.id==id){
th.updateStatsItems.splice(i,1);
return true;
}
}
return false;
};

MapsMaster.prototype.getMapStatsInfoByID=function(id){
var th=this;
var o=th.findMapStatsElByID(id);
if(o==null){
o={id:id,likes:0,dislikes:0,play:0,winner:0,exit:0,endtime:0};
th.updateStatsItems.push(o);
}
return o;
};

MapsMaster.prototype.findMapStatsElByID=function(id){
var th=this;
for (var i = 0; i < th.updateStatsItems.length; i++) {
var el=th.updateStatsItems[i];
if(el.id==id){
return el;
}
}
return null;
};










MapsMaster.prototype.updateAllScoresMap=function(){
var th=this;
if(th.updateScoresMaps.length>0){
var el=th.updateScoresMaps[0];
th.updateScoreMapByID(el.id,el,function(v){
if(v==true){
th.updateScoresMaps.shift();
}
th.updateAllScoresMap();
});
}
};

MapsMaster.prototype.updateScoreMapByID=function(id,o,cb){
var th=this;
if(o!=null){
//console.log('update map score',id,o);

var ob2=null;
var scoreCount=o.scoreCount;
if(id in th.updateScoresMapsObj)ob2=th.updateScoresMapsObj[id];
if(ob2!=null){
scoreCount=ob2.scoreCount;
}

mysql.query('UPDATE maps SET scoreValue=?, scoreUser=?, scoreTS=?, scoreCount=? WHERE id=?', [o.v,o.user,o.ts,scoreCount,id], function(rows){
if(rows!=null && 'affectedRows' in rows){
if(typeof cb!=='undefined')cb(true);
}else{
if(typeof cb!=='undefined')cb(false);
}
});
}
};

MapsMaster.prototype.updateMapScoreByID=function(id,scoreLast,score,scoreCount,user){
var th=this;
var o=th.findMapScoreElByID(id);
var ob2=null;
if(id in th.updateScoresMapsObj){
ob2=th.updateScoresMapsObj[id];
scoreLast=ob2.scoreLast;
scoreCount=ob2.scoreCount;
}
var rr=false;

if(score>0){
if(scoreLast<=0){
rr=true;
}else if(score<scoreLast){
rr=true;
}
}

if(rr){
if(o==null){
o={id:id};
th.updateScoresMaps.push(o);
}
o.v=score;
o.user=user;
o.scoreLast=score;
o.scoreCount=scoreCount;
th.updateScoresMapsObj[id]={scoreLast:score,scoreCount:scoreCount,user:user};
o.ts=getTimestamp();
return th.updateScoresMapsObj[id];
}
return null;
};

MapsMaster.prototype.getMapScoreInfoByID=function(id){
var th=this;
var o=th.findMapScoreElByID(id);
if(o==null){
o={id:id,v:0,user:0,ts:0};
th.updateScoresMaps.push(o);
}
return o;
};

MapsMaster.prototype.findMapScoreElByID=function(id){
var th=this;
for (var i = 0; i < th.updateScoresMaps.length; i++) {
var el=th.updateScoresMaps[i];
if(el.id==id){
return el;
}
}
return null;
};

MapsMaster.prototype.clearScores=function(cb){
var th=this;
mysql.query('UPDATE maps SET scoreValue=?, scoreUser=?, scoreTS=?, scoreCount=?', [0,0,0,0], function(rows){
th.updateScoresMaps=[];
th.updateScoresMapsObj={};
allTsTopScoresUpd=0;
topScoresUsersList=null;
if(typeof cb!=='undefined')cb();
});
};
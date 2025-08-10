function MainMapLevels(){
this.maps=[];
this.levelsCount=0;
}

MainMapLevels.prototype.init=function(cb){
this.reload(cb);
};

MainMapLevels.prototype.reload=function(cb){
var th=this;
this.maps=[];
this.levelsCount=0;
mysql.query('SELECT * FROM mainMap', [], function(rows){
if(rows!=null){
for (var i = 0; i < rows.length; i++) {
var el=rows[i];
var id=el.id;
var mapOb=el.data;
if(mapOb!=null){
try{
var dt=JSON.parse(mapOb);
var ob={id:id,name:el.name,map:dt};
th.maps.push(ob);
}catch(e){}
}
}
}
th.parseAllMaps();
if(typeof cb!=='undefined')cb();
});
};

MainMapLevels.prototype.parseAllMaps=function(){
this.levelsCount=0;
var minDogsTarget=20;
if(this.maps.length>0){
var id=1;
for (var i = 0; i < this.maps.length; i++) {
var el=this.maps[i];
var map=el.map;
this.levelsCount+=map.length;
for (var k = 0; k < map.length; k++) {
var ell=map[k];
ell.id=id;
if('targetCount' in ell && ell.targetCount<=0)ell.targetCount=minDogsTarget;
id+=1;
}
}
}
};

MainMapLevels.prototype.getMapByLevel=function(level,isparse){
if(typeof isparse=='undefined')isparse=true;
if(this.maps.length>0){
//level=16;
var elFirst=this.maps[0];
var pos=0;
var lvl=0;
var allLevels=0;
var sz=this.maps.length;
/*for (var i = 0; i < sz; i++) {
var el=this.maps[i];
var levelsCount=el.map.length;
if(level>=levelsCount && (pos+1)<=sz-1)pos+=1;
}*/
//if(level>=elFirst.map.length){
for (var i = 0; i < sz; i++) {
var el=this.maps[i];
var levelsCount=el.map.length;
allLevels+=levelsCount;
//if((pos+1)<=sz-1)pos+=1;
//console.log('ttt',level,allLevels,level<allLevels);
if(level<allLevels){
//break;
}else{
if((pos+1)<=sz-1)pos+=1;
}
//}
}

var el=this.maps[pos];
//console.log('aaa',pos);
var ob=el;
if(isparse)ob=this.parse(el);
return ob;
}
return el;
};


MainMapLevels.prototype.getMapEditorByLevel=function(level){
if(this.maps.length>0){
//level=16;
var elFirst=this.maps[0];
var pos=0;
var lvl=0;
var allLevels=0;
var sz=this.maps.length;
for (var i = 0; i < sz; i++) {
var el=this.maps[i];
var levelsCount=el.map.length;
allLevels+=levelsCount;
if(level<allLevels){
}else{
if((pos+1)<=sz-1)pos+=1;
}
}

var el=this.maps[pos];
return el;
}
return el;
};


MainMapLevels.prototype.getMapByID=function(id){
for (var i = 0; i < this.maps.length; i++) {
var el=this.maps[i];
if(el.id==id)return el;
}
/*id-=1;
if(id<this.maps.length){
var el=this.maps[id];
return el;
}*/
return null;
};

MainMapLevels.prototype.getMapInfoByLocalLevel=function(o,localLevel){
if(o!=null && o.map!=null){
var levels=o.map;
if(localLevel<=1)localLevel=1;
localLevel-=1;
if(localLevel<levels.length){
var lvl=levels[localLevel];
return lvl;
}
}
return null;
};


MainMapLevels.prototype.getTargetCountMap=function(o){
if(o!=null){
if('targetCount' in o){
return o.targetCount;
}
}
return 0;
};

MainMapLevels.prototype.getActionsListLevel=function(o){
var a=[];
if(o!=null){
if('actions' in o && o.actions!=null)a=o.actions;
}
return a;
};

MainMapLevels.prototype.findPosMapLevelByLevel=function(o,level){
if(o!=null){
for (var i = 0; i < o.length; i++){
var el=o[i];
if(el.id==level){
return i;
}
}
}
return -1;
};

MainMapLevels.prototype.getLocalLevel=function(level){
var allLevels=0;
var vv=0;
var pos=0;
var v=level;
var sz=this.maps.length;
if(sz>0){
var elFirst=this.maps[0];
if(level>=elFirst.map.length){
for (var i = 0; i < sz; i++) {
var el=this.maps[i];
var levelsCount=el.map.length;
allLevels+=levelsCount;
if(allLevels>level){
//v=this.findPosMapLevelByLevel(el.map,level)+1;

v=levelsCount-(allLevels-level);

//console.log('yyy',v,lvll);
//return lvll;
break;
}
}
}
//if(allLevels>0)v=allLevels-level;
if(level>=this.levelsCount)v=this.maps[sz-1].map.length;
}
//if(allLevels>0)v=allLevels-level;
//if(level>=this.levelsCount)v=allLevels;
//console.log('level',allLevels,level,v,level>=this.levelsCount);
if(v<=0)v=1;
return v;
};

MainMapLevels.prototype.parseActionsLevel=function(a){
var arr=[];
if(a!=null){
for (var i = 0; i < a.length; i++) {
var el=a[i];
if('t' in el && 'v' in el){
arr.push([el.t,el.v]);
}
}
}
return arr;
};

MainMapLevels.prototype.parse=function(o){
if(o!=null){
var arr=o.map;
var items=[];
for (var i = 0; i < arr.length; i++) {
var el=arr[i];
var id=el.id;
var x=el.x;
var y=el.y;
var target=0;
if('targetCount' in el)target=el.targetCount;
var actions=[];
if('actions' in el && el.actions!=null)actions=this.parseActionsLevel(el.actions);
var aa=[id,x,y,target,actions];
items.push(aa);
}
return {id:o.id,name:o.name,map:items};
}
};
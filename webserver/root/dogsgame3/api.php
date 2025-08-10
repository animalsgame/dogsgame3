<?php
//ini_set('display_errors',1);

function connectMySQL($dbname, $dbuser, $dbpass){
try{
$c=new PDO("mysql:host=127.0.0.1;dbname=".$dbname.";charset=utf8", $dbuser, $dbpass);
return $c;
}catch(PDOException $e) {
}
return null;
}

$domainName=$_SERVER['HTTP_HOST'];
$mysql=connectMySQL('dogsgame3','root','');
$authUserID=-1;
$tokenApiVK='';
$groupID=175397689;
$appVKInfo=array('id'=>6787147,'secret'=>'h4pprDVRckPTzQA1IlZz');
$ssServiceKey='reg_fbaae08418c0240af45c7823c817a32b'; // ключ для загрузки скриншота на сервис ag6
$secretKeyAuth='iJhEpglvgbUFuhc0YcrvdAWTHpnBQ8'; // ключ для работы с api в php, подпись создаётся в nodejs
$authKeyUser='';
$adminIP='127.0.0.1';
$domainName=$_SERVER['HTTP_HOST'];

$userRoles=array(
'USER'=>0,
'MODERATOR'=>1<<1,
'ADMIN'=>1<<2,
'SUPER_ADMIN'=>1<<3,
'MOD_MAPS'=>1<<4,
'MOD_MAPS_M'=>1<<5,
'MODERATOR_M'=>1<<6
);

function URL_post($url, $params, $parse = false){
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_POST, 1);
//curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($params));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 5);
$result = curl_exec($curl);
curl_close($curl);
if ($parse) {
$result = json_decode($result, true);
}
return $result;
}


// старший модератор чата
function isModerator($m){
global $userRoles;
if($m>0 && ($userRoles['MODERATOR']&$m)>0)return true;
return false;
}

// младший модератор чата
function isModeratorM($m){
global $userRoles;
if($m>0 && ($userRoles['MODERATOR_M']&$m)>0)return true;
return false;
}

// старший модератор карт
function isModeratorMaps($m){
global $userRoles;
if($m>0 && ($userRoles['MOD_MAPS']&$m)>0)return true;
return false;
}

// младший модератор карт
function isModeratorMapsM($m){
global $userRoles;
if($m>0 && ($userRoles['MOD_MAPS_M']&$m)>0)return true;
return false;
}

// админ
function isAdmin($m){
global $userRoles;
if($m>0 && ($userRoles['ADMIN']&$m)>0)return true;
return false;
}

// главный админ
function isSuperAdmin($m){
global $userRoles;
if($m>0 && ($userRoles['SUPER_ADMIN']&$m)>0)return true;
return false;
}

// админ или главный админ
function isAdminOrSuperAdmin($m){
global $userRoles;
if(isAdmin($m))return true;
if(isSuperAdmin($m))return true;
return false;
}

// админ или модератор
function isAdminOrModerator($m){
global $userRoles;
if(isAdmin($m))return true;
if(isSuperAdmin($m))return true;
if(isModerator($m))return true;
return false;
}

// младший или старший модератор карт
function isModMapsAll($m){
global $userRoles;
if(isModeratorMaps($m))return true;
if(isModeratorMapsM($m))return true;
return false;
}

// младший или старший модератор чата
function isModAll($m){
global $userRoles;
if(isModerator($m))return true;
if(isModeratorM($m))return true;
return false;
}

function genSignKeyAccountVK($uid){
global $appVKInfo;
$hash = md5($appVKInfo['id'].'_'.$uid.'_'.$appVKInfo['secret']);
return 'vk_'.$uid.'_'.$hash;
}

/*
echo genSignKeyAccountVK(57028472);
exit;
*/

function apiVK($m,$params){
global $tokenApiVK;
$ob=URL_post('https://api.vk.com/method/'.$m.'?v=5.88&access_token='.$tokenApiVK,$params,true);
return $ob;
}

function CheckAdmin(){
global $adminIP;
if($_SERVER['REMOTE_ADDR']==$adminIP){
return true;
}
return false;
}

function generateSignatureAuth($id){
global $secretKeyAuth;
$ts=time();
$s=$id.'_'.$ts.'_'.$secretKeyAuth;
$sign=$id.'_'.$ts.'_'.md5($s);
return $sign;
}

function getAndCheckSignatureKey($key){
global $secretKeyAuth;
if($key !=null && strlen($key)>0){
$spl=explode('_',$key);
if(count($spl)>2){
$userid=intval($spl[0]);
$ts=$spl[1];
$hash=$spl[2];
$q=md5($userid.'_'.$ts.'_'.$secretKeyAuth);
if($q===$hash){
return array('id'=>$userid);
}
}
}
return null;
}

//echo generateSignatureAuth(1);

function sendJSON($o){
header("Content-Type: application/json");
$dt=json_encode(array('args'=>$o));
echo $dt;
exit;
}

function sendErrorJSON($o){
header("Content-Type: application/json");
$dt=json_encode($o);
echo $dt;
exit;
}

$data=array();
$GetEnable=1;
if($_POST){foreach($_POST as $k => $v)$data[$k]=$v;}
if($GetEnable==1){
if($_GET){foreach($_GET as $k => $v)$data[$k]=$v;}
}

function getAllMapsIds(){
global $mysql;
$arr=array();
$STH=$mysql->prepare('SELECT id,user FROM maps ORDER BY time DESC');
$STH->execute(array());
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
array_push($arr,intval($row['id']));
//array_push($arr,array(intval($row['id']),intval($row['user'])));
}
return $arr;
}

function getRandomIdMap(){
global $mysql;
$STH = $mysql->prepare("SELECT id FROM maps WHERE status=? ORDER BY RAND() LIMIT 1");
$STH->execute(array(1));
$STH->setFetchMode(PDO::FETCH_ASSOC);
if($row = $STH->fetch()){
return intval($row['id']);
}
return 0;
}

function getShopGiftsList($t){
global $mysql, $domainName;
$arr=array();
$STH=$mysql->prepare('SELECT * FROM shop WHERE type=? AND active=? ORDER BY price ASC');
$STH->execute(array(1,1));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
$url=$row['url'];//'https://'.$domainName.'/dogsgame3/gifts/'.$row['url'];
if($t==1){
$ob=parseGiftDB($row);
if($ob){
array_push($arr,$ob);
}
}else{
array_push($arr,array(intval($row['itemid']),$row['name'],intval($row['price']),$url));	
}
}
return $arr;
}

function getShopGiftInfoByID($id){
global $mysql, $domainName;
$STH=$mysql->prepare('SELECT * FROM shop WHERE type=? AND itemid=?');
$STH->execute(array(1,$id));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
$url='http://'.$domainName.'/dogsgame3/gifts/'.$row['url'];
return array('id'=>intval($row['itemid']),'name'=>$row['name'],'price'=>intval($row['price']),'url'=>$url);
}
return null;
}

function getUserInfoByIP($ip){
global $mysql;
if(strlen($ip)>0){
$STH=$mysql->prepare('SELECT id,login,nick,mode FROM users WHERE ip=? LIMIT 1');
$STH->execute(array($ip));
$STH->setFetchMode(PDO::FETCH_ASSOC);
if($row = $STH->fetch()){
return array('id'=>intval($row['id']),'login'=>correctLoginUser($row['login']),'nick'=>$row['nick']);
}
}
return null;
}


function getUserInfoByLogin($login){
global $mysql;
if(strlen($login)>0){
$STH=$mysql->prepare('SELECT id,login,nick,mode FROM users WHERE login=? LIMIT 1');
$STH->execute(array($login));
$STH->setFetchMode(PDO::FETCH_ASSOC);
if($row = $STH->fetch()){
return array('id'=>intval($row['id']),'login'=>correctLoginUser($row['login']),'nick'=>$row['nick']);
}
}
return null;
}

function isUserLoginReg($v){
if($v && strlen($v)>2 && substr($v,0,3)=='reg')return true;
return false;
}

function correctLoginUser($s){
$loginS=$s;
if($loginS && strlen($loginS)>1 && substr($loginS,0,2)=='yg')$loginS='yg';
else if(isUserLoginReg($loginS))$loginS='reg';
return $loginS;
}

function getUsersByIds($ids){
global $mysql;
$arr=array();
$nums=count($ids);
if($nums>0){
$s=implode(',',array_fill(0,$nums,'?'));
for($i = 0; $i < $nums; $i++)$ids[$i]=intval($ids[$i]);
$STH=$mysql->prepare('SELECT id,login,sex,popular,nick,mode FROM users WHERE id IN('.$s.')');
$STH->execute($ids);
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
array_push($arr,array('id'=>intval($row['id']),'login'=>correctLoginUser($row['login']),'nick'=>$row['nick'],'mode'=>intval($row['mode'])));
//array_push($arr,array(intval($row['id']),$row['login'],intval($row['sex']),intval($row['popular']),$row['nick'],intval($row['mode'])));
}
}
return $arr;
}


function getVKGroupMods(){
global $mysql;
$arr=array();
return $arr;
}

function getMapsByIds($ids){
global $mysql, $authUserID;
$arr=array();
$nums=count($ids);
$userData=null;
$isModMaps=false;
if($authUserID>0){
$userData=findUserInfoByID($authUserID);
if($userData){
$isModMaps=isModMapsAll($userData['mode']);
}
}

if($nums>0){
$s=implode(',',array_fill(0,$nums,'?'));
for($i = 0; $i < $nums; $i++){
$idd=intval($ids[$i]);
if($idd>0 && $idd<5){
$idd=getRandomIdMap();
}
$ids[$i]=$idd;
}

$STH=$mysql->prepare('SELECT * FROM maps WHERE id IN('.$s.')');
$STH->execute($ids);
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
$mapid=intval($row['id']);
$mapLevel=intval($row['mapLevel']);
$status=intval($row['status']);
$userID=intval($row['user']);
$isworld=intval($row['isworld']);
if($mapLevel<=1)$mapLevel=1;
$mapObj=json_decode($row['map'],true);
if($mapObj!=null){
$mapObj['id']=$mapid;
$mapObj['user']=$userID;
$mapObj['timestamp']=intval($row['time']);
$mapObj['status']=$status;
$mapObj['mapLevel']=$mapLevel;
$mapObj['isworld']=$isworld;
$scoreUser=intval($row['scoreUser']);
$scoreVal=intval($row['scoreValue']);
//if($status==1){
if($status>0){
if($scoreUser!=0){
$mapObj['scoreInfo']=array('user'=>$scoreUser,'v'=>$scoreVal);
}
}

if($status>0){
if($userID==$authUserID || $isModMaps)$mapObj['statsInfo']=array('likes'=>intval($row['likes']),'dislikes'=>intval($row['dislikes']),'winner'=>intval($row['winnerCount']),'play'=>intval($row['playCount']),'exit'=>intval($row['exitCount']),'endtime'=>intval($row['endtimeCount']));
}

if($status>1 && strlen($row['txt1'])>0)$mapObj['txt1']=$row['txt1'];
}
array_push($arr,array('id'=>$mapid,'map'=>$mapObj));
}
}
return $arr;
}

function getAllUsersMaps(){
global $mysql;
$arr=array();
$STH=$mysql->prepare('SELECT DISTINCT(user) FROM maps');
$STH->execute(array());
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
array_push($arr,intval($row['user']));
}
return $arr;
}

function parseGiftDB($row){
if($row){
$url=$row['url'];
$ob=array('id'=>intval($row['itemid']),'name'=>$row['name'],'txt'=>$row['txt'],'price'=>intval($row['price']),'url'=>$url);
$ob['price_type']=intval($row['price_type']);
return $ob;
}
return null;
}

function getGiftsUser($user){
global $mysql;
$userid=$user;
$count=0;
$pids=array();
$gifts=(object)array();
$ob=array();
$arr=array();
$users=array();
$usersIds=array();
$STH=$mysql->prepare('SELECT id, ot, itemid, num FROM usersItems WHERE type=? AND user=? ORDER BY ot ASC');
$STH->execute(array(1,$userid));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
$ot=intval($row['ot']);
$num=intval($row['num']);
$itemid=intval($row['itemid']);
$count+=$num;
if(!isset($users[$ot]))$users[$ot]=array();
array_push($users[$ot],array(intval($row['id']),$itemid,$num));

if(!isset($ob[$itemid])){
$ob[$itemid]=1;
array_push($pids,$itemid);
}

}

foreach($users as $user=>$a){
array_push($arr,array($user,$a));
array_push($usersIds,$user);
}

$nums=count($pids);
if($nums>0){
$s=implode(',',array_fill(0,$nums,'?'));
array_push($pids,1);
$STH=$mysql->prepare('SELECT * FROM shop WHERE id IN('.$s.') AND type=?');
$STH->execute($pids);
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
$ob=parseGiftDB($row);
if($ob){
$giftid=$ob['id'];
$gifts->{$giftid}=$ob;
}
}
}


//$sell=calcSellAllGiftsUser($userid);
$ob=array('sellPrice'=>0,'count'=>$count,'items'=>$arr,'users'=>$usersIds,'gifts'=>$gifts);
return $ob;
}

function getPaymentHistory($user){
global $mysql;
$arr=array();
$STH=$mysql->prepare('SELECT * FROM moneyHistory WHERE user=? ORDER BY time DESC');
$STH->execute(array($user));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
array_push($arr,array(intval($row['id']),intval($row['type']),intval($row['value']),intval($row['time'])));
}
return $arr;
}

function calcSellAllGiftsUser($user){
global $mysql;
$v=0;
$STH=$mysql->prepare('SELECT shop.price as gift_price, shop.price_type, shop.name as gift_name, usersItems.itemid as item_id, usersItems.ot as item_ot, usersItems.num as item_num FROM usersItems INNER JOIN shop on shop.itemid=usersItems.itemid WHERE usersItems.type=? AND usersItems.user=?');
$STH->execute(array(1,$user));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
$gift_price=intval($row['gift_price']);
$num=intval($row['item_num']);
$allPrice=floor(($gift_price*$num)*0.5);
$v+=$allPrice;
}
return $v;
}


function calcSellGiftUser($id,$user){
global $mysql;
$v=-1;
$STH=$mysql->prepare('SELECT shop.price as gift_price, shop.price_type, usersItems.num as item_num FROM usersItems INNER JOIN shop on shop.itemid=usersItems.itemid WHERE usersItems.type=? AND usersItems.user=? AND usersItems.id=?');
$STH->execute(array(1,$user,$id));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
if($v==-1)$v=0;
$gift_price=intval($row['gift_price']);
$num=intval($row['item_num']);
$allPrice=floor(($gift_price*$num)*0.5);
$v+=$allPrice;
}
return $v;
}

function getPaymentListVK(){
global $mysql;
$arr=array();
$STH=$mysql->prepare('SELECT * FROM payment_price WHERE social=? AND type=?');
$STH->execute(array('vk','kosti'));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
array_push($arr,array('id'=>intval($row['id']),'price'=>intval($row['price']),'votes'=>intval($row['votes'])));
}
return $arr;
}


function findUserInfoByID($idd){
global $mysql;
$STH = $mysql->prepare("SELECT id, nick, login, mode FROM users WHERE id=?");
$STH->execute(array($idd));
$STH->setFetchMode(PDO::FETCH_ASSOC);
if($row = $STH->fetch()){
$id=intval($row['id']);
return array('id'=>$id,'nick'=>$row['nick'],'login'=>correctLoginUser($row['login']),'mode'=>intval($row['mode']));
}
return null;
}

if(!$mysql){
sendErrorJSON(array('errorText'=>'Проблема с базой данных'));
exit;
}

//echo calcSellAllGiftsUser(1);


if(isset($data['key'])){
$authKeyUser=$data['key'];
}
$userObjAuth=getAndCheckSignatureKey($authKeyUser);
if($userObjAuth!=null && isset($userObjAuth['id'])){
$authUserID=$userObjAuth['id'];
}

if(isset($data['c'])){
$type=$data['c'];

if($type=='main.newversion'){
$vv=0;
if($authUserID>0){
$STH = $mysql->prepare("UPDATE users SET nversion=? WHERE id=?");
$STH->execute(array(0,$authUserID));
$STH->setFetchMode(PDO::FETCH_ASSOC);
$vv=1;
}
sendJSON(array($vv));
}else if($type=='maps.getAllIdsStatus'){
$status=-1;
$arr=array();
if(isset($data['status']))$status=intval($data['status']);
//if($status==1)$arr=array(1,2,3,4);
$field='id';
//if($status==1)$field='approved_time';
$STH=$mysql->prepare("SELECT id FROM maps WHERE status=? ORDER BY ".$field." DESC");
$STH->execute(array($status));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
array_push($arr,intval($row['id']));
}
if($status==1){
array_push($arr,1);
//for($i=0;$i<4;$i++)array_push($arr,$i+1);
}
sendJSON(array($arr));
}else if($type=='maps.getMapsByUser'){
$userid=0;
$arr=array();
if(isset($data['user']))$userid=intval($data['user']);
$STH=$mysql->prepare("SELECT id, status FROM maps WHERE user=? ORDER BY id DESC");
$STH->execute(array($userid));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
array_push($arr,intval($row['id']));
}
sendJSON(array($arr));
}else if($type=='maps.findByText'){
$txt='';
$ids=array();
if($authUserID>0){
$userData=findUserInfoByID($authUserID);
if($userData && isModMapsAll($userData['mode'])){
if(isset($data['txt']))$txt=$data['txt'];
if(mb_strlen($txt,'UTF-8')>1){
$STH=$mysql->prepare('SELECT id FROM maps WHERE map LIKE ? LIMIT 100');
$STH->execute(array('%'.$txt.'%'));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
array_push($ids,intval($row['id']));
}
}
}
}
sendJSON(array($ids));
}else if($type=='maps.findByTT'){
$tt='';
$ids=array();
if(isset($data['t']))$tt=$data['t'];
if(strlen($tt)>0){
$STH=$mysql->prepare('SELECT * FROM ttmaps WHERE type=?');
$STH->execute(array($tt));
$STH->setFetchMode(PDO::FETCH_ASSOC);
if($row = $STH->fetch()){
$ids=json_decode($row['data']);
if(!$ids)$ids=array();
$t1='';
if(isset($row['tt']) && $row['tt']!=null)$t1=$row['tt'];

if($t1=='maps_easy'){
$STH=$mysql->prepare('SELECT id FROM maps WHERE mapLevel<? AND status=1 ORDER BY time DESC');
$STH->execute(array(6));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row2 = $STH->fetch()){
array_push($ids,intval($row2['id']));
}
}else if($t1=='maps_hard'){
$STH=$mysql->prepare('SELECT id FROM maps WHERE mapLevel>=? AND status=1 ORDER BY time DESC');
$STH->execute(array(6));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row2 = $STH->fetch()){
array_push($ids,intval($row2['id']));
}
}
}
}
sendJSON(array($ids));
}else if($type=='maps.w2map'){
$res=0;
$vv=0;
$t1=0;
if(isset($data['id']))$vv=intval($data['id']);
if(isset($data['t1']))$t1=intval($data['t1']);
if($vv<=0)$vv=0;
if($authUserID>0){
if($t1==0 || $t1==1){
$STH=$mysql->prepare('SELECT id, status, isworld FROM maps WHERE id=? AND user=? AND status>1');
$STH->execute(array($vv,$authUserID));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
$idd=intval($row['id']);
$isworld=intval($row['isworld']);
$STH = $mysql->prepare("UPDATE maps SET isworld=? WHERE id=?");
$STH->execute(array($t1,$idd));
$STH->setFetchMode(PDO::FETCH_ASSOC);
if($STH->rowCount()>0){
$res=1;
}
}
}
}
sendJSON(array($res));
}else if($type=='maps.findByCountItems'){
$vv=0;
$ids=array();
if(isset($data['v']))$vv=intval($data['v']);
if($vv<=0)$vv=0;
$STH=$mysql->prepare('SELECT id FROM maps WHERE itemsCount>=? AND status=? ORDER BY itemsCount ASC');
$STH->execute(array($vv,1));
$STH->setFetchMode(PDO::FETCH_ASSOC);
while($row = $STH->fetch()){
$idd=intval($row['id']);
array_push($ids,$idd);
}
sendJSON(array($ids));
}else if($type=='maps.getAllIds'){
$v=getAllMapsIds();
sendJSON(array($v));
}else if($type=='maps.getAllUsersMaps'){
$v=getAllUsersMaps();
sendJSON(array($v));
}else if($type=='maps.get'){
$id=array();
if(isset($data['id']))$id=explode(',',$data['id']);
$v=getMapsByIds($id);
sendJSON(array($v));	
}
else if($type=='user.getGifts'){
$v=null;
if($authUserID!=-1)$v=getGiftsUser($authUserID);
sendJSON(array($v));
}else if($type=='user.authServiceSS'){
$v=null;
if($authUserID!=-1){
$u=findUserInfoByID($authUserID);
if($u!=null){
$v=$ssServiceKey;
}
}
sendJSON(array($v));
}else if($type=='users.get'){
$id=array();
if(isset($data['id']))$id=explode(',',$data['id']);
$v=getUsersByIds($id);
sendJSON(array($v));
}else if($type=='users.vkGroupMods'){
$v=getVKGroupMods();
sendJSON(array($v));
}else if($type=='users.getMy'){
$ip=$_SERVER['REMOTE_ADDR'];
$v=getUserInfoByIP($ip);
sendJSON(array($v));
}else if($type=='shop.giftsList'){
$id=array();
$t2=0;
if(isset($data['t']) && $data['t']=='obj')$t2=1;
$v=getShopGiftsList($t2);
sendJSON(array($v));
}else if($type=='shop.giftInfo'){
$id=0;
if(isset($data['id']))$id=intval($data['id']);
$v=getShopGiftInfoByID($id);
sendJSON(array($v));
}else if($type=='shop.paymentsList'){
$v=array();
if($authUserID!=-1){
$v=getPaymentListVK();	
}
sendJSON(array($v));
}else if($type=='shop.paymentHistory'){
$v=array(0);
if($authUserID!=-1){
$v=array(1,getPaymentHistory($authUserID));	
}
sendJSON($v);
}else if($type=='main.getPopUpText'){
$ob=null;
$id='';
$myUser=null;
if($authUserID>0)$myUser=findUserInfoByID($authUserID);

if(isset($data['id']))$id=$data['id'];
if($id!=null && strlen($id)>0){
$t2='type';
$id2=intval($id);
if($id2>0){ // если указан id, тогда поиск будет по id
$t2='id';
$id=$id2;
}
$STH=$mysql->prepare("SELECT * FROM popuptext WHERE ".$t2."=?");
$STH->execute(array($id));
$STH->setFetchMode(PDO::FETCH_ASSOC);
if($row = $STH->fetch()){
$access=intval($row['access']);
$rr=true;
if($access>0){
if($myUser!=null && ($myUser['mode']&$access)>0){
}else{
$rr=false;
}
}
if($rr){
$txt=$row['text'];
if(intval($row['id'])==2 || intval($row['id'])>3)$txt='Версия игры не поддерживает этот контент.';
//$txt=str_replace("\r","",$txt);
$ob=array('id'=>intval($row['id']),'t'=>intval($row['t']),'name'=>$row['name'],'text'=>$txt);
}
}
}
sendJSON(array($ob));
}

}

$cmdStr='';
if(isset($data['c']))$cmdStr=$data['c'];
sendErrorJSON(array('errorText'=>'Команда "'.$cmdStr.'" не найдена'));
?>
<?php
header('Access-Control-Allow-Origin: *'); 
$vkApiTokenRefresh = "";

$OdApiPublicKey = "";
$OdApiSecretKey = "";
$OdApiTokenRefresh = "";

$MmApiAppID = 0;
$MmApiSecretKey = "";
$MmApiTokenRefresh = "";
$MmApiRefreshSecret = "";

$method='';
$redis=null;
define("site_domain", "animals-game.ru");

$blackListAva=array();

function isBlackListLogin($login){
global $blackListAva;
if($login!=null){
for ($i = 0; $i < count($blackListAva); $i++){
if($login==$blackListAva[$i])return true;
}
}
return false;
}

if(!isset($data))$data=array();
if($_GET){
foreach ($_GET as $k => $v)$data[$k]=$v;
}
if($_POST){
foreach ($_POST as $k => $v)$data[$k]=$v;
}

if(isset($data["c"]))$method = $data["c"];
if($method!='')header("Content-Type: application/json");
if($method!=''){
if($method == "users.get"){
$a=array();
if(isset($data["id"])){
$a=GetAppUsersInfoByIDS($data["id"]);
}else if(isset($data["user_ids"])){
$users = explode(",",$data["user_ids"]);
for ($i = 0; $i < count($users); $i++) $users[$i]='vk'.$users[$i];
$a=GetAppUsersInfoByIDS($users);
echo json_encode(array('response'=>$a));
exit;
}
echo json_encode(array('data'=>$a));
}
}


function GetAppUsersInfoByIDS($users){
global $main_db;
if($users){
if(is_string($users))
$users = explode(",", $users);
$arr=array();
for ($i = 0; $i < count($users); $i++) {
$vv=$users[$i];
if($vv!=''){
$rr=ParseLoginSocials(0,$vv);
if($rr!=null)
$arr[]=$rr;
}
}
return GetUsersApiSocials($arr,null);
}
return null;
}

function ParseLoginSocials($iduser, $q){
$obj = (object)Array();
$login = $q;
if(strlen($login) > 2){
$social = substr($login, 0, 2);
$login = substr($login, 2);

$obj->iduser = $iduser;
$obj->name = $social;
$obj->v = (string)$login;

if($social == "vk" || $social == "od" || $social == "mm" || $social == "fb" || $social == "tw"){
return $obj;
}
}

return null;
}


function GetUsersApiSocials($users, $dbobj){
global $redis, $OdApiPublicKey, $OdApiSecretKey, $MmApiAppID, $MmApiSecretKey;

$cl = array();
$expEnd=60*60*3;
$arr3=array();
$VkUsersStrs = array();
$OdUsersStrs = array();
$MmUsersStrs = array();
$FbUsersStrs = array();
$ids_users_obj = new stdClass();
if($users){
for ($i = 0; $i < count($users); $i++) {
$uu=$users[$i];
$fullLoginSocial=$uu->name.$uu->v;
$login_social=$uu->v;
$ids_users_obj->{$uu->{"name"}.$login_social} = $uu->{"iduser"};

$nm='socialApiUser:'.$fullLoginSocial;

if($redis!=null && $redis->exists($nm)){
$dt=$redis->get($nm);
array_push($arr3, array('login'=>$fullLoginSocial,'social'=>$uu->name,'data'=>json_decode($dt,true)));
}else{

if(isset($users[$i]->{"name"})){
if($users[$i]->{"name"} == "vk"){
array_push($VkUsersStrs, (string)$users[$i]->v);
}else if($users[$i]->{"name"} == "od"){
array_push($OdUsersStrs, (string)$users[$i]->v);
}else if($users[$i]->{"name"} == "mm"){
array_push($MmUsersStrs, (string)$users[$i]->v);
}else if($users[$i]->{"name"} == "fb"){
array_push($FbUsersStrs, (string)$users[$i]->v);
}
}
}
}
}

if(count($VkUsersStrs) > 0){
$token = SocialRefreshToken("vk");
if($token && $token != ""){
$userInfo = post('https://api.vk.com/method/users.get', array('v'=>'5.88','access_token'=>$token,'user_ids' => $VkUsersStrs,'fields' => 'first_name,last_name,sex,photo_50,photo_100,photo_200', "lang" => "ru"));           
if (isset($userInfo['response'])) {
$arr = $userInfo['response'];
for ($i = 0; $i < count($arr); $i++){
$login_social = "vk".$arr[$i]["id"];
$c = GetApiUserInfoObjSocials($ids_users_obj->{$login_social}, "vk", $arr[$i]);
$cl[]=$c;
$nm='socialApiUser:'.$login_social;
if($redis!=null){
$redis->set($nm,json_encode($c));
$redis->expire($nm,$expEnd);
}

}
}
}
}


if(count($OdUsersStrs) > 0){
$token = SocialRefreshToken("od");
if($token){
$params = array('method' => 'users.getInfo','access_token' => $token,'application_key' => $OdApiPublicKey,'uids' => implode(",", $OdUsersStrs),'fields' => 'uid,first_name,last_name,pic_1,pic_2,pic_3','format'=> 'json');
$sign = sign_server_server_OD($params, $token.$OdApiSecretKey);
$params["sig"] = $sign;
$userInfo = post('http://api.odnoklassniki.ru/fb.do', $params);
}

if (isset($userInfo)) {
$arr = $userInfo;
for ($i = 0; $i < count($arr); $i++){
$login_social = "od".$arr[$i]["uid"];
$c = GetApiUserInfoObjSocials($ids_users_obj->{$login_social}, "od", $arr[$i]);
$cl[]=$c;

$nm='socialApiUser:'.$login_social;
if($redis!=null){
$redis->set($nm,json_encode($c));
$redis->expire($nm,$expEnd);
}

}
}
}

if(count($MmUsersStrs) > 0){
$token = SocialRefreshToken("mm");
if($token){
$uids = implode(",", $MmUsersStrs);
$params = array('method' => 'users.getInfo','app_id' => $MmApiAppID,'session_key' => $token,'secure' => 1,'uids' => $uids);
$sign = sign_server_server_MM($params,$MmApiSecretKey);
$params["sig"] = $sign;
$userInfo = post('https://www.appsmail.ru/platform/api', $params);
}    
if (isset($userInfo)) {
$arr = $userInfo;
for ($i = 0; $i < count($arr); $i++){
$login_social = "mm".$arr[$i]["uid"];
$c = GetApiUserInfoObjSocials($ids_users_obj->{$login_social}, "mm", $arr[$i]);
$cl[]=$c;

$nm='socialApiUser:'.$login_social;
if($redis!=null){
$redis->set($nm,json_encode($c));
$redis->expire($nm,$expEnd);
}

}
}
}


if(count($FbUsersStrs) > 0){
$arr = $FbUsersStrs;
for ($i = 0; $i < count($arr); $i++){
$login_social = "fb".$arr[$i]["uid"];
$c = GetApiUserInfoObjSocials($ids_users_obj->{$login_social}, "fb", $arr[$i]);
$cl[]=$c;

$nm='socialApiUser:'.$login_social;
if($redis!=null){
$redis->set($nm,json_encode($c));
$redis->expire($nm,$expEnd);
}

}
}


for ($i = 0; $i < count($arr3); $i++){
$ob = $arr3[$i];
$c = GetApiUserInfoObjSocials($ob['login'], $ob['social'], $ob['data']);
$cl[]=$c;
}


return $cl;
}


function GetApiUserInfoObjSocials($userid, $pref, $o){
global $data;
$social_str = "";
$social_link = "";

$belkiAvaURL = "https://".site_domain."/belkigame2/logo278.png?v=1";

$social_user_id = (isset($o['uid'])) ? $o["uid"] : 0;

$photo_50_field = "photo_50";
$photo_100_field = "photo_100";
$photo_200_field = "photo_200";
$login = $pref.$social_user_id;

switch ($pref) {
	case 'vk':
	$social_str = "Вконтакте";
	$social_user_id = $o["id"];
	$login = $pref.$social_user_id;
	$social_link = "https://vk.com/id".$social_user_id;

	break;

	case 'mm':

	$social_str = "Мой Мир";

	if(!isset($o[$photo_50_field]))$photo_50_field = "pic_small";
	if(!isset($o[$photo_100_field]))$photo_100_field = "pic_big";
	if(!isset($o[$photo_200_field]))$photo_200_field = "pic_190";
	
	if(isset($o["link"])) $social_link = $o["link"];
	
	break;

	case 'od':

	if(!isset($o[$photo_50_field]))$photo_50_field = "pic_1";
	if(!isset($o[$photo_100_field]))$photo_100_field = "pic_2";
	if(!isset($o[$photo_200_field]))$photo_200_field = "pic_3";
	$social_str = "Одноклассники";

	$social_link = "https://ok.ru/profile/".$social_user_id;
	
	break;

	case 'fb':

	$photo_50_field = "http://graph.facebook.com/".$social_user_id."/picture";
	
	$social_link = "https://www.facebook.com/app_scoped_user_id/".$social_user_id;

	$social_str = "Facebook";


	break;
	
	default:break;
}

$c = new stdClass();
$c->id = $social_user_id;
$c->uid = $social_user_id;
$c->first_name = (isset($o["first_name"])) ? $o["first_name"] : "";
$c->last_name = (isset($o["last_name"])) ? $o["last_name"] : "";
if(isset($o[$photo_50_field])){
$photo_link = $o[$photo_50_field];

/*if($photo_link){
if(strpos($photo_link, "images/deactivated") > -1){
$photo_link = "https://".site_domain."/img/logo50.jpg";
}else if(strpos($photo_link, "images/camera") > -1){
$photo_link = "https://".site_domain."/img/logo50.jpg";
}
}*/

if(isBlackListLogin($login)){
$photo_link = "https://".site_domain."/img/logo50.jpg";
if(isset($data['app']) && $data['app']=='hunters')$photo_link = $belkiAvaURL;
}
$c->photo_50 = $photo_link;
}
if(isset($o[$photo_100_field])){
$photo_link = $o[$photo_100_field];

if($photo_link){
if(strpos($photo_link, "images/deactivated") > -1){
$photo_link = "https://".site_domain."/img/logo50.jpg";
if(isset($data['app']) && $data['app']=='hunters'){
$photo_link = $belkiAvaURL;
}
}else if(strpos($photo_link, "images/camera") > -1){
$photo_link = "https://".site_domain."/img/logo50.jpg";
if(isset($data['app']) && $data['app']=='hunters'){
$photo_link = $belkiAvaURL;
}
}
}
if(isBlackListLogin($login)){
$photo_link = "https://".site_domain."/img/logo50.jpg";
if(isset($data['app']) && $data['app']=='hunters')$photo_link = $belkiAvaURL;
}
$c->photo_100 = $photo_link;
}


if(isset($o[$photo_200_field])){
$photo_link = $o[$photo_200_field];

if($photo_link){
if(strpos($photo_link, "images/deactivated") > -1){
$photo_link = "https://".site_domain."/img/logo50.jpg";
if(isset($data['app']) && $data['app']=='hunters'){
$photo_link = $belkiAvaURL;
}
}else if(strpos($photo_link, "images/camera") > -1){
$photo_link = "https://".site_domain."/img/logo50.jpg";
if(isset($data['app']) && $data['app']=='hunters'){
$photo_link = $belkiAvaURL;
}
}
}
if(isBlackListLogin($login)){
$photo_link = "https://".site_domain."/img/logo50.jpg";
if(isset($data['app']) && $data['app']=='hunters')$photo_link = $belkiAvaURL;
}
$c->photo_200 = $photo_link;
}

$c->link = $social_link;

$c->social = $pref;

$c->login = $login;

return $c;
}

function SocialRefreshToken($s){
$res = null;
global $vkApiTokenRefresh,$OdApiTokenRefresh, $MmApiTokenRefresh, $MmApiAppID, $MmApiRefreshSecret;
if($s == "vk"){
return $vkApiTokenRefresh;

}else if($s == "od"){
/*$cfgs = $adapterConfigs["od"];
$res = post("http://api.odnoklassniki.ru/oauth/token.do", 
array('refresh_token' => $OdApiTokenRefresh,'grant_type' => 'refresh_token', 'client_id' => $cfgs["client_id"], 'client_secret' => $cfgs["client_secret"]));*/

return $OdApiTokenRefresh;

}else if($s == "mm"){
$res = post("https://appsmail.ru/oauth/token", array('refresh_token' => $MmApiTokenRefresh,'grant_type' => 'refresh_token', 'client_id' =>$MmApiAppID, 'client_secret' =>$MmApiRefreshSecret));
}
if(!is_null($res) && isset($res["access_token"]))return $res["access_token"]; 
return null;
}


function post($url, $params, $parse = true){
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, urldecode(http_build_query($params)));
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


function sign_server_server_MM($request_params, $secret_key) {
 ksort($request_params);
 $params = '';
 foreach ($request_params as $key => $value) {
   if ($key!='sig') {
   $params .= "$key=$value";
   }
 }
 return md5($params . $secret_key);
}

function sign_server_server_OD($request_params, $secret_key) {
 ksort($request_params);
 $params = '';
 foreach ($request_params as $key => $value) {
   if ($key!='sig' && $key!='access_token') {
   $params .= "$key=$value";
   }
 }
 return md5($params . md5($secret_key));
}
?>
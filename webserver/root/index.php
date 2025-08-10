<?php
// взято с dev1 https://ag6.ru/dev1
$dbhost = '127.0.0.1';
$dbuser = 'root';
$dbpass = '';

function connectNoSelectDB(){
global $dbuser,$dbhost,$dbpass;
try{
$c=new PDO("mysql:host=".$dbhost.";charset=utf8", $dbuser, $dbpass);
return $c;	
}catch(Exception $e) {
}
return null;
}

function checkDBExists($db,$name){
if($db){
$STH=$db->prepare('SHOW DATABASES LIKE ?');
$STH->execute(array($name));
$STH->setFetchMode(PDO::FETCH_ASSOC);
if($row = $STH->fetch())return true;
}
return false;
}

function importFileSQL($dbnm,$pathSql){
$db1=connectNoSelectDB();
if($db1 && strlen($dbnm)>0 && strlen($pathSql)>0){
if(!checkDBExists($db1,$dbnm)){
if(file_exists($pathSql)){
$db1->exec('CREATE DATABASE '.$dbnm.' CHARACTER SET utf8 COLLATE utf8_general_ci');
if(checkDBExists($db1,$dbnm)){
$db1->exec('use '.$dbnm);
$sqlData=file_get_contents($pathSql);
if($sqlData!=null){
$db1->exec($sqlData);
$result=$db1->query("SHOW TABLES");
if($row=$result->fetch(PDO::FETCH_NUM)){
return 'ok';
}
}
}
}else{
return 'no_file';
}
}else{
return 'exists';
}
}
return 'error';
}
// конец кода с dev1


function installGameDatabase(){
$dbname='dogsgame3';
$filename='db.sql';
if(!file_exists($filename))return false;
$db1=connectNoSelectDB();
if($db1){
if(!checkDBExists($db1,$dbname)){
$res=importFileSQL($dbname,$filename);
if($res=='ok'){
unlink($filename);
return true;
}
}
}
return false;
}

installGameDatabase();



// авторизация через данные приложения вк
//header("Location: /dogsgame3/?key=vk_57028472_c3616d11a1057ca9a54167a11f218ded");

// универсальная авторизация, можно указывать любой логин, логин состоит из префикса соц сети (vk || od и тд) + id страницы в соц сети
header("Location: /dogsgame3/?key=site_vk57028472_777_6457c29e6d08e785a1cf230d51668e64");

/*
header("Content-Type: text/html; charset=utf-8");

if($_GET && isset($_GET['phpinfo'])){
phpinfo();
exit;
}

echo '<!DOCTYPE html>
<html>
<head>
<style>body,html{margin:0,width:100%;height:100%;background:#FFFFFF;overflow:hidden;text-align:center;user-select:none;}</style>
</head>
<body>
<div style="position:relative;top:30%;"><div style="font-family:Arial;font-size:25px;color:#000000;">Веб сервер работает!</div><div style="font-family:Arial;font-size:25px;color:#000000;"><a href="?phpinfo" style="text-decoration:none;">информация о php</a></div></div>
</body>
</html>';*/
?>
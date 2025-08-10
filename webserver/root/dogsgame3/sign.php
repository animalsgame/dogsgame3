<?php
header("Content-Type: text/html; charset=utf-8");
$secretKeyAnimalsGameSite='wRCJmRPRClZjWtYVCpNsuIy4UNbC9M'; // ключ для создания подписи ( авторизация через префикс site_ ) такой же ключ должен быть в nodejs, иначе ошибка авторизации

function createSign($login){
global $secretKeyAnimalsGameSite;
//$ts = time();
$ts = 777;
$hash = md5($login.'_'.$ts.'_'.$secretKeyAnimalsGameSite);
return 'site_'.$login.'_'.$ts.'_'.$hash;
}

if($_GET && isset($_GET['login']) && strlen($_GET['login']) > 0){
echo createSign($_GET['login']);
}else{
echo 'Не указан логин, в url должен быть параметр login=';	
}

?>
<?php
$fileURL='js/jUH83nOTLouz5HMtZurNDFBB8fMrki.js';
$tsFile1=@filemtime('js/vmjs-min.js');
$tsFile2=@filemtime($fileURL);
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Побег собачек</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<script src="js/box2d.js?v=1"></script>
<script src="js/vmjs-min.js?ts=<?php echo $tsFile1; ?>"></script>
<script>
(function(){
var vm=new AnimalsGameJS();
vm.loadByURL("<?php echo $fileURL.'?ts='.$tsFile2; ?>");
})();
</script>
</body>
</html>
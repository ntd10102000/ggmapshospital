
<?php
$mysqli=new mysqli("localhost", 'root', '','GIS_KhamBacSi');
if ($mysqli->connect_error) {
  die('Not connected : ' . mysql_error());
}
$mysqli->query("SET NAMES 'utf8'");
?>
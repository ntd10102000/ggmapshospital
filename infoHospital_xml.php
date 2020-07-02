<?php
function parseToXML($htmlStr)
{
$xmlStr=str_replace('<','&lt;',$htmlStr);
$xmlStr=str_replace('>','&gt;',$xmlStr);
$xmlStr=str_replace('"','&quot;',$xmlStr);
$xmlStr=str_replace("'",'&#39;',$xmlStr);
$xmlStr=str_replace("&",'&amp;',$xmlStr);
$xmlStr=str_replace("/",'&#47;',$xmlStr);
$xmlStr=str_replace(":",'&#58;',$xmlStr);
return $xmlStr;
}
include_once('connectDB.php');

$query1 = "SELECT idHpt, nameHpt, addressHpt, phoneHpt, webHpt, h.idDistrict,nameDistrict, lat, lng, imageHpt, type, placeId FROM hospital h, district d WHERE h.idDistrict=d.idDistrict";
$result1 = $mysqli->query($query1);

$query2 = "SELECT h.idHpt, k.idKhoa, nameKhoa FROM hospital h, khoa k, hpt_khoa hk WHERE h.idHpt=hk.idHpt AND k.idKhoa=hk.idKhoa ORDER BY h.idHpt";
$result2 = $mysqli->query($query2);

header("Content-type: text/xml");

// Start XML file, echo parent node
echo '<hospitals>';
// Iterate through the rows, printing XML nodes for each
while ($row = $result1->fetch_array()){
  // ADD TO XML DOCUMENT NODE
  echo '<hospital ';
  echo 'idHpt="' . $row['idHpt'] . '" ';
  echo 'nameHpt="' . parseToXML($row['nameHpt']) . '" ';
  echo 'addressHpt="' . parseToXML($row['addressHpt']) . '" ';
  echo 'phoneHpt="' . parseToXML($row['phoneHpt']) . '" ';
  echo 'webHpt="' . parseToXML($row['webHpt']) . '" ';
  echo 'idDistrict="' . parseToXML($row['idDistrict']) . '" ';
  echo 'nameDistrict="' . parseToXML($row['nameDistrict']) . '" ';
  echo 'lat="' . $row['lat'] . '" ';
  echo 'lng="' . $row['lng'] . '" ';
  echo 'imageHpt="' . parseToXML($row['imageHpt']) . '" ';
  echo 'type="' . $row['type'] . '" ';
  echo 'placeId="' . parseToXML($row['placeId']) . '" ';
  echo '/>';
// Iterate through the rows, printing XML nodes for each
}
while ($row = $result2->fetch_array()){
	  // ADD TO XML DOCUMENT NODE
	  echo '<khoa ';
	  echo 'idHpt="' . $row['idHpt'] . '" ';
    echo 'idKhoa="' . $row['idKhoa'] . '" ';
	  echo 'nameKhoa="' . parseToXML($row['nameKhoa']) . '" ';
	  echo '/>';
	}
// End XML file
echo '</hospitals>';
?>

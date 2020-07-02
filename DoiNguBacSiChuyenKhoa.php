<?php 
	include_once("connectDB.php");
 ?>
<!DOCTYPE html>
<html>
<head>
	<title>Đội ngũ bác sĩ chuyên khoa</title>
	<link rel="stylesheet" type="text/css" href="style/styleBS.css">
</head>
<body>
<div id="wrap">
	<div id="header">
            <img src="icon/logo_chinh.png" style="width:50px;height:60px;float:left;margin-left:70px">
            <p align="left" style="color:#fff;background:#4d90fe;margin:20px 0px 0px 0px;font-size:20px;float:left">
            KHÁM BÁC SĨ
             <a href="index.php" style="margin-left:900px;color:#fff;background:#4d90fe;font-size:20px;">TRANG CHỦ</a>
            </p>
           
        </div>
	<div id="content">
		<div id="listBS">
		<?php 
			if(isset($_GET['idHpt'])){
				$idHpt=$_GET['idHpt'];
				$sql="SELECT nameHpt from hospital where idHpt=?";
				$stmt = $mysqli->prepare($sql);
				// Gán giá trị vào các tham số ẩn
				$stmt->bind_param("i", $idHpt);
				// Thực thi câu truy vấn
				$stmt->execute();
  				$result=$stmt->get_result();

  				while ($row=$result->fetch_array()) { ?> 
  					<h2 style="color:orange"><?php echo "$row[nameHpt]";?></h2>
  				<?php
  				}
			}
		?>
		<table>
			<tr id="title">
				<td>STT</td>
				<td>Họ và Tên</td>
				<td>Chuyên Khoa</td>
				<td>Xem Chi Tiết</td>
			</tr>
			<?php 
			if(isset($_GET['idHpt'])){
				$idHpt=$_GET['idHpt'];
				$sql="SELECT nameDoctor, nameKhoa, nameHpt from khoa k, hospital h, doctor d where h.idHpt=? and d.idKhoa=k.idKhoa and d.idHpt=h.idHpt order by nameKhoa";
				$stmt = $mysqli->prepare($sql);
				// Gán giá trị vào các tham số ẩn
				$stmt->bind_param("i", $idHpt);
				// Thực thi câu truy vấn
				$stmt->execute();
  				$result=$stmt->get_result();
  				$i=0;

  				while ($row=$result->fetch_array()) {
  					$i++;
  				 ?>
  					<tr>
  						<td class="STT"><?php echo "$i";?></td>
  						<td><?php echo "$row[nameDoctor]";?></td>
  						<td><?php echo "$row[nameKhoa]";?></td>
  						<td class="icon"><img src="icon/chitiet.png" style="width:30px;height:30px"></td>
  					</tr>

  				<?php
  				}
			}
		?>
		</table>
		
			
		</div>
	</div>
</div>
</body>
</html>
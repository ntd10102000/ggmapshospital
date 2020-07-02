<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="style/style.css">
        <script language="javascript" src="http://code.jquery.com/jquery-2.0.0.min.js"></script>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDmoT0KGpNDf8Ooby3zs36Ehnim9gsqPMA&language=vi&libraries=places"></script>
        <script src="https://kit.fontawesome.com/d3fa3cecaa.js"></script>
        <script type="text/javascript" src="javascript/loadMap.js"></script>
      
    </head>
    <body> 
    <form>
        <div id="wrap">
        <div id="header">
            <img src="icon/logo_chinh.png" style="width:50px;height:60px;float:left;margin-left:15px">
            <p align="left" style="color:#fff;background:#4d90fe;margin:20px 0px 0px 0px;font-size:20px;float:left">
            Hospital Maps
            </p>
        </div>
        <!--header-->
        <div id="map_data">
            <div id="left">
                <div id="contenTimDuong">
                    <div id="timduong">
                        <div id="divmenu1"><img src="icon/menu.png" class="icon"></div>
                        <div id="divtxttim"><input type="text" name="maps_address" id="maps_address" value="" placeholder="    Tìm kiếm bệnh viện"></div>
                        <div id="divSearch"><img src="icon/search.png" id="searchIcon" class="icon"></div>
                        <div id="divChiDuong"><img src="icon/chiduong.png" class="icon"></div>
                    </div>
                    <div id="groupToaDo">
                        <div id="timDuongTuDiem"><img src="icon/chiduong.png" class="icon1"></div>
                        <div id="divtimvitrihientai" class="vitriHienTai">
                            <img src="icon/vitrihientai.png" id="vitrihientai" style="width:50px;height:50px" >
                            <span class="tooltiptext1">Vị Trí Hiện Tại</span>
                        </div>
                        
                        <div class="centerLatLng">
                            <span class="input-group-addon" style="padding-left:20px;color:black">L : </span>
                            <input type="text" class="form-control" name="maps[maps_mapcenterlat]" id="maps_mapcenterlat" value="" readonly="readonly" style="background-color:#cdf;border-radius: 5px">
                        </div>
                        <br><br>
                        <div class="centerLatLng">
                            <span class="input-group-addon" style="padding-left:70px;color:black">N : </span>
                            <input type="text" class="form-control" name="maps[maps_mapcenterlng]" id="maps_mapcenterlng" value="" readonly="readonly" style="background-color:#cdf;border-radius: 5px">
                        </div>
                        <br><br>
                       <div class="monospace" style="margin-left:15px;color:black">Bán Kính Tìm Kiếm Trong Vòng: <input type="text" name="" id="radius" value="5" style="width:50px;background-color:#cdf;border-radius: 5px"> km</div>
                       <br/>
                        <div id="findAll" class="find"><img src="icon/add.png" class="marker" ><span class="tooltiptext">Tất cả</span></div>
                        <div id="findPK" class="find"><img src="icon/marker_xanh.png" class="marker" ><span class="tooltiptext">Phòng Khám</span></div>
                        <div id="findBV" class="find"><img src="icon/marker_do.png" class="marker"><span class="tooltiptext">Bệnh Viện</span></div><br/>
                    </div>
                    <br>
                    <div id="searchQuan" style="font-size:13px; clear: left;">
                            <div style="float:left"><strong style="color:red;font-size:14px;padding-left:15px; font-size:16px;color:black">Tìm kiếm nâng cao</strong></div>
                            <div id="arrow_xuong" style="float:left; margin-left:5px"><i class="fas fa-chevron-circle-down" style="padding-top:5px;color:black"></i></div>
                            <div id="arrow_len" style="float:left;margin-left:5px"><i class="fas fa-chevron-circle-up" style="padding-top:5px;color:black"></i></div>
                            <br><br>
                            <div id="listQuan" style="clear: left;">
                                <div id="tableQuan" style="width:450px;">
                                    <div style="color:red;font-size:14px;padding-left: 15px;">Chọn khu vực cần tìm:</div>
                                    <?php  
                                    include_once('connectDB.php');
                                    $query = "SELECT * FROM district";
                                    $result = $mysqli->query($query);
                                    while ($row = $result->fetch_array() ){?>
                                        <span style="float:left; margin-left:3px;width:145px;font-size:13px;color:black"><input type="checkbox" class="findDistrict" 
                                        value="<?php echo ("$row[idDistrict]");?>" /><?php echo ("$row[nameDistrict]");?></span>
                                        <?php
                                    }
                                    ?>
                                </div>
                                <div id="tableKhoa" style="clear:left;">
                                    <div style="color:red;font-size:14px;padding-left: 15px;">Chọn khoa cần tìm:</div>
                                    <?php  
                                    include_once('connectDB.php');
                                    $query1 = "SELECT * FROM khoa";
                                    $result1 = $mysqli->query($query1);
                                    while ($row = $result1->fetch_array() ){?>
                                        <span style="float:left; margin-left:2px;width:145px;font-size:12px;color:black"><input type="checkbox" class="findKhoa" value="<?php echo ("$row[idKhoa]");?>" /><?php echo ("$row[nameKhoa]");?></span>
                                        <?php
                                    }
                                    ?>
                                </div>
                            </div>
                        </div>
                        <div id="right-panel" style="display:none; position:relative">
                            <h4 style="color:black;margin:0px;padding-left: 15px;">Danh sách bệnh viện <i id="exitPanel" class="fas fa-backspace" style="width: 20px;font-size:1.18em;float:right;margin-right:5px"></i></h4>
                            
                            <div id="thongTinChiTiet"></div>
                            <div id="divPlaces"><ul id="places"></ul></div>
                            
                        </div>
                </div>
                <div id="contentChiDuong">
                    <div id="rowphuongtien">
                        <div id="divmenu2" class="phuongtien"><img src="icon/menu.png" class="icon"></div>
                        <div id="iconChiDuong" class="phuongtien" value="chiduong"><img src="icon/chiduong.png" class="icon2"></div>
                        <div id="iconOto" class="phuongtien"><i class="fas fa-car" style="font-size:1.80em;padding-top:10px;color:black"></i></div>
                        <div id="iconXebus" class="phuongtien"><i class="fas fa-bus" style="font-size:1.80em;padding-top:10px;color:black"></i></div>
                        <div id="iconDibo" class="phuongtien"><i class="fas fa-walking" style="font-size:1.80em;padding-top:10px;color:black"></i></div>
                        <div id="iconXedap" class="phuongtien"><i class="fas fa-bicycle" style="font-size:1.80em;padding-top:10px;color:black"></i></div>
                        <div id="iconMaybay" class="phuongtien" ><i class="fas fa-fighter-jet" style="font-size:1.80em;padding-top:10px;color:black"></i></div>
                        <div id="thoatChiDuong" style="width: 50px; float:left;"><i class="fas fa-backspace" style="margin-left:50px;font-size:1.33em;color:black"></i></div>
                        <input type="text" name="" id="start" class="textAB" placeholder="Chọn điểm bắt đầu hoặc nhấp vào bản đồ"><br/>
                        <input type="text" name="" id="end" class="textAB" placeholder="Chọn điểm đến hoặc nhấp vào bản đồ">
                    </div>
                    
                    <div id="huongdan">
                    </div>
                </div>
            </div>
            <div id='menu'>
                <div id="rowMenu"><img id="exitMenu" src="icon/exitMenu.png" style="width: 30px;height: 30px; margin-left:210px;"></div>
            </div>
            <div id="map-canvas"/>
        </div>
        <!--map-->
    </div>
    </form>
    </body>
</html>
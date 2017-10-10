<?php
	echo "Before API Init...";
	require_once('BaixingAPIv2.php');
	$api = new BaixingAPIv2();
	echo "After API Init\r\n";
	$param = array();

	// area
	 
	$param = array();
	$param["areaId"] = 'shenzhen';
	$result = $api->area($param);
	print_r($result);
	/*
	$param = array();
	$param["areaId"] = 'shenzhen';
	$param["levels"] = 1;
	$result = $api->area($param);
	print_r($result);
	$param = array();
	$param["areaId"] = 'shenzhen';
	$param["levels"] = 0;
	$result = $api->area($param);
	print_r($result);
	$param = array();
	$param["areaId"] = 'shenzhen';
	$param["levels"] = 2;
	$result = $api->area($param);
	print_r($result);
	 */
	
	// category
 /*
	$param = array();
	$param["categoryId"] = 'root';
	$param["levels"] = 4;
	$result = $api->category($param);
	print_r($result);
	$param = array();
	$param["id"] = 'root';
	$param["levels"] = 4;
	$result = $api->category($param);
	print_r($result);
	*/
	$param = array();
	$param["categoryId"] = 'root';
	$result = $api->category($param);
	print_r($result);
 
	// meta
	 $param = array();
	$param["categoryId"] = 'daibanzhuce';
	$result = $api->meta($param);
	print_r($result);
	$param = array();
	$param["categoryId"] = 'daibanzhuce';
	$param["expand"] = 1;
	$result = $api->meta($param);
	print_r($result);
	/*
	$param = array();
	$param["categoryId"] = 'ershouqiche';
	$param["metaName"] = '车系列';
	$result = $api->meta($param);
	print_r($result);
	$param = array();
	$param["categoryId"] = 'ershouqiche';
	$param["metaName"] = '车系列';
	$param["parentValue"] = 'm13268';
	$result = $api->meta($param);
	print_r($result);
	*/
	
	// post
 
 /*
	$param = array();
	$param['userMobile'] = '13723799805';
	$param['cityEnglishName'] = 'shenzhen';
	$param['地区'] = 'm250';
	$param['categoryId'] = 'daibanzhuce';
	$param['contact'] = '13723799805';
	$param['title'] = '注册公司只需0元代理，无资金地址办理一般纳税人';
	$param['content'] = '注册公司只需0元代理，无资金地址办理一般纳税人!!!!';
	$param['upload_images'] = array(array("url" => "http://img5.baixing.net/acd5a106b1751182d0cf340d1654b3a5.jpg_bi"),
									array("url" => "http://img5.baixing.net/d07fcdb45200001295c3e6748ffb99b4.jpg_bi"),
									array("url" => "http://img4.baixing.net/08f4bf1a5ef33b95ad1f4c5edb4b61ee.jpg_bi"));
	$param['价格'] = '1';
	$result = $api->post($param);
	print_r($result);
	 

*/


	// update
	/*
	$param = array();
	$param['userMobile'] = '18000000000';
	$param['id'] = '59e1b6e87e6b3672f3d0b1f09eade5f9c0000000';
	$param['contact'] = '18000000000';
	$param['title'] = '更改标题测试';
	$param['content'] = '我是最新的内容！！！！';
	$result = $api->update($param);
	print_r($result);
	*/
	
	/*
	$param = array();
	$param['userMobile'] = '18000000000';
	$param['id'] = '373941858';//373953750
	$param['from'] = 10;
	$param['size'] = 10;
	$param['detail'] = FALSE;
	$result = $api->query($param);
	print_r($result);
	$param = array();
	$param['userMobile'] = '18000000000';
	$param['from'] = 0;
	$param['size'] = 10;
	$param['detail'] = 0;
	$result = $api->query($param);
	print_r($result);
	
	
	$param = array();
	$param['userMobile'] = '18000000000';
	$param['id'] = '373953750';
	$result = $api->delete($param);
	print_r($result);
	*/


?>  
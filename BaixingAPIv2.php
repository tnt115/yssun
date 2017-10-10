<?php

class BaixingAPIv2 {

	// Baixing API v2
	// SDK version 2.1
	// 20140723 1240
	// Free Simple Abundance

	protected $config_path = "config.php";

	protected $platform_encoding = "UTF-8";

	protected $baixing_internal_encoding = "UTF-8";

	protected $app_key = null;

	protected $app_secret = null;

	protected $api_base_url = "http://api.baixing.com.cn/v2/";

	protected $post_fixed_keys = array('userMobile', 'cityEnglishName', 'cityId', '地区', 'categoryId', 'title', 'contact');

	public function __construct($profile = 'default') {
		$config = require($this->config_path);
		if (isset($config[$profile])) {
			$this->app_key = $config[$profile]['app_key'];
			$this->app_secret = $config[$profile]['app_secret'];
		}
	}

	protected static function deep_convert($params, $from_encoding, $to_encoding) {
		$result = array();
		foreach ($params as $curKey => $curValue) {
			$targetKey = $curKey;
			if (is_string($targetKey)) {
				$targetKey = mb_convert_encoding($targetKey, $to_encoding, $from_encoding);
			}
			$targetValue = $curValue;
			if (is_array($curValue)) {
				$targetValue = BaixingAPIv2::deep_convert($curValue, $from_encoding, $to_encoding);
			} else if (is_string($curValue)) {
				$targetValue = mb_convert_encoding($curValue, $to_encoding, $from_encoding);
			}
			$result[$targetKey] = $targetValue;
		}
		return $result;
	}

	protected function run($api, $params = array()) {
		if (empty($this->app_key) or empty($this->app_secret)) {
			return false;
		}

		$url = $this->api_base_url . $api;

		$params_utf8 = $params;

		if (strcmp($this->platform_encoding, $this->baixing_internal_encoding) != 0) {
			$params_utf8 = BaixingAPIv2::deep_convert($params, $this->platform_encoding, $this->baixing_internal_encoding);
		}
		$dataJson = json_encode($params_utf8);

		$headers = array(
			'Bapi-App-Key' => $this->app_key,
			'Bapi-Hash' => md5($api . $dataJson . $this->app_secret),
			'User-Ip' => (isset($_SERVER['REMOTE_ADDR'])) ? ($_SERVER['REMOTE_ADDR']) : ''
		);

		$http_headers = array();
		if (!empty($headers) and is_array($headers)) {
			foreach ($headers as $key => $val) {
				$http_headers[] = $key . ': ' . $val;
			}
		}

		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $dataJson);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $http_headers);
		curl_setopt($ch, CURLOPT_TIMEOUT, 60);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$resultJson = curl_exec($ch);
		curl_close($ch);

		$result_utf8 = json_decode($resultJson, TRUE);
		$result = $result_utf8;
		if (strcmp($this->platform_encoding, $this->baixing_internal_encoding) != 0) {
			$result = BaixingAPIv2::deep_convert($result_utf8, $this->baixing_internal_encoding, $this->platform_encoding);
		}

		return $result;
	}

	// 元数据查询area：获取百姓网地域树
	public function area($param) {
		$req = array();
		// Parameters Guard
		if (empty($param)) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: No parameters detected.',
				'data' => NULL
			);
		}
		// areaId
		if (empty($param['areaId'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [areaId] is missing or blank.',
				'data' => NULL
			);
		}
		$areaId = trim($param['areaId']);
		if ($areaId == 'm') {
			$req['id'] = $areaId;
		} elseif (substr($areaId, 0, 1) == 'm' and intval(substr($areaId, 1)) > 0) {
			$req['id'] = $areaId;
		} else {
			$req['englishName'] = $areaId;
		}
		// levels
		if (!isset($param['levels'])) {
			$req['levels'] = 1;    // as default
		} elseif (empty($param['levels'])) {
			if ($param['levels'] == 0) {
				$req['levels'] = 0;
			} else {
				$req['levels'] = 1;    // as default
			}
		} else {
			$levels = $param['levels'];
			if (!is_int($levels) or $levels < 0) {
				return array(
					'status' => 'fail',
					'error' => 2005,
					'message' => 'Parameters: Optional parameter [levels] should be an integer greater or equal than 0.',
					'data' => NULL
				);
			}
			if ($levels > 1) {
				$levels = 1;    // Dump adapt
			}
			$req['levels'] = $levels;
		}
		// GO!
		return $this->run('area', $req);
	}

	// 元数据查询category：获取百姓网类目树
	public function category($param) {
		$req = array();
		// Parameters Guard
		if (empty($param)) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: No parameter detected.',
				'data' => NULL
			);
		}
		// categoryId / id
		if (empty($param['categoryId']) and empty($param['id'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [id/categoryId] is missing or blank.',
				'data' => NULL
			);
		}
		$categoryId = trim($param['categoryId']);
		if (empty($categoryId)) {
			$categoryId = trim($param['id']);
			if (empty($categoryId)) {
				return array(
					'status' => 'fail',
					'error' => 2004,
					'message' => 'Parameters: Required parameter [id/categoryId] is an empty string.',
					'data' => NULL
				);
			}
		}
		$req['id'] = $categoryId;
		// levels
		if (!isset($param['levels'])) {
			$req['levels'] = 1;    // as default
		} elseif (empty($param['levels'])) {
			if ($param['levels'] == 0) {
				$req['levels'] = 0;
			} else {
				$req['levels'] = 1;    // as default
			}
		} else {
			$levels = $param['levels'];
			if (!is_int($levels) or $levels < 0) {
				return array(
					'status' => 'fail',
					'error' => 2005,
					'message' => 'Parameters: Optional parameter [levels] should be an integer greater or equal than 0.',
					'data' => NULL
				);
			}
			$req['levels'] = $levels;
		}
		// GO !
		return $this->run('category', $req);
	}

	// 元数据查询meta：获取百姓网某类目的信息属性
	public function meta($param) {
		$req = array();
		// Parameters Guard
		if (empty($param)) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: No parameter detected.',
				'data' => NULL
			);
		}
		// categoryId
		if (empty($param['categoryId'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [categoryId] is missing or an empty string.',
				'data' => NULL
			);
		} else {
			$param['categoryId'] = trim($param['categoryId']);
			if (empty($param['categoryId'])) {
				return array(
					'status' => 'fail',
					'error' => 2004,
					'message' => 'Parameters: Required parameter [categoryId] is missing or an empty string.',
					'data' => NULL
				);
			}
		}
		$req['categoryId'] = trim($param['categoryId']);
		// metaName
		if (!empty($param['metaName'])) {
			$param['metaName'] = trim($param['metaName']);
			if (!empty($param['metaName'])) {
				$req['metaName'] = trim($param['metaName']);
				if (!empty($param['parentValue'])) {
					$param['parentValue'] = trim($param['parentValue']);
					if (!empty($param['parentValue'])) {
						$req['parentValue'] = trim($param['parentValue']);
					}
				}
			}
		}
		// expand
		if (!empty($param['expand'])) {
			$param['expand'] = trim($param['expand']);
			if (!empty($param['expand'])) {
				$expand = strtolower(trim($param['expand']));
				if ($expand == 'true' or $expand == '1') {
					$req['expand'] = TRUE;
				}
			}
		}
		// GO !
		return $this->run('meta', $req);
	}

	// 信息操作post：向百姓网发布信息
	public function post($param) {
		$req = array();
		// Parameters Guard
		if (empty($param)) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: No parameter detected.',
				'data' => NULL
			);
		}
		// userMobile
		if (empty($param['userMobile'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [userMobile] is missing or an empty string.',
				'data' => NULL
			);
		} else {
			$param['userMobile'] = trim($param['userMobile']);
			if (empty($param['userMobile'])) {
				return array(
					'status' => 'fail',
					'error' => 2004,
					'message' => 'Parameters: Required parameter [userMobile] is missing or an empty string.',
					'data' => NULL
				);
			}
		}
		$req['userMobile'] = $param['userMobile'];
		// cityEnglishName or cityId
		if (empty($param['cityEnglishName']) and empty($param['cityId'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [cityEnglishName/cityId] is missing.',
				'data' => NULL
			);
		}
		if (!empty($param['cityEnglishName'])) {
			$param['cityEnglishName'] = trim($param['cityEnglishName']);
			if (!empty($param['cityEnglishName'])) {
				$req['cityEnglishName'] = trim($param['cityEnglishName']);
			}
		} elseif (!empty($param['cityId'])) {
			$param['cityId'] = trim($param['cityId']);
			if (!empty($param['cityId'])) {
				$req['cityId'] = trim($param['cityId']);
			}
		} else {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [cityEnglishName/cityId] is an empty string.',
				'data' => NULL
			);
		}
		// 地区
		if (empty($param['地区'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [地区] is missing or an empty string.',
				'data' => NULL
			);
		} else {
			$param['地区'] = trim($param['地区']);
			if (empty($param['地区'])) {
				return array(
					'status' => 'fail',
					'error' => 2004,
					'message' => 'Parameters: Required parameter [地区] is missing or an empty string.',
					'data' => NULL
				);
			}
		}
		$req['地区'] = trim($param['地区']);
		// categoryId
		if (empty($param['categoryId'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [categoryId] is missing or an empty string.',
				'data' => NULL
			);
		} else {
			$param['categoryId'] = trim($param['categoryId']);
			if (empty($param['categoryId'])) {
				return array(
					'status' => 'fail',
					'error' => 2004,
					'message' => 'Parameters: Required parameter [categoryId] is missing or an empty string.',
					'data' => NULL
				);
			}
		}
		$req['categoryId'] = trim($param['categoryId']);
		// title
		if (empty($param['title'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [title] is missing or an empty string.',
				'data' => NULL
			);
		} else {
			$param['title'] = trim($param['title']);
			if (empty($param['title'])) {
				return array(
					'status' => 'fail',
					'error' => 2004,
					'message' => 'Parameters: Required parameter [title] is missing or an empty string.',
					'data' => NULL
				);
			}
		}
		$req['title'] = trim($param['title']);
		// contact
		if (empty($param['contact'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [contact] is missing or an empty string.',
				'data' => NULL
			);
		} else {
			$param['contact'] = trim($param['contact']);
			if (empty($param['contact'])) {
				return array(
					'status' => 'fail',
					'error' => 2004,
					'message' => 'Parameters: Required parameter [contact] is missing or an empty string.',
					'data' => NULL
				);
			}
		}
		$req['contact'] = trim($param['contact']);
		// Fill other parameters
		foreach ($param as $curKey => $curValue) {
			if (!in_array($curKey, $this->post_fixed_keys)) {
				$req[$curKey] = $curValue;
			}
		}
		// GO !
		return $this->run('post', $req);
	}

	// 信息操作update：更新在百姓网发布的信息
	public function update($param) {
		$req = array();

		// Parameters Guard
		if (empty($param)) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: No parameter detected.',
				'data' => NULL
			);
		}

		// adId
		if (empty($param['id'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [id] is missing or an empty string.',
				'data' => NULL
			);
		} else {
			$param['id'] = trim($param['id']);
			if (empty($param['id'])) {
				return array(
					'status' => 'fail',
					'error' => 2004,
					'message' => 'Parameters: Required parameter [id] is missing or an empty string.',
					'data' => NULL
				);
			}
		}
		$req['id'] = $param['id'];

		// userMobile
		if (empty($param['userMobile'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [userMobile] is missing or an empty string.',
				'data' => NULL
			);
		} else {
			$param['userMobile'] = trim($param['userMobile']);
			if (empty($param['userMobile'])) {
				return array(
					'status' => 'fail',
					'error' => 2004,
					'message' => 'Parameters: Required parameter [userMobile] is missing or an empty string.',
					'data' => NULL
				);
			}
		}
		$req['userMobile'] = $param['userMobile'];


		// Fill other parameters
		foreach ($param as $curKey => $curValue) {
			if (!in_array($curKey, $req)) {
				$req[$curKey] = $curValue;
			}
		}

		// GO !
		return $this->run('update', $req);
	}

	// 信息操作query：查询在百姓网上发布的信息
	public function query($param) {
		$req = array();
		// Parameters Guard
		if (empty($param)) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: No parameter detected.',
				'data' => NULL
			);
		}
		// userMobile
		if (empty($param['userMobile'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [userMobile] is missing or an empty string.',
				'data' => NULL
			);
		} else {
			$param['userMobile'] = trim($param['userMobile']);
			if (empty($param['userMobile'])) {
				return array(
					'status' => 'fail',
					'error' => 2004,
					'message' => 'Parameters: Required parameter [userMobile] is missing or an empty string.',
					'data' => NULL
				);
			}
		}
		$req['userMobile'] = trim($param['userMobile']);
		// id
		if (!empty($param['id'])) {
			$param['id'] = trim($param['id']);
			if (!empty($param['id'])) {
				$req['id'] = trim($param['id']);
			}
		}
		// from
		if (!empty($param['from'])) {
			$param['from'] = trim($param['from']);
			if (!empty($param['from'])) {
				if (ctype_digit($param['from'])) {
					if ($param['from'] < 0) {
						$req['from'] = 0;
					} else if ($param['from'] >= 1000) {
						$req['from'] = 1000;
					} else {
						$req['from'] = trim($param['from']);
					}
				} else {
					return array(
						'status' => 'fail',
						'error' => 2005,
						'message' => 'Parameters: Optional parameter [from] is not an integer.',
						'data' => NULL
					);
				}
			}
		} else {
			$req['from'] = 0;    // as default
		}
		// size
		if (!empty($param['size'])) {
			$param['size'] = trim($param['size']);
			if (!empty($param['size'])) {
				if (ctype_digit($param['size'])) {
					$req['size'] = trim($param['size']);
				} else {
					return array(
						'status' => 'fail',
						'error' => 2005,
						'message' => 'Parameters: Optional parameter [size] is not an integer.',
						'data' => NULL
					);
				}
			}
		} else {
			$req['size'] = 30;    // as default
		}
		// detail
		if (!empty($param['detail'])) {
			$param['detail'] = trim($param['detail']);
			if (!empty($param['detail'])) {
				$detail = strtolower(trim($param['detail']));
				if ($detail == 'false' or $detail == '0') {
					$req['detail'] = 0;    // of Boolean
				}
			}
		}
		// GO !
		return $this->run('query', $req);
	}

	// 信息操作delete：删除在百姓网上发布的信息
	public function delete($param) {
		$req = array();
		// Parameters Guard
		if (empty($param)) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: No parameter detected.',
				'data' => NULL
			);
		}
		// userMobile
		if (empty($param['userMobile'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [userMobile] is missing or an empty string.',
				'data' => NULL
			);
		} else {
			$param['userMobile'] = trim($param['userMobile']);
			if (empty($param['userMobile'])) {
				return array(
					'status' => 'fail',
					'error' => 2004,
					'message' => 'Parameters: Required parameter [userMobile] is missing or an empty string.',
					'data' => NULL
				);
			}
		}
		$req['userMobile'] = $param['userMobile'];
		// id
		if (empty($param['id'])) {
			return array(
				'status' => 'fail',
				'error' => 2004,
				'message' => 'Parameters: Required parameter [id] is missing or an empty string.',
				'data' => NULL
			);
		} else {
			$param['id'] = trim($param['id']);
			if (empty($param['id'])) {
				return array(
					'status' => 'fail',
					'error' => 2004,
					'message' => 'Parameters: Required parameter [id] is missing or an empty string.',
					'data' => NULL
				);
			}
		}
		$req['id'] = $param['id'];
		// GO !
		return $this->run('delete', $req);
	}
}
		

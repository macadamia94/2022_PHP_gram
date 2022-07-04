<?php

namespace application\libs;

// 모든 파일에서 쓰고 싶은 것이 있다면 Apllication에 추가하면 다른 파일에서도 사용가능
require_once "application/utils/UrlUtils.php";
require_once "application/utils/SessionUtils.php";
require_once "application/utils/FileUtils.php";

class Application {

  public $controller;
  public $action;
  private static $modelList = []; // static이 붙으면 굳이 객체화를 할 필요없다 class Application과 
  // static $modelList은 엄밀히 따지면 관계는 없지만 $modelList 에 접근할 때 Application 이 사용됨
  // 변수하나가 할당되고 메모리가 계속 유지됨 (싱글톤)

  public function __construct() { // 생성자 함수는 객체가 생성되면 무조선 실행됨
    $urlPaths = getUrlPaths();
    $controller = isset($urlPaths[0]) && $urlPaths[0] != '' ? $urlPaths[0] : 'board';
    $action = isset($urlPaths[1]) && $urlPaths[1] != '' ? $urlPaths[1] : 'index';

    if (!file_exists('application/controllers/' . $controller . 'Controller.php')) {
      echo "해당 컨트롤러가 존재하지 않습니다.";
      exit();
    }

    $controllerName = 'application\controllers\\' . $controller . 'controller';                
    $model = $this->getModel($controller);
    new $controllerName($action, $model);
  }

  public static function getModel($key) {
    if(!in_array($key, static::$modelList)) {
        $modelName = 'application\models\\' . $key . 'model';
        static::$modelList[$key] = new $modelName();
    } // feed가 있다면 그냥 넘겨주고 feed가 없다면 객체화를 한 후에 넘겨줌
    return static::$modelList[$key];
  }
}

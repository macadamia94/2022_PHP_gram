<?php
namespace application\controllers;

class Controller {    
    protected $model;
    private static $needLoginUrlArr = [
        "/board/write", 
        "/board/mod"
    ];

    public function __construct($action, $model) {    
        if(!isset($_SESSION)) {
            session_start();
        }    
        $this->model = $model;
        $view = $this->$action();
        if(empty($view)) {
            echo "Controller 에러 발생";
            exit();
        }

        if(gettype($view) === "string") {
            require_once $this->getView($view);             
        } else if(gettype($view) === "object" || gettype($view) === "array") {
            header("Content-Type:application/json");
            echo json_encode($view); // js의 JSON.stringify와 같은 의미
        }        
    }
    private function chkLoginUrl() {

    }
    
    protected function addAttribute($key, $val) {
        $this->$key = $val;
    }

    protected function getView($view) {
        if(strpos($view, "redirect:") === 0) {
            header("Location: " . substr($view, 9));
            exit();
        }
        return _VIEW . $view;
    }

    protected function flash($name = '', $val = '') {
        if(!empty($name)) { //공백이 아니면
            if(!empty($val)) {
                $_SESSION[$name] = $val;
            } else if(empty($val) && !empty($_SESSION[$name])) {
                unset($_SESSION[$name]);
            }
        }
    }
}


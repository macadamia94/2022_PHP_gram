<?php
namespace application\controllers;

class UserController extends Controller {
    public function signin() {
        switch(getMethod()) {
            case _GET:
                return "user/signin.php";
            case _POST:
                $param = [
                    "email" => $_POST["email"],
                    "pw" => $_POST["pw"],
                ];
                $dbUser = $this->model->selUser($param);
                if($dbUser === false) {
                    print "아이디 없음 <br>";
                    return "redirect:signin";
                } else if(!password_verify($param["pw"], $dbUser->pw)) {
                    print "비밀번호 다름 <br>";
                    return "redirect:signin";
                }
                
                session_start();
                $_SESSION[_LOGINUSER] = $dbUser;
                
                return "redirect:/feed/index";
        }
        return "user/signin.php";
    }

    public function signup() {
        switch(getMethod()) {
            case _GET:
                return "user/signup.php";
            case _POST:
                $param = [
                    "email" => $_POST['email'],
                    "pw" => $_POST['pw'],
                    "nm" => $_POST['nm'],
                ];
                $param["pw"] = password_hash($param["pw"], PASSWORD_BCRYPT);
                $this->model->insUser($param);
                return "redirect:signin";
        }
    }
}
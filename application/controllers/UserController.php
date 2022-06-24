<?php
namespace application\controllers;

class UserController extends Controller {
    public function signin() {
        switch(getMethod()) {
            case _GET:
                return "user/signin.php";
            case _POST:
                $email = $_POST["email"];
                $pw = $_POST["pw"];
                $param = ["email" => $email];
                $dbUser = $this->model->selUser($param);
                /* 
                if($dbUser === false) {
                    return "redirect:signin";
                } else if(!password_verify($pw, $dbUser->pw)) {
                    return "redirect:signin";
                }
                 */
                if(!$dbUser || !password_verify($pw, $dbUser->pw)) {
                    return "redirect:signin?email={$email}&err";
                }
                // $_SESSION[_LOGINUSER] = $dbUser;
                // print_r($_SESSION[_LOGINUSER]);

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
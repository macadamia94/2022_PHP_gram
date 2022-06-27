<?php
namespace application\controllers;

require_once "application/utils/UrlUtils.php";

class UserController extends Controller {
    public function signin() {
        return "user/signin.php";
    }

    public function signup() {
        return "user/signup.php";
    }
}
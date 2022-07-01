<?php

namespace application\controllers;

class UserController extends Controller {

  // 로그인
  public function signin() {
    switch (getMethod()) {
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
        if (!$dbUser || !password_verify($pw, $dbUser->pw)) {
          return "redirect:signin?email={$email}&err"; // key값은 있지만 value값이 없는 쿼리스트링
        }
        $dbUser->pw = null; // 메모리 차지하고 있기 때문에 필요없는 값은 지워주는 것이 좋음
        $dbUser->regdt = null;
        $this->flash(_LOGINUSER, $dbUser);
        return "redirect:/feed/index";
    }
    return "user/signin.php";
  }

  // 회원가입
  public function signup() {
    switch (getMethod()) {
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

  // 로그아웃
  public function logout() {
    $this->flash(_LOGINUSER);
    return "redirect:/user/signin";
  }

  public function feedwin() {
    $iuser = isset($_GET["iuser"]) ? intval($_GET["iuser"]) : 0;
    $param = [ "feediuser" => $iuser, "loginiuser" => getIuser() ];
    $this->addAttribute(_DATA, $this->model->selUserProfile($param));
    $this->addAttribute(_JS, ["user/feedwin", "https://unpkg.com/swiper@8/swiper-bundle.min.js"]);        
    $this->addAttribute(_CSS, ["user/feedwin", "https://unpkg.com/swiper@8/swiper-bundle.min.css"]);        
    $this->addAttribute(_MAIN, $this->getView("user/feedwin.php"));
    return "template/t1.php"; 
}
}

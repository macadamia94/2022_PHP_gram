<?php
namespace application\controllers;

use application\libs\Application;

class UserController extends Controller {

    // 로그인
    public function signin() {        
        switch(getMethod()) {
            case _GET:
                return "user/signin.php";
            case _POST:
                $email = $_POST["email"];
                $pw = $_POST["pw"];
                $param = [ "email" => $email ];
                $dbUser = $this->model->selUser($param);
                if(!$dbUser || !password_verify($pw, $dbUser->pw)) {                                                        
                    return "redirect:signin?email={$email}&err";
                }
                $dbUser->pw = null;
                $dbUser->regdt = null;
                $this->flash(_LOGINUSER, $dbUser);
                return "redirect:/feed/index";
            }
    }

    // 회원가입
    public function signup() {
        switch(getMethod()) {
            case _GET:
                return "user/signup.php";
            case _POST:
                $email = $_POST["email"];
                $pw = $_POST["pw"];
                $hashedPw = password_hash($pw, PASSWORD_BCRYPT);
                $nm = $_POST["nm"];
                $ip_addr = $_SERVER["REMOTE_ADDR"];
                $param = [
                    "email" => $email,
                    "pw" => $hashedPw,
                    "nm" => $nm,
                    "ip_addr" => $ip_addr
                ];

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
        $this->addAttribute(_CSS, ["user/feedwin", "https://unpkg.com/swiper@8/swiper-bundle.min.css", "feed/index"]);        
        $this->addAttribute(_MAIN, $this->getView("user/feedwin.php"));
        return "template/t1.php"; 
    }

    // 피드
    public function feed() {
    if(getMethod() === _GET) {    
      $page = 1;
      if(isset($_GET["page"])) {
          $page = intval($_GET["page"]);
      }
      $startIdx = ($page - 1) * _FEED_ITEM_CNT;
      $param = [
        "startIdx" => $startIdx,
        "toiuser" => $_GET["iuser"],
        "loginiuser" => getIuser()
    ];      
      $list = $this->model->selFeedList($param);
      foreach($list as $item) {  
          $param2 = [ "ifeed" => $item->ifeed ];
          $item->imgList = Application::getModel("feed")->selFeedImgList($param2);
          $item->cmt = Application::getModel("feedcmt")->selFeedCmt($param2);
      }
      return $list;
    }
  }

  // 로그아웃
    public function follow() {
        $param = [
            "fromiuser" => getIuser()
        ];

        switch(getMethod()) {
            case _POST:                                
                $json = getJson();
                $param["toiuser"] = $json["toiuser"];
                return [_RESULT => $this->model->insUserFollow($param)];
            case _DELETE:        
                $param["toiuser"] = $_GET["toiuser"];
                return [_RESULT => $this->model->delUserFollow($param)];
        }
    }

  // 프로필
  public function profile() {
    switch (getMethod()) {
      case _POST:
        $loginUser = getLoginUser();
        $saveDirectory = _IMG_PATH . "/profile/" . getIuser();
        if($loginUser->mainimg) {
          unlink($saveDirectory . "/" . $loginUser->mainimg);
        }
        $tempName = $_FILES['imgs']['tmp_name'][0];
        $randomFileNm = getRandomFileNm($_FILES["imgs"]["name"][0]);
        if (move_uploaded_file($tempName, $saveDirectory . "/" . $randomFileNm)) {
          $param = [
            "iuser" => getIuser(),
            "mainimg" => $randomFileNm
          ];
          $this->model->updUser($param);
          $loginUser->mainimg = $randomFileNm;
          return [_RESULT => $randomFileNm];
        }
      case _DELETE:
        $loginUser = getLoginUser();
        if ($loginUser && $loginUser->mainimg !== null) {
          $path = _IMG_PATH . "/profile/" . getMainimgSrc();
          // $path = "static/img/profile/{$loginUser->iuser}/{$loginUser->mainimg}";
          if (file_exists($path) && unlink($path)) {
            $param = [
              "iuser" => getIuser(), 
              "delMainImg" => 1
            ];
            if ($this->model->updUser($param)) {
              $loginUser->mainimg = null;
              return [_RESULT => 1];
            }
          }
        }
        return [_RESULT => 0];
    }
  }
};
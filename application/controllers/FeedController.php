<?php

namespace application\controllers;

class FeedController extends Controller {
  public function index() {
    $this->addAttribute(_JS, ["feed/index"]);
    $this->addAttribute(_MAIN, $this->getView("feed/index.php"));
    return "template/t1.php";
  }

  public function rest() {
    // print "method : " . getMethod() ."<br>";
    switch(getMethod()) {
      case _POST:
        /*
        if(is_array($_FILES)) {
          foreach($_FILES['imgs']['name'] as $key => $value) {
            print "key : {$key}, value : {$value} <br>";
          }
        }
        print "ctnt : " . $_POST["ctnt"] . "<br>";
        print "location : " . $_POST["location"] . "<br>";
        */
        if(!is_array($_FILES) || !isset($_FILES["imgs"])) {
          return ["result" => 0];
        }
        $iuser = getIuser();
        $param = [
          "iuser" => $iuser,
          "ctnt" => $_POST['ctnt'],
          "location" => $_POST['location']
        ];
        $ifeed = $this->model->insFeed($param);

        foreach($_FILES["imgs"]["name"] as $key => $originFileNm) {
          $saveDirectory = _IMG_PATH . "/feed/" . $ifeed;
          if(!is_dir($saveDirectory)) {
            mkdir($saveDirectory, 0777, true);
          }
          $tempName = $_FILES["imgs"]["tmp_name"][$key];
          $randomFileNm = getRandomFileNm($originFileNm);
          if(move_uploaded_file($tempName, $saveDirectory . "/" . $randomFileNm)) {
            $paramImg["img"] = $randomFileNm;
            $this->model->insFeedImg($paramImg);
          }
        }
        return ["result" => 1];
    }
  }
}
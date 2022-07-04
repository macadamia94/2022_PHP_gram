<?php

namespace application\models;

use PDO;

//$pdo -> lastInsertId();

class UserModel extends Model {
  public function insUser(&$param) {
    $sql = "INSERT INTO t_user
            ( email, pw, nm ) 
            VALUES 
            ( :email, :pw, :nm )";
    $stmt = $this->pdo->prepare($sql);
    $stmt->bindValue(":email", $param["email"]);
    $stmt->bindValue(":pw", $param["pw"]);
    $stmt->bindValue(":nm", $param["nm"]);
    $stmt->execute();
    return $stmt->rowCount();
  }
  public function selUser(&$param) {
    $sql = "SELECT * FROM t_user
                WHERE email = :email";
    $stmt = $this->pdo->prepare($sql);
    $stmt->bindValue(":email", $param["email"]);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_OBJ);    // 값이 없을 경우 false가 넘어감
  }

  public function selUserProfile(&$param) {
    $feediuser = $param["feediuser"];
    $loginiuser = $param["loginiuser"];
    $sql = "SELECT iuser, email, nm, cmt, mainimg
                  , (SELECT COUNT(ifeed) FROM t_feed WHERE iuser = {$feediuser}) AS feedcnt
                  ,	(SELECT COUNT(fromiuser) FROM t_user_follow WHERE fromiuser = {$feediuser} AND toiuser ={$loginiuser}) AS youme
                  ,	(SELECT COUNT(toiuser) FROM t_user_follow WHERE fromiuser = {$loginiuser} AND toiuser = {$feediuser}) AS meyou
            FROM t_user
            WHERE iuser = {$feediuser}"; 
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_OBJ);
  }

  //------------------ Follow ------------------//
  public function insUserFollow(&$param) {
    $sql = "INSERT INTO t_user_follow
            ( fromiuser, toiuser ) 
            VALUES 
            ( :fromiuser, :toiuser )";
            // 로그인한 사람, 대상
    $stmt = $this->pdo->prepare($sql);
    $stmt->bindValue(":fromiuser", $param["fromiuser"]);
    $stmt->bindValue(":toiuser", $param["toiuser"]);
    $stmt->execute();
    return $stmt->rowCount();
  }

  public function delUserFollow(&$param) {
    $sql = "DELETE FROM t_user_follow
            WHERE fromiuser = :fromiuser
            AND toiuser = :toiuser";
    $stmt = $this->pdo->prepare($sql);
    $stmt->bindValue(":fromiuser", $param["fromiuser"]);
    $stmt->bindValue(":toiuser", $param["toiuser"]);
    $stmt->execute();
    return $stmt->rowCount();
  }
}

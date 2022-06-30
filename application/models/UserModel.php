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

  public function selUserByIuser(&$param) {
    $sql = "SELECT iuser, email, nm, cmt, mainimg, regdt 
              FROM t_user
             WHERE iuser = :iuser";
    $stmt = $this->pdo->prepare($sql);
    $stmt->bindValue(":iuser", $param["iuser"]);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_OBJ);
}
}

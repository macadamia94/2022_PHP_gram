<?php

namespace application\models;

use PDO;

class FeedModel extends Model {
  public function insFeed(&$param) {
    $sql = "INSERT INTO t_feed
            (location, ctnt, iuser)
            VALUES
            (:location, :ctnt, :iuser)";
    $stmt = $this->pdo->prepare($sql);
    $stmt->bindValue(":location", $param["location"]);
    $stmt->bindValue(":ctnt", $param["ctnt"]);
    $stmt->bindValue(":iuser", $param["iuser"]);
    $stmt->execute();
    return intval($this->pdo->lastInsertId());
  }

  public function insFeedImg(&$param) {
    $sql = "INSERT INTO t_feed_img
            (ifeed, img)
            VALUES
            (:ifeed, :img)";
    $stmt = $this->pdo->prepare($sql);
    $stmt->bindValue(":ifeed", $param["ifeed"]);
    $stmt->bindValue(":img", $param["img"]);
    $stmt->execute();
    return $stmt->rowCount(); // 영향을 미친 레코드 수가 return됨
  }

  public function selFeedList(&$param) {
    $sql = "SELECT A.ifeed, A.location, A.ctnt, A.iuser, A.regdt
		             , C.nm AS writer, C.mainimg
		             , IFNULL(E.cnt, 0) AS favCnt
		             , IF(F.ifeed IS NULL, 0, 1) AS isFav -- IF(조건식, true, false)
              FROM t_feed A
             INNER JOIN t_user C
                ON A.iuser = C.iuser
              LEFT JOIN
                  (
                    SELECT ifeed, COUNT(ifeed) AS cnt
                    FROM t_feed_fav
                    GROUP BY ifeed
                  ) E
                ON A.ifeed = E.ifeed
              LEFT JOIN 
                  (
                    SELECT ifeed
                    FROM t_feed_fav
                    WHERE iuser = :iuser
                  ) F
                ON A.ifeed = F.ifeed
             ORDER BY A.ifeed DESC
             LIMIT :startIdx, :feedItemCnt";
    $stmt = $this->pdo->prepare($sql);
    $stmt->bindValue(":iuser", $param["iuser"]);
    $stmt->bindValue(":startIdx", $param["startIdx"]);
    $stmt->bindValue(":feedItemCnt", _FEED_ITEM_CNT);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_OBJ);
  }

  public function selFeedImgList($param) {
    $sql = "SELECT img FROM t_feed_img WHERE ifeed = :ifeed";
    $stmt = $this->pdo->prepare($sql);
    $stmt->bindValue(":ifeed", $param->ifeed);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_OBJ);
  }
}
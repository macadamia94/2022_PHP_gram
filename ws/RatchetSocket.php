<?php

namespace ws;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use application\libs\Application;
//use application\models\DmModel;

class RatchetSocket implements MessageComponentInterface {  // implements 구현, extends 상속
  protected $clients;

  public function __construct() {
    // clients 변수에 접속 클라이언트들을 담을 객체 생성
    $this->clients = new \SplObjectStorage;
  }

  // 클라이언트 접속
  public function onOpen(ConnectionInterface $conn) { 
    // clients 객체에 클라이언트 추가
    $this->clients->attach($conn);
    $conn->send($conn->resourceId);

    echo "New connection! ({$conn->resourceId}) / Clients Count : {$this->clients->count()}\n";
  }

  //메세지 전송, $from 인자값은 메세지를 보낸 클라이언트의 정보, $msg인자값은 보낸 메세지
  public function onMessage(ConnectionInterface $from, $msg) {
    $data = json_decode($msg);
    print_r($data);
    switch ($data->type) {
      case "dm":
        $param = [
          "idm" => $data->idm,  // 어느 방에서의 대화인지
          "loginiuser" => $data->iuser, // 내가 누구인지
          "msg" => $data->msg // 어떤 내용의 메시지인지
        ];
        $model = Application::getModel("dm");
        $model->insDmMsg($param);
        $model = null;
        print "dm send end!!";
        break;
    }

    foreach ($this->clients as $client) { // 전체 브로드캐스트 시킴 → 보안상 안 좋음
      //메세지 전송 
      print "send!!!\n";
      print $msg . "\n";
      $client->send($msg);
    }
  }

  //클라이언트 접속 종료
  public function onClose(ConnectionInterface $conn) {
    // clients 객체에 클라이언트 접속정보 제거
    $this->clients->detach($conn);

    echo "Connection {$conn->resourceId} has disconnected\n";
  }

  public function onError(ConnectionInterface $conn, \Exception $e) {
    echo "An error has occurred: {$e->getMessage()}\n";

    $conn->close();
  }
}

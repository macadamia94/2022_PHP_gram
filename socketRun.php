<?php

use ws\RatchetSocket;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

require_once 'application/libs/Config.php'; //  model에서 socket을 못 찾아서 넣어줌
//require_once 'application/libs/Autoload.php';
require __DIR__ . '/vendor/autoload.php';

$server = IoServer::factory(
  new HttpServer(
    new WsServer(
      new RatchetSocket()
    )
  ),
  8090  // 포트번호를 바꾸고 싶을 때 여기 변경
);

$server->run();

<?php
function getJson() {
  return json_decode(file_get_contents('php://input'), true);
} //file_get_contents : 전체 파일을 문자열로 읽어오는 함수

function getParam($key) { // 쿼리스트링 유무 확인
  return isset($_GET[$key]) ? $_GET[$key] : "";
}
function getUrl() {
  return isset($_GET['url']) ? rtrim($_GET['url'], '/') : "";
}
function getUrlPaths() {
  $getUrl = getUrl();
  return $getUrl !== "" ? explode('/', $getUrl) : "";
}

function getMethod() {
  $headers = getallheaders();
  return $_SERVER['REQUEST_METHOD'];
}

function isGetOne() {
  $urlPaths = getUrlPaths();
  if (isset($urlPaths[2])) { //one
    return $urlPaths[2];
  }
  return false;
}

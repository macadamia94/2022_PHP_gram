<?php
  session_start();

  function getLoginUser() {
    return isset($_SESSION[_LOGINUSER]) ? $_SESSION[_LOGINUSER] : null;
  }

  function getIuser() {
    return getLoginUser() === null ? null : getLoginUser()->iuser;
  }

  function getMainImgSrc() {
    return getIuser() . "/" . getLoginUser()->mainimg;
  }
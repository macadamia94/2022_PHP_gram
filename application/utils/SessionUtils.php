<?php
    session_start();

    function getLoginUser() {
        return $_SESSION[_LOGINUSER];
    }

    function getIuser() {
        return getLoginUser()->iuser;
    }

    function getMainImgSrc() {
        return getIuser() . "/" . getLoginUser()->mainimg;
    }

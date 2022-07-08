# composer 설치
  - https://techhans.tistory.com/57
  - http://getcomposer.org/download

Vscode → composer.json 내용 추가</br> 				
</br> 	
{</br> 					
  "autoload": {</br> 					
    "psr-4": {</br> 					
      "ws\\\\": "ws/",</br> 					
      "application\\\\": "application/"</br> 					
    }</br> 					
  },</br> 					
  "require": {</br> 					
    "cboden/ratchet": "^0.4.4"</br> 					
  }</br> 					
}</br> 					

# ratchet 라이브러리 설치
  명령프롬프트</br>
  composer require cboden/ratchet

# composer.json, autoload 적용
  Vscode → TERMINAL 아래 입력 </br> 	
  composer dump-autoload </br> 

# 웹소켓 서버 실행 (CLI에서)
  php socketRun.php</br>
  
# 웹소켓 서버 실행시 xdebug 에러 발생 시
  
  (php.ini 파일 내용 중, 아래 부분 주석 처리로 해결)</br>
  ;zend_extension=xdebug

  (php.ini 파일 내용 중, 아래 부분 주석 해제로 해결)</br>
  extension=openssl

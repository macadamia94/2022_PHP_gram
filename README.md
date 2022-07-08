# 2022_PHP_gram
학원수업_MVC_v2 + 연습

< composer 설치 >			
php.ini 			
zend_extension=xdebug			
주석(;) 후 설치			
https://getcomposer.org/download/			
설치 안되면 			
extension=openssl			
주석(;) 해제 했는지 확인			

Vscode → composer.json 내용 추가			

{				
  "autoload": {				
    "psr-4": {				
      "ws\\": "ws/",				
      "application\\": "application/"				
    }				
  },				
  "require": {				
    "cboden/ratchet": "^0.4.4"				
  }				
}				


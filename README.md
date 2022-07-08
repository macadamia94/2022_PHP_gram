# 2022_PHP_gram
학원수업_MVC_v2 + 연습

< composer 설치 >	</br> 		
php.ini</br> 			
zend_extension=xdebug</br> 				
주석(;) 후 설치</br> 				
https://getcomposer.org/download/	</br> 			
설치 안되면 </br> 				
extension=openssl	</br> 			
주석(;) 해제 했는지 확인 </br> 		
</br> 	
Vscode → composer.json 내용 추가</br> 				
</br> 	
{</br> 					
  "autoload": {</br> 					
    "psr-4": {</br> 					
      "ws\\": "ws/",</br> 					
      "application\\": "application/"</br> 					
    }</br> 					
  },</br> 					
  "require": {</br> 					
    "cboden/ratchet": "^0.4.4"</br> 					
  }</br> 					
}</br> 					

Vscode → TERMINAL 아래 입력 </br> 	
composer dump-autoload </br> 

<?php


if(!class_exists("Exceptionlong")){
    class Exceptionlong extends Exception{
        function __construct(string $e="", int $ecode = 0){
            parent::__construct($e, $ecode);
        }
    }
}

if(!class_exists("notValidinException")){
    
    class notValidinException extends Exceptionlong{
    }
}   

if(!class_exists("InputException")){
        
    class InputException extends Exceptionlong{
    }
}    

if(!class_exists("AttrException")){
        
    class AttrException extends Exceptionlong{
    }
}
if(!class_exists("dbIOException")){
        
    class dbIOException extends Exceptionlong{
    }
}
?>
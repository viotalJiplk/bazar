<?php
    include_once("php/dbio.php");
    include_once("php/classdef.php");
    include_once("php/helper.php");
    session_start();
    header("Content-type: application/json");

    try{
        $json = file_get_contents('php://input');
        $payload = json_decode($json);
        if($payload == NULL){
            
            throw new notValidinException("no json sent");
        }else{
            if(!isset($_SESSION["email"])){
                if(property_exists($payload, "email") && property_exists($payload, "password")){
                    if(gettype($payload->email) == "string" & gettype($payload->password) == "string"){
                        $sswordsearch =  dbio("SELECT id,password FROM users WHERE email = :email", array(":email" => $payload->email ));
                        if(isset($sswordsearch[0])){
                            $sswordsearch = $sswordsearch[0]; 
                            if(property_exists($sswordsearch,"password")){
                                $sswordsearch = $sswordsearch->password;
                                if(password_verify($payload->password, $sswordsearch)){
                                    $_SESSION["email"] = $payload->email;
                                    $_SESSION["id"] = $payload->id;
                                    print("{\"estate\":\"0\",\"result\":\"ok\", \"email\":\"".$payload->email."\", \"msg\":\"logged in\"}");
                                }else{
                                    throw new InputException("Wrong email or password.");    
                                }
                            }else{
                                throw new InputException("Wrong email or password.");
                            }
                        }else{
                            throw new InputException("Wrong email or password.");
                        }
                    }else{
                        throw new InputException("Invalid input.");
                    }
                }else{
                    throw new InputException("Invalid input.");
                }
            }else{
                http_response_code(403);
                print("{\"estate\":\"1\",\"errortype\":\"inputexception\",\"msg\":\"already logged in\", \"email\":\"".$_SESSION["email"]."\"}");
            }
        }
    }catch(InputException $e){                                              
        http_response_code(403);
        print("{\"estate\":\"1\",\"errortype\":\"inputexception\",\"msg\":\"".$e->getMessage()."\"}");
    }catch(dbIOException $e){
        http_response_code(500);                                               //some db exception
        print("{\"estate\":\"1\",\"errortype\":\"serverexception\",\"msg\":\"server exception\"}");
    }catch(Exception $e){
        http_response_code(500);
        print("{\"estate\":\"1\",\"errortype\":\"serverexception\",\"msg\":\"unknown exception\"}");
    }
?>
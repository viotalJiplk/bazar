<?php
    include_once("php/dbio.php");
    include_once("php/classdef.php");
    include_once("php/helper.php");
    include_once("php/generatejwt.php");
    header("Content-type: application/json");

    try{
        $json = file_get_contents('php://input');
        $payload = json_decode($json);
        if($payload == NULL){
            
            throw new notValidinException("no json sent");
        }else{
            if(property_exists($payload, "email") && property_exists($payload, "password")){
                if(gettype($payload->email) == "string" & gettype($payload->password) == "string"){
                    $sswordsearch =  dbio("SELECT uid, password, uname, email FROM users WHERE email = :email", array(":email" => $payload->email));
                    if(isset($sswordsearch[0])){
                        $sswordsearch = $sswordsearch[0]; 
                        if(property_exists($sswordsearch,"password") & property_exists($sswordsearch,"uid")& property_exists($sswordsearch,"uname")& property_exists($sswordsearch,"email")){
                            $id = $sswordsearch->uid;
                            $uname = $sswordsearch->uname;
                            $email = $sswordsearch->email;
                            $sswordsearch = $sswordsearch->password;
                            if(password_verify($payload->password, $sswordsearch)){
                                $jwt = create_jwt($uname, $email, $id);
                                print("{\"estate\":\"0\",\"result\":\"ok\",\"jwt\":\"$jwt\"}");
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
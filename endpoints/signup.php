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
            if(property_exists($payload, "email") && property_exists($payload, "password") && property_exists($payload, "username")){
                if(preg_match('/^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/iD', $payload->email)){ //regex from http://emailregex.com/
                    $sswordhash = password_hash($payload->password, PASSWORD_DEFAULT);
                    dbio("INSERT INTO users (email, password, uname)VALUES (:email, :sswordhash, :uname);", array(":email"=>$payload->email,":sswordhash" => $sswordhash, ":uname" => $payload->username));
                    $uid =  dbio("SELECT uid, email, uname FROM users WHERE email = :email", array(":email" => $payload->email));
                    if(isset($uid[0])){
                        $uid = $uid[0]; 
                        if(property_exists($uid,"uid")& property_exists($uid,"uid")& property_exists($uid,"uname")){
                            $id = $uid->uid;
                            $uname = $uid->uname;
                            $email = $uid->email;
                        }else{
                            throw new Exception();
                        }
                    }else{
                        throw new Exception();
                    }
                    $jwt = create_jwt($uname, $email, $id);
                    print("{\"estate\":\"0\",\"result\":\"ok\", \"jwt\":\"$jwt\",\"msg\":\"logged in\"}");
                }else{
                    throw new InputException("You can only use alphanumeric characters in email.");
                }
            }else{
                throw new InputException("Missing email or password or username.");
            }
        }
    }catch(InputException $e){                                              
        http_response_code(403);
        print("{\"estate\":\"1\",\"errortype\":\"inputexception\",\"msg\":\"".$e->getMessage()."\"}");
    }catch(dbIOException $e){
        if($e->getCode() == 23000){
            http_response_code(403);
            print("{\"estate\":\"1\",\"errortype\":\"inputexception\",\"msg\":\"email or username is alredy in database\"}");
        }else{
            http_response_code(500);                                               //some db exception
            print("{\"estate\":\"1\",\"errortype\":\"serverexception\",\"msg\":\"server exception\"}");
        }
    }catch(Exception $e){
        http_response_code(500);
        print("{\"estate\":\"1\",\"errortype\":\"serverexception\",\"msg\":\"unknown exception\"}");
    }
?>
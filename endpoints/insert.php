<?php
    include_once("php/dbio.php");
    include_once("php/classdef.php");
    include_once("php/helper.php");
    include_once("php/verifyjwt.php");

    header("Content-type: application/json");
    try{
        $headers = getallheaders();
        $json = file_get_contents('php://input');
        $payload = json_decode($json);
        if($payload == NULL){
            throw new notValidinException("no json sent");
        }else{
            if(isset($payload->cat) & isset($payload->price)& isset($payload->descr) & isset($payload->name)){
                if($payload->cat != NULL  & $payload->price !== NULL){
                    if(array_key_exists("Authorization", $headers) && $headers["Authorization"] != ""){
                        $auth_header = getallheaders()["Authorization"];
                        $matches = [];
                        $jwt = preg_match('/(?<=Bearer )[a-zA-Z0-9\.\-_]*/', $auth_header, $matches);
                        if(count($matches) == 1){
                            $jwt =$matches[0];
                            if(default_jwt_validator($jwt)){
                                $jwt = json_decode(base64url_decode(explode(".",$jwt)[1]));
                                $param[":email"] = $jwt->eu_viotal_bazar_email;
                                $param[":passwd"] = NULL;
                                $param[":uid"]  =  $jwt->eu_viotal_bazar_uid;
                            }else{
                                throw new notValidinException("JWT invalid.");
                            }
                        }else{
                            throw new notValidinException("JWT invalid format.");
                        }
                    }elseif(isset($payload->email) & isset($payload->passwd)){
                        if($payload->email != NULL & $payload->passwd != NULL){
                            $param[":email"] = escapehtml(array(), $payload->email);
                            $param[":passwd"] = password_hash($payload->passwd, PASSWORD_DEFAULT);
                            $param[":uid"] = NULL;
                        }else{
                            throw new notValidinException("type of email in payload is incorrect");
                        }
                        if(gettype($param[":passwd"]) != "string"){
                            throw new notValidinException("type of password in payload is incorrect");
                        }
                        if(!preg_match('/^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/iD', $payload->email)){ //regex from http://emailregex.com/
                            throw new notValidinException("Invalid email.");
                        }    
                    }else{
                        throw new notValidinException("payload is invalid");
                    }
                    $param[":cat"] = escapehtml(array(), $payload->cat);
                    $param[":price"] = $payload->price;
                    
                    
                    if((gettype($param[":email"]) != "string") OR (gettype($param[":cat"]) != "string") OR (gettype($param[":price"]) != "integer")){
                        throw new notValidinException("type of something in payload is incorrect");
                    }

                    $sql = "INSERT INTO zaznamy(uid, name, email, passwd, cat, loc, descr, pic, price, phone) VALUES(:uid, :name1, :email, :passwd, :cat, :loc, :descr, :pic, :price, :phone)";
                    
                    if($payload->name){
                        $param[":name1"] = escapehtml(array(),  strval($payload->name));
                    }else{
                        throw new notValidinException("No name of product provided."); 
                    }

                    if(isset($payload->phone)){
                        $param[":phone"] = escapehtml(array(),  strval($payload->name));
                    }else{
                        $param[":phone"] = NULL;
                    }

                    if(isset($payload->loc)){
                        $param[":loc"] = escapehtml(array(),  strval($payload->name));
                    }else{
                        $param[":loc"] = NULL;
                    }

                    if($payload->descr != ""){
                        $param[":descr"] = escapehtml(array(), strval($payload->descr));
                    }else{
                        throw new notValidinException("No description provided.");  
                    }

                    if(isset($payload->picture)){
                        if(preg_match('/^img_[a-z0-9]*((\.svg)|(\.jpg)|(\.png)|(\.gif))/',$payload->picture) === 1){
                            $param[":pic"] = $payload->picture;
                        }else{
                            throw new notValidinException("Error in file name.");        
                        }
                    }else{
                        $param[":pic"] = NULL;
                    }
                    dbio($sql, $param);
                }else{
                    throw new notValidinException("wrong payload");
                }
            }else{
                throw new notValidinException("wrong payload");
            }
        }
        $jsonout = new \stdClass();
        $jsonout->status = "ok";
        echo json_encode($jsonout);
    }catch(notValidinException $e){                                         //something in json payload was missing
        print("{\"estate\":\"1\",\"errortype\":\"inputexception\",\"msg\":\"".$e->getMessage()."\"}");
    }catch(Exception $e){                                               //some db exception
        print("{\"estate\":\"1\",\"errortype\":\"serverexception\",\"msg\":\"unknown exception\"}");
    }
?>
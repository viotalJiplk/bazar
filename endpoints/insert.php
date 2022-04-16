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
            if(isset($payload->cat) & isset($payload->price)){
                if($payload->cat != NULL  & $payload->price != NULL){
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
                    }else{
                        throw new notValidinException("payload is invalid");
                    }
                    $param[":cat"] = escapehtml(array(), $payload->cat);
                    $param[":price"] = $payload->price;
                    
                    
                    if((gettype($param[":email"]) != "string") OR (gettype($param[":cat"]) != "string") OR (gettype($param[":price"]) != "integer")){
                        throw new notValidinException("type of something in payload is incorrect");
                    }


                    $sql = "INSERT INTO zaznamy(name, uid, email, passwd, cat, descr, pic, price) VALUES(:name1, :uid, :email, :passwd, :cat, :descr, :pic, :price)";
                    
                    if(isset($payload->name)){
                        $param[":name1"] = escapehtml(array(),  strval($payload->name));
                    }else{
                        $param[":name1"] = NULL;
                    }

                    if(isset($payload->descr)){
                        $param[":descr"] = escapehtml(array(), strval($payload->descr));
                    }else{
                        $param[":descr"] = NULL;
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
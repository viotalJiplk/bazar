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
            if(isset($payload->cat) & isset($payload->price)){
                if($payload->cat != NULL  & $payload->price != NULL){
                    if(isset($payload->loggedin)){
                        if($payload->loggedin){
                            if(!array_key_exists("email", $_SESSION)){
                                throw new notValidinException("not logged in");
                            }
                            $param[":email"] = $_SESSION["email"];
                            $param[":passwd"] = NULL;
                            $param[":uid"]  =  $_SESSION["id"];
                        }else{
                            throw new notValidinException("type of something in payload is incorrect");
                        }
                    }elseif(isset($payload->email) & isset($payload->passwd)){
                        if($payload->email != NULL & $payload->passwd != NULL){
                            $param[":email"] = escapehtml(array(), $payload->email);
                            $param[":passwd"] = password_hash($payload->passwd, PASSWORD_DEFAULT);
                            $param[":uid"] = NULL;
                        }else{
                            throw new notValidinException("type of something in payload is incorrect");
                        }
                        if(gettype($param[":passwd"]) != "string"){
                            throw new notValidinException("type of something in payload is incorrect");
                        }    
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
                    if(array_key_exists("up_file", $_SESSION)){
                        $param[":pic"] = $_SESSION["up_file"];
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
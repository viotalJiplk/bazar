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
            if(isset($payload->email) & isset($payload->passwd) & isset($payload->cat) & isset($payload->price)){
                if($payload->email != NULL & $payload->passwd != NULL & $payload->cat != NULL  & $payload->price != NULL){
                    $param = array();
                    $param[":email"] = escapehtml(array(), $payload->email);
                    $param[":passwd"] = $payload->passwd;
                    $param[":cat"] = escapehtml(array(), $payload->cat);
                    $param[":price"] = $payload->price;                    

                    if((gettype($param[":email"]) != "string") OR (gettype($param[":passwd"]) != "string") OR (gettype($param[":cat"]) != "string") OR (gettype($param[":price"]) != "integer")){         //to do date format checking
                        throw new notValidinException("type of something in payload is incorrect");
                    }
                    if(!preg_match('/^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/iD', $param[":email"])){
                        throw new notValidinException("wrong email");
                    }
                    $param[":passwd"] = password_hash($param[":passwd"], PASSWORD_DEFAULT);

                    $sql = "INSERT INTO zaznamy(name, email, passwd, cat, descr, pic, price) VALUES(:name1, :email, :passwd, :cat, :descr, :pic, :price)";
                    
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
        echo json_encode("{\"estate\":\"1\",\"errortype\":\"inputexception\",\"msg\":\"".$e->getMessage()."\"}");
    }catch(Exception $e){                                               //some db exception
        echo json_encode("{\"estate\":\"1\",\"errortype\":\"serverexception\",\"msg\":\"unknown exception\"}");
    }
?>
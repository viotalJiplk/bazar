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
    }catch(Exception $e){                                               //some db exception
        $error = "system exception";
        echo json_encode($e);
    }catch(notValidinException $e){                                         //something in json payload was missing
        $error = "something was missing";
        echo json_encode($e);
    }
?>
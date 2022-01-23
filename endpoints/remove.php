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
            if(isset($payload->id) & isset($payload->passwd)){
                if($payload->id != NULL & $payload->passwd != NULL){
                    $param = array();
                    $param[":id"] = $payload->id;

                    if(gettype($param[":id"]) != "integer" & $payload->passwd){         //to do date format checking
                        throw new notValidinException("type of something in payload is incorrect");
                    }
                    $sql = "SELECT password FROM zaznamy WHERE id=:id";
                    $sswordsearch = dbio($sql, $param);
                    if(isset($sswordsearch[0])){
                        $sswordsearch = $sswordsearch[0]; 
                        if(property_exists($sswordsearch,"password")){
                            $sswordsearch = $sswordsearch->password;
                            if(password_verify($payload->password, $sswordsearch)){
                                dbio("DELETE FROM zaznamy WHERE id=:id", [":id"=>$payload->id]);
                            }else{
                                throw new InputException("Wrong password.");    
                            }
                        }else{
                            throw new InputException("Wrong password.");
                        }
                    }else{
                        throw new InputException("Wrong password.");
                    }
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
        echo json_encode("{\"estate\":\"1\",\"errortype\":\"serverexception\",\"msg\":\"unknown exception\"}");
    }catch(notValidinException $e){                                         //something in json payload was missing
        echo json_encode("{\"estate\":\"1\",\"errortype\":\"inputexception\",\"msg\":\"".$e->getMessage()."\"}");
    }
?>
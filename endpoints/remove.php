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
                    $param[":id"] = intval($payload->id);

                    if(gettype($param[":id"]) != "integer" & gettype($payload->passwd)=="string"){
                        throw new notValidinException("type of something in payload is incorrect");
                    }
                    $sql = "SELECT passwd FROM zaznamy WHERE id=:id";
                    $sswordsearch = dbio($sql, $param);
                    if(isset($sswordsearch[0])){
                        $sswordsearch = $sswordsearch[0]; 
                        if(property_exists($sswordsearch,"passwd")){
                            $sswordsearch = $sswordsearch->passwd;
                            if(password_verify($payload->passwd, $sswordsearch)){
                                dbio("DELETE FROM zaznamy WHERE id=:id", [":id"=>$payload->id]);
                                print("{\"estate\":\"0\",\"result\":\"ok\", \"id\":\"".$payload->id."\", \"msg\":\"removed\"}");
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
                    throw new notValidinException("Wrong payload");
                }
            }else{
                throw new notValidinException("wrong payload");
            }
        }
    }catch(notValidinException $e){                                         //something in json payload was missing
        http_response_code(403);
        print("{\"estate\":\"1\",\"errortype\":\"inputexception\",\"msg\":\"".$e->getMessage()."\"}");
    }catch(InputException $e){
        http_response_code(403);
        print("{\"estate\":\"1\",\"errortype\":\"inputexception\",\"msg\":\"".$e->getMessage()."\"}");
    }catch(Exception $e){
        http_response_code(403);
        print("{\"estate\":\"1\",\"errortype\":\"serverexception\",\"msg\":\"unknown exception\"}");
    }
?>
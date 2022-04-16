<?php
    include_once("php/dbio.php");
    include_once("php/classdef.php");
    include_once("php/helper.php");
    include_once("php/verifyjwt.php");

    header("Content-type: application/json");
    try{
        $json = file_get_contents('php://input');
        $payload = json_decode($json);
        if($payload == NULL){
            throw new notValidinException("no json sent");
        }else{
            if(isset($payload->id)){
                if($payload->id != NULL){
                    $param = array();
                    $param[":id"] = intval($payload->id);

                    if(gettype($param[":id"]) != "integer"){
                        throw new notValidinException("type of something in payload is incorrect");
                    }
                    $headers = getallheaders();
                    $sql = "SELECT passwd, uid FROM zaznamy WHERE id=:id";
                    $sswordsearch = dbio($sql, $param);
                    if(isset($sswordsearch[0])){
                        $sswordsearch = $sswordsearch[0]; 
                        if(property_exists($sswordsearch,"passwd") & property_exists($sswordsearch,"uid")){
                            if(array_key_exists("Authorization", $headers)){
                                $auth_header = getallheaders()["Authorization"];
                                $matches = [];
                                $jwt = preg_match('/(?<=Bearer )[a-zA-Z0-9\.\-_]*/', $auth_header, $matches);
                                if(count($matches) == 1){
                                    $jwt =$matches[0];
                                    if(default_jwt_validator($jwt)){
                                        $jwt = json_decode(base64url_decode(explode(".",$jwt)[1]));
                                        if($jwt->eu_viotal_bazar_uid == $sswordsearch->uid){
                                            remove_record($payload->id);
                                        }else{
                                            throw new InputException("Not your record.");
                                        }
                                    }else{
                                        throw new notValidinException("JWT invalid.");
                                    }
                                }else{
                                    throw new notValidinException("JWT invalid format.");
                                }
                            }else{
                                if(isset($payload->passwd)){
                                    if($payload->passwd != NULL){
                                        if(gettype($payload->passwd)=="string"){
                                            $sswordsearch = $sswordsearch->passwd;
                                            if(password_verify($payload->passwd, $sswordsearch)){
                                                remove_record($payload->id);
                                            }else{
                                                throw new InputException("Wrong password.");    
                                            }
                                        }else{
                                            throw new notValidinException("type of something in payload is incorrect");
                                        }
                                    }else{
                                        throw new notValidinException("Wrong payload");
                                    }
                                }else{
                                    throw new notValidinException("Wrong payload");
                                }
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


    function remove_record(int $id){
        dbio("DELETE FROM zaznamy WHERE id=:id", [":id"=>$id]);
        print("{\"estate\":\"0\",\"result\":\"ok\", \"id\":\"".$id."\", \"msg\":\"removed\"}");
    }
?>
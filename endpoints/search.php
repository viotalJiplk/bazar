<?php
    include("php/dbio.php");
    include("php/classdef.php");
    include("php/helper.php");

    header("Content-type: application/json");
    try{
        
        $json = file_get_contents('php://input');
        $payload = json_decode($json);
        if($payload == NULL){
            throw new notValidinException("no json sent");
        }else{
            $param = array();

            $sql = "SELECT name, email, cat, descr, pic, price, date FROM zaznamy WHERE date >= :from_date AND price >= :price_from";
                    
            if(isset($payload->cat)  & $payload->cat != ""){
                $param[":cat"] = $payload->cat;
                $sql = $sql .  " AND cat = :cat";
            }

            if(isset($payload->price_from) & $payload->price_from != ""){
                $param[":price_from"] = $payload->price_from;
            }else{
                $param[":price_from"] = 0;
            }
            if(isset($payload->price_to) & $payload->price_to != ""){
                $param[":price_to"] = $payload->price_to;
                $sql = $sql . " AND price <= :price_to";
            }
            if(isset($payload->from_date) & $payload->from_date != ""){
                $param[":from_date"] = $payload->from_date;
            }else{
                $param[":from_date"] = "1970-01-01";
            }
            $result = dbio($sql, $param);
        }
        echo json_encode($result);
    }catch(Exception $e){                                               //some db exception
        $error = "system exception";
        echo json_encode($e);
    }catch(notValidinException $e){                                         //something in json payload was missing
        echo json_encode($e);
    }
?>
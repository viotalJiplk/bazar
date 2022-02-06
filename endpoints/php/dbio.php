<?php

include_once(dirname(__FILE__)."/classdef.php");     //the location will be found even when this file (dbio.php) was included
include_once(dirname(__FILE__)."/secrets.php");

$dirname = dirname(__FILE__);

/**
 * function providing interface to database
 *
 * @param string $sql sql command
 * @param array $param data for sql command
 * @return array array of resultsyy
 */
function dbio(string $sql, array $param){
    global $servername, $dbname, $username, $password;
    try{
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

            //adding parmeters and testing return value
        if(!$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION)){    //PDO::ERRMODE_SILENT for not debug uses
            throw new AttrException("Failed to set atribute (ERRMODE)");
        }
        if(!$conn->setAttribute(PDO::ATTR_ORACLE_NULLS, PDO::NULL_EMPTY_STRING)){    //set atribute allways 2 param, empety = NULL
            throw new AttrException("Failed to set atribute (NULL_EMPTY_STRING)");
        }
        if(!$conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ)){ //array only with collum name (not indexed ones)
            throw new AttrException("Failed to set atribute (FETCH_MODE)");
        }
    
        $stmt = $conn->prepare($sql);
        $stmt->execute($param);

        $result = array();
        $i = 0;

        if(preg_match("/^(SELECT)/", $sql)){                                //pro SELECT získávání výsledků
            $result = $stmt -> fetchAll();    
        }
        $conn = null;
        return $result;
    }catch(PDOException $e) {     
        if(isset($stmt)) {
            $ecode = $stmt->errorCode();                                    //zpracování výjimky databáze
        }else{
            $ecode = 0;
        }      
        $conn = null;
        throw new dbIOException("DB: PDOexcepion", $ecode);
    }catch(AttrException $e){                                               //zpracování výjimky atributů spojení s databází 
        $conn = null;
        throw new dbIOException("DB: exception when setting attribute");
    }catch(Exception $e){
        $conn = null;
        throw new dbIOException("DB: general excepion");
    }
}
?>

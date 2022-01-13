<?php
session_start();
$folder = "../pictures/";
$allowed_mime = array("image/svg+xml" => ".svg", "image/jpeg" => ".jpg", "image/png" => ".png", "image/gif" => ".gif");
$allowed_in_name = array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9");
$jsonout = new \stdClass();
header("Content-type: application/json");

function get_random_char(array $allowed_char){
    $max_index = count($allowed_char);
    return $allowed_char[rand(0, $max_index - 1)];
}

if(array_key_exists($_SERVER["CONTENT_TYPE"], $allowed_mime)){
    $putdata = fopen('php://input', "r");
    $ext = $allowed_mime[$_SERVER["CONTENT_TYPE"]];

    //get name for imige
    do{
        $fpname = "img_";
        for($i = 0; $i <= 10; $i++){
            $fpname = $fpname . get_random_char($allowed_in_name);
        }
    }while(file_exists($fpname . $ext));
    
    $fpname .= $ext;
    $fp = fopen($folder.$fpname, "w");
    while ($data = fread($putdata, 1024)){
        fwrite($fp, $data);
    }
    /* Closing streams */
    fclose($fp);
    $fparr = explode("/", $fpname);
    $filename = end($fparr);
    if(array_key_exists( "up_file" , $_SESSION) & $_SESSION["up_file"] != ""){  //if picture was alredy uploaded in this session
        unlink($_SESSION["up_file"]);
    }
    $_SESSION["up_file"] = $filename;
    fclose($putdata);
    
    $jsonout->status = "ok";
}else{
    $jsonout->status = "type of picture not allowed";
}
echo json_encode($jsonout);
?>
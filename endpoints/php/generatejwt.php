<?php
include_once(dirname(__FILE__)."/priv-key.php");
include_once(dirname(__FILE__)."/base64helper.php");

//inspired by https://roytuts.com/how-to-generate-and-validate-jwt-using-php-without-using-third-party-api/
function generate_jwt($headers, $payload, $private_key) {
	$headers_encoded = base64url_encode(json_encode($headers));
	
	$payload_encoded = base64url_encode(json_encode($payload));
	
    $signature = "";
	openssl_sign("$headers_encoded.$payload_encoded",$signature, $private_key, "SHA256");
	$signature_encoded = base64url_encode($signature);
	
	$jwt = "$headers_encoded.$payload_encoded.$signature_encoded";
	
	return $jwt;
}

function create_jwt(string $user, string $email, int $uid){
	$headers = new stdClass();
	$headers->alg = "SHA256";
	$headers->typ = "jwt";

	$payload = new stdClass();
	$payload->exp = time() + 172800;
	$payload->iat = time();
	$payload->iss = $_SERVER["SERVER_NAME"].$_SERVER['REQUEST_URI'];
	$payload->sub = $user."@".$payload->iss;
	$payload->eu_viotal_bazar_uid = $uid;
	$payload->eu_viotal_bazar_email = $email;
	$payload->eu_viotal_bazar_uname = $user;
	return generate_jwt($headers, $payload, getpriv_key());
}

//print(create_jwt("user2", "user2@example.com", 3));
?>
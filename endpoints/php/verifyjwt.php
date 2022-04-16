<?php

include_once(dirname(__FILE__)."/base64helper.php");

function default_jwt_validator($jwt){
    return is_jwt_valid($jwt, openssl_pkey_get_public(file_get_contents("publickey.crt")));
}

function is_jwt_valid($jwt, $public_key) {
	$to_return = FALSE;
	try{
		// split the jwt
		$tokenParts = explode('.', $jwt);
		$header = $tokenParts[0];
		$payload = $tokenParts[1];
		$signature_provided = base64url_decode($tokenParts[2]);
		$payload_decoded = json_decode(base64_decode($payload));

		// check the expiration time
		if(property_exists($payload_decoded, "exp")){
			$expiration = $payload_decoded->exp;
			if(($expiration - time()) < 0){
				$to_return = FALSE;
				print("expexpprob");
			}else{
				if(openssl_verify("$header.$payload", $signature_provided, $public_key,"SHA256")){
					$to_return = TRUE;
				}else{
					print("encprob");
					$to_return = FALSE;
				}
			}
		}else{
			print("noexpprob");
			$to_return = FALSE;
		}
	}catch(Exception $e){
		//can be logged
		print($e);
	}
	return $to_return;
}
?>
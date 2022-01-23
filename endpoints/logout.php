<?php
header("Content-type: application/json");
session_start();
unset($_SESSION["email"]);
unset($_SESSION["id"]);
print("{\"estate\":\"0\",\"result\":\"ok\", \"msg\":\"logged out\"}");
?>
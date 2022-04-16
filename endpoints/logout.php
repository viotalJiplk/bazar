<?php
header("Content-type: application/json");
session_destroy();
print("{\"estate\":\"0\",\"result\":\"ok\", \"msg\":\"logged out\"}");
?>
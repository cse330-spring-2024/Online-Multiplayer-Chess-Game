<?php
    $mysqli = new mysqli('localhost','smart3','tiantianmoyu','module7');
    if($mysqli->connect_errno) {
        printf("Connection Failed: %s\n", $mysqli->connect_error);
        exit;
    }


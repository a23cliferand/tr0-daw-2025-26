<?php

class Conexio {
    private $servername = "localhost:3306";
    private $username = "a23cliferand_root";
    private $password = "2kjQrFKk8cssXOOSUihQ";
    private $database = "a23cliferand_tr0";
    private $conn;

    public function __construct() {
        $this->conn = new mysqli(
            $this->servername,
            $this->username,
            $this->password,
            $this->database
        );

        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function getConnection() {
        return $this->conn;
    }

    public function close() {
        $this->conn->close();
    }
}
?>
<?php

class Conexio
{
    private $servername = "TR0_DB";
    private $username = "root";
    private $password = "Jupiter1";
    private $database = "tr0_db";
    private $conn;

    public function __construct()
    {
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

    public function getConnection()
    {
        return $this->conn;
    }

    public function close()
    {
        $this->conn->close();
    }
}
?>
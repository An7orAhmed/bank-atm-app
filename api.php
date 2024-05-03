<?php
header('Access-Control-Allow-Origin: *');

// MySQL database configuration
$servername = "localhost";
$username = "id22112942_atmapp";
$password = "'-83O^N_Z]4I?B%cb";
$database = "id22112942_atmapp";

// Create MySQL connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to handle user login
function login($conn, $email, $password) {
    $sql = "SELECT * FROM users WHERE email='$email' AND password='$password'";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode(['message' => 'Login successful', 'user' => $user]);
    } else {
        echo json_encode(['error' => 'Invalid email or password']);
    }
}

// Function to handle user registration
function register($conn, $fullName, $email, $phone, $address, $password, $fingerId) {
    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        echo json_encode(['error' => 'User already exists']);
    } else {
        $sql = "INSERT INTO users (full_name, email, phone, address, password, finger_id, balance) VALUES ('$fullName', '$email', '$phone', '$address', '$password', '$fingerId', 0)";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['message' => 'User registered successfully']);
        } else {
            echo json_encode(['error' => 'Internal Server Error']);
        }
    }
}

// Function to check current balance by fingerId
function checkBalance($conn, $fingerId) {
    $sql = "SELECT balance FROM users WHERE finger_id='$fingerId'";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $balance = $result->fetch_assoc()['balance'];
        echo json_encode(['balance' => $balance]);
    } else {
        echo json_encode(['error' => 'User not found']);
    }
}

// Function to get transaction details by fingerId
function getTransactions($conn, $fingerId) {
    $sql = "SELECT * FROM transactions WHERE user_id IN (SELECT id FROM users WHERE finger_id='$fingerId')";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $transactions = [];
        while ($row = $result->fetch_assoc()) {
            $transactions[] = $row;
        }
        echo json_encode(['transactions' => $transactions]);
    } else {
        echo json_encode(['error' => 'User not found']);
    }
}

// Function to make withdraw
function withdraw($conn, $fingerId, $amount) {
    $sql = "SELECT * FROM users WHERE finger_id='$fingerId'";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if ($user['balance'] < $amount) {
            echo json_encode(['error' => 'Insufficient balance']);
        } else {
            $newBalance = $user['balance'] - $amount;
            $sql = "UPDATE users SET balance=$newBalance WHERE finger_id='$fingerId'";
            if ($conn->query($sql) === TRUE) {
                // Insert transaction record
                $sql = "INSERT INTO transactions (user_id, date, type, amount) VALUES ({$user['id']}, NOW(), 'debit', $amount)";
                if ($conn->query($sql) === TRUE) {
                    echo json_encode(['message' => 'Withdraw successful']);
                } else {
                    echo json_encode(['error' => 'Internal Server Error']);
                }
            } else {
                echo json_encode(['error' => 'Internal Server Error']);
            }
        }
    } else {
        echo json_encode(['error' => 'User not found']);
    }
}

// Function to make cash in
function cashIn($conn, $fingerId, $amount) {
    $sql = "SELECT * FROM users WHERE finger_id='$fingerId'";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $newBalance = $user['balance'] + $amount;
        $sql = "UPDATE users SET balance=$newBalance WHERE finger_id='$fingerId'";
        if ($conn->query($sql) === TRUE) {
            // Insert transaction record
            $sql = "INSERT INTO transactions (user_id, date, type, amount) VALUES ({$user['id']}, NOW(), 'credit', $amount)";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(['message' => 'Cash in successful']);
            } else {
                echo json_encode(['error' => 'Internal Server Error']);
            }
        } else {
            echo json_encode(['error' => 'Internal Server Error']);
        }
    } else {
        echo json_encode(['error' => 'User not found']);
    }
}

// Function to handle website greeting
function sayHello() {
    echo 'Hello, Bank ATM App running...';
}

// Main function to handle requests
function handleRequest($conn) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        switch($_POST['action']) {
            case 'login':
                login($conn, $_POST['email'], $_POST['password']);
                break;
            case 'register':
                register($conn, $_POST['fullName'], $_POST['email'], $_POST['phone'], $_POST['address'], $_POST['password'], $_POST['fingerId']);
                break;
            case 'withdraw':
                withdraw($conn, $_POST['fingerId'], $_POST['amount']);
                break;
            case 'cash_in':
                cashIn($conn, $_POST['fingerId'], $_POST['amount']);
                break;
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (isset($_GET['balance'])) {
            checkBalance($conn, $_GET['fingerId']);
        } elseif (isset($_GET['transactions'])) {
            getTransactions($conn, $_GET['fingerId']);
        } elseif (isset($_GET['hello'])) {
            sayHello();
        }
    }
}

// Call the main function to handle requests
handleRequest($conn);
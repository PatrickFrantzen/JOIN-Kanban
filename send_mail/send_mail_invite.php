<?php

$redirect = '../success.html';
$link = "https://gruppe-306.developerakademie.net/JOIN-Kanban/index.html";
$message = "Hello, \r\n \r\n 
I would like to invite you to our JOIN-Kanban-Board.
Please click ob the link to start working together.  \r\n \r\n $link \r\n \r\n
Yours sincerely \r\n
your JOIN-Kanban team
";

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");

        $subject = "Contact From JOIN-Kanban Team";
        $headers = "From:  noreply@developerakademie.com";
        $recipient = $_POST['mail'];

        mail($recipient, $subject, $message, $headers);
        header("Location: " . $redirect); 

        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}

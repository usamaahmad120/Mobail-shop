<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: "Inter", Arial, sans-serif;
            color: #1f2937;
            line-height: 1.6;
        }

        h1 {
            color: #502ec3;
            font-size: 22px;
        }

        .label {
            font-weight: 700;
        }
    </style>
</head>
<body>
    <h1>New Contact Message</h1>

    <p><span class="label">Name:</span> {{ $contact['name'] }}</p>
    <p><span class="label">Email:</span> {{ $contact['email'] }}</p>
    <p><span class="label">Subject:</span> {{ $contact['subject'] }}</p>

    <p class="label">Message:</p>
    <p>{!! nl2br(e($contact['message'])) !!}</p>
</body>
</html>

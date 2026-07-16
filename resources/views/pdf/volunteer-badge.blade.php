<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Volunteer Badge</title>
    <style>
        @page {
            margin: 15pt;
        }
        body {
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>
    @include('pdf.partials.badge-content', ['event' => $event, 'volunteer' => $volunteer, 'scale' => 1])
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Volunteer Badges — {{ $event->name }}</title>
    <style>
        @page {
            margin: 20pt 15pt;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: Helvetica, Arial, sans-serif;
        }
        table.badge-grid {
            width: 100%;
            border-collapse: separate;
            border-spacing: 8pt 8pt;
        }
        table.badge-grid td {
            padding: 0;
            vertical-align: top;
        }
    </style>
</head>
<body>
    <table class="badge-grid">
        @foreach($volunteers->chunk(2) as $pair)
            <tr>
                @foreach($pair as $volunteer)
                    <td>
                        @include('pdf.partials.badge-content', ['event' => $event, 'volunteer' => $volunteer, 'scale' => 0.5])
                    </td>
                @endforeach
                @if($pair->count() === 1)
                    <td></td>
                @endif
            </tr>
        @endforeach
    </table>
</body>
</html>

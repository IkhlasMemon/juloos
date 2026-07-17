<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $report->name }}</title>
    <style>
        @page {
            margin: 24pt;
        }
        body {
            font-family: Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #1f2937;
            font-size: 10pt;
        }
        .header {
            background-color: #111827;
            color: #ffffff;
            padding: 16pt 18pt;
            margin-bottom: 12pt;
        }
        .header .title {
            font-size: 16pt;
            font-weight: bold;
            margin: 0 0 2pt;
        }
        .header .meta {
            font-size: 9pt;
            opacity: 0.85;
            margin: 0;
        }
        .filters {
            margin-bottom: 12pt;
            font-size: 9pt;
            color: #4b5563;
        }
        .filters span {
            display: inline-block;
            background-color: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 3pt;
            padding: 2pt 6pt;
            margin: 0 4pt 4pt 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border-bottom: 1px solid #e5e7eb;
            padding: 6pt 8pt;
            text-align: left;
            font-size: 9pt;
        }
        th {
            background-color: #f9fafb;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 8pt;
            letter-spacing: 0.5pt;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="header">
        <p class="title">{{ $report->name }}</p>
        <p class="meta">Generated {{ now()->format('M j, Y g:i A') }} &middot; {{ $registrations->count() }} record(s)</p>
    </div>

    @if($filterLabels->isNotEmpty())
        <div class="filters">
            @foreach($filterLabels as $label)
                <span>{{ $label }}</span>
            @endforeach
        </div>
    @endif

    <table>
        <thead>
            <tr>
                @foreach($columns as $column)
                    <th>{{ $column['label'] }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @forelse($registrations as $registration)
                <tr>
                    @foreach($columns as $column)
                        <td>{{ ($column['value'])($registration) ?: '—' }}</td>
                    @endforeach
                </tr>
            @empty
                <tr>
                    <td colspan="{{ count($columns) }}" style="text-align:center; color:#9ca3af;">No registrations match these filters.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Volunteer Recognition Card</title>
    <style>
        @page {
            margin: 0;
        }
        body {
            font-family: Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #1f2937;
        }
        .card {
            width: 350px;
            height: 550px;
            box-sizing: border-box;
            border: 1px solid #e5e7eb;
        }
        .header {
            background-color: #111827;
            color: #ffffff;
            padding: 20px 24px;
        }
        .header .eyebrow {
            font-size: 10px;
            letter-spacing: 2px;
            text-transform: uppercase;
            opacity: 0.8;
            margin: 0 0 4px;
        }
        .header .title {
            font-size: 16px;
            font-weight: bold;
            margin: 0;
        }
        .body {
            text-align: center;
            padding: 32px 24px;
        }
        .photo {
            width: 96px;
            height: 96px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #f3f4f6;
        }
        .avatar-fallback {
            width: 96px;
            height: 96px;
            border-radius: 50%;
            background-color: #111827;
            color: #ffffff;
            font-size: 28px;
            line-height: 96px;
            text-align: center;
            display: inline-block;
        }
        .name {
            font-size: 20px;
            font-weight: bold;
            margin: 16px 0 2px;
        }
        .since {
            font-size: 12px;
            color: #6b7280;
            margin: 0;
        }
        .details {
            margin-top: 24px;
            border-top: 1px solid #e5e7eb;
            padding-top: 16px;
            text-align: left;
        }
        .details table {
            width: 100%;
        }
        .details td {
            width: 50%;
            padding: 6px 0;
        }
        .details .value {
            font-size: 14px;
            font-weight: bold;
            display: block;
        }
        .details .label {
            font-size: 10px;
            color: #6b7280;
            text-transform: uppercase;
        }
        .footer {
            background-color: #f3f4f6;
            text-align: center;
            padding: 10px;
            font-size: 10px;
            color: #6b7280;
            position: absolute;
            bottom: 0;
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <p class="eyebrow">Volunteer Recognition</p>
            <p class="title">{{ config('app.name') }} Volunteer Program</p>
        </div>
        <div class="body">
            @php
                $initials = collect(explode(' ', $volunteer->name))->filter()->take(2)->map(fn ($p) => strtoupper($p[0]))->implode('');
            @endphp
            @if($volunteer->photo_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($volunteer->photo_path))
                <img class="photo" src="{{ \Illuminate\Support\Facades\Storage::disk('public')->path($volunteer->photo_path) }}" alt="Photo">
            @else
                <span class="avatar-fallback">{{ $initials }}</span>
            @endif

            <p class="name">{{ $volunteer->name }}</p>
            <p class="since">S/O {{ $volunteer->father_name }}</p>

            <div class="details">
                <table>
                    <tr>
                        <td>
                            <span class="label">Squad</span>
                            <span class="value">{{ $latestAssignment['squad']->name ?? '—' }}</span>
                        </td>
                        <td>
                            <span class="label">Masjid</span>
                            <span class="value">{{ $latestAssignment['masjid']->name ?? '—' }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">Type</span>
                            <span class="value">{{ $latestAssignment['volunteer_type']->name ?? '—' }}</span>
                        </td>
                        <td>
                            <span class="label">CNIC</span>
                            <span class="value">{{ $volunteer->cnic ?? '—' }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">Events attended</span>
                            <span class="value">{{ $eventsAttended }}</span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="footer">Volunteer ID #{{ $volunteer->id }}</div>
    </div>
</body>
</html>

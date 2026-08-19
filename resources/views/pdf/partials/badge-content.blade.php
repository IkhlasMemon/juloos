@php
    $w = 525 * $scale;
    $h = 300 * $scale;
    $typeName = strtoupper($volunteer->pivot->volunteerType->name ?? '');
    $squadName = $volunteer->pivot->squad->name ?? '';
    $masjidName = $volunteer->pivot->masjid->name ?? '';
    $initials = collect(explode(' ', $volunteer->name))
        ->filter()
        ->take(2)
        ->map(fn($p) => strtoupper($p[0]))
        ->implode('');
    $hasPhoto =
        $volunteer->photo_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($volunteer->photo_path);
    $logoPath = resource_path('images/logo.png');

    // Shrinks a detail row's value font size so long values (e.g. a lengthy
// father's name) stay on one line instead of wrapping into the row below.
    $fitValueFontSize = function (string $label, $value, float $rowWidth, float $baseFontSize) {
        $value = (string) $value;
        $charWidth = 0.62;
        $available = max($rowWidth - strlen($label) * $baseFontSize * $charWidth, $baseFontSize);
        $valueWidth = strlen($value) * $baseFontSize * $charWidth;
        if ($valueWidth <= $available || $valueWidth === 0.0) {
            return $baseFontSize;
        }
        return max($available / (strlen($value) * $charWidth), $baseFontSize * 0.5);
    };
@endphp
<div
    style="box-sizing: border-box; position: relative; width: {{ $w }}pt; height: {{ $h }}pt; border: {{ 1 * $scale }}pt solid #000000; background: #ffffff; overflow: hidden; font-family: Helvetica, Arial, sans-serif; page-break-inside: avoid;">

    {{-- watermark --}}
    <img src="{{ $logoPath }}"
        style="position: absolute; left: {{ $w - 220 * $scale }}pt; bottom: {{ 8 * $scale }}pt; width: {{ 90 * $scale }}pt; opacity: 0.06;">

    {{-- logo (cropped to exclude the black bar baked into the source image) --}}
    <div
        style="position: absolute; left: {{ 14 * $scale }}pt; top: {{ 14 * $scale }}pt; width: {{ 130 * $scale }}pt; height: {{ 27 * $scale }}pt; overflow: hidden;">
        <img src="{{ $logoPath }}" style="width: 100%; display: block;">
    </div>

    {{-- location bar --}}
    @if ($event->location)
        <div
            style="position: absolute; left: {{ 14 * $scale }}pt; top: {{ 45 * $scale }}pt; width: {{ 130 * $scale }}pt; background: #1f2937; color: #ffffff; text-align: center; font-size: {{ 9 * $scale }}pt; font-weight: bold; letter-spacing: {{ 1 * $scale }}pt; padding: {{ 3 * $scale }}pt 0;">
            {{ strtoupper($event->location) }}
        </div>
    @endif

    {{-- purpose --}}
    <div
        style="position: absolute; left: {{ 150 * $scale }}pt; top: {{ 8 * $scale }}pt; width: {{ 330 * $scale }}pt; height: {{ 30 * $scale }}pt; overflow: hidden; text-align: right; font-size: {{ 28 * $scale }}pt; font-weight: bold; letter-spacing: {{ 2.5 * $scale }}pt; color: #111827; white-space: nowrap;">
        {{ strtoupper($event->purpose->name ?? '') }}
    </div>

    {{-- event name --}}
    <div
        style="position: absolute; left: {{ 150 * $scale }}pt; top: {{ 40 * $scale }}pt; width: {{ 330 * $scale }}pt; height: {{ 44 * $scale }}pt; overflow: hidden; text-align: right; font-size: {{ 20 * $scale }}pt; font-weight: bold; line-height: 1.0; color: #111827;">
        {{ strtoupper($event->name) }}
    </div>

    {{-- photo: full card height, sits directly left of the volunteer-type bar --}}
    <div
        style="position: absolute; left: {{ $w - 145 * $scale }}pt; top: {{ 100 * $scale }}pt; width: {{ 90 * $scale }}pt; height: 40%; border: {{ 1 * $scale }}pt solid #111827; text-align: center; overflow: hidden;">
        @if ($hasPhoto)
            <img src="{{ \Illuminate\Support\Facades\Storage::disk('public')->path($volunteer->photo_path) }}"
                style="width: 100%; height: 100%; object-fit: cover;">
        @else
            <div
                style="width: 100%; height: {{ $h }}pt; background: #111827; color: #ffffff; font-size: {{ 26 * $scale }}pt; line-height: {{ $h }}pt;">
                {{ $initials }}</div>
        @endif
    </div>

    {{-- vertical volunteer type bar: letters stretch to fill the card height, minus a 10px inset top/bottom --}}
    @php
        $typeChars = str_split($typeName);
        $typeCount = max(count($typeChars), 1);
        $typeInset = 10 * $scale;
        $typeAvailable = $h - 2 * $typeInset;
        $slotHeight = $typeAvailable / $typeCount;
        $typeFontSize = min($slotHeight * 0.7, 30 * $scale);
        $enddate = $event->end_date?->format('Y-m-d');
    @endphp
    <div
        style="position: absolute; left: {{ $w - 40 * $scale }}pt; top: 0; width: {{ 40 * $scale }}pt; height: {{ $h }}pt; background: #1f2937;">
        @foreach ($typeChars as $i => $char)
            <div
                style="position: absolute; top: {{ $typeInset + $i * $slotHeight }}pt; left: 0; width: 100%; height: {{ $slotHeight }}pt; line-height: {{ $slotHeight }}pt; text-align: center; color: #ffffff; font-size: {{ $typeFontSize }}pt; font-weight: bold;">
                {{ $char }}</div>
        @endforeach
    </div>

    {{-- detail rows --}}
    <div
        style="position: absolute; left: {{ 18 * $scale }}pt; top: {{ 110 * $scale }}pt; width: {{ 355 * $scale }}pt; border-bottom: {{ 0.75 * $scale }}pt solid #9ca3af; padding-bottom: {{ 3 * $scale }}pt; font-size: {{ 18 * $scale }}pt; color: #1f2937; white-space: nowrap; overflow: hidden;">
        <span style="font-weight: bold;">NAME:</span>
        <span
            style="font-size: {{ $fitValueFontSize('NAME: ', $volunteer->name, 355 * $scale, 18 * $scale) }}pt;">{{ $volunteer->name }}</span>
    </div>

    <div
        style="position: absolute; left: {{ 18 * $scale }}pt; top: {{ 145 * $scale }}pt; width: {{ 355 * $scale }}pt; border-bottom: {{ 0.75 * $scale }}pt solid #9ca3af; padding-bottom: {{ 3 * $scale }}pt; font-size: {{ 18 * $scale }}pt; color: #1f2937; white-space: nowrap; overflow: hidden;">
        <span style="font-weight: bold;">FATHER'S NAME:</span>
        <span
            style="font-size: {{ $fitValueFontSize("FATHER'S NAME: ", $volunteer->father_name, 355 * $scale, 18 * $scale) }}pt;">{{ $volunteer->father_name }}</span>
    </div>

    <div
        style="position: absolute; left: {{ 18 * $scale }}pt; top: {{ 180 * $scale }}pt; width: {{ 355 * $scale }}pt; border-bottom: {{ 0.75 * $scale }}pt solid #9ca3af; padding-bottom: {{ 3 * $scale }}pt; font-size: {{ 18 * $scale }}pt; color: #1f2937; white-space: nowrap; overflow: hidden;">
        <span style="font-weight: bold;">CNIC #:</span>
        <span
            style="font-size: {{ $fitValueFontSize('CNIC #: ', $volunteer->cnic ?? '—', 355 * $scale, 18 * $scale) }}pt;">{{ $volunteer->cnic ?? '—' }}</span>
    </div>

    <div
        style="position: absolute; left: {{ 18 * $scale }}pt; top: {{ 215 * $scale }}pt; width: {{ 355 * $scale }}pt; border-bottom: {{ 0.75 * $scale }}pt solid #9ca3af; padding-bottom: {{ 3 * $scale }}pt; font-size: {{ 18 * $scale }}pt; color: #1f2937; white-space: nowrap; overflow: hidden;">
        <span style="font-weight: bold;">MASJID:</span>
        <span
            style="font-size: {{ $fitValueFontSize('MASJID: ', $masjidName, 355 * $scale, 18 * $scale) }}pt;">{{ $masjidName }}</span>
    </div>

    <div
        style="position: absolute; left: {{ 18 * $scale }}pt; top: {{ 255 * $scale }}pt; width: {{ 175 * $scale }}pt; border-bottom: {{ 0.75 * $scale }}pt solid #9ca3af; padding-bottom: {{ 3 * $scale }}pt; font-size: {{ 18 * $scale }}pt; color: #1f2937; white-space: nowrap; overflow: hidden;">
        <span style="font-weight: bold;">SQ#:</span>
        <span
            style="font-size: {{ $fitValueFontSize('SQ#: ', $squadName, 175 * $scale, 18 * $scale) }}pt;">{{ $squadName }}</span>
    </div>

    <div
        style="position: absolute; left: {{ 220 * $scale }}pt; top: {{ 255 * $scale }}pt; width: {{ 225 * $scale }}pt; border-bottom: {{ 0.75 * $scale }}pt solid #9ca3af; padding-bottom: {{ 3 * $scale }}pt; font-size: {{ 18 * $scale }}pt; color: #1f2937; white-space: nowrap; overflow: hidden;">
        <span style="font-weight: bold;">VALID FOR:</span>
        <span
            style="font-size: {{ $fitValueFontSize('VALID FOR: ', $enddate, 225 * $scale, 18 * $scale) }}pt;">{{ $enddate }}</span>
    </div>
</div>

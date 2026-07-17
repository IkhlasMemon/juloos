<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Report extends Model
{
    use HasFactory, LogsActivity;

    public const COLUMNS = [
        'volunteer_name' => 'Volunteer Name',
        'volunteer_father_name' => 'Father Name',
        'volunteer_phone' => 'Phone',
        'volunteer_cnic' => 'CNIC',
        'volunteer_status' => 'Volunteer Status',
        'volunteer_joined_date' => 'Joined Date',
        'event_name' => 'Event Name',
        'event_location' => 'Event Location',
        'event_start_date' => 'Event Start Date',
        'event_end_date' => 'Event End Date',
        'event_status' => 'Event Status',
        'purpose_name' => 'Purpose',
        'squad_name' => 'Squad',
        'masjid_name' => 'Masjid',
        'volunteer_type_name' => 'Volunteer Type',
        'attendance_status' => 'Attendance Status',
        'attendance_registered_at' => 'Registered At',
    ];

    /**
     * Reports saved before column selection became field-level stored these whole-module keys.
     * Expand them to their equivalent set of granular fields so old reports keep showing the
     * same information instead of silently losing columns.
     */
    private const LEGACY_COLUMN_MAP = [
        'volunteer' => ['volunteer_name', 'volunteer_father_name', 'volunteer_phone', 'volunteer_cnic', 'volunteer_status', 'volunteer_joined_date'],
        'event' => ['event_name', 'event_location', 'event_start_date', 'event_end_date', 'event_status'],
        'purpose' => ['purpose_name'],
        'squad' => ['squad_name'],
        'masjid' => ['masjid_name'],
        'volunteer_type' => ['volunteer_type_name'],
        'attendance' => ['attendance_status', 'attendance_registered_at'],
    ];

    protected $fillable = [
        'name',
        'description',
        'purpose_id',
        'event_id',
        'squad_id',
        'masjid_id',
        'volunteer_type_id',
        'columns',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'columns' => 'array',
        ];
    }

    public function visibleColumns(): array
    {
        $stored = ! empty($this->columns) ? $this->columns : array_keys(self::COLUMNS);

        $expanded = [];
        foreach ($stored as $key) {
            if (isset(self::LEGACY_COLUMN_MAP[$key])) {
                array_push($expanded, ...self::LEGACY_COLUMN_MAP[$key]);
            } elseif (array_key_exists($key, self::COLUMNS)) {
                $expanded[] = $key;
            }
        }

        $expanded = array_values(array_unique($expanded));

        return $expanded !== [] ? $expanded : array_keys(self::COLUMNS);
    }

    public function purpose(): BelongsTo
    {
        return $this->belongsTo(Purpose::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function squad(): BelongsTo
    {
        return $this->belongsTo(Squad::class);
    }

    public function masjid(): BelongsTo
    {
        return $this->belongsTo(Masjid::class);
    }

    public function volunteerType(): BelongsTo
    {
        return $this->belongsTo(VolunteerType::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'description', 'purpose_id', 'event_id', 'squad_id', 'masjid_id', 'volunteer_type_id', 'columns'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('report');
    }
}

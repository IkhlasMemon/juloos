<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Volunteer extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'name',
        'father_name',
        'phone',
        'cnic',
        'area_id',
        'photo_path',
        'status',
        'joined_date',
    ];

    protected function casts(): array
    {
        return [
            'joined_date' => 'date',
        ];
    }

    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class)
            ->using(EventVolunteer::class)
            ->withPivot(['registered_at', 'attendance_status', 'squad_id', 'masjid_id', 'volunteer_type_id'])
            ->withTimestamps();
    }

    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'father_name', 'phone', 'cnic', 'area_id', 'status', 'joined_date'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('volunteer');
    }
}

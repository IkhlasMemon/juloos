<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class EventVolunteer extends Pivot
{
    protected $table = 'event_volunteer';

    protected function casts(): array
    {
        return [
            'registered_at' => 'datetime',
        ];
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
}

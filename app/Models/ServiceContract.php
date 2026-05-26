<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceContract extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'service_id',
        'status',
        'start_date',
        'end_date',
        'config_metadata',
    ];

    protected $casts = [
        'config_metadata' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Relationship with the client (User).
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Relationship with the purchased service.
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Relationship with ETL/Pipeline execution logs.
     */
    public function executionLogs(): HasMany
    {
        return $this->hasMany(EtlExecutionLog::class, 'contract_id');
    }
}

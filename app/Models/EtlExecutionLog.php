<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EtlExecutionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'pipeline_name',
        'trigger_source',
        'status',
        'processed_records',
        'error_message',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'processed_records' => 'integer',
    ];

    /**
     * Relationship with the service contract.
     */
    public function contract(): BelongsTo
    {
        return $this->belongsTo(ServiceContract::class, 'contract_id');
    }
}

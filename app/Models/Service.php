<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'description',
        'monthly_cost',
        'one_time_cost',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'monthly_cost' => 'decimal:2',
        'one_time_cost' => 'decimal:2',
    ];

    /**
     * Relationship with contracts.
     */
    public function contracts(): HasMany
    {
        return $this->hasMany(ServiceContract::class);
    }
}

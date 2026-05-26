<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "Running custom user credentials reset...\n";

$admin = User::where('email', 'admin@nexusflow.com')->first();
if ($admin) {
    $admin->password = Hash::make('secret123');
    $admin->role = 'super-admin';
    $admin->save();
    echo "Admin password and role updated successfully.\n";
} else {
    echo "Admin user not found.\n";
}

$client = User::where('email', 'cliente@aiaintelligence.com')->first();
if ($client) {
    $client->password = Hash::make('secret123');
    $client->role = 'cliente';
    $client->save();
    echo "Client password and role updated successfully.\n";
} else {
    echo "Client user not found.\n";
}

echo "Reset completed!\n";

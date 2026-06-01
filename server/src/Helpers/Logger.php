<?php
namespace App\Helpers;

class Logger {
    public static function logAuth(string $login, string $action, string $details = ''): void {
        $dir = __DIR__ . '/../../logs';
        $file = $dir . '/auth.log';
        
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        $date = date('Y-m-d H:i:s');
        $logMessage = "[$date] | Login: $login | Action: $action | Details: $details" . PHP_EOL;
        
        file_put_contents($file, $logMessage, FILE_APPEND);
    }
}
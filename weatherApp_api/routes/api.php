<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

Route::get('/weather/current', function (Request $request) {
    $city = $request->query('city');
    $units = $request->query('units', 'metric');

    if (!$city) {
        return response()->json(['error' => 'City is required'], 400);
    }

    // Modified HTTP request with SSL verification options
    $response = Http::withOptions([
        'verify' => storage_path('cacert.pem') // Proper certificate verification
        // 'verify' => false // UNCOMMENT THIS ONLY FOR TEMPORARY LOCAL DEVELOPMENT
    ])->get('https://api.openweathermap.org/data/2.5/weather', [
        'q' => $city,
        'units' => $units,
        'appid' => env('WEATHER_API_KEY'),
    ]);

    return response()->json($response->json());
});
Route::get('/weather/forecast', function (Request $request) {
    $response =Http::withOptions([
        'verify' => storage_path('cacert.pem') // Proper certificate verification
        // 'verify' => false // UNCOMMENT THIS ONLY FOR TEMPORARY LOCAL DEVELOPMENT
    ])->get('https://api.openweathermap.org/data/2.5/weather', [
        'q' => $request->query('city'),
        'units' => $request->query('units'),
        'cnt' => 24, // 3 days worth of data (8 forecasts per day)
        'appid' => env('OPENWEATHER_API_KEY')
    ]);
    return $response->json();
});
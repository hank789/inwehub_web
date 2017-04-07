<?php
use function Intervapp\PlusComponentWeb\view as webview;
Route::get('/web', function () {
    return webview('index');
});
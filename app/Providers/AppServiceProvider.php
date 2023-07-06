<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Pagination\Paginator;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Paginator::useBootstrap();

        VerifyEmail::toMailUsing(function ($notifiable, $url) {
            return (new MailMessage)
                ->subject('Confirme su dirección de correo electrónico')
                ->line('Haga clic en el botón de abajo para verificar su dirección de correo electrónico.')
                ->action('Confirme su dirección de correo electrónico', $url)
                ->line('Si no creó una cuenta, no se requiere ninguna otra acción.');
        });
    }
}

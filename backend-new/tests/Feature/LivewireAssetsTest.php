<?php

namespace Tests\Feature;

use Tests\TestCase;

class LivewireAssetsTest extends TestCase
{
    public function test_livewire_script_routes_are_served(): void
    {
        $this->get('/livewire/livewire.js')->assertOk();
        $this->get('/livewire.js')->assertOk();
        $this->get('/livewire-10fe718a/livewire.js')->assertOk();
    }

    public function test_filament_login_uses_stable_livewire_script_route(): void
    {
        $this->get('/admin/login')
            ->assertOk()
            ->assertSee('/livewire/livewire.js', false);
    }
}

<?php

namespace Tests\Feature;

use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class AuthRegistrationTest extends TestCase
{
    public function test_registration_returns_token_and_user(): void
    {
        $email = 'register-' . uniqid() . '@example.com';
        $phone = '030' . random_int(10000000, 99999999);

        try {
            $response = $this->postJson('/api/register', [
                'name' => 'Register Customer',
                'email' => $email,
                'phone' => $phone,
                'password' => 'secret123',
            ]);

            $response->assertOk()
                ->assertJsonPath('message', 'Registered successfully')
                ->assertJsonPath('user.email', $email)
                ->assertJsonStructure([
                    'message',
                    'token',
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'phone',
                        'role',
                    ],
                ]);

            $this->assertNotEmpty($response->json('token'));
        } finally {
            $user = User::where('email', $email)->first();

            if ($user) {
                PersonalAccessToken::where('tokenable_type', User::class)
                    ->where('tokenable_id', $user->id)
                    ->delete();

                $user->delete();
            }
        }
    }
}

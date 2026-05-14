<?php

namespace Tests\Feature;

use App\Mail\ContactMessage;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactMessageTest extends TestCase
{
    public function test_contact_message_is_sent_to_configured_email(): void
    {
        Mail::fake();
        config(['mail.contact_to' => 'support@electrashop.pk']);

        $response = $this->postJson('/api/contact', [
            'name' => 'Test Customer',
            'email' => 'customer@example.com',
            'subject' => 'Order help',
            'message' => 'Please help me with my order.',
        ]);

        $response->assertOk()
            ->assertJson([
                'message' => 'Message sent successfully.',
            ]);

        Mail::assertSent(ContactMessage::class, function (ContactMessage $mail) {
            return $mail->hasTo('support@electrashop.pk')
                && $mail->contact['email'] === 'customer@example.com'
                && $mail->contact['subject'] === 'Order help';
        });
    }
}

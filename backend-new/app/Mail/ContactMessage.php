<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessage extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(public array $contact)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [$this->contact['email']],
            subject: 'Electra Shop Contact: ' . $this->contact['subject'],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-message',
            with: [
                'contact' => $this->contact,
            ],
        );
    }
}

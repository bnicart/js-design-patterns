/**
 * Bridge (structural)
 * Split an abstraction from its implementation so the two can vary independently.
 *
 * Modern JS: the "implementation" side is usually just an object passed to
 * the constructor (dependency injection). No interface keyword is needed;
 * any object with the right methods fits.
 */

// Implementation side: how a message is delivered.
export class EmailChannel {
  sent = [];
  deliver(to, text) {
    this.sent.push({ via: 'email', to, text });
  }
}

export class SmsChannel {
  sent = [];
  deliver(to, text) {
    // SMS has a hard length limit, which the channel owns, not the notification.
    this.sent.push({ via: 'sms', to, text: text.slice(0, 160) });
  }
}

// Abstraction side: what kind of notification it is.
export class Notification {
  constructor(channel) {
    this.channel = channel;
  }

  send(to, message) {
    this.channel.deliver(to, this.format(message));
  }

  format(message) {
    return message;
  }
}

export class UrgentNotification extends Notification {
  format(message) {
    return `URGENT: ${message}`;
  }
}

export class DigestNotification extends Notification {
  format(messages) {
    return `${messages.length} updates: ${messages.join('; ')}`;
  }
}

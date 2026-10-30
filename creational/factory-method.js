/**
 * Factory Method (creational)
 * Let a base class define the workflow and leave one step, "create the object", to subclasses.
 *
 * Modern JS: functions and classes are values, so when you only need to pick a
 * type by name a plain lookup map (`notifierFor`) does the job. Reach for the
 * subclassing version when the base class owns a workflow around the creation.
 */

export class EmailNotifier {
  send(to, text) {
    return { channel: 'email', to, text };
  }
}

export class SmsNotifier {
  send(to, text) {
    // SMS has a hard length limit, so the notifier owns truncation.
    return { channel: 'sms', to, text: text.slice(0, 160) };
  }
}

// The creator: the shared workflow lives here, the concrete product does not.
export class AlertService {
  createNotifier() {
    throw new Error('Subclasses must implement createNotifier()');
  }

  alert(user, message) {
    const notifier = this.createNotifier();
    return notifier.send(user.contact, `[alert] ${message}`);
  }
}

export class EmailAlertService extends AlertService {
  createNotifier() {
    return new EmailNotifier();
  }
}

export class SmsAlertService extends AlertService {
  createNotifier() {
    return new SmsNotifier();
  }
}

// The lightweight alternative: a "simple factory" that maps a key to a class.
const notifiers = { email: EmailNotifier, sms: SmsNotifier };

export function notifierFor(channel) {
  const Notifier = notifiers[channel];
  if (!Notifier) throw new Error(`Unknown channel: ${channel}`);
  return new Notifier();
}

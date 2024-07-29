export default class NotificationMessage {
  static currentMessage;

  constructor(message, { duration = 1000, type = 'success' } = {}) {

    if (NotificationMessage.currentMessage) {
      NotificationMessage.currentMessage.remove();
    }

    this.message = message;
    this.duration = duration;
    this.type = type;

    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();

    this.element = element.firstElementChild;
    NotificationMessage.currentMessage = this.element;

  }

  createTemplate() {
    return `<div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
              <div class="timer"></div>
              <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                  ${this.message}
                </div>
              </div>
            </div>`;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    NotificationMessage.currentMessage = null;
    this.element = null;
  }

  show(parent = document.body) {
    parent.append(this.element);

    setTimeout(() => {
      this.remove();
    }, this.duration);
  }
}

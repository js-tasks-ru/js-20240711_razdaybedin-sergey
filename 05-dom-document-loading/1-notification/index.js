export default class NotificationMessage {
  static lastShownComponent;

  constructor(message, { duration = 1000, type = 'success' } = {}) {

    this.message = message;
    this.duration = duration;
    this.type = type;

    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();

    this.element = element.firstElementChild;
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
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }

  show(parent = document.body) {

    if (NotificationMessage.lastShownComponent) {
      NotificationMessage.lastShownComponent.remove();
    }

    NotificationMessage.lastShownComponent = this.element;

    parent.append(this.element);

    this.timerId = setTimeout(() => {
      this.remove();
    }, this.duration);
  }
}

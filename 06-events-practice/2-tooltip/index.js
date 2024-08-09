class Tooltip {
  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.tooltipText = '';

    this.handlePointerOver = this.handlePointerOver.bind(this);
    this.handlePointerOut = this.handlePointerOut.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
  }

  initialize() {
    document.addEventListener('pointerover', this.handlePointerOver);
    document.addEventListener('pointerout', this.handlePointerOut);
    document.addEventListener('pointermove', this.handlePointerMove);
  }

  destroy() {
    document.removeEventListener('pointerover', this.handlePointerOver);
    document.removeEventListener('pointerout', this.handlePointerOut);
    document.removeEventListener('pointermove', this.handlePointerMove);
    this.hide();
  }

  render(text) {
    document.body.appendChild(this.element);
    this.element.textContent = text;
  }

  hide() {
    if (this.element && this.element.parentNode) {
      document.body.removeChild(this.element);
    }
  }

  handlePointerOver(event) {
    const target = event.target.closest('[data-tooltip]');
    if (target) {
      this.tooltipText = target.getAttribute('data-tooltip');
      this.render(this.tooltipText);
      this.positionTooltip(event);
    }
  }

  handlePointerOut(event) {
    const target = event.target.closest('[data-tooltip]');
    if (target) {
      this.hide();
    }
  }

  positionTooltip(event) {
    if (this.element) {
      const { clientX, clientY } = event;
      this.element.style.left = `${clientX + 10}px`;
      this.element.style.top = `${clientY + 10}px`;
    }
  }

  handlePointerMove(event) {
    if (this.tooltipText) {
      this.positionTooltip(event);
    }
  }
}

export default Tooltip;

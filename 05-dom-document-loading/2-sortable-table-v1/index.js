export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTable();
    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  getTable() {
    return `
    <div class="sortable-table">
      ${this.getHeader()}
      ${this.getBody()}
    </div>
      `;
  }

  getHeader() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>
     `;
  }

  getHeaderRow({ id, title, sortable }) {
    return `
    <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
      <span>${title}</span>
    </div>
      `;
  }

  getBody() {
    return `
    <div data-element="body" class="sortable-table__body">
      ${this.getRows(this.data)}
    </div>
      `;
  }

  getRows(data) {
    return data.map(item =>
      `<a href="/products/${item.id}" class="sortable-table__row">
        <div class="sortable-table__cell">${item.title}</div>
        <div class="sortable-table__cell">${item.price}</div>
        <div class="sortable-table__cell">${item.sales}</div>
      </a>`
    ).join('');
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    currentColumn.dataset.order = order;
    this.subElements.body.innerHTML = this.getRows(sortedData);
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType } = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[field] - b[field]);
      case 'string':
        return direction * a[field].localeCompare(b[field], ['ru', 'en'], { caseFirst: 'upper' });
      default:
        return direction * (a[field] - b[field]);
      }
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}


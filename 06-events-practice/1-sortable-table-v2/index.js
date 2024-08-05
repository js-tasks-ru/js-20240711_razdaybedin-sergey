export default class SortableTable {
  constructor(headersConfig = [], {
    data = [],
    sorted = {}
  } = {},
  isSortLocally = true) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.sortHandler = this.sortHandler.bind(this);

    this.render();
    this.subElements = this.getSubElements(this.element);
    this.initEventListeners();
    this.sort(this.sorted.id, this.sorted.order);
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.createTemplate();
    this.element = wrapper.firstElementChild;
  }

  createTemplate() {
    return `
    <div class="sortable-table">
      ${this.getHeaderTemplate()}
      ${this.getBodyTemplate()}
    </div>
      `;
  }

  getHeaderTemplate() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map(item => this.getHeaderRowTemplate(item)).join('')}
    </div>
      `;
  }

  getHeaderRowTemplate({ id, title, sortable }) {
    const order = this.sorted.id === id ? this.sorted.order : '';
    return `
    <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
      <span>${title}</span>
      ${sortable ? '<span class="sortable-table__sort-arrow"></span>' : ''}
    </div>
      `;
  }

  getBodyTemplate() {
    return `
    <div data-element="body" class="sortable-table__body">
      ${this.getRowsTemplate(this.data)}
    </div>
      `;
  }

  getRowsTemplate(data) {
    return data.map(item =>
      `<a href="/products/${item.id}" class="sortable-table__row">
        ${this.headerConfig.map(({ id, template }) => {
          if (template) {
            return template(item[id]);
          }
          return `<div class="sortable-table__cell">${item[id] !== undefined ? item[id] : ''}</div>`;
        }).join('')}
      </a>`
    ).join('');
  }

  sort(field, order) {
    if (this.isSortLocally) {
      this.sortOnClient(field, order);
    } else {
      this.sortOnServer(field, order);
    }
  }

  sortOnClient(field, order) {
    const sortedData = this.sortData(field, order);
    const currentColumn = this.subElements.header.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    this.subElements.header.querySelectorAll('.sortable-table__cell[data-order]').forEach(cell => {
      cell.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getRowsTemplate(sortedData);
  }

  sortOnServer(field, order) {
    console.log(`Sorting on server by ${ field }, order ${ order }`);
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType, customSorting } = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort((a, b) => {
      if (customSorting) {
        return direction * customSorting(a, b);
      }
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

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    const subElements = {};

    elements.forEach(subElement => {
      const name = subElement.dataset.element;
      subElements[name] = subElement;
    });

    return subElements;
  }

  sortHandler(event) {
    const column = event.target.closest('.sortable-table__cell');
    if (column && column.dataset.sortable === 'true') {
      const toggleOrder = order => {
        const orders = {
          asc: 'desc',
          desc: 'asc'
        };
        return orders[order];
      };

      const { id, order } = column.dataset;
      const newOrder = toggleOrder(order);
      this.sort(id, newOrder);
    }
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.sortHandler);
  }

  disposeEventListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.sortHandler);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.disposeEventListeners();
  }
}


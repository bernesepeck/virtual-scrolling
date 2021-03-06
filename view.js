import { VirtualScrollController, VirtualScrollView, RowCounterView } from './virtual-scrolling.js';

/**
 * initialize virtual scrolling
 * @param {*} data for the list
 * @param {*} container where the list gets rendered
 */
const initVirtualScrolling = (data, container) => {
  //row template
  const rowTemplate = (item) => {
    const li = document.createElement('LI');
    const text = document.createElement('SPAN');
    text.textContent = `${item.id}. ${item.title}`;
    li.appendChild(text);
    return li;
  }
  //Init Virtual Scroll
  const virtualScrollController = VirtualScrollController(container.clientHeight, 18, 2, data);
  VirtualScrollView(container, virtualScrollController, rowTemplate);
  RowCounterView(virtualScrollController, container);
}
/**
 * fetch the data
 * @param {*} container where the list gets rendered
 */
 export const fetchData = ( container) => {
  fetch(`https://jsonplaceholder.typicode.com/posts/`)
  .then(response => response.json())
  .then(data => initVirtualScrolling(data, container))
}

const listcontainer = document.getElementById('listContainer');
fetchData(listcontainer);


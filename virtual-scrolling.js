/**
 * fetch the data
 * @param {*} container where the list gets rendered
 */
const fetchData = ( container) => {
  fetch(`https://jsonplaceholder.typicode.com/posts/`)
  .then(response => response.json())
  .then(data => initVirtualScrolling(data, container))
}

/**
 * initialize virtual scrolling
 * @param {*} data for the list
 * @param {*} container where the list gets rendered
 */
const initVirtualScrolling = (data, container) => {
  //Init Virtual Scroll
  const virtualScrolling = VirtualScroll(container.clientHeight, data.length, 18, 2);

  //Init viewPort and set height of total elements
  const viewPortContainer = document.createElement('DIV');
  viewPortContainer.style.height = `${virtualScrolling.totalContentHeight}px`;

  //add scrolling container and append viewPort and scrollingContainer to container
  const scrollingContainer = document.createElement('DIV');
  viewPortContainer.appendChild(scrollingContainer);
  container.appendChild(viewPortContainer);

  renderList(data, scrollingContainer, virtualScrolling.getCurrentFirstVirtualItem(container.scrollTop), virtualScrolling.getCurrentLastVirtualItem);
  
  //add event listener to container scroll and rerender list when its triggered
  container.addEventListener('scroll', scrollEvent => {
    renderList(data, scrollingContainer, virtualScrolling.getCurrentFirstVirtualItem(scrollEvent.target.scrollTop), virtualScrolling.getCurrentLastVirtualItem); 
    virtualScrolling.shiftNodes(scrollingContainer);});
}

/**
 * VirtualScroll
 * This method returns an object with all the necassary attribute and methods for virtual scrolling
 * @param {number} viewPortHeight in px
 * @param {number} totalItems 
 * @param {number} rowHeight in px
 * @param {number} nodePadding amount of elements rendered outside of the viewport
 * @returns 
 */
const VirtualScroll = (viewPortHeight, totalItems, rowHeight, nodePadding) => {
  /**calculated total height of list*/
  const totalContentHeight = totalItems * rowHeight;
  /**the index of the current first rendered item in the list */
  let firstVirtualItem = 0;
  /**total visible items calculated*/
  const totalVisibleItems = viewPortHeight / rowHeight + (2 * nodePadding);
  /**offset to translate scroll container*/
  let offsetY = rowHeight * firstVirtualItem;

  /**
   * Method calculates the first rendered item and return the index
   * @param {number} scrollTop
   * @returns {number} index of first item
   */
  const getCurrentFirstVirtualItem = (scrollTop) => {
    firstVirtualItem = Math.floor(scrollTop / rowHeight) - nodePadding;
    firstVirtualItem = Math.max(0, firstVirtualItem);
    offsetY = rowHeight * firstVirtualItem;
    return firstVirtualItem;
  };

  /**
   * transforms scrolling container after rerendering the list
   * @param {*} scrollingContainer
   */
  const shiftNodes = (scrollingContainer) => scrollingContainer.style.transform = `translateY(${offsetY}px)`;
  return {
    totalContentHeight: totalContentHeight,
    totalVisibleItems: totalVisibleItems,
    getCurrentFirstVirtualItem: getCurrentFirstVirtualItem,
    getCurrentLastVirtualItem: firstVirtualItem + totalVisibleItems,
    shiftNodes: shiftNodes
  }
}

/**
 * Renders the list
 * @param {Array} data of list
 * @param {*} listContainer 
 * @param {number} firstItem index of first item
 * @param {number} totalItems 
 */
const renderList = (data, listContainer, firstItem, totalItems) => {
  //Clear container
  listContainer.replaceChildren();
  data.slice(firstItem, firstItem + totalItems).forEach((element) => {
    const li = document.createElement('LI');
    const text = document.createElement('SPAN');
    text.textContent = `${element.id}. ${element.title}`;
    li.appendChild(text);
    listContainer.appendChild(li)
  })
}
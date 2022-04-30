/**
 * @module virtual-scrolling virtual-scrolling module
 */

export {VirtualScrollController, VirtualScrollView};

/**
 * @typedef VirtualScrollControllerType
 * @property {() => number} getTotalContentHeight
 * @property {() => totalVisibleItems} totalVisibleItems
 * @property {(scrollTop) => void} setCurrentFirstVirtualItem
 */

/**
 * @typedef VirtualScrollController
 * @param {number} containerHeight 
 * @param {number} rowHeight in px
 * @param {number} nodePadding amount of elements rendered outside of the viewport
 * @param {Array<T>} data the data of the list
 * @returns {VirtualScrollControllerType} virtualScrollContainer
 */
const VirtualScrollController = (containerHeight, rowHeight, nodePadding, data) => {
  /**calculated total height of list*/
  const totalContentHeight = data.length * rowHeight;
  /**total visible items calculated*/
  const totalVisibleItems = containerHeight / rowHeight + (2 * nodePadding);
  /**the index of the current first rendered item in the list */
  let firstVirtualItem = 0;
  /**offset to translate scroll container*/
  let offsetY = rowHeight * firstVirtualItem;

  /**
   * Method calculates the first rendered item and return the index
   * @param {number} scrollTop
   */
   const setCurrentFirstVirtualItem = (scrollTop) => {
    firstVirtualItem = Math.floor(scrollTop / rowHeight) - nodePadding;
    firstVirtualItem = Math.max(0, firstVirtualItem);
    offsetY = rowHeight * firstVirtualItem;
  };

  return {
    getTotalContentHeight: () => totalContentHeight,
    getTotalVisibleItems: () => totalVisibleItems,
    getFirstVirtualItem: () => firstVirtualItem,
    getData: () => data,
    setCurrentFirstVirtualItem: setCurrentFirstVirtualItem,
    getOffsetY: () => offsetY
  }
}

/**
 * VirtualScrollView
 * @param {Node} container 
 * @param {VirtualScrollControllerType} virtualScrollController
 *  @param {function} rowTemplate function which renderes a row and returns an element
 */
const VirtualScrollView = (container, virtualScrollController, rowTemplate) => {
  //Init viewPort and set height of total elements
  const viewPortContainer = document.createElement('DIV');
  viewPortContainer.style.height = `${virtualScrollController.getTotalContentHeight()}px`;

  //add scrolling container and append viewPort and scrollingContainer to container
 const scrollingContainer = document.createElement('DIV');
 viewPortContainer.appendChild(scrollingContainer);
 container.appendChild(viewPortContainer);

/**
 * transforms scrolling container after rerendering the list
 * @param {*} scrollingContainer
 */
 const shiftNodes = (scrollingContainer) => scrollingContainer.style.transform = `translateY(${virtualScrollController.getOffsetY()}px)`;


 
/**
* Renders the list
* @param {number} scrollTop 
* @param {*} listContainer 
*/
const renderList = (scrollTop, listContainer) => {
  virtualScrollController.setCurrentFirstVirtualItem(scrollTop);
  //Clear container
  listContainer.replaceChildren();
  virtualScrollController.getData().slice(virtualScrollController.getFirstVirtualItem(), virtualScrollController.getFirstVirtualItem() + virtualScrollController.getTotalVisibleItems()).map(element => rowTemplate(element)).forEach((row) => {listContainer.appendChild(row)});
}

 renderList(0, scrollingContainer)


   //add event listener to container scroll and rerender list when its triggered
 container.addEventListener('scroll', scrollEvent => {
   renderList(scrollEvent.target.scrollTop, scrollingContainer); 
   shiftNodes(scrollingContainer)});
}


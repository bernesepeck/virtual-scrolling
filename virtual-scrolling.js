import {Observable} from './observable/observable.js';

/**
 * @module virtual-scrolling virtual-scrolling module
 */

export {VirtualScrollController, VirtualScrollView, RowCounterView};

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

  /**total elements */
  const totalElements = data.length;
  /**calculated total height of list*/
  const totalContentHeight = totalElements * rowHeight;
  /**total visible items calculated*/
  const totalVisibleItems = containerHeight / rowHeight + (2 * nodePadding);
  /**Observable wenn der Scrollevent passiert */
  const listScrollTop = Observable(0);
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
    getLastVirtualItem: () => firstVirtualItem + totalVisibleItems,
    getTotalElements: () => totalElements,
    getVirtualData: () => data.slice(firstVirtualItem, firstVirtualItem + totalVisibleItems),
    setCurrentFirstVirtualItem: setCurrentFirstVirtualItem,
    getOffsetY: () => offsetY,
    setListScrollTop: listScrollTop.setValue,
    getListScrollTop : listScrollTop.getValue,
    onListScrollTopChanged:   listScrollTop.onChange,
    
  }
}

/**
 * VirtualScrollView
 * @param {Node} container 
 * @param {VirtualScrollControllerType} virtualScrollController
 *  @param {function} rowTemplate function which renderes a row and returns an element
 */
const VirtualScrollView = (container, virtualScrollController, rowTemplate) => {
  //Container for the grid
  const gridContainer = document.createElement('DIV');
  gridContainer.style.overflow = 'auto';

  //Init viewPort and set height of total elements
  const viewPortContainer = document.createElement('DIV');
  viewPortContainer.style.height = `${virtualScrollController.getTotalContentHeight()}px`;

  //add scrolling container and append viewPort and scrollingContainer to container
 const scrollingContainer = document.createElement('DIV');
 viewPortContainer.appendChild(scrollingContainer);
 gridContainer.appendChild(viewPortContainer);
 container.appendChild(gridContainer);

/**
 * transforms scrolling container after rerendering the list
 * @param {*} scrollingContainer
 */
 const shiftNodes = (scrollingContainer) => scrollingContainer.style.transform = `translateY(${virtualScrollController.getOffsetY()}px)`;
 
/**
* Renders the list
* @param {number} scrollTop 
* @param {Node} listContainer 
*/
const renderList = (scrollTop) => {
  virtualScrollController.setCurrentFirstVirtualItem(scrollTop);
  //Clear container
  scrollingContainer.replaceChildren();
  virtualScrollController.getVirtualData()
    .map(element => rowTemplate(element))
    .forEach((row) => {scrollingContainer.appendChild(row)});
  shiftNodes(scrollingContainer);
}

virtualScrollController.onListScrollTopChanged(renderList);
 renderList(virtualScrollController.getListScrollTop())


   //add event listener to container scroll and rerender list when its triggered
   gridContainer.addEventListener('scroll', scrollEvent => {virtualScrollController.setListScrollTop(scrollEvent.target.scrollTop)});
}

/**
 * View for the row counter
 * @param {VirtualScrollControllerType} virtualScrollController 
 * @param {Node} container 
 */
const RowCounterView = (virtualScrollController, container) => {
  //add row counter
  const rowCount = document.createElement('SPAN');
  container.appendChild(rowCount);
  const changeContainer = () => {
    rowCount.innerText = `${virtualScrollController.getFirstVirtualItem()} / ${virtualScrollController.getTotalElements()}`
};
  changeContainer();
  virtualScrollController.onListScrollTopChanged(changeContainer)
}

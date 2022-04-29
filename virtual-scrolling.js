/**
 * @module virtual-scrolling virtual-scrolling module
 */

/**
 * VirtualScroll
 * This method returns an object with all the necassary attribute and methods for virtual scrolling
 * @param {number} viewPortHeight in px
 * @param {number} totalItems 
 * @param {number} rowHeight in px
 * @param {number} nodePadding amount of elements rendered outside of the viewport
 * @param {function} rowTemplate function which renderes a row and returns an element
 * @returns 
 */
export const VirtualScroll = (container, rowHeight, nodePadding, data, rowTemplate) => {
  /**Height from main container */
  const containerHeight = container.clientHeight;
  /**calculated total height of list*/
  const totalContentHeight = data.length * rowHeight;
  /**total visible items calculated*/
  const totalVisibleItems = containerHeight / rowHeight + (2 * nodePadding);
  /**total elements */
  const totalElements = data.length;
  /**the index of the current first rendered item in the list */
  let firstVirtualItem = 0;
  /**offset to translate scroll container*/
  let offsetY = rowHeight * firstVirtualItem;




  /**
   * Method calculates the first rendered item and return the index
   * @param {number} scrollTop
   * @returns {number} index of first item
   */
  const setCurrentFirstVirtualItem = (scrollTop) => {
    firstVirtualItem = Math.floor(scrollTop / rowHeight) - nodePadding;
    firstVirtualItem = Math.max(0, firstVirtualItem);
    offsetY = rowHeight * firstVirtualItem;
  };

  
  /**
   * transforms scrolling container after rerendering the list
   * @param {*} scrollingContainer
   */
   const shiftNodes = (scrollingContainer) => scrollingContainer.style.transform = `translateY(${offsetY}px)`;

  /**
 * Renders the list
 * @param {*} listContainer 
 */
 const renderList = (scrollTop, listContainer) => {
  setCurrentFirstVirtualItem(scrollTop);
  //Clear container
  listContainer.replaceChildren();
  data.slice(firstVirtualItem, firstVirtualItem + totalElements).map(element => rowTemplate(element)).forEach((row) => {listContainer.appendChild(row)});
}


  const init = () => {
   //Init viewPort and set height of total elements
   const viewPortContainer = document.createElement('DIV');
   viewPortContainer.style.height = `${totalContentHeight}px`;

   //add scrolling container and append viewPort and scrollingContainer to container
  const scrollingContainer = document.createElement('DIV');
  viewPortContainer.appendChild(scrollingContainer);
  container.appendChild(viewPortContainer);

  renderList(0, scrollingContainer)

    //add event listener to container scroll and rerender list when its triggered
  container.addEventListener('scroll', scrollEvent => {
    renderList(scrollEvent.target.scrollTop, scrollingContainer); 
    shiftNodes(scrollingContainer)});
  }

  return {
    totalContentHeight: totalContentHeight,
    totalVisibleItems: totalVisibleItems,
    getCurrentFirstVirtualItem: setCurrentFirstVirtualItem,
    renderList: renderList,
    init: init
  }
}


const fetchData = ( container) => {
  fetch(`https://jsonplaceholder.typicode.com/posts/`)
  .then(response => response.json())
  .then(data => initVirtualScrolling(data, container))
}

const initVirtualScrolling = (data, container) => {
  
  const virtualScrolling = VirtualScroll(container.clientHeight, data.length, 18, 2);
  const viewPortContainer = document.createElement('DIV');
  const scrollingContainer = document.createElement('DIV');
  viewPortContainer.style.height = `${virtualScrolling.totalContentHeight}px`;
  viewPortContainer.appendChild(scrollingContainer);
  container.appendChild(viewPortContainer);

  renderList(data, scrollingContainer, virtualScrolling.getCurrentFirstVirtualItem(container.scrollTop), virtualScrolling.getCurrentLastVirtualItem);
  
  
  container.addEventListener('scroll', scrollEvent => {
    renderList(data, scrollingContainer, virtualScrolling.getCurrentFirstVirtualItem(scrollEvent.target.scrollTop), virtualScrolling.getCurrentLastVirtualItem); 
    virtualScrolling.shiftNodes(scrollingContainer);});
}

const VirtualScroll = (viewPortHeight, totalItems, rowHeight, nodePadding) => {
  const totalContentHeight = totalItems * rowHeight;
  let firstVirtualItem = 0;
  const totalVisibleItems = viewPortHeight / rowHeight + (2 * nodePadding);
  console.log(viewPortHeight, rowHeight, nodePadding, totalVisibleItems)
  let offsetY = rowHeight * firstVirtualItem;

  getCurrentFirstVirtualItem = (scrollTop) => {
    firstVirtualItem = Math.floor(scrollTop / rowHeight) - nodePadding;
    firstVirtualItem = Math.max(0, firstVirtualItem);
    offsetY = rowHeight * firstVirtualItem;
    return firstVirtualItem;
  };

  shiftNodes = (scrollingContainer) => scrollingContainer.style.transform = `translateY(${offsetY}px)`
  return {
    totalContentHeight: totalContentHeight,
    totalVisibleItems: totalVisibleItems,
    getCurrentFirstVirtualItem: getCurrentFirstVirtualItem,
    getCurrentLastVirtualItem: firstVirtualItem + totalVisibleItems,
    shiftNodes: shiftNodes
  }
}

const renderList = (data, container, firstItem, totalItems) => {
  console.log(data.slice(firstItem, firstItem + totalItems))
  container.replaceChildren();
  data.slice(firstItem, firstItem + totalItems).forEach((element) => {
  const li = document.createElement('LI');
  const text = document.createElement('SPAN');
  text.textContent = `${element.id}. ${element.title}`;
  li.appendChild(text);
  container.appendChild(li)
})}
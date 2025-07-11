function addEffectHoverToZoomImage(container_element, image_element) {
      if (!(container_element instanceof HTMLElement) || container_element.tagName !== 'DIV') {
            console.error('Error: container_element is not DIV HTML.');
            showToast('Error add effect hover to zoom image', 'error');
            return; 
      }
      if (!(image_element instanceof HTMLElement) || image_element.tagName !== 'IMG') {
            console.error('Error: image_element is not IMG HTML');
            return; 
      }

      container_element.classList.add('hover-container-zoom-img');
      image_element.classList.add('hover-to-zoom-img');
}

const imageUtils = {
      addEffectHoverToZoomImage,
}
export default imageUtils;
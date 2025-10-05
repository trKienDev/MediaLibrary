export function addHoverToScaleEffect(domElement) {
      if (!(domElement instanceof HTMLElement)) {
            console.error('Error: image_element is not IMG HTML: ', typeof domElement);
            return; 
      }

      domElement.classList.add('hover-to-scale');
}


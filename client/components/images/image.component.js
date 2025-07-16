export function createImgElement({ src, cssClass, alt = ''}) {
      const img = document.createElement('img');
      if(src) img.src = src;
      if(cssClass) img.classList.add(cssClass);
      img.alt = alt;
      return img;
}
export function createLazyImgElement({ src, placeholderStc = '', cssClass, alt = ''}) {
      const img = document.createElement('img');
      img.src = placeholderStc;
      img.dataset.src = src;
      if(cssClass) img.classList.add(cssClass);
      img.alt = alt;
      img.loading = 'lazy';
      return img;
}
export function createResponsiveImgElement({ src, cssClass, alt = '', srcSet, sizes }) {
      const img = document.createElement('img');
      img.src = src;
      if(cssClass) img.classList.add(cssClass);
      img.alt = alt;
      if(srcSet) img.srcset = srcSet;
      if(sizes) img.sizes = sizes;
      return img;
}

import { createImgElement } from "../images/image.component.js";

export function createTrWithId(id, css_class) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', id);
      tr.classList.add(css_class);
      return tr;
}

export function createTextTd({ iText, iId, iCss }) {
      const textWrapper = document.createElement('div');
      textWrapper.classList.add('text-wrapper');
      textWrapper.style.display = 'flex';
      textWrapper.style.justifyContent = 'center';
      const span = document.createElement('span');
      span.textContent = iText;
      if(iId) {
            span.setAttribute('data-id', iId);
      }
      if(iCss) {
            span.classList.add(iCss);
      }
      textWrapper.appendChild(span);

      const td = document.createElement('td');
      td.appendChild(textWrapper);
      return td;
}

export function createImageTd(imgSrc, cssClass) {
      const imageCell = document.createElement('td');
      const imageEl = createImgElement({ src: imgSrc, cssClass: cssClass});
      imageCell.appendChild(imageEl);

      return imageCell;
}

export function createSelectCheckboxTd(css_class) {
      const selectTd = document.createElement('td');
      selectTd.classList.add(css_class);
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      selectTd.appendChild(checkbox);

      return { td: selectTd, checkbox };
}

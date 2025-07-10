function createElement(tag, { cssClass, text, href, id } = {}) {
      const el = document.createElement(tag);

      if(cssClass) {
            cssClass.split(' ').forEach(cls => el.classList.add(cls));
      }
      if(text) el.textContent = text;
      if(href && tag === 'a') el.href = href;
      if(id) el.id = id;
      
      return el;
}

const domsComponent = {
      createArticle: (cssClass) => createElement('article', { cssClass}),
      createDiv: (cssClass, text) => createElement('div', { cssClass, text }),
      createAhref: ({ href, text, cssClass }) => createElement('a', { cssClass, text, href }),
      createH3: (text, cssClass) => createElement('h3', { cssClass, text }),
      createSpan: ({ text, cssClass }) => createElement('span', { cssClass, text }),
      createLiElement: (cssClass) => createElement('li', { cssClass }),
      createSection: ({ id, cssClass }) => createElement('section', { cssClass, id }),
}
export default domsComponent;


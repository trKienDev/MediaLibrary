function createElement(tag, { cssClass, text, href, id, attrs = {} } = {}) {
      const el = document.createElement(tag);

      if(cssClass) {
            cssClass.split(' ').forEach(cls => el.classList.add(cls));
      }
      if(text) el.textContent = text;
      if(href && tag === 'a') el.href = href;
      if(id) el.id = id;
      
      // set additional attributes if provided
      Object.entries(attrs).forEach(([key, value]) => {
            el.setAttribute(key, value);
      });

      return el;
}

function _updateTextById(domId, text, domName) {
      const el = document.getElementById(domId);
      if(el && (!domName || el.tagName === domName)) {
            el.textContent = text;
      }
      return el;
}

const domsComponent = {
      // API Create DOM
      createElement: (tag, options) => createElement(tag, options),
      createArticle: ({cssClass, text, id, attrs} = {}) => createElement('article', { cssClass, text, id, attrs}),
      createDiv: ({cssClass, text, id, attrs} = {}) => createElement('div', {cssClass, text, id, attrs}),
      createAhref: ({href, text, cssClass, id, attrs} = {}) => createElement('a', {cssClass, text, href, id, attrs}),
      createH3: ({text, cssClass, id, attrs} = {}) => createElement('h3', { cssClass, text, id, attrs}),
      createSpan: ({ text, cssClass, id, attrs } = {}) => createElement('span', { cssClass, text, id, attrs }),
      createLiElement: ({ cssClass, text, id, attrs } = {}) => createElement('li', { cssClass, text, id, attrs }),
      createSection: ({ id, cssClass, text, attrs } = {}) => createElement('section', { cssClass, text, id, attrs }),

      // API Update DOM
      updateSpanText: (id, text) => _updateTextById(id, text, 'SPAN'),
      updateTextById: (id, text) => _updateTextById(id, text)
}
export default domsComponent;


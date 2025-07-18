/**
 * activeState_utils
 * 
 * Tính năng:
 * ✅ Event delegation để tối ưu performance.
 * ✅ Hỗ trợ async init (chờ element xuất hiện trước khi attach logic).
 * ✅ Hỗ trợ active tab mặc định nếu chưa có tab active.
*/
async function waitForElement(selector, timeout = 3000) {
      return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error(`Timeout waiting for ${selector}`)), timeout);
            const check = () => {
                  const el = document.querySelector(selector);
                  if(el) {
                        clearTimeout(timer);
                        resolve(el);
                  } else {
                        requestAnimationFrame(check);
                  }
            };
            check();
      });
}

export async function InitializeActiveStateAsync({
      containerSelector,
      activatableClassName,
      onElementActivated,
      defaultIndex = 0,
      waitTimeout = 3000
}) {
      // chờ container có mặt trên DOM
      const container = await waitForElement(containerSelector, waitTimeout);
      if(!container) return;

      const activatableSelector = `.${activatableClassName}`;
      const activeSelector = `${activatableSelector}.active`;

      processElementActiveStateDelegated(container, activatableSelector, onElementActivated);

      let initialActiveElement = container.querySelector(activeSelector);
      if(!initialActiveElement) {
            const allItems = container.querySelectorAll(activatableSelector);
            if(allItems.length > 0 && allItems[defaultIndex]) {
                  initialActiveElement = allItems[defaultIndex];
                  initialActiveElement.classList.add('active');
            }
      }

      if(initialActiveElement && typeof onElementActivated === 'function') {
            onElementActivated(initialActiveElement);
      }
}

function processElementActiveStateDelegated(container, itemSelector, callbackFn) {
      container.addEventListener('click', (event) => {
            const item = event.target.closest(itemSelector);
            if(!item || !container.contains(item)) return;

            if(item.classList.contains('active')) return;

            const currentActive = container.querySelector(`${itemSelector}.active`);
            if(currentActive) {
                  currentActive.classList.remove('active');
            }
            item.classList.add('active');

            if(callbackFn && typeof callbackFn === 'function') {
                  callbackFn(item);
            }
      });
}
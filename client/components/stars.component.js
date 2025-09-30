export function createStarsRating(elementId, starsNumber = 0, maxStars = 5) {
      const wrapperEl = document.getElementById(elementId);
      if(!wrapperEl) {
            console.warn(`Element with ID "${elementId} not found`);
            return null;
      }

      wrapperEl.innerHTML = '';

      const starsToRender = Math.min(starsNumber, maxStars);
      for(let i = 0; i < maxStars; i++) {
            const star = document.createElement('a');
            star.classList.add('fa', i < starsToRender ? 'fa-star' : 'fa-star-o', 'star-yellow');
            star.classList.add('star');
            wrapperEl.appendChild(star);
      }

      return wrapperEl;
}


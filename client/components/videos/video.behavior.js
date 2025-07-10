function attachHoverPlayHandler(link) {
      let timeout;
      link.addEventListener('mouseenter', () => {
            const video = link.querySelector('video');
            if(video) {
                  timeout = setTimeout(() => video.play().catch(() => {}), 300);
            }
      });
      link.addEventListener('mouseleave', () => {
            clearTimeout(timeout);
            const video = link.querySelector('video');
            if(video) video.pause();
      });
      return link;
}

const videoBehavior = {
      attachHoverPlayHandler,
}
export default videoBehavior;


import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import AvatarComponent, { AvatarTypes } from "../../../components/images/avatar.component.js";
import VideoArticle from "../../../components/videos/video-article/video-article.class.js";

const creatorId = window.PageParams.id;

export default async function() {
      console.log('creator id: ', creatorId);
      
      const creatorInfor = await apiService.getById(apiEndpoint.creators.getById, creatorId);

      const videos = await apiService.getById(apiEndpoint.videos.getByCreator, creatorId);

      populateCreatorAvatar(creatorInfor);
      switchCreatorTab(videos);
      renderCreatorVideos(videos);
}

function switchCreatorTab(videos) {
      const tabItems = document.querySelectorAll('[data-role="tab-item"]');
      const videosSection = document.querySelector('[data-role="creator-videos"]');
      const filmsSection  = document.querySelector('[data-role="creator-films"]');
      const videosWrapper = videosSection?.querySelector('.creator-videos-wrapper');
      const filmsWrapper  = filmsSection?.querySelector('.creator-films-wrapper');

      if (!videosSection || !filmsSection || tabItems.length === 0) return;
      let videosRendered = false;
      let filmsRendered = false;

      function showTab(tab) {
            const showVideos = tab === 'videos';
            videosSection.hidden = !showVideos;
            filmsSection.hidden  = showVideos;

            const visibleSection = showVideos ? videosSection : filmsSection;
            visibleSection.classList.remove('fade-in');
            void visibleSection.offsetWidth; // reset animation
            visibleSection.classList.add('fade-in');

            tabItems.forEach(a => {
                  a.classList.toggle('active', a.dataset.tab === tab);
            });

            if (showVideos && !videosRendered) {
                  console.log('videos wrapper: ', videosWrapper);
                  renderCreatorVideos(videos);
                  videosRendered = true;
            } else if (!showVideos && !filmsRendered) {
                  // renderCreatorFilms(filmsWrapper);
                  filmsRendered = true;
            }
      }

      tabItems.forEach(a => {
            a.addEventListener('click', (e) => {
                  e.preventDefault();
                  showTab(a.dataset.tab);
            });
      });

      // mở mặc định tab Videos khi vào trang
      showTab('videos');
}
async function populateCreatorAvatar(creator) {
      const creatorAvatarElement = document.getElementById('creator-avatar');
      const avatarComponent = AvatarComponent({ enableHoverEffect: false });
      const creatorAvatar = await avatarComponent.create(creator._id, AvatarTypes.CREATOR);
      creatorAvatarElement.appendChild(creatorAvatar);
}

async function renderCreatorVideos(videos) {
        const videosWrapper = document.querySelector('[data-role="creator-videos"] .creator-videos-wrapper');
      videos.forEach(async(video) => {
            const videoComponent = new VideoArticle(video, { showVideoInfor: false, hoverToScale: false });
            const videoPlayer = await videoComponent.render();
            videosWrapper.appendChild(videoPlayer);
      });
}





import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import domsComponent from "../../../components/dom.components.js";
import filmComponent from "../../../components/films/film.component.js";
import AvatarComponent, { AvatarTypes } from "../../../components/images/avatar.component.js";
import VideoArticle from "../../../components/videos/video-article/video-article.class.js";
import { ServerFolders } from "../../../constants/folder.constant.js";
import { calculateAgeFromBirthYear, formatDate } from "../../../utils/date.utils.js";

const creatorId = window.PageParams.id;

export default async function() {       
      const creatorInfor = await apiService.getById(apiEndpoint.creators.getById, creatorId);

      populateCreatorAvatar(creatorInfor);
      populateCreatorInfor(creatorInfor);
      switchCreatorTab();
}

function switchCreatorTab(videos) {
      const tabItems = document.querySelectorAll('[data-role="tab-item"]');
      const videosSection = document.querySelector('[data-role="creator-videos"]');
      const filmsSection  = document.querySelector('[data-role="creator-films"]');

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
                  renderCreatorVideos();
                  videosRendered = true;
            } else if (!showVideos && !filmsRendered) {
                  renderCreatorFilms();
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

function populateCreatorInfor(creator) {
      const creatorNameWrapper = document.querySelector('[data-role="creator-name"]');
      const creatorNameDom = domsComponent.createSpan({
            text: creator.name
      });
      creatorNameWrapper.appendChild(creatorNameDom);

      const creatorBirthWrapper = document.querySelector('[data-role="creator-birth"]');
      const creatorBirthDom = domsComponent.createSpan({
            text: formatDate(new Date(creator.birth))
      })
      creatorBirthWrapper.appendChild(creatorBirthDom);

      console.log('creator: ', creator);
      const creatorAgeWrapper = document.querySelector('[data-role="creator-age"]');
      const creatorAge = domsComponent.createSpan({
            text: calculateAgeFromBirthYear(new Date(creator.birth).getFullYear())
      });
      creatorAgeWrapper.appendChild(creatorAge);
}
async function populateCreatorAvatar(creator) {
      const creatorAvatarElement = document.getElementById('creator-avatar');
      const avatarComponent = AvatarComponent({ enableHoverEffect: false });
      const creatorAvatar = await avatarComponent.create(creator._id, AvatarTypes.CREATOR);
      creatorAvatarElement.appendChild(creatorAvatar);
}

async function renderCreatorVideos() {
      const videosWrapper = document.querySelector('[data-role="creator-videos"] .creator-videos-wrapper');
      const videosPagination = await apiService.getPagination({
            apiEndpoint: apiEndpoint.videos.getUniquePagination,
            page: String(1),
            limit: String(10),
            filters: { creator_id: creatorId }
      });
      const videos = videosPagination.videos;
      videos.forEach(async(video) => {
            const videoComponent = new VideoArticle(video, { showVideoInfor: false, hoverToScale: false });
            const videoPlayer = await videoComponent.render();
            videosWrapper.appendChild(videoPlayer);
      });
}

async function renderCreatorFilms() {
      const filmsWrapper  = document.querySelector('[data-role="creator-films"] .creator-films-wrapper');
      const filmsPagination = await apiService.getPagination({
            apiEndpoint: apiEndpoint.films.getRandomizePagination,
            page: String(1),
            limit: String(10),
            filters: { creator_ids: creatorId }
      });
      const films = filmsPagination.films;
      const filmThumbnails = await Promise.all(films.map(
            async film => filmComponent.createFilmThumbnailFrame(film, ServerFolders.FILMS, { hoverZoomEffect: true})
      ));
      filmThumbnails.forEach(thumbnail => filmsWrapper.appendChild(thumbnail));
}


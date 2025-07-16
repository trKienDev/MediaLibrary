import apiService from "../../../api/api.instance";
import apiEndpoint from "../../../api/endpoint.api";
import filmComponent from "../../../components/films/film.component";
import { createImgElement } from "../../../components/images/image.component";
import VideoArticle from "../../../components/videos/video-article/video-article.class";
import { ServerFolders } from "../../../constants/folder.constant";
import { calculateAgeFromBirthYear, formatDate } from "../../../utils/date.utils";

const creatorId = window.PageParams.id;

export default async function() {
      await populateCreatorAvatar(creatorId);
      await populateCreatorBio(creatorId);

      const tabItems = document.querySelectorAll('[data-role="tab-item"]');
      tabItems.forEach(tab => {
            tab.addEventListener('click', () => {
                  tabItems.forEach(t => t.classList.remove('active'));
                  tab.classList.add('active');
                  HandleActiveTab(tab, creatorId);
            });
      });
}

async function HandleActiveTab(tab, creatorId) {
      const tabType = tab.dataset.tab;
      switch(tabType) {
            case 'videos':
                  await RenderCreatorVideo(creatorId);
                  break;
            case 'films': 
                  await RenderCreatorFilms(creatorId);
                  break; 
      }
}

async function populateCreatorAvatar(creatorId) {
      const avatarDiv = document.querySelector('[data-role="creator-avatar"]');
      const avatarImgSrc = await apiService.getImage(apiEndpoint.creators.getById, creatorId);
      
      const avatarImg = createImgElement({ src: avatarImgSrc, cssClass: 'avatar-img', alt: 'creator-avatar'});
      avatarDiv.innerHTML = '';
      avatarDiv.appendChild(avatarImg);
}
async function populateCreatorBio(creatorId) {
      const creatorBio = apiService.getById(apiEndpoint.creators.getById, creatorId);
      
      const nameDiv = document.querySelector('[data-role="creator-name"]');
      nameDiv.textContent = creatorBio.name;

      const birthDateStr = formatDate(new Date(creatorBio.birth));
      const birthDiv = document.querySelector('[data-role="creator-birth"]');
      birthDiv.textContent = birthDateStr;

      const age = calculateAgeFromBirthYear(new Date(creatorBio.birth));
      const ageDiv = document.querySelector('[data-role="creator-age"]');
      ageDiv.textContent = `${age} years old`;
}

async function RenderCreatorVideo(creatorId) {
      const videosWrapper = document.querySelector('[data-role="creator-videos"]');
      videosWrapper.innerHTML = '';

      const filmWrapper = document.querySelector('[data-role="creator-films"]');
      filmWrapper.innerHTML = '';

      const videos = apiService.getById(apiEndpoint.videos.getByCreator, creatorId);
      videos.forEach(video => {
            const videoComponent = new VideoArticle(video, { showVideoInfor: false });
            const videoPlayer = videoComponent.render();
            videosWrapper.appendChild(videoPlayer);
      });
}

async function RenderCreatorFilms(creatorId) {
      const videosWrapper = document.querySelector('[data-role="creator-videos"] .creator-videos-wrapper');
      videosWrapper.innerHTML = '';

      const filmsWrapper = document.querySelector('[data-role="creator-films"] .creator-films-wrapper');
      filmsWrapper.innerHTML = '';

      const creatorFilms = apiService.getById(apiEndpoint.films.getByCreator, creatorId);
      creatorFilms.forEach(async (film) => {
            const filmThumbnail = filmComponent.createFilmThumbnailFrame(film, ServerFolders.FILMS)
            filmsWrapper.appendChild(filmThumbnail);
      });
}


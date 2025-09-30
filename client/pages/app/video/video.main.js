import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import domsComponent from "../../../components/dom.components.js";
import AvatarComponent, { AvatarTypes } from "../../../components/images/avatar.component.js";
import { createStarsRating } from "../../../components/stars.component.js";
import VideoArticle from "../../../components/videos/video-article/video-article.class.js";
import appConfigs from "../../../config/app.config.js";
import { ServerFolders } from "../../../constants/folder.constant.js";
import { formatDate } from "../../../utils/date.utils.js";

const videoId = window.PageParams.id;

export default async function() {
      console.log('video id: ', videoId);
      const videoInfor = await apiService.getById(apiEndpoint.videos.getById, videoId);
      console.log('video infor: ', videoInfor);
      const filmInfor = await apiService.getById(apiEndpoint.films.getById, videoInfor.film_id);
      console.log('film infor: ', filmInfor);

      populateFilmInfor(filmInfor);

      populateVideoInfor(videoInfor);

      renderFilmVideos(filmInfor);

}

function populateFilmInfor(film) {
      renderFilmThumbnail(film);
      populateFilmDescription(film);
      populateFilmName(film);
      populateFilmCreator(film);
      populateFilmStudio(film);
      populateFilmDate(film);
      populateFilmRating(film);
      populateFilmTags(film);
}
function renderFilmThumbnail(film) {
      const filmThumbnailElement = document.getElementById('video-film-thumbnail');
      filmThumbnailElement.src = `${appConfigs.SERVER}/${ServerFolders.FILMS}/${film.thumbnail}`;
}
function populateFilmDescription(film) {
      const filmDescriptionElement = document.getElementById('film-description');
      filmDescriptionElement.textContent = film.description;
}
function populateFilmName(film) {
      const filmNameElement = document.getElementById('film-name');
      filmNameElement.textContent = film.name;
}
async function populateFilmCreator(film) {
      const filmCreatorElement = document.getElementById('film-creator');
      const creators = await Promise.all(
            film.creator_ids.map(id => apiService.getById(apiEndpoint.creators.getById, id))
      );

      creators.forEach(creator => {
            const ahref = domsComponent.createAhref({
                  href: `/creator/${creator._id}`, 
                  text: creator.name,
            });
            filmCreatorElement.appendChild(ahref);
      });
}
async function populateFilmStudio(film) {
      const studio = await apiService.getById(apiEndpoint.studios.getById, film.studio_id);
      const ahref = domsComponent.createAhref({
            href: `/studio/${studio._id}`,
            text: studio.name
      });
      
      const filmStudioElement = document.getElementById('film-studio');
      filmStudioElement.appendChild(ahref);
}
function populateFilmDate(film) {
      const filmDateElement = document.getElementById('film-date');
      filmDateElement.textContent = formatDate(new Date(film.date));
}
function populateFilmRating(film) {
      createStarsRating('film-rating', film.rating);
}
async function populateFilmTags(film) {
      const filmTagsElement = document.getElementById('film-tags');

      const tags = await Promise.all(
            film.tag_ids.map(id => apiService.getById(apiEndpoint.tags.getById, id))
      );
      tags.forEach(tag => {
            const ahref = domsComponent.createAhref({
                  href: `/tag/${tag._id}`,
                  text: tag.name,
                  cssClass: 'tag-box',
            });
            filmTagsElement.appendChild(ahref);
      });
}

function populateVideoInfor(video) {
      populateVideoPlayer(video);
      populateVideoCreator(video);
      populateVideoViews(video);
      populateVideoLikes(video);
      populateVideoTags(video);
}
function populateVideoPlayer(video) {
      const videoUrl = `${appConfigs.SERVER}/${ServerFolders.VIDEOS}/${video.file_path}`;
      const videoElement = document.getElementById('video-player');

      const videoSource = videoElement.querySelector('source');
      videoSource.src = videoUrl;
      videoElement.load();
}
async function populateVideoCreator(video) {
      const creator = await apiService.getById(apiEndpoint.creators.getById, video.creator_id);
      populateVideoCreatorAvatar(creator);
      populateVideoCreatorName(creator);
}
async function populateVideoCreatorAvatar(creator) {
      const videoCreatorAvatarElement = document.getElementById('video-creator-avatar');
      const avatarComponent = AvatarComponent();
      const creatorAvatar = await avatarComponent.create(creator._id, AvatarTypes.CREATOR);
      videoCreatorAvatarElement.appendChild(creatorAvatar);
}
async function populateVideoCreatorName(creator) {
      const videoCreatorNameElement = document.getElementById('video-creator-name');
      videoCreatorNameElement.textContent = creator.name;
}
function populateVideoViews(video) {
      const videoTotalViews = document.getElementById('video-total-views');
      videoTotalViews.textContent = video.views;
}
function populateVideoLikes(video) {
      const videoTotalLikes = document.getElementById('video-total-likes');
      videoTotalLikes.textContent = video.likes;
}
async function populateVideoTags(video) {
      const videoTagsElement = document.getElementById('video-tags');
      const tags = await Promise.all(
            video.tag_ids.map(id => apiService.getById(apiEndpoint.tags.getById, id))
      );
      tags.forEach(tag => {
            const ahref = domsComponent.createAhref({
                  href: `/tag/${tag._id}`,
                  text: tag.name,
                  cssClass: 'tag-box',
            });
            videoTagsElement.appendChild(ahref);
      });
}

async function renderFilmVideos(film) {
      const filmVideosList = document.getElementById('film-videos');

      const video_ids = film.video_ids.filter(x => x !== videoId);
      const videos = await Promise.all(
            video_ids.map(id => apiService.getById(apiEndpoint.videos.getById, id )) 
      );
      
      videos.forEach(async (video) => {
            const videoComponent = new VideoArticle(video, { showVideoInfor: false, hoverToScale: false });
            const videoPlayer = await videoComponent.render();
            filmVideosList.appendChild(videoPlayer);
      });
}


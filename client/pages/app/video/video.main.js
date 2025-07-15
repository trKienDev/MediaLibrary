import apiService from "../../../api/api.instance";
import apiEndpoint from "../../../api/endpoint.api";
import { toastNotifier } from "../../../app.main";
import domsComponent from "../../../components/dom.components";
import AvatarComponent, { AvatarTypes } from "../../../components/images/avatar.component";
import { updateFilmThumbnailSource } from "../../../components/images/thumbnail.component";
import { createStarsRating } from "../../../components/stars.component";
import tagComponent from "../../../components/tags/tags.component";
import VideoUtils from "../../../components/videos/video.utils";
import { ServerFolders } from "../../../constants/folder.constant";
import NOTIFICATION_TYPES from "../../../constants/notification-types.constant";
import { calculateYearDiff, formatDate } from "../../../utils/date.utils";

const videoId = window.PageParams.id;

export default async function() {
      try {
            await apiService.updateJson(`${apiEndpoint.videos.increaseViewsByOne}/${videoId}`);
            const [ video, filmId ] = await Promise.all([
                  apiService.getById(apiEndpoint.videos.getById, videoId),
                  apiService.getFilmId(apiEndpoint.videos.getById, videoId)
            ]);

            await renderVideoData(video);
            await renderFilmData(filmId);
            await 
      } catch(error) {
            console.error('Error loading play video page: ', error);
            toastNotifier.show('Error loading play video page', NOTIFICATION_TYPES.ERROR);
      }
}

/* ------------------- Helper generic ------------------- */
async function renderListToElement({ element, items, renderItemFunc }) {
      if(!element) return;
      element.innerHTML = '';
      for(const item of items) {
            try {
                  const node = await renderItemFunc(item);
                  element.appendChild(node);
            } catch(error) {
                  throw new error;
            }
      }
}

/* ------------------- Render video section  ------------------- */
async function renderVideoData(video) {
      VideoUtils.updateVideoSourceById({
            elementId: 'video-player',
            iVideo: video,
            uploadPath: ServerFolders.VIDEOS
      });

      await Promise.all([
            populateVideoFilm(video),
            populateVideoAction(video),
            populateCreatorAvatar(video),
            populateVideoTags(video),
            populateVideoPlaylist(video)
      ]);

      domsComponent.updateSpanText('video-views', video.views);
      domsComponent.updateSpanText('video-likes', video.likes);
}

async function populateVideoFilm(video) {
      const filmName = await apiService.getName(apiEndpoint.films.getById, video.film_id);
      domsComponent.updateSpanText('video-film-name', filmName);
}
async function populateVideoAction(video) {
      const actionWrapper = document.getElementById('video-action-wrapper');
      actionWrapper.innerHTML = '';

      const videoAction = await tagComponent.createTagDivWithApi({ tagId: video.action_id, cssClass: 'tag-element'});
      videoAction.classList.add('pink-btn');
      actionWrapper.appendChild(videoAction);
      
      return actionWrapper;
}
async function populateCreatorAvatar(video) {
      const creatorEl = document.getElementById('video-creator');
      creatorEl.innerHTML = '';

      const avatarComponent = AvatarComponent();
      const videoCreator = await avatarComponent.create(video.creator_id, AvatarTypes.CREATOR);
      creatorEl.appendChild(videoCreator);
      return creatorEl;
}
async function populateVideoTags(video) {
      const tagsEl = document.getElementById('video-tags');
      await renderListToElement({
            element: tagsEl,
            item: video.tag_ids,
            renderItemFunc: (tagId) => tagComponent.createTagDivWithApi({ tagId: tagId, cssClass: 'tag-link'})
      });
}
async function populateVideoPlaylist(video) {
      const playlistEl = document.getElementById('video-playlist');
      await renderListToElement({
            element: playlistEl,
            items: video.playlist_id,
            renderItemFunc: async(playlistId) => {
                  const playlistName = await apiService.getName(apiEndpoint.playlist.getById, playlistId);
                  return domsComponent.createAhref({
                        href: `playlist/${playlistId}`,
                        text: playlistName,
                        cssClass: 'playlist-link',
                  });
            }
      });
}

/* ------------------- Render film section ------------------- */
async function renderFilmData(filmId) {
      const filmInfor = await apiService.getById(apiEndpoint.films.getById, filmId);

      updateFilmThumbnailSource({
            filmId: filmId,
            thumbnailElId: 'film-thumbnail',
            uploadPath: ServerFolders.FILMS
      });

      populateFilmName(filmInfor);
      await populateFilmCreator(filmInfor);
      await populateFilmStudio(filmInfor);
      populateFilmDate(filmInfor);
      await populateFilmCollection(filmInfor);
      await populateFilmTags(filmInfor);

      createStarsRating('film-rating', filmInfor.rating);

      const descriptionEl = document.getElementById('film-description');
      descriptionEl.innerHTML = '';
      const descriptionSpan = domsComponent.createSpan({
            text: filmInfor.description,
            cssClass: 'film-description',
      });
      descriptionEl.appendChild(descriptionSpan);
}

function populateFilmName(filmInfor) {
      const nameEl = document.getElementById('film-name');
      nameEl.innerHTML = '';

      const nameLink = domsComponent.createAhref({
            href: `film/${filmInfor._id}`,
            text: filmInfor.name,
            cssClass: 'film-name'
      });
      nameEl.appendChild(nameLink);
      
      return nameEl;
}
async function populateFilmCreator(filmInfor) {
      const creatorEl = document.getElementById('film-creator');
      creatorEl.innerHTML = '';

      for(const creatorId of filmInfor.creator_ids) {
            const creatorInfor = await apiService.getById(apiEndpoint.creators.getById, creatorId);
            const creatorLink = domsComponent.createAhref({
                  href: `creator/${creatorId}`,
                  text: creatorInfor.name,
                  cssClass: 'creator-name'
            });

            const creatorAge = calculateYearDiff(filmInfor.date, creatorInfor.birth);
            const ageDiv = domsComponent.createDiv('creator-age', creatorAge);

            creatorEl.appendChild(creatorLink);
            creatorEl.appendChild(ageDiv);
      }

      return creatorEl;
}
async function populateFilmStudio(filmInfor) {
      const studioEl = document.getElementById('film-studio');
      studioEl.innerHTML = '';

      const studioName = await apiService.getName(filmInfor.studio_id);
      const studioLink = domsComponent.createAhref({
            href: `studio/${filmInfor.studio_id}`,
            text: studioName,
            cssClass: 'film-studio'
      });
      studioEl.appendChild(studioLink);

      return studioEl;
}
function populateFilmDate(filmInfor) {
      const dateEl = document.getElementById('film-date');
      dateEl.innerHTML = '';

      const dateStr = formatDate(new Date(filmInfor.date));
      const dateSpan = domsComponent.createSpan({ text: dateStr, cssClass: 'film-date'});
      dateEl.appendChild(dateSpan);

      return dateEl;
}
async function populateFilmCollection(filmInfor) {
      const collectionEl = document.getElementById('film-collection');
      collectionEl.innerHTML = '';

      if(!film.collection_id) {
            const span = domsComponent.createSpan({ text: ''});
            collectionEl.appendChild(span);
      } else {
            const collectionName = await apiService.getName(apiEndpoint.collections.getById, filmInfor.collection_id);
            const collectionLink = domsComponent.createAhref({
                  href: `collection/${filmInfor.collection_id}`,
                  text: collectionName,
                  cssClass: 'film-collection',
            });
            collectionEl.appendChild(collectionLink);
      }
}
async function populateFilmTags(filmInfor) {
      const tagsEl = document.getElementById('film-tags');
      await renderListToElement({
            element: tagsEl,
            items: filmInfor.tag_ids,
            renderItemFunc: (tagId) => tagComponent.createTagDivWithApi({ tagId: tagId, cssClass: 'tag-link'})
      });
}

/* ------------------- Related videos ------------------- */
async function renderRelatedFilmVideos(video) {
      const wrapperEl = document.getElementById('film-videos');
      wrapperEl.innerHTML = '';

      const relatedIds = await get
}
async function getRelatedVideosByFilm(video) {
      const film = await apiService.getById(video.film_id);
      return film.video_ids.filter(id => id !== video._id);
}
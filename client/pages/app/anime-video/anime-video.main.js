import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import domsComponent from "../../../components/dom.components.js";
import { createStarsRating } from "../../../components/stars.component.js";
import AnimeVideoArticle from "../../../components/videos/video-article/anime-video-article.class.js";
import VideoArticle from "../../../components/videos/video-article/video-article.class.js";
import appConfigs from "../../../config/app.config.js";
import { ServerFolders } from "../../../constants/folder.constant.js";

const animeVideoId = window.PageParams.id;

export default async function () {
      const animeVideoInfor = await apiService.getById(apiEndpoint.anime_videos.getById, animeVideoId);
      const animeFilmInfor = await apiService.getById(apiEndpoint.anime_films.getById, animeVideoInfor.film_id);
      
      renderAnimeFilm(animeFilmInfor);
      renderAnimeVideo(animeVideoInfor);
      populateRelatedAnimeFilmVideos(animeFilmInfor);
}

function renderAnimeFilm(filmInfor) {
      populateAnimeFilmThumbnail(filmInfor);
      populateAnimeFilmName(filmInfor);
      populateAnimeStudioName(filmInfor);
      populateFilmYear(filmInfor);
      populateAnimeFilmSeries(filmInfor);
      populateAnimeFilmRating(filmInfor);
      populateAnimeFilmTags(filmInfor);
}
function populateAnimeFilmThumbnail(filmInfor) {
      const filmThumbnailElement = document.querySelector('[data-role="film-thumbnail"]');
      filmThumbnailElement.src = `${appConfigs.SERVER}/${ServerFolders.ANIME_FILMS}/${filmInfor.thumbnail}`;
}
function populateAnimeFilmName(filmInfor) {
      const filmNameElement = document.querySelector('[data-role="film-name"]');
      filmNameElement.textContent = filmInfor.name;
}
async function populateAnimeStudioName(filmInfor) {
      const animeStudio = await apiService.getById(apiEndpoint.anime_studios.getById, filmInfor.studio_id);
      const filmStudioElement = document.querySelector('[data-role="film-studio"]');
      const ahref = domsComponent.createAhref({
            href: `anime-studio/${animeStudio._id}`,
            text: animeStudio.name,
            attrs: {
                  'data-spa': 'true'
            }
      });
      filmStudioElement.appendChild(ahref);
}
function populateFilmYear(filmInfor) {
      const filmYearElement = document.querySelector('[data-role="film-year"]');
      filmYearElement.textContent = filmInfor.year;
}
async function populateAnimeFilmSeries(filmInfor) {
      const animeSeries = await apiService.getById(apiEndpoint.anime_series.getById, filmInfor.series_id);
      console.log('anime series: ', animeSeries);
      const animeSeriesElement = document.querySelector('[data-role="film-series"]');
      animeSeriesElement.textContent = animeSeries.name;
}
function populateAnimeFilmRating(filmInfor) {
      createStarsRating('film-rating', filmInfor.rating);
}
async function populateAnimeFilmTags(filmInfor) {
      const filmTagElement = document.querySelector('[data-role="film-tags"]');

      const tags = await Promise.all(
            filmInfor.tag_ids.map(id => apiService.getById(apiEndpoint.tags.getById, id))
      );
      tags.forEach(tag => {
            const ahref = domsComponent.createAhref({
                  href: `/tag/${tag._id}`,
                  text: tag.name,
                  cssClass: 'tag-box',
                  attrs: {
                        'data-spa': 'true'
                  }
            });
            filmTagElement.appendChild(ahref);
      });
}

function renderAnimeVideo(video) {
      populateVideoPlayer(video);
}
function populateVideoPlayer(video) {
      const videoUrl = `${appConfigs.SERVER}/${ServerFolders.ANIME_VIDEOS}/${video.file_path}`;
      const videoElement = document.querySelector('[data-role="video-player"]');
      const videoSource = videoElement.querySelector('source');
      videoSource.src = videoUrl;
      videoElement.load();
}
async function populateRelatedAnimeFilmVideos(film) {
      const relatedVideosEl = document.querySelector('[data-role="related-videos"]');
      const video_ids = film.video_ids.filter(x => x !== animeVideoId);
      const videos = await Promise.all(
            video_ids.map(id => apiService.getById(apiEndpoint.anime_videos.getById, id))
      );
      videos.forEach(async (video) => {
            const videoComponent = new AnimeVideoArticle(video);
            const videoPlayer = await videoComponent.render();
            relatedVideosEl.appendChild(videoPlayer);
      })

}
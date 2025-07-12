import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import appConfigs from "../../../config/app.config.js";
import { ServerFolders } from "../../../constants/folder.constant.js";
import domsComponent from "../../dom.components.js";
import avatarComponent from "../../images/avatar.component.js";

export default class VideoArticle {
      constructor(video, { folder = ServerFolders.VIDEOS, linkPrefix = "video"} = {}) {
            thís.video = video;
            this.folder = folder;
            this.linkPrefix = linkPrefix;
            this.articleElement = null;
            this.playTimeout = null;
            this.handleMouseEnter = this.handleMouseEnter.bind(this);
            this.handleMouseLeave = this.handleMouseLeave.bind(this);
            this.handleInteresect = this.handleInteresect.bind(this);
      }

      async render() {
            const { video } = this;
            
            const article = domsComponent.createArticle('video-article');
            const wrapper = domsComponent.createDiv('video-wrapper');

            const ahref = domsComponent.createAhref({
                  href: `${this.linkPrefix}/#id=${video._id}`,
                  cssClass: `${this.linkPrefix}-link`,
            });
            wrapper.appendChild(ahref);

            const videoPlayer = this.createVideoPlayer(video.name, video.filepath, this.folder);
            ahref.appendChild(videoPlayer);

            const videoInfor = await this.createVideoInfor(video);
            ahref.appendChild(videoInfor);

            article.appendChild(wrapper);

            this.articleElement = article;
            this.ahrefElement = ahref;

            this.attachHoverEvents();
            return article;
      }

      async createVideoInfor(video) {
            const videoInfor = domsComponent.createDiv('video-infor');
            const videoInforWrapper = domsComponent.createDiv('video-infor-wrapper');

            const videoCreator = await avatarComponent.createAvatar(video.creator_id);
            videoInforWrapper.appendChild(videoCreator);

            const filmName = await apiService.getName(apiEndpoint.films.getById, video.film_id);
            const videoFilm = this.createInfor({
                  iHref: video.film_id,
                  iText: filmName,
                  iCssClass: 'video-film',
                  iWrapperCss: 'video-film-wrapper',
            });

            const creatorName = await apiService.getName(apiEndpoint.creators.getById, video.creator_id);
            const videoCreatorName = this.createInfor({
                  iHref: video.creator_id,
                  iText: creatorName,
                  iCssClass: 'video-creator',
                  iWrapperCss: 'video-creator-wrapper',
            });

            const videoDetails = domsComponent.createDiv('video-details');
            const videoViews = domsComponent.createSpan({
                  text: `${video.views} views`,
                  cssClass: 'video-views',
            });
            videoDetails.appendChild(videoFilm);
            videoDetails.appendChild(videoCreatorName);
            videoDetails.appendChild(videoViews);

            videoInforWrapper.appendChild(videoDetails);
            videoInfor.appendChild(videoInforWrapper);

            return videoInfor;
      }

      createInfor({ iHref, iText, iCssClass, iWrapperCss }) {
            const infor = domsComponent.createAhref({
                  href: iHref,
                  text: iText,
                  cssClass: iCssClass,
            });
            const inforWrapper = domsComponent.createDiv(iWrapperCss);
            inforWrapper.appendChild(infor);
            return inforWrapper;
      }

      createVideoPlayer(name, filepath, folder) {
            const wrapper = domsComponent.createDiv('video-wrapper');
            const videoPlayer = document.createElement('video');
            videoPlayer.classList.add('video-player');
            videoPlayer.controls = false;
            videoPlayer.muted = true;

            const source = document.createElement('source');
            source.src = `${appConfigs.SERVER}/${folder}/${filepath}`;
            source.type = 'video/mp4';

            videoPlayer.appendChild(source);
            wrapper.appendChild(videoPlayer);

            return wrapper;
      }

      attachHoverEvents() {
            if(this.ahrefElement) {
                  this.ahrefElement.addEventListener('mouseenter', this.handleMouseEnter);
                  this.ahrefElement.addEventListener('mouseleave', this.handleMouseLeave);
            }
      }
      detachHoverEvents() {
            if(this.ahrefElement) {
                  this.ahrefElement.removeEventListener('mouseenter', this.handleMouseEnter);
                  this.ahrefElement.removeEventListener('mouseleave', this.handleMouseLeave);
            }
      }

      handleMouseEnter() {
            const video = this.ahrefElement.querySelector('video');
            if(video) {
                  this.playTimeout = setTimeout(() => {
                        video.play().catch((error) => {
                              if(error.name !== 'AbortError') {
                                    console.warn('Video play failed: ', error);
                              }
                        });
                  });
            }
      }
      handleMouseLeave() {
            clearTimeout(this.playTimeout);
            const video = this.ahrefElement.querySelector('video');
            if(video) {
                  video.pause();
            }
      }

      destroy() {
            this.detachHoverEvents();
            this.articleElement = null;
            this.ahrefElement = null;
            this.playTimeout = null;
      }
}
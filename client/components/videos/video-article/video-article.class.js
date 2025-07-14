import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import appConfigs from "../../../config/app.config.js";
import { ServerFolders } from "../../../constants/folder.constant.js";
import { addHoverToScaleEffect } from "../../../utils/effects.utils.js";
import domsComponent from "../../dom.components.js";
import AvatarComponent, { AvatarTypes } from "../../images/avatar.component.js";

export default class VideoArticle {
      constructor(video, { folder = ServerFolders.VIDEOS, linkPrefix = "video", cssClass = "video-article"} = {}) {
            this.video = video;
            this.folder = folder;
            this.linkPrefix = linkPrefix;
            this.cssClass = cssClass;
            this.articleElement = null;
            this.playTimeout = null;
            this.handleMouseEnter = this.handleMouseEnter.bind(this);
            this.handleMouseLeave = this.handleMouseLeave.bind(this);
      }

      async render() {
            const { video } = this;
            
            const article = domsComponent.createArticle({ cssClass: this.cssClass });
            const wrapper = domsComponent.createDiv({ cssClass: 'video-wrapper' });

            const ahref = domsComponent.createAhref({
                  href: `${this.linkPrefix}/${video._id}`,
                  cssClass: `${this.linkPrefix}-link`,
                  attrs: {
                        'data-spa': 'true'
                  }
            });
            wrapper.appendChild(ahref);

            const videoPlayer = this.createVideoPlayer(video.name, video.file_path, this.folder);
            this.videoPlayer = videoPlayer.querySelector('video');
            ahref.appendChild(videoPlayer);

            // Chỉ add info nếu có method createVideoInfor tồn tại:
            if(typeof this.createVideoInfor === 'function') {
                  const videoInfor = await this.createVideoInfor(video);
                  if(videoInfor) ahref.appendChild(videoInfor);
            }

            article.appendChild(wrapper);
            addHoverToScaleEffect(article);

            this.articleElement = article;
            this.ahrefElement = ahref;

            this.attachHoverEvents();
            return article;
      }

      async createVideoInfor(video) {
            const [ filmName, creatorName ] = await Promise.all([
                  apiService.getName(apiEndpoint.films.getById, video.film_id),
                  apiService.getName(apiEndpoint.creators.getById, video.creator_id),
            ]);

            const videoInfor = domsComponent.createDiv({ cssClass: 'video-infor' });
            const videoInforWrapper = domsComponent.createDiv({cssClass: 'video-infor-wrapper'});

            const avatarComponent = AvatarComponent();
            const videoCreator = await avatarComponent.create(video.creator_id, AvatarTypes.CREATOR);
            videoInforWrapper.appendChild(videoCreator);

            const videoFilm = this.createInfor({
                  iHref: video.film_id,
                  iText: filmName,
                  iCssClass: 'video-film',
                  iWrapperCss: 'video-film-wrapper',
            });

            const videoCreatorName = this.createInfor({
                  iHref: video.creator_id,
                  iText: creatorName,
                  iCssClass: 'video-creator',
                  iWrapperCss: 'video-creator-wrapper',
            });

            const videoDetails = domsComponent.createDiv({ cssClass: 'video-details'});
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
            const wrapper = domsComponent.createDiv({ cssClass: 'video-wrapper'});
            const videoPlayer = document.createElement('video');
            videoPlayer.classList.add('video-player');
            videoPlayer.controls = false;

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
            if(this.videoPlayer) {
                  this.playTimeout = setTimeout(() => {
                        this.videoPlayer.play().catch((error) => {
                              if(error.name !== 'AbortError') {
                                    console.warn('Video play failed: ', error);
                              }
                        }, 200);
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
            if(this.videoPlayer) {
                  this.videoPlayer.pause();
                  this.videoPlayer.src = '';
            }
            this.articleElement?.remove();
            this.articleElement = null;
            this.ahrefElement = null;
            this.playTimeout = null;
      }
}
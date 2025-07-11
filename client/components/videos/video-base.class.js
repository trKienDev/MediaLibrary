import { addHoverToScaleEffect } from "../../utils/effects.utils.js";
import domsComponent from "../dom.components.js";
import videoBehavior from "./video.behavior.js";
import videoComponent from "./video.component.js";
import videoUtils from "./video.utils.js";

export default class VideoBase {
      constructor(video, config) {
            this.video = video;
            this.config = config;
      }

      async createArticle() {
            const article = domsComponent.createDiv('video-article');
            const container = domsComponent.createDiv('video-article-container');
            this.link = domsComponent.createAhref({
                  href: `${this.config.hrefPrefix}/#id=${this.video._id}`,
                  cssClass: this.config.linkClass
            });
            container.appendChild(this.link);
            const player = videoUtils.createVideoPlayer({
                  name: this.video.name,
                  filepath: this.video.file_path,
                  folder: this.config.folder,
            });
            this.link.appendChild(player);
            article.appendChild(container);

            const videoInfor = await videoComponent.createVideoInfor(this.video);
            this.link.appendChild(videoInfor);
            
            addHoverToScaleEffect(article);
            this.attachBehavior();
            return article;
      }

      attachBehavior() {
            videoBehavior.attachHoverPlayHandler(this.link);
      }
}
import appConfigs from "../../../config/app.config.js";
import { ServerFolders } from "../../../constants/folder.constant.js";
import { addHoverToScaleEffect } from "../../../utils/effects.utils.js";
import domsComponent from "../../dom.components.js";
import VideoArticle from "./video-article.class.js";

export default class ShortVideoArticle extends VideoArticle {
      constructor(short, options = {}) {
            // Merge options: cho phép truyền hoverToScale khi khởi tạo
            super(short, {
                  folder: ServerFolders.SHORTS,
                  linkPrefix: "idol",
                  cssClass: "short-article",
                  showVideoInfor: false,
                  hoverToScale: options.hoverToScale ?? true, // 👈 Cho phép bật/tắt
                  ...options
            });
      }

      async createVideoInfor() {
            return null;
      }

      async render() {
            const { video } = this;

            const article = domsComponent.createArticle({ cssClass: this.cssClass });
            const wrapper = domsComponent.createDiv({ cssClass: 'video-wrapper' });

            // 🟢 Không tạo thẻ <a>, chỉ tạo player trực tiếp
            const videoPlayer = this.createVideoPlayer(video.name, video.file_path, this.folder);
            this.videoPlayer = videoPlayer.querySelector('video');

            // Gắn trực tiếp video vào wrapper (thay vì trong <a>)
            wrapper.appendChild(videoPlayer);

            // Không gọi createVideoInfor vì short không cần hiển thị thông tin
            article.appendChild(wrapper);

            // Áp dụng hiệu ứng hoverToScale nếu có
            if (this.hoverToScale) {
                  addHoverToScaleEffect(article);
            }

            this.articleElement = article;

            // Có thể bỏ attachHoverEvents vì không có ahref nữa
            this.attachHoverEvents();

            return article;
      }


      createVideoPlayer(name, filePath, folder) {
            // Gọi lại logic gốc từ VideoArticle
            const wrapper = super.createVideoPlayer(name, filePath, folder);

            // Lấy phần tử video bên trong wrapper
            const videoPlayer = wrapper.querySelector('video');

            // Thêm thuộc tính data-lightbox-src để ImageLightbox có thể dùng
            videoPlayer.setAttribute('data-lightbox-src', `${appConfigs.SERVER}/${folder}/${filePath}`);
            videoPlayer.setAttribute('link', `/${this.linkPrefix}/${this.video.idol_id}`);

            videoPlayer.addEventListener('mouseenter', this.handleMouseEnter);
            videoPlayer.addEventListener('mouseleave', this.handleMouseLeave);

            // (tuỳ chọn) có thể thêm thuộc tính khác nếu cần
            // videoPlayer.setAttribute('data-type', 'short-video');

            return wrapper;
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
            if(this.videoPlayer) {
                  this.videoPlayer.pause();
            }
      }
}
import appConfigs from "../../config/app.config.js"

const VideoUtils = {
      populateVideo(iVideo, uploadPath) {
            const videoUrl = `${appConfigs.SERVER}/${uploadPath}/${iVideo.file_path}`;
            const videoPlayer = document.querySelector('video');
            const videoSource = videoPlayer.querySelector('source');
            const thumbnailImage = document.getElementById('thumbnail-video');
            videoSource.src = videoUrl;
            videoPlayer.load();
            videoPlayer.classList.remove('d-none');
            thumbnailImage.style.display = 'none';
      },

      updateVideoSourceById({ elementId, iVideo, uploadPath }) {
            const videoUrl = `${appConfigs.SERVER}/${uploadPath}/${iVideo.file_path}`;
            const videoPlayer = document.getElementById(elementId);
            const videoSource =videoPlayer.querySelector('source');
            videoSource.src = videoUrl;
            videoPlayer.load();
            return videoPlayer;
      }
};

export default VideoUtils;

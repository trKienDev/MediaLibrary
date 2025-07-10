import domsComponent from "../dom.components.js";

function createInfo({ ihref, itext, icssClass, icontainerCss }) {
      const link = domsComponent.createAhref({
            href: ihref,
            text: itext,
            cssClass: icssClass
      });
      const container = domsComponent.createDiv(icontainerCss);
      container.appendChild(link);
      return container;
}
async function createVideoInfor(video) {
      const videoInfoDiv = domsComponent.createDiv('video-info');
      const container = domsComponent.createDiv('video-info-container');
      const avatar = await image
}
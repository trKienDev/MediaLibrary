import domsComponent from "../../../components/dom.components.js"

const homepageRendererMap = {
      videos: async(section, parent) => {
            const container = domsComponent.createDiv('section-content-container');
            const wrapper = domsComponent.createDiv('section-video-wrapper');
            const articles = await Promise.all(section.data.map())
      }
}
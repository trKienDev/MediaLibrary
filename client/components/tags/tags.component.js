import apiService from "../../api/api.instance.js";
import apiEndpoint from "../../api/endpoint.api.js";
import domsComponent from "../dom.components.js";

function createTagAhref(tag) {
      const tagAhref = domsComponent.createAhref({
            href: `tag/${tag._id}`,
            text: tag.name,
            cssClass: 'tag-link',
      });

      return tagAhref;
}
function createTagDiv(tag, cssClass) {
      const tagDiv = domsComponent.createDiv({cssClass: cssClass});
      const tagAhref = createTagAhref(tag);
      tagDiv.appendChild(tagAhref);
      return tagDiv;
}
async function createTagDivWithApi({ tagId, cssClass }) {
      const tagValue = await apiService.getById(apiEndpoint.tags.getById, tagId);
      const tagDiv = createTagDiv(tagValue, cssClass);
      return tagDiv;
}

const tagComponent = {
      createTagDiv,
      createTagDivWithApi,
      createTagAhref,
}
export default tagComponent;
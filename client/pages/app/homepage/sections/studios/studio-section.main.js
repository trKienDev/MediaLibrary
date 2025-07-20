import apiService from "../../../../../api/api.instance.js";
import apiEndpoint from "../../../../../api/endpoint.api.js";
import tagComponent from "../../../../../components/tags/tags.component.js";

export default async function() {
      const studiosWrapper = document.querySelector('[data-role="list-studios"]');
      const studios = await apiService.getAll(apiEndpoint.studios.getAll);
      studios.forEach(studio => {
            const studioLink = tagComponent.createTagDiv(studio, 'studio-link');
            studioLink.classList.add('tag-style');
            studiosWrapper.appendChild(studioLink);
      });
}
import apiEndpoint from "../../../api/endpoint.api.js";
import { toastNotifier } from "../../../app.main.js";
import appConfigs from "../../../config/app.config.js";
import NOTIFICATION_TYPES from "../../../constants/notification-types.constant.js";
import sectionRegistry from "./section.registry.js";

const homepageSectionTypes = Object.keys(sectionRegistry);
let sectionPages = Object.fromEntries(homepageSectionTypes.map(type => [type, 1]));

let isLoading = false;
let lastSelectedType = null;

(async function() {
      const seed = Math.random().toString(36).substring(2);
      const loader = document.getElementById('homepage-feeds-loader');
      const content = document.getElementById('homepage-feeds-content');

      if(!loader || !content) {
            console.error('Missing loader or content element');
            toastNotifier.show('Missing loader or content element', NOTIFICATION_TYPES.ERROR);
            return;
      }

      await loadUntilScrollable(content, loader, seed);

      const observer = new IntersectionObserver(async entries => {
            if(entries[0].isIntersecting) {
                  await fetchAndRender(content, loader, seed);
            }
      }, { threshold: 0.1 });
      observer.observe(loader);
})();

async function loadUntilScrollable(content, loader, seed) {
      await fetchAndRender(content, loader, seed);
      while(document.body.scrollHeight <= window.innerHeight && !isLoading) {
            await fetchAndRender(content, loader, seed);
      }
}

async function fetchAndRender(content, loader, seed) {
      if(isLoading) return;
      isLoading = true;
      loader.style.display = 'block';

      let randomType;
      do {
            randomType = homepageSectionTypes[Math.floor(Math.random() * homepageSectionTypes.length)];
      } while(homepageSectionTypes.length > 1 && randomType === lastSelectedType);
      lastSelectedType = randomType;

      const page = sectionPages[randomType];
      const url = `${appConfigs.SERVER}/${apiEndpoint.homepageFeeds}?type=${randomType}&page=${page}&seed=${seed}`;

      try {
            const response = await fetch(url);
            const json = await response.json();
            if(json.data && json.data.length) {
                  await renderSection({ type: randomType, data: json.data }, content);
                  sectionPages[randomType]++;
            }
      } catch(error) {
            console.error(`Error fetching ${randomType}`, error);
            toastNotifier.show(`Error fetching ${randomType}`, NOTIFICATION_TYPES.ERROR);
      } finally {
            isLoading = false;
      }
}

async function renderSection(section, parent) {
      const renderer = sectionRegistry[section.type];
      if(!renderer) {
            console.warn(`No renderer for type: ${section.type}`);
            return;
      }
      const el = await renderer(section.data);
      parent.appendChild(el);
}
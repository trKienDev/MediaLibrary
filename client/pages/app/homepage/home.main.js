import apiEndpoint from "../../../api/endpoint.api.js";
import { toastNotifier } from "../../../app.main.js";
import appConfigs from "../../../config/app.config.js";
import NOTIFICATION_TYPES from "../../../constants/notification-types.constant.js";
import sectionRegistry from "./section.registry.js";

export default async function() {
      const homepageSectionTypes = Object.keys(sectionRegistry);

      if(homepageSectionTypes.length === 0) {
            console.warn('No homepage section types available');
            toastNotifier.show('No homepage section types available', NOTIFICATION_TYPES.WARNING);
      } else {
            let sectionPages = Object.fromEntries(homepageSectionTypes.map(type => [type, 1]));
            let isLoading = false;
            let lastSelectedType = null;
            let sectionHistory = [...homepageSectionTypes];
            const exhaustedTypes = new Set();

            const seed = Math.random().toString(36).substring(2);
            const loader = document.getElementById('homepage-feeds-loader');
            const content = document.getElementById('homepage-feeds-content');

            if(!loader || !content) {
                  console.error('Missing loader or content element');
                  toastNotifier.show('Missing loader or content element', NOTIFICATION_TYPES.ERROR);
                  return;
            }

            await loadUntilScrollable(content, loader, seed);

            const observer = new IntersectionObserver(entries => {
                  if(entries[0].isIntersecting && !isLoading) {
                        fetchAndRender(content, loader, seed);
                  }
            }, { threshold: 0.1 });
            observer.observe(loader);

            async function loadUntilScrollable(content, loader, seed) {
                  let attemps = 0;
                  const maxAttemps = 10;
                  do {
                        const fetched = await fetchAndRender(content, loader, seed);
                        attemps++;
                        if(!fetched) break;
                  } while(attemps < 3 && attemps < maxAttemps);

                  if(attemps === maxAttemps) {
                        console.warn("Reached max attemps for loadUntilScrollable");
                        toastNotifier.show("Reached max attemps for loadUntilScrollable", NOTIFICATION_TYPES.WARNING);
                  }
            }

            function getNextSectionType() {
                  const availableTypes = homepageSectionTypes.filter(type => !exhaustedTypes.has(type));
                  if(availableTypes.length === 0) {
                        return null;
                  }
                  if(sectionHistory.length === 0) {
                        sectionHistory = homepageSectionTypes.filter(type => type !== lastSelectedType);
                  }
                  const randomIndex = Math.floor(Math.random() * sectionHistory.length);
                  const nextType = sectionHistory.splice(randomIndex, 1)[0];
                  lastSelectedType = nextType;
                  return nextType;
            }

            async function fetchAndRender(content, loader, seed) {
                  if(isLoading) return;
                  isLoading = true;
                  loader.style.display = 'block';

                  const randomType = getNextSectionType();
                  if(!randomType) {
                        console.warn("All section types exhausted. No more conent to load");
                        loader.style.visibility = 'hidden';
                        isLoading = false;
                        return false;
                  }

                  const page = sectionPages[randomType];
                  const url = `${appConfigs.SERVER}/${apiEndpoint.homepageFeeds}?type=${randomType}&page=${page}&seed=${seed}`;

                  try {
                        const response = await fetch(url);
                        const json = await response.json();
                        if(json.data && json.data.length) {
                              await renderSection({ type: randomType, data: json.data }, content);
                              sectionPages[randomType]++;
                              loader.style.visibility = 'hidden';
                              isLoading = false;
                              return true;
                        } else {
                              console.warn(`No data for ${randomType} at page ${page}, marking as exhausted`);
                              //    toastNotifier.show('No more content', NOTIFICATION_TYPES.ERROR);
                              exhaustedTypes.add(randomType);
                              loader.style.visibility = 'hidden';
                              isLoading = false;
                              return await fetchAndRender(content, loader, seed); // try next available type
                        }
                  } catch(error) {
                        console.error(`Error fetching ${randomType}`, error);
                        toastNotifier.show(`Error fetching ${randomType}`, NOTIFICATION_TYPES.ERROR);
                  } finally {
                        isLoading = false;
                  }
                  return false;
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
      }
}
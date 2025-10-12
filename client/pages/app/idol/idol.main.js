import apiService from "../../../api/api.instance.js";
import apiEndpoint from "../../../api/endpoint.api.js";
import domsComponent from "../../../components/dom.components.js";
import AvatarComponent, { AvatarTypes } from "../../../components/images/avatar.component.js";
import { createImageFrame } from "../../../components/images/image-frame.component.js";
import ClipVideoArticle from "../../../components/videos/video-article/clip-video-article.class.js";
import ShortVideoArticle from "../../../components/videos/video-article/short-video-article.class.js";

const idolId = window.PageParams.id;
let imagesRendered = false;
let shortsRendered = false;
let recordsRendered = false;

export default async function() {
      const idolInfor = await apiService.getById(apiEndpoint.idols.getById, idolId);

      populateIdolAvatar(idolInfor);
      populateIdolInformation(idolInfor);
      // switchIdolTab();
      initIdolTabs('images');
}

async function populateIdolAvatar(idol) {
      const idolAvatarEl = document.querySelector('[data-role="idol-avatar"]');
      const avatarComponent = AvatarComponent({ enableHoverEffect: false });
      const idolAvatar = await avatarComponent.create(idol._id, AvatarTypes.IDOL);
      idolAvatarEl.appendChild(idolAvatar);
}

async function populateIdolInformation(idol) {
      const idolNameEl = document.querySelector('[data-role="idol-name"]');
      const idolNameValue = domsComponent.createSpan({
            text: idol.name,
            cssClass: 'idol-name'
      });
      idolNameEl.appendChild(idolNameValue);

      const idolIdentifier = document.querySelector('[data-role="idol-identifier"]');
      const idolIdentifierValue = domsComponent.createSpan({
            text: idol.identifier_name,
            cssClass: 'idol-identifier'
      });
      idolIdentifier.appendChild(idolIdentifierValue);

      const idolCountry = document.querySelector('[data-role="idol-country"]');
      const idolCountryValue = domsComponent.createSpan({
            text: idol.region,
            cssClass: 'idol-country'
      });
      idolCountry.appendChild(idolCountryValue);
}

function initIdolTabs(defaultTab = 'images') {
      const tabItems = document.querySelectorAll('[data-role="tab-item"]');

      if (tabItems.length === 0) return;

      // Đăng ký sự kiện click cho từng tab
      tabItems.forEach(a => {
            a.addEventListener('click', e => {
                  e.preventDefault();
                  const tabName = a.dataset.tab;
                  switchIdolTab(tabName);
            });
      });

      // Kích hoạt tab mặc định khi load trang
      switchIdolTab(defaultTab);
}
function switchIdolTab(tabName) {
      // 1️⃣ Lấy danh sách tất cả tab
      const tabItems = document.querySelectorAll('[data-role="tab-item"]');

      // 2️⃣ Gán class 'active' cho tab đang chọn, gỡ khỏi tab khác
      tabItems.forEach(a => {
            a.classList.toggle('active', a.dataset.tab === tabName);
      });

      // 3️⃣ Ẩn/hiển thị các vùng nội dung tương ứng (idol-images, idol-shorts, idol-records, v.v.)
      const sections = document.querySelectorAll('[data-role^="idol-"]');
      sections.forEach(section => {
            const role = section.getAttribute('data-role');
            const name = role.replace('idol-', '');
            
            // Chỉ xử lý các vùng chính có wrapper nội dung (images, shorts, records...)
            if (['images', 'shorts', 'records', 'albums', 'videos'].includes(name)) {
                  section.style.display = (name === tabName) ? 'block' : 'none';
            }
      });

      if (tabName === 'images' && !imagesRendered) {
            renderIdolImages();
            imagesRendered = true;
      }

      if (tabName === 'shorts' && !shortsRendered) {
            renderIdolShorts();
            shortsRendered = true;
      }

      if (tabName === 'records' && !recordsRendered) {
            renderIdolRecords();
            recordsRendered = true;
      }
}

async function renderIdolImages() {
      const imagesWrapper  = document.querySelector('[data-role="idol-images"] .idol-images-wrapper');
      const images = await apiService.getById(apiEndpoint.images.getByIdolId, idolId);
      if(images.length > 0) {
            const imageFrames = await Promise.all(images.map(
                  async image => createImageFrame(image, `/image/${image._id}`)
            ));
            imageFrames.forEach(frame => imagesWrapper.appendChild(frame));
      }
}

async function renderIdolShorts() {
      const shortsWrapper = document.querySelector('[data-role="idol-shorts"] .idol-shorts-wrapper');
      const shorts = await apiService.getById(apiEndpoint.shorts.getByIdolId, idolId);
      if(shorts && shorts.length > 0) {
            const shortArticles = await Promise.all(shorts.map(async short => {
                  const instance = new ShortVideoArticle(short, { hoverToScale: false });
                  return instance.render();
            }));
            shortArticles.forEach(article => shortsWrapper.appendChild(article));
      }
}

async function renderIdolRecords() {
      const recordsWrapper = document.querySelector('[data-role="idol-records"] .idol-records-wrapper');
      const records = await apiService.getById(apiEndpoint.records.getByIdolId, idolId);
      const recordArticles = await Promise.all(records.map(async record => {
            const randomClipId = record.clip_ids[Math.floor(Math.random() * record.clip_ids.length)];
            const clip = await apiService.getById(apiEndpoint.clips.getById, randomClipId);
            const instance = new ClipVideoArticle(clip, { hoverToScale: false });
            return instance.render();
      }));
      
      recordArticles.forEach(article => recordsWrapper.appendChild(article));
}
import { toastNotifier } from "../../../app.main";
import NOTIFICATION_TYPES from "../../../constants/notification-types.constant";

(async function() {
      alert('hello');
})();

const renderSrategies = {
      // 'videos': (section, parent) => ...
}
class HomepageFeedsLoader {
      // 1. Dữ liệu (state) được đóng gói bên trong
      #loaderElement;
      #observer;
      #sectionPages = { /* ... */ };
      #isLoading = false;
      #homepageSectionTypes = [ /* ... */ ];
      #sessionSeed;
      #apiEndpoint;
      #parentElement;

      // 2. Constructor nhận các dependency từ bên ngoài
      constructor(loaderSelector, parentSelector, sectionTypes, apiEndpoint) {
            this.#loaderElement = document.querySelector(loaderSelector);
            this.#parentElement = document.querySelector(parentSelector);
            this.#homepageSectionTypes = sectionTypes;
            this.#apiEndpoint = apiEndpoint;

            if(!this.#loaderElement || !this.#parentElement) {
                  toastNotifier.show("Loader or parent element not found!", NOTIFICATION_TYPES.ERROR);
                  throw new Error("Loader or parent element not found!");
            }
      }

      // 3. Các hàm toàn cục trở thành phương thức của class
      // Phương thức này khởi tạo toàn bộ logic
      initialize() {
            if(!this.#loaderElement) return;
            this.#sessionSeed = this.#createSeed();

            this.#observer = new IntersectionObserver(entries => {
                  if(entries[0].isIntersecting) {
                        this.fe
                  }
            });
      }

      async fetchNextBatch() {
            // 1. Kiểm tra xem có đang trong quá trình tải khác không. Nếu có, thoát ngay.
            if(this.#isLoading) return;

            // 2. Kiểm tra xem còn loại nội dung nào để thử không.
            if(this.#homepageSectionTypes.length === 0) {
                  this.#loaderElement.innerHTML = "Bạn đã xem hết nội dung! 🎉";
                  this.#loaderElement.style.display = 'block';
                  // ngắt observer để ko gọi lại hàm này nữa
                  if(this.#observer) {
                        this.#observer.disconnect();
                  }
                  return;
            }

            // 3. Đánh dấu là "đang tải" & hiển thị icon loading
            this.#isLoading = true;
            this.#loaderElement.style.display = 'block';

            let hasMoreContent = false;
            let sectionToRender = null;

            // 4. Vòng lặp để tìm kiếm nội dung
            // Vòng lặp sẽ tiếp tục cho đến khi tìm thấy nội dung HOẶC hết các loại section để thử.
            while(!hasMoreContent && this.#homepageSectionTypes.length > 0) {
                  const typeToFetch = this.#homepageSectionTypes[0];
                  const nextPage = this.#sectionPages[typeToFetch] || 1;

                  // Sử dụng các thuộc tính của lớp đã được truyền vào qua constructor.
                  const apiUrl = `${this.#apiEndpoint}?type=${typeToFetch}&page=${nextPage}&seed=${this.#sessionSeed}`;

                  try {
                        const response = await fetch(apiUrl);
                        if(!response.ok) {
                              const errorMessage = await response.json();
                              throw new Error(errorMessage);
                        }

                        const newContent = await response.json();

                        // 5, Xử lý kết quả trả về
                        if(newContent.data && newContent.data.length > 0) {
                              // A. Nếu có dữ liệu
                              sectionToRender = {
                                    type: typeToFetch,
                                    title: typeToFetch,
                                    data: newContent.data
                              };
                              hasMoreContent = true; // Đánh dấu đã tìm thấy, để thoát vòng lặp.

                              this.#sectionPages[typeToFetch]++;

                              const usedType = this.#homepageSectionTypes.shift();
                              this.#homepageSectionTypes.push(usedType);
                        } else {
                              // B. Nếu ko có dữ liệu --> loại bỏ khỏi danh sách xoay vòng
                              this.#homepageSectionTypes.shift();
                        }
                  } catch(error) {
                        toastNotifier.show("Error while batching homepage feeds", NOTIFICATION_TYPES.ERROR);
                        console.error("Error while batching homepage feed: ", error);
                        break;
                  }
            }

            // 6. Render nội dung nếu đã tìm thấy
            if(sectionToRender) {
                  await this.renderSections([sectionToRender]);
            }

            // 7. Đánh dấu đã tải xong
            this.#isLoading = false;
      }

      async renderSections(sections) {
            for(const section of sections) {
                  const renderFunction = renderSrategies[section.type];
                  if(renderFunction) {
                        await renderFunction(section, this.#parentElement);
                  } else {
                        toastNotifier.show('No render strategy found', NOTIFICATION_TYPES.WARNING);
                        console.warn(`No render strategy found for type: ${section.type}`);
                  }
            }
      }

      #createSeed() {
            return Math.random().toString(36).substring(2);
      }
}


const feedsLoader = new HomepageFeedsLoader(
      '#homepage-feeds-loader',
      '#homepage-feeds-content',
      ['creators', 'videos', 'films'],
      // api_user
);
feedsLoader.initialize();

async function RenderVideosSection(section, homepageFeedsContent) {
      const section_container = doms_component.createDiv('section-content_container');
      const videos_wrapper = doms_component.createDiv('section-videos_wrapper');
      videos_wrapper.id = 'videos-pagination_section';
     
      // Tạo 1 mảng các promise
      const article_promises = section.data.map(video => 
            videos_component.CreateVideoArticle(video)
      );
      // Chờ cho TẤT CẢ các promise hoàn thành
      const video_articles = await Promise.all(article_promises);     
      videos_wrapper.append(...video_articles);
      section_container.appendChild(videos_wrapper);
      homepageFeedsContent.appendChild(section_container);  
}
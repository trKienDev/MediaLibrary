# Project structure
my-project/
├── admin/
│   └── index.html          # ĐIỂM TRUY CẬP CHO TRANG ADMIN
│
├── assets/                 # Chứa các tài sản tĩnh như CSS, ảnh, font
│   ├── css/
│   │   ├── main.css        # File CSS chính cho trang người dùng
│   │   └── admin.css       # File CSS chính cho trang admin
│   └── images/
│
├── api/                    # Định nghĩa các hàm gọi API (dùng chung)
│   ├── videoAPI.js
│   └── userAPI.js
│
├── components/             # Chứa các "component" có thể tái sử dụng
│   ├── shared/             # Dùng chung cho cả user và admin (ví dụ: Modal, Button)
│   ├── app/                # Chỉ dùng cho trang người dùng (ví dụ: VideoPlayer)
│   └── admin/              # Chỉ dùng cho trang admin (ví dụ: UserTable)
│
├── config/                 # Chứa các file cấu hình (dùng chung)
│   └── appConfig.js
│
├── constants/              # Chứa các hằng số (dùng chung)
│   └── index.js
│
├── pages/                  # Chứa các file HTML "mẫu" cho từng view của SPA
│   ├── app/
│   │   ├── home.html
│   │   └── watch.html
│   └── admin/
│       ├── dashboard.html
│       └── users.html
│
|--- services
|     |--- state.js           # Quản lý trạng thái ứng dụng
|     |--- apiService.js      # Xử lý logic gọi API 
├── spa/                    # Chứa các module cốt lõi của SPA (dùng chung)
│   ├── router.js           # Bộ định tuyến phía client
│   └── render.js           # Hàm để fetch và render các view từ /pages
│
├── utils/                  # Chứa các hàm tiện ích (dùng chung)
│   ├── dom.js
│   └── format.js
│
├── index.html              # ĐIỂM TRUY CẬP CHO TRANG NGƯỜI DÙNG
└── loader.js               # Kịch bản tải tất cả các file JS theo thứ tự

====================================================================
* api/videoAPI.js (File này không chứa logic, chỉ là cấu hình)
export const videoAPI = {
      getAll: {
            method: 'GET',
            endpoint: '/videos'
      },
      getById: {
            method: 'GET',
            endpoint: '/videos/:id' // :id là một tham số
      },
      create: {
            method: 'POST',
            endpoint: '/videos'
      }
};
* File thực thi trong services
services/apiServices.js
// Import "bản thiết kế" từ thư mục api
import { videoAPI } from '../api/videoAPI.js';
const BASE_URL = 'https://your-api-server.com/api/v1';
export const apiService = {
    // Hàm này sử dụng định nghĩa từ videoAPI.getAll
    fetchAllVideos: async function() {
        const { method, endpoint } = videoAPI.getAll;
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer ' + your_token
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch videos:', error);
            // Xử lý lỗi, có thể hiển thị thông báo cho người dùng
            return []; // Trả về mảng rỗng nếu có lỗi
        }
    },
    // Hàm này sử dụng định nghĩa từ videoAPI.getById
    fetchVideoById: async function(id) {
        const { method, endpoint } = videoAPI.getById;
        const finalEndpoint = endpoint.replace(':id', id); // Thay thế tham số :id
        
        try {
            const response = await fetch(`${BASE_URL}${finalEndpoint}`, { method });
            // ... xử lý tương tự
        } catch (error) {
            // ...
        }
    }
};

====================================================================
# 1. Intialize SPA
## Bước 1: Chuẩn bị "Sân khấu" - index.html
Đây là file HTML duy nhất mà người dùng sẽ tải. Nó chứa "khung sườn" của ứng dụng và là nơi chúng ta sẽ bơm nội dung động vào.
**File**: *index.html* (ở thư mục gốc)
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My SPA Project</title>
    <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body>
    <header>
        <nav>
            <a href="/" data-spa>Trang chủ</a>
            <a href="/about" data-spa>Giới thiệu</a>
            <a href="/products" data-spa>Sản phẩm</a>
        </nav>
    </header>
    <main id="app-root"></main>
    <footer>
        <p>© 2025 - Xây dựng với JS thuần</p>
    </footer>
    <script src="/loader.js"></script>
</body>
</html>

**Giải thích:** 
data-spa: Thuộc tính tùy chỉnh này giúp chúng ta dễ dàng xác định các link nào cần được xử lý bởi router của SPA thay vì để trình duyệt tải lại trang.
#app-root: Vùng chứa chính. Mọi "view" sẽ được render vào bên trong main.

## Bước 2: Tạo các "View" - Thư mục pages
Đây là các đoạn mã HTML cho từng trang. Chúng chưa phải là các file HTML hoàn chỉnh.
**File**: *pages/app/home.html*
<h1>Chào mừng đến với Trang chủ!</h1>
<p>Đây là nội dung được tải động bằng JavaScript.</p>
<p>Số lượt click: <span id="click-count">0</span></p>
<button id="test-button">Click me!</button>

**File**: *pages/app/about.html*
<h1>Về chúng tôi</h1>
<p>Chúng tôi là những người đam mê xây dựng ứng dụng web bằng JavaScript thuần túy.</p>

**File**: *pages/app/products.html*
<h1>Sản phẩm của chúng tôi</h1>
<ul>
    <li>Sản phẩm A</li>
    <li>Sản phẩm B</li>
    <li>Sản phẩm C</li>
</ul>

## Bước 3: Quản lý Trạng thái - services/state.js
Đây là "bộ nhớ" chung của ứng dụng.
**File**: *services/state.js*
// Khởi tạo namespace chính
window.App = window.App || {};

App.services = App.services || {};

App.services.state = (function() {
    // Trạng thái là private, chỉ có thể truy cập qua các hàm public
    const _state = {
        clickCount: 0
    };

    const _listeners = [];

    // Hàm public để lấy trạng thái hiện tại (bản sao)
    function getState() {
        return { ..._state };
    }

    // Hàm public để cập nhật trạng thái
    function updateState(newState) {
        Object.assign(_state, newState);
        console.log('Trạng thái đã cập nhật:', _state);
        // Thông báo cho tất cả các listener
        _listeners.forEach(listener => listener());
    }

    // Hàm public để các thành phần khác "lắng nghe" sự thay đổi
    function subscribe(listener) {
        _listeners.push(listener);
    }

    return {
        getState,
        updateState,
        subscribe
    };
})();

## Bước 4: Bộ render Giao diện - spa/render.js
Module này có nhiệm vụ fetch HTML từ thư mục pages và hiển thị nó.
**File**: *spa/render.js*
window.App = window.App || {};
App.spa = App.spa || {};

App.spa.render = (function() {
    const root = document.getElementById('app-root');

    async function renderPage(pageName) {
        if (!pageName) {
            root.innerHTML = '<h1>Lỗi: Không tìm thấy trang</h1>';
            return;
        }

        try {
            const response = await fetch(`/pages/app/${pageName}.html`);
            if (!response.ok) throw new Error('Không tìm thấy file trang.');
            
            const html = await response.text();
            root.innerHTML = html;
            
            // Sau khi render, chạy hàm "mount" của trang đó nếu có
            if (App.pages && typeof App.pages[pageName] === 'function') {
                App.pages[pageName]();
            }

        } catch (error) {
            console.error('Lỗi render trang:', error);
            root.innerHTML = '<h1>404 - Không tìm thấy trang</h1>';
        }
    }

    return {
        renderPage
    };
})();

## Bước 5: "Bộ não" Định tuyến - spa/router.js
Module này kết nối URL với hành động render.
**File**: *spa/router.js*
window.App = window.App || {};
App.spa = App.spa || {};

App.spa.router = (function() {
    const { renderPage } = App.spa.render;

    const routes = {
        '/': 'home',
        '/about': 'about',
        '/products': 'products'
    };

    function handleLocation() {
        const path = window.location.pathname;
        const pageName = routes[path] || '404'; // Mặc định là trang 404
        renderPage(pageName);
    }

    function navigate(event) {
        // Chỉ xử lý nếu click vào link SPA
        if (!event.target.matches('a[data-spa]')) {
            return;
        }
        event.preventDefault();
        const href = event.target.getAttribute('href');
        window.history.pushState({}, '', href);
        handleLocation();
    }
    
    function init() {
        // Lắng nghe sự kiện click trên toàn bộ document
        document.addEventListener('click', navigate);
        // Xử lý khi người dùng dùng nút back/forward của trình duyệt
        window.addEventListener('popstate', handleLocation);
        // Xử lý khi trang được tải lần đầu
        document.addEventListener('DOMContentLoaded', handleLocation);
    }

    return {
        init,
        handleLocation // Expose để có thể gọi từ bên ngoài nếu cần
    };
})();

## Bước 6: Các hàm sau khi render - Logic cho từng trang
Để làm cho trang có tính tương tác, chúng ta cần các file JS tương ứng cho mỗi trang.
**File**: *pages/app/home.js*
window.App = window.App || {};
App.pages = App.pages || {};

// Hàm này sẽ được gọi bởi render.js sau khi HTML của trang chủ được chèn vào DOM
App.pages.home = function() {
    console.log('Trang chủ đã được mount!');
    const stateService = App.services.state;

    const button = document.getElementById('test-button');
    const countSpan = document.getElementById('click-count');

    // Hàm để render lại phần giao diện phụ thuộc vào state
    function render() {
        countSpan.textContent = stateService.getState().clickCount;
    }

    // Gắn sự kiện
    button.addEventListener('click', () => {
        const currentCount = stateService.getState().clickCount;
        stateService.updateState({ clickCount: currentCount + 1 });
    });

    // Lắng nghe sự thay đổi state và render lại
    stateService.subscribe(render);

    // Render lần đầu
    render();
};

## Bước 7: "Nhạc trưởng" - loader.js và app.js
Cuối cùng, chúng ta cần một file để khởi tạo tất cả.
**File**: *loader.js (ở thư mục gốc)*
(function() {
    const SCRIPTS = [
        // Services
        '/services/state.js',
        // SPA Core
        '/spa/render.js',
        '/spa/router.js',
        // Page-specific logic
        '/pages/app/home.js',
        // Main App Initializer (tải cuối cùng)
        '/app.js'
    ];

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function initialize() {
        for (const src of SCRIPTS) {
            await loadScript(src);
        }
        // Gọi hàm init toàn cục sau khi tất cả script đã tải
        if (window.App && typeof window.App.init === 'function') {
            window.App.init();
        }
    }

    initialize();
})();

**File**: *app.js (ở thư mục gốc)*
window.App = window.App || {};

App.init = function() {
    console.log('Ứng dụng đang khởi tạo...');
    App.spa.router.init(); // Khởi chạy router
};

## Bước 8: Run
Bây giờ, khi bạn chạy npx http-server và mở trình duyệt, bạn sẽ có một ứng dụng SPA cơ bản:

# 2. Intialize SPA - Admin

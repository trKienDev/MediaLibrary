(function() {
    console.log("Admin loader is running...");

    const SCRIPTS = [
        // Các services và utils dùng chung
        '/services/state.service.js',
        
        // Bộ khung SPA dùng chung
        // Chú ý: Cần chỉnh sửa render.js và router.js để chúng hoạt động được cho cả admin
        '/spa/render.spa.js', 
        '/spa/router.spa.js',

        // Các thành phần và trang dành riêng cho admin
        '/pages/admin/dashboard/dashboard.js', // Logic cho trang dashboard

        // File khởi tạo chính cho admin (tải cuối cùng)
        '/app.admin.js' 
    ];

    // Hàm loadScript giữ nguyên như trong loader.js cũ
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => { console.log(`Loaded: ${src}`); resolve(); };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function initializeAdmin() {
        for (const src of SCRIPTS) {
            await loadScript(src);
        }
        if (window.App && typeof window.App.initAdmin === 'function') {
            window.App.initAdmin();
        }
    }

    initializeAdmin();
})();
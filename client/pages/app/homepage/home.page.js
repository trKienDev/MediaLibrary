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
function showToast(message, type='info', duration = 3000) {
      const container = document.getElementById('toast-container');
      if(!container) return;

      // Tạo các phần tử của toast
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;

      const icon = getToastIcon(type);
      const text = document.createElement('span');
      text.textContent = message;

      toast.appendChild(icon);
      toast.appendChild(text);

      // thêm toast vào container
      container.appendChild(toast);

      // Thêm class 'show' để kích hoạt animation đi vào
    // Dùng setTimeout nhỏ để đảm bảo trình duyệt nhận diện được sự thay đổi class
      setTimeout(() => {
            toast.classList.add('show');
      }, 10); 

      // Hẹn giờ để xóa toast
      setTimeout(() => {
            // Thêm class 'hide' để kích hoạt animation đi ra
            toast.classList.remove('show');
            toast.classList.add('hide');

            // Xóa hẳn toast khỏi DOM sau khi animation kết thúc
            toast.addEventListener('transitionend', () => {
            toast.remove();
            });
      }, duration);
}

function getToastIcon(type) {
      const icon = document.createElement('i');
      icon.classList.add('toast-icon');

      switch(type) {
            case 'success':
                  icon.classList.add('fa-solid', 'fa-circle-check');
                  break;
            case 'warning':
                  icon.classList.add('fa-solid', 'fa-triangle-exclamation');
                  break;
            case 'error':
                  icon.classList.add('fa-solid', 'fa-circle-xmark');
                  break;
            case 'info':
            default:
                  icon.classList.add('fa-solid', 'fa-circle-info');
                  break;
      }

      return icon;
}
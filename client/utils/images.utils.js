export function addEffectHoverToZoomImage(container_element, image_element) {
      if (!(container_element instanceof HTMLElement) || container_element.tagName !== 'DIV') {
            console.error('Error: container_element is not DIV HTML.');
            // showToast('Error add effect hover to zoom image', 'error');
            return; 
      }
      if (!(image_element instanceof HTMLElement) || image_element.tagName !== 'IMG') {
            console.error('Error: image_element is not IMG HTML');
            return; 
      }

      container_element.classList.add('hover-wrapper-zoom-img');
      image_element.classList.add('hover-to-zoom-img');
}

export function handleUploadImage(imageElementId, fileInputElementId) {
      const imageEl = document.getElementById(imageElementId);
      const fileInput = document.getElementById(fileInputElementId);

      if(!imageEl || !fileInput) {
            console.error("Invalid element Ids provided");
            alert('error uploading image');
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      imageEl.addEventListener("click", () => {
            fileInput.click();
      });

      fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if(file) {
                  if(!allowedTypes.includes(file.type)) {
                        alert("Please select a valid image file (jpg, png, gif).");
                        return;
                  }
            }

            if(window.FileReader) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                        imageEl.src = e.target.result;
                  };
                  reader.readAsDataURL(file);
            } else {
                  alert("Your browser does not support file preview.");
            }
      });
}

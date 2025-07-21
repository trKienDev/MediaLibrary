export function replaceSpacesWithUnderscore(string) {
      return string.replace(/\s+/g, '_');
}
export function removeSpaces(string) {
      return string.replace(/\s/g, ''); 
}

export function removeAccents(string) {
      return string.toLowerCase() // 1. Chuyển thành chữ thường
                  .normalize('NFD') // 2. Tách ký tự và dấu
                  .replace(/[\u0300-\u036f]/g, '') // 3. Xóa bỏ các dấu
                  .replace(/\s/g, ''); // 4. Xóa bỏ khoảng trắng
}


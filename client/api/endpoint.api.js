/**
 * Tạo một hàm xây dựng URL an toàn cho các endpoint cần tham số.
 * @param {string} path - Mẫu đường dẫn, ví dụ: '/api/films/:id'
 * @returns {function(...args): string} - Một hàm nhận các tham số và trả về URL hoàn chỉnh.
*/

const createEndpoint = (path) => (...args) => {
      let i = 0;
      return path.replace(/:[a-zA-Z_]+/g, () => args[i++] || '');
};

const apiEnpoint = {
      films: {
            getAll: '/films', // GET
      },
      tags: {
            getAll: '/api/tags', // GET
            getByFilm: createEndpoint('/api/tags/film/:filmId'), // GET
            getByCreator: createEndpoint('/api/tags/creator/:creatorId'), // GET
            admin: {
                  create: '/admin/tag', // POST
            },
      },
}
export default apiEnpoint;
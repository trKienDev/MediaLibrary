const apiEndpoint = {
      collections: {
            getAll: 'api/collections', 
            getById: '/api/collection', 
      }, 
      creators: {
            getAll: '/api/creators',
            getById: '/api/creator',
            create: '/api/creator', // post
            update: '/api/creator', //  put
            delete: '/api/creator', // delete
      },
      films: {
            getById: '/api/film',
            getRandomizePagination: '/api/films/unique-pagination',
            getByCreator: '/api/films/creator',
      },
      homepageFeeds: 'api/feeds/section',
      idols: {
            getById: '/api/idol',
      },
      tags: {
            getById: '/api/tag',
      },
      playlist: {
            getById: '/api/playlist',
      },
      videos: {
            getById: '/api/video',
            getUniquePagination: '/api/videos/unique-pagination',
            getByCreator: '/api/videos/creator',
            increaseViewsByOne: '/api/video/views',
      },
}
export default apiEndpoint;
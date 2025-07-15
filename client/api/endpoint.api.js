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
            increaseViewsByOne: '/api/video/views',
      },
}
export default apiEndpoint;
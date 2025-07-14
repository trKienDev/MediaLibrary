const apiEndpoint = {
      collections: {
            getAll: 'api/collections',
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
      }

}
export default apiEndpoint;
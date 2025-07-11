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
      homepageFeeds: 'api/hompage-feeds',
      films: {
            getById: '/api/film',
      }
}
export default apiEndpoint;
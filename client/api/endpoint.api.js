const apiEndpoint = {
      anime_videos: {
            getUniquePagination: '/api/anime-videos/unique-pagination',
      },
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
      idols: {
            getById: '/api/idol',
      },
      images: {
            getRandomPagination: '/api/images/random-pagination',
      },
      homepageFeeds: 'api/feeds/section',
      mangas: {
            getRandomizePagination: '/api/mangas/random-pagination',
      },
      tags: {
            getById: '/api/tag',
      },
      playlist: {
            getById: '/api/playlist',
      },
      shorts: {
            getRandomPagination: '/api/shorts/random-pagination',
      },
      videos: {
            getById: '/api/video',
            getUniquePagination: '/api/videos/unique-pagination',
            getByCreator: '/api/videos/creator',
            increaseViewsByOne: '/api/video/views',
      },
}
export default apiEndpoint;
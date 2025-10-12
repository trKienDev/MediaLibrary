const apiEndpoint = {
      anime_videos: {
            getUniquePagination: '/api/anime-videos/unique-pagination',
            getById: '/api/anime-video',
      },
      anime_films: {
            getById: '/api/anime-film',
      },
      anime_studios: {
            getById: '/api/anime-studio',
      },
      anime_series: {
            getById: '/api/anime-series'
      },
      codes: {
            getAll: '/api/codes',
            create: '/api/code',
            getByStudio: '/api/codes/studio'
      },
      collections: {
            getAll: '/api/collections', 
            getById: '/api/collection', 
      }, 
      creators: {
            getAll: '/api/creators',
            getById: '/api/creator',
            create: '/api/creator', // post
            update: '/api/creator', //  put
            delete: '/api/creator', // delete
      },
      clips: {
            getAll: '/api/clips/all',
            getUniquePagination: '/api/clips/unique-pagination',
            getByIdol: '/api/clips/idol',
            getById: '/api/clips',
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
            getByIdolId: '/api/images/idol',
      },
      homepageFeeds: 'api/feeds/section',
      mangas: {
            getRandomizePagination: '/api/mangas/random-pagination',
      },
      tags: {
            getById: '/api/tag',
            getAll: '/api/tags',
            create: '/api/tag', 
            getByScopes: '/api/tags/scopes',
      },
      playlist: {
            getById: '/api/playlist',
      },
      shorts: {
            getByIdolId: '/api/shorts/idol',
            getRandomPagination: '/api/shorts/random-pagination',
      },
      studios: {
            getAll: '/api/studios',
            getById: '/api/studio',
            create: '/api/studio',
      },
      videos: {
            getById: '/api/video',
            getUniquePagination: '/api/videos/unique-pagination',
            getByCreator: '/api/videos/creator',
            increaseViewsByOne: '/api/video/views',
      },
      records: {
            getAll: '/api/records',
            getById: '/api/record',
            getByIdolId: '/api/records/idol',
      }
}
export default apiEndpoint;
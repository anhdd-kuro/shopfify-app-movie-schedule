export {}
declare global {
  type Movie = {
    handle: string
    title: string
    description: string
    releaseDate: string
    publication_end_date: string
    original_title: string
    original_showtime_year: string
    country_of_production: string
    lens: string
    rated: string
    length: string
    director: string
    stars: string
    thumbnail: {
      image: {
        url: string
        altText: string
      }
    }
  }
}

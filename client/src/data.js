export const heroImage = '/images/hero-cabin.png';
const properties = [
  ['The Woodland Retreat', 'Hunza', 'Cabins', 18500, 4, 2, 'Ali'],
  ['A Little Closer to the Sky', 'Skardu', 'Mountains', 14200, 3, 1, 'Ayesha'],
  ['The Sunlit City Apartment', 'Islamabad', 'City stays', 9800, 2, 1, 'Zain'],
  ['Palm House by the Water', 'Karachi', 'Beachfront', 24000, 6, 3, 'Hassan'],
  ['A Frame, A Forest, A Pause', 'Murree', 'Cabins', 16500, 4, 2, 'Noor'],
  ['The Courtyard Residence', 'Lahore', 'Countryside', 12800, 5, 2, 'Fatima'],
];
export const initialListings = properties.map(([title, location, category, price, guests, bedrooms, host], i) => ({
  id: String(i + 1), title, location, category, price, guests, bedrooms, host,
  country: 'Pakistan', image: `/images/stay-${i + 1}.jpg`,
  description: 'Slow mornings, fresh air, and a little space to reconnect. This thoughtfully furnished retreat brings you closer to the things that matter, with a comfortable living area, inviting interiors, and room to unwind. Settle in with a book, explore the surrounding area, and make yourself at home.',
  reviews: i === 0 ? [
    { id: 'r1', author: 'Sara', rating: 5, comment: 'A beautiful, peaceful place. We loved the quiet mornings and welcoming atmosphere.' },
    { id: 'r2', author: 'Hamza', rating: 4, comment: 'Comfortable rooms and a thoughtful host. Would happily visit again.' },
  ] : [],
}));
export const formatPrice = value => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value);
export const getRating = reviews => reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : null;

// Nepal cities and districts for autocomplete
export const nepalDestinations = [
  // Major Cities
  'Kathmandu',
  'Pokhara',
  'Lalitpur',
  'Bhaktapur',
  'Biratnagar',
  'Birgunj',
  'Dharan',
  'Butwal',
  'Hetauda',
  'Janakpur',
  'Itahari',
  'Nepalgunj',
  'Bharatpur',
  'Dhangadhi',
  'Tikapur',
  
  // Districts (Province 1)
  'Bhojpur',
  'Dhankuta',
  'Ilam',
  'Jhapa',
  'Khotang',
  'Morang',
  'Okhaldhunga',
  'Panchthar',
  'Sankhuwasabha',
  'Solukhumbu',
  'Sunsari',
  'Taplejung',
  'Terhathum',
  'Udayapur',
  
  // Districts (Province 2)
  'Bara',
  'Dhanusha',
  'Mahottari',
  'Parsa',
  'Rautahat',
  'Saptari',
  'Sarlahi',
  'Siraha',
  
  // Districts (Bagmati Province)
  'Chitwan',
  'Dhading',
  'Dolakha',
  'Kavrepalanchok',
  'Makwanpur',
  'Nuwakot',
  'Ramechhap',
  'Rasuwa',
  'Sindhuli',
  'Sindhupalchok',
  
  // Districts (Gandaki Province)
  'Baglung',
  'Gorkha',
  'Kaski',
  'Lamjung',
  'Manang',
  'Mustang',
  'Myagdi',
  'Nawalpur',
  'Parbat',
  'Syangja',
  'Tanahun',
  
  // Districts (Lumbini Province)
  'Arghakhanchi',
  'Banke',
  'Bardiya',
  'Dang',
  'Gulmi',
  'Kapilvastu',
  'Palpa',
  'Parasi',
  'Pyuthan',
  'Rolpa',
  'Rukum',
  'Rupandehi',
  
  // Districts (Karnali Province)
  'Dailekh',
  'Dolpa',
  'Humla',
  'Jajarkot',
  'Jumla',
  'Kalikot',
  'Mugu',
  'Rukum',
  'Salyan',
  'Surkhet',
  
  // Districts (Sudurpashchim Province)
  'Achham',
  'Baitadi',
  'Bajhang',
  'Bajura',
  'Dadeldhura',
  'Darchula',
  'Doti',
  'Kailali',
  'Kanchanpur'
];

// Function to filter destinations based on search query
export const searchDestinations = (query) => {
  if (!query || query.length < 2) return [];
  
  const lowerQuery = query.toLowerCase();
  return nepalDestinations.filter(dest => 
    dest.toLowerCase().includes(lowerQuery)
  ).slice(0, 10); // Return top 10 matches
};


// Nepal Provinces (States) for autocomplete
export const nepalProvinces = [
  'Province 1',
  'Province 2 (Madhesh)',
  'Bagmati Province',
  'Gandaki Province',
  'Lumbini Province',
  'Karnali Province',
  'Sudurpashchim Province'
];

// Function to filter provinces based on search query
export const searchProvinces = (query) => {
  if (!query) return nepalProvinces;
  const lowerQuery = query.toLowerCase();
  return nepalProvinces.filter(province =>
    province.toLowerCase().includes(lowerQuery)
  );
};


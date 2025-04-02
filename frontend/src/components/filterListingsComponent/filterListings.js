/**
 * One function that handles the filtering so its easy to ship it over to diff pages
 * @param {Array} listings 
 * @param {Object} filters 
 * @returns {Array} 
 */
export const filterListings = (listings, filters) => {
    return listings.filter((car) => {
      if (filters.make && car.make !== filters.make) return false;
      if (filters.model && car.model !== filters.model) return false;
  
      const price = parseFloat((car.price || "").toString().replace(",", ""));
      if (filters.priceMin && price < filters.priceMin) return false;
      if (filters.priceMax && price > filters.priceMax) return false;
  
      const mileage = parseFloat((car.mileage || "").toString().replace(",", ""));
      if (filters.mileageMin && mileage < filters.mileageMin) return false;
      if (filters.mileageMax && mileage > filters.mileageMax) return false;
  
      const year = parseInt(car.year);
      if (filters.yearMin && year < parseInt(filters.yearMin)) return false;
      if (filters.yearMax && year > parseInt(filters.yearMax)) return false;
  
      return true;
    });
  };
  
export default filterListings;
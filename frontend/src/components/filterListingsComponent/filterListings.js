/**
 * File:         filterListings.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 15th, 2025
 * Description:  Provides a utility function to filter an array of car listing objects
 *               based on a given set of filter criteria (make, model, price range,
 *               mileage range, year range).
 */

/**
 * Filters an array of listing objects based on provided criteria.
 * Handles parsing of price/mileage strings and compares against min/max values.
 * @param {Array<object>} listings - The array of listing objects to filter. Each object should have keys like make, model, price, mileage, year.
 * @param {object} filters - An object containing the filter criteria (e.g., { make: 'BMW', priceMax: 50000 }).
 * @param {string} [filters.make] - Filter by car make.
 * @param {string} [filters.model] - Filter by car model.
 * @param {number} [filters.priceMin] - Minimum price filter.
 * @param {number} [filters.priceMax] - Maximum price filter.
 * @param {number} [filters.mileageMin] - Minimum mileage filter.
 * @param {number} [filters.mileageMax] - Maximum mileage filter.
 * @param {number|string} [filters.yearMin] - Minimum year filter.
 * @param {number|string} [filters.yearMax] - Maximum year filter.
 * @returns {Array<object>} A new array containing only the listings that match the filter criteria.
 */
const filterListings = (listings, filters) => {
  return listings.filter((car) => {

    const mileage = parseFloat((car.mileage || "").toString().replace(",", ""));
    const price = parseFloat((car.price || "").toString().replace(",", ""));
    const year = parseInt(car.year);
    
    if (filters.make && car.make !== filters.make) {
      return false;
    }
    if (filters.model && car.model !== filters.model) {
      return false;
    }
    if (filters.priceMin && price < filters.priceMin) {
      return false;
    }
    if (filters.priceMax && price > filters.priceMax) {
      return false;
    }
    if (filters.mileageMin && mileage < filters.mileageMin) {
      return false;
    }
    if (filters.mileageMax && mileage > filters.mileageMax) {
      return false;
    }
    if (filters.yearMin && year < filters.yearMin) {
      return false;
    }
    if (filters.yearMax && year > filters.yearMax) {
      return false;
    }
    if (filters.transmission && car.transmission !== filters.transmission){
      return false;
    }
    if (filters.driveType && car.driveType !== filters.driveType) {
      return false;
    }
    if (filters.exteriorColor && car.exteriorColor !== filters.exteriorColor) {
      return false;
    }
    if (filters.fuelType && car.fuelType !== filters.fuelType) {
      return false;
    }
    if (filters.bodyType && car.bodyType !== filters.bodyType) {
      return false;
    }
    if (filters.province && car.province !== filters.province) {
      return false;
    }
    if (filters.city && car.city?.toLowerCase().indexOf(filters.city.toLowerCase()) === -1) {
      return false;
    }

    return true;
  });
};

export default filterListings;

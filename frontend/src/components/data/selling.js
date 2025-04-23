/**
 * File:         selling.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 10th, 2025
 * Description:  Provides helper data and functions related to vehicle listings,
 *               specifically for the selling/creation process. Includes a mapping
 *               of car makes to models and a function to generate year options.
*/

// Simple data structure for Make -> Models mapping
const carModelsByMake = {
    Audi: ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'R8', 'RS3', 'RS5', 'RS6', 'RS7', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'TT', 'e-tron'],
    BMW: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'i3', 'i4', 'i5', 'i7', 'i8', 'iX', 'M2', 'M3', 'M4', 'M5', 'M6', 'M8', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4'],
    'Mercedes-Benz': ['A-Class', 'B-Class', 'C-Class', 'CLA', 'CLS', 'E-Class', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'G-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'S-Class', 'SL', 'SLC', 'AMG GT'],
    Porsche: ['718 Boxster', '718 Cayman', '911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
    Volkswagen: ['Arteon', 'Atlas', 'Golf', 'GTI', 'ID.4', 'Jetta', 'Passat', 'Taos', 'Tiguan', 'Touareg'],
};


/**
 * Returns an array of models for a given make.
 * @param {string} make - The selected car make.
 * @returns {string[]} - An array of model names or an empty array.
 */
export const getModelsForMake = (make) => {
    return carModelsByMake[make] || [];
};

/**
 * Generates a list of years from current year + 1 down to a minimum year.
 * @param {number} [startYear=1900] - The oldest year to include.
 * @returns {number[]} - An array of years.
 */
export const getYearOptions = (startYear = 1900) => {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 1; // Allow listing for next year's models
    const years = [];
    for (let year = endYear; year >= startYear; year--) {
        years.push(year);
    }
    return years;
};
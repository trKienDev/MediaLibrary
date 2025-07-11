/**
 * Format a Date object to 'dd-mm-yyyy'
 * @param {Date} date 
 * @returns {string|null}
*/
export const formatDate = (date) => {
      if(!(date instanceof Date) || isNaN(date)) return null;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() +  1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
};

/**
 * Calculate age from birth year
 * @param {number|string} birthYear 
 * @returns {number|null}
*/
export const calculateAgeFromBirthYear = (birthYear) => {
      const year = parseInt(birthYear, 10);
      if(isNaN(year)) return null;
      const currentYear = new Date().getFullYear();
      return currentYear - year;
}

/**
 * Calculate absolute year difference between two year strings
 * @param {string} yearStrA 
 * @param {string} yearStrB 
 * @returns {number|null}
*/
export const calculateYearDiff = (yearStrA, yearStrB) => {
      const yearA = parseInt(yearStrA.slice(0, 4), 10);
      const yearB = parseInt(yearStrB.slice(0, 4), 10);
      if(isNaN(yearA) || isNaN(yearB)) return null;
      return Math.abs(yearA - yearB);
}
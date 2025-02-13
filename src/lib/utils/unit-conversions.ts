export function cubicFeetToCubicMeters(cubicFeet: number) {
   return (cubicFeet * 0.0283168).toFixed(2); // Convert cubic feet to cubic meters
}
export function inchesToCentimeters(inches: number) {
   return (inches * 2.54).toFixed(2); // Convert inches to centimeters
}
export function cubicMetersToCubicFeet(cubicMeters: number) {
   return (cubicMeters * 35.3147).toFixed(2); // 1 cubic meter = 35.3147 cubic feet
}
export function centimetersToInches(centimeters: number) {
   return (centimeters * 0.393701).toFixed(2); // 1 cm = 0.393701 inches
}
export function kilometersToMiles(km: number): number {
   const MILES_PER_KILOMETER = 0.621371;
   return km * MILES_PER_KILOMETER;
}
export function milesToKilometers(mi: number): number {
   const KILOMETERS_PER_MILE = 1.60934;
   return mi * KILOMETERS_PER_MILE;
}

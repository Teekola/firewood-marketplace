// Define a TypeScript interface to represent the postal code information
export interface PostalCodeInfo {
   // countryCode: string;
   postalCode: string;
   placeName: string;
   // adminName1: string;
   // adminCode1: string;
   // adminName2: string;
   // adminCode2: string;
   // adminName3: string;
   // adminCode3: string;
   latitude: number;
   longitude: number;
   // accuracy: number;
}

/**
 * Reads a file containing postal code data and parses it into an array of PostalCodeInfo.
 * @param filePath - Path to the tab-delimited text file.
 * @returns An array of PostalCodeInfo objects.
 */
export function parsePostalCodeFile(fileContent: string): PostalCodeInfo[] {
   const lines = fileContent.split(/\r?\n/).filter((line) => line.trim() !== "");

   const postalCodeData: PostalCodeInfo[] = lines.map((line) => {
      const fields = line.split("\t");

      return {
         // countryCode: fields[0],
         postalCode: fields[1],
         placeName: fields[2],
         // adminName1: fields[3],
         // adminCode1: fields[4],
         // adminName2: fields[5],
         // adminCode2: fields[6],
         // adminName3: fields[7],
         // adminCode3: fields[8],
         latitude: parseFloat(fields[9]),
         longitude: parseFloat(fields[10]),
         // accuracy: parseInt(fields[11], 10),
      };
   });
   return postalCodeData;
}

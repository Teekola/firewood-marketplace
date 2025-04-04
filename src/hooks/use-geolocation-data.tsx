"use client";

import { useEffect, useState } from "react";

import { UnitSystem } from "@prisma/client";

const defaultGeolocationData = {
   preferredUnitSystem: UnitSystem.METRIC,
   country: "FI",
};

// Gets the correct unit system based on geolocation and uses other default values
// Caches the data in local storage
export function useGeolocationData() {
   const [geolocationData, setGeolocationData] = useState(defaultGeolocationData);

   useEffect(() => {
      const storedData = localStorage.getItem("geolocationData");
      if (storedData) {
         setGeolocationData(JSON.parse(storedData));
         return;
      }
      (async () => {
         // TODO: Add error handling
         const getPreferredUnitSystem = await fetch(
            "/api/auth/get-geolocation-data",
            { cache: "no-store" } // this cannot be cached as it needs to read the headers always
         );
         const { preferredUnitSystem, country } = await getPreferredUnitSystem.json();

         setGeolocationData((prev) => {
            const newData = { ...prev, preferredUnitSystem, country };
            localStorage.setItem("geolocationData", JSON.stringify(newData)); // Cache for future use
            return newData;
         });
      })();
   }, []);
   return geolocationData;
}

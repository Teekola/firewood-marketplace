"use server";

import { deactivateSellerById } from "@/app/db/seller";
import { getAuthorizedSeller } from "@/auth/auth";

export async function deactivateSeller() {
   const { seller } = await getAuthorizedSeller();
   const count = await deactivateSellerById(seller.id);
   return count;
}

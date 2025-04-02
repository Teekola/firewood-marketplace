"use server";

import { getAuthorizedSeller } from "@/auth/auth";
import { deactivateSellerById } from "@/db/seller";

export async function deactivateSeller() {
   const { seller } = await getAuthorizedSeller();
   const count = await deactivateSellerById(seller.id);
   return count;
}

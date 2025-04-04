"use server";

import { deactivateSellerById } from "@/db/seller";
import { getAuthorizedSeller } from "@/lib/auth/auth";

export async function deactivateSeller() {
   const { seller } = await getAuthorizedSeller();
   const count = await deactivateSellerById(seller.id);
   return count;
}

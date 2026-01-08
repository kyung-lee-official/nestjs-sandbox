import type { StoreCustomer } from "@medusajs/types";
import type { SetOptional } from "@repo/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CustomerContent = SetOptional<
  StoreCustomer,
  "default_billing_address_id" | "default_shipping_address_id"
>;
type AuthState = {
  isSignedIn: boolean;
  customerInfo: CustomerContent | null;
  hasHydrated: boolean;
};

type AuthActions = {
  setAuth: (customerInfo: CustomerContent) => void;
  updateCustomerInfo: (partial: Partial<CustomerContent>) => void;
  signOut: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      isSignedIn: false,
      customerInfo: null,
      hasHydrated: false,
      setAuth: (customerInfo: CustomerContent) =>
        set({
          isSignedIn: true,
          customerInfo,
        }),
      updateCustomerInfo: (partial) =>
        set((state) => ({
          customerInfo: state.customerInfo
            ? { ...state.customerInfo, ...partial }
            : null,
        })),
      signOut: () =>
        set({
          isSignedIn: false,
          customerInfo: null,
        }),
      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
    }),
    {
      name: "medusa-auth-storage", // name of the item in the storage
    },
  ),
);

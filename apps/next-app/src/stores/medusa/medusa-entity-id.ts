import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type MState = {
  cartId: string | null;
  regionId: string | null;
  hasHydrated: boolean;
};

type MActions = {
  setCartId: (cartId: string) => void;
  setRegionId: (regionId: string) => void;
  clearCartId: () => void;
  clearRegionId: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useMIdStore = create<MState & MActions>()(
  devtools(
    persist(
      (set) => ({
        cartId: null,
        regionId: null,
        hasHydrated: false,
        setCartId: (cartId: string) => set({ cartId }),
        setRegionId: (regionId: string) => set({ regionId }),
        clearCartId: () => set({ cartId: null }),
        clearRegionId: () => set({ regionId: null }),
        setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
      }),
      {
        name: "medusa-entity-id-storage", // name of the item in the storage
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
    {
      name: "MIdStore", // name of the store in devtools
    },
  ),
);

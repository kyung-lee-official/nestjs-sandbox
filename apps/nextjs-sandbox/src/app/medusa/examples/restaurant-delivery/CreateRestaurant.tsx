"use client";

import { useMutation } from "@tanstack/react-query";
import { createRestaurant } from "./api";

const CreateRestaurant = () => {
  const createRestaurantMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      handle: string;
      address: string;
      phone: string;
      email: string;
    }) => {
      const res = await createRestaurant(data);
      return res;
    },
  });

  return (
    <div>
      <h2>Create Restaurant</h2>
      <form
        className="flex flex-col gap-2 max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = formData.get("name") as string;
          const handle = formData.get("handle") as string;
          const address = formData.get("address") as string;
          const phone = formData.get("phone") as string;
          const email = formData.get("email") as string;
          createRestaurantMutation.mutate({
            name,
            handle,
            address,
            phone,
            email,
          });
        }}
      >
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={"Acme"}
        />

        <label htmlFor="handle">Handle:</label>
        <input
          type="text"
          id="handle"
          name="handle"
          required
          defaultValue={"acme"}
        />

        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          required
          defaultValue={"123 Main St"}
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          defaultValue={"(123) 456-7890"}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          defaultValue={"acme@restaurant.com"}
        />

        <button type="submit" className="underline decoration-dotted">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateRestaurant;

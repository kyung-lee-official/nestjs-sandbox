"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/app/styles/modal/click-listener-in-a-modal/Modal";
import { addAddressToCustomer, CustomerQK } from "../api";

type AddressFormData = {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  postal_code: string;
  province?: string;
  country_code: string;
  phone?: string;
};

type AddAddressProps = {
  customerId: string;
};

export const AddAddress = (props: AddAddressProps) => {
  const { customerId } = props;
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    defaultValues: {
      first_name: "Jane",
      last_name: "Smith",
      company: "",
      address_1: "456 Elm St",
      address_2: "",
      city: "Los Angeles",
      postal_code: "90001",
      province: "",
      country_code: "us",
      phone: "",
    },
  });

  const addAddressMutation = useMutation({
    mutationFn: async (addressData: AddressFormData) => {
      const res = await addAddressToCustomer(customerId, addressData);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CustomerQK.GET_CUSTOMER_BY_ID, customerId],
      });
      setShowModal(false);
      reset();
    },
    onError: (error) => {
      console.error("Error adding address:", error);
    },
  });

  const onSubmit = (data: AddressFormData) => {
    addAddressMutation.mutate(data);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setShowModal(false);
      reset();
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Add New Address
      </button>

      <Modal show={showModal} setShow={setShowModal}>
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              Add New Address
            </h2>
            <button
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                First Name *
              </label>
              <input
                type="text"
                {...register("first_name", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters",
                  },
                })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.first_name && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                {...register("last_name", {
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters",
                  },
                })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.last_name && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>

            {/* Address 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Address Line 1 *
              </label>
              <input
                type="text"
                {...register("address_1", {
                  required: "Address is required",
                })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.address_1 && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.address_1.message}
                </p>
              )}
            </div>

            {/* City and Postal Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  {...register("city", {
                    required: "City is required",
                  })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.city && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  {...register("postal_code", {
                    required: "Postal code is required",
                  })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.postal_code && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.postal_code.message}
                  </p>
                )}
              </div>
            </div>

            {/* Province/State and Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Province/State
                </label>
                <input
                  type="text"
                  {...register("province")}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Country Code*
                </label>
                <input
                  type="text"
                  {...register("country_code", {
                    required: "Country is required",
                  })}
                  placeholder="e.g., us"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.country_code && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.country_code.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                {...register("phone")}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add Address"}
              </button>
            </div>

            {/* Error Display */}
            {addAddressMutation.isError && (
              <div className="text-red-400 text-sm mt-2">
                Failed to add address. Please try again.
              </div>
            )}
          </form>
        </div>
      </Modal>
    </>
  );
};

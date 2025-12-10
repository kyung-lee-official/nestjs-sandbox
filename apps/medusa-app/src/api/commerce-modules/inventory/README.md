# Inventory Reservations

The `reserved_quantity` is automatically managed by Medusa's inventory system.

According to the Inventory Module in Medusa Flows, when an order is placed, the Medusa application automatically creates a reservation item for each product variant with `manage_inventory` set to `true`.

The [Inventory concepts guide](https://docs.medusajs.com/resources/commerce-modules/inventory/concepts#inventorylevel) explains that `reserved_quantity` is "the quantity reserved from the available `stocked_quantity`. This quantity is still in stock but unavailable when checking if an item is available."

1. Order Placement: When an order is placed, Medusa creates reservation items automatically

1. Order Fulfillment: According to the Order Fulfillment flow, when an item is fulfilled, Medusa:
    - Subtracts the `reserved_quantity` from the stocked_quantity
    - Resets the `reserved_quantity` to 0
    - Deletes the associated reservation item

While Medusa handles reservations automatically, you can also [manually create reservations](https://docs.medusajs.com/user-guide/inventory/reservations#create-a-reservation) through the Admin dashboard for custom use cases. For example, you might reserve inventory for an offline sale or a customer request.

However, the [Reservations guide](https://docs.medusajs.com/user-guide/inventory/reservations#what-is-a-reservation) notes that "Medusa automatically creates reservations for inventory items whose variants are purchased. This ensures that the inventory item is not sold to another customer while the order is being processed."

So in typical commerce operations, you should let Medusa manage the `reserved_quantity` automatically through its built-in workflows.

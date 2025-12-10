type CartItemsProps = {
  items: any[];
};

export const CartItems = (props: CartItemsProps) => {
  const { items } = props;
  return (
    <div>
      {items && items.length > 0 ? (
        items.map((item: any) => {
          return (
            <div
              key={item.id}
              className="pb-2
												border-b border-dotted"
            >
              <span>Product Title: {item.product_title}</span>
              <div className="flex justify-between">
                <span>Variant Title: {item.variant_title}</span>
                <span>
                  Unit Price: {item.currency_code} {item.unit_price}
                </span>
              </div>
              <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
            </div>
          );
        })
      ) : (
        <div className="text-gray-500">No items in cart</div>
      )}
    </div>
  );
};

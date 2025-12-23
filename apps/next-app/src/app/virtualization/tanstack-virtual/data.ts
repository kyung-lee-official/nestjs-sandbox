export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  /* Added type to distinguish rows */
  type: "product" | "categorySummary";
  /* For category summary rows */
  summaryText?: string;
  manufacturer?: string;
  rating?: number;
  releaseDate?: string;
  extraInfo?: string;
  longDescription?: string;
};

const LONG_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod. 
Suspendisse potenti. Proin ac neque nec nisi dictum cursus. Etiam euismod, nisi eu consectetur consectetur, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod. 
Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. 
Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Nulla porttitor accumsan tincidunt. 
Cras ultricies ligula sed magna dictum porta. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. 
Sed porttitor lectus nibh. Vivamus suscipit tortor eget felis porttitor volutpat.`;

export const makeData = (len: number): Product[] => {
  const data: Product[] = [];
  const categories = [
    "Electronics",
    "Books",
    "Clothing",
    "Food",
    "Home Goods",
    "Sports",
  ];
  const manufacturers = [
    "Acme Corp",
    "Globex",
    "Soylent",
    "Initech",
    "Umbrella",
    "Stark Industries",
  ];
  for (let i = 0; i < len; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const manufacturer =
      manufacturers[Math.floor(Math.random() * manufacturers.length)];
    data.push({
      id: i,
      name: `Product ${i}`,
      category: category!,
      price: parseFloat((Math.random() * 100).toFixed(2)),
      stock: Math.floor(Math.random() * 500),
      type: "product",
      manufacturer,
      rating: parseFloat((Math.random() * 5).toFixed(2)),
      releaseDate: `20${10 + (i % 15)}-${(1 + (i % 12))
        .toString()
        .padStart(2, "0")}-${(1 + (i % 28)).toString().padStart(2, "0")}`,
      extraInfo: `Extra info for product ${i}`,
      longDescription: LONG_TEXT,
    });

    if (i > 0 && i % 10 === 0) {
      data.push({
        id: i + 0.5,
        name: "",
        category: category!,
        price: 0,
        stock: 0,
        type: "categorySummary",
        summaryText: `Category Summary for '${category}' (items ${
          i - 9
        } to ${i})`,
        manufacturer: "",
        rating: 0,
        releaseDate: "",
        extraInfo: "",
        longDescription: "",
      });
    }
  }
  return data;
};

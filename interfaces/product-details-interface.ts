export default interface ProductDetailsTypes {
  image: string;
  gst_hsn_code: string;
  currency_symbol: string;
  category: string;
  description: string;
  name: string;
  slide_img: string[];
  status: string;
  mrp_price: number;
  display_tag: string[];
  short_description: string;
  oem_part_number: string | null;
  in_stock_status: boolean;
  slug: string;
  price: number;
  brand_img: string | null;
  disabled: number;
  features: any[]; // Update with a specific type if features have a known structure
  attributes: any[]; // Update with a specific type if attributes have a known structure
  variant_of: string;
  min_order_qty: number;
  item_name: string;
  brand: string | null;
  rating: number;
  image_url: string;
  prod_specifications: any[]; // Update with a specific type if specifications have a known structure
  variants: any[]; // Update with a specific type if variants have a known structure
  is_template: boolean;
  product_attributes: {
    [key: string]: string; // Represents key-value pairs of attributes
  };
  thumbnail_images: string[];
}

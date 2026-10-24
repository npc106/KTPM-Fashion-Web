export type ProductCategory = "NEW" | "CLOTHING" | "ACCESSORIES";

export interface MockProduct {
  id: string;
  category: ProductCategory;
  name: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
  price: number;
  image: string;
  colors: string[];
  sizes: string[];
  badge?: "NEW" | "BEST_SELLER";
}

export const mockProducts: MockProduct[] = [
  {
    id: "linen-set",
    category: "CLOTHING",
    name: { vi: "Bộ linen thanh lịch", en: "Refined linen set" },
    description: {
      vi: "Thiết kế thoáng nhẹ cho những ngày cần một vẻ ngoài chỉn chu.",
      en: "A lightweight, polished set for days that call for effortless elegance.",
    },
    price: 890000,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
    colors: ["#d8c5ad", "#263c35"],
    sizes: ["S", "M", "L"],
    badge: "BEST_SELLER",
  },
  {
    id: "silk-blouse",
    category: "NEW",
    name: { vi: "Áo lụa cổ đổ", en: "Cowl neck silk blouse" },
    description: {
      vi: "Chất liệu mềm rủ, dễ kết hợp cho cả ngày làm việc và buổi tối.",
      en: "A fluid silhouette that moves from workday to evening with ease.",
    },
    price: 620000,
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
    colors: ["#eee8df", "#876b5d", "#1f302b"],
    sizes: ["S", "M", "L", "XL"],
    badge: "NEW",
  },
  {
    id: "tailored-blazer",
    category: "CLOTHING",
    name: { vi: "Blazer dáng chuẩn", en: "Tailored everyday blazer" },
    description: {
      vi: "Đường cắt gọn gàng, tạo lớp layer hoàn hảo cho tủ đồ hiện đại.",
      en: "A clean cut that adds the perfect layer to a modern wardrobe.",
    },
    price: 1250000,
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=900&q=85",
    colors: ["#303d3a", "#b9a48c"],
    sizes: ["S", "M", "L"],
  },
  {
    id: "leather-bag",
    category: "ACCESSORIES",
    name: { vi: "Túi da Everyday", en: "Everyday leather bag" },
    description: {
      vi: "Ngăn chứa tiện dụng với phom dáng tối giản, bền đẹp theo thời gian.",
      en: "A practical interior and timeless shape made for everyday movement.",
    },
    price: 990000,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
    colors: ["#4b3027", "#d6c1a5"],
    sizes: ["ONE SIZE"],
    badge: "BEST_SELLER",
  },
  {
    id: "wide-leg-trousers",
    category: "NEW",
    name: { vi: "Quần suông cạp cao", en: "High-waist wide-leg trousers" },
    description: {
      vi: "Phom quần tôn dáng với chất vải đứng vừa đủ và thoải mái.",
      en: "A flattering silhouette with just the right amount of structure.",
    },
    price: 740000,
    image:
      "https://images.unsplash.com/photo-1506629905607-d9d6adf5cda4?auto=format&fit=crop&w=900&q=85",
    colors: ["#202d29", "#e4d7c5"],
    sizes: ["S", "M", "L"],
    badge: "NEW",
  },
  {
    id: "gold-hoops",
    category: "ACCESSORIES",
    name: { vi: "Khuyên tai Halo", en: "Halo gold hoops" },
    description: {
      vi: "Điểm nhấn nhỏ cho diện mạo hàng ngày, nhẹ và dễ đeo.",
      en: "A lightweight everyday accent that completes any look.",
    },
    price: 280000,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85",
    colors: ["#c7a45d"],
    sizes: ["ONE SIZE"],
  },
];

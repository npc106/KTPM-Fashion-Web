import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  mockProducts,
  type MockProduct,
  type ProductCategory,
} from "./catalog.mock";

interface CartItem {
  product: MockProduct;
  quantity: number;
  size: string;
}

interface CatalogPageProps {
  onLogout: () => void;
}

type Screen = "products" | "detail" | "orders";

const categoryKeys: Array<ProductCategory | "ALL"> = [
  "ALL",
  "NEW",
  "CLOTHING",
  "ACCESSORIES",
];

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
}

function ProductVisual({ product }: { product: MockProduct }) {
  const symbol =
    product.category === "ACCESSORIES"
      ? "▱"
      : product.id.includes("trousers")
        ? "♧"
        : "♢";
  return (
    <div
      className={`product-visual visual-${product.category.toLowerCase()}`}
      aria-label={product.name.vi}
    >
      {symbol}
    </div>
  );
}

function CatalogPage({ onLogout }: CatalogPageProps) {
  const { t, i18n } = useTranslation();
  const [screen, setScreen] = useState<Screen>("products");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory | "ALL">("ALL");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MockProduct>();
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(2);
  const [showCart, setShowCart] = useState(false);
  const locale = i18n.language === "en" ? "en" : "vi";

  const products = useMemo(
    () =>
      mockProducts.filter((product) => {
        const name = product.name[locale].toLowerCase();
        return (
          (category === "ALL" || product.category === category) &&
          (!query || name.includes(query.toLowerCase()))
        );
      }),
    [category, locale, query],
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  );

  function categoryLabel(value: ProductCategory | "ALL") {
    return {
      ALL: t("allProducts"),
      NEW: t("newArrivals"),
      CLOTHING: t("clothing"),
      ACCESSORIES: t("accessories"),
    }[value];
  }

  function openProduct(product: MockProduct) {
    setSelectedProduct(product);
    setSelectedSize(product.sizes.includes("M") ? "M" : product.sizes[0]);
    setQuantity(2);
    setScreen("detail");
  }

  function addToCart(
    product: MockProduct,
    amount = quantity,
    size = selectedSize,
  ) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id && item.size === size,
      );
      if (existing)
        return current.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + amount }
            : item,
        );
      return [...current, { product, quantity: amount, size }];
    });
    setScreen("products");
  }

  function toggleLanguage() {
    const next = locale === "vi" ? "en" : "vi";
    void i18n.changeLanguage(next);
    localStorage.setItem("language", next);
    document.documentElement.lang = next;
  }

  function updateQuantity(index: number, delta: number) {
    setCart((current) =>
      current
        .map((item, itemIndex) =>
          itemIndex === index
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  return (
    <main className="reference-shop">
      <header className="reference-header">
        <button
          className="reference-logo"
          type="button"
          onClick={() => setScreen("products")}
        >
          <span>♢</span> Tên Shop
        </button>
        <label className="reference-search">
          <span>⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search")}
          />
        </label>
        <div className="reference-actions">
          <button
            className="language-switch"
            type="button"
            onClick={toggleLanguage}
          >
            <b>{locale === "vi" ? "VI" : "EN"}</b>
            <span>{locale === "vi" ? "EN" : "VI"}</span>
          </button>
          <button
            className="reference-icon"
            type="button"
            onClick={() => setShowCart(true)}
          >
            ♧<i>{cartCount}</i>
          </button>
          <button className="profile-icon" type="button" onClick={onLogout}>
            ♙
          </button>
        </div>
      </header>

      {screen === "products" && (
        <section className="reference-content">
          <div className="reference-breadcrumb">
            Trang chủ / Quần áo &amp; Phụ kiện
          </div>
          <div className="reference-title-row">
            <div>
              <h1>Quần áo &amp; Phụ kiện</h1>
              <p>Hiển thị {products.length} sản phẩm</p>
            </div>
            <label>
              Sắp xếp{" "}
              <select>
                <option>Mới nhất</option>
                <option>Giá thấp đến cao</option>
              </select>
            </label>
          </div>
          <div className="catalog-layout">
            <aside className="filter-panel">
              <strong>Giá</strong>
              <label>
                <input type="radio" name="price" /> Dưới 300.000đ
              </label>
              <label>
                <input type="radio" name="price" defaultChecked /> 300.000đ -
                600.000đ
              </label>
              <label>
                <input type="radio" name="price" /> Trên 600.000đ
              </label>
              <strong>Size</strong>
              <div className="filter-sizes">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    className={size === "M" ? "active" : ""}
                    type="button"
                    key={size}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <strong>Màu</strong>
              <div className="filter-colors">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <strong>Loại</strong>
              {categoryKeys.slice(1).map((value) => (
                <label key={value}>
                  <input
                    type="checkbox"
                    checked={category === value}
                    onChange={() =>
                      setCategory(category === value ? "ALL" : value)
                    }
                  />{" "}
                  {categoryLabel(value)}
                </label>
              ))}
            </aside>
            <div className="reference-grid">
              {products.map((product) => (
                <article className="reference-card" key={product.id}>
                  <button
                    className="reference-card-image"
                    type="button"
                    onClick={() => openProduct(product)}
                  >
                    <ProductVisual product={product} />
                  </button>
                  <div className="reference-card-body">
                    <h2>{product.name[locale]}</h2>
                    <strong>{formatPrice(product.price)}</strong>
                    <button type="button" onClick={() => openProduct(product)}>
                      {t("viewDetails")} →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {screen === "detail" && selectedProduct && (
        <section className="reference-content detail-page">
          <div className="reference-breadcrumb">
            Quần áo &amp; Phụ kiện / Áo / {selectedProduct.name[locale]}
          </div>
          <div className="detail-layout">
            <div className="detail-card">
              <ProductVisual product={selectedProduct} />
              <div className="detail-thumbs">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="detail-info">
              <span className="category-chip">
                {categoryLabel(selectedProduct.category)}
              </span>
              <h1>{selectedProduct.name[locale]}</h1>
              <strong className="detail-price">
                {formatPrice(selectedProduct.price)}
              </strong>
              <p>{selectedProduct.description[locale]}</p>
              <label>
                Size
                <select
                  value={selectedSize}
                  onChange={(event) => setSelectedSize(event.target.value)}
                >
                  {selectedProduct.sizes.map((size) => (
                    <option key={size}>{size}</option>
                  ))}
                </select>
              </label>
              <label>
                Màu
                <div className="detail-colors">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </label>
              <label>
                Số lượng
                <div className="stepper">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </label>
              <button
                className="primary-reference-button"
                type="button"
                onClick={() => addToCart(selectedProduct)}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
            <CartSummary
              cart={cart}
              subtotal={subtotal}
              updateQuantity={updateQuantity}
              onCheckout={() => setShowCart(true)}
            />
          </div>
        </section>
      )}

      {screen === "orders" && <OrdersPage />}

      <nav className="reference-bottom-nav">
        <button
          className={screen === "products" ? "active" : ""}
          type="button"
          onClick={() => setScreen("products")}
        >
          Quần áo &amp; Phụ kiện
        </button>
        <button type="button" onClick={() => setScreen("orders")}>
          Đơn hàng của tôi
        </button>
        <button type="button" onClick={() => setShowCart(true)}>
          Giỏ hàng ({cartCount})
        </button>
      </nav>

      {showCart && (
        <div
          className="reference-drawer-backdrop"
          onClick={() => setShowCart(false)}
        >
          <aside
            className="reference-cart-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <CartSummary
              cart={cart}
              subtotal={subtotal}
              updateQuantity={updateQuantity}
              onCheckout={() => setShowCart(false)}
            />
          </aside>
        </div>
      )}
    </main>
  );
}

function CartSummary({
  cart,
  subtotal,
  updateQuantity,
  onCheckout,
}: {
  cart: CartItem[];
  subtotal: number;
  updateQuantity: (index: number, delta: number) => void;
  onCheckout: () => void;
}) {
  return (
    <aside className="reference-cart">
      <div className="cart-heading">
        <h2>Giỏ hàng</h2>
        <b>{cart.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</b>
      </div>
      {cart.length === 0 ? (
        <p className="cart-empty">Giỏ hàng đang trống.</p>
      ) : (
        cart.map((item, index) => (
          <div
            className="reference-cart-item"
            key={`${item.product.id}-${item.size}`}
          >
            <ProductVisual product={item.product} />
            <div>
              <h3>{item.product.name.vi}</h3>
              <p>Size {item.size} · Đen</p>
              <strong>{formatPrice(item.product.price * item.quantity)}</strong>
              <div className="mini-stepper">
                <button type="button" onClick={() => updateQuantity(index, -1)}>
                  −
                </button>
                {item.quantity}
                <button type="button" onClick={() => updateQuantity(index, 1)}>
                  +
                </button>
              </div>
            </div>
          </div>
        ))
      )}
      <div className="cart-total">
        <span>Tạm tính</span>
        <strong>{formatPrice(subtotal)}</strong>
      </div>
      <small>Phí vận chuyển được tính ở bước thanh toán.</small>
      <button
        className="primary-reference-button"
        type="button"
        onClick={onCheckout}
      >
        Tiến hành thanh toán
      </button>
    </aside>
  );
}

function OrdersPage() {
  return (
    <section className="reference-content orders-page">
      <div className="reference-title-row">
        <div>
          <h1>
            Đơn hàng của tôi <span className="customer-chip">Khách hàng</span>
          </h1>
          <p>Lịch sử và trạng thái các đơn hàng của bạn</p>
        </div>
      </div>
      <div className="order-cards">
        {[
          ["#DH0006", "12/10/2026", "1.147.000đ", "Chờ xử lý"],
          ["#DH0004", "05/10/2026", "429.000đ", "Đang giao"],
          ["#DH0001", "28/09/2026", "608.000đ", "Hoàn tất"],
        ].map((order) => (
          <article key={order[0]}>
            <div>
              <b>{order[0]}</b>
              <span>{order[3]}</span>
            </div>
            <p>{order[1]} · 2 sản phẩm</p>
            <strong>{order[2]}</strong>
            <button type="button">Xem chi tiết</button>
          </article>
        ))}
      </div>
      <h2 className="admin-heading">
        Quản lý đơn hàng <span>Quản trị viên</span>
      </h2>
      <div className="admin-stats">
        <b>
          Tổng đơn<strong>6</strong>
        </b>
        <b>
          Chờ xử lý<strong>2</strong>
        </b>
        <b>
          Đang giao<strong>1</strong>
        </b>
        <b>
          Doanh thu đơn hoàn tất<strong>867.000đ</strong>
        </b>
      </div>
    </section>
  );
}

export default CatalogPage;

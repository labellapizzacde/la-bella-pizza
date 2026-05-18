import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ShoppingCart, Search, Plus, Minus, Trash2, MessageCircle, Menu, X,
  MapPin, Store, Truck, CreditCard, Banknote, QrCode, ArrowLeft, Tag,
  User, Phone, Mail, FileText
} from "lucide-react";
import "./style.css";

const WHATSAPP_NUMBER = "5493804135499";
const STORE_NAME = "La Bella Pizza";
const STORE_SUBTITLE = "Pizzas · Bebidas · Dulces · Promos";
const deliveryFee = 15000;

const products = [
  {
    id: 1,
    name: "Pizza Mozzarella",
    category: "Pizzas",
    price: 35000,
    description: "Pizza clasica con salsa de tomate, mozzarella y oregano.",
    badge: "Clasica",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=900&auto=format&fit=crop",
    extras: [
      { id: "borde", name: "Borde relleno", price: 10000 },
      { id: "extra-queso", name: "Extra queso", price: 8000 },
      { id: "catupiry", name: "Catupiry", price: 10000 },
    ],
  },
  {
    id: 2,
    name: "Pizza Calabresa",
    category: "Pizzas",
    price: 45000,
    description: "Pizza con mozzarella, calabresa, cebolla y oregano.",
    badge: "Mas pedida",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=900&auto=format&fit=crop",
    extras: [
      { id: "borde", name: "Borde relleno", price: 10000 },
      { id: "extra-queso", name: "Extra queso", price: 8000 },
      { id: "aceituna", name: "Aceitunas", price: 5000 },
    ],
  },
  {
    id: 3,
    name: "Pizza Portuguesa",
    category: "Pizzas",
    price: 50000,
    description: "Mozzarella, jamon, huevo, cebolla, morron y aceitunas.",
    badge: "Completa",
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=900&auto=format&fit=crop",
    extras: [
      { id: "borde", name: "Borde relleno", price: 10000 },
      { id: "extra-queso", name: "Extra queso", price: 8000 },
      { id: "extra-jamon", name: "Extra jamon", price: 7000 },
    ],
  },
  {
    id: 4,
    name: "Pizza Pollo con Catupiry",
    category: "Pizzas",
    price: 55000,
    description: "Pollo desmenuzado, mozzarella, catupiry y oregano.",
    badge: "Especial",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=900&auto=format&fit=crop",
    extras: [
      { id: "borde", name: "Borde relleno", price: 10000 },
      { id: "extra-catupiry", name: "Extra catupiry", price: 10000 },
      { id: "extra-pollo", name: "Extra pollo", price: 10000 },
    ],
  },
  {
    id: 5,
    name: "Pizza Chocolate",
    category: "Pizzas Dulces",
    price: 40000,
    description: "Pizza dulce con chocolate cremoso y cobertura especial.",
    badge: "Dulce",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=900&auto=format&fit=crop",
    extras: [
      { id: "frutilla", name: "Frutilla", price: 10000 },
      { id: "leche-condensada", name: "Leche condensada", price: 5000 },
      { id: "granulado", name: "Granulado", price: 3000 },
    ],
  },
  {
    id: 6,
    name: "Pizza Banana con Canela",
    category: "Pizzas Dulces",
    price: 38000,
    description: "Pizza dulce con banana, canela, azucar y mozzarella suave.",
    badge: "Casera",
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?q=80&w=900&auto=format&fit=crop",
    extras: [
      { id: "leche-condensada", name: "Leche condensada", price: 5000 },
      { id: "chocolate", name: "Chocolate extra", price: 8000 },
    ],
  },
  {
    id: 7,
    name: "Coca-Cola 1L",
    category: "Bebidas",
    price: 12000,
    description: "Bebida fria para acompanar tu pizza.",
    badge: "Bebida",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=900&auto=format&fit=crop",
    extras: [],
  },
  {
    id: 8,
    name: "Combo Pizza + Bebida",
    category: "Promos",
    price: 60000,
    description: "Una pizza seleccionada + bebida. Ideal para compartir.",
    badge: "Promo",
    image: "https://images.unsplash.com/photo-1613564834361-9436948817d1?q=80&w=900&auto=format&fit=crop",
    extras: [
      { id: "borde", name: "Borde relleno", price: 10000 },
      { id: "extra-queso", name: "Extra queso", price: 8000 },
    ],
  },
];

const categories = ["Todos", "Pizzas", "Pizzas Dulces", "Bebidas", "Promos"];

function formatPrice(value) {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0,
  }).format(value);
}

function uniqueCartKey(productId, selectedExtras) {
  const extraIds = selectedExtras.map((extra) => extra.id).sort().join("-");
  return `${productId}-${extraIds || "sin-extras"}`;
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("transferencia");
  const [coupon, setCoupon] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    document: "",
    address: "",
    reference: "",
    timeSlot: "",
    notes: "",
    locationLink: "",
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
      const matchesQuery = `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, query]);

  const subtotal = cart.reduce((sum, item) => sum + item.unitTotal * item.quantity, 0);
  const shipping = deliveryMethod === "delivery" && cart.length > 0 ? deliveryFee : 0;
  const discount = coupon.trim().toUpperCase() === "BELLA10" ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function openProduct(product) {
    setSelectedProduct(product);
    setProductQuantity(1);
    setSelectedExtras([]);
  }

  function toggleExtra(extra) {
    setSelectedExtras((current) => {
      const exists = current.some((item) => item.id === extra.id);
      if (exists) return current.filter((item) => item.id !== extra.id);
      return [...current, extra];
    });
  }

  function addSelectedProductToCart() {
    if (!selectedProduct) return;
    const key = uniqueCartKey(selectedProduct.id, selectedExtras);
    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    const unitTotal = selectedProduct.price + extrasTotal;

    setCart((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) => item.key === key ? { ...item, quantity: item.quantity + productQuantity } : item);
      }
      return [
        ...current,
        {
          key,
          productId: selectedProduct.id,
          name: selectedProduct.name,
          category: selectedProduct.category,
          image: selectedProduct.image,
          price: selectedProduct.price,
          extras: selectedExtras,
          unitTotal,
          quantity: productQuantity,
        },
      ];
    });

    setSelectedProduct(null);
    setCartOpen(true);
    setCheckoutStep("cart");
  }

  function increaseCartItem(key) {
    setCart((current) => current.map((item) => item.key === key ? { ...item, quantity: item.quantity + 1 } : item));
  }

  function decreaseCartItem(key) {
    setCart((current) => current.map((item) => item.key === key ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item).filter((item) => item.quantity > 0));
  }

  function removeFromCart(key) {
    setCart((current) => current.filter((item) => item.key !== key));
  }

  function updateCustomer(field, value) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  function createWhatsAppLink() {
    const productLines = cart.map((item) => {
      const extras = item.extras.length
        ? `%0A   Extras: ${item.extras.map((extra) => `${extra.name} (${formatPrice(extra.price)})`).join(", ")}`
        : "";
      return `• ${item.name} x${item.quantity} - ${formatPrice(item.unitTotal * item.quantity)}${extras}`;
    });

    const deliveryText = deliveryMethod === "delivery" ? "Delivery" : "Retiro en local";
    const paymentLabels = {
      transferencia: "Transferencia bancaria",
      efectivo: "Efectivo",
      qr: "QR / Bancard manual",
    };

    const message = `Hola, quiero hacer este pedido en ${STORE_NAME}:%0A%0A${productLines.join("%0A%0A")}%0A%0ASubtotal: ${formatPrice(subtotal)}%0AEnvio: ${formatPrice(shipping)}%0ADescuento: ${formatPrice(discount)}%0ATotal: ${formatPrice(total)}%0A%0AEntrega: ${deliveryText}%0APago: ${paymentLabels[paymentMethod]}%0A%0ADatos:%0ANombre: ${customer.name || "-"}%0ATelefono: ${customer.phone || "-"}%0AEmail: ${customer.email || "-"}%0ACI/RUC: ${customer.document || "-"}%0ADireccion: ${customer.address || "-"}%0AUbicacion: ${customer.locationLink || "-"}%0AReferencia: ${customer.reference || "-"}%0AFranja horaria: ${customer.timeSlot || "-"}%0ANotas: ${customer.notes || "-"}`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  }

  return (
    <div>
      <header className="topbar">
        <button className="iconBtn" onClick={() => setMenuOpen(true)}><Menu /></button>
        <div className="brand">
          <h1>{STORE_NAME}</h1>
          <p>{STORE_SUBTITLE}</p>
        </div>
        <button className="iconBtn cartIcon" onClick={() => { setCartOpen(true); setCheckoutStep("cart"); }}>
          <ShoppingCart />
          {cartCount > 0 && <span>{cartCount}</span>}
        </button>
      </header>

      <main className="container">
        <section className="searchBox">
          <Search className="searchIcon" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar producto..." />
          <button><Search /></button>
        </section>

        <section className="hero">
          <div>
            <strong>PROMOCION</strong>
            <h2>Especiales del Dia</h2>
            <p>Combos, ofertas y productos destacados para vender mas rapido.</p>
          </div>
          <div className="priceBubble">
            <small>desde</small>
            <b>Gs. 66 MIL</b>
          </div>
        </section>

        <section className="categories">
          {categories.map((category) => (
            <button key={category} onClick={() => setSelectedCategory(category)} className={selectedCategory === category ? "active" : ""}>
              {category}
            </button>
          ))}
        </section>

        <section>
          <div className="sectionTitle"><h2>Especiales del Dia</h2></div>
          <div className="grid">
            {filteredProducts.map((product) => (
              <article className="productCard" key={product.id}>
                <button className="imageBtn" onClick={() => openProduct(product)}>
                  <img src={product.image} alt={product.name} />
                  <span>{product.badge}</span>
                </button>
                <div className="productInfo">
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>
                  <b>{formatPrice(product.price)}</b>
                  <button onClick={() => openProduct(product)}>Anadir al carrito</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {menuOpen && (
        <div className="overlay">
          <div className="sideMenu">
            <button className="closeBtn" onClick={() => setMenuOpen(false)}><X /></button>
            <h3>Categorias</h3>
            {categories.filter((item) => item !== "Todos").map((category) => (
              <button key={category} onClick={() => { setSelectedCategory(category); setMenuOpen(false); }}>{category}</button>
            ))}
            <h3>Acerca de</h3>
            <p>Menu</p>
            <p>Nosotros</p>
            <p>Contacto</p>
            <p>Trabaja con Nosotros</p>
          </div>
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          quantity={productQuantity}
          setQuantity={setProductQuantity}
          selectedExtras={selectedExtras}
          toggleExtra={toggleExtra}
          onClose={() => setSelectedProduct(null)}
          onAdd={addSelectedProductToCart}
        />
      )}

      {cartOpen && (
        <CheckoutPanel
          cart={cart}
          cartCount={cartCount}
          checkoutStep={checkoutStep}
          setCheckoutStep={setCheckoutStep}
          setCartOpen={setCartOpen}
          increaseCartItem={increaseCartItem}
          decreaseCartItem={decreaseCartItem}
          removeFromCart={removeFromCart}
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          total={total}
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          customer={customer}
          updateCustomer={updateCustomer}
          coupon={coupon}
          setCoupon={setCoupon}
          createWhatsAppLink={createWhatsAppLink}
        />
      )}
    </div>
  );
}

function ProductModal({ product, quantity, setQuantity, selectedExtras, toggleExtra, onClose, onAdd }) {
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const total = (product.price + extrasTotal) * quantity;

  return (
    <div className="modalBackdrop">
      <div className="productModal">
        <button onClick={onClose} className="closeFloating"><X /></button>
        <div className="modalScroll">
          <img src={product.image} alt={product.name} className="modalImage" />
          <h2>{product.name}</h2>
          <h4>{formatPrice(product.price)}</h4>
          <p><strong>Imagen de referencia.</strong> {product.description}</p>

          {product.extras?.length > 0 && (
            <div className="extras">
              <h3>Opciones Extra</h3>
              <p>Elegi adicionales para este producto.</p>
              {product.extras.map((extra) => {
                const active = selectedExtras.some((item) => item.id === extra.id);
                return (
                  <button key={extra.id} onClick={() => toggleExtra(extra)} className={active ? "selected" : ""}>
                    <span>+ {extra.name}</span>
                    <b>+ {formatPrice(extra.price)}</b>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="modalBottom">
          <div className="qtyControl">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus /></button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}><Plus /></button>
          </div>
          <button className="mainBtn" onClick={onAdd}>Anadir · {formatPrice(total)}</button>
        </div>
      </div>
    </div>
  );
}

function CheckoutPanel(props) {
  const {
    cart, cartCount, checkoutStep, setCheckoutStep, setCartOpen,
    increaseCartItem, decreaseCartItem, removeFromCart,
    subtotal, shipping, discount, total, deliveryMethod, setDeliveryMethod,
    paymentMethod, setPaymentMethod, customer, updateCustomer,
    coupon, setCoupon, createWhatsAppLink
  } = props;

  function goBack() {
    if (checkoutStep === "cart") setCartOpen(false);
    if (checkoutStep === "delivery") setCheckoutStep("cart");
    if (checkoutStep === "details") setCheckoutStep("delivery");
    if (checkoutStep === "payment") setCheckoutStep("details");
  }

  return (
    <div className="modalBackdrop">
      <aside className="checkout">
        <div className="checkoutHeader">
          <button onClick={goBack}>{checkoutStep === "cart" ? <X /> : <ArrowLeft />}</button>
          <div>
            <h2>
              {checkoutStep === "cart" && "Tu Pedido"}
              {checkoutStep === "delivery" && "Como deseas recibir tu pedido?"}
              {checkoutStep === "details" && "Datos de entrega"}
              {checkoutStep === "payment" && "Informacion de Pago"}
            </h2>
            <p>{cartCount} producto(s) · {formatPrice(total)}</p>
          </div>
          <div />
        </div>

        <div className="checkoutBody">
          {checkoutStep === "cart" && (
            <CartStep
              cart={cart}
              increaseCartItem={increaseCartItem}
              decreaseCartItem={decreaseCartItem}
              removeFromCart={removeFromCart}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              coupon={coupon}
              setCoupon={setCoupon}
              goNext={() => setCheckoutStep("delivery")}
            />
          )}

          {checkoutStep === "delivery" && (
            <DeliveryStep
              deliveryMethod={deliveryMethod}
              setDeliveryMethod={setDeliveryMethod}
              goNext={() => setCheckoutStep("details")}
            />
          )}

          {checkoutStep === "details" && (
            <DetailsStep
              deliveryMethod={deliveryMethod}
              customer={customer}
              updateCustomer={updateCustomer}
              goNext={() => setCheckoutStep("payment")}
            />
          )}

          {checkoutStep === "payment" && (
            <PaymentStep
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              createWhatsAppLink={createWhatsAppLink}
            />
          )}
        </div>
      </aside>
    </div>
  );
}

function CartStep({ cart, increaseCartItem, decreaseCartItem, removeFromCart, subtotal, shipping, discount, total, coupon, setCoupon, goNext }) {
  if (cart.length === 0) {
    return (
      <div className="emptyCart">
        <ShoppingCart />
        <h3>Tu carrito esta vacio</h3>
        <p>Agrega productos para continuar.</p>
      </div>
    );
  }

  return (
    <div className="cartList">
      {cart.map((item) => (
        <div className="cartItem" key={item.key}>
          <div className="cartTop">
            <img src={item.image} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              {item.extras.length > 0 && <p>Extras: {item.extras.map((extra) => extra.name).join(", ")}</p>}
              <b>{formatPrice(item.unitTotal)}</b>
            </div>
            <button onClick={() => removeFromCart(item.key)}><Trash2 /></button>
          </div>
          <div className="cartBottom">
            <div className="qtyControl small">
              <button onClick={() => decreaseCartItem(item.key)}><Minus /></button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseCartItem(item.key)}><Plus /></button>
            </div>
            <strong>{formatPrice(item.unitTotal * item.quantity)}</strong>
          </div>
        </div>
      ))}

      <div className="coupon">
        <Tag />
        <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Aplicar codigo promocional" />
        <small>Prueba: BELLA10</small>
      </div>

      <Summary subtotal={subtotal} shipping={shipping} discount={discount} total={total} />

      <button onClick={goNext} className="mainBtn full">Finalizar compra</button>
    </div>
  );
}

function DeliveryStep({ deliveryMethod, setDeliveryMethod, goNext }) {
  return (
    <div className="deliveryStep">
      <p>Elige una opcion para continuar al checkout.</p>
      <button onClick={() => setDeliveryMethod("delivery")} className={deliveryMethod === "delivery" ? "selected" : ""}>
        <Truck />
        <h3>Delivery</h3>
        <p>Envio a domicilio</p>
      </button>
      <button onClick={() => setDeliveryMethod("pickup")} className={deliveryMethod === "pickup" ? "selected" : ""}>
        <Store />
        <h3>Retiro en local</h3>
        <p>Recoge en nuestro local</p>
      </button>
      <button onClick={goNext} className="mainBtn full">Continuar</button>
    </div>
  );
}

function DetailsStep({ deliveryMethod, customer, updateCustomer, goNext }) {
  function detectLocation() {
    if (!navigator.geolocation) {
      alert("Tu navegador no permite detectar ubicacion.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const link = `https://www.google.com/maps?q=${lat},${lng}`;
        updateCustomer("locationLink", link);
        alert("Ubicacion detectada correctamente.");
      },
      () => {
        alert("No se pudo detectar la ubicacion. Revisa los permisos del navegador.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  return (
    <div className="detailsStep">
      {deliveryMethod === "delivery" && (
        <div>
          <button type="button" onClick={detectLocation} className="outlineBtn"><MapPin /> Detectar mi ubicacion</button>

          {customer.locationLink && (
            <a className="locationLink" href={customer.locationLink} target="_blank" rel="noreferrer">
              Ubicacion detectada: abrir en Google Maps
            </a>
          )}

          <div className="fakeMap">
            {customer.locationLink
              ? "Ubicacion detectada. El link ira en el pedido de WhatsApp."
              : "Toca el boton para detectar la ubicacion del cliente."}
          </div>
        </div>
      )}

      <h3>Informacion De Contacto</h3>
      <Input icon={<Mail />} placeholder="Direccion de correo electronico" value={customer.email} onChange={(value) => updateCustomer("email", value)} />
      <Input icon={<Phone />} placeholder="Telefono" value={customer.phone} onChange={(value) => updateCustomer("phone", value)} />
      <Input icon={<User />} placeholder="Nombre y Apellido" value={customer.name} onChange={(value) => updateCustomer("name", value)} />

      <h3>La facturacion & Envio</h3>
      <Input icon={<FileText />} placeholder="C.I o RUC" value={customer.document} onChange={(value) => updateCustomer("document", value)} />
      {deliveryMethod === "delivery" && (
        <>
          <Input icon={<MapPin />} placeholder="Direccion de entrega" value={customer.address} onChange={(value) => updateCustomer("address", value)} />
          <Input placeholder="Referencia de entrega" value={customer.reference} onChange={(value) => updateCustomer("reference", value)} />
        </>
      )}
      <select value={customer.timeSlot} onChange={(e) => updateCustomer("timeSlot", e.target.value)}>
        <option value="">Por favor, elige una franja horaria...</option>
        <option value="Ahora / lo antes posible">Ahora / lo antes posible</option>
        <option value="Manana">Manana</option>
        <option value="Tarde">Tarde</option>
        <option value="Noche">Noche</option>
      </select>

      <h3>Informacion adicional</h3>
      <textarea value={customer.notes} onChange={(e) => updateCustomer("notes", e.target.value)} placeholder="Notas sobre tu pedido." />

      <button onClick={goNext} className="mainBtn full">Continuar al pago</button>
    </div>
  );
}

function PaymentStep({ paymentMethod, setPaymentMethod, subtotal, shipping, discount, total, createWhatsAppLink }) {
  return (
    <div className="paymentStep">
      <Summary subtotal={subtotal} shipping={shipping} discount={discount} total={total} />
      <PaymentOption active={paymentMethod === "transferencia"} onClick={() => setPaymentMethod("transferencia")} icon={<CreditCard />} title="Transferencia bancaria" description="El pedido llega por WhatsApp y luego confirmas el comprobante." />
      <PaymentOption active={paymentMethod === "qr"} onClick={() => setPaymentMethod("qr")} icon={<QrCode />} title="QR / Bancard manual" description="Podes enviar el QR despues de confirmar el pedido." />
      <PaymentOption active={paymentMethod === "efectivo"} onClick={() => setPaymentMethod("efectivo")} icon={<Banknote />} title="Efectivo" description="Pago al recibir o al retirar en local." />
      <a href={createWhatsAppLink()} target="_blank" rel="noreferrer">
        <button className="mainBtn full"><MessageCircle /> Enviar pedido por WhatsApp</button>
      </a>
    </div>
  );
}

function PaymentOption({ active, onClick, icon, title, description }) {
  return (
    <button onClick={onClick} className={active ? "payOption active" : "payOption"}>
      <span>{icon}</span>
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </button>
  );
}

function Summary({ subtotal, shipping, discount, total }) {
  return (
    <div className="summary">
      <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
      <div><span>Gastos de envio</span><strong>{formatPrice(shipping)}</strong></div>
      <div><span>Descuento</span><strong>{formatPrice(discount)}</strong></div>
      <div className="total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
    </div>
  );
}

function Input({ icon, placeholder, value, onChange }) {
  return (
    <div className="inputWrap">
      {icon}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

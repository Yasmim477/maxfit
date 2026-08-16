"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { FALLBACK_PRODUCTS, type Category, type Product } from "./catalog";

declare global {
  interface Window {
    __MAXFIT_ASSETS__?: Record<string, string>;
  }
}

const assetUrl = (path: string) => {
  const normalizedPath = path.replace(/^\//, "");
  if (typeof window !== "undefined" && window.__MAXFIT_ASSETS__?.[normalizedPath]) {
    return window.__MAXFIT_ASSETS__[normalizedPath];
  }
  const assetBase = typeof window !== "undefined" && window.location.pathname.startsWith("/maxfit") ? "/maxfit" : "";
  return `${assetBase}/${normalizedPath}`;
};

type CartState = Record<number, number>;

const CATEGORY_OPTIONS = ["Todos", "Proteínas", "Performance", "Saúde", "Acessórios", "Snacks"] as const;
const formatMoney = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const fallbackImage = (category: Category) => ({
  "Proteínas": "assets/images/maxfit-whey-prime.webp",
  "Performance": "assets/images/maxfit-recovery.webp",
  "Saúde": "assets/images/maxfit-multi-daily.webp",
  "Acessórios": "assets/images/maxfit-gear.webp",
  "Snacks": "assets/images/maxfit-snacks.webp",
})[category];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></>,
    cart: <><path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 7H6"/><circle cx="10" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    x: <><path d="m6 6 12 12M18 6 6 18"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    minus: <path d="M5 12h14"/>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
    truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></>,
    shield: <><path d="M12 3 5 6v5c0 4.7 2.8 8.1 7 10 4.2-1.9 7-5.3 7-10V6z"/><path d="m9 12 2 2 4-4"/></>,
    headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H5a1 1 0 0 1-1-1zM20 14h-3v5h2a1 1 0 0 0 1-1z"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevron: <path d="m8 10 4 4 4-4"/>,
    bag: <><path d="M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return <div className="rating" aria-label={`Nota ${rating} de 5, ${reviews} avaliações`}><span className="star">★</span><strong>{rating.toFixed(1)}</strong><span>({reviews})</span></div>;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [category, setCategory] = useState<(typeof CATEGORY_OPTIONS)[number]>("Todos");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState<CartState>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [cep, setCep] = useState("");
  const [shippingChecked, setShippingChecked] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [completedTotal, setCompletedTotal] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileName, setProfileName] = useState("");
  const [catalogFromDatabase, setCatalogFromDatabase] = useState(false);
  const syncReady = useRef(false);

  useEffect(() => {
    let active = true;

    const mapProduct = (row: {
      id: number; slug: string; name: string; brand: string; category: string; goal: string;
      size: string; price: number; old_price: number; rating: number;
      reviews: number; image_path: string; badge: string | null; accent: string;
      family_slug?: string | null; variant_name?: string | null; description?: string | null;
      benefits?: string[] | null; stock?: number | null; sort_order?: number | null; featured?: boolean | null;
    }): Product => {
      const fallback = FALLBACK_PRODUCTS.find((item) => item.slug === row.slug || item.id === row.id);
      return {
        id: row.id,
        slug: row.slug,
        familySlug: row.family_slug || fallback?.familySlug || row.slug,
        variantName: row.variant_name || fallback?.variantName || row.size,
        name: row.name,
        brand: row.brand,
        category: row.category as Category,
        goal: row.goal,
        size: row.size,
        price: Number(row.price),
        oldPrice: Number(row.old_price),
        rating: Number(row.rating),
        reviews: row.reviews,
        image: `/${row.image_path}`,
        badge: row.badge || undefined,
        accent: row.accent,
        description: row.description || fallback?.description || "Qualidade Maxfit para acompanhar sua rotina de treino.",
        benefits: row.benefits?.length ? row.benefits : fallback?.benefits || ["Qualidade selecionada", "Envio rápido", "Compra segura"],
        stock: row.stock ?? fallback?.stock ?? 50,
        sortOrder: row.sort_order ?? fallback?.sortOrder ?? row.id,
        featured: row.featured ?? fallback?.featured ?? false,
      };
    };

    const loadProfile = async (currentUser: User) => {
      const { data } = await supabase.from("profiles").select("full_name").eq("id", currentUser.id).maybeSingle();
      const metadataName = String(currentUser.user_metadata?.full_name || "");
      const name = data?.full_name || metadataName;
      if (active) setProfileName(name);
      if (!data) {
        await supabase.from("profiles").upsert({ id: currentUser.id, full_name: name });
      }
    };

    const loadCart = async (currentUser: User) => {
      const { data, error } = await supabase.from("cart_items").select("product_id, quantity").eq("user_id", currentUser.id);
      if (!active || error) return;
      const remoteCart = Object.fromEntries((data || []).map((item) => [item.product_id, item.quantity]));
      const savedCart = JSON.parse(localStorage.getItem("maxfit-cart") || "{}") as CartState;
      const merged = { ...remoteCart };
      for (const [id, quantity] of Object.entries(savedCart)) {
        merged[Number(id)] = Math.max(Number(quantity), merged[Number(id)] || 0);
      }
      setCart(merged);
      const rows = Object.entries(merged).map(([productId, quantity]) => ({ user_id: currentUser.id, product_id: Number(productId), quantity }));
      if (rows.length) await supabase.from("cart_items").upsert(rows, { onConflict: "user_id,product_id" });
      syncReady.current = true;
    };

    const initialize = async () => {
      try {
        const saved = localStorage.getItem("maxfit-cart");
        if (saved) setCart(JSON.parse(saved));
      } catch {}

      const { data: catalog } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("id");
      if (active && catalog?.length) {
        setProducts(catalog.map(mapProduct));
        setCatalogFromDatabase(true);
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (active) setUser(session?.user || null);
      if (session?.user) {
        await Promise.all([loadProfile(session.user), loadCart(session.user)]);
      } else {
        syncReady.current = true;
      }
      if (active) setReady(true);
    };

    initialize();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null;
      setUser(nextUser);
      if (nextUser) {
        window.setTimeout(() => {
          loadProfile(nextUser);
          loadCart(nextUser);
        }, 0);
      } else {
        setProfileName("");
        syncReady.current = true;
      }
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("maxfit-cart", JSON.stringify(cart));
    if (!user || !syncReady.current) return;

    const timer = window.setTimeout(async () => {
      const entries = Object.entries(cart);
      const productIds = entries.map(([id]) => Number(id));
      if (entries.length) {
        await supabase.from("cart_items").upsert(
          entries.map(([id, quantity]) => ({ user_id: user.id, product_id: Number(id), quantity })),
          { onConflict: "user_id,product_id" },
        );
        await supabase.from("cart_items").delete().eq("user_id", user.id).not("product_id", "in", `(${productIds.join(",")})`);
      } else {
        await supabase.from("cart_items").delete().eq("user_id", user.id);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [cart, ready, user]);

  useEffect(() => {
    const modalOpen = cartOpen || !!selectedProduct || checkoutComplete || mobileMenuOpen || authOpen;
    document.body.style.overflow = modalOpen ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCartOpen(false);
        setSelectedProduct(null);
        setCheckoutComplete(false);
        setMobileMenuOpen(false);
        setAuthOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [cartOpen, selectedProduct, checkoutComplete, mobileMenuOpen, authOpen]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const productFamilies = useMemo(() => {
    const representatives = new Map<string, Product>();
    for (const item of [...products].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)) {
      if (!representatives.has(item.familySlug)) representatives.set(item.familySlug, item);
    }
    return [...representatives.values()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    const list = productFamilies.filter((product) => {
      const matchesCategory = category === "Todos" || product.category === category;
      const variants = products.filter((item) => item.familySlug === product.familySlug);
      const searchText = `${product.name} ${product.brand} ${product.goal} ${product.category} ${variants.map((item) => item.variantName).join(" ")}`;
      const matchesQuery = !normalized || searchText.toLocaleLowerCase("pt-BR").includes(normalized);
      return matchesCategory && matchesQuery;
    });
    return [...list].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating || b.reviews - a.reviews;
      return Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder;
    });
  }, [category, query, sort, productFamilies, products]);

  const getVariants = (product: Product) => products
    .filter((item) => item.familySlug === product.familySlug)
    .sort((a, b) => a.id - b.id);

  const cartItems = useMemo(() => products.filter((product) => cart[product.id]).map((product) => ({ ...product, quantity: cart[product.id] })), [cart, products]);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal === 0 || subtotal >= 199 ? 0 : 14.9;
  const total = subtotal - discount + shipping;
  const freeShippingProgress = Math.min((subtotal / 199) * 100, 100);
  const scrollToCatalog = () => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const selectCategory = (next: (typeof CATEGORY_OPTIONS)[number]) => {
    setCategory(next);
    setMobileMenuOpen(false);
    window.setTimeout(scrollToCatalog, 50);
  };

  const addToCart = (product: Product, openCart = false) => {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + 1 }));
    setToast(`${product.name} · ${product.variantName} foi adicionado`);
    setSelectedProduct(null);
    if (openCart) setCartOpen(true);
  };

  const changeQuantity = (productId: number, delta: number) => {
    setCart((current) => {
      const next = Math.max(0, (current[productId] || 0) + delta);
      const updated = { ...current };
      if (next === 0) delete updated[productId];
      else updated[productId] = next;
      return updated;
    });
  };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "MAX10") {
      setCouponApplied(true);
      setToast("Cupom MAX10 aplicado: 10% OFF");
    } else {
      setCouponApplied(false);
      setToast("Cupom inválido. Experimente MAX10");
    }
  };

  const finishOrder = async () => {
    if (!cartItems.length) return;
    if (!user) {
      setCartOpen(false);
      setAuthMode("login");
      setAuthOpen(true);
      setToast("Entre na sua conta para concluir o pedido");
      return;
    }
    setCheckoutLoading(true);
    const { data: order, error } = await supabase.from("orders").insert({
      user_id: user.id,
      subtotal,
      discount,
      shipping,
      total,
    }).select("id").single();
    if (error || !order) {
      setCheckoutLoading(false);
      setToast("Não foi possível registrar o pedido. Tente novamente.");
      return;
    }
    const { error: itemsError } = await supabase.from("order_items").insert(
      cartItems.map((item) => ({
        order_id: order.id,
        user_id: user.id,
        product_id: item.id,
        product_name: `${item.name} · ${item.variantName}`,
        unit_price: item.price,
        quantity: item.quantity,
      })),
    );
    if (itemsError) {
      setCheckoutLoading(false);
      setToast("Pedido criado, mas houve um problema ao salvar os itens.");
      return;
    }
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setCompletedTotal(total);
    setCart({});
    setCheckoutLoading(false);
    setCartOpen(false);
    setCheckoutComplete(true);
  };

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const fullName = String(form.get("fullName") || "").trim();
    setAuthLoading(true);

    if (authMode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.href.split("#")[0].split("?")[0],
        },
      });
      setAuthLoading(false);
      if (error) {
        setToast(error.message.includes("registered") ? "Este e-mail já está cadastrado" : "Não foi possível criar a conta. Confira os dados.");
        return;
      }
      if (data.session) {
        await supabase.from("profiles").upsert({ id: data.session.user.id, full_name: fullName });
        setAuthOpen(false);
        setToast("Conta criada. Bem-vindo à Maxfit!");
      } else {
        setAuthMode("login");
        setToast("Conta criada! Confirme o e-mail e depois entre.");
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) {
      setToast("E-mail ou senha incorretos");
      return;
    }
    setAuthOpen(false);
    setToast("Login realizado. Seu carrinho foi sincronizado!");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCart({});
    localStorage.removeItem("maxfit-cart");
    setAuthOpen(false);
    setToast("Você saiu da sua conta");
  };

  const accountInitials = (profileName || user?.email || "MF")
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <main>
      <div className="announcement">
        <span>⚡ Semana Maxfit: até 30% OFF + frete grátis acima de R$ 199</span>
        <span className="announcement-code">USE: <strong>MAX10</strong></span>
      </div>

      <header className="site-header">
        <div className="header-main container">
          <button className="icon-button mobile-menu-button" aria-label="Abrir menu" onClick={() => setMobileMenuOpen(true)}><Icon name="menu" size={23} /></button>
          <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Maxfit - início">
            <span className="brand-mark">M<span>+</span></span>
            <span className="brand-name">MAX<span>FIT</span></span>
          </button>

          <label className="search-box">
            <span className="sr-only">Buscar produtos</span><Icon name="search" size={19} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => query && scrollToCatalog()} onKeyDown={(event) => event.key === "Enter" && scrollToCatalog()} placeholder="Busque whey, creatina, acessórios..." />
            {query && <button aria-label="Limpar busca" onClick={() => setQuery("")}><Icon name="x" size={16}/></button>}
          </label>

          <div className="header-actions">
            <button className="account-button" aria-label="Acessar minha conta" onClick={() => setAuthOpen(true)}><span className="account-avatar">{accountInitials}</span><span><small>{user ? "Olá!" : "Olá! Entrar"}</small><strong>{user ? (profileName.split(" ")[0] || "Minha conta") : "Minha conta"}</strong></span></button>
            <button className="cart-button" aria-label={`Abrir carrinho com ${itemCount} itens`} onClick={() => setCartOpen(true)}>
              <Icon name="bag" size={23} /><span className="cart-label"><small>Seu carrinho</small><strong>{itemCount ? `${itemCount} ${itemCount === 1 ? "item" : "itens"}` : "Está vazio"}</strong></span>
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </button>
          </div>
        </div>

        <nav className="category-nav" aria-label="Categorias principais">
          <div className="container">
            <button className="all-categories" onClick={() => selectCategory("Todos")}><Icon name="menu" size={18}/> Todos os produtos</button>
            {CATEGORY_OPTIONS.slice(1).map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => selectCategory(item)}>{item}</button>)}
            <button onClick={() => { setCategory("Todos"); setSort("price-low"); scrollToCatalog(); }} className="sale-link">Ofertas</button>
            <span className="nav-spacer" /><button className="help-link"><Icon name="headset" size={17}/> Fale com um especialista</button>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-noise" />
        <div className="hero-content container">
          <div className="hero-copy">
            <span className="eyebrow"><i /> PERFORMANCE COMEÇA AQUI</span>
            <h1>SUPERE SEUS<br/><em>LIMITES.</em></h1>
            <p>Suplementação de alta qualidade para transformar constância em resultado. Do primeiro treino ao próximo recorde.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={scrollToCatalog}>Comprar agora <Icon name="arrow" size={19}/></button>
              <button className="text-button" onClick={() => selectCategory("Performance")}>Ver linha performance <span>→</span></button>
            </div>
            <div className="hero-proof">
              <div><strong>+50 mil</strong><span>clientes ativos</span></div>
              <div><strong>4.9/5</strong><span>avaliação média</span></div>
              <div><strong>100%</strong><span>qualidade testada</span></div>
            </div>
          </div>
          <div className="hero-visual" role="img" aria-label="Linha de suplementos Maxfit">
            <div className="hero-glow" />
            <img src={assetUrl("assets/images/maxfit-hero.webp")} alt="Linha de produtos Maxfit em estúdio" />
            <div className="floating-badge badge-protein"><strong>24g</strong><span>proteína<br/>por dose</span></div>
            <div className="floating-badge badge-quality"><Icon name="shield" size={20}/><span>Qualidade<br/><strong>certificada</strong></span></div>
          </div>
        </div>
        <div className="hero-word" aria-hidden="true">MAXFIT</div>
      </section>

      <section className="benefits" aria-label="Vantagens Maxfit">
        <div className="container benefits-grid">
          <div className="benefit"><span><Icon name="truck" size={24}/></span><div><strong>Frete grátis</strong><small>Nas compras acima de R$ 199</small></div></div>
          <div className="benefit"><span><Icon name="card" size={24}/></span><div><strong>Até 6x sem juros</strong><small>Parcela mínima de R$ 30</small></div></div>
          <div className="benefit"><span><Icon name="shield" size={24}/></span><div><strong>Compra segura</strong><small>Seus dados sempre protegidos</small></div></div>
          <div className="benefit"><span><Icon name="headset" size={24}/></span><div><strong>Suporte especializado</strong><small>Seg. a sáb., das 8h às 20h</small></div></div>
        </div>
      </section>

      <section className="shop-section container" id="catalogo">
        <div className="section-heading">
          <div><span className="section-kicker">ESCOLHAS QUE ENTREGAM RESULTADO</span><h2>Os favoritos da <em>Maxfit</em></h2></div>
          <p>Fórmulas selecionadas, transparência no rótulo e tudo o que você precisa para evoluir.</p>
        </div>

        <div className="catalog-toolbar">
          <div className="filter-chips" role="group" aria-label="Filtrar por categoria">
            {CATEGORY_OPTIONS.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <label className="sort-box"><span>Ordenar:</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar produtos"><option value="featured">Mais relevantes</option><option value="rating">Melhor avaliados</option><option value="price-low">Menor preço</option><option value="price-high">Maior preço</option></select><Icon name="chevron" size={16}/></label>
        </div>

        <div className="catalog-status" title={catalogFromDatabase ? "Catálogo carregado do Supabase" : "Usando catálogo de segurança local"}><i className={catalogFromDatabase ? "online" : ""}/>{catalogFromDatabase ? "Catálogo conectado ao banco de dados" : "Catálogo disponível"}<span>· {productFamilies.length} produtos · {products.length} opções</span></div>
        {query && <div className="search-result-info">Resultados para <strong>“{query}”</strong> · {filteredProducts.length} {filteredProducts.length === 1 ? "produto" : "produtos"}</div>}
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const saving = Math.round((1 - product.price / product.oldPrice) * 100);
            const variants = getVariants(product);
            return (
              <article className="product-card" key={product.familySlug}>
                <div className="product-media" style={{ "--product-accent": product.accent } as React.CSSProperties}>
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <span className="discount-badge">-{saving}%</span>
                  <button className="favorite-button" aria-label={`Favoritar ${product.name}`}><Icon name="heart" size={18}/></button>
                  <button className="product-image-button" onClick={() => setSelectedProduct(product)} aria-label={`Ver detalhes de ${product.name}`}>
                    <img src={assetUrl(product.image)} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.src = assetUrl(fallbackImage(product.category)); }} />
                  </button>
                  <button className="quick-view" onClick={() => setSelectedProduct(product)}>Ver detalhes</button>
                </div>
                <div className="product-info">
                  <div className="product-meta"><span>{product.brand}</span><Stars rating={product.rating} reviews={product.reviews}/></div>
                  <button className="product-name" onClick={() => setSelectedProduct(product)}>{product.name}</button>
                  <p className="product-size">{product.size}</p>
                  {variants.length > 1 && <button className="variant-summary" onClick={() => setSelectedProduct(product)}>{variants.length} opções · Escolher {product.category === "Acessórios" ? "tamanho/cor" : "sabor"}</button>}
                  <div className="price-row">
                    <div><span className="old-price">{formatMoney(product.oldPrice)}</span><strong>{formatMoney(product.price)}</strong><small>no Pix</small></div>
                    <button className="add-button" onClick={() => variants.length > 1 ? setSelectedProduct(product) : addToCart(product)} aria-label={variants.length > 1 ? `Escolher opção de ${product.name}` : `Adicionar ${product.name} ao carrinho`}><Icon name={variants.length > 1 ? "chevron" : "plus"} size={22}/></button>
                  </div>
                  <span className="installment">ou 3x de {formatMoney(product.price / 3)} sem juros</span>
                </div>
              </article>
            );
          })}
        </div>

        {!filteredProducts.length && <div className="empty-search"><span>⌕</span><h3>Nenhum produto encontrado</h3><p>Tente buscar por outro termo ou veja todo o catálogo.</p><button className="primary-button" onClick={() => { setQuery(""); setCategory("Todos"); }}>Ver todos os produtos</button></div>}
      </section>

      <section className="goal-section">
        <div className="container">
          <div className="goal-copy"><span className="section-kicker">ENCONTRE SUA FÓRMULA</span><h2>Qual é o seu<br/><em>objetivo?</em></h2><p>Escolha onde quer chegar. A gente mostra os produtos que combinam com seu momento.</p></div>
          <div className="goal-cards">
            <button onClick={() => selectCategory("Proteínas")}><span>01</span><div><strong>Ganhar massa</strong><small>Proteínas para construir e recuperar</small></div><i>→</i></button>
            <button onClick={() => selectCategory("Performance")}><span>02</span><div><strong>Mais performance</strong><small>Energia, foco, força e resistência</small></div><i>→</i></button>
            <button onClick={() => selectCategory("Saúde")}><span>03</span><div><strong>Saúde e equilíbrio</strong><small>Nutrição para todos os dias</small></div><i>→</i></button>
          </div>
        </div>
      </section>

      <section className="editorial container">
        <div className="editorial-image"><img src={assetUrl("assets/images/maxfit-hero.webp")} alt="Linha de suplementos Maxfit"/></div>
        <div className="editorial-copy"><span className="section-kicker">POR DENTRO DA FÓRMULA</span><h2>O que entra no pote<br/>faz <em>diferença.</em></h2><p>Na Maxfit, cada produto nasce de matérias-primas selecionadas, doses transparentes e testes rigorosos. Sem atalhos, sem ingredientes escondidos.</p><ul><li><span><Icon name="check" size={17}/></span> Ingredientes de alta pureza</li><li><span><Icon name="check" size={17}/></span> Laudos por lote e controle de qualidade</li><li><span><Icon name="check" size={17}/></span> Rótulos claros e doses efetivas</li></ul><button className="outline-button" onClick={() => selectCategory("Todos")}>Conheça nossos produtos <Icon name="arrow" size={18}/></button></div>
      </section>

      <section className="testimonials container">
        <div className="testimonial-score"><span>★</span><strong>4.9</strong><p>Baseado em mais de 8.200 avaliações verificadas</p></div>
        <blockquote><p>“A creatina chegou super rápido e já senti diferença na constância dos treinos. Embalagem impecável e atendimento que realmente ajuda.”</p><footer><span>LR</span><div><strong>Larissa Ribeiro</strong><small>Cliente verificada · Belo Horizonte, MG</small></div></footer></blockquote>
        <blockquote><p>“Whey com ótima dissolução e sabor sem ser enjoativo. Virou minha compra fixa depois do treino.”</p><footer><span>CM</span><div><strong>Caio Martins</strong><small>Cliente verificado · São Paulo, SP</small></div></footer></blockquote>
      </section>

      <section className="newsletter">
        <div className="container newsletter-content">
          <div><span className="section-kicker">ENTRE PARA O TIME</span><h2>Conteúdo que <em>move.</em></h2><p>Treino, nutrição e ofertas exclusivas direto no seu e-mail.</p></div>
          <form onSubmit={(event) => { event.preventDefault(); setToast("Cadastro realizado. Bem-vindo ao time!"); }}><label><span className="sr-only">Seu melhor e-mail</span><input type="email" required placeholder="Seu melhor e-mail"/></label><button type="submit">Quero receber <Icon name="arrow" size={18}/></button><small>Ao cadastrar, você concorda com nossa Política de Privacidade.</small></form>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand"><span className="brand-name">MAX<span>FIT</span></span><p>Suplementação e acessórios para quem leva evolução a sério.</p><div className="socials"><button aria-label="Instagram">ig</button><button aria-label="YouTube">yt</button><button aria-label="TikTok">tk</button></div></div>
          <div><strong>Institucional</strong><a href="#catalogo">Sobre a Maxfit</a><a href="#catalogo">Qualidade</a><a href="#catalogo">Trabalhe conosco</a><a href="#catalogo">Blog</a></div>
          <div><strong>Ajuda</strong><a href="#catalogo">Central de atendimento</a><a href="#catalogo">Entregas e prazos</a><a href="#catalogo">Trocas e devoluções</a><a href="#catalogo">Dúvidas frequentes</a></div>
          <div><strong>Atendimento</strong><p>Segunda a sábado<br/>das 8h às 20h</p><a href="mailto:oi@maxfit.com.br">oi@maxfit.com.br</a><a href="tel:+5533999992026">(33) 99999-2026</a></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 Maxfit. Todos os direitos reservados.</span><span>Ambiente seguro · Compra protegida</span></div>
      </footer>

      <button className="floating-support" aria-label="Falar com a Maxfit" onClick={() => setToast("Nosso time está online! Atendimento de demonstração.")}><span>✦</span><div><small>Precisa de ajuda?</small><strong>Fale com a Maxfit</strong></div></button>
      <nav className="mobile-bottom-nav" aria-label="Navegação móvel"><button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span>⌂</span>Início</button><button onClick={() => setAuthOpen(true)}><span className="mobile-account-initials">{accountInitials}</span>{user ? "Conta" : "Entrar"}</button><button onClick={() => setCartOpen(true)} className="mobile-cart"><Icon name="bag" size={20}/>{itemCount > 0 && <i>{itemCount}</i>}Carrinho</button></nav>

      {mobileMenuOpen && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-label="Menu de categorias">
          <button className="modal-backdrop" aria-label="Fechar menu" onClick={() => setMobileMenuOpen(false)} />
          <aside className="mobile-menu-panel"><div className="mobile-menu-head"><span className="brand-name">MAX<span>FIT</span></span><button className="icon-button" onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu"><Icon name="x"/></button></div><p>Comprar por categoria</p>{CATEGORY_OPTIONS.map((item) => <button key={item} onClick={() => selectCategory(item)}><span>{item}</span><Icon name="arrow" size={18}/></button>)}<div className="mobile-menu-help"><Icon name="headset"/><div><strong>Precisa de ajuda?</strong><small>Fale com um especialista</small></div></div></aside>
        </div>
      )}

      {cartOpen && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <button className="modal-backdrop" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)} />
          <aside className="cart-drawer">
            <div className="cart-header"><div><h2 id="cart-title">Seu carrinho</h2><span>{itemCount} {itemCount === 1 ? "item" : "itens"}</span></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho"><Icon name="x"/></button></div>
            {cartItems.length ? (
              <>
                <div className="free-shipping"><div><span>{subtotal >= 199 ? "Frete grátis desbloqueado!" : `Faltam ${formatMoney(199 - subtotal)} para o frete grátis`}</span><strong>{subtotal >= 199 ? "✓" : ""}</strong></div><i><b style={{ width: `${freeShippingProgress}%` }}/></i></div>
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <article className="cart-item" key={item.id}>
                      <div className="cart-item-image" style={{ "--product-accent": item.accent } as React.CSSProperties}><img src={assetUrl(item.image)} alt="" onError={(event) => { event.currentTarget.src = assetUrl(fallbackImage(item.category)); }}/></div>
                      <div className="cart-item-info"><span>{item.brand}</span><strong>{item.name}</strong><small>{item.size}</small><div><div className="quantity"><button onClick={() => changeQuantity(item.id, -1)} aria-label="Diminuir quantidade"><Icon name="minus" size={15}/></button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.id, 1)} aria-label="Aumentar quantidade"><Icon name="plus" size={15}/></button></div><strong>{formatMoney(item.price * item.quantity)}</strong></div></div>
                    </article>
                  ))}
                </div>
                <div className="cart-options">
                  <div className="coupon-row"><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Cupom de desconto" aria-label="Cupom de desconto"/><button onClick={applyCoupon}>Aplicar</button></div>
                  {couponApplied && <p className="coupon-success"><Icon name="check" size={15}/> Cupom MAX10 aplicado</p>}
                  <div className="cep-row"><input value={cep} onChange={(event) => setCep(event.target.value.replace(/\D/g, "").slice(0, 8))} placeholder="Digite seu CEP" aria-label="CEP"/><button onClick={() => { if (cep.length === 8) setShippingChecked(true); else setToast("Digite um CEP com 8 números"); }}>Calcular</button></div>
                  {shippingChecked && <p className="shipping-result"><Icon name="truck" size={16}/> Entrega padrão: 4–7 dias úteis</p>}
                </div>
                <div className="cart-summary"><div><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>{couponApplied && <div className="discount-line"><span>Desconto MAX10</span><span>- {formatMoney(discount)}</span></div>}<div><span>Frete</span><span>{shipping === 0 ? "Grátis" : formatMoney(shipping)}</span></div><div className="cart-total"><strong>Total</strong><strong>{formatMoney(total)}</strong></div><small>ou 6x de {formatMoney(total / 6)} sem juros</small><button className="checkout-button" onClick={finishOrder} disabled={checkoutLoading}>{checkoutLoading ? "Salvando pedido..." : user ? "Finalizar compra" : "Entrar para finalizar"} {!checkoutLoading && <Icon name="arrow" size={19}/>}</button><button className="continue-shopping" onClick={() => setCartOpen(false)}>Continuar comprando</button></div>
              </>
            ) : <div className="empty-cart"><span><Icon name="bag" size={34}/></span><h3>Seu carrinho está vazio</h3><p>Que tal começar pelos produtos favoritos de quem já treina com a Maxfit?</p><button className="primary-button" onClick={() => { setCartOpen(false); scrollToCatalog(); }}>Explorar produtos</button></div>}
          </aside>
        </div>
      )}

      {selectedProduct && (
        <div className="modal-layer product-modal-layer" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
          <button className="modal-backdrop" aria-label="Fechar detalhes" onClick={() => setSelectedProduct(null)} />
          <div className="product-modal">
            <button className="icon-button product-modal-close" onClick={() => setSelectedProduct(null)} aria-label="Fechar"><Icon name="x"/></button>
            <div className="product-modal-image" style={{ "--product-accent": selectedProduct.accent } as React.CSSProperties}>
              <img src={assetUrl(selectedProduct.image)} alt={selectedProduct.name} onError={(event) => { event.currentTarget.src = assetUrl(fallbackImage(selectedProduct.category)); }}/>
            </div>
            <div className="product-modal-copy">
              <span className="section-kicker">{selectedProduct.brand}</span>
              <h2 id="product-modal-title">{selectedProduct.name}</h2>
              <Stars rating={selectedProduct.rating} reviews={selectedProduct.reviews}/>
              <p className="product-description">{selectedProduct.description}</p>
              {getVariants(selectedProduct).length > 1 && (
                <div className="variant-picker">
                  <span>Escolha {selectedProduct.category === "Acessórios" ? "o tamanho ou a cor" : "o sabor"}</span>
                  <div>{getVariants(selectedProduct).map((variant) => <button key={variant.id} className={variant.id === selectedProduct.id ? "active" : ""} onClick={() => setSelectedProduct(variant)}>{variant.variantName}</button>)}</div>
                </div>
              )}
              <p className="selected-variant"><strong>Opção selecionada:</strong> {selectedProduct.size}</p>
              <div className="modal-benefits">{selectedProduct.benefits.map((benefit) => <span key={benefit}><Icon name="check" size={15}/> {benefit}</span>)}</div>
              <span className="stock-status"><i/> Em estoque · envio em até 24h</span>
              <span className="old-price">{formatMoney(selectedProduct.oldPrice)}</span>
              <div className="modal-price"><strong>{formatMoney(selectedProduct.price)}</strong><small>no Pix</small></div>
              <p className="modal-installment">ou 3x de {formatMoney(selectedProduct.price / 3)} sem juros</p>
              <button className="checkout-button" onClick={() => addToCart(selectedProduct, true)}>Adicionar esta opção ao carrinho <Icon name="bag" size={19}/></button>
            </div>
          </div>
        </div>
      )}

      {checkoutComplete && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <button className="modal-backdrop" aria-label="Fechar" onClick={() => setCheckoutComplete(false)} />
          <div className="success-modal"><span className="success-icon"><Icon name="check" size={36}/></span><span className="section-kicker">PEDIDO REGISTRADO</span><h2 id="checkout-title">Tudo certo por aqui!</h2><p>Seu pedido de demonstração foi salvo com segurança no banco de dados da Maxfit.</p><div><span>Total do pedido</span><strong>{formatMoney(completedTotal)}</strong></div><button className="primary-button" onClick={() => { setCheckoutComplete(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Concluir demonstração</button></div>
        </div>
      )}

      {authOpen && (
        <div className="modal-layer auth-modal-layer" role="dialog" aria-modal="true" aria-labelledby="auth-title">
          <button className="modal-backdrop" aria-label="Fechar conta" onClick={() => setAuthOpen(false)} />
          <div className="auth-modal">
            <button className="icon-button auth-close" onClick={() => setAuthOpen(false)} aria-label="Fechar"><Icon name="x"/></button>
            <div className="auth-brand"><span className="brand-mark">M<span>+</span></span><span className="brand-name">MAX<span>FIT</span></span></div>
            {user ? (
              <div className="account-panel">
                <span className="account-big-avatar">{accountInitials}</span>
                <span className="section-kicker">CONTA CONECTADA</span>
                <h2 id="auth-title">Olá, {profileName.split(" ")[0] || "atleta"}!</h2>
                <p>{user.email}</p>
                <div className="account-sync"><Icon name="shield" size={20}/><div><strong>Dados sincronizados</strong><small>Seu carrinho e seus pedidos ficam salvos no Supabase.</small></div></div>
                <button className="outline-button" onClick={signOut}>Sair da conta</button>
              </div>
            ) : (
              <>
                <span className="section-kicker">{authMode === "login" ? "BEM-VINDO DE VOLTA" : "ENTRE PARA O TIME"}</span>
                <h2 id="auth-title">{authMode === "login" ? "Acesse sua conta" : "Crie sua conta Maxfit"}</h2>
                <p>{authMode === "login" ? "Entre para recuperar seu carrinho em qualquer dispositivo." : "Seu carrinho e seus pedidos ficarão salvos com segurança."}</p>
                <div className="auth-tabs" role="tablist"><button className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>Entrar</button><button className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>Criar conta</button></div>
                <form className="auth-form" onSubmit={handleAuth}>
                  {authMode === "register" && <label>Nome completo<input name="fullName" autoComplete="name" required minLength={2} placeholder="Como podemos chamar você?"/></label>}
                  <label>E-mail<input name="email" type="email" autoComplete="email" required placeholder="voce@email.com"/></label>
                  <label>Senha<input name="password" type="password" autoComplete={authMode === "login" ? "current-password" : "new-password"} required minLength={6} placeholder="Mínimo de 6 caracteres"/></label>
                  <button className="checkout-button" type="submit" disabled={authLoading}>{authLoading ? "Aguarde..." : authMode === "login" ? "Entrar na Maxfit" : "Criar minha conta"}</button>
                </form>
                <small className="auth-security"><Icon name="shield" size={15}/> Login protegido pelo Supabase. Senhas nunca ficam visíveis para a loja.</small>
              </>
            )}
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status"><span><Icon name="check" size={17}/></span>{toast}</div>}
    </main>
  );
}

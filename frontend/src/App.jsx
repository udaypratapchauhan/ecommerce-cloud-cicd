import React, { useState, useEffect, useMemo } from 'react';

const CATEGORIES = ['All', 'Electronics', 'Footwear', 'Fashion', 'Fitness'];

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/products`;

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load store catalog: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [API_URL]);

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
    setToastMessage(`Added "${product.title}" to your cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        (product.category && product.category.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="store-app">
      {/* Top Promotional Header */}
      <div className="promo-strip">
        ⚡ Super Saver Deals: Up to 50% Off across Electronics, Footwear, Fashion & Fitness | Free Express Delivery
      </div>

      {/* Main Navigation Header */}
      <header className="site-header">
        <div className="header-container">
          <a
            href="#"
            className="brand-link"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          >
            <span className="brand-badge-icon">NB</span>
            <span className="brand-text">
              NEXUS <span className="brand-text-accent">BAZAAR</span>
            </span>
          </a>

          <div className="search-container">
            <span className="search-icon-svg">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search for brands, electronics, shoes, fashion, fitness..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="cart-header-btn" title="View Shopping Cart">
            <span>🛒 Cart</span>
            <span className="cart-counter">{cartCount}</span>
          </button>
        </div>
      </header>

      {/* Category Filter Navigation */}
      <nav className="category-nav-wrapper">
        <div className="category-nav-container">
          {CATEGORIES.map((cat) => {
            const label = cat === 'All' ? `All (${products.length || 40})` : cat;
            return (
              <button
                key={cat}
                className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="catalog-layout">
        <div className="section-header">
          <h1 className="section-title">
            {selectedCategory === 'All' ? 'Deals of the Day' : `${selectedCategory} Collection`}
          </h1>
          <span className="section-count">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>

        {loading && (
          <div className="state-panel">
            <div className="spinner-icon"></div>
            <p style={{ color: '#4b5563', fontWeight: 600 }}>
              Loading authentic products from Nexus Bazaar database...
            </p>
          </div>
        )}

        {error && (
          <div className="state-panel" style={{ borderColor: '#fca5a5', color: '#b91c1c' }}>
            <p><strong>Database Connection Notice:</strong> {error}</p>
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="state-panel">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No results found</h3>
            <p style={{ color: '#6b7280' }}>
              No items match your search for "{searchQuery}". Please select another category or refine your query.
            </p>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const currentPrice = Number(product.price);
              const originalPrice = product.original_price ? Number(product.original_price) : null;
              const discountPercent =
                originalPrice && originalPrice > currentPrice
                  ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
                  : null;

              return (
                <article key={product.id} className="product-card">
                  <div className="image-wrapper">
                    <span className="category-tag-pill">
                      {(product.category || 'General').toUpperCase()}
                    </span>
                    <img
                      src={
                        product.image_url ||
                        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={product.title}
                      className="card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>

                  <div className="card-body">
                    <h2 className="product-name" title={product.title}>
                      {product.title}
                    </h2>

                    {product.description && (
                      <p className="product-description" title={product.description}>
                        {product.description}
                      </p>
                    )}

                    <div className="rating-container">
                      <span className="rating-chip">
                        ★ {Number(product.rating || 4.5).toFixed(1)}
                      </span>
                      <span className="rating-tally">
                        ({Number(product.rating_count || 120).toLocaleString('en-IN')})
                      </span>
                    </div>

                    <div className="price-row">
                      <span className="current-price-val">
                        ₹{currentPrice.toLocaleString('en-IN')}
                      </span>
                      {originalPrice && (
                        <span className="original-price-val">
                          ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      {discountPercent && (
                        <span className="discount-badge">{discountPercent}% OFF</span>
                      )}
                    </div>

                    <div className="stock-info">
                      {product.stock > 10 ? (
                        <span className="in-stock">In Stock ({product.stock} units)</span>
                      ) : product.stock > 0 ? (
                        <span className="low-stock">Only {product.stock} left in stock!</span>
                      ) : (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </div>

                    <button
                      className="add-btn"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Cart Feedback Toast */}
      {toastMessage && (
        <aside className="cart-toast">
          <span>✅</span>
          <span>{toastMessage}</span>
        </aside>
      )}
    </div>
  );
}

export default App;

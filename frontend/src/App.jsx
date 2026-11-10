import React, { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/products`;

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.statusText}`);
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

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red', fontFamily: 'sans-serif' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Product Catalog</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{product.title}</h3>
              <p style={{ margin: '0 0 0.5rem 0', color: '#4a5568' }}>{product.description}</p>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
                ${Number(product.price).toFixed(2)}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: product.stock > 0 ? '#38a169' : '#e53e3e',
                }}
              >
                {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

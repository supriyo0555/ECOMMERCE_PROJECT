export default function Products() {
  const productList = [
    { id: 1, title: "Wireless Headphones Pro", price: "2,999", oldPrice: "4,999", img: "https://m.media-amazon.com/images/I/61+9E-7T99L._SL1500_.jpg", rating: "4.5", vendor: "AudioTech Store" },
    { id: 2, title: "Smart Watch Series X", price: "8,499", oldPrice: "12,999", img: "https://m.media-amazon.com/images/I/61L594m6nSL._SL1500_.jpg", rating: "4.7", vendor: "GadgetHub" },
    { id: 3, title: "Smart Watch Series X", price: "8,499", oldPrice: "12,999", img: "https://m.media-amazon.com/images/I/61L594m6nSL._SL1500_.jpg", rating: "4.7", vendor: "GadgetHub" },
    { id: 4, title: "Smart Watch Series X", price: "8,499", oldPrice: "12,999", img: "https://m.media-amazon.com/images/I/61L594m6nSL._SL1500_.jpg", rating: "4.7", vendor: "GadgetHub" },
    { id: 5, title: "Smart Watch Series X", price: "8,499", oldPrice: "12,999", img: "https://m.media-amazon.com/images/I/61L594m6nSL._SL1500_.jpg", rating: "4.7", vendor: "GadgetHub" },
    { id: 6, title: "Smart Watch Series X", price: "8,499", oldPrice: "12,999", img: "https://m.media-amazon.com/images/I/61L594m6nSL._SL1500_.jpg", rating: "4.7", vendor: "GadgetHub" },
    { id: 7, title: "Smart Watch Series X", price: "8,499", oldPrice: "12,999", img: "https://m.media-amazon.com/images/I/61L594m6nSL._SL1500_.jpg", rating: "4.7", vendor: "GadgetHub" },
    { id: 8, title: "Smart Watch Series X", price: "8,499", oldPrice: "12,999", img: "https://m.media-amazon.com/images/I/61L594m6nSL._SL1500_.jpg", rating: "4.7", vendor: "GadgetHub" },

  ];

  return (
    <section className="py-5 container">
      <h2 className="text-center mb-5">Featured Products</h2>
      <div className="row row-cols-1 row-cols-md-4 g-4">
        {productList.map((product) => (
          <div key={product.id} className="col">
            <div className="card h-100 shadow-sm border-0 product-card">
              <img src={product.img} className="card-img-top p-3" alt={product.title} style={{height: "200px", objectFit: "contain"}} />
              <div className="card-body">
                <h6 className="card-title fw-bold">{product.title}</h6>
                <p className="text-muted small mb-1">Sold by: {product.vendor}</p>
                <div className="mb-2">
                  <span className="badge bg-success">{product.rating} ★</span>
                </div>
                <h5 className="text-primary">₹{product.price} <del className="text-muted small">₹{product.oldPrice}</del></h5>
                <button className="btn btn-orange w-100 mt-2">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
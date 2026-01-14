import "./categories.css";

export default function Categories() {
  const categoryData = [
    { name: "Electronics", img: "https://cdn-icons-png.flaticon.com/512/3659/3659899.png" },
    { name: "Fashion", img: "https://cdn-icons-png.flaticon.com/512/3050/3050239.png" },
    { name: "Home & Kitchen", img: "https://cdn-icons-png.flaticon.com/512/2555/2555572.png" },
    { name: "Beauty", img: "https://cdn-icons-png.flaticon.com/512/3058/3058925.png" },
    { name: "Sports", img: "https://cdn-icons-png.flaticon.com/512/2382/2382633.png" },
    { name: "Books", img: "https://cdn-icons-png.flaticon.com/512/2436/2436636.png" },
  ];

  return (
    <section className="categories-section py-5">
      <div className="container">
        <h1 className="text-center mb-5">Shop by Category</h1>
        <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-4">
          {categoryData.map((item, index) => (
            <div key={index} className="col">
              <div className="card category-card text-center p-3 shadow-sm border-0">
                <img src={item.img} className="mx-auto mb-2" alt={item.name} />
                <p className="small mb-0 fw-medium">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
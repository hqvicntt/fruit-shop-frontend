import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // State to store the list of fruits fetched from the backend
  const [fruits, setFruits] = useState([]);

  // Fetch fruit data from Laravel API when the component mounts
  useEffect(() => {
    axios.get('http://fruit-shop-backend.test/api/products')
      .then(response => {
        // Accessing the 'data' array inside the JSON response structure we created in Laravel
        if (response.data.success) {
          setFruits(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error fetching fruit data:", error);
      });
  }, []);

  return (
    <div className="container my-5">
      {/* App header for the fruit shop */}
      <h1 className="text-center text-success fw-bold mb-4">Cửa Hàng Trái Cây Đường Linh</h1>
      
      {/* Grid system to display fruit items */}
      <div className="row g-4">
        {fruits.map((fruit) => (
          <div className="col-12 col-md-6 col-lg-4" key={fruit.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                {/* Fruit name and price */}
                <h5 className="card-title fw-bold text-dark">{fruit.name}</h5>
                <h6 className="card-subtitle mb-2 text-danger fw-semibold">
                  Giá: {fruit.price.toLocaleString('vi-VN')} đ / kg
                </h6>
                
                {/* Stock status indicator */}
                <p className="card-text text-muted mb-0">
                  Còn lại trong kho: <span className="badge bg-success">{fruit.stock} kg</span>
                </p>
              </div>
              <div className="card-footer bg-transparent border-top-0 pb-3">
                <button className="btn btn-outline-success w-100 fw-bold">Chọn mua</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

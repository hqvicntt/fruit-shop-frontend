import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // State for storing the list of fruits
  const [fruits, setFruits] = useState([]);

  // State for form inputs (Controlled Components)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  // Fetch fruit data from Laravel API
  const fetchFruits = () => {
    axios.get('http://fruit-shop-backend.test/api/products/') // API route for fetching products
      .then(response => {
        if (response.data.success) {
          setFruits(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error fetching fruits:", error);
      });
  };

  // Run fetchFruits when the component mounts
  useEffect(() => {
    fetchFruits();
  }, []);

  // Handle form submission to add new fruit
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the page from reloading

    // Basic input validation before sending to API
    if (!name || !price || !stock) {
      alert("Vui lòng nhập đầy đủ thông tin trái cây!");
      return;
    }

    // Data object to send to the backend
    const newFruit = {
      name: name,
      price: parseInt(price),
      stock: parseFloat(stock)
    };

    // Send a POST request to the Laravel backend
    axios.post('http://fruit-shop-backend.test/api/products/', newFruit)
      .then(response => {
        if (response.data.success) {
          alert("Thêm trái cây mới thành công!");
          // Reset the form inputs
          setName('');
          setPrice('');
          setStock('');
          // Refresh the fruit list
          fetchFruits();
        }
      })
      .catch(error => {
        console.error("Error adding fruit:", error);
        alert("Có lỗi xảy ra khi thêm trái cây.");
      });
  };

  // Handle deleting a fruit item by its ID
  const handleDelete = (id, fruitName) => {
    // Show a confirmation dialog to the user before deleting
    if (window.confirm(`Bạn có chắc chắn muốn xóa loại trái cây "${fruitName}" này không?`)) {
      
      // Send a DELETE request to the Laravel backend API
      axios.delete(`http://fruit-shop-backend.test/api/products/${id}`)
        .then(response => {
          if (response.data.success) {
            alert("Xóa trái cây thành công!");
            // Refresh the fruit inventory table / Tải lại bảng kho hàng trái cây
            fetchFruits();
          }
        })
        .catch(error => {
          console.error("Error deleting fruit:", error);
          alert("Có lỗi xảy ra khi xóa trái cây.");
        });
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center text-success fw-bold mb-5">Hệ Thống Quản Lý Trái Cây</h1>

      <div className="row g-5">
        {/* Left Column: Add New Fruit Form */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm p-4 border-success">
            <h4 className="text-success fw-bold mb-4">Thêm Trái Cây Mới</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Tên trái cây</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ví dụ: Xoài Cát, Măng Cụt..." 
                  value={name}
                  onChange={(e) => setName(e.target.value)} // Update state on typing
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Giá bán (đ/kg)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Ví dụ: 50000" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Số lượng kho (kg)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="form-control" 
                  placeholder="Ví dụ: 15.5" 
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-success w-100 fw-bold mt-2">
                Thêm Vào Kho
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Fruit Inventory List */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm p-4">
            <h4 className="text-dark fw-bold mb-4">Danh Sách Kho Hàng Hiện Tại</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Tên Trái Cây</th>
                    <th scope="col">Giá Bán</th>
                    <th scope="col">Tồn Kho</th>
                    <th scope="col" className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {fruits.map((fruit) => (
                    <tr key={fruit.id}>
                      <td className="fw-bold">#{fruit.id}</td>
                      <td>{fruit.name}</td>
                      <td className="text-danger fw-semibold">
                        {fruit.price.toLocaleString('vi-VN')} đ
                      </td>
                      <td>
                        <span className="badge bg-info text-dark fw-bold">
                          {fruit.stock} kg
                        </span>
                      </td>
                      <td className="text-center">
                        {/* Red Delete Button utilizing Bootstrap 5 classes */}
                        <button 
                          className="btn btn-outline-danger btn-sm fw-bold px-3"
                          onClick={() => handleDelete(fruit.id, fruit.name)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // State for storing the list of fruits
  const [fruits, setFruits] = useState([]);

  // State for form inputs (Controlled Components)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  // State for editing fruit form (Selected fruit data)
  const [editingFruit, setEditingFruit] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  // State to switch between 'inventory' and 'revenue' tabs
  const [activeTab, setActiveTab] = useState('inventory');

  // States to store today's revenue summary and order list
  const [revenueSummary, setRevenueSummary] = useState({
    total_revenue: 0,
    total_cash: 0,
    total_transfer: 0
  });
  const [orders, setOrders] = useState([]);

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

  // Fetch today's revenue summary and orders from Laravel API
  const fetchRevenueReport = () => {
    axios.get('http://fruit-shop-backend.test/api/orders')
      .then(response => {
        if (response.data.success) {
          setRevenueSummary(response.data.summary);
          setOrders(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error fetching revenue report:", error);
      });
  };

  // Run fetchFruits when the component mounts
  useEffect(() => {
    fetchFruits();
    fetchRevenueReport();
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

  // Set the selected fruit data into editing state and trigger modal
  const openEditModal = (fruit) => {
    setEditingFruit(fruit);
    setEditName(fruit.name);
    setEditPrice(fruit.price);
    setEditStock(fruit.stock);
  };

  // Handle updating fruit data via API
  const handleUpdate = (e) => {
    e.preventDefault();

    if (!editName || !editPrice || !editStock) {
      alert("Vui lòng nhập đầy đủ thông tin chỉnh sửa!");
      return;
    }

    const updatedData = {
      name: editName,
      price: parseInt(editPrice),
      stock: parseFloat(editStock)
    };

    // Send a PUT request to update the product in MySQL
    axios.put(`http://fruit-shop-backend.test/api/products/${editingFruit.id}`, updatedData)
      .then(response => {
        if (response.data.success) {
          alert("Cập nhật thông tin trái cây thành công!");

          // Reset editing state
          setEditingFruit(null);
          // Refresh table data
          fetchFruits();
        }
      })
      .catch(error => {
        console.error("Error updating fruit:", error);
        alert("Có lỗi xảy ra khi cập nhật trái cây.");
      });
  };

  return (
    <div className="container my-5">
      <h1 className="text-center text-success fw-bold mb-4">Hệ Thống Quản Lý Trái Cây</h1>

      {/* Navigation Tabs to switch between Inventory and Revenue Report */}
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group shadow-sm" role="group">
          <button
            type="button"
            className={`btn fw-bold px-4 py-2 ${activeTab === 'inventory' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setActiveTab('inventory')}
          >
            Quản Lý Kho Trái Cây
          </button>
          <button
            type="button"
            className={`btn fw-bold px-4 py-2 ${activeTab === 'revenue' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => {
              setActiveTab('revenue');
              fetchRevenueReport(); // Refresh data whenever switching to this tab
            }}
          >
            Báo Cáo Doanh Thu Hôm Nay
          </button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
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
                        {/* Edit Button triggers the Bootstrap Modal popup */}
                        <button 
                          className="btn btn-outline-warning btn-sm fw-bold px-3 me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#editModal"
                          onClick={() => openEditModal(fruit)}
                        >
                          Sửa
                        </button>
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
      ) : (
        // Today's Revenue Report Dashboard
        <div>
          {/* 3 Summary Cards using Bootstrap Grid */}
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <div className="card shadow-sm border-danger text-center p-3 h-100">
                <h6 className="text-muted fw-bold text-uppercase">Tổng Doanh Thu Hôm Nay</h6>
                <h2 className="text-danger fw-bold my-2">
                  {revenueSummary.total_revenue.toLocaleString('vi-VN')} đ
                </h2>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card shadow-sm border-success text-center p-3 h-100">
                <h6 className="text-muted fw-bold text-uppercase">Tiền Mặt Thu Được</h6>
                <h2 className="text-success fw-bold my-2">
                  {revenueSummary.total_cash.toLocaleString('vi-VN')} đ
                </h2>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card shadow-sm border-primary text-center p-3 h-100">
                <h6 className="text-muted fw-bold text-uppercase">Tiền Chuyển Khoản (QR)</h6>
                <h2 className="text-primary fw-bold my-2">
                  {revenueSummary.total_transfer.toLocaleString('vi-VN')} đ
                </h2>
              </div>
            </div>
          </div>

          {/* Detailed Table of Today's Orders */}
          <div className="card shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-dark fw-bold mb-0">Lịch Sử Giao Dịch Trong Ngày</h4>
              <button className="btn btn-outline-secondary btn-sm fw-bold" onClick={fetchRevenueReport}>
                Làm mới số liệu
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th scope="col">Mã Đơn</th>
                    <th scope="col">Chi Tiết Trái Cây Đã Bán</th>
                    <th scope="col">Tiền Mặt</th>
                    <th scope="col">Chuyển Khoản</th>
                    <th scope="col">Tổng Hóa Đơn</th>
                    <th scope="col">Thời Gian</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        Hôm nay chưa có đơn hàng nào được ghi nhận.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td className="fw-bold">#{order.id}</td>
                        <td>{order.items_summary}</td>
                        <td className="text-success fw-semibold">
                          {order.cash_amount.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="text-primary fw-semibold">
                          {order.transfer_amount.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="text-danger fw-bold">
                          {order.total_amount.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="text-muted small">
                          {new Date(order.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Bootstrap 5 Modal for Editing Fruit Information */}
      <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header bg-warning text-dark">
                  <h5 className="modal-title fw-bold" id="editModalLabel">Cập Nhật Thông Tin Trái Cây</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Tên trái cây</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Giá bán mới (đ/kg)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Số lượng kho mới (kg)</label>
                      <input 
                        type="number"
                        step="0.1" 
                        className="form-control" 
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-warning w-100 fw-bold" data-bs-dismiss="modal">
                      Cập Nhật
                    </button>
                    <button type="button" className="btn btn-secondary w-100 fw-bold" data-bs-dismiss="modal">
                      Đóng
                    </button>
                  </div>
                </form>
            </div>
          </div>
      </div>
    </div>
  );
}

export default App;

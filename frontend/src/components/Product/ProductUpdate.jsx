import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductUpdate = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    stock: '',
    colors: [],
    tags: '',
    newImages: []
  });

  const [allImages, setAllImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost/web-hk242/backend/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const data = res.data.data;
      setForm({
        name: data.name,
        brand: data.brand,
        price: data.price,
        stock: data.stock,
        colors: data.colors || [],
        tags: data.tags?.join(', ') || '',
        newImages: []
      });
      setAllImages((data.images || []).map(img => ({
        ...img,
        url: `http://localhost/web-hk242/backend/uploads/img/${img.name}`
        })));
      console.log(data.images);
    }).catch(err => console.error(err));
  }, [id,token]);

  const handleImageDelete = (filename) => {
    setImagesToDelete(prev => [...prev, filename]);
    setAllImages(prev => prev.filter(img => img.name !== filename));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);

    // Tạo object preview
    const previews = files.map(file => ({
        name: file.name,
        base64: URL.createObjectURL(file), // dùng URL.createObjectURL để tạo đường dẫn tạm thời
        isTemp: true // gắn cờ để phân biệt ảnh mới chưa upload
    }));

    // Thêm vào danh sách hiển thị
    setAllImages(prev => [...prev, ...previews]);

    // Gán vào form để submit
    setForm({ ...form, newImages: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload ảnh mới
      const uploadedUrls = [];
      for (let file of form.newImages) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await axios.post('http://localhost/web-hk242/backend/products/image', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Kết quả trả về:", res);
        if (res.data.success) uploadedUrls.push(res.data.url);
      }

      // 2. Gửi danh sách ảnh cần xoá
      if (imagesToDelete.length > 0) {
        await axios.post('http://localhost/web-hk242/backend/products/image/delete', {
          filenames: imagesToDelete
        }, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        });
      }

      // 3. Gửi dữ liệu cập nhật
      const payload = {
        id,
        product: {
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
        },
        colors: form.colors,
        tags: typeof form.tags === 'string' 
            ? form.tags.split(',').map(t => t.trim()).filter(Boolean) 
            : form.tags,
        images: [
          ...allImages.filter(i => !i.isTemp).map(i => i.url),
          ...uploadedUrls
        ]
      };
      
      console.log("Payload gửi lên:", payload);
      const res = await axios.put(`http://localhost/web-hk242/backend/products`, payload, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      });
      alert('✅ Product updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('❌ Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Update Product</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Price</label>
                <input type="number" className="form-control" value={form.price || ''} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Stock</label>
                <input type="number" className="form-control" value={form.stock || ''} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>

              <div className="col-12">
                <label className="form-label">Colors</label>
                <input type="text" className="form-control" placeholder="e.g. red, blue" value={form.colors.join(', ')} onChange={e => setForm({ ...form, colors: e.target.value.split(',').map(c => c.trim()) })} />
              </div>

              <div className="col-12">
                <label className="form-label">Tags</label>
                <input type="text" className="form-control" placeholder="e.g. laptop, gaming" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              </div>

              <div className="col-12">
                <label className="form-label">Existing Images</label>
                <div className="d-flex flex-wrap gap-2">
                  {allImages.map((img, i) => (
                    <div key={i} className="position-relative" style={{ width: 200, height: 160 }}>
                    <img
                      src={img.base64}
                      alt="product"
                      className="img-thumbnail w-100 h-100 object-fit-cover rounded"
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 p-1"
                      style={{ transform: 'translate(30%, -30%)', borderRadius: '50%' }}
                      onClick={() => handleImageDelete(img.name)}
                      title="Remove image"
                    >
                      &times;
                    </button>
                  </div>
                  
                  ))}
                </div>
              </div>

              <div className="col-12">
                <label className="form-label">Upload New Images</label>
                <input type="file" className="form-control" multiple onChange={handleNewImages} />
              </div>

              <div className="col-12 text-end">
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;

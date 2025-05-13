import React, { useState } from "react";
import { FaImages } from "react-icons/fa";
import "./ProductUpload.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductUpload = () => {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    stock: "",
    published: "",
    cpu: "",
    storage: "",
    ram: "",
    pin: "",
    graphic_card: "",
    os: "",
    screen_size: "",
    weight: "",
    images: [],
    colors: [],
    tags: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const token = localStorage.getItem("token");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput] }));
      setTagInput("");
    }
  };

  const handleAddColor = () => {
    if (colorInput.trim() !== "") {
      setForm((prev) => ({ ...prev, colors: [...prev.colors, colorInput] }));
      setColorInput("");
    }
  };

  const removeTag = (index) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));
  };

  const removeColor = (index) => {
    setForm((prev) => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));
  };

  const handleImg = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const uploadImages = async () => {
    const uploadedUrls = [];
  
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append("image", file);
  
      try {
        const res = await fetch("http://localhost/web-hk242/backend/products/image", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });
  
        const data = await res.json();
        console.log(data);
        if (res.ok && data.success && data.url) {
          uploadedUrls.push(data.url);
          toast.success(`✅ Ảnh "${file.name}" đã upload thành công!`);
        } else {
          toast.error(`❌ Upload ảnh "${file.name}" thất bại: ${data.message || 'Unknown error'}`);
        }
      } catch (error) {
        toast.error(`❌ Upload ảnh "${file.name}" thất bại: ${error.message}`);
      }
    }
  
    return uploadedUrls;
  };
  

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("token");
      const uploadedImageUrls = await uploadImages();
      console.log("Uploaded image URLs:", uploadedImageUrls);
      const submissionData = {
        product: {
          name: form.name,
          brand: form.brand,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          published: form.published,
          cpu: form.cpu,
          storage: form.storage,
          ram: form.ram,
          pin: form.pin,
          graphic_card: form.graphic_card,
          os: form.os,
          screen_size: parseFloat(form.screen_size),
          weight: parseFloat(form.weight),
        },
        images: uploadedImageUrls,
        colors: form.colors,
        tags: form.tags
      };
      const response = await fetch("http://localhost/web-hk242/backend/products", {
        method: "POST",
        headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  },
        body: JSON.stringify(submissionData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("✅ Sản phẩm đã được upload thành công!");
        console.log(data);
      } else {
        toast.error("❌ Lỗi từ server: " + data.message)      }
    } catch (error) {
      console.error("Lỗi mạng hoặc server:", error);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h4 className="mb-4 fw-bold">Product Upload</h4>

      {/* BASIC INFORMATION */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Basic Information</h5>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input name="name" value={form.name} type="text" className="form-control" onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Published</label>
                <input type="date" className="form-control" name="published" value={form.published} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Tags</label>
                <div className="input-group mb-2">
                  <input type="text" className="form-control" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add a tag" />
                  <button type="button" className="btn btn-primary" onClick={handleAddTag}>Add</button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {form.tags.map((tag, index) => (
                    <span key={index} className="badge bg-secondary d-flex align-items-center">
                      {tag}
                      <button type="button" className="btn-close btn-close-white ms-2" style={{ fontSize: "0.6rem" }} onClick={() => removeTag(index)}></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Brand</label>
                <select className="form-select" name="brand" value={form.brand} onChange={handleChange}>
                  <option>Apple</option>
                  <option>Samsung</option>
                  <option>Lenovo</option>
                  <option>Microsoft</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Regular Price</label>
                <input type="text" className="form-control" name="price" value={form.price} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Colors</label>
                <div className="input-group mb-2">
                  <input type="text" className="form-control" value={colorInput} onChange={(e) => setColorInput(e.target.value)} placeholder="Add color" />
                  <button type="button" className="btn btn-primary" onClick={handleAddColor}>Add</button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {form.colors.map((color, idx) => (
                    <span key={idx} className="badge d-flex align-items-center" style={{ backgroundColor: color, color: "#fff" }}>
                      {color}
                      <button type="button" className="btn-close btn-close-white ms-2" style={{ fontSize: "0.6rem" }} onClick={() => removeColor(idx)}></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SPECIFICATION */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Specification</h5>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3"><label className="form-label">RAM</label><input type="text" name="ram" className="form-control" value={form.ram} onChange={handleChange} /></div>
              <div className="mb-3"><label className="form-label">Pin</label><input type="text" name="pin" className="form-control" value={form.pin} onChange={handleChange} /></div>
              <div className="mb-3"><label className="form-label">Weight</label><input type="text" name="weight" className="form-control" value={form.weight} onChange={handleChange} /></div>
              <div className="mb-3"><label className="form-label">CPU</label><input type="text" name="cpu" className="form-control" value={form.cpu} onChange={handleChange} /></div>
            </div>
            <div className="col-md-6">
              <div className="mb-3"><label className="form-label">Stock</label><input type="text" name="stock" className="form-control" value={form.stock} onChange={handleChange} /></div>
              <div className="mb-3"><label className="form-label">OS</label><input type="text" name="os" className="form-control" value={form.os} onChange={handleChange} /></div>
              <div className="mb-3"><label className="form-label">Screen Size</label><input type="text" name="screen_size" className="form-control" value={form.screen_size} onChange={handleChange} /></div>
              <div className="mb-3"><label className="form-label">Storage</label><input type="text" name="storage" className="form-control" value={form.storage} onChange={handleChange} /></div>
              <div className="mb-3"><label className="form-label">Graphic Card</label><input type="text" name="graphic_card" className="form-control" value={form.graphic_card} onChange={handleChange} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* MEDIA */}
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="fw-bold mb-5">Media And Publish</h5>
          <div className="mb-3 d-flex flex-wrap">
            {imageFiles.map((file, idx) => (
              <div key={idx} className="me-3 mb-3">
                <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} width="240" height="180" style={{ objectFit: "cover", borderRadius: 8 }} />
              </div>
            ))}
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ width: 240, height: 180, border: "2px dashed #aaa", cursor: "pointer", borderRadius: 8 }} onClick={() => document.getElementById("fileInput").click()}>
              <FaImages size={40} />
              <span>Upload</span>
              <input type="file" accept="image/*" multiple hidden id="fileInput" onChange={handleImg} />
            </div>
          </div>
          <button className="btn btn-primary w-100 mt-3" onClick={handleSubmit}>Publish and View</button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ProductUpload;

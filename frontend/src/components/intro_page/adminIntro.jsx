import React, { useEffect, useState } from "react";
import introService from "../../services/introServices";
import { toast } from "react-toastify";
import styles from "./adminIntro.module.css";

export default function adminIntro() {
  const [introData, setIntroData] = useState({
    company_overview: { title: "", content: "", image_path: "" },
    about_us: { title: "", content: "", image_path: "" },
    one_step_service: { title: "", content: "", image_path: "" },
    sustainability: { title: "", content: "", image_path: "" },
    contact_us: { title: "", content: "", image_path: "" },
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState({});
  const [activeSection, setActiveSection] = useState("company_overview");
  const [error, setError] = useState(null);

  // Fetch data intro
  useEffect(() => {
    const fetchIntroData = async () => {
      try {
        setLoading(true);
        // Using the same API as the frontend
        const res = await introService.getIntroContent();
        if (res.status === "success") {
          const organizedData = res.data.reduce((acc, item) => {
            acc[item.section_key] = item;
            return acc;
          }, {});
          setIntroData(organizedData);
        } else {
          throw new Error("Failed to fetch intro data");
        }
      } catch (err) {
        console.error("Error fetching intro data: ", err);
        setError("Failed to load content. Please try again later.");
        toast.error("Failed to load intro content");
      } finally {
        setLoading(false);
      }
    };

    fetchIntroData();
  }, []);

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    setIntroData({
      ...introData,
      [section]: {
        ...introData[section],
        [field]: value,
      },
    });
  };

  // Handle content update
  const handleUpdateContent = async (section_key) => {
    try {
      setUpdating(true);
      const { title, content } = introData[section_key];
      const response = await introService.updateIntro(
        section_key,
        title,
        content
      );

      if (response.status === "success") {
        toast.success(`${section_key} content updated successfully`);
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error("Error updating content: ", err);
      toast.error(err.message || "Failed to update content");
    } finally {
      setUpdating(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (section_key, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, JPG, PNG, GIF)");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file size must be less than 2MB");
      return;
    }

    try {
      setUploading({ ...uploading, [section_key]: true });
      const response = await introService.updateImgIntro(section_key, file);

      if (response.status === "success") {
        setIntroData({
          ...introData,
          [section_key]: {
            ...introData[section_key],
            image_path: response.image_path,
          },
        });
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Error uploading image: ", err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploading({ ...uploading, [section_key]: false });
    }
  };

  const sectionNames = {
    company_overview: "Company Overview",
    about_us: "About Us",
    one_step_service: "One Step Service",
    sustainability: "Sustainability",
    contact_us: "Contact Us",
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body d-flex justify-content-center align-items-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading intro content...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-body d-flex justify-content-center align-items-center p-5">
              <div className="alert alert-danger">{error}</div>
              <button
                className="btn btn-primary mt-3"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid page-heading p-sm-4 p-0">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Manage Intro Page Content</h3>
            <p className="text-subtitle text-muted">
              Edit content sections of the introduction page
            </p>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/admin/dashboard">Dashboard</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Intro Page
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <section className="section">
        <div className="card mb-4">
          <div className="row">
            <div className="col-md-4 pe-md-0">
              <div className="card-header">
                <h4>Content Sections</h4>
              </div>
              <div className="card-content">
                <div className={`card-body ${styles.cardBody}`}>
                  <div className="list-group">
                    {Object.keys(sectionNames).map((key) => (
                      <button
                        key={key}
                        type="button"
                        className={`
                      list-group-item list-group-item-action ${
                        activeSection === key ? "active" : ""
                      }`}
                        onClick={() => setActiveSection(key)}
                      >
                        {sectionNames[key]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-8 ps-md-0">
              <div className="card-header">
                <h4>Edit {sectionNames[activeSection]}</h4>
              </div>
              <div className="card-content">
                <div className="card-body">
                  <form>
                    <div className="form-group mb-3">
                      <label htmlFor="title" className="mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={introData[activeSection]?.title || ""}
                        onChange={(e) => {
                          handleInputChange(
                            activeSection,
                            "title",
                            e.target.value
                          );
                        }}
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label htmlFor="content" className="mb-1">
                        Content
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="content"
                        value={introData[activeSection]?.content || ""}
                        onChange={(e) => {
                          handleInputChange(
                            activeSection,
                            "content",
                            e.target.value
                          );
                        }}
                      />
                    </div>

                    {introData[activeSection]?.image_path && (
                      <div className="form-group mb-3">
                        <label>Current Image</label>
                        <div className="mt-2 mb-3">
                          <img
                            src={`http://localhost/web-hk242/backend/${introData[activeSection].image_path}`}
                            alt={introData[activeSection].title}
                            className="img-fluid"
                            style={{ maxHeight: "200px" }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="form-group mb-4">
                      <label htmlFor="image" className="mb-1">
                        Update Image
                      </label>
                      <input
                        type="file"
                        id="image"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(activeSection, e)}
                      />
                      <small className="text-muted">
                        Recommended image size: 800x600px, max 2MB, formats:
                        JPG, PNG, GIF
                      </small>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleUpdateContent(activeSection)}
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import api from "./api";

const introService = {
  /**
   * Lấy giá trị nội dung (Intro Content)
   * @returns {Promise}
   */
  getIntroContent: async () => {
    try {
      const response = await api.get("/intro");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { status: "error", message: "Request failed" }
      );
    }
  },
  /**
   * Cập nhật nội dung phần giới thiệu (Intro Content)
   * @param {string} section_key - Khóa định danh cho phần nội dung
   * @param {string} title - Tiêu đề mới
   * @param {string} content - Nội dung mới
   * @returns {Promise}
   */
  updateIntro: async (section_key, title, content) => {
    try {
      const response = await api.put("/admin/intro", {
        section_key,
        title,
        content,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { status: "error", message: "Request failed" }
      );
    }
  },

  /**
   * Upload ảnh cho phần giới thiệu
   * @param {string} section_key - Khóa định danh
   * @param {File} imageFile - File ảnh (type: File)
   * @returns {Promise}
   */
  updateImgIntro: async (section_key, imageFile) => {
    const formData = new FormData();
    formData.append("section_key", section_key);
    formData.append("image", imageFile);

    try {
      const response = await api.post("/admin/intro/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { status: "error", message: "Request failed" }
      );
    }
  },
};

export default introService;

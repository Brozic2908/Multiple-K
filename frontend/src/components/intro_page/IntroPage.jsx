import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./IntroPage.module.css";

// Import images
import introHeader from "../../assets/img/Intro/intro_header.png";
import introHeaderXs from "../../assets/img/Intro/kv-about-index-xs.jpg";
import introService from "../../services/introServices";

export default function IntroPage() {
  const [introData, setIntroData] = useState({
    company_overview: {},
    about_us: {},
    one_step_service: {},
    sustainability: {},
    contact_us: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIntroData = async () => {
      try {
        const res = await introService.getIntroContent();

        if (res.status === "success") {
          // Organaize data by section_key
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
      } finally {
        setLoading(false);
      }
    };

    fetchIntroData();
  }, [loading]);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-danger">{error}</div>;
  }

  function isLoading() {
    return "Đang tải nội dung ...";
  }

  return (
    <div className={`${styles.introMain}`}>
      <header className={styles.aboutHeader}>
        <div className={styles.introHeader}>
          <img
            className={`${styles.introImgHeader} d-none d-lg-block`}
            src={introHeader}
          />
          <img
            className={`${styles.introImgHeader} d-block d-lg-none`}
            src={introHeaderXs}
          />
          <p className={styles.introHeaderText}>VỀ MK</p>
        </div>
        <div className={styles.description}>
          <div className={`commonContainer text-center`}>
            <div className={styles.descriptionTitle}>
              {introData.company_overview?.title || "Tổng quan về công ty"}
            </div>
            <div className={styles.descriptionText}>
              {introData.company_overview?.content || isLoading()}
            </div>
          </div>
        </div>
        <div className={`commonContainer`}>
          <div className={`${styles.introCard} row`}>
            <div className="col-lg-4">
              <div>
                <div className={`${styles.introCardTitle} text-center`}>
                  {introData.about_us?.title || "Về chúng tôi"}
                </div>
                <div>
                  <img
                    className={styles.introCardImg}
                    src={`http://localhost/web-hk242/backend/${introData.about_us?.image_path}`}
                  ></img>
                </div>
                <div className={styles.introCardText}>
                  {introData.about_us?.content || isLoading()}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div>
                <div className={`${styles.introCardTitle} text-center`}>
                  {introData.one_step_service?.title || "Dịch vụ MỘT CHẠM"}
                </div>
                <div>
                  <img
                    className={styles.introCardImg}
                    src={`http://localhost/web-hk242/backend/${introData.one_step_service?.image_path}`}
                  ></img>
                </div>
                <div className={styles.introCardText}>
                  {introData.one_step_service?.content || isLoading()}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div>
                <div className={`${styles.introCardTitle} text-center`}>
                  {introData.sustainability?.title || "Bền vững"}
                </div>
                <div>
                  <img
                    className={styles.introCardImg}
                    src={`http://localhost/web-hk242/backend/${introData.sustainability?.image_path}`}
                  ></img>
                </div>
                <div className={styles.introCardText}>
                  {introData.sustainability?.content || isLoading()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <figure className={`${styles.contactUsImg}`}>
          <img
            className={`${styles.contactUsImgMobile} d-block d-lg-none`}
            src={`http://localhost/web-hk242/backend/${introData.contact_us?.image_path}`}
          ></img>
        </figure>
        <div className={styles.contactUs}>
          <div className="commonContainer">
            <div className={`${styles.contactUsBlock}`}>
              <div className={styles.contactUsTitle}>
                {introData.contact_us?.title || "Contact Us"}
              </div>
              <div className={styles.contactUsText}>
                {introData.contact_us?.content || isLoading()}
              </div>
              <div className={styles.contactUsLink}>
                <div className={styles.contactUsButton}>
                  <NavLink
                    className={`${styles.supportLink} contactUsLinkSupport`}
                    to="/questions"
                  >
                    Our Support{" "}
                    <i
                      className={`${styles.contactUsIcon} fa-solid fa-chevron-right`}
                    ></i>
                  </NavLink>
                </div>
                <div className={styles.contactUsButton}>
                  <NavLink
                    className={`${styles.supportLink} contactUsLinkContact`}
                    to="/contact"
                  >
                    Liên hệ với chúng tôi{" "}
                    <i
                      className={`${styles.contactUsIcon} fa-solid fa-chevron-right`}
                    ></i>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

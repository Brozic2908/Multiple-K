import { NavLink } from 'react-router-dom'
import styles from './IntroPage.module.css'

// Import images
import introHeader from "../../assets/img/Intro/intro_header.png"
import introHeaderXs from '../../assets/img/Intro/kv-about-index-xs.jpg'
import aboutUsImg from '../../assets/img/Intro/banner-about-index-aboutus.jpg'
import oneStepServiceImg from '../../assets/img/Intro/banner-about-index-one-step-service.jpg'
import sustainabilityImg from '../../assets/img/Intro/banner-about-index-sustainability.jpg'
import contactUsMobileImg from '../../assets/img/Intro/banner-about-index-contact-xs.jpg'

export default function IntroPage() {

    return (
        <div className={`${styles.introMain}`}>
            <header className={styles.aboutHeader}>
                <div className={styles.introHeader}>
                    <img className={`${styles.introImgHeader} d-none d-lg-block`} src={introHeader} />
                    <img className={`${styles.introImgHeader} d-block d-lg-none`} src={introHeaderXs} />
                    <p className={styles.introHeaderText}>VỀ MK</p>
                </div>
                <div className={styles.description}>
                    <div className={`commonContainer text-center`}>
                        <div className={styles.descriptionTitle}>Tổng quan về công ty</div>
                        <div className={styles.descriptionText}>MK là công ty hàng đầu thế giới về AI PC, thiết bị chơi game, sáng tạo nội dung, kinh doanh & năng suất cũng như các giải pháp AIoT. Với động lực từ khả năng R&D tiên tiến và sự đổi mới hướng đến khách hàng, MK đã có mặt rộng khắp trên toàn cầu, trải dài trên 120 quốc gia. Dòng sản phẩm toàn diện bao gồm máy tính xách tay, card đồ họa, màn hình, bo mạch chủ, máy tính để bàn, thiết bị ngoại vi, máy chủ, IPC, thiết bị robot, hệ thống thông tin giải trí và viễn thông trên xe cũng như bộ sạc EV được đánh giá cao trên toàn thế giới. Cam kết nâng cao trải nghiệm người dùng thông qua chất lượng sản phẩm tốt nhất, giao diện người dùng trực quan và thiết kế thẩm mỹ, MK là thương hiệu hàng đầu định hình tương lai của công nghệ. </div>
                    </div>
                </div>
                <div className={`commonContainer`}>
                    <div className={`${styles.introCard} row`}>
                        <div className='col-lg-4'>
                            <div>
                                <div className={`${styles.introCardTitle} text-center`}>Về chúng tôi</div>
                                <div ><img className={styles.introCardImg} src={aboutUsImg}></img></div>
                                <div className={styles.introCardText}>MK là thương hiệu hàng đầu trong lĩnh vực sản phẩm chơi game và sáng tạo, không ngừng đổi mới để mang đến những trải nghiệm vượt trội cho người dùng trên toàn thế giới.</div>
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div>
                                <div className={`${styles.introCardTitle} text-center`}>Dịch vụ MỘT CHẠM</div>
                                <div ><img className={styles.introCardImg} src={oneStepServiceImg}></img></div>
                                <div className={styles.introCardText}>Chúng tôi cung cấp hệ thống dịch vụ tùy biến, đáp ứng mọi nhu cầu của khách hàng, đảm bảo sự tiện lợi và hiệu quả tối đa trong quá trình sử dụng sản phẩm MK.</div>
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div>
                                <div className={`${styles.introCardTitle} text-center`}>Bền vững</div>
                                <div ><img className={styles.introCardImg} src={sustainabilityImg}></img></div>
                                <div className={styles.introCardText}>MK cam kết bảo vệ môi trường, nâng cao an toàn sức khỏe và thực hiện trách nhiệm xã hội, hướng đến sự phát triển bền vững cho cộng đồng và thế hệ tương lai.</div>
                            </div>
                        </div>
                    </div>
                </div>
                <figure className={`${styles.contactUsImg}`}>
                    <img className={`${styles.contactUsImgMobile} d-block d-lg-none`} src={contactUsMobileImg}></img>
                </figure>
                <div className={styles.contactUs}>
                    <div className='commonContainer'>
                    <div className={`${styles.contactUsBlock}`}>
                        <div className={styles.contactUsTitle}>Contact Us</div>
                        <div className={styles.contactUsText}>Cảm ơn bạn đã ủng hộ sản phẩm MK. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua trang Dịch vụ khách hàng trực tuyến. Chúng tôi sẽ phản hồi nhanh nhất có thể.</div>
                        <div className={styles.contactUsLink}>
                            <div className={styles.contactUsButton}>
                            <NavLink className={`${styles.supportLink} contactUsLinkSupport`} to="/questions">Our Support <i className={`${styles.contactUsIcon} fa-solid fa-chevron-right`}></i></NavLink>
                            </div>
                            <div className={styles.contactUsButton}>
                            <NavLink className={`${styles.supportLink} contactUsLinkContact`} to="/contact">Liên hệ với chúng tôi <i className={`${styles.contactUsIcon} fa-solid fa-chevron-right`}></i></NavLink>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>

            </header>
        </div>
    )
}
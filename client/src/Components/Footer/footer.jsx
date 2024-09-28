// Footer.jsx
import React from 'react';
import './footer.css'; // Optional: create a separate CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div class="FooterModule__FooterModule-module__container">
                    <div class="Menu__Menu-module__logoBox">
                        <div class="Menu__Menu-module__logo" aria-label="Glassdoor Logo">
                            <h1>OpportuNest</h1>
                        </div>
                    </div>
                    <div class="LinkList__LinkList-module__wrapper" data-test="footer-link-list">
                        <ul class="LinkList__LinkList-module__container">
                            <li class="LinkList__LinkList-module__title">OpportuNest</li>
                            <li class="LinkList__LinkList-module__item"><a class="LinkList__LinkList-module__link" href="https://www.glassdoor.com/about/" target="_blank" data-test="footer-about-press-link">About / Press</a></li>
                            <li class="LinkList__LinkList-module__item"><a class="LinkList__LinkList-module__link" href="https://www.glassdoor.com/blog/" target="_top" data-test="footer-blog-link">Blog</a></li>
                            <li class="LinkList__LinkList-module__item"><a class="LinkList__LinkList-module__link" href="https://help.glassdoor.com/ContactUs/en_US/" target="_blank" data-test="footer-contact-us-link">Contact Us</a></li>
                        </ul>
                        <ul class="LinkList__LinkList-module__container">
                            <li class="LinkList__LinkList-module__title">Employers</li>
                            <li class="LinkList__LinkList-module__item"><a class="LinkList__LinkList-module__link" href="https://www.glassdoor.com.hk/employers/sign-up/?src=gdfoot" target="_top" data-test="footer-employer-account-link">Get a FREE Employer Account</a></li>
                            <li class="LinkList__LinkList-module__item"><a class="LinkList__LinkList-module__link" href="/employers/ec/index.htm" target="_top" data-test="footer-employer-center-link">Employer Centre</a></li>
                        </ul>
                        <ul class="LinkList__LinkList-module__container">
                            <li class="LinkList__LinkList-module__title">Information</li>
                            <li class="LinkList__LinkList-module__item"><a class="LinkList__LinkList-module__link" href="https://help.glassdoor.com" target="_blank" data-test="footer-help-link">Help</a></li>
                            <li class="LinkList__LinkList-module__item"><a class="LinkList__LinkList-module__link" href="https://help.glassdoor.com/article/Community-Guidelines/en_US" target="_blank" data-test="footer-guidelines-link">Guidelines</a></li>
                            <li class="LinkList__LinkList-module__item"><a class="LinkList__LinkList-module__link" href="/about/terms/" target="_top" data-test="footer-terms-of-use-link">Terms of Use</a></li>
                            <li class="LinkList__LinkList-module__item"><a class="LinkList__LinkList-module__link" href="https://hrtechprivacy.com/brands/glassdoor#privacypolicy" target="_top" data-test="footer-privacy-choices-link">Privacy and Ad Choices</a></li>
                            <li class="LinkList__LinkList-module__item"><a class="LinkList__LinkList-module__link" href="/about/doNotSell.htm" data-test="footer-do-not-sell-link">Do Not Sell Or Share My Information</a></li>
                            <li class="LinkList__LinkList-module__item"><a class="cookies LinkList__LinkList-module__link" href="#" data-test="footer-cookie-consent-link">Cookie Consent Tool</a></li>
                        </ul>
                        <ul class="LinkList__LinkList-module__container">
                            <li class="LinkList__LinkList-module__title">Work With Us</li>
                            <li class="LinkList__LinkList-module__item"><a class="LinkList__LinkList-module__link" href="https://www.glassdoor.com/post-job/" target="_blank" data-test="footer-advertisers-link">Advertisers</a></li>
                            <li class="LinkList__LinkList-module__item"><a class="LinkList__LinkList-module__link" href="/Jobs/Glassdoor-Jobs-E100431.htm" target="_top" data-test="footer-careers-link">Careers</a></li>
                        </ul>
                    </div>
                </div>
                <hr className="divider m-0" />
                <div className="browse-section">
                    <span className="browse-title">Browse by:</span>
                    <ul className="browse-items">
                        <li className="browse-item"><a href="/sitedirectory/company-jobs.htm" target="_top">Companies</a></li>
                        <li className="browse-item"><a href="/sitedirectory/title-jobs.htm" target="_top">Jobs</a></li>
                        <li className="browse-item"><a href="/sitedirectory/city-jobs.htm" target="_top">Locations</a></li>
                        <li className="browse-item"><a href="/sitedirectory/communities.htm" target="_top">Communities</a></li>
                        <li className="browse-item"><a href="/sitedirectory/recent-posts.htm" target="_top">Recent posts</a></li>
                    </ul>
                </div>

                <p>Copyright © 2024-2024, OpportuNest LLC. "OportuNest" and logo are registered trademarks of OpportuNest LLC.</p>
            </div>
        </footer>
    );
}

export default Footer;

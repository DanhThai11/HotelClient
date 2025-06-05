import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  const today = new Date(); // Đảm bảo biến today được khai báo đúng

  return (
    <footer className="bg-dark text-light py-4 mt-lg-5">
      <Container>
        <Row className="mb-3">
          <Col xs={12} md={4} className="text-center text-md-start">
            <h5 className="mb-3">LakeSide Hotel</h5>
            <p className="small">
              Experience luxury and comfort at LakeSide Hotel. Book your stay
              with us for an unforgettable experience.
            </p>
          </Col>
          <Col xs={12} md={4} className="text-center">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="text-light text-decoration-none">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-light text-decoration-none">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-light text-decoration-none">
                  FAQ
                </a>
              </li>
            </ul>
          </Col>
          <Col xs={12} md={4} className="text-center text-md-end">
            <h5 className="mb-3">Contact</h5>
            <p className="small mb-1">Email: danhthai11112003@gmail.com</p>
            <p className="small mb-1">Phone: +84 901 398 337</p>
            <p className="small">Address: Đại Học Tài Nguyên và Môi Trường</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="text-center">
            <p className="mb-0 small">
              &copy; {today.getFullYear()} LakeSide Hotel. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

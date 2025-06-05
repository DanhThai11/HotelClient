import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const Error404 = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center">
        <Col md={8} lg={6}>
          <div className="error-container">
            <FaExclamationTriangle
              className="error-icon mb-4"
              size={80}
              color="#dc3545"
            />
            <h1 className="display-1 fw-bold text-danger mb-4">404</h1>
            <h2 className="mb-4">Trang không tồn tại</h2>
            <p className="text-muted mb-5">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc bạn không có
              quyền truy cập vào trang này.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button
                as={Link}
                to="/"
                variant="primary"
                size="lg"
                className="px-4"
              >
                Về trang chủ
              </Button>
              <Button
                variant="outline-primary"
                size="lg"
                className="px-4"
                onClick={() => window.history.back()}
              >
                Quay lại
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <style jsx>{`
        .error-container {
          padding: 3rem;
          border-radius: 1rem;
          background-color: #f8f9fa;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
        .error-icon {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </Container>
  );
};

export default Error404;

import React, { useState, useEffect } from "react";
import { Col, Row, Modal } from "antd";
import Image from "next/image";
import styles from "../storeGallery/styles.module.css";
import slideRight from "../../assets/images/slide-right.png";
import slideLeft from "../../assets/images/slide-left.png";
const StoreGallery = ({ gallery, fullAccess }) => {
  const [showImg, setShowImg] = useState(false);
  const [initialImg, setInitialImg] = useState(0);
  const showImage = (url, i) => {
    setInitialImg(i);
    setShowImg(true);
  };
  return (
    <>
      <div className={styles.section_wrapper}>
        <div className={styles.section_content_wrapper}>
          <h1 className={styles.section_heading}>Store Gallery</h1>
          <Row gutter={[16, 16]}>
            {gallery.slice(0, fullAccess ? 25 : 10).map((ele, index) => (
              <Col xs={12} sm={12} md={8} lg={6} xl={6} key={ele.id}>
                <div
                  className={styles.image_container}
                  onClick={() => showImage(ele.url, index)}
                >
                  <div className={styles.store_img}>
                    <Image
                      src={ele.url}
                      alt="alt"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <Modal
        open={showImg}
        footer={null}
        onCancel={() => setShowImg(!showImg)}
        className="gallery-modal"
      >
        <div className="d-flex center align-center">
          <div>
            <Image
              src={slideLeft}
              alt="Left"
              width={40}
              height={40}
              onClick={() =>
                setInitialImg(
                  initialImg == 0 ? gallery.length - 1 : initialImg - 1
                )
              }
              className="cursor"
            />
          </div>
          <div>
            <Image
              src={gallery[initialImg].url}
              alt="Gallery"
              width={500}
              height={500}
            />
          </div>
          <div>
            <Image
              src={slideRight}
              alt="Right"
              width={40}
              height={40}
              onClick={() =>
                setInitialImg(
                  initialImg == gallery.length - 1 ? 0 : initialImg + 1
                )
              }
              className="cursor"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default StoreGallery;

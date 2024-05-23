import React from "react";
import { Col, Row } from "antd";
import Image from "next/image";
import styles from "../client/styles.module.css";
import client1 from "../../assets/images/client1.svg";
import client2 from "../../assets/images/client2.svg";
import client3 from "../../assets/images/client3.svg";
import client4 from "../../assets/images/client4.svg";
import { imageBaseUrl } from "../../util/baseUrl";
const Client = (props) => {
  // const clientData = [
  //   {
  //     id: 1,
  //     clientImg: client1,
  //   },
  //   {
  //     id: 2,
  //     clientImg: client2,
  //   },
  //   {
  //     id: 3,
  //     clientImg: client3,
  //   },
  //   {
  //     id: 4,
  //     clientImg: client4,
  //   },
  // ];

  return (
    <div className={styles.section_wrapper}>
      <div className={styles.section_content_wrapper}>
        <h1 className={styles.section_heading}>Our Clients</h1>
        <Row gutter={[16, 16]} justify={"center"}>
          {props.client.map((ele) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={ele.id}>
              <div className={styles.client_content_wrapper}>
                <Image
                    src={`${ele?.url}`}
                    alt="client_image"
                    objectFit="contain"
                    width={180}
                    height={180}
                  />
              </div>
              {/* <div className={styles.client_content_wrapper}>
                <div className={styles.image_container}>
                  <Image
                    src={`${ele?.url}`}
                    alt="client_image"
                    width={"100%"}
                    height={"100%"}
                    fill
                    objectFit="contain"
                    sizes="(max-width: 768px) 100vw,
            (max-width: 1200px) 50vw,
            33vw"
                  />
                </div>
              </div> */}
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Client;

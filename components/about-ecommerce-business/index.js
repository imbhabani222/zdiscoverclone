import { Button, Col, Row, Drawer, Input, Checkbox, Tooltip, Form } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import napperFurniture from "../../assets/images/napper-furniture.svg";
import styles from "../about-ecommerce-business/styles.module.css";
import facebookIcon from "../../assets/images/fb-logo.svg";
import instagramIcon from "../../assets/images/insta-logo.svg";
import twitterIcon from "../../assets/images/twitter-logo.svg";
import youtubeIcon from "../../assets/images/youtube.png";
import linkedinIcon from "../../assets/images/linkedin-logo.svg";
import pinterestIcon from "../../assets/images/pinterest.png";
import qrCode from "../../assets/images/scanQrCode.svg";
import { baseUrl, imageBaseUrl } from "../../util/baseUrl";
import Cookies from "universal-cookie";
const { Search } = Input;

const cookies = new Cookies();
const token = cookies.get("loginToken");
const AboutEcommerceBusiness = (props) => {
  const [form] = Form.useForm();

  async function addStoreDetails(values) {
    const payload = { ...values, url: props.storeUrl };
    console.log({ props });
    let data = await fetch(`/api/getintouch`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res = await data.json();
    if (res.status) {
      console.log(res.data);
      // message.success(res?.data?.message);
      // setLoading(false);
      form.resetFields();
    } else {
      // alert("error")
      // setLoading(false);
      // message.error("Failed!");
    }
  }
  return (
    <div className={styles.main_div}>
      <div className={styles.about_heading}>About Our Business</div>
      <div className={styles.business_info}>
        <Row gutter={[24, 8]}>
          {props.featureImg ? (
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Image
                src={`${props.featureImg}`}
                alt="Feature image"
                style={{ objectFit: "contain", borderRadius: "6px" }}
                width={700}
                height={400}
              />
            </Col>
          ) : (
            ""
          )}
          {props.featureImg ? (
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              style={{ textAlign: "justify" }}
            >
              {/* {props.description} */}
              <div
                dangerouslySetInnerHTML={{ __html: props.description }}
              ></div>
            </Col>
          ) : (
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              style={{ textAlign: "justify" }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: props.description }}
              ></div>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default AboutEcommerceBusiness;

import React, { useState } from "react";
import {
  Col,
  Row,
  Form,
  Input,
  Progress,
  Button,
  Rate,
  message,
  Spin,
} from "antd";
import "antd/dist/antd.css";
import Image from "next/image";
import styles from "../getInTouch/styles.module.css";
import InfoImage from "../../assets/images/Infography.svg";
import Cookies from "universal-cookie";
import Icon, { Loading3QuartersOutlined } from "@ant-design/icons";
import axios from "axios";

const cookies = new Cookies();
const token = cookies.get("loginToken");
const { TextArea } = Input;
const GetInTouch = (props) => {
  const antIcon = (
    <Loading3QuartersOutlined
      style={{ fontSize: 50, color: props.themeColor }}
      spin
    />
  );
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const style_ = {
    inputStyle: {
      color: props.themeColor,
    },
    btnBgColor: {
      background: props.themeColor,
    },
  };
  const onFinish = async (values) => {
    setLoading(true);
    let description = values.descriptions.replace(/  +/g, " ");
    if (
      description.charAt(0) == " " &&
      description.charAt(description.length - 1) == " "
    ) {
      let subString = description.substring(1, description.length - 1);
      description = subString;
    } else if (description.charAt(0) == " ") {
      let subString = description.substring(1);
      description = subString;
    } else if (description.charAt(description.length - 1) == " ") {
      let subString = description.substring(0, description.length - 1);
      description = subString;
    }
    const value = { ...values, descriptions: description };
    const payload = {
      ...value,
      storeid: props.storeId,
      iswhatsapp: false,
      isemail: false,
      isgetintouch: true,
    };
    let data = await fetch(`/api/getintouch`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res = await data.json();
    if (res.status) {
      message.success(res?.data?.message);
      setLoading(false);
      form.resetFields();
    } else {
      setLoading(false);
      message.error("Internal Server Error");
    }
  };
  return (
    <Spin spinning={!!isLoading} indicator={antIcon}>
      <div className={styles.section_wrapper}>
        <div className={styles.section_content_wrapper}>
          <h1 className={styles.section_heading} style={style_.inputStyle}>
            Get In Touch
          </h1>
          <Row gutter={[48, 40]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <p className={styles.section_para}>
                Fill up the form and our Team Will get back to you within 24
                hours.
              </p>
              <Form
                requiredMark={false}
                name="contact_details"
                onFinish={onFinish}
                form={form}
              >
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your name",
                    },
                    {
                      pattern: /^(?!\s).*/,
                      message: "Please input a valid name",
                    },
                  ]}
                >
                  <Input
                    placeholder="Your Name*"
                    className={styles.inputStyle}
                    onKeyPress={(e) => {
                      if (/^[^ A-Za-z_./&-]*$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item
                      name="mobileno"
                      rules={[
                        {
                          required: true,
                          message: "Please input your mobile no",
                        },
                      ]}
                    >
                      <Input
                        maxLength={10}
                        minLength={10}
                        placeholder="Mobile No*"
                        className={styles.inputStyle}
                        onKeyPress={(e) => {
                          if (/[^0-9 ]/.test(e.key) || e.charCode === 32) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          type: "email",
                          required: true,
                          message: "Please input your email Id",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Email Id*"
                        className={styles.inputStyle}
                        onKeyPress={(e) => {
                          if (
                            /^[^ A-Za-z0-9_./@-]*$/.test(e.key) ||
                            e.charCode === 32
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="subject"
                  rules={[
                    {
                      required: true,
                      message: "Please input your subject",
                    },
                    {
                      pattern: /^(?!\s).*/,
                      message: "Please input a valid subject",
                    },
                  ]}
                >
                  <Input placeholder="Subject*" className={styles.inputStyle} />
                </Form.Item>
                <Form.Item
                  name="descriptions"
                  rules={[
                    {
                      required: true,
                      message: "Please input your messages",
                    },
                    // {
                    //   //pattern: /^[^\s].+[^\s{2}]$/g,
                    //   //pattern: /^[^\s].+[^\s{0,1}]$/g,
                    //   pattern:/^([a-zA-Z0-9@#!.,$%&*()}{]+\s)*[a-zA-Z0-9@#!.,$%&*()}{]+$/g,
                    //   message: "Invalid Message",
                    // }
                  ]}
                >
                  <TextArea
                    maxLength={300}
                    rows={6}
                    placeholder="Type Your Message*"
                    className={styles.inputStyle}
                    onKeyPress={(e) => {
                      if (e.target.value[0] == " ") {
                        let x = e.target.value.substring(1);
                        e.target.value = x;
                      }
                      if (e.key == " ") {
                        let x = e.target.value.replace(/  +/g, " ");
                        e.target.value = x;
                      }
                    }}
                  />
                </Form.Item>
                {/* <Form.Item> */}
                <Button
                  style={style_.btnBgColor}
                  className={styles.section_contact_btn}
                  htmlType="submit"
                >
                  Submit
                </Button>
                {/* </Form.Item> */}
              </Form>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              className={styles.right_side_col}
            >
              <div className={styles.right_side}>
                <Image {...InfoImage} alt="alt" />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default GetInTouch;

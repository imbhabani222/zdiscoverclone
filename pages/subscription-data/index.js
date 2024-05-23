import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Col, Row, Form, Input, Button, message, Checkbox } from "antd";
import styles from "./zohoSubscription.module.css";
import Cookies from "universal-cookie";
import { Spin } from "antd";
import Icon, { Loading3QuartersOutlined } from "@ant-design/icons";
import axios from "axios";
import { baseUrl } from "../../util/baseUrl";
const antIcon = (
  <Loading3QuartersOutlined style={{ fontSize: 50, color: "#5902b3" }} spin />
);
const cookies = new Cookies();
const token = cookies.get("loginToken");
const storeid = cookies.get("storeid");
const userId = cookies.get("_id");
const userSubsriptionId = cookies.get("subscrition_id");
const userEmail = cookies.get("email");
const userPhone = cookies.get("phone");
const userPlanCode = cookies.get("plancode");

const ZohoSubsciption = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    checkUserData();
  }, []);

  const checkUserData = async () => {
    let subData = await axios.get(`${baseUrl}get-user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    if (subData.data.code === 200) {
      let {email, phoneNumber} = subData.data.data;
      if (email !== undefined) {
        form.setFieldsValue({
          email: email,
        });
      }
      if (phoneNumber !== undefined) {
        form.setFieldsValue({
          mobile: phoneNumber,
        });
      }
    }
  };
  const [checkedRenewal, setCheckedRenewal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const changeCheckedRenewal = (e) => {
    setCheckedRenewal(e.target.checked);
  };
  const onFinish = async (values) => {
    setLoading(true);
    console.log(values);

    const payload = {
      firstName: values.firstname,
      lastName: values.lastname,
      displayName: `${values.firstname}_${values.lastname}_${
        userPhone !== "" ? userPhone : values.mobile
      }`,
      email: userEmail !== "" ? userEmail : values.email,
      mobile: userPhone !== "" ? userPhone : values.mobile,
      isRenewal: checkedRenewal,
      planCode: userPlanCode,
      subscriptionId: userSubsriptionId,
      userId: userId,
    };

    let data = await fetch(`api/createSubscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    let res = await data.json();

    if (res.status) {
      // message.success(res?.data?.message);
      cookies.set("phone", userPhone !== "" ? userPhone : values.mobile);
      cookies.set("email", userEmail !== "" ? userEmail : values.email);
      router.push(res?.data?.data?.hostedpage?.url);
      form.resetFields();
    } else {
      message.error(res.msg);
      setLoading(false);
    }
    //console.log(res?.data?.data?.hostedpage?.url);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    //message.error(res?.data?.message);
  };

  return (
    <Spin spinning={!!isLoading} indicator={antIcon}>
      <div className={styles.section_wrapper}>
        <div className={styles.section_heading}>
          User details for subscription
        </div>

        <div className={styles.section_content_row2}>
          <Form
            form={form}
            requiredMark={false}
            name="user_details_subscription"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  name="firstname"
                  rules={[
                    {
                      required: true,
                      message: "Please input characters",
                      pattern: /^[a-zA-Z\s]*$/,
                    },
                    {
                      pattern: /^[^\s].+[^\s{0,1}]$/g,
                      message: "Spaces and numeric values are not allowed",
                    },
                  ]}
                >
                  <Input
                    placeholder="First name*"
                    className={styles.inputStyle}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  name="lastname"
                  rules={[
                    {
                      required: true,
                      message: "Please input characters",
                      pattern: /^[a-zA-Z\s]*$/,
                    },
                    {
                      pattern: /^[^\s].+[^\s{0,1}]$/g,
                      message: "Spaces and numeric values are not allowed",
                    },
                  ]}
                >
                  <Input
                    placeholder="Last name*"
                    className={styles.inputStyle}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  name="mobile"
                  rules={[
                    {
                      required: true,
                      message: "Please input your mobile no",
                    },
                    {
                      pattern: new RegExp(/^[0-9]{10}$/g),
                      message: "Only numeric values are allowed",
                    },
                  ]}
                >
                  <Input
                    maxLength={10}
                    minLength={10}
                    placeholder="Mobile No*"
                    className={styles.inputStyle}
                    disabled={userPhone && userPhone !== "" ? true : false}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email Id",
                      type: "email",
                    },
                  ]}
                >
                  <Input
                    placeholder="Email Id*"
                    className={styles.inputStyle}
                    disabled={userEmail && userEmail !== "" ? true : false}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item name="isRenewal" valuePropName="checked">
                  <Checkbox
                    checked={checkedRenewal}
                    onChange={changeCheckedRenewal}
                  >
                    Consent for auto renewal
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[8, 8]} justify={"end"} style={{ marginTop: "5rem" }}>
              {/* <Col xl={12} lg={12} md={12} sm={24} xs={24}></Col> */}
              <Col>
                <Form.Item>
                  <Button
                    className="store-mgt-btn store-mgt-cancel-btn-color  w-100  ml-1"
                    onClick={() => router.push(`/subscription-plan`)}
                  >
                    CANCEL
                  </Button>
                  <Button
                    className="store-mgt-btn store-mgt-btn-color w-100 ml-1"
                    htmlType="submit"
                  >
                    SAVE
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default ZohoSubsciption;

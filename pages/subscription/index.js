/* eslint-disable react/jsx-key */
import { Row, Col, message, Tabs, Checkbox } from "antd";
import React, { useState, useEffect } from "react";
import MasterLayout from "../../components/master-layout/MasterLayout";
import subscriptionStyle from "./subscription.module.css";
//import Pdf from "react-to-pdf";
import accept from "../../assets/images/accept.png";
import cancel from "../../assets/images/cancel.png";
//import termpdf from "../../public/document/terms.pdf";

import Image from "next/image";
import "antd/dist/antd.css";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
const { TabPane } = Tabs;
const cookies = new Cookies();

const subscriptionData = {
  allowedData: [
    { active: true, name: "Logo" },
    { active: false, name: "Banner" },
    { active: false, name: "Keyword" },
    { active: true, name: "Image (10)" },
    { active: true, name: "Address" },
    { active: true, name: "Contact Details" },
    { active: false, name: "About Us / Introduction" },
    { active: true, name: "URL for sharing" },
    { active: true, name: "Reviews" },
    { active: false, name: "Response to Reviews" },
    { active: false, name: "Enquiry Form" },
    { active: true, name: "Marketplace Access (INR50/Month)" },
  ],
};
const subscriptionData2 = {
  allowedData: [
    { active: true, name: "Logo" },
    { active: true, name: "Banner" },
    { active: true, name: "Keyword" },
    { active: true, name: "Image (25)" },
    { active: true, name: "Address" },
    { active: true, name: "Contact Details" },
    { active: true, name: "About Us / Introduction" },
    { active: true, name: "URL for sharing" },
    { active: true, name: "Reviews" },
    { active: true, name: "Response to Reviews" },
    { active: true, name: "Enquiry Form" },
    { active: true, name: "Marketplace Access (INR100/Month)" },
  ],
};
const SubscriptionPlan = () => {
  const router = useRouter();
  const [subscriptionArray, setSubscriptionArray] = useState([]);
  const [startDate, setStartDate] = useState(
    cookies.get("subscrition_date") ? cookies.get("subscrition_date") : ""
  );
  const [checkTerm, setCheckTerm] = useState(false);
  const [checkMou, setCheckMou] = useState(false);
  const [planName, setPlanName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [billingMethod, setBillingMethod] = useState("");
  const [subscriptionDataTop, setSubscriptionDataTop] = useState([
    { title: "Plan Name", value: "" },
    { title: "Subscription Date", value: "" },
    { title: "Subscription Renewal Date", value: "" },
    { title: "Billing Method", value: "" },
  ]);
  const storeid = cookies.get("storeid");
  const token = cookies.get("loginToken");
  const subscrition_id = cookies.get("subscrition_id");
  const is_subscribed = cookies.get("is_subscribed");
  const subscriptionDate = cookies.get("subscriptionDate");
  const expiryDate = cookies.get("expiryDate");
  const onChange = (key) => {
    console.log(key);
  };
  const onCheckChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setCheckTerm(!checkTerm);
  };
  const onCheckChangeMou = (e) => {
    console.log(`checked = ${e.target.checked}`);

    setCheckMou(!checkMou);
  };
  console.log(checkTerm);
  useEffect(() => {
    getData();
  }, []);
  console.log(subscrition_id);
  const getData = async () => {
    const token = cookies.get("loginToken");
    let data = await fetch(`/api/subscriptionplans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let res = await data.json();
    if (res.status) {
      setSubscriptionArray(res.data.data);
      if (subscrition_id != undefined) {
        let subscribeData = res?.data?.data.find(
          (item) => item._id == subscrition_id
        );
        setBillingMethod(subscribeData?.subscriptionType);
        setPlanName(subscribeData?.planName);
        setEndDate("");
        const startDateTemp = startDate.split("T")[0];
        const y = startDateTemp.split("-");
        const z = parseInt(y[0]) + 1;
        y[0] = z;
        setSubscriptionDataTop([
          { title: "Plan Name", value: subscribeData?.planName },
          {
            title: "Subscription Date",
            value: subscriptionDate && subscriptionDate.split("T")[0],
          },
          {
            title: "Subscription Renewal Date",
            value: expiryDate && expiryDate.split("T")[0],
          },
          { title: "Billing Method", value: subscribeData?.subscriptionType },
        ]);
      }
    } else {
      message.error("Internal Server Error");
    }

    cookies.set("subscription_data", JSON.stringify(res?.data?.data));
  };

  const subsciptionContent = () => {
    let subscription1 = [];
    subscriptionData.allowedData.map((e) =>
      subscription1.push(
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#1E1F4B",
            marginBottom: "10px",
          }}
        >
          <Image height={16} width={16} src={e.active ? accept : cancel} />
          &nbsp;&nbsp;
          <span>{e.name}</span>
        </div>
      )
    );
    let subscription2 = [];
    subscriptionData2.allowedData.map((e) =>
      subscription2.push(
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#1E1F4B",
            marginBottom: "10px",
          }}
        >
          <Image height={16} width={16} src={e.active ? accept : cancel} />
          &nbsp;&nbsp;
          <span>{e.name}</span>
        </div>
      )
    );

    const selectedSubscription = async (plancode, id) => {
      cookies.set("plancode", plancode);
      console.log(token);
      if (storeid != "null") {
        let body = { storeId: storeid, subscriptionId: id, isUpgrade: false };
        let datas = await fetch(`/api/updateSubscription`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        let res = await datas.json();
        if (plancode === "ZL-DIS-DISCOVERYPLUS") {
          (async () => {
            router.push("/subscription-data");
          })();
        }
        if (res.status) {
          cookies.set("subscrition_id", res.data.data.subscriptionId);
          cookies.set("expiryDate", res.data.data.expiryDate);
          cookies.set("subscriptionDate", res.data.data.createdAt);
          cookies.set("is_subscribed", res.data.data.isSubscribed);
          console.log(res.data);
          message.success(res.data.message);
          router.push("/store-management");
        } else {
        }
      } else {
        cookies.set("subscrition_id", id);
        router.push("/store-management");
      }
    };
    const planSubscription = async (plancode, id) => {
      cookies.set("plancode", plancode);
      cookies.set("subscrition_id", id);
      console.log(plancode, "plancode");
      console.log(subscrition_id, "subscrition_id");
      router.push("/subscription-data");
    };
    return (
      <div>
        {
          subscrition_id != "undefined"
            ? subscriptionArray.length > 0 && (
                <Row gutter={[20, 20]}>
                  <div className={subscriptionStyle.subscribe_div}>
                    {subscriptionDataTop.map((e) => {
                      return (
                        <div>
                          <p style={{ color: "#627085" }}>{e.title}</p>
                          <p style={{ color: "#1A1A1A", marginTop: "-10px" }}>
                            {e.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Row>
              )
            : ""
          // <h1 style={{ textAlign: "center", paddingBottom: "1.5rem" }}>
          //   Please contact ZLite Discover administrators via{" "}
          //   <span style={{ color: "blue" }}>
          //     discover@zlite.in / +91 63589 18709
          //   </span>{" "}
          //   for subscribing to the plan.
          // </h1>
        }
        <Tabs
          defaultActiveKey="1"
          onChange={onChange}
          centered={true}
          tabBarStyle={{
            fontStyle: "Medium",
            fontSize: "16px",
            lineHeight: "24px",
            color: "#1E1F4B",
            marginBottom: "30px",
          }}
          style={{ width: "100%" }}
        >
          <TabPane tab="Monthly" key="1">
            <Row gutter={[20, 20]} justify="center">
              {subscriptionArray &&
                subscriptionArray
                  .slice(0)
                  .reverse()
                  .map((item, index) => {
                    return (
                      <>
                        <Col
                          xs={24}
                          sm={24}
                          md={11}
                          lg={11}
                          xl={7}
                          className={subscriptionStyle.col_subscription}
                        >
                          {item._id === subscrition_id ? (
                            <div style={{ padding: "0px 3rem" }}>
                              <div className={subscriptionStyle.current_plan}>
                                <span>Current Plan</span>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          <div
                            style={{
                              paddingLeft: "30px",
                              paddingRight: "30px",
                              paddingTop: "20px",
                            }}
                          >
                            <div
                              className={
                                subscriptionStyle.heading_subscription2
                              }
                            >
                              <span>{item.planName}</span>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <span
                                className={
                                  subscriptionStyle.heading_subscription3
                                }
                              >
                                {item.currency + " " + item.price}
                              </span>
                              <span
                                className={
                                  subscriptionStyle.heading_subscription4
                                }
                              >
                                {"/ " + item.subscriptionType}
                              </span>
                            </div>
                            <div
                              className={
                                subscriptionStyle.heading_subscription5
                              }
                            >
                              {/* <span>{item.slogan}</span> */}
                              <span>Perfect for Aspiring Brands</span>
                            </div>
                            <div
                              style={{
                                marginTop: "20px",
                                marginBottom: "30px",
                              }}
                            >
                              {index === 0 ? subscription1 : subscription2}
                            </div>
                          </div>
                          {item._id === subscrition_id ? (
                            ""
                          ) : (
                            <div
                              className={
                                checkTerm && checkMou
                                  ? subscriptionStyle.subscription_button
                                  : subscriptionStyle.disable_span
                              }
                              // className={subscriptionStyle.subscription_button}
                            >
                              {is_subscribed === "true" ? (
                                <span
                                  onClick={() =>
                                    selectedSubscription(
                                      item.plancode,
                                      item._id
                                    )
                                  }
                                >
                                  Change Plan
                                </span>
                              ) : (
                                <span
                                  // className={
                                  //   checkTerm && checkMou
                                  //     ? ""
                                  //     : subscriptionStyle.disable_span
                                  // }
                                  // disabled={!checkTerm && !checkMou}
                                  onClick={() =>
                                    planSubscription(item.plancode, item._id)
                                  }
                                >
                                  Get started today
                                </span>
                              )}
                            </div>
                            // <div
                            //   className={subscriptionStyle.subscription_button}
                            //   // onClick={() => selectedSubscription(item._id)}
                            // >
                            //   <span>

                            //     {is_subscribed === "true"
                            //       ? "Change Plannn"
                            //       : "Get started today"}
                            //   </span>
                            // </div>
                          )}
                        </Col>
                        <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                      </>
                    );
                  })}
            </Row>
            <Row>
              <Checkbox
                onChange={onCheckChange}
                style={{ marginLeft: "10rem", marginTop: "2.563rem" }}
              >
                It is a long established fact that a reader will be distracted,
                <a href="../../assets/images/accept.png" download>
                  {" "}
                  Terms & Conditions
                </a>
                {/* <a
                  className={subscriptionStyle.checkbox}
                  href="#"
                  alt="alt text"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms & Conditions
                </a> */}
              </Checkbox>
            </Row>
            <Row>
              <Checkbox
                onChange={onCheckChangeMou}
                style={{ marginLeft: "10rem", marginTop: "0.938rem" }}
              >
                Service Agreement{" "}
                <a className={subscriptionStyle.checkbox} href="#">
                  Zlite Discover MOU
                </a>
              </Checkbox>
            </Row>
          </TabPane>
          <TabPane tab="Quarterly" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Yearly" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>

        {/* <div>
          {" "}
          <Checkbox onChange={onCheckChange}>
            It is a long established fact that a reader will be distracted,
            <a className={subscriptionStyle.checkbox} href="#">
              Terms & Conditions
            </a>
          </Checkbox>
        </div>
        <div>
          {" "}
          <Checkbox onChange={onCheckChange}>
            Service Agreement{" "}
            <a className={subscriptionStyle.checkbox} href="#">
              Zlite Discover MOU
            </a>
          </Checkbox>
        </div> */}
      </div>
    );
  };
  return subsciptionContent();
};
export default SubscriptionPlan;

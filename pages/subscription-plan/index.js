/* eslint-disable react/jsx-key */
import { Row, Col, message, Checkbox } from "antd";
import React, { useState, useEffect } from "react";
import MasterLayout from "../../components/master-layout/MasterLayout";
import subscriptionStyle from "./subscriptionPlan.module.css";
import accept from "../../assets/images/accept.png";
import cancel from "../../assets/images/cancel.png";
import Image from "next/image";
import "antd/dist/antd.css";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import Link from "next/link";
import { Spin } from "antd";
import { baseUrl } from "../../util/baseUrl";
import Icon, { Loading3QuartersOutlined } from "@ant-design/icons";
import axios from "axios";
const antIcon = (
  <Loading3QuartersOutlined style={{ fontSize: 50, color: "#5902b3" }} spin />
);
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
  const [planName, setPlanName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [billingMethod, setBillingMethod] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isExpire, setIsExpire] = useState(false);
  const [isExpirePeriod, setIsExpirePeriod] = useState(false);
  const [subscriptionDataTop, setSubscriptionDataTop] = useState([
    { title: "Plan Name", value: "" },
    { title: "Subscription Date", value: "" },
    { title: "Subscription Renewal Date", value: "" },
    { title: "Billing Method", value: "" },
  ]);
  const [checkTerm, setCheckTerm] = useState(false);
  const [checkMou, setCheckMou] = useState(false);
  const [isUpgrade, setIsUpgrade] = useState(true);
  const storeid = cookies.get("storeid");
  const token = cookies.get("loginToken");
  const subscrition_id = cookies.get("subscrition_id");
  const is_subscribed = cookies.get("is_subscribed");
  const subscriptionDate = cookies.get("subscriptionDate");
  // const isExpire = cookies.get("isExpire");
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

  useEffect(() => {}, [isExpire]);

  const checkExpirePeriod = (expiryDate) => {
    const eDate = expiryDate.split("T")[0];
    let one_day = 1000 * 60 * 60 * 24;

    let expDate = new Date(eDate);

    const currDate = new Date();
    const diffDay =
      Math.round(expDate.getTime() - currDate.getTime()) / one_day;
    if (diffDay >= 1 && diffDay <= 3) {
      setIsExpirePeriod(true);
    } else {
      setIsExpirePeriod(false);
    }
  };

  const checkExpire = (expireDate) => {
    const eDate = expireDate?.split("T")[0];
    let one_day = 1000 * 60 * 60 * 24;
    let expiryDate_ = new Date(eDate);
    const currDate = new Date();
    const diffDay =
      Math.round(expiryDate_.getTime() - currDate.getTime()) / one_day;
    if (diffDay > 0) {
      setIsExpire(false);
    } else {
      setIsExpire(true);
    }
  };

  const getData = async () => {
    const token = cookies.get("loginToken");
    let subData = await axios.get(`${baseUrl}get-user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let expiryTimeStamp = "";
    let subscriptionId = "";
    if (subData.data.code === 200) {
      expiryTimeStamp = subData.data.data.expiryDate;
      subscriptionId = subData.data.data.subscriptionId;
      expiryTimeStamp && checkExpirePeriod(expiryTimeStamp);
      expiryTimeStamp && checkExpire(expiryTimeStamp);
      cookies.set("subscrition_id", subscriptionId);
    }

    let data = await fetch(`${baseUrl}subscriptionplans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let res = await data.json();
    if (res.code === 200) {
      let d_ = res.data.sort((a, b) => (a.price > b.price ? 1 : -1));
      setSubscriptionArray(d_);
      if (subscrition_id != undefined) {
        let subscribeData = res?.data?.find(
          (item) => item._id == subscriptionId
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
            value: expiryTimeStamp && expiryTimeStamp.split("T")[0],
          },
          { title: "Billing Method", value: subscribeData?.subscriptionType },
        ]);
      }
    } else {
      message.error("Internal Server Error");
    }

    cookies.set("subscription_data", JSON.stringify(res?.data));
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
      setLoading(true);
      setIsUpgrade(true);
      cookies.set("plancode", plancode);
      cookies.set("subscrition_id", id);

      let body = {
        subscriptionId: id,
        planCode: plancode,
        isUpgrade: plancode === "PROD_DISCOVERY_100" ? true : false,
      };
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
      console.log(res.data);
      if (res.status) {
        if(res.data.code === 200 && res.data.isSubscribed){
          router.push("/subscription-data");
        } else {
          router.push(res?.data?.data?.hostedpage?.url);
        }
        // } else {
        //   // cookies.set("subscrition_id", res.data.data.subscriptionId);
        //   // cookies.set("expiryDate", res.data.data.expiryDate);
        //   // cookies.set("subscriptionDate", res.data.data.createdAt);
        //   // cookies.set("is_subscribed", res.data.data.isSubscribed);
        //   //cookies.set("subscrition_id", res.data.data.subscriptionId);
        //   message.success(res.data.message);
        //   router.push("/store-management");
        // }
        setLoading(false);
      } else {
        setLoading(false);
        message.error("please try again");
      }
    };
    const planSubscription = async (plancode, id) => {
      setIsUpgrade(true);
      cookies.set("plancode", plancode);
      cookies.set("subscrition_id", id);
      router.push("/subscription-data");
    };
    return (
      <Spin spinning={!!isLoading} indicator={antIcon}>
        <div>
          {
            subscrition_id != "undefined" && is_subscribed === "true"
              ? subscriptionArray?.length > 0 && (
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
          <Row gutter={[0, 24]}>
            {subscriptionArray &&
              subscriptionArray.map((item, index) => {
                return (
                  <>
                    <Col
                      xs={24}
                      sm={24}
                      md={11}
                      lg={11}
                      xl={8}
                      className={subscriptionStyle.col_subscription}
                    >
                      {item._id === subscrition_id &&
                      is_subscribed === "true" ? (
                        <div style={{ padding: "0px 3rem" }}>
                          <div className={subscriptionStyle.current_plan}>
                            <span>Current Plan</span>
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: "0px 3rem" }}>
                          <div className={subscriptionStyle.not_current_plan}>
                            <span></span>
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          paddingLeft: "30px",
                          paddingRight: "30px",
                          paddingTop: "20px",
                        }}
                      >
                        <div
                          className={subscriptionStyle.heading_subscription2}
                        >
                          <span>{item.planName}</span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <span
                            className={subscriptionStyle.heading_subscription3}
                          >
                            {item.currency + " " + item.price}
                          </span>
                          <span
                            className={subscriptionStyle.heading_subscription4}
                          >
                            {"/ " + item.subscriptionType}
                          </span>
                        </div>
                        <div
                          className={subscriptionStyle.heading_subscription5}
                        >
                          {/* <span>{item.slogan}</span> */}
                          <span>Perfect for Aspiring Brands</span>
                        </div>
                        {/* <div style={{ marginTop: "20px", marginBottom: "30px" }}>
                        {index === 0 ? subscription1 : subscription2}
                      </div> */}
                        <div
                          style={{ marginTop: "20px", marginBottom: "30px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#1E1F4B",
                              marginBottom: "10px",
                            }}
                          >
                            <Image
                              height={16}
                              width={16}
                              src={item.planDetails.logo.flag ? accept : cancel}
                            />
                            &nbsp;&nbsp;
                            <span>{item.planDetails.logo.title}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#1E1F4B",
                              marginBottom: "10px",
                            }}
                          >
                            <Image
                              height={16}
                              width={16}
                              src={
                                item.planDetails.banner.flag ? accept : cancel
                              }
                            />
                            &nbsp;&nbsp;
                            <span>{item.planDetails.banner.title}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#1E1F4B",
                              marginBottom: "10px",
                            }}
                          >
                            <Image
                              height={16}
                              width={16}
                              src={
                                item.planDetails.keyword.flag ? accept : cancel
                              }
                            />
                            &nbsp;&nbsp;
                            <span>{item.planDetails.keyword.title}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#1E1F4B",
                              marginBottom: "10px",
                            }}
                          >
                            <Image
                              height={16}
                              width={16}
                              src={
                                item.planDetails.image.flag ? accept : cancel
                              }
                            />
                            &nbsp;&nbsp;
                            <span>{item.planDetails.image.title}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#1E1F4B",
                              marginBottom: "10px",
                            }}
                          >
                            <Image
                              height={16}
                              width={16}
                              src={
                                item.planDetails.address.flag ? accept : cancel
                              }
                            />
                            &nbsp;&nbsp;
                            <span>{item.planDetails.address.title}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#1E1F4B",
                              marginBottom: "10px",
                            }}
                          >
                            <Image
                              height={16}
                              width={16}
                              src={
                                item.planDetails.contactDetails.flag
                                  ? accept
                                  : cancel
                              }
                            />
                            &nbsp;&nbsp;
                            <span>{item.planDetails.contactDetails.title}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#1E1F4B",
                              marginBottom: "10px",
                            }}
                          >
                            <Image
                              height={16}
                              width={16}
                              src={
                                item.planDetails.aboutUs.flag ? accept : cancel
                              }
                            />
                            &nbsp;&nbsp;
                            <span>{item.planDetails.aboutUs.title}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#1E1F4B",
                              marginBottom: "10px",
                            }}
                          >
                            <Image
                              height={16}
                              width={16}
                              src={
                                item.planDetails.URLforSharing.flag
                                  ? accept
                                  : cancel
                              }
                            />
                            &nbsp;&nbsp;
                            <span>{item.planDetails.URLforSharing.title}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#1E1F4B",
                              marginBottom: "10px",
                            }}
                          >
                            <Image
                              height={16}
                              width={16}
                              src={
                                item.planDetails.reviews.flag ? accept : cancel
                              }
                            />
                            &nbsp;&nbsp;
                            <span>{item.planDetails.reviews.title}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#1E1F4B",
                              marginBottom: "10px",
                            }}
                          >
                            <Image
                              height={16}
                              width={16}
                              src={
                                item.planDetails.responsetoReviews.flag
                                  ? accept
                                  : cancel
                              }
                            />
                            &nbsp;&nbsp;
                            <span>
                              {item.planDetails.responsetoReviews.title}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#1E1F4B",
                              marginBottom: "10px",
                            }}
                          >
                            <Image
                              height={16}
                              width={16}
                              src={
                                item.planDetails.enquiryForm.flag
                                  ? accept
                                  : cancel
                              }
                            />
                            &nbsp;&nbsp;
                            <span>{item.planDetails.enquiryForm.title}</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "#1E1F4B",
                              marginBottom: "10px",
                            }}
                          >
                            <Image
                              height={16}
                              width={16}
                              src={
                                item.planDetails.marketPlace.flag
                                  ? accept
                                  : cancel
                              }
                            />
                            &nbsp;&nbsp;
                            <span>{item.planDetails.marketPlace.title}</span>
                          </div>
                        </div>
                      </div>
                      {item._id === subscrition_id &&
                      is_subscribed === "true" &&
                      isExpire === false &&
                      isExpirePeriod === false ? (
                        ""
                      ) : (
                        <div
                          className={
                            checkTerm && checkMou
                              ? subscriptionStyle.subscription_button
                              : subscriptionStyle.disable_span
                          }
                        >
                          {is_subscribed === "true" ? (
                            <span
                              className={
                                subscriptionStyle.subscription_btn_style
                              }
                              onClick={() =>
                                selectedSubscription(item.plancode, item._id)
                              }
                            >
                              {isExpire === true || isExpirePeriod === true
                                ? "Renew Plan"
                                : "Change Plan"}
                            </span>
                          ) : (
                            <span
                              className={
                                subscriptionStyle.subscription_btn_style
                              }
                              onClick={() =>
                                planSubscription(item.plancode, item._id)
                              }
                            >
                              Get started today
                            </span>
                          )}
                        </div>
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
              className={subscriptionStyle.subscription_check_style}
            >
              It is a long established fact that a reader will be distracted,
              <a
                className={subscriptionStyle.checkbox}
                href="./terms.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Terms & Conditions
              </a>
            </Checkbox>
          </Row>
          <Row>
            <Checkbox
              onChange={onCheckChangeMou}
              className={subscriptionStyle.subscription_check_style}
            >
              Service Agreement{" "}
              <a
                className={subscriptionStyle.checkbox}
                href="./mou.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Zlite Discover MOU
              </a>
            </Checkbox>
          </Row>
        </div>
      </Spin>
    );
  };
  return subsciptionContent();
};
export default SubscriptionPlan;

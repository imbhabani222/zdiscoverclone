/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import logo from "../../assets/images/zlite-logo.png";
import zlite_whatsapp from "../../assets/images/zlite-whatsapp.svg";
import zlite_fb from "../../assets/images/zlite-fb.svg";
import google from "../../assets/images/google.png";
import Image from "next/image";
import loginStyle from "./login.module.css";
import "antd/dist/antd.css";
import { Col, Row, Input, message, Divider } from "antd";
import { useRouter } from "next/router";
import axios from "axios";
import Auth from "../../util/auth";
import { Spin } from "antd";
import Cookies from "universal-cookie";
import Icon, { Loading3QuartersOutlined } from "@ant-design/icons";
const antIcon = (
  <Loading3QuartersOutlined style={{ fontSize: 50, color: "#5902b3" }} spin />
);

const cookies = new Cookies();

const Login = () => {
  const router = useRouter();
  const [view, setView] = useState("first");
  const [mobEmail, setMobEmail] = useState("");
  const [_id, setID] = useState("");
  const [otp1, setOtp1] = useState(null);
  const [otp2, setOtp2] = useState(null);
  const [otp3, setOtp3] = useState(null);
  const [otp4, setOtp4] = useState(null);
  const [otp5, setOtp5] = useState(null);
  const [otp6, setOtp6] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const token = cookies.get("token");
  const loginToken = cookies.get("loginToken");

  const gotoSecond = () => {
    setView("second");
  };

  const gotoThird = async () => {
    setOtp1("");
    setOtp2("");
    setOtp3("");
    setOtp4("");
    setOtp5("");
    setOtp6("");
    // var mailFormat =
    //   /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/;
    if (mobEmail === "") {
      message.warning("Please provide Mobile Number or Email ID");
    } else if (isNaN(mobEmail) == true) {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (reg.test(mobEmail) == false) {
        message.warning("Invalid Email Address");
      } else {
        let type = mobEmail.includes("@") ? "email" : "phone";
        let payload = {
          contact: mobEmail,
          type: type,
        };
        let data = await fetch(`/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        let res = await data.json();
        if (res.status) {
          setID(res.data._id);
          message.success("OTP sent to " + mobEmail);
          setView("third");
        } else {
          message.error(res.data.message);
        }
      }
    } else if (isNaN(mobEmail) == false) {
      // var reg_mobile = /^(\+\d{1,3}[- ]?)?\d{10}$/;
      var reg_mobile = /^[6-9]{1}[0-9]{9}$/;
      if (reg_mobile.test(mobEmail) == false) {
        message.warning("Invalid mobile number");
      } else {
        let type = mobEmail.includes("@") ? "email" : "phone";
        let payload = {
          contact: mobEmail,
          type: type,
        };
        let data = await fetch(`/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        let res = await data.json();
        if (res.status) {
          setID(res.data._id);
          message.success("OTP sent to " + mobEmail);
          setView("third");
        } else {
          message.error(res.data.message);
        }
      }
    }
    // else if (!mailFormat.test(mobEmail)) {
    //   message.warning(
    //     "  Email Address / Phone number is not valid, Please provide a valid Email or phone number "
    //   );
    // }
    //  else {
    //   let type = mobEmail.includes("@") ? "email" : "phone";
    //   let payload = {
    //     contact: mobEmail,
    //     type: type,
    //   };
    //   let data = await fetch(`/api/login`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(payload),
    //   });
    //   let res = await data.json();
    //   setID(res.data._id);
    //   message.success("OTP sent to " + mobEmail);
    //   setView("third");
    // }
  };
  const checkExpire = (expireDate) => {
    const eDate = expireDate?.split("T")[0];
    let one_day = 1000 * 60 * 60 * 24;
    //let expiryDate = cookies.get("expiryDate");
    let expiryDate_ = new Date(eDate);
    // expiryDate = new Date(eDate);
    const currDate = new Date();
    const diffDay =
      Math.round(expiryDate_.getTime() - currDate.getTime()) / one_day;
    if (diffDay > 0) {
      cookies.set("isExpire", false);
      return false;
    } else {
      cookies.set("isExpire", true);
      cookies.set("subscrition_id", "");
      return true;
    }
  };
  const findToken = async (token) => {
    if (token) {
      const payload = {
        contact: null,
        type: "whatsapp",
        token,
      };
      let data = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      let res = await data.json();
      console.log(res.data);
      if (res.status === "failed") {
        message.error("Please provide correct OTP");
        setLoading(false);
      } else {
        Auth.storeLoginSessionDetails(res.data);
        cookies.set("subscrition_id", res.data?.subscriptionId);
        cookies.set("expiryDate", res.data?.expiryDate);
        cookies.set("subscriptionDate", res.data?.createdAt);
        cookies.set("is_subscribed", res.data?.isSubscribed);
        cookies.set("storeid", res.data?.storeid);
        let expiredOrNot = await checkExpire(res.data?.expiryDate);
        if (res.data.isSubscribed && !expiredOrNot) {
          // setLoading(false);
          router.push("/store-management");
        } else {
          // setLoading(false);
          router.push("/subscription-plan");
          if (res.data.isSubscribed) {
            message.error(
              "Your plan is expired , please renewal to enjoy your plan."
            );
          }
        }
      }
    }
  };

  useEffect(() => {
    if (token && token !== null) {
      findToken(token);
    }
  }, [token]);

  const findLoginToken = async (token) => {
    if (token) {
      const subId = cookies.get("subscrition_id");
      const isSub = cookies.get("is_subscribed");
      if (isSub) {
        // setLoading(false);
        router.push("/store-management");
      } else {
        // setLoading(false);
        router.push("/subscription-plan");
      }
    }
  };

  useEffect(() => {
    findLoginToken(loginToken);
  }, [loginToken]);

  const loginSubmit = async () => {
    setLoading(true);
    let finalOtp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    if (finalOtp.length === 6) {
      let payload = {
        id: _id,
        otp: parseInt(finalOtp),
      };
      let data = await fetch(`/api/verifyotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      let res = await data.json();
      if (res.status) {
        if (res.data.data.isSuperAdmin === true) {
          Auth.storeLoginSessionDetails(res.data.data);
          cookies.set("superadmin", res.data.data.isSuperAdmin);
          cookies.set("is_subscribed", res.data.data.isSubscribed);
          router.push("/admin-user");
        } else {
          Auth.storeLoginSessionDetails(res.data.data);
          cookies.set("subscrition_id", res.data.data.subscriptionId);
          cookies.set("expiryDate", res.data.data.expiryDate);
          cookies.set("subscriptionDate", res.data.data.createdAt);
          cookies.set("is_subscribed", res.data.data.isSubscribed);
          let expiredOrNot = await checkExpire(
            res.data.data.expiryDate,
            res.data.data.isSubscribed
          );
          if (res.data.data.isSubscribed && !expiredOrNot) {
            // setLoading(false);
            router.push("/store-management");
          } else {
            // setLoading(false);
            router.push("/subscription-plan");
            if (res.data.data.isSubscribed) {
              message.error(
                "Your plan is expired , please renewal to enjoy your plan."
              );
            }
          }
        }
      } else {
        message.error("Please provide correct OTP");
        setLoading(false);
      }
    } else {
      setLoading(false);
      message.error("Please enter the valid OTP");
    }
  };
  const otpChange = (e) => {
    const { maxLength, value, name } = e.target;
    const [fieldName, fieldIndex] = name.split("-");
    let fieldIntIndex = parseInt(fieldIndex, 10);
    const nextfield = document.querySelector(
      `input[name=otp-${fieldIntIndex + 1}]`
    );
    const prevfield = document.querySelector(
      `input[name=otp-${fieldIntIndex - 1}]`
    );
    if (name == "otp-1") {
      setOtp1(value);
    } else if (name == "otp-2") {
      setOtp2(value);
    } else if (name == "otp-3") {
      setOtp3(value);
    } else if (name == "otp-4") {
      setOtp4(value);
    } else if (name == "otp-5") {
      setOtp5(value);
    } else {
      setOtp6(value);
    }
    // If found, focus the next field
    if (nextfield !== null && value) {
      nextfield.focus();
    } else if (!value && fieldIntIndex != 1) {
      prevfield.focus();
    } else {
    }
  };

  const viewModule = () => {
    let design = [];
    if (view === "first") {
      design.push(
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
          className={loginStyle.right_content}
          key={1}
        >
          <div className={loginStyle.login_title} style={{ display: "flex" }}>
            <span>Login / Signup</span>
          </div>
          <div className={loginStyle.button_div} style={{ color: "#56CF64" }}>
            <a
              href={process.env.NEXT_PUBLIC_WHATSAPP_LOGIN}
              style={{
                display: "flex",
                alignItems: "center",
                color: "#56CF64",
                gap: "1rem",
              }}
            >
              <Image src={zlite_whatsapp} alt="whatsapp" />

              <span className={loginStyle.login_text}>
                Sign In with WhatsApp
              </span>
            </a>
          </div>
          <div
            className={loginStyle.button_div}
            style={{ color: "#1877F2", pointerEvents: "none" }}
          >
            <a
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              // href="https://zefayar.hutechweb.com/auth/api/v1/register/social_google/initialize"
            >
              <Image src={zlite_fb} />

              <span className={loginStyle.login_text}>
                Sign In with Facebook
              </span>
            </a>
          </div>
          <div className={loginStyle.button_div} style={{ color: "#EA4335" }}>
            <a
              style={{
                display: "flex",
                alignItems: "center",
                color: "#EA4335",
                gap: "1rem",
              }}
              href={process.env.NEXT_PUBLIC_GOOGLE_LOGIN}
            >
              <Image src={google} height={22} width={22} />

              <span className={loginStyle.login_text}>
                Sign In with Google
                <span style={{ visibility: "hidden" }}>44</span>
              </span>
            </a>
          </div>
          {/* <div className={loginStyle.text_divider}>Or Login with</div> */}
          <Divider plain className={loginStyle.text_divider}>
            Or Login with
          </Divider>
          <div
            className={loginStyle.button_div}
            style={{
              backgroundColor: "#5902B3",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={gotoSecond}
          >
            <span className={loginStyle.login_text_mobile}>
              Mobile Number or Email ID
            </span>
          </div>
        </Col>
      );
    } else if (view === "second") {
      design.push(
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
          className={loginStyle.right_content}
          // style={{ height: "297px" }}
          key={2}
        >
          <div className={loginStyle.login_title}>
            <span>Login / Signup</span>
          </div>
          <div className={loginStyle.width_input}>
            <Input
              className={loginStyle.zl_input_}
              placeholder="Mobile Number / Email ID"
              value={mobEmail}
              onChange={(e) => setMobEmail(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.code == "Enter") {
                  gotoThird();
                }
              }}
            />
          </div>
          <div
            className={loginStyle.button_div + " " + loginStyle.send_otp_btn}
            style={{
              backgroundColor: "#5902B3",
              color: "#fff",
              cursor: "pointer",
              marginTop: "0.5rem",
            }}
            onClick={gotoThird}
          >
            <span>Send OTP</span>
          </div>
        </Col>
      );
    } else {
      design.push(
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
          className={loginStyle.right_content}
          key={3}
          // style={{ height: "392px" }}
          style={{ paddingLeft: "15px", paddingRight: "15px" }}
        >
          <div className={loginStyle.login_title}>
            <span>OTP Verification</span>
          </div>
          <div className={loginStyle.first_sec_3rd}>
            <div style={{ color: "#000" }}>
              OTP has been sent to{" "}
              {mobEmail
                ? `${mobEmail.substring(0, 3) + "****" + mobEmail.substring(7)}`
                : mobEmail}
            </div>
            <div
              style={{ color: "#5902B3", cursor: "pointer" }}
              onClick={gotoSecond}
            >
              Change
            </div>
          </div>
          <div
            className={loginStyle.width_input_otp}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Input
              className={loginStyle.zl_input}
              value={otp1}
              minLength={1}
              maxLength={1}
              name="otp-1"
              key="otp-1"
              onChange={otpChange}
              type={Number}
            />
            <Input
              className={loginStyle.zl_input}
              value={otp2}
              minLength={1}
              maxLength={1}
              name="otp-2"
              key="otp-2"
              onChange={otpChange}
              type={Number}
            />
            <Input
              className={loginStyle.zl_input}
              value={otp3}
              minLength={1}
              maxLength={1}
              name="otp-3"
              key="otp-3"
              onChange={otpChange}
              type={Number}
            />
            <Input
              className={loginStyle.zl_input}
              value={otp4}
              minLength={1}
              maxLength={1}
              name="otp-4"
              key="otp-4"
              onChange={otpChange}
              type={Number}
            />
            <Input
              className={loginStyle.zl_input}
              value={otp5}
              minLength={1}
              maxLength={1}
              name="otp-5"
              key="otp-5"
              onChange={otpChange}
              type={Number}
            />
            <Input
              className={loginStyle.zl_input}
              value={otp6}
              minLength={1}
              maxLength={1}
              name="otp-6"
              key="otp-6"
              onChange={otpChange}
              type={Number}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  loginSubmit();
                }
              }}
            />
          </div>
          <div className={loginStyle.first_sec_3rd}>
            <div style={{ color: "#000" }}></div>
            <div
              style={{ color: "#5902B3", cursor: "pointer" }}
              onClick={gotoThird}
            >
              Resend OTP
            </div>
          </div>
          <div
            className={
              loginStyle.button_div + " " + loginStyle.button_otp_submit
            }
            style={{
              backgroundColor: "#5902B3",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={loginSubmit}
          >
            <span>Submit</span>
          </div>
        </Col>
      );
    }
    return design;
  };
  return (
    <Spin spinning={!!isLoading} indicator={antIcon}>
      <div className={loginStyle.login_main_container}>
        <Row gutter={20} justify={"space-between"}>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={12}
            className={loginStyle.left_content}
          >
            <div className={loginStyle.login_logo_wrapper}>
              <div className={loginStyle.login_logo}>
                <Image src={logo} />
              </div>
            </div>
            <div className={loginStyle.left_description}>
              <span style={{ lineHeight: 1.3 }}>
                Get an engaging and a professional website that enhances your
                online presence.
              </span>
            </div>
          </Col>
          {/* <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
          <Col xs={24} sm={24} md={11} lg={11} xl={11}> */}
          {viewModule()}
          {/* </Col> */}
        </Row>
      </div>
    </Spin>
  );
};

export default Login;

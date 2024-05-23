import {
  Button,
  Col,
  Row,
  Drawer,
  Input,
  Checkbox,
  Tooltip,
  Form,
  message,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import napperFurniture from "../../assets/images/napper-furniture.svg";
import styles from "../side-button/styles.module.css";
import facebookIcon from "../../assets/images/fb-logo.svg";
import instagramIcon from "../../assets/images/insta-logo.svg";
import twitterIcon from "../../assets/images/twitter-logo.svg";
import youtubeIcon from "../../assets/images/youtube.png";
import linkedinIcon from "../../assets/images/linkedin-logo.svg";
import pinterestIcon from "../../assets/images/pinterest.png";
import {
  FacebookShareButton,
  TwitterShareButton,
  PinterestShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import qrCode from "../../assets/images/scanQrCode.svg";
import { baseUrl, imageBaseUrl } from "../../util/baseUrl";
import Cookies from "universal-cookie";
const { Search } = Input;

const cookies = new Cookies();
const token = cookies.get("loginToken");
const SideBtn = (props) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [storeDetailsOpen, setstoreDetailsOpen] = useState(false);
  const [otherInfoOpen, setOtherInfoOpen] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [copyText, setCopyText] = useState("");
  const [checkedMail, setCheckedMail] = useState(true);
  const [pageUrl, setpageUrl] = useState("");
  const [checkedWhatsapp, setCheckedWhatsapp] = useState(false);
  const drawerRef = useRef();

  useEffect(() => {
    setpageUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    let z = window.location.href;
    navigator.clipboard.writeText(z);
    message.info("Copied URL");
    setOpen(false);
  };
  const changeCheckedMail = (e) => {
    setCheckedMail(e.target.checked);
  };
  const changeCheckedWhatsapp = (e) => {
    setCheckedWhatsapp(e.target.checked);
  };

  const showShareDrawer = () => {
    setOtherInfoOpen(false);
    setstoreDetailsOpen(false);
    setOpen(true);
  };
  const onChange = (e) => {
    setPlacement(e.target.value);
  };
  const onClose = () => {
    setOpen(false);
  };
  const showStoreDetailsDrawer = () => {
    if(props.fullAccess){
      setOtherInfoOpen(false);
      setOpen(false);
      setstoreDetailsOpen(true);
    }else{
      message.warning("This feature is unavailable");
    }
    
  };
  const onStoreDetailsClose = () => {
    setstoreDetailsOpen(false);
    form.resetFields();
  };
  const showOtherinfoDrawer = () => {
    setstoreDetailsOpen(false);
    setOpen(false);
    setOtherInfoOpen(true);
  };
  const onOtherInfoClose = () => {
    setOtherInfoOpen(false);
  };
  async function addStoreDetails(values) {
    const payload = {
      ...values,
      storeid: props.storeId,
      iswhatsapp: checkedWhatsapp,
      isemail: checkedMail,
      subject: "",
      descriptions: "",
      isgetintouch: false,
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
      console.log(res.data);
      message.success(res?.data?.message);
      // setLoading(false);
      form.resetFields();
    } else {
      // alert("error")
      // setLoading(false);
      message.error("Internal Server Error");
    }
    setstoreDetailsOpen(false);
  }
  return (
    <div>
      <div
        className={styles.side_btn_div}
        value={placement}
        onChange={onChange}
        style={props.fullAccess ? { zIndex: 1000 } : { zIndex: 1000, right: "-100px" }}
      >
        <Button
          className={styles.other_info_btn}
          onClick={showOtherinfoDrawer}
          value="right"
          style={{ zIndex: 9999, background: props.themeColor }}
        >
          Other Information
        </Button>
        <Drawer
          className={styles.other_info_drawer}
          // title="Drawer with extra actions"
          placement={"right"}
          width={300}
          onClose={onOtherInfoClose}
          open={otherInfoOpen}
          mask={false}
          bodyStyle={{ padding: "16px" }}
        >
          <div>
            <h2 style={{ textAlign: "center", color: props.themeColor }}>
              Scan to Join
            </h2>
            <Image
              src={`${props.socialLink.qrcodeImg}`}
              alt="QR image"
              style={{ objectFit: "contain" }}
              height={300}
              width={300}
            />
            <h3
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: props.themeColor,
              }}
            >
              {pageUrl}
            </h3>
          </div>
        </Drawer>
        {props.fullAccess ? <Button
          className={styles.store_details_btn}
          onClick={showStoreDetailsDrawer}
          value="right"
          style={props.fullAccess ? { zIndex: 9999 } : { zIndex: 9999, backgroundColor: "darkgray", color: "gray" }}
        >
          Get Store Details
        </Button>: ""}
        {/* {console.log("drawerRef", drawerRef)} */}
        <Drawer
          ref={drawerRef}
          className={styles.store_details_drawer}
          // title="Drawer with extra actions"
          placement={"right"}
          //  width={500}
          width={
            drawerRef?.current?.innerWidth > 500
              ? 200
              : drawerRef?.current?.innerWidth - 100
          }
          onClose={onStoreDetailsClose}
          open={storeDetailsOpen}
          mask={false}
        >
          <div>
            <h2 style={{ textAlign: "center", color: "#0F70B7" }}>
              Get Store Details
            </h2>
            <Form form={form} onFinish={addStoreDetails}>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name",
                    pattern: /^[a-zA-Z\s]*$/,
                  },
                  {
                    pattern: /^[^\s].+[^\s{0,1}]$/g,

                    message: "Invalid Name",
                  },
                ]}
              >
                <Input
                  placeholder="Your Name*"
                  // onChange={(e) => {
                  //   setName(e.target.value);
                  // }}
                />
              </Form.Item>
              <div style={{ columnGap: "10px" }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Checkbox
                      checked={checkedWhatsapp}
                      onChange={changeCheckedWhatsapp}
                    >
                      WhatsApp
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox
                      checked={checkedMail}
                      onChange={changeCheckedMail}
                    >
                      Email
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="mobileno"
                      rules={[
                        {
                          required: checkedWhatsapp ? true : false,
                          message: "Please input your mobile no",
                          pattern: new RegExp(/^[0-9]{10}$/g),
                        },
                      ]}
                    >
                      <Input
                        maxLength={10}
                        minLength={10}
                        placeholder="WhatsApp No*"
                        disabled={!checkedWhatsapp}
                        // onChange={(e) => {
                        //   setMobile(e.target.value);
                        // }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      value="email"
                      rules={[
                        {
                          required: checkedMail ? true : false,
                          message: "Please input your email Id",
                          type: "email",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Email*"
                        disabled={!checkedMail}
                        // onChange={(e) => {
                        //   setEmail(e.target.value);
                        // }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <div>
                <Form.Item>
                  <Button
                    style={{
                      fontWeight: 600,
                      fontSize: "12px",
                      borderRadius: "6px",
                      background: "#0F70B7",
                      color: "#FFFFFF",
                    }}
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </Drawer>
        <Button
          className={styles.share_btn}
          onClick={showShareDrawer}
          value="right"
          style={{ zIndex: 9999 }}
        >
          Share
        </Button>
        <Drawer
          className={styles.share_drawer}
          // title="Drawer with extra actions"
          placement={"right"}
          width={350}
          onClose={onClose}
          open={open}
          mask={false}
        >
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>Share</div>
            <div>
              <div
                className={styles.toggle_social_connection}
                style={{ paddingTop: "10px" }}
              >
                <div style={{ columnGap: "10px", display: "flex" }}>
                  <a
                    // href={props.socialLink.fb}
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    <FacebookShareButton
                      url={`https://discover.zlite.in/${props.socialLink.url}`}
                      quote="subscribe"
                      hashtag="#React"
                    >
                      <Image
                        src={facebookIcon}
                        alt="/"
                        style={{ height: "36px", width: "36px" }}
                      />
                    </FacebookShareButton>
                  </a>
                  <WhatsappShareButton
                    url={`https://discover.zlite.in/${props.socialLink.url}`}
                  >
                    <WhatsappIcon
                      logoFillColor="white"
                      round={true}
                      height={28}
                      width={28}
                    ></WhatsappIcon>
                  </WhatsappShareButton>
                  {/* <a
                    // href={props.socialLink.insta}
                    href="https://www.instagram.com/accounts/login/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image src={instagramIcon} alt="/" />
                  </a> */}
                  <a
                    // href={props.socialLink.twitter}
                    href="https://twitter.com/i/flow/login"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TwitterShareButton
                      url={`https://discover.zlite.in/${props.socialLink.url}`}
                    >
                      <Image src={twitterIcon} alt="/" />
                    </TwitterShareButton>
                  </a>

                  {/* <a
                    // href={props.socialLink.yt}
                    href="https://www.youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image src={youtubeIcon} alt="/" height={28} width={28} />
                  </a> */}
                  <a
                    // href={props.socialLink.linkedin}
                    href="https://www.linkedin.com/login"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedinShareButton
                      url={`https://discover.zlite.in/${props.socialLink.url}`}
                    >
                      <Image src={linkedinIcon} alt="/" />
                    </LinkedinShareButton>
                  </a>
                  {/* <a
                    // href={props.socialLink.pinterest}
                    // href="https://in.pinterest.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                  <PinterestShareButton
                  media={`http://zlite-uat.hutechweb.com/${props.socialLink.url}`}
                  // url={`http://zlite-uat.hutechweb.com/${props.socialLink.url}`}
                  >
                    <Image src={pinterestIcon} alt="/" height={28} width={28} />
                    </PinterestShareButton>
                  </a> */}
                </div>
              </div>
            </div>
            <div
              style={{ paddingTop: "15px", fontSize: "14px", fontWeight: 600 }}
            >
              Copy Link
            </div>
            <div style={{ paddingTop: "10px" }}>
              <Input.Group compact>
                <Input
                  style={{
                    width: 250,
                  }}
                  value={pageUrl}
                  disabled={true}
                  id="myInput"
                />
                <Tooltip title="copy this url" style={{ background: "black" }}>
                  <Button
                    icon={<CopyOutlined />}
                    style={{ background: "black", color: "white" }}
                    onClick={handleCopy}
                  />
                </Tooltip>
              </Input.Group>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default SideBtn;

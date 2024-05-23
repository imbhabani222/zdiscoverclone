import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Col,
  Divider,
  Row,
  Button,
  Select,
  message,
  Drawer,
} from "antd";
import Image from "next/image";
import editImg from "../../assets/images/edit.svg";
import eye from "../../assets/images/view.png";
import download from "../../assets/images/downloadQR.svg";
import Cookies from "universal-cookie";
import Link from "next/link";
import { Spin, Modal } from "antd";
import Icon, { Loading3QuartersOutlined } from "@ant-design/icons";
import Pdf from "react-to-pdf";
import logo from "../../assets/images/zlite-logo.png";
import z from "../../assets/images/z.svg";
import l from "../../assets/images/l.svg";
import i from "../../assets/images/i.svg";
import t from "../../assets/images/t.svg";
import e from "../../assets/images/e.svg";
import downloadWhite from "../../assets/images/download.png";
import axios from "axios";
import { baseUrl } from "../../util/baseUrl";
const antIcon = (
  <Loading3QuartersOutlined style={{ fontSize: 50, color: "#5902b3" }} spin />
);
const ref = React.createRef();
export default function StoreDetails(props) {
  const [industryData, setIndustryData] = useState([]);
  const [edit, setEdit] = useState(true);
  const cookies = new Cookies();
  const token = cookies.get("loginToken");
  const storeid = cookies.get("storeid");
  const subscritionid = cookies.get("subscrition_id");
  const [isLoading, setLoading] = useState(false);
  const [qrDownloadModal, setQrDownloadModal] = useState(false);
  const style = {
    inputStyle: {
      borderRadius: "15px",
      border: "1px solid #CBD5E1",
      height: "53px",
      color: "#000",
      backgroundColor: "rgba(241, 245, 249, 0.4)",
    },
    storeUrl: {
      borderBottomRightRadius: "15px",
      borderTopRightRadius: "15px",
      border: "none",
      color: "#000",
      backgroundColor: "transparent",
      width: "100%",
      marginTop: "12px",
      marginBottom: "10px",
    },
    divider: {
      height: "40px",
      margin: "15px 10px",
    },
    editStoreColor: {
      color: "#627085",
      fontSize: "0.8rem",
    },
    mt_1: {
      marginTop: "-0.5rem",
    },
  };
  useEffect(() => {
    getIndustryData();
  }, []);

  useEffect(() => {
    const expiryDate = cookies.get("expiryDate");
    const eDate = expiryDate.split("T")[0];
    let one_day = 1000 * 60 * 60 * 24;

    let expDate = new Date(eDate);

    const currDate = new Date();
    const diffDay =
      Math.round(expDate.getTime() - currDate.getTime()) / one_day;
    const info = () => {
      Modal.info({
        title: "Subscription expiry notification",
        content: (
          <div>
            <p>Kindly renew your plan within {diffDay.toFixed()}days </p>
          </div>
        ),
        onOk() {},
      });
    };
    if (diffDay >= 1 && diffDay <= 3) {
      info();
    }
  }, []);

  const getIndustryData = async () => {
    // let response = await axios.get(baseUrl+'api/industryType', {headers: {
    //   "Content-Type": "application/json",
    //   Authorization: token,
    // }});
    // console.log(response, "1st one");
    // setIndustryData(response?.data?.data?.data);
    let data = await fetch(`api/industryType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let res = await data.json();
    if (res?.data?.code) {
      setIndustryData(res?.data?.data);
    }
  };
  const onFinish = async (values) => {
    let url = values.url.split(" ").join("");
    if (
      (url == props?.storeDetails?.url &&
        values.gstin == props?.storeDetails?.gstin) ||
      values.gstin == ""
    ) {
      submitStoreData(values);
    } else {
      setLoading(true);
      let dataValue = {};
      dataValue = {
        url:
          storeid == "null" && props?.storeDetails?.gstin == undefined
            ? url
            : null,
        gstin: values.gstin,
        isUpdate: storeid != "null" ? true : false,
      };

      let data = await fetch("/api/validateStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(dataValue),
      });
      let res = await data.json();
      if (res?.status) {
        setLoading(false);
        // message.success(res?.data?.message);
        submitStoreData(values);
      } else {
        setLoading(false);
        message.warning(
          storeid != "null"
            ? "Please check GSTIN"
            : "Please check Store URL or GSTIN"
        );
      }
    }
  };
  const submitStoreData = async (storeData) => {
    setLoading(true);
    let x = storeData.url;
    let url = x.split(" ").join("");
    let dataValue =
      storeid == "null"
        ? { ...storeData, subscriptionId: subscritionid, url }
        : { ...storeData, id: storeid, url };
    let apiUrl = storeid == "null" ? "/api/createStore" : "/api/updateStore";
    let data = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(dataValue),
    });
    let res = await data.json();
    if (res.status) {
      setLoading(false);
      message.success("Store validated & " + res?.data?.message);
      cookies.set("storeid", res?.data?.data?._id);
      setEdit(true);

      props.getstoredetail(cookies.get(storeid));
    } else {
      setLoading(false);
      message.error("Internal Server Error");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const storeAddress = () => {
    let address = props?.storeDetails?.address;
    if (address)
      if (address.length > 0) {
        return (
          <p
            style={{ width: "70%" }}
          >{`${address[0].addressline1}, ${address[0].addressline2}, ${address[0].city}, ${address[0].state} ${address[0].pincode}`}</p>
        );
      }
  };
  return (
    <>
      <Modal
        open={qrDownloadModal}
        width={500}
        footer={null}
        onCancel={() => setQrDownloadModal(!qrDownloadModal)}
        className="qr-download-modal"
      >
        <div className="qr-download-background">
          <div ref={ref} className="qr-download-background">
            <div style={{ background: "rgb(0, 27, 57)", padding: "20px" }}>
              .
            </div>
            <div
              className="d-flex center"
              style={{ marginTop: "-3.5rem", position: "relative" }}
            >
              <div
                style={{
                  background: "rgb(0, 27, 57)",
                  padding: "1rem",
                  borderRadius: "13px",
                }}
              >
                <Image src={logo} alt="Logo" height={28} width={156} />
                {/* <div className="d-flex space-between">
                  <Image src={z} alt="z" />
                  <Image src={l} alt="l" />
                  <Image src={i} alt="i" />
                  <Image src={t} alt="t" />
                  <Image src={e} alt="e" />
                </div> */}
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                background: "#fff",
                borderRadius: "30px",
                marginTop: "-1rem",
                marginLeft: "35px",
                marginRight: "35px",
                marginBottom: "5px",
              }}
            >
              <br />
              <Divider />
              <h2 style={{ textTransform: "uppercase" }}>
                {props?.storeDetails?.name}
              </h2>
              <h3 style={{ marginTop: "-0.5rem" }}>
                {window.location.origin}/{props?.storeDetails?.url}
              </h3>
              <Image
                unoptimized
                src={props?.storeDetails?.qrcode}
                alt="QR image"
                style={{ objectFit: "contain" }}
                height={230}
                width={230}
              />
              <div className="d-flex center">{storeAddress()}</div>
              <div
                style={{
                  textAlign: "center",
                  backgroundColor: "#F3F3F3",
                  padding: "10px",
                  borderBottomLeftRadius: "30px",
                  borderBottomRightRadius: "30px",
                }}
              >
                © 2021-2022 delcaper Pvt. Ltd.
              </div>
            </div>
          </div>
          <Pdf targetRef={ref} filename={`${props?.storeDetails?.url}-QR.pdf`}>
            {({ toPdf }) => (
              <div
                style={{
                  textDecoration: "underline",
                  color: "#fff",
                  textUnderlineOffset: "3px",
                  background: "tranparent",
                  padding: "15px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {/* <Image
                    src={downloadWhite}
                    alt="Download"
                    height={20}
                    width={20}
                    style={{ marginTop: "3.5px" }}
                    onClick={toPdf}
                    className="cursor"
                  />
                  <span onClick={toPdf} className="cursor">
                    {" "}
                    Download
                  </span> */}
                  <Image
                    src={download}
                    alt="Download"
                    className="cursor"
                    onClick={toPdf}
                  />{" "}
                  <span
                    style={{ color: "#5902B3" }}
                    className="cursor"
                    onClick={toPdf}
                  >
                    {" "}
                    &nbsp;Download
                  </span>
                </div>
              </div>
            )}
          </Pdf>
        </div>
      </Modal>
      {props?.storeDetails && edit ? (
        <React.Fragment key={1}>
          <span className="store-mgt-sub-header-title mr-1">
            Store Details{" "}
          </span>
          <Image
            src={editImg}
            alt="Edit"
            className="cursor"
            onClick={() => setEdit(!edit)}
          />
          <br />
          <Row gutter={16} className="mt-2">
            <Col className="gutter-row" xl={16} lg={16} md={16} sm={24} xs={24}>
              <Row>
                <Col
                  className="gutter-row"
                  xl={6}
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                >
                  <p style={style.editStoreColor}>Store Name *</p>
                  <p style={style.mt_1}>{props?.storeDetails?.name}</p>
                </Col>
                <Col
                  className="gutter-row"
                  xl={6}
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                >
                  <p style={style.editStoreColor}>Industry *</p>
                  <p style={style.mt_1}>{props?.storeDetails?.type}</p>
                </Col>
                {props?.storeDetails?.gstin && (
                  <Col
                    className="gutter-row"
                    xl={6}
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <p style={style.editStoreColor}>GSTIN </p>
                    <p style={style.mt_1}>{props?.storeDetails?.gstin}</p>
                  </Col>
                )}
                {props?.storeDetails.websiteStatus == "true" && (
                  <Col className="gutter-row">
                    <p style={style.editStoreColor}>Store URL *</p>
                    <p style={style.mt_1}>
                      <span style={{ color: "#BDC7D1" }}>
                        {window.location.origin}/
                      </span>
                      {props?.storeDetails?.url}
                    </p>
                  </Col>
                )}
              </Row>
            </Col>
            {props?.storeDetails.websiteStatus == "true" && (
              <Col
                className="qr-div-align"
                xl={8}
                lg={8}
                md={8}
                sm={24}
                xs={24}
                style={{ paddingLeft: "0px" }}
              >
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                  <Link href={props?.storeDetails?.url}>
                    <a target="_blank">
                      <Button className="store-mgt-btn store-mgt-btn-color">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Image src={eye} alt="Eye" width={20} height={20} />
                          <span> &nbsp;&nbsp;PREVIEW WEBSITE</span>
                        </div>
                      </Button>
                    </a>
                  </Link>
                </Col>
                <div>
                  <Image
                    unoptimized
                    src={props?.storeDetails?.qrcode}
                    alt="QR Code"
                    height={80}
                    width={80}
                  />
                </div>
                <span
                  onClick={() => setQrDownloadModal(!qrDownloadModal)}
                  className="cursor"
                  style={{ marginLeft: "0.5rem", padding: "0 8px" }}
                >
                  <Image src={download} alt="Download" />
                  <span style={{ color: "#5902B3" }}>
                    {" "}
                    Download Store QR Code
                  </span>
                </span>
              </Col>
            )}
          </Row>
        </React.Fragment>
      ) : (
        <React.Fragment key={2}>
          <Spin spinning={isLoading} indicator={antIcon}>
            <p className=" store-mgt-sub-header-title">Store Details</p>
            <Form
              name="store_details"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Row gutter={16} className="mt-2">
                <Col
                  className="gutter-row"
                  xl={7}
                  lg={7}
                  md={8}
                  sm={24}
                  xs={24}
                >
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Store Name",
                      },
                      {
                        pattern: /^[^\s].+[^\s]$/g,
                        //pattern: new RegExp(/^[a-zA-Z0-9 ]+$/i),
                        message: "Invalid store name",
                      },
                    ]}
                    initialValue={props?.storeDetails?.name}
                  >
                    <Input
                      placeholder="Store Name *"
                      style={style.inputStyle}
                      onKeyPress={(e) => {
                        if (/[^A-Za-z0-9 ]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col
                  className="gutter-row"
                  xl={7}
                  lg={7}
                  md={8}
                  sm={24}
                  xs={24}
                  id="industry-type"
                >
                  <Form.Item
                    name="type"
                    rules={[
                      {
                        required: true,
                        message: "Please Select Industry",
                      },
                    ]}
                    initialValue={props?.storeDetails?.type}
                  >
                    <Select placeholder="Industry *">
                      {industryData && industryData.length > 0
                        ? industryData.map((e, index) => {
                            return (
                              <Select.Option value={e.name} key={index}>
                                {e.name}
                              </Select.Option>
                            );
                          })
                        : null}
                    </Select>
                  </Form.Item>
                </Col>
                <Col
                  className="gutter-row"
                  xl={7}
                  lg={7}
                  md={8}
                  sm={24}
                  xs={24}
                >
                  <Form.Item
                    name="gstin"
                    initialValue={props?.storeDetails?.gstin}
                    rules={[
                      {
                        pattern:
                          /^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/g,
                        message: "Invalid GSTIN",
                      },
                    ]}
                  >
                    <Input
                      placeholder="GSTIN "
                      style={style.inputStyle}
                      minLength={15}
                      maxLength={15}
                      onInput={(e) => {
                        e.target.value = e.target.value?.toUpperCase();
                      }}
                      onKeyPress={(e) => {
                        if (/[^A-Za-z0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col
                  className="gutter-row"
                  xl={14}
                  lg={14}
                  md={14}
                  sm={24}
                  xs={24}
                >
                  {/* <div className="d-flex" style={style.inputStyle}>
                    <div style={{ marginLeft: "12px", marginTop: "5px" }}>
                      <span style={{ color: "#BDC7D1" }}>Store URL</span>
                      <br />
                      <span style={{ color: "#BDC7D1" }}>
                        http://zlite-uat.hutechweb.com/
                      </span>
                    </div>
                    <Divider type="vertical" style={style.divider} />
                    <Form.Item
                      name="url"
                      initialValue={props?.storeDetails?.url}
                      style={{ width: "200px" }}
                      rules={[
                        {
                          required: true,
                          message: "Please Input Store URL",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter Here *"
                        style={style.storeUrl}
                      />
                    </Form.Item>
                  </div> */}
                  <Form.Item
                    name="url"
                    initialValue={props?.storeDetails?.url}
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Store URL",
                      },
                      {
                        pattern: /^((?!(www.|http|zlite|discover.)))/g,
                        message: "Invalid Store URL",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Store URL *"
                      style={style.inputStyle}
                      disabled={props?.storeDetails ? true : false}
                      onKeyPress={(e) => {
                        if (/[^A-Za-z0-9 ]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col
                  className="gutter-row mt-1"
                  xl={9}
                  lg={9}
                  md={9}
                  sm={24}
                  xs={24}
                >
                  {/* <Button
                  className="store-mgt-btn store-mgt-btn-color w-100"
                  htmlType="submit"
                >
                  VALIDATE
                </Button> */}
                  <Button
                    className="store-mgt-btn store-mgt-cancel-btn-color  w-100  ml-1"
                    onClick={() => setEdit(!edit)}
                  >
                    CANCEL
                  </Button>
                  <Button
                    className="store-mgt-btn store-mgt-btn-color w-100 ml-1"
                    htmlType="submit"
                  >
                    SAVE
                  </Button>
                </Col>
                {/* <Col xl={12} lg={8} md={8}></Col> */}
                {/* <Col
                className="gutter-row mt-2"
                xl={12}
                lg={12}
                md={12}
                sm={24}
                xs={24}
              >
                <Button
                  className="store-mgt-btn store-mgt-cancel-btn-color ml-1"
                  onClick={() => setEdit(!edit)}
                >
                  CANCEL
                </Button>
                <Button
                  className="store-mgt-btn store-mgt-btn-color w-100 ml-1"
                  onClick={submitStoreData}
                >
                  SAVE
                </Button>
              </Col> */}
              </Row>
            </Form>
          </Spin>
        </React.Fragment>
      )}
    </>
  );
}

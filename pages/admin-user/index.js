/* eslint-disable react/jsx-key */
import { Row, Col, message } from "antd";
import React, { useState, useEffect } from "react";
import { Form, Button, Input, Select, DatePicker, Table } from "antd";
import Image from "next/image";
import "antd/dist/antd.css";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import dayjs from "dayjs";
import axios from "axios";
import { baseUrl } from "../../util/baseUrl";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
dayjs.extend(customParseFormat);

const cookies = new Cookies();
const AdminUser = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [subscriptionArray, setSubscriptionArray] = useState([]);
  const [list, setlist] = useState(true);
  const [listUser, setListUser] = useState([]);
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
    getData();
    getAllUser();
  }, []);

  const columns = [
    {
    title: 'Client',
    dataIndex: 'name',
    key: "name",
  },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
    },
     {
      title: "Store Link",
      dataIndex: "storeurl",
      key: "storeurl",
      render: (row, record) => (
        <span>
          <a href={`https://discover.zlite.in/${record?.storeurl}`} target="_blank" rel="noreferrer" style={{color: "#5902b3"}}>
            {record?.storeurl}
          </a>
        </span>
      ),
    },
    // {
    //   title: "Store Link",
    //   dataIndex: "storeurl",
    //   key: "storeurl",
    //   render: (row, record) => (
    //     <span>
    //       <a
    //         href={`http://zef-dis.hutechweb.com/${record?.storeurl}`}
    //         target="_blank"
    //         rel="noreferrer"
    //         style={{ color: "#5902b3" }}
    //       >
    //         {record?.storeurl}
    //       </a>
    //     </span>
    //   ),
    // },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "address",
    },
  ];
  const getAllUser = async () => {
    axios
      .get(baseUrl + "get-all-user")
      .then((res) => {
        setListUser(res?.data?.data);
        const temp = [];
        res?.data?.data.map((e, index) => {
          if ((e?.email || e?.phoneNumber) && e?.expiryDate) {
            temp.push({
              key: index,
              name: e?.email || e?.phoneNumber,
              plan:
                e?.subscriptions && e.subscriptions.length
                  ? e.subscriptions?.[0]?.planName
                  : "N/A",
              expiryDate: (e?.expiryDate && e.expiryDate?.split("T")[0]) || "-",
              storeurl: e?.storeurl
            });
          }
        });
        setListUser(temp);
        // message.success(res?.data?.message);
      })
      .catch((error) => {
        console.log("err", error);
        message.error("Internal Server Error");
      });
  };
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
    } else {
      message.error("Internal Server Error");
    }
  };
  const onFinish = async (values) => {
    const payload = {
      email: values.mobEmail,
      expirydate: moment(values.expiryDate).format("YYYY-MM-DD"),
      subscriptionId: values.subscription,
      mobile: values.mobile,
    };
    axios
      .post(baseUrl + "create-user", payload)
      .then((res) => {
        message.success(res.data.message);
        form.resetFields();
        getAllUser();
        setlist(!list);
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  };
  const onReset = () => {
    form.resetFields();
  };
  const onFill = () => {
    form.setFieldsValue({
      note: "Hello world!",
      gender: "male",
    });
  };
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  const mobileNumberValidation = (e) => {
    let temp = e.target.value;
    if (temp.length >= 10) {
      e.target.value = e.target.value.substring(0, temp.length - 1);
    }
  };
  return (
    <>
      {list ? (
        <>
          {/* <div style={{ textAlign: "right", marginBottom: "1rem" }}>
            <Button
              className="store-mgt-btn store-mgt-btn-color w-100 ml-1"
              onClick={() => setlist(!list)}
            >
              Create
            </Button>
          </div> */}
          <Row>
            <Col className="gutter-row" xl={24} lg={24} md={24} sm={24} xs={24}>
              <Table
                scroll={{ y: 400 }}
                dataSource={listUser}
                columns={columns}
              />
            </Col>
          </Row>
        </>
      ) : (
        <>
          <div
            style={{ textAlign: "right", marginBottom: "1rem" }}
            onClick={() => setlist(!list)}
          >
            <Button className="store-mgt-btn store-mgt-btn-color w-100 ml-1">
              List
            </Button>
          </div>
          <Form
            name="admin_user"
            onFinish={onFinish}
            autoComplete="off"
            form={form}
          >
            <Row gutter={16} className="mt-2">
              <Col className="gutter-row" xl={6} lg={6} md={6} sm={24} xs={24}>
                <Form.Item
                  name="mobEmail"
                  rules={[
                    {
                      type: "email",
                      required: true,
                      message: "Please Enter Email",
                    },
                  ]}
                >
                  <Input placeholder="Email *" style={style.inputStyle} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" xl={6} lg={6} md={6} sm={24} xs={24}>
                <Form.Item
                  name="mobile"
                  rules={[
                    {
                      pattern: new RegExp(/^[0-9]{10}$/g),
                      required: true,
                      message: "Please Enter Valid Mobile No.",
                    },
                  ]}
                >
                  <Input
                    placeholder="Mobile No *"
                    style={style.inputStyle}
                    type="number"
                    minLength={10}
                    maxLength={10}
                    onKeyPress={(e) => mobileNumberValidation(e)}
                  />
                </Form.Item>
              </Col>
              <Col
                className="gutter-row"
                xl={6}
                lg={6}
                md={6}
                sm={24}
                xs={24}
                id="subscription"
              >
                <Form.Item
                  name="subscription"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Subscription",
                    },
                  ]}
                >
                  <Select placeholder="Select Subscription *">
                    {subscriptionArray.map((e, index) => {
                      return (
                        <Select.Option value={e._id} key={e._id}>
                          {e.planName}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col
                className="gutter-row"
                xl={6}
                lg={6}
                md={6}
                sm={24}
                xs={24}
                id="expiry"
              >
                <Form.Item
                  name="expiryDate"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Expiry Date",
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="Select Expiry Date *"
                    disabledDate={(current) => {
                      return moment().add(1, "month") >= current;
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
                <Button
                  className="store-mgt-btn store-mgt-btn-color w-100 ml-1"
                  htmlType="submit"
                >
                  SAVE
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </>
  );
};
export default AdminUser;

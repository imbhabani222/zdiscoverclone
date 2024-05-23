import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { Upload, Col, Row, Form, Input, Button, message } from "antd";
import ImgCrop from "antd-img-crop";
import uploadImg from "../../../assets/images/upload.svg";
import testimonial1 from "../../../assets/images/testmonial1.svg";
import styles from "./addTestimonialInfo.module.css";
import Cookies from "universal-cookie";
import { baseUrl } from "../../../util/baseUrl";
import axios from "axios";

const cookies = new Cookies();
const token = cookies.get("loginToken");
const storeid = cookies.get("storeid");

const { TextArea } = Input;
const AddTestimonialInfo = () => {
  const [updateTestimonial, setUpdateTestimonial] = useState({});
  const [testimonialArray, setTestimonialarray] = useState([]);

  const [form] = Form.useForm();
  const router = useRouter();
  // console.log(router);
  const { testimonialData } = router.query;
  const header = {
    Authorization: token,
  };

  const [fileListLogo, setFileListLogo] = useState([]);

  const onChangeLogo = ({ fileList: newFileList }) => {
    setFileListLogo(newFileList);
  };
  //console.log(fileListLogo[0]?.response);
  const onPreviewLogo = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  useEffect(() => {
    if (testimonialData) {
      getTestimonialData();
    }
  }, []);

  const getTestimonialData = async () => {
    const payload = {
      storeid: storeid,
    };
    let data = await fetch(`/api/getTestimonialDetail`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let res = await data.json();

    const editingCard = res?.data?.data?.filter(
      (item, index) => item._id === testimonialData
    );
    setTestimonialarray(editingCard);
    if (testimonialData !== "add" && editingCard.length > 0) {
      form.setFieldsValue({
        id: testimonialData,
        url: editingCard[0]?.url,
        name: editingCard[0]?.name,
        designation: editingCard[0]?.designation,
        description: editingCard[0]?.description,
      });
      setFileListLogo(
        editingCard[0]?.url ? [{ url: editingCard[0]?.url }] : []
      );
    }
  };
  const fileRequestHandle = async (e) => {
    const form = new FormData();
    form.set("file", e);
    try {
      const response = await axios.post(
        `${baseUrl}upload-testimonial-image`,
        form,
        {
          headers: {
            //"Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      let list = response?.data?.data;
      if (response.status === 201) {
        setFileListLogo([...fileListLogo, { url: list }]);
        message.success(response?.data?.message);
      } else {
        message.error("internal server error");
      }
    } catch {
      message.error("Try with different Image.");
    }
  };

  const onFinish = async (values) => {
    // console.log(values);
    if (testimonialData === "add") {
      const payload = {
        storeid: storeid,
        url: fileListLogo.length > 0 ? fileListLogo[0].url : "",
        name: values.name,
        designation: values.designation,
        description: values.description,
      };
      // console.log(payload.url);

      let data = await fetch(`/api/createTestimonial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });
      let res = await data.json();
      message.success(res?.data?.message);
      router.push(`/additional-information`);
      form.resetFields();
    } else {
      const payload = {
        id: testimonialData,
        url: fileListLogo.length > 0 ? fileListLogo[0].url : "",
        name: values.name,
        designation: values.designation,
        description: values.description,
      };
      // console.log(payload.url);

      setUpdateTestimonial(payload);
      let data = await fetch(`/api/updateTestimonial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });
      let res = await data.json();
      message.success(res?.data?.message);
      form.resetFields();
      router.push(`/additional-information`);
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    // router.push(`/additional-information`);
  };
  // const getTestimonialDetails = async () => {
  //   console.log(testimonialData);
  //   if (testimonialData !== "add") {
  //     const payload = {
  //       storeid: storeid,
  //     };
  //     let data = await fetch(`/api/getTestimonialDetail`, {
  //       method: "POST",
  //       body: JSON.stringify(payload),
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: token,
  //       },
  //     });
  //     let res = await data.json();
  //     console.log(res?.data?.data);
  //     setUpdateTestimonial(res?.data?.data);

  //     console.log(updateTestimonial);
  //     form.setFieldsValue({
  //       id: testimonialData,
  //       url: updateTestimonial.url,
  //       name: updateTestimonial.name,
  //       designation: updateTestimonial.designation,
  //       description: updateTestimonial.description,
  //     });
  //   }
  // };
  // useEffect(() => {
  //   getTestimonialDetails();
  // }, []);

  return (
    <div className={styles.section_wrapper}>
      <div className={styles.section_heading}>Display Image</div>

      <div className={styles.section_content_row2}>
        <Form
          form={form}
          requiredMark={false}
          name="testimonial_details"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item name="url">
            <ImgCrop
              modalOk={"Save"}
              aspect={100 / 100}
              modalClassName="img-crop"
              quality={1}
            >
              <Upload
                // action={`${baseUrl}upload-testimonial-image`}
                customRequest={fileRequestHandle}
                listType="picture-card"
                // headers={header}
                fileList={fileListLogo}
                beforeUpload={(file) => {
                  let type = file.type.split("/")[1];
                  if (file.size / 1024 / 1024 > 5) {
                    message.warning("Maximum upload file size 5 MB.");
                  } else if (type !== "jpeg" && type !== "png") {
                    message.warning("Only PNG and JPEG are allowed.");
                  } else {
                    fileRequestHandle(file);
                  }
                }}
                onChange={onChangeLogo}
                onPreview={onPreviewLogo}
                style={{ width: 200 }}
              >
                {fileListLogo.length < 1 && (
                  <div style={{ display: "block" }}>
                    <div>
                      <Image src={uploadImg} alt="Upload Image" />
                    </div>
                    <div>Upload Image</div>
                    <p>Maximum upload file size 5 MB.</p>
                    <p>Only PNG and JPEG are allowed.</p>
                  </div>
                )}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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
                  placeholder="Name*"
                  className={styles.inputStyle}
                  onKeyPress={(e) => {
                    if (/^[^ A-Za-z_./&-]*$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                name="designation"
                rules={[
                  {
                    required: true,
                    message: "Please input your designation",
                  },
                  {
                    pattern: /^(?!\s).*/,
                    message: "Please input a valid designation",
                  },
                ]}
              >
                <Input
                  placeholder="Designation*"
                  className={styles.inputStyle}
                  onKeyPress={(e) => {
                    if (
                      /^[^ A-Za-z_@./&-]*$/.test(e.key) ||
                      e.charCode === 32
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description">
            <TextArea
              rows={4}
              showCount
              maxLength={100}
              placeholder="Description"
              //className={styles.inputStyle}
              className="about-store-border"
            />
          </Form.Item>
          <Row gutter={[8, 8]} justify={"end"} style={{ marginTop: "5rem" }}>
            {/* <Col xl={12} lg={12} md={12} sm={24} xs={24}></Col> */}
            <Col>
              <Form.Item>
                <Button
                  //={styles.section_cancel_btn}
                  className="store-mgt-btn store-mgt-cancel-btn-color  w-100  ml-1"
                  onClick={() => router.push(`/additional-information`)}
                >
                  CANCEL
                </Button>
                <Button
                  //className={styles.section_save_btn}
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
  );
};

export default AddTestimonialInfo;

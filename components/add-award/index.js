import React, { useState, useEffect } from "react";
import { Button, Divider, Upload, message, Empty } from "antd";
import Image from "next/image";
import ImgCrop from "antd-img-crop";
import styles from "../add-award/styles.module.css";
import editIcon from "../../assets/images/editIcon.svg";
import uploadImg from "../../assets/images/upload.svg";
import { baseUrl } from "../../util/baseUrl";
import Cookies from "universal-cookie";
import backIcon from "../../assets/images/left-back.png";
import axios from "axios";

const cookies = new Cookies();
const token = cookies.get("loginToken");

const AddAward = () => {
  const [storeId, setStoreId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [fileListAward, setFileListAward] = useState([]);

  useEffect(() => {
    const storeid = cookies.get("storeid");
    setStoreId(storeid);
    if(storeid != "null"){
      getAwardData(storeid);
    }
  }, []);

  const getAwardData = async (id) => {
      let data = await fetch(`/api/getAwards`, {
        method: "POST",
        body: JSON.stringify({ storeid: id }),
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      let res = await data.json();
      if (res.status) {
        let fileList = [];
        res?.data?.data.map((e) => {
          fileList.push({
            url: e.url,
            id: e._id,
          });
        });
        setFileListAward(fileList);
      } else {
        message.error("Internal Server Error");
      }
  };

  const fileRequestHandle = async (e) => {
    const form = new FormData();
    form.set("file", e);
    form.set("storeid", storeId);
    try {
      const response = await axios.post(`${baseUrl}add-award`, form, {
        headers: {
          Authorization: token,
        },
      });
      if (response?.data?.code == 200) {
        let list = response?.data?.data?.url;
        let imgId = response?.data?.data?._id;
        setFileListAward([...fileListAward, { url: list, id: imgId }]);
        message.success(response.data.message);
      } else {
        message.error("Internal Server Error");
      }
    } catch {
      message.error("Try with different Image.");
    }
  };

  const handelDeleteFile = async (e) => {
    let data = await fetch(`/api/deleteAward/${e.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let res = await data.json();

    if (res.status) {
      message.success(res?.data?.message);
      const storeid = cookies.get("storeid");
      getAwardData(storeid);
    } else {
      message.error("Internal Server Error");
    }
  };
  const handelAwardEdit = () => {
    setIsEdit(true);
  };

  const onChangeAward = ({ fileList: newFileList }) => {
    setFileListAward(newFileList);
  };

  return (
    <div className={styles.section_wrapper}>
      <div
        className={styles.section_content_wrapper}
        style={
          isEdit !== true && fileListAward.length == 0
            ? { justifyContent: "space-between" }
            : { justifyContent: "left", gap: "10px" }
        }
      >
        <div className={styles.section_edit_wrapper}>
          {isEdit === true ? (
            <div style={{ textAlign: "right" }}>
              <Image
                src={backIcon}
                alt="back"
                width={17}
                height={15}
                onClick={() => setIsEdit(!isEdit)}
                className="cursor"
              />
              {/* <a
                className="store-mgt-btn store-mgt-cancel-btn-color w-100 ml-1"
                onClick={() => setIsEdit(!isEdit)}
              >
                <LeftCircleOutlined />
              </a> */}
            </div>
          ) : (
            ""
          )}
          <h1 className={styles.section_heading}>Awards and Certificates </h1>
          {/* {isEdit !== true && fileListAward.length == 0 ? (
            <div>
              <Button
                className="store-mgt-btn store-mgt-btn-color ml-1"
                onClick={handelAwardEdit}
              >
                + Add New
              </Button>
            </div>
          ) : isEdit !== true && fileListAward.length > 0 ? (
            <div className={styles.edit_img}>
              <Image
                src={editIcon}
                alt="edit_image"
                onClick={handelAwardEdit}
              />
            </div>
          ) : (
            " "
          )} */}
        </div>
        <div>
          {isEdit !== true && fileListAward.length == 0 ? (
            <div>
              <Button
                className="store-mgt-btn store-mgt-btn-color ml-1"
                onClick={handelAwardEdit}
                disabled={storeId == "null" ? true : false}
              >
                + Add New
              </Button>
            </div>
          ) : isEdit !== true && fileListAward.length > 0 ? (
            <div
              className={styles.edit_img}
              style={{ marginBottom: "0.4rem", cursor: "pointer" }}
            >
              <Image
                src={editIcon}
                alt="edit_image"
                onClick={handelAwardEdit}
              />
            </div>
          ) : (
            " "
          )}
        </div>
      </div>
      <div className={styles.section_content_wrapper2}>
        {isEdit ? (
          <>
            {/* <ImgCrop modalOk={"Save"} modalClassName="img-crop" quality={1}> */}
            <Upload
              listType="picture-card"
              fileList={fileListAward}
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
              // onChange={onChangeAward}
              style={{ width: 200 }}
              onRemove={handelDeleteFile}
            >
              {fileListAward.length < 25 && (
                <div style={{ display: "block", width: "auto" }}>
                  <div>
                    <Image src={uploadImg} alt="Upload Image" />
                  </div>
                  <div>Upload Image</div>
                  <p>Maximum upload file size 5 MB.</p>
                  <p>Only PNG and JPEG are allowed.</p>
                </div>
              )}
            </Upload>
            {/* </ImgCrop> */}
          </>
        ) : fileListAward.length === 0 ? (
          <div style={{ textAlign: "center", margin: "0 auto" }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          fileListAward.map((ele) => (
            <div className={styles.client_content_wrapper} key={ele.id}>
              <div className={styles.image_container}>
                <Image
                  objectFit="contain"
                  src={`${ele?.url}`}
                  alt="alt"
                  width={"100%"}
                  height={"100%"}
                  fill
                  sizes="(max-width: 768px) 100vw,
        (max-width: 1200px) 50vw,
        33vw"
                  style={{ borderRadius: "10px" }}
                />
              </div>
            </div>
          ))
        )}
      </div>
      {/* {isEdit === true ? (
        <div style={{ textAlign: "right" }}>
          <Button
            className="store-mgt-btn store-mgt-cancel-btn-color w-100 ml-1"
            onClick={() => setIsEdit(!isEdit)}
          >
            CANCEL
          </Button>
        </div>
      ) : (
        ""
      )} */}
      <Divider style={{ background: "#C4C4C4", margin: "3rem 0" }} />
    </div>
  );
};

export default AddAward;

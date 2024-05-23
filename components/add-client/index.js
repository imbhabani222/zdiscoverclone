import React, { useState, useEffect } from "react";
import { Button, Divider, Upload, message, Empty } from "antd";
import Image from "next/image";
import ImgCrop from "antd-img-crop";
import styles from "../add-client/styles.module.css";
import editIcon from "../../assets/images/editIcon.svg";
import uploadImg from "../../assets/images/upload.svg";
import Cookies from "universal-cookie";
import axios from "axios";
import { baseUrl } from "../../util/baseUrl";
import backIcon from "../../assets/images/left-back.png";
const cookies = new Cookies();
const token = cookies.get("loginToken");

const AddClient = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [storeId, setStoreId] = useState("");
  const [fileListClient, setFileListClient] = useState([]);

  useEffect(() => {
    const storeid = cookies.get("storeid");
    setStoreId(storeid);
    if(storeid != "null"){
      getClientData(storeid);
    }
    
  }, []);

  const getClientData = async (id) => {
    let data = await fetch(`/api/getClients`, {
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

      setFileListClient(fileList);
    } else {
      message.error("Internal Server Error");
    }
  };

  const fileRequestHandle = async (e) => {
    const form = new FormData();
    form.set("file", e);
    form.set("storeid", storeId);
    try {
      const response = await axios.post(`${baseUrl}add-client`, form, {
        headers: {
          Authorization: token,
        },
      });
      let list = response?.data?.data?.url;
      let imgId = response?.data?.data?._id;
      setFileListClient([...fileListClient, { url: list, id: imgId }]);
    } catch {
      message.error("Try with different Image.");
    }
  };

  const handelDeleteFile = async (e) => {
    let data = await fetch(`/api/deleteClient/${e.id}`, {
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
      getClientData(storeid);
    } else {
      message.error("Internal Server Error");
    }
  };

  const handelEdit = () => {
    setIsEdit(true);
  };

  const onChangeClient = ({ fileList: newFileList }) => {
    setFileListClient(newFileList);
  };

  return (
    <div className={styles.section_wrapper}>
      <div
        className={styles.section_content_wrapper}
        style={
          isEdit !== true && fileListClient.length == 0
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

          <h1 className={styles.section_heading}>Our Clients</h1>
          {/* {isEdit !== true && fileListClient.length == 0 ? (
            <div>
              <Button
                className="store-mgt-btn store-mgt-btn-color ml-1"
                onClick={handelEdit}
              >
                + Add New
              </Button>
            </div>
          ) : isEdit !== true && fileListClient.length > 0 ? (
            <div className={styles.edit_img}>
              <Image src={editIcon} alt="edit_image" onClick={handelEdit} />
            </div>
          ) : (
            " "
          )} */}
          {/* {isEdit !== true ? (
            <div className={styles.edit_img}>
              <Image src={editIcon} alt="edit_image" onClick={handelEdit} />
            </div>
          ) : (
            ""
          )} */}
        </div>
        <div>
          {isEdit !== true && fileListClient.length == 0 ? (
            <div>
              <Button
                className="store-mgt-btn store-mgt-btn-color ml-1"
                onClick={handelEdit}
                disabled = {storeId == "null" ? true:false}
              >
                + Add New
              </Button>
            </div>
          ) : isEdit !== true && fileListClient.length > 0 ? (
            <div
              className={styles.edit_img}
              style={{ marginBottom: "0.4rem", cursor: "pointer" }}
            >
              <Image src={editIcon} alt="edit_image" onClick={handelEdit} />
            </div>
          ) : (
            " "
          )}
        </div>
      </div>
      <div className={styles.section_content_wrapper2}>
        {isEdit ? (
          <>
            {/* <ImgCrop
              modalOk={"Save"}
              aspect={700 / 400}
              modalClassName="img-crop"
              quality={1}
            > */}
              <Upload
                // customRequest={fileRequestHandle}
                listType="picture-card"
                fileList={fileListClient}
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
                // onChange={onChangeClient}
                style={{ width: 200 }}
                onRemove={handelDeleteFile}
              >
                {fileListClient.length < 25 && (
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
        ) : fileListClient.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              margin: "0 auto",
            }}
          >
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          fileListClient.map((ele) => (
            <>
              <div className={styles.client_content_wrapper} key={ele.id}>
                <Image
                  objectFit="contain"
                  src={`${ele?.url}`}
                  alt="client_image"
                  width={800}
                  height={400}
                />
              </div>
            </>
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

export default AddClient;

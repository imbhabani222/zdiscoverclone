/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ImgCrop from "antd-img-crop";
import editImg from "../../assets/images/editIcon.svg";
import {
  Radio,
  Divider,
  Upload,
  Button,
  Row,
  Col,
  message,
  Spin,
  Empty,
  Modal,
  Alert,
  Popconfirm,
} from "antd";
import style from "./storeGallery.module.css";
import uploadImg from "../../assets/images/upload.svg";
import accept from "../../assets/images/accept2.png";
import backIcon from "../../assets/images/left-back.png";
import { baseUrl } from "../../util/baseUrl";
import Cookies from "universal-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { acceptedFile } from "../../util/acceptedFile";
const cookies = new Cookies();
const token = cookies.get("loginToken");
import Icon, { Loading3QuartersOutlined } from "@ant-design/icons";
import deleteIcon from "../../assets/images/deleteicon.svg";
import eyeIcon from "../../assets/images/view-black.png";
import Link from "next/link";
import Auth from "../../util/auth";
const antIcon = (
  <Loading3QuartersOutlined style={{ fontSize: 50, color: "#5902b3" }} spin />
);
const antIcon2 = (
  <Loading3QuartersOutlined style={{ fontSize: 25, color: "#5902b3" }} spin />
);
export default function StoreGallery() {
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
    let expiryTimeStamp = "";
    if (subData.data.code === 200) {
      let {isSubscribed, subscriptionId, expiryDate} = subData.data.data;
      let res = expiryDate ? await checkExpire(expiryDate) : false;
      if (isSubscribed === false) {
        Auth.removeToken();
        window.open("/login","_self");
      }else if(res === true){
        window.open("/subscription-plan","_self");
      }else{

      }
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
      return false;
    } else {
      return true;
    }
  };

  const [aspectRatio, setAspectRatio] = useState([
    { key: "1:1", value: "400 / 400" },
    { key: "3:2", value: "400 / 250" },
    { key: "2:3", value: "250 / 400" },
    { key: "5:4", value: "550 / 400" },
    { key: "4:5", value: "400 / 550" },
    { key: "16:9", value: "700 / 400" },
    { key: "9:16", value: "400 / 700" },
  ]);
  const [aspectValue, setAspectValue] = useState("400 / 250");
  const [fileListGallery, setFileListGallery] = useState([]);
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [storeId, setStoreId] = useState("");
  const [allowedPic, setAllowedPic] = useState("0");

  const [cropperBanner, setCropperBanner] = useState();
  const [imgCropBannerModal, setImgCropBannerModal] = useState(false);
  const [imageBanner, setImageBanner] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  const imgBannerRef = useRef(null);
  const [fileListBanner, setFileListBanner] = useState([]);
  const [bannerlist, setbannerlist] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState("");
  const [finalGalleryList, setFinalGalleryList] = useState([]);
  const [notCroppedImg, setNotCroppedImg] = useState();
  useEffect(() => {
    const storeid = cookies.get("storeid");
    setStoreId(storeid);
    if (storeid != "null") {
      getStoreGallery(storeid);
      let subData = JSON.parse(
        JSON.stringify(cookies.get("subscription_data"))
      );
      let sId = cookies.get("subscrition_id");
      if (subData != "undefined") {
        let temp = subData.filter((e) => e._id == sId);
        const x = temp[0]?.planDetails?.image?.title;
        if (x) {
          let y = parseInt(x.split("(")[1].split(")")[0]);
          setAllowedPic(y);
        }
      }
    }
  }, []);

  useEffect(() => {}, [aspectValue]);

  const getStoreGallery = async (id) => {
    setIsLoading(true);
    let data = await fetch(`/api/getGallery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ storeid: id }),
    });
    let res = await data.json();
    if (res.status) {
      let fileList = [];
      let galleryList = [];
      res?.data?.data.map((e) => {
        fileList.push({
          url: e.url,
          id: e._id,
          status: true,
        });
      });
      setFileListGallery(fileList);
      if (res?.data?.data.length > 0) {
        setAspectValue(
          res?.data?.data[0].ratio ? res?.data?.data[0].ratio : "400 / 250"
        );
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
      message.error("Internal Server Error");
    }
  };
  const onChangeGallery = ({ fileList: newFileList }) => {
    setFileListGallery(newFileList);
  };
  const changeAspect = (e) => {
    setAspectValue(e.target.value);
    let val = e.target.value;
    cookies.set("aspect", e.target.value);
  };
  const fileRequestHandle = async (e) => {
    const form = new FormData();
    form.set("file", e);
    form.set("storeid", storeId);
    try {
      const response = await axios.post(`${baseUrl}add-galleryImage`, form, {
        headers: {
          //"Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });
      let list = response?.data?.data?.url;
      let imgId = response?.data?.data?._id;
      if (response?.data?.code == 200) {
        setFileListGallery([...fileListGallery, { url: list, id: imgId }]);
        message.success(response?.data?.message);
      } else {
        message.error("internal server error");
      }
    } catch {
      message.error("Try with different Image.");
    }
  };
  const deleteFile = async (e) => {
    setIsLoading(true);
    let data = await fetch(`/api/deleteGallery/${e}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let res = await data.json();
    if (res.status) {
      setIsLoading(false);
      message.success(res?.data?.message);
    } else {
      setIsLoading(false);
      message.error("Internal Server Error");
    }
    getStoreGallery(storeId);
  };
  ///---New Store Gallery---///
  const bannerUpload = () => {
    imgBannerRef.current.click();
  };
  const onChangeBannerCrop = (e) => {
    const list = [];

    try {
      if (e.target || e.dataTransfer) {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        let length = fileListGallery.length + e.target.files.length;
        if (e.target.files.length <= allowedPic && length <= allowedPic) {
          let x = files[0].name.split(".");
          let y = x[x.length - 1];
          if (files[0].size > 5000000) {
            message.warning("Maximum upload size is 5 MB.", [3]);
          } else if (acceptedFile.includes(y)) {
            const reader = new FileReader();
            reader.onload = () => {
              setImageBanner(reader.result);
            };
            reader.readAsDataURL(files[0]);
            Object.keys(e.target.files).map((f, index) => {
              const reader = new FileReader();
              reader.onload = () => {
                list.push({ id: index, src: reader.result });
                let soretedData = list.sort(
                  (a, b) => parseFloat(a.id) - parseFloat(b.id)
                );

                setGalleryList([...galleryList, ...soretedData]);
              };
              reader.readAsDataURL(e.target.files[f]);
            });
            // setGalleryList([...galleryList, ...list]);
            setShowBanner(false);
            setImgCropBannerModal(true);
          } else {
            message.warning("Only JPG & PNG are allowed.", [3]);
          }
        } else {
          message.error("You can't upload more than " + allowedPic + " images");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getCropBannerData = async () => {
    setIsLoading2(true);
    if (typeof cropperBanner !== "undefined") {
      setImageBanner(cropperBanner.getCroppedCanvas().toDataURL());
      const temp = galleryList;
      const temp1 = finalGalleryList;
      let x = cropperBanner.getCroppedCanvas().toDataURL();
      const payload = {
        galleryimage: x,
      };
      let i = temp.findIndex((e) => e.id == currentIndex);
      console.log(i);
      temp[i].src = x;
      temp[i].status = true;
      setGalleryList(temp);
      let id = temp1.findIndex((e) => e.id == currentIndex);
      try {
        let data = await fetch(`${baseUrl}upload-galleryImage/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        });

        let res = await data.json();
        if (res.code == 200) {
          if (id >= 0) {
            temp1[id].src = res?.data;
          } else {
            temp1.push({ id: i, src: res?.data, status: true });
          }
          setFinalGalleryList(temp1);
          let lengthDiff = temp.length - temp1.length;
          if (lengthDiff >= 0) {
            setNotCroppedImg(lengthDiff);
          }

          if (currentIndex < galleryList.length - 1) {
            console.log("if");
            setCurrentIndex(+currentIndex + 1);
            setImageBanner(galleryList[+currentIndex + 1].src);
            setIsLoading2(false);
          }else{
            setIsLoading2(false);
          }
        }
      } catch {
        message.error("Entity is too large. Try with different Image.");
      }
    }
  };
  const callThis = (e) => {
    // if(finalGalleryList.length
    //   <= e.id){
    //   message.info()
    // }else{
    setImageBanner(e.src);
    setCurrentIndex(e.id);
    // }
  };
  const closeCropperModal = () => {
    setGalleryList([]);
    setFinalGalleryList([]);
    setImageBanner("");
    setCurrentIndex(0);
    setImgCropBannerModal(false);
    setNotCroppedImg(0);
    try {
      let x = document.getElementById("gallery-id");
      x.value = "";
    } catch (err) {}
  };
  const saveStoreGallery = async () => {
    setIsLoading2(true);
    let lengthDiff = galleryList.length - finalGalleryList.length;
    if (lengthDiff >= 0) {
      setNotCroppedImg(lengthDiff);
    }
    if (finalGalleryList.length > 0) {
      let temp = [];
      finalGalleryList.map((e) => {
        temp.push({
          url: e.src,
        });
      });
      const payload = {
        galleryData: temp,
        storeid: storeId,
        ratio: aspectValue,
      };
      try {
        let data = await fetch(`${baseUrl}add-galleryImage/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        });
        let res = await data.json();
        if (res?.code == 200) {
          message.success(res?.message);
          getStoreGallery(storeId);
          closeCropperModal();
          setIsLoading2(false);
          try {
            let x = document.getElementById("gallery-id");
            x.value = "";
          } catch (err) {}
        }
      } catch {
        message.error("Internal Server Error");
        setIsLoading2(false);
      }
    }else{
      // closeCropperModal();
      setIsLoading2(false);
    }
  };
  ///------///

  useEffect(() => {}, [aspectValue]);
  // console.log(allowedPic);
  // console.log(fileListGallery.length);
  // console.log(fileListGallery.length !== allowedPic);
  return (
    <Spin spinning={isLoading} indicator={antIcon}>
      {edit ? (
        <>
          <p
            className="store-mgt-sub-header-title mr-1 d-flex"
            style={{ alignItems: "center" }}
          >
            <Image
              src={backIcon}
              width={17}
              height={15}
              onClick={() => setEdit(!edit)}
              className="cursor"
            />
            &nbsp;Aspect Ratio For Gallery Images{" "}
          </p>
          <Radio.Group
            onChange={fileListGallery.length > 0 ? "" : (e) => changeAspect(e)}
            //onChange={(e) => changeAspect(e)}
            value={aspectValue}
          >
            <Row gutter={20} className="mt-2">
              {aspectRatio.map((e, index) => {
                return (
                  <Col
                    className={`${style.aspect_ratio_wrapper} gutter-row ml-1`}
                    xl={3}
                    lg={3}
                    md={3}
                    sm={4}
                    xs={8}
                    key={index}
                  >
                    <Radio value={e.value}>{e.key}</Radio>
                  </Col>
                );
              })}
            </Row>
          </Radio.Group>

          <Divider />
          {/* New Store Gallerry */}
          <div className="mt-2 banner-upload-section">
            <Row>
              {fileListGallery.map((e, index) => {
                if (index < allowedPic) {
                  return (
                    <>
                      <div
                        className="store-gallery-img-wrapper"
                        style={{
                          margin: "1rem 0.5rem 0 0",
                          width: "240px",
                          height: "140px",
                        }}
                      >
                        <Image
                          src={e.url}
                          alt={e.url}
                          // layout="fill"
                          objectFit="contain"
                          width="150"
                          height="150"
                          // style={{ borderRadius: "15px" }}
                        />
                        <div style={{ marginLeft: "10px" }}>
                          <Image
                            src={deleteIcon}
                            alt="Delete"
                            className="cursor"
                            onClick={() => deleteFile(e.id)}
                          />
                        </div>{" "}
                        &nbsp;
                        <Link href={e.url}>
                          <a target="_blank">
                            <div style={{ marginRight: "-50px" }}>
                              <Image
                                src={eyeIcon}
                                alt="View"
                                className="cursor"
                                height={18}
                                width={18}
                              />
                            </div>
                          </a>
                        </Link>
                      </div>
                    </>
                  );
                }
              })}
              {fileListGallery.length !== allowedPic ? (
                <>
                  <input
                    type="file"
                    onChange={onChangeBannerCrop}
                    hidden
                    ref={imgBannerRef}
                    accept="image/png, image/jpeg"
                    id="gallery-id"
                    multiple
                  />
                  <div
                    className="store-gallery-img-wrapper-upload cursor mt-2"
                    //style={{ margin: 0 }}
                    onClick={bannerUpload}
                  >
                    <div style={{ display: "block" }}>
                      <div>
                        <Image src={uploadImg} alt="Upload Image" />
                      </div>
                      <div>Upload Image</div>
                      <p>Maximum upload file size 5 MB.</p>
                      <p style={{ marginTop: "-0.9rem" }}>
                        Only PNG and JPEG are allowed.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </Row>
          </div>
          <Modal
            style={{
              top: 15,
            }}
            open={imgCropBannerModal}
            destroyOnClose={true}
            width={700}
            //onCancel={() => setImgCropBannerModal(false)}
            footer={null}
            className="img-cropper"
          >
            <Row gutter={30}>
              {galleryList.map((e, id) => {
                return (
                  <Col
                    xl={4}
                    lg={4}
                    md={4}
                    sm={6}
                    xs={6}
                    key={id}
                    className="store-gallery-img-wrapper-modal"
                  >
                    {e.status ? (
                      <div style={{ padding: "2px" }}>
                        <Image
                          src={accept}
                          height="20"
                          width="20"
                          alt="uploaded"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <Image
                      src={e.src}
                      alt="Banner"
                      // layout="fill"
                      width="800"
                      height="800"
                      objectFit="contain"
                      onClick={() => callThis(e)}
                    />
                  </Col>
                );
              })}
            </Row>
            {notCroppedImg <= galleryList.length && notCroppedImg > 0 && (
              <Alert
                message={`You have not applied Crop to ${notCroppedImg} Images.`}
                type="warning"
                showIcon
              />
            )}
            <br />
            <Cropper
              style={{ height: 400, width: "100%" }}
              preview=".img-preview"
              src={imageBanner}
              viewMode={0}
              movable
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              onInitialized={(instance) => {
                setCropperBanner(instance);
              }}
              guides={true}
              aspectRatio={
                parseInt(aspectValue?.split("/")[0]) /
                parseInt(aspectValue?.split("/")[1])
              }
              // crop={getCropBannerData}
            />
            {/* {design()} */}
            <br />
            <Spin spinning={isLoading2} indicator={antIcon2}>
              <p
                style={{
                  color: "#5902b3",
                  fontWeight: "500",
                  textDecoration: "underline",
                  fontSize: "1rem",
                  textAlign: "center",
                }}
              >
                <span className="cursor" onClick={getCropBannerData}>
                  Apply Crop
                </span>
              </p>
            </Spin>

            <div className="d-flex">
              <Button
                className="store-mgt-btn store-mgt-cancel-btn-color  w-100  ml-1"
                onClick={() => closeCropperModal()}
              >
                CANCEL
              </Button>

              {/* <Button
                className="store-mgt-btn store-mgt-btn-color w-100 ml-1"
                onClick={saveStoreGallery}
              > */}
              {notCroppedImg <= galleryList.length && notCroppedImg > 0 ? (
                <Popconfirm
                  title={`Are you sure to save without cropping ${notCroppedImg} Images`}
                  onConfirm={saveStoreGallery}
                  //onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Spin spinning={isLoading2} indicator={antIcon2}>
                    <Button
                      className="store-mgt-btn store-mgt-btn-color w-100 ml-1"
                      // onClick={saveStoreGallery}
                    >
                      {" "}
                      SAVE
                    </Button>
                  </Spin>
                </Popconfirm>
              ) : (
                <Spin spinning={isLoading2} indicator={antIcon2}>
                  <Button
                    className="store-mgt-btn store-mgt-btn-color w-100 ml-1"
                    onClick={saveStoreGallery}
                  >
                    {" "}
                    SAVE
                  </Button>
                </Spin>
              )}
            </div>
          </Modal>
          {/* ////----//// */}
        </>
      ) : (
        // <>
        //   <p
        //     className="store-mgt-sub-header-title mr-1 d-flex"
        //     style={{ alignItems: "center" }}
        //   >
        //     <Image
        //       src={backIcon}
        //       width={17}
        //       height={15}
        //       onClick={() => setEdit(!edit)}
        //       className="cursor"
        //     />
        //     &nbsp;Aspect Ratio For Gallery Images{" "}
        //   </p>
        //   <Radio.Group
        //     onChange={fileListGallery.length > 0 ? "" : (e) => changeAspect(e)}
        //     value={aspectValue}
        //   >
        //     <Row gutter={20} className="mt-2">
        //       {aspectRatio.map((e, index) => {
        //         return (
        //           <Col
        //             className={`${style.aspect_ratio_wrapper} gutter-row ml-1`}
        //             xl={3}
        //             lg={3}
        //             md={3}
        //             sm={4}
        //             xs={8}
        //             key={index}
        //           >
        //             <Radio value={e.value}>{e.key}</Radio>
        //           </Col>
        //         );
        //       })}
        //     </Row>
        //   </Radio.Group>

        //   <Divider />
        //   <div>
        //     <p
        //       className="store-mgt-sub-header-title mr-1"
        //       style={{ marginBottom: "1rem" }}
        //     >
        //       Store Gallery Images{" "}
        //     </p>
        //     <ImgCrop
        //       modalOk={"Save"}
        //       aspect={
        //         parseInt(aspectValue.split("/")[0]) /
        //         parseInt(aspectValue.split("/")[1])
        //       }
        //       modalClassName="img-crop"
        //       quality={1}
        //     >
        //       <Upload
        //         listType="picture-card"
        //         customRequest={fileRequestHandle}
        //         fileList={fileListGallery}
        //         beforeUpload={(file) => {
        //           let type = file.type.split("/")[1];
        //           if (file.size / 1024 / 1024 > 5) {
        //             message.warning("Maximum upload file size 5 MB.");
        //           } else if (type !== "jpeg" && type !== "png") {
        //             message.warning("Only PNG and JPEG are allowed.");
        //           } else {
        //             fileRequestHandle(file);
        //           }
        //         }}
        //         onChange={onChangeGallery}
        //         style={{ width: 200 }}
        //         onRemove={deleteFile}
        //       >
        //         {fileListGallery.length < allowedPic && (
        //           <div style={{ display: "block" }}>
        //             <div>
        //               <Image src={uploadImg} alt="Upload Image" />
        //             </div>
        //             <div>Upload Image</div>
        //             <p>Maximum upload file size 5 MB.</p>
        //             <p>Only PNG and JPEG are allowed.</p>
        //           </div>
        //         )}
        //       </Upload>
        //     </ImgCrop>
        //   </div>
        //   <Divider />
        //   {/* <div style={{ textAlign: "right" }}>
        //     <Button
        //       className="store-mgt-btn store-mgt-cancel-btn-color w-100 ml-1"
        //       onClick={() => setEdit(!edit)}
        //     >
        //       CANCEL
        //     </Button>
        //   </div> */}
        // </>
        <>
          <div className="d-flex space-between">
            <div>
              <span className="store-mgt-sub-header-title mr-1">
                Store Gallery Images{" "}
              </span>
              {storeId != "null" && fileListGallery.length > 0 && (
                <Image
                  src={editImg}
                  alt="Edit"
                  className="cursor"
                  onClick={() => setEdit(!edit)}
                />
              )}
            </div>
            <div className="store-mgt-sub-header-title mr-1 gallery-block">
              <span>
                {fileListGallery.length > allowedPic
                  ? allowedPic
                  : fileListGallery.length}
                /{allowedPic} Images{" "}
              </span>
              {fileListGallery.length === 0 && (
                <Button
                  className="store-mgt-btn store-mgt-btn-color"
                  onClick={() => setEdit(!edit)}
                  disabled={storeId == "null" ? true : false}
                >
                  + Add New
                </Button>
              )}
            </div>
          </div>

          <Divider style={{ margiTop: "10rem" }} />
          {fileListGallery.length == 0 ? (
            <div style={{ textAlign: "center" }}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : (
            <Row>
              {fileListGallery.map((e, index) => {
                if (index < allowedPic) {
                  return (
                    <Col
                      className="gutter-row"
                      xl={5}
                      lg={5}
                      md={6}
                      sm={12}
                      xs={12}
                      key={index}
                    >
                      <div className="store-gallery-img-wrapper">
                        <Image
                          src={e.url}
                          alt={e.url}
                          // layout="fill"
                          objectFit="contain"
                          width="200"
                          height="200"
                          // style={{ borderRadius: "15px" }}
                        />
                      </div>
                    </Col>
                  );
                }
              })}
            </Row>
          )}
        </>
      )}

      {/* <span className="store-mgt-sub-header-title mr-1">
        Store Gallery Images{" "}
      </span>
      <Image src={edit} alt="Edit" className="cursor" /> */}
    </Spin>
  );
}

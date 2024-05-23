/* eslint-disable react/jsx-key */
import { React, useState, useEffect, useRef } from "react";
import {
  Switch,
  Upload,
  Button,
  Row,
  Col,
  Form,
  Input,
  Select,
  Card,
  Checkbox,
  InputNumber,
  message,
  Modal,
  TimePicker,
} from "antd";
import Places from "../../components/places";
import ImgCrop from "antd-img-crop";
import StoreDetails from "../../components/store-management/StoreDetails";
import style from "./storeManagement.module.css";
import { Divider } from "antd";
import Image from "next/image";
import uploadImg from "../../assets/images/upload.svg";
import themeColor from "../../assets/images/theme-color.svg";
import { PhotoshopPicker } from "react-color";
import knowMoreImg from "../../assets/images/know-more.svg";
import facebookIcon from "../../assets/images/fb-logo.svg";
import instagramIcon from "../../assets/images/insta-logo.svg";
import twitterIcon from "../../assets/images/twitter-logo.svg";
import youtubeIcon from "../../assets/images/youtube.png";
import linkedinIcon from "../../assets/images/linkedin-logo.svg";
import pinterestIcon from "../../assets/images/pinterest.png";
import Cookies from "universal-cookie";
import { Spin } from "antd";
import Icon, {
  Loading3QuartersOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { baseUrl, imageBaseUrl } from "../../util/baseUrl";
import deleteImg from "../../assets/images/deleteicon.svg";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import editIcon from "../../assets/images/edit.svg";
import deleteIcon from "../../assets/images/deleteicon.svg";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import { acceptedFile } from "../../util/acceptedFile";
import Editor from "../../components/Editor";
import { WithContext as ReactTags } from "react-tag-input";
import { useRouter } from "next/router";
import Auth from "../../util/auth";

dayjs.extend(customParseFormat);
const antIcon = (
  <Loading3QuartersOutlined style={{ fontSize: 50, color: "#5902b3" }} spin />
);
const antIconButton = (
  <LoadingOutlined
    style={{
      fontSize: 24,
      color: "#5902b3",
    }}
    spin
  />
);
const cookies = new Cookies();
const token = cookies.get("loginToken");
const StoreManagement = () => {
  const router = useRouter();
  const [isExpire, setIsExpire] = useState(false);
  const urlPattern =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
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
      let { isSubscribed, subscriptionId, expiryDate } = subData.data.data;
      getSubscriptionData(subscriptionId);
      cookies.set("subscrition_id", subscriptionId);
      let res = expiryDate ? await checkExpire(expiryDate) : false;
      if (isSubscribed === false) {
        Auth.removeToken();
        window.open("/login", "_self");
      } else if (res === true) {
        message.error(
          "Your plan is expired , please renewal to enjoy your plan."
        );
        window.open("/subscription-plan", "_self");
      } else {
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
      setIsExpire(false);
      return false;
    } else {
      setIsExpire(true);
      return true;
    }
  };

  const style_ = {
    inputStyle: {
      borderRadius: "15px",
      border: "1px solid #CBD5E1",
      height: "53px",
      color: "#000",
      backgroundColor: "rgba(241, 245, 249, 0.4)",
      width: "100%",
    },
  };
  const [switchToggle, setSwitchToggle] = useState(true);
  const [imageurl, setimageurl] = useState("");
  const [fileListLogo, setFileListLogo] = useState([]);
  const [fileListBanner, setFileListBanner] = useState([]);
  const [bannerlist, setbannerlist] = useState([]);
  const [backgroundTheme, setBackgroundTheme] = useState("#5902b3");
  const [defaultColor, setDefaultColor] = useState("#5902b3");
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [addressArray, setAddressArray] = useState([]);
  const [fileListFeaturedImg, setFileListFeaturedImg] = useState([]);
  const [size, setSize] = useState("middle");
  const [checkAll, setCheckAll] = useState(false);
  const [businessTime, setBusinessTime] = useState([
    {
      label: "MON",
      isCheck: false,
      openingtime: "12:00 AM",
      closingtime: "11:45 PM",
    },
    {
      label: "TUE",
      isCheck: false,
      openingtime: "12:00 AM",
      closingtime: "11:45 PM",
    },
    {
      label: "WED",
      isCheck: false,
      openingtime: "12:00 AM",
      closingtime: "11:45 PM",
    },
    {
      label: "THU",
      isCheck: false,
      openingtime: "12:00 AM",
      closingtime: "11:45 PM",
    },
    {
      label: "FRI",
      isCheck: false,
      openingtime: "12:00 AM",
      closingtime: "11:45 PM",
    },
    {
      label: "SAT",
      isCheck: false,
      openingtime: "12:00 AM",
      closingtime: "11:45 PM",
    },
    {
      label: "SUN",
      isCheck: false,
      openingtime: "12:00 AM",
      closingtime: "11:45 PM",
    },
  ]);
  const [enquiryMail, setEnquiryMail] = useState("");
  const [enquiryWP, setEnquiryWP] = useState("");
  const [enquiryEmailId, setEnquiryEmailId] = useState("");
  const [enquiryWPNo, setEnquiryWPNo] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState([
    {
      id: 1,
      title: "Facebook URL",
      value: "",
      src: facebookIcon,
      name: "facebook",
    },
    {
      id: 2,
      title: "Instagram URL",
      value: "",
      src: instagramIcon,
      name: "instagram",
    },
    {
      id: 3,
      title: "Twitter URL",
      value: "",
      src: twitterIcon,
      name: "twitter",
    },
    {
      id: 4,
      title: "Youtube URL",
      value: "",
      src: youtubeIcon,
      name: "youtube",
    },
    {
      id: 5,
      title: "Linkedin URL",
      value: "",
      src: linkedinIcon,
      name: "linkedin",
    },
    {
      id: 6,
      title: "Pinterest URL",
      value: "",
      src: pinterestIcon,
      name: "pinterest",
    },
    {
      id: 7,
      title: "URL for Additional Content",
      value: "",
      src: knowMoreImg,
      name: "additional",
    },
  ]);
  const [shoppingCheck, setShoppingCheck] = useState([]);
  const [shoppingCheck1, setShoppingCheck1] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [form] = Form.useForm();
  const shoppingOptions = [
    {
      label: "In Store Shopping",
      value: "shopping",
    },
    {
      label: "In Store Pick Up",
      value: "pickUp",
    },
    {
      label: "Delivery",
      value: "delivery",
    },
  ];
  const [storeDetail, setStoreDetails] = useState(null);
  const [emailContact, setEmailContact] = useState("");
  const [mobileContact, setMobileContact] = useState("");
  const [urlContact, setUrlContact] = useState("");
  const [tags, setTags] = useState([]);
  const [aboutStore, setAboutStore] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState({});
  const [openTimeFull, setOpenTimeFull] = useState(new Date("12:00 AM"));
  const [closeTimeFull, setCloseTimeFull] = useState("");
  //Image Cropper//
  const [imageLogo, setImageLogo] = useState("");
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [imgCropModal, setImgCropModal] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const imgLogoRef = useRef(null);
  const [imageBanner, setImageBanner] = useState("");
  const [cropBannerData, setCropBannerData] = useState("#");
  const [cropperBanner, setCropperBanner] = useState();
  const [imgCropBannerModal, setImgCropBannerModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const imgBannerRef = useRef(null);
  ////
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState("");
  const [isLoadingBanner, setIsLoadingBanner] = useState(false);
  var minuteInterval = 15;
  var timingOptions = [];
  var startTime = 0;
  var ap = ["AM", "PM"];
  for (var i = 0; startTime < 24 * 60; i++) {
    var hh = Math.floor(startTime / 60);
    var mm = startTime % 60;
    timingOptions[i] = {
      value:
        ("0" + (hh == 12 || hh == 0 ? 12 : hh % 12)).slice(-2) +
        ":" +
        ("0" + mm).slice(-2) +
        ap[Math.floor(hh / 12)],
      label:
        ("0" + (hh == 12 || hh == 0 ? 12 : hh % 12)).slice(-2) +
        ":" +
        ("0" + mm).slice(-2) +
        ap[Math.floor(hh / 12)],
    };
    startTime = startTime + minuteInterval;
  }
  useEffect(() => {
    const storeid = cookies.get("storeid");
    setStoreId(storeid);
    setStoreDetails(null);
    storeid != "null" && getstoredetails(storeid);
  }, [storeId]);

  const getstoredetails = async (id) => {
    setStoreId(id);
    setLoading(true);
    let data = await fetch(`/api/getstoredetails/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let res = await data.json();
    cookies.set("storeName", res?.data?.data?.name);
    setStoreDetails(res?.data?.data);
    let check = res?.data?.data;
    if (check) {
      let cUrl = check.websiteUrl ? check.websiteUrl : "";
      let cEmail = check.emailId ? check.emailId : "";
      let cMobile = check.mobileNo ? check.mobileNo : "";
      let cTags = [];
      check.tags ? check.tags : [];
      if (check.tags) {
        if (check.tags.length > 0) {
          check.tags.map((e) => {
            cTags.push({ text: e });
          });
        }
      }
      let cEnquiryEmailId = check?.emailDetails?.emailid;
      let cEnquiryWPId = check?.whatsapp?.whatsappid;
      setSwitchToggle(
        check.websiteStatus
          ? check.websiteStatus == "true"
            ? true
            : false
          : ""
      );
      setBackgroundTheme(check.themeColor ? check.themeColor : "#5902b3");
      setDefaultColor(check.themeColor);
      form.setFieldValue("urlContact", cUrl);
      form.setFieldValue("emailContact", cEmail);
      form.setFieldValue("mobileContact", cMobile);
      //form.setFieldValue("tags", cTags);
      form.setFieldValue("enquiryEmailId", cEnquiryEmailId);
      form.setFieldValue("enquiryWPNo", cEnquiryWPId);
      setUrlContact(cUrl);
      setMobileContact(cMobile);
      setEmailContact(cEmail);
      setAddressArray(check.address.length != 0 ? check.address : addressArray);
      setBusinessTime(check.timings.length != 0 ? check.timings : businessTime);
      setTags(cTags);
      setEnquiryEmailId(cEnquiryEmailId);
      setEnquiryMail(check?.emailDetails?.isCheck);
      setEnquiryWPNo(cEnquiryWPId);
      setEnquiryWP(check?.whatsapp?.isCheck);
      setAboutStore(check.description);
      let temp = socialMediaLink;
      temp[0].value = check.facebookUrl ? check.facebookUrl : "";
      temp[1].value = check.instagramkUrl ? check.instagramkUrl : "";
      temp[2].value = check.twitterUrl ? check.twitterUrl : "";
      temp[3].value = check.youtubeUrl ? check.youtubeUrl : "";
      temp[4].value = check.linkekinUrl ? check.linkekinUrl : "";
      temp[5].value = check.pinterestUrl ? check.pinterestUrl : "";
      temp[6].value = check.contentUrl ? check.contentUrl : "";
      form.setFieldValue(
        "facebook",
        check.facebookUrl ? check.facebookUrl : ""
      );
      form.setFieldValue(
        "instagram",
        check.instagramkUrl ? check.instagramkUrl : ""
      );
      form.setFieldValue("twitter", check.twitterUrl ? check.twitterUrl : "");
      form.setFieldValue("youtube", check.youtubeUrl ? check.youtubeUrl : "");
      form.setFieldValue(
        "linkedin",
        check.linkekinUrl ? check.linkekinUrl : ""
      );
      form.setFieldValue(
        "pinterest",
        check.pinterestUrl ? check.pinterestUrl : ""
      );
      form.setFieldValue(
        "additional",
        check.contentUrl ? check.contentUrl : ""
      );
      setSocialMediaLink([...temp]);
      let shoppingTemp = [];
      if (check.delivery) {
        shoppingTemp.push("delivery");
      }
      if (check.shopping) {
        shoppingTemp.push("shopping");
      }
      if (check.pickUp) {
        shoppingTemp.push("pickUp");
      }
      let count = 0;
      check.timings.map((e) => (e.isCheck ? count++ : ""));
      setCheckAll(count == businessTime.length ? true : false);
      form.setFieldValue("shoppingOption", shoppingTemp);
      setShoppingCheck(shoppingTemp);
      setShoppingCheck1(shoppingTemp);
      setFileListLogo(check.logo ? [{ url: `${check.logo}` }] : []);
      setFileListFeaturedImg(
        check.featureImage ? [{ url: `${check.featureImage}` }] : []
      );
      let bannerUrl = [];
      check.bannerDetails.length > 0
        ? check.bannerDetails.map((e) => {
            bannerUrl.push({ url: `${e.url}` });
          })
        : "";
      setFileListBanner(check.bannerDetails || []);
      setbannerlist(bannerUrl);
      setImageLogo(check.logo);
      setimageurl(check.logo || "");
      setShowLogo(check.logo ? true : false);
    }
    setLoading(false);
  };

  const getSubscriptionData = async (subscriptionId) => {
    const token = cookies.get("loginToken");
    // let response = await axios.get(baseUrl+'api/subscriptionplans', {headers: {
    //   "Content-Type": "application/json",
    //   Authorization: token,
    // }});
    // console.log(response, "1st one sub");
    let data = await fetch(`/api/subscriptionplans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let res = await data.json();
    cookies.set("subscription_data", JSON.stringify(res?.data?.data));
    let sId = subscriptionId;
    if (res?.data?.data) {
      let temp = res?.data?.data.filter((e) => e._id == sId);
      setCurrentSubscription(temp[0]);
      if (temp[0]?.planDetails?.aboutUs?.flag) {
        setEditorLoaded(true);
        window.scrollTo(10, 0);
      } else {
        setEditorLoaded(false);
      }
    }
  };
  const onChangeBusinessTime = (id) => {
    const temp = businessTime;
    temp[id].isCheck = !temp[id].isCheck;
    setBusinessTime([...temp]);
  };
  const onCheckAllChange = (e) => {
    const temp = businessTime;
    temp.map((item) => (item.isCheck = e.target.checked));
    setBusinessTime([...temp]);
    setCheckAll(e.target.checked);
  };
  const changeOpenTime = (time, timeString, id) => {
    setOpenTimeFull(time.$d);
    const temp = businessTime;
    const findData = temp.find((e, index) => index == id);
    if (closeTimeFull) {
      if (closeTimeFull.getTime() < time.$d.getTime()) {
        message.error("Closing Time Must Be Greater Than Opening Time");
        findData.openingtime = "12:00 AM";
        setBusinessTime([...temp]);
      } else {
        findData.openingtime = timeString;
        setBusinessTime([...temp]);
      }
    } else {
      findData.openingtime = timeString;
      setBusinessTime([...temp]);
    }
  };
  const changeCloseTime = (time, timeString, id) => {
    setCloseTimeFull(time.$d);
    const temp = businessTime;
    const findData = temp.find((e, index) => index == id);
    if (openTimeFull.getTime() > time.$d.getTime()) {
      message.error("Closing Time Must Be Greater Than Opening Time");
      findData.closingtime = "11:45 PM";
      setBusinessTime([...temp]);
    } else {
      findData.closingtime = timeString;
      setBusinessTime([...temp]);
    }
  };
  const changeEnquiryMail = (e) => {
    setEnquiryMail(e.target.checked);
  };
  const changeEnquiryWP = (e) => {
    setEnquiryWP(e.target.checked);
  };
  const handleChangeColor = (color) => {
    setBackgroundTheme(color.hex);
  };
  const acceptThemeColor = () => {
    setDisplayColorPicker(!displayColorPicker);
  };
  const cancelThemeColor = () => {
    setBackgroundTheme(defaultColor);
    setDisplayColorPicker(!displayColorPicker);
  };
  const onChangeLogoOld = ({ fileList: newFileList }) => {
    if (newFileList[0]?.response) {
      setFileListLogo([{ url: `${newFileList[0].response.data}` }]);
    } else {
      setFileListLogo(newFileList);
    }
  };
  const onChangeBanner = ({ fileList: newFileList }) => {
    setFileListBanner(newFileList);
  };
  const changeSwitch = (checked) => {
    setSwitchToggle(checked);
  };
  const addNewAddreess = () => {
    const addressArray_ = addressArray;
    setAddressArray([
      ...addressArray_,
      {
        storeName: "",
        name: "",
        addressline1: "",
        addressline2: "",
        pincode: "",
        state: "",
        city: "",
        latitude: "",
        longitude: "",
      },
    ]);
  };
  const handleChangeAddress1 = (e, i) => {
    const newData = addressArray;
    newData[i].addressline1 = e.target.value;
  };
  const handleChangeAddress2 = (e, i) => {
    const newData = addressArray;
    newData[i].addressline2 = e.target.value;
  };
  const handleChangeAddress3 = (e, i) => {
    const newData = addressArray;
    newData[i].pincode = e.target.value;
  };
  const handleChangeAddressStoreName = (e, i) => {
    const newData = addressArray;
    newData[i].storeName = e.target.value;
  };
  const removeNewAddress = (index) => {
    const newData = addressArray;
    newData.splice(index, 1);
    setAddressArray([...newData]);
  };
  const onChangeFeaturedImg = ({ fileList: newFileList }) => {
    // if (newFileList[0]?.response) {
    //   setFileListFeaturedImg([{ url: `${newFileList[0].response.data}` }]);
    // } else {
    setFileListFeaturedImg(newFileList);
    //}
  };
  const fileRequestHandle = async (e) => {
    const form = new FormData();
    form.set("file", e);
    const response = await axios.post(`${baseUrl}upload-feature-image`, form, {
      headers: {
        //"Content-Type": "multipart/form-data",
        Authorization: token,
      },
    });
    let url = response.data.data;
    setFileListFeaturedImg([...fileListFeaturedImg, { url: url }]);
    // setFileListFeaturedImg([{ url: response.data }]);
  };
  const handleChangePopularTags = (value) => {
    try {
      setTags(value);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAdditionTag = (tag) => {
    setTags([...tags, { text: tag }]);
  };
  const handleDeleteTag = (i) => {
    const tag = tags.filter((tag, index) => index !== i);
    setTags(tag);
  };
  const handleTagClick = () => {};
  const onChangeShopping = (checkedValues) => {
    setShoppingCheck(checkedValues);
  };
  const setDetailsHandler = (e, lat, lng, index) => {
    // let lngs = e.geometry.viewport.Ia.hi;
    // let lats = e.geometry.viewport.Wa.hi;
    function extractFromAdress(components, type) {
      for (let i = 0; i < components.length; i++)
        for (let j = 0; j < components[i].types.length; j++)
          if (components[i].types[j] === type) return components[i].long_name;
      return "";
    }

    // const temp = { ...addressDetils };
    const postCode = extractFromAdress(e.address_components, "postal_code");
    const street = extractFromAdress(e.address_components, "route");
    const town = extractFromAdress(e.address_components, "locality");
    const countryName = extractFromAdress(e.address_components, "country");
    const stateName = extractFromAdress(
      e.address_components,
      "administrative_area_level_1"
    );

    const addressData = {
      name: e.formatted_address.split(",").slice(0, -3).toString(),
      addressline1: "",
      addressline2: "",
      pincode: postCode,
      city: e.formatted_address.split(",").slice(-3, -2).toString(),
      state: stateName,
      latitude: lat,
      longitude: lng,
    };
    const newData = addressArray;
    newData[index] = addressData;
    setAddressArray([...newData]);
  };
  const changeSocialMedia = (e, id) => {
    const temp = socialMediaLink;
    const index = temp.findIndex((data) => data.id == id);
    temp[index].value = e.target.value;
    setSocialMediaLink([...temp]);
  };
  console.log(socialMediaLink[0].value.split(".").length, "socialMediaLink");
  const header = {
    Authorization: token,
  };
  const saveStoreManagement = async () => {
    if (mobileContact == "") {
      message.warning("Please Provide Valid Mobile No.");
    } else if (mobileContact.length < 10) {
      message.warning("Please Provide Valid Mobile No.");
    } else if (emailContact == "") {
      message.warning("Please Provide Contact Email Id.");
    } else if (enquiryWP && enquiryWPNo?.length < 10) {
      message.warning("Please Provide Valid WhatsApp No.");
    } else if (
      urlContact.split(".").length > 3 ||
      urlContact.split("/").length > 6
    ) {
      message.warning("Please Provide a valid URL.");
    } else if (addressArray.some((e) => e.storeName == "")) {
      message.warning("Please Provide your Store Address Name.");
    } else if (addressArray.some((e) => e.addressline1 == "")) {
      message.warning("Please Provide your House/Flat/BlockNo.");
    } else if (addressArray.some((e) => e.addressline2 == "")) {
      message.warning("Please Provide your Appartment Name, Road Area.");
    } else if (addressArray.some((e) => e.name == "")) {
      message.warning("Please Provide your Address.");
    } else if (addressArray.some((e) => e.pincode == "")) {
      message.warning("Please Provide your Pincode.");
    } else if (addressArray.some((e) => e.city == "")) {
      message.warning("Please Provide your City.");
    } else if (addressArray.some((e) => e.state == "")) {
      message.warning("Please Provide your State.");
    } else if (
      socialMediaLink[0].value.split(".").length > 3 ||
      urlContact.split("/").length > 6
    ) {
      message.warning("Please Provide a valid Facebook URL.");
    } else if (!urlPattern.test(socialMediaLink[0].value)) {
      message.error("Please Provide a valid Facebook URL.");
    } else if (
      socialMediaLink[1].value.split(".").length > 3 ||
      urlContact.split("/").length > 6
    ) {
      message.warning("Please Provide a valid Instagram URL.");
    } else if (!urlPattern.test(socialMediaLink[1].value)) {
      message.error("Please Provide a valid Instagram URL.");
    } else if (
      socialMediaLink[2].value.split(".").length > 3 ||
      urlContact.split("/").length > 6
    ) {
      message.warning("Please Provide a valid Twitter URL.");
    } else if (!urlPattern.test(socialMediaLink[2].value)) {
      message.error("Please Provide a valid Twitter URL.");
    } else if (
      socialMediaLink[3].value.split(".").length > 3 ||
      urlContact.split("/").length > 6
    ) {
      message.warning("Please Provide a valid Youtube URL.");
    } else if (!urlPattern.test(socialMediaLink[3].value)) {
      message.error("Please Provide a valid Youtube URL.");
    } else if (
      socialMediaLink[4].value.split(".").length > 3 ||
      urlContact.split("/").length > 6
    ) {
      message.warning("Please Provide a valid Linkedin URL.");
    } else if (!urlPattern.test(socialMediaLink[4].value)) {
      message.error("Please Provide a valid Linkedin URL.");
    } else if (
      socialMediaLink[5].value.split(".").length > 3 ||
      urlContact.split("/").length > 6
    ) {
      message.warning("Please Provide a valid Pinterest URL.");
    } else if (!urlPattern.test(socialMediaLink[5].value)) {
      message.error("Please Provide a valid Pinterest URL.");
    } else if (
      socialMediaLink[6].value.split(".").length > 3 ||
      urlContact.split("/").length > 6
    ) {
      message.warning("Please Provide a valid Additional URL.");
    } else if (!urlPattern.test(socialMediaLink[6].value)) {
      message.error("Please Provide a valid Youtube URL.");
    } else {
      const bannerImg = [];
      bannerlist.map((e) => {
        //bannerImg.push({ url: e.response?.data });
        if (e.url) {
          bannerImg.push({ url: e.url });
        } else {
          bannerImg.push({ url: e });
        }
      });
      const popularTags = [];
      if (tags.length > 0) {
        tags.map((e) => {
          popularTags.push(e.text);
        });
      }
      setLoading(true);
      let storeData = {
        id: storeId,
        websiteStatus: switchToggle,
        //logo: fileListLogo.length > 0 ? fileListLogo[0].url : "",
        logo: imageurl,
        themeColor: backgroundTheme,
        bannerDetails: bannerImg,
        emailId: emailContact,
        mobileNo: mobileContact,
        websiteUrl: urlContact,
        address: addressArray,
        description: aboutStore,
        featureImage:
          fileListFeaturedImg.length > 0 ? fileListFeaturedImg[0].url : "",
        tags: popularTags,
        shopping: shoppingCheck.includes("shopping"),
        pickUp: shoppingCheck.includes("pickUp"),
        delivery: shoppingCheck.includes("delivery"),
        emailDetails: { emailid: enquiryEmailId, isCheck: enquiryMail },
        whatsapp: {
          whatsappid: enquiryWP ? enquiryWPNo : "",
          isCheck: enquiryWP,
        },
        facebookUrl: socialMediaLink[0].value,
        instagramkUrl: socialMediaLink[1].value,
        twitterUrl: socialMediaLink[2].value,
        youtubeUrl: socialMediaLink[3].value,
        linkekinUrl: socialMediaLink[4].value,
        pinterestUrl: socialMediaLink[5].value,
        contentUrl: socialMediaLink[6].value,
        timings: businessTime,
      };
      let data = await fetch(`/api/updateStoreManagement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(storeData),
      });
      let res = await data.json();
      if (res.status) {
        getstoredetails(res?.data?.data?._id);
        setLoading(false);
        message.success(res?.data?.message);
      } else {
        setLoading(false);
        message.error(res?.message);
      }
    }
  };
  ///Image Crop///
  const onChangeLogo = (e) => {
    try {
      if (e.target || e.dataTransfer) {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        let x = files[0].name.split(".");
        let y = x[x.length - 1];
        if (files[0].size > 5000000) {
          message.warning("Maximum upload size is 5 MB.", [3]);
        } else if (acceptedFile.includes(y)) {
          const reader = new FileReader();
          reader.onload = () => {
            setImageLogo(reader.result);
          };
          reader.readAsDataURL(files[0]);

          setImgCropModal(true);
        } else {
          message.warning("Only JPG & PNG are allowed.", [3]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCropLogoData = async () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      setImageLogo(cropper.getCroppedCanvas().toDataURL());
      setShowLogo(true);
      setImgCropModal(false);

      const payload = {
        logo: cropper.getCroppedCanvas().toDataURL(),
      };
      try {
        let data = await fetch(`${baseUrl}upload-logo/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        });

        let res = await data.json();

        if (res.code == 200) {
          setimageurl(res.data);
        }
      } catch {
        message.error("Entity is too large. Try with different Image.");
      }
    }
  };
  const deleteLogo = () => {
    setImageLogo("");
    setimageurl("");
    setShowLogo(false);
  };
  const logoUpload = () => {
    imgLogoRef.current.click();
  };
  ///Banner///
  const onChangeBannerCrop = (e) => {
    try {
      if (e.target || e.dataTransfer) {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
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
          setShowBanner(false);
          setImgCropBannerModal(true);
        } else {
          message.warning("Only JPG & PNG are allowed.", [3]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCropBannerData = async () => {
    if (typeof cropperBanner !== "undefined") {
      setIsLoadingBanner(true);
      setCropBannerData(cropperBanner.getCroppedCanvas().toDataURL());
      setImageBanner(cropperBanner.getCroppedCanvas().toDataURL());

      setFileListBanner([
        ...fileListBanner,
        { url: cropperBanner.getCroppedCanvas().toDataURL() },
      ]);

      const payload = {
        logo: cropperBanner.getCroppedCanvas().toDataURL(),
      };
      try {
        let data = await fetch(`${baseUrl}upload-banner/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        });

        let res = await data.json();
        if (res.code == 200) {
          const bannerData = [...bannerlist, { url: res.data }];
          setbannerlist(bannerData);
          try {
            let x = document.getElementById("banner-id");
            x.value = "";
          } catch (err) {}
        }
      } catch {
        message.error("Entity is too large. Try with different Image.");
      }
      setShowBanner(true);
      setImgCropBannerModal(false);
      setIsLoadingBanner(false);
    }
  };
  const deleteBanner = (i) => {
    const temp = fileListBanner;
    temp.splice(i, 1);
    setFileListBanner([...temp]);
    const temps = bannerlist;
    temps.splice(i, 1);
    setbannerlist([...temps]);
  };
  const bannerUpload = () => {
    imgBannerRef.current.click();
  };
  // const onChangeGallery = ({ fileList: newFileList }) => {
  //   setFileListGallery(newFileList);
  // };
  ///---///
  const keyDisable = (e) => {
    if (e.which === 38 || e.which === 40) {
      e.preventDefault();
    }
  };
  const mobileNumberValidation = (e) => {
    //let temp = mobileContact;
    if (e.target.value.length >= 10) {
      e.target.value = e.target.value.substring(0, e.target.value.length - 1);
    }
    //setMobileContact(temp);
  };

  const removeSpace = (e) => {
    if (e.target.value.charAt(0) == " ") {
      e.target.value = e.target.value.substring(1);
    }
  };
  return (
    <>
      {storeDetail && (
        <StoreDetails
          storeDetails={storeDetail}
          getstoredetail={getstoredetails}
        />
      )}
      {storeId == "null" && <StoreDetails getstoredetail={getstoredetails} />}
      <Divider className={style.divider_new} />
      {storeId == "null" ? (
        ""
      ) : (
        <Spin spinning={isLoading} indicator={antIcon}>
          {/* Consumer Website Status */}
          <div className={style.mb_1}>
            <p className="store-mgt-sub-header-title">
              Consumer Website Status
            </p>
            <br />
            <span
              className={style.switch_text}
              style={{ opacity: switchToggle ? "0.5" : "1" }}
            >
              Disable
            </span>
            <Switch onChange={changeSwitch} checked={switchToggle} />
            <span
              className={style.switch_text}
              style={{ opacity: switchToggle ? "1" : "0.5" }}
            >
              Enable
            </span>
          </div>
          {/*///---///*/}
          <Divider className={style.divider_new} />
          {/* Logo Details */}
          <p className="store-mgt-sub-header-title">Logo Details</p>
          <Row style={{ alignItems: "center" }} className="mt-2">
            {showLogo ? (
              ""
            ) : (
              <Col xl={7} lg={7} md={8} sm={12} xs={12}>
                <input
                  type="file"
                  onChange={onChangeLogo}
                  hidden
                  ref={imgLogoRef}
                  accept="image/png, image/jpeg"
                />
                <div
                  className="store-gallery-img-wrapper-upload cursor"
                  style={{ margin: 0 }}
                  onClick={logoUpload}
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
              </Col>
            )}
            <Col xl={7} lg={7} md={8} sm={20} xs={20}>
              {showLogo && (
                <>
                  <div
                    className="store-gallery-img-wrapper"
                    style={{ margin: 0, width: "240px", height: "140px" }}
                  >
                    <Image
                      src={imageLogo}
                      alt="Logo"
                      // layout="fill"
                      objectFit="contain"
                      width="200"
                      height="200"
                      style={{ marginLeft: "15px" }}
                    />
                    <div>
                      <Image
                        src={deleteIcon}
                        alt="Delete"
                        className="cursor"
                        onClick={deleteLogo}
                      />
                    </div>
                  </div>
                </>
              )}
            </Col>
          </Row>
          <Modal
            open={imgCropModal}
            width={500}
            //onCancel={() => setImgCropModal(false)}
            footer={null}
            className="img-cropper"
          >
            <Cropper
              style={{ height: 400, width: "100%" }}
              preview=".img-preview"
              src={imageLogo}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              onInitialized={(instance) => {
                setCropper(instance);
              }}
              guides={true}
            />
            <br />
            <br />
            <div>
              <Button
                className="store-mgt-btn store-mgt-cancel-btn-color  w-100  ml-1"
                onClick={() => setImgCropModal(false)}
              >
                CANCEL
              </Button>
              <Button
                className="store-mgt-btn store-mgt-btn-color w-100 ml-1"
                onClick={getCropLogoData}
              >
                SAVE
              </Button>
            </div>
          </Modal>
          {/*///---///*/}
          <Divider className={style.divider_new} />
          {/* Theme Color */}
          <p className="store-mgt-sub-header-title">Theme Color</p>
          <div className="d-flex mt-2">
            <div
              className={style.theme_color_wrapper}
              style={{ background: backgroundTheme }}
              onClick={() => setDisplayColorPicker(!displayColorPicker)}
            >
              <Image src={themeColor} alt="theme color" />
            </div>
            <div className="ml-1">
              <span
                className="f-500 cursor"
                onClick={() => setDisplayColorPicker(!displayColorPicker)}
              >
                Select Primary Color
              </span>
              <br />
              <span className="opacity-mid">{backgroundTheme}</span>
            </div>
          </div>
          {displayColorPicker && (
            <PhotoshopPicker
              display={displayColorPicker}
              color={backgroundTheme}
              onChangeComplete={handleChangeColor}
              onAccept={acceptThemeColor}
              onCancel={cancelThemeColor}
            />
          )}
          {/*///---///*/}
          {/* Banner Details */}
          {currentSubscription?.planDetails?.banner?.flag && (
            <>
              <Divider className={style.divider_new} />
              <p className="store-mgt-sub-header-title">Banner Details</p>
              {/* <Row style={{ alignItems: "center" }} className="mt-2" gutter={20}> */}
              <div className="mt-2 banner-upload-section">
                {fileListBanner.length < 3 && (
                  <>
                    {/* <Col xl={6} lg={6} md={6} sm={12} xs={12}> */}
                    <input
                      type="file"
                      onChange={onChangeBannerCrop}
                      hidden
                      ref={imgBannerRef}
                      accept="image/png, image/jpeg"
                      id="banner-id"
                    />
                    <div
                      className="store-gallery-img-wrapper-upload cursor"
                      style={{ margin: 0 }}
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
                    {/* </Col> */}
                  </>
                )}
                {fileListBanner && fileListBanner.length > 0
                  ? fileListBanner.map((e, index) => {
                      return (
                        <div className="banner-upload-section-div">
                          {/*<Col xl={5} lg={5} md={6} sm={20} xs={20}>*/}
                          {/* {showBanner && ( */}

                          <div
                            className="store-gallery-img-wrapper"
                            style={{
                              margin: 0,
                              width: "240px",
                              height: "140px",
                            }}
                          >
                            <Image
                              src={e.url}
                              alt="Banner"
                              // layout="fill"
                              objectFit="contain"
                              width="200"
                              height="200"
                              style={{ marginLeft: "15px" }}
                            />
                            <div>
                              <Image
                                src={deleteIcon}
                                alt="Delete"
                                className="cursor"
                                onClick={() => deleteBanner(index)}
                              />
                            </div>
                          </div>

                          {/* )} */}
                          {/* </Col> */}
                        </div>
                      );
                    })
                  : null}
                {/* </Row> */}
              </div>
              <Modal
                open={imgCropBannerModal}
                width={500}
                //onCancel={() => setImgCropBannerModal(false)}
                footer={null}
                className="img-cropper"
              >
                <Cropper
                  style={{ height: 400, width: "100%" }}
                  preview=".img-preview"
                  src={imageBanner}
                  viewMode={1}
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
                />
                <br />
                <br />
                <div className="d-flex">
                  <Button
                    className="store-mgt-btn store-mgt-cancel-btn-color  w-100  ml-1"
                    onClick={() => setImgCropBannerModal(false)}
                  >
                    CANCEL
                  </Button>
                  <Spin indicator={antIconButton} spinning={isLoadingBanner}>
                    <Button
                      className="store-mgt-btn store-mgt-btn-color w-100 ml-1"
                      onClick={getCropBannerData}
                      disabled={isLoadingBanner}
                    >
                      SAVE
                    </Button>
                  </Spin>
                </div>
              </Modal>
            </>
          )}
          <Divider className={style.divider_new} />
          {/* Contact Info */}
          <p className="store-mgt-sub-header-title">Contact Info</p>
          <Form name="contact-info" form={form} initialValues={{ priority: 2 }}>
            <Row gutter={20} style={{ marginTop: "20px" }}>
              <Col className="gutter-row" xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                  name="mobileContact"
                  // rules={[
                  //   {
                  //     pattern: new RegExp(/^[0-9]{10}$/g),
                  //     required: true,
                  //     message: "Invalid Contact Number",
                  //   },
                  // ]}
                  initialValue={mobileContact}
                >
                  <Input
                    placeholder="Mobile Number *"
                    style={style_.inputStyle}
                    minLength={10}
                    maxLength={10}
                    onChange={(e) => setMobileContact(e.target.value)}
                    type="number"
                    onKeyDown={(e) => keyDisable(e)}
                    onKeyPress={(e) => mobileNumberValidation(e)}
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                  name="emailContact"
                  rules={[{ type: "email", message: "Invalid Email" }]}
                  initialValue={emailContact}
                >
                  <Input
                    placeholder="Email Id *"
                    style={style_.inputStyle}
                    onChange={(e) => setEmailContact(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                  name="urlContact"
                  initialValue={urlContact}
                  rules={[
                    { type: "url", message: "Invalid URL" },

                    {
                      pattern: /^[^\s].+[^\s{0,1}]$/g,
                      message: "Remove the spaces from start and end",
                    },
                  ]}
                >
                  <Input
                    placeholder={"Website URL"}
                    style={style_.inputStyle}
                    onChange={(e) => setUrlContact(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {/*///---///*/}
          <Divider className={style.divider_new} />
          {/* Map Info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p className="store-mgt-sub-header-title">
              Store Addresses and Locations
            </p>
            <Button
              className="store-mgt-btn store-mgt-btn-color ml-1"
              onClick={addNewAddreess}
            >
              + Add New Address
            </Button>
          </div>
          {addressArray && addressArray?.length > 0
            ? addressArray.map((item, index) => {
                return (
                  <div key={index}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        className="store-mgt-btn address-remove-btn-color ml-1"
                        onClick={() => removeNewAddress(index)}
                      >
                        Remove
                      </Button>
                    </div>
                    <Row gutter={30} style={{ marginTop: "20px" }}>
                      <Col
                        className="gutter-row"
                        xl={15}
                        lg={15}
                        md={15}
                        sm={24}
                        xs={24}
                      >
                        <Places
                          setDetailsHandler={(e, lat, lng) =>
                            setDetailsHandler(e, lat, lng, index)
                          }
                        />
                      </Col>
                      <Col
                        className="gutter-row"
                        xl={8}
                        lg={8}
                        md={8}
                        sm={24}
                        xs={24}
                      >
                        <Form layout="vertical">
                          <Form.Item
                            name={`storeName${Math.random()}`}
                            label="Store Name *"
                            initialValue={item.storeName}
                          >
                            <Input
                              style={style_.inputStyle}
                              onChange={(e) =>
                                handleChangeAddressStoreName(e, index)
                              }
                              onKeyPress={(e) => removeSpace(e)}
                            />
                          </Form.Item>
                          <Form.Item
                            name={`builingName${Math.random()}`}
                            label="House/Flat/BlockNo *"
                            initialValue={item.addressline1}
                          >
                            <Input
                              style={style_.inputStyle}
                              onChange={(e) => handleChangeAddress1(e, index)}
                              onKeyPress={(e) => removeSpace(e)}
                            />
                          </Form.Item>
                          <Form.Item
                            name={`roadArea${Math.random()}`}
                            label="Appartment Name, Road Area *"
                            initialValue={item.addressline2}
                          >
                            <Input
                              style={style_.inputStyle}
                              onChange={(e) => handleChangeAddress2(e, index)}
                              onKeyPress={(e) => removeSpace(e)}
                            />
                          </Form.Item>
                          <Form.Item
                            name={`addressName${Math.random()}`}
                            label="Address Name"
                            initialValue={item.name}
                          >
                            <Input style={style_.inputStyle} disabled />
                          </Form.Item>
                          <Form.Item
                            name={`pinCode${Math.random()}`}
                            label="Pin Code*"
                            initialValue={item.pincode}
                          >
                            <Input
                              style={style_.inputStyle}
                              onChange={(e) => handleChangeAddress3(e, index)}
                              onKeyPress={(e) => removeSpace(e)}
                            />
                          </Form.Item>
                          <Form.Item
                            name={`state${Math.random()}`}
                            label="State*"
                            initialValue={item.state}
                          >
                            <Input style={style_.inputStyle} disabled />
                          </Form.Item>
                          <Form.Item
                            name={`city${Math.random()}`}
                            label="City*"
                            initialValue={item.city}
                          >
                            <Input style={style_.inputStyle} disabled />
                          </Form.Item>
                        </Form>
                      </Col>
                    </Row>
                  </div>
                );
              })
            : null}
          {/*///---///*/}
          <Divider className={style.divider_new} />
          {/* About Store Details */}
          {/* {editorLoaded && ( */}
          <>
            {editorLoaded && (
              <p className="store-mgt-sub-header-title mb-2">About Store</p>
            )}
            <Row>
              <Col
                className="gutter-row"
                xl={14}
                lg={14}
                md={14}
                sm={24}
                xs={24}
              >
                {/* <Input.TextArea
                    rows={8}
                    showCount
                    maxLength={3000}
                    placeholder="Enter here"
                    onChange={(e) => setAboutStore(e.target.value)}
                    value={aboutStore}
                    className="about-store-border"
                  /> */}
                <Editor
                  name="description"
                  onChange={(data) => {
                    setAboutStore(data);
                  }}
                  //editorLoaded={editorLoaded && currentSubscription?.planDetails?.aboutUs?.flag}
                  editorLoaded={editorLoaded}
                  value={aboutStore}
                />
              </Col>
            </Row>
            {/* {editorLoaded && <Divider className={style.divider_new} />} */}
            {/* {editorLoaded && <br/>} */}
          </>
          {/* )}    */}

          {editorLoaded && (
            <>
              <p
                className="store-mgt-sub-header-title mt-2"
                style={{ marginBottom: "1rem" }}
              >
                Featured Image
              </p>
              <ImgCrop
                modalOk={"Save"}
                aspect={700 / 400}
                modalClassName="img-crop"
                quality={1}
              >
                <Upload
                  // action={`${baseUrl}upload-feature-image`}
                  customRequest={fileRequestHandle}
                  listType="picture-card"
                  headers={header}
                  fileList={fileListFeaturedImg}
                  beforeUpload={(file) => {
                    let type = file.type.split("/")[1];
                    if (file.size / 1024 / 1024 > 5) {
                      message.warning("Maximum upload file size 5 MB.");
                    } else if (
                      type !== "jpeg" &&
                      type !== "png" &&
                      type !== "heic"
                    ) {
                      message.warning("Only PNG and JPEG are allowed.");
                    } else {
                      fileRequestHandle(file);
                    }
                  }}
                  onChange={onChangeFeaturedImg}
                  style={{ width: 200 }}
                >
                  {fileListFeaturedImg.length < 1 && (
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
            </>
          )}
          {currentSubscription?.planDetails?.keyword?.flag && (
            <>
              <p className="store-mgt-sub-header-title mb-2 mt-2">
                Store Popular Tags
              </p>
              <Row>
                <Col
                  className="gutter-row"
                  xl={16}
                  lg={16}
                  md={16}
                  sm={24}
                  xs={24}
                >
                  {/* <Form
                    name="populartags"
                    form={form}
                    initialValues={{ priority: 2 }}
                  > */}
                  {/* <Form.Item initialValue={tags} name="tags"> */}
                  {/* <Select
                      mode="tags"
                      size={size}
                      placeholder="Enter Popular Tags"
                      onChange={handleChangePopularTags}
                    /> */}
                  <ReactTags
                    placeholder="Enter Popular Tags"
                    tags={tags}
                    handleAddition={handleAdditionTag}
                    handleDelete={handleDeleteTag}
                    handleDrag={undefined}
                    handleTagClick={handleTagClick}
                  />
                  {/* </Form.Item> */}
                  {/* </Form> */}
                </Col>
              </Row>
            </>
          )}
          {/*///---///*/}
          <Divider className={style.divider_new} />
          {/* Business Timings Details */}
          <p className="store-mgt-sub-header-title">Business Timings</p>
          <Row className="mt-2">
            <Col className="gutter-row" xl={12} lg={12} md={18} sm={24} xs={24}>
              <Card
                style={{ border: "1px solid #CBD5E1", borderRadius: "15px" }}
                id="business-time-id"
              >
                {/* <div className={`d-flex space-between ${style.f_10}`}>
                  <Checkbox
                    onChange={onCheckAllChange}
                    checked={checkAll}
                  ></Checkbox>
                  <p style={{width:"80px"}}>Select All</p>
                  <p style={{width:"100px"}} >Opening Time </p>
                  <span style={{ visibility: "hidden" }}></span>
                  <p style={{width:"100px" }}>Closing Time</p>
                </div> */}
                <Col
                  className="gutter-row"
                  xl={24}
                  lg={24}
                  md={24}
                  sm={24}
                  xs={24}
                >
                  <div className={`d-flex space-between ${style.f_10}`}>
                    <Checkbox
                      onChange={onCheckAllChange}
                      checked={checkAll}
                    ></Checkbox>
                    <p style={{ width: "80px" }}>Select All</p>
                    <p style={{ width: "100px" }}>Opening Time </p>
                    <span style={{ visibility: "hidden" }}></span>
                    <p style={{ width: "100px" }}>Closing Time</p>
                  </div>
                </Col>
                <Row>
                  {businessTime && businessTime.length > 0
                    ? businessTime.map((item, index) => {
                        return (
                          <Col
                            key={index}
                            className="gutter-row"
                            xl={24}
                            lg={24}
                            md={24}
                            sm={24}
                            xs={24}
                          >
                            <div
                              className="d-flex space-between mt-2 align-center"
                              style={{ gap: "5px" }}
                            >
                              <Checkbox
                                onChange={() => onChangeBusinessTime(index)}
                                checked={item.isCheck}
                              ></Checkbox>
                              <div
                                className={
                                  style.align_center + " " + style.f_10
                                }
                              >
                                {item.label}
                              </div>
                              {/* <Select
                            options={timingOptions}
                            style={{ width: "100px", borderRadius: "10px" }}
                            onChange={(e) => changeOpenTime(e, index)}
                            value={item.openingtime}
                            className={style.f_10}
                          /> */}
                              <TimePicker
                                use12Hours
                                value={dayjs(item.openingtime, "HH:mm A")}
                                format="hh:mm A"
                                onChange={(e, t) => changeOpenTime(e, t, index)}
                                minuteStep={15}
                                className="business-time-picker"
                                allowClear={false}
                              />
                              To
                              {/* <Select
                            options={timingOptions}
                            style={{ width: "100px", borderRadius: "10px" }}
                            onChange={(e) => changeCloseTime(e, index)}
                            value={item.closingtime}
                            className={style.f_10}
                          /> */}
                              <TimePicker
                                use12Hours
                                value={dayjs(item.closingtime, "HH:mm A")}
                                format="hh:mm A"
                                onChange={(e, t) =>
                                  changeCloseTime(e, t, index)
                                }
                                minuteStep={15}
                                className="business-time-picker"
                                allowClear={false}
                              />
                            </div>
                          </Col>
                        );
                      })
                    : null}
                </Row>
              </Card>
            </Col>
          </Row>
          <Divider className={style.divider_new} />
          {/*///---///*/}
          {/* Shopping Details */}
          <p
            className="store-mgt-sub-header-title"
            style={{ marginBottom: "1rem" }}
          >
            Shopping Options
          </p>
          <Form
            name="shopping-option"
            form={form}
            initialValues={{ priority: 2 }}
          >
            <Form.Item name="shoppingOption" initialValue={shoppingCheck}>
              <Checkbox.Group
                options={shoppingOptions}
                onChange={onChangeShopping}
                // defaultValue={['delivery', 'shopping', 'pickUp']}
              />
            </Form.Item>
          </Form>
          <Divider className={style.divider_new} />
          {/*///---///*/}
          {/*Enquiries Details */}
          {currentSubscription?.planDetails?.enquiryForm?.flag && (
            <>
              <p className="store-mgt-sub-header-title">
                Receive Customer Enquiries On
              </p>
              <Row gutter={20} style={{ marginTop: "20px" }}>
                <Col
                  className="gutter-row"
                  xl={6}
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                >
                  <Checkbox onChange={changeEnquiryMail} checked={enquiryMail}>
                    Email
                  </Checkbox>
                </Col>
                <Col
                  className="gutter-row"
                  xl={6}
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                >
                  <Checkbox onChange={changeEnquiryWP} checked={enquiryWP}>
                    WhatsApp
                  </Checkbox>
                </Col>
              </Row>
              <Form
                name="enquiry-detail"
                form={form}
                initialValues={{ priority: 2 }}
              >
                <Row gutter={20} style={{ marginTop: "20px" }}>
                  <Col
                    className="gutter-row"
                    xl={6}
                    lg={6}
                    md={6}
                    sm={24}
                    xs={24}
                  >
                    <Form.Item
                      name="enquiryEmailId"
                      rules={[{ type: "email", message: "Invalid Email" }]}
                      initialValue={enquiryEmailId}
                    >
                      <Input
                        placeholder="Email Id"
                        style={style_.inputStyle}
                        disabled={!enquiryMail}
                        onChange={(e) => {
                          setEnquiryEmailId(e.target.value);
                        }}
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
                  >
                    <Form.Item
                      name="enquiryWPNo"
                      // rules={[
                      //   {
                      //     pattern: new RegExp(/^[0-9+\s]*$/g),
                      //     required: true,
                      //     message: "Invalid WhatsApp Number",
                      //   },
                      // ]}
                      initialValue={enquiryWPNo}
                    >
                      <Input
                        placeholder="WhatsApp Number"
                        style={style_.inputStyle}
                        // minLength={10}
                        // maxLength={10}
                        disabled={!enquiryWP}
                        onChange={(e) => {
                          setEnquiryWPNo(e.target.value);
                        }}
                        type="number"
                        onKeyPress={(e) => mobileNumberValidation(e)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Divider className={style.divider_new} />
            </>
          )}

          {/*///---///*/}

          {/* Social Media Details */}
          <p className="store-mgt-sub-header-title">Social Media Links</p>
          <Form name="social-media" form={form} initialValues={{ priority: 2 }}>
            <Row gutter={20} style={{ marginTop: "20px" }}>
              {socialMediaLink && socialMediaLink.length > 0
                ? socialMediaLink.map((data, index) => {
                    return (
                      <Col
                        className="gutter-row"
                        xl={8}
                        lg={8}
                        md={8}
                        sm={24}
                        xs={24}
                        key={index}
                      >
                        <Form.Item
                          name={data.name}
                          initialValue={data.value}
                          //rules={[{ type: "url", message: "Invalid URL" }]}
                        >
                          <Input
                            placeholder={data.title}
                            style={style_.inputStyle}
                            prefix={
                              <Image
                                src={data.src}
                                alt="Upload Image"
                                height={30}
                                width={30}
                              />
                            }
                            onChange={(e) => {
                              changeSocialMedia(e, data.id);
                            }}
                          />
                        </Form.Item>
                      </Col>
                    );
                  })
                : null}
            </Row>
          </Form>
          {/*///---///*/}
          <div style={{ textAlign: "right" }}>
            <Button
              className="store-mgt-btn store-mgt-btn-color w-100 ml-1"
              onClick={saveStoreManagement}
            >
              SAVE
            </Button>
          </div>
        </Spin>
      )}
    </>
  );
};

export default StoreManagement;

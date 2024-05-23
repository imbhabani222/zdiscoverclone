import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import Banner from "../../components/banner";
import ShoppingOptions from "../../components/shopping-options";
import AboutEcommerceBusiness from "../../components/about-ecommerce-business";
import Award from "../../components/award";
import Client from "../../components/client";
import PopularTags from "../../components/popularTags";
import RateReview from "../../components/rateReview";
import StoreGallery from "../../components/storeGallery";
import Testimonial from "../../components/testimonial";
import GetInTouch from "../../components/getInTouch";
import VisitorStatus from "../../components/visitors-status";
import Footer from "../../components/footer";
import styles from "../[storepage]/storePage.module.css";
import Contactus from "../../components/contactUs";
import SideBtn from "../../components/side-button";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { Spin } from "antd";
import Icon, { Loading3QuartersOutlined } from "@ant-design/icons";

const cookies = new Cookies();
const token = cookies.get("loginToken");
const antIcon = (
  <Loading3QuartersOutlined style={{ fontSize: 50, color: "orange" }} spin />
);

const Storepage = () => {
  const [isLoading, setLoading] = useState(false);
  const [tagArray, setTagArray] = useState([]);
  const [reviewArray, setReviewArray] = useState([]);
  const [testimonialArray, setTestimonialArray] = useState([]);
  const [galleryArray, setGalleryArray] = useState([]);
  const [addressArray, setAddressArray] = useState([]);
  const [awardArray, setAwardArray] = useState([]);
  const [clientArray, setClientArray] = useState([]);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [storeName, setStoreName] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [featureImg, setFeatureImg] = useState(null);
  const [description, setDescription] = useState(null);
  const [storeId, setStoreId] = useState(0);
  const [timings, setTimings] = useState([]);
  const [banners, setBanners] = useState([]);
  const [clientArr, setClientArr] = useState([]);
  const [shoppingOptArray, setShoppingOptArray] = useState([
    { shopping: true, pickUp: true, delivery: true },
  ]);
  const [socialUrl, setSocialUrl] = useState({});
  const [headerLogo, setHeaderLogo] = useState("");
  const [themeColor, setThemeColor] = useState("#5902b3");
  const [fullAccess, setFullAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getStoreFront();
  }, []);

  const getStoreFront = async () => {
    setLoading(true);
    let id = window.location.pathname;
    let data = await fetch(`/api/storefront${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let res2 = await data.json();
    if(res2.status == "false"){
      let data = await fetch(`/api/storefront${id.toLocaleLowerCase()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      let res = await data.json();
      if (res.status && res.data.data.length > 0) {
        setFullAccess(res?.data?.isFullAccess);
        setGalleryArray(res?.data?.data[0]?.galleries);
        setClientArr(res?.data?.data[0]?.clients);
        setTagArray(res?.data?.data[0]?.tags);
        setReviewArray(res?.data?.data[0]?.reviews);
        setTestimonialArray(res?.data?.data[0]?.testimonials);
        setAddressArray(res?.data?.data[0]?.address);
        setWebsiteUrl(res?.data?.data[0]?.websiteUrl);
        setStoreUrl(res?.data?.data[0]?.url);
        setStoreName(res?.data?.data[0]?.name);
        setQrCode(res?.data?.data[0]?.qrcode);
        setStoreId(res?.data?.data[0]?._id);
        setAwardArray(res?.data?.data[0]?.awards);
        setClientArray(res?.data?.data[0]?.clients);
        setBanners(res?.data?.data[0]?.bannerDetails);
        setThemeColor(
          res?.data?.data[0]?.themeColor
            ? res?.data?.data[0]?.themeColor
            : themeColor
        );
        setDescription(
          res?.data?.data[0]?.description ? res?.data?.data[0]?.description : null
        );
        setFeatureImg(
          res?.data?.data[0]?.featureImage
            ? res?.data?.data[0]?.featureImage
            : null
        );
        setShoppingOptArray([
          {
            shopping: res?.data?.data[0]?.shopping,
            pickUp: res?.data?.data[0]?.pickUp,
            delivery: res?.data?.data[0]?.delivery,
          },
        ]);
        setTimings(res?.data?.data[0]?.timings);
        const da = res?.data?.data[0];
        setSocialUrl({
          fb: da?.facebookUrl,
          insta: da?.instagramkUrl,
          twitter: da?.twitterUrl,
          yt: da?.youtubeUrl,
          linkedin: da?.linkekinUrl,
          pinterest: da?.pinterestUrl,
          mobNo: da?.mobileNo,
          email: da?.emailId,
          website: da?.websiteUrl,
          knowMore: da?.contentUrl,
          qrcodeImg: da?.qrcode,
          url: da?.url,
        });
        setHeaderLogo(res?.data?.data[0]?.logo);
        if (
          res.data.data.length === 0 ||
          res.data === null ||
          res?.data?.data[0].websiteStatus == "false"
        ) {
          router.push("/404");
          setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        router.push("/404");
      }
    }else{
      if (res2.status && res2.data.data.length > 0) {
        setFullAccess(res2?.data?.isFullAccess);
        setGalleryArray(res2?.data?.data[0]?.galleries);
        setClientArr(res2?.data?.data[0]?.clients);
        setTagArray(res2?.data?.data[0]?.tags);
        setReviewArray(res2?.data?.data[0]?.reviews);
        setTestimonialArray(res2?.data?.data[0]?.testimonials);
        setAddressArray(res2?.data?.data[0]?.address);
        setWebsiteUrl(res2?.data?.data[0]?.websiteUrl);
        setStoreUrl(res2?.data?.data[0]?.url);
        setStoreName(res2?.data?.data[0]?.name);
        setQrCode(res2?.data?.data[0]?.qrcode);
        setStoreId(res2?.data?.data[0]?._id);
        setAwardArray(res2?.data?.data[0]?.awards);
        setClientArray(res2?.data?.data[0]?.clients);
        setBanners(res2?.data?.data[0]?.bannerDetails);
        setThemeColor(
          res2?.data?.data[0]?.themeColor
            ? res2?.data?.data[0]?.themeColor
            : themeColor
        );
        setDescription(
          res2?.data?.data[0]?.description ? res2?.data?.data[0]?.description : null
        );
        setFeatureImg(
          res2?.data?.data[0]?.featureImage
            ? res2?.data?.data[0]?.featureImage
            : null
        );
        setShoppingOptArray([
          {
            shopping: res2?.data?.data[0]?.shopping,
            pickUp: res2?.data?.data[0]?.pickUp,
            delivery: res2?.data?.data[0]?.delivery,
          },
        ]);
        setTimings(res2?.data?.data[0]?.timings);
        const da = res2?.data?.data[0];
        setSocialUrl({
          fb: da?.facebookUrl,
          insta: da?.instagramkUrl,
          twitter: da?.twitterUrl,
          yt: da?.youtubeUrl,
          linkedin: da?.linkekinUrl,
          pinterest: da?.pinterestUrl,
          mobNo: da?.mobileNo,
          email: da?.emailId,
          website: da?.websiteUrl,
          knowMore: da?.contentUrl,
          qrcodeImg: da?.qrcode,
          url: da?.url,
        });
        setHeaderLogo(res2?.data?.data[0]?.logo);
        if (
          res2.data.data.length === 0 ||
          res2.data === null ||
          res2?.data?.data[0].websiteStatus == "false"
        ) {
          router.push("/404");
          setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        router.push("/404");
      }
    }
    
  };
  return (
    <Spin spinning={!!isLoading} indicator={antIcon}>
      <div className={styles.main_container}>
        <Header
          timings={timings}
          socialLink={socialUrl}
          headerLogo={headerLogo}
          themeColor={themeColor}
        />
        <SideBtn
          socialLink={socialUrl}
          themeColor={themeColor}
          storeId={storeId}
          fullAccess={fullAccess}
        />
        {fullAccess ? banners.length > 0 ? <Banner banners={banners} /> : "" : ""}
        <ShoppingOptions storeShopping={shoppingOptArray} />
        {fullAccess ? (featureImg || description) ? (
          <div>
            <AboutEcommerceBusiness
              featureImg={featureImg}
              description={description}
              socialLink={socialUrl}
              themeColor={themeColor}
            />
          </div>
        ) : (
          ""
        ) : (
          ""
        )}
        {fullAccess ? tagArray.length > 0 ? <PopularTags tag={tagArray} /> : "" : ""}
        {galleryArray.length > 0 ? <StoreGallery gallery={galleryArray} fullAccess={fullAccess}/> : ""}
        <RateReview
          review={reviewArray}
          store={storeName}
          id={storeId}
          getStoreFront={getStoreFront}
          themeColor={themeColor}
        />
        {clientArray.length > 0 ? <Client client={clientArr} /> : ""}
        {testimonialArray.length > 0 ? (
          <Testimonial testimonial={testimonialArray} themeColor={themeColor} />
        ) : (
          ""
        )}
        {awardArray.length > 0 ? (
          <Award award={awardArray} themeColor={themeColor} />
        ) : (
          ""
        )}
        {fullAccess ? <GetInTouch
          themeColor={themeColor}
          storeUrl={storeUrl}
          storeId={storeId}
        /> : "" }
        {addressArray.length > 0 ? (
          <Contactus
            address={addressArray}
            webUrl={websiteUrl}
            socialLink={socialUrl}
            themeColor={themeColor}
          />
        ) : (
          ""
        )}
        {/* <VisitorStatus /> */}
        <footer>
          <Footer storeName={storeName} qrCode={qrCode} />
        </footer>
      </div>
    </Spin>
  );
};

export default Storepage;

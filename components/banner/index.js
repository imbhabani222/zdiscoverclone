import React from "react";
import { Carousel } from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import storeBanner from "../../assets/images/store-banner.png";
import { baseUrl, imageBaseUrl } from "../../util/baseUrl";

const Banner = (props) => {
  const bannerImg = [storeBanner,storeBanner,storeBanner]

  const contentStyle = {
    // height: '400px',
    color: 'red',
    // lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
  var settings = {
    autoplay: true,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    // slidesToShow: screens.xs === true ? 1 : 3,
    slidesToScroll: 1,
  };
  return (
    <>
      {/* <div style={{width: "100%", height:"auto", maxWidth:"1680px", margin:"auto", overflowX: "hidden", overflowY:"hidden"}}>
        <Carousel autoplay effect="fade">
        {bannerImg.map((ele) => (
          <>
          <div>
          <Image {...ele} alt="/" />
          </div>
          </>
        ))}
        </Carousel>
      </div> */}
      <div style={{maxWidth:"1680px", margin:"auto"}} id="banner">
        <Slider {...settings}>
        {props.banners.map((ele) => (
          <>
          <div>
          <Image src={ele.url ? `${ele.url}` : ""} alt="Feature image"  width={1680} height={400} objectFit="cover"/>
          </div>
          </>
        ))}
        </Slider>
      </div>
    </>
  );
};

export default Banner;
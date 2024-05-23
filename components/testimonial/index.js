import React, { useState } from "react";
import Image from "next/image";
import { Card, Grid, Avatar } from "antd";
import Slider from "react-slick";
import styles from "../testimonial/styles.module.css";
import testimonial1 from "../../assets/images/testmonial1.svg";
import testimonial2 from "../../assets/images/testmonial2.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { imageBaseUrl } from "../../util/baseUrl";
const { useBreakpoint } = Grid;
const Testimonial = (props) => {
  const screens = useBreakpoint();
  const style_ = {
    avatarColor: {
      color: "#ffffff",
      background: props.themeColor,
    },
  };
  // console.log(props);
  var settings = {
    autoplay: true,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: screens.xs === true ? 1 : 3,
    slidesToScroll: 1,
  };
  return (
    <div className={styles.section_wrapper}>
      <div className={styles.section_content_wrapper}>
        <h1 className={styles.section_heading}>Testimonials</h1>
        {props.testimonial.length > 3 ? (
          <Slider {...settings}>
            {props.testimonial.map((ele, ind) => (
              <Card
                key={ele.id}
                id="wrapper_card_id"
                className={styles.card_wrapper_slide}
                // style={{ width: "90%", border: "1px solid red" }}
              >
                <div className={styles.card_content_wrapper} key={ele.id}>
                  <div className={styles.client_card_img_wrapper}>
                    {ele.url === undefined || ele.url === "" ? (
                      <Avatar
                        className={styles.rating_avatar}
                        style={style_.avatarColor}
                      >
                        {ele.name.split("", 1)}
                      </Avatar>
                    ) : (
                      <Image
                        className={styles.client_card_img}
                        // loader={() => {
                        //   `${ele?.url}`;
                        // }}
                        src={`${ele?.url}`}
                        // src={ele.url}
                        alt="client_image"
                        width={"100%"}
                        height={"100%"}
                        fill
                        sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
                      />
                    )}
                  </div>
                  <div className={styles.client_name}>{ele.name}</div>
                  <div className={styles.client_company}>{ele.designation}</div>
                  <div className={styles.client_comment}>{ele.description}</div>
                </div>
              </Card>
            ))}
          </Slider>
        ) : (
          <div className={styles.card_sections_wrapper}>
            {props.testimonial.map((ele, ind) => (
              <Card
                key={ele.id}
                id="wrapper_card_id"
                className={styles.card_wrapper}
              >
                <div className={styles.card_content_wrapper} key={ele.id}>
                  <div className={styles.client_card_img_wrapper}>
                    {ele.url === undefined || ele.url === "" ? (
                      <Avatar
                        className={styles.rating_avatar}
                        style={style_.avatarColor}
                      >
                        {ele.name.split("", 1)}
                      </Avatar>
                    ) : (
                      <Image
                        className={styles.client_card_img}
                        // loader={() => {
                        //   `${ele?.url}`;
                        // }}
                        src={`${ele?.url}`}
                        alt="client_image"
                        width={"100%"}
                        height={"100%"}
                        fill
                        sizes="(max-width: 768px) 100vw,
            (max-width: 1200px) 50vw,
            33vw"
                      />
                    )}
                  </div>
                  <div className={styles.client_name}>{ele.name}</div>
                  <div className={styles.client_company}>{ele.designation}</div>
                  <div className={styles.client_comment}>{ele.description}</div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonial;

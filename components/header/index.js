import React, { useState, useEffect } from "react";
import { Dropdown, Space, Menu } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import Image from "next/image";
import knowMoreImg from "../../assets/images/header-know-more.svg";
import timeIcon from "../../assets/images/time-icon.svg";
import headerLogo from "../../assets/images/header-logo.svg";
import phoneIcon from "../../assets/images/phone-icon.svg";
import mailIcon from "../../assets/images/mail-icon.svg";
import Mailico from "../../assets/images/mail-icon.svg";
import websiteIcon from "../../assets/images/website-icon.svg";
import facebookIcon from "../../assets/images/fb-logo.svg";
import instagramIcon from "../../assets/images/insta-logo.svg";
import twitterIcon from "../../assets/images/twitter-logo.svg";
import youtubeIcon from "../../assets/images/youtube.png";
import linkedinIcon from "../../assets/images/linkedin-logo.svg";
import pinterestIcon from "../../assets/images/pinterest.png";
import dropdwn_btn from "../../assets/images/dropdwn-btn.svg";
import styles from "../header/styles.module.css";
import { baseUrl, imageBaseUrl } from "../../util/baseUrl";
import moment from "moment";
const Header = ({ timings, socialLink, headerLogo, themeColor }) => {
  const [openRightNav, setOpenRightNav] = useState(false);
  const [timing, setTimings] = useState([]);
  useEffect(() => {
    const temp = timings;
    const temp1 = [];
    temp.map((e) => {
      const openTime = convert24Time(e.openingtime);
      const closeTime = convert24Time(e.closingtime);
      temp1.push({
        closingtime: e.closingtime,
        isCheck: e.isCheck,
        label: e.label,
        openingtime: e.openingtime,
        openTime24: openTime,
        closeTime24: closeTime,
      });
    });
    setTimings(temp1);
  }, [timings]);
  // const convert24Time = (e) =>{
  //       closeTime24: closeTime,
  //     });
  //   });
  //   setTimings(temp1);
  // }, [headerLogo]);
  const convert24Time = (e) => {
    const time = e;
    const hours = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    const sHours = hours.toString();
    const sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    const openTime = sHours + ":" + sMinutes;
    return openTime;
  };
  const weeks = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const day = weeks[new Date().getDay()];
  const date = new Date();
  let convertedHour =
    date.getHours().toString().length === 1
      ? "0" + date.getHours()
      : date.getHours();
  const showTime =
    convertedHour + ":" + date.getMinutes() + ":" + date.getSeconds();
  // console.log(showTime, "showtime")
  // console.log(timing[3].openTime24, "open")
  // console.log(timing[3].closeTime24, "close")
  // console.log(showTime>timing[3].openTime24, "1st")
  // console.log(showTime<timing[3].closeTime24, "2st")
  const menu = (
    <Menu
      style={{ width: 300 }}
      items={timing.map((week, i) => ({
        key: i,
        label: (
          <div
            className={styles.dropdown_section}
            style={
              day === week?.label
                ? { color: "green" }
                : week?.isCheck
                ? { color: "black" }
                : { color: "red" }
            }
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div>{week.label}</div>
              {week?.isCheck ? (
                <div>{week.openingtime + " - " + week.closingtime}</div>
              ) : (
                <div>Closed</div>
              )}
            </div>
            {/* {week.day}
          <div>{week.openTime + week.closeTime}</div> */}
          </div>
        ),
      }))}
    />
  );
  return (
    <>
      <div
        className="main_headerDiv"
        style={{ position: "sticky", top: 0, zIndex: 1001 }}
      >
        <div className={styles.header} style={{ backgroundColor: themeColor }}>
          {socialLink.knowMore ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={
                socialLink.knowMore.split("", 4).join("") === "www."
                  ? `https://${socialLink.knowMore}`
                  : socialLink.knowMore.split("", 8).join("") === "https://" ||
                    "http://"
                  ? `${socialLink.knowMore}`
                  : `${socialLink.knowMore}`
              }
              className={styles.know_more}
            >
              <div className={styles.know_more_icon}>
                <Image src={knowMoreImg} alt="/" />
                &nbsp;
              </div>
              <div className={styles.know_more_text}>Know more</div>
              <div className={styles.border}></div>
            </a>
          ) : (
            ""
          )}

          {timing.length > 0 ? (
            <>
              <div className={styles.time_dropdown}>
                <div className={styles.time_icon}>
                  <Image src={timeIcon} alt="/" />
                </div>
                <div className={styles.time_dropdown}>
                  <Dropdown overlay={menu} icon={<UpOutlined />}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space style={{ color: "white" }}>
                        {timing
                          ?.filter(
                            (week) => day === week?.label && week?.isCheck
                          )
                          .map((currentWeek, i) => (
                            <div key={i}>
                              {showTime >= currentWeek.openTime24 &&
                              showTime <= currentWeek.closeTime24
                                ? `Open Now ${currentWeek.openingtime} - ${currentWeek.closingtime}`
                                : `Closed ${currentWeek.openingtime} - ${currentWeek.closingtime}`}
                            </div>
                          ))}
                        {timing?.filter(
                          (week) => day === week?.label && week?.isCheck
                        )?.length === 0
                          ? "Closed"
                          : null}
                        <Image src={dropdwn_btn} alt="dropdwn_btn" />
                        {/* <DownOutlined /> */}
                      </Space>
                    </a>
                  </Dropdown>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className={styles.second_header}>
          <div
            className={styles.second_header_logo}
            style={{ lineHeight: "0" }}
          >
            {/* <div className={styles.logo}> */}
            {headerLogo && (
              <Image
                src={headerLogo}
                alt="logo"
                width={190}
                height={65}
                objectFit="contain"
                objectPosition="left"
              />
            )}
            {/* </div> */}
          </div>
          {/* toggle menu button */}
          <span
            className={styles.toggle_btn}
            onClick={() => setOpenRightNav(true)}
          >
            &#8801;
          </span>
          {/* ------------------------------- */}
          <div className={styles.second_div}>
            <div className={styles.social_link}>
              {socialLink.mobNo ? (
                <>
                  <div className={styles.contact_link}>
                    <div className={styles.phone_icon}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M1.07393 1.73988L1.13439 1.6767C2.74057 0.0703665 3.78654 -0.355407 4.90255 0.286352C5.22358 0.470957 5.52454 0.72936 5.93378 1.14501L7.18909 2.44669C7.88245 3.20327 8.04007 3.92898 7.8143 4.77888L7.7832 4.89139L7.74868 5.00327L7.58086 5.49562C7.22169 6.59977 7.37164 7.22273 8.64955 8.50032C9.97847 9.8289 10.5988 9.93759 11.7881 9.52199L12.0001 9.44831L12.2564 9.36507L12.3686 9.33394C13.2719 9.09292 14.035 9.28525 14.8443 10.094L15.8558 11.071L16.1535 11.3638C16.4836 11.7004 16.7018 11.9672 16.8629 12.2491C17.5007 13.3648 17.0744 14.4101 15.4219 16.0564L15.2647 16.2157C15.018 16.4535 14.7875 16.6239 14.4488 16.7847C13.8804 17.0546 13.2088 17.1563 12.4285 17.0478C10.5056 16.7804 8.0668 15.2632 4.97657 12.1737C4.72501 11.9222 4.48409 11.6756 4.25354 11.4337L3.80623 10.9563C-0.385314 6.40237 -0.755093 3.6049 0.962646 1.85042L1.07393 1.73988ZM4.92201 1.90077C4.65052 1.63311 4.4533 1.46995 4.27943 1.36996C3.89483 1.1488 3.47958 1.24229 2.71108 1.90373L2.46961 2.11945C2.42749 2.15833 2.3844 2.19869 2.34032 2.24057L2.06342 2.51026L2.03848 2.54143L1.85076 2.73003C1.39713 3.19337 1.18226 3.75886 1.36742 4.73139C1.67126 6.32724 3.06202 8.49211 5.86034 11.2897C8.77607 14.2047 10.9976 15.5868 12.6007 15.8097C13.5352 15.9397 14.0118 15.7133 14.498 15.2153L14.8687 14.8412C15.0425 14.6593 15.191 14.4944 15.3165 14.3438L15.4875 14.1283C15.9247 13.5459 15.9647 13.1965 15.7777 12.8694C15.7066 12.7449 15.6031 12.6085 15.4524 12.4417L15.248 12.2259L15.1271 12.1048L13.8511 10.8727C13.4246 10.4794 13.1332 10.4236 12.6908 10.5417L12.5631 10.5784L12.0345 10.7579C10.5011 11.2531 9.39483 11.013 7.76578 9.38431C6.07858 7.69754 5.8807 6.57114 6.44602 4.94931L6.48228 4.84509L6.58257 4.54295L6.63186 4.35036C6.71928 3.93122 6.61947 3.63898 6.16891 3.18834C6.15035 3.16979 6.12962 3.14888 6.10706 3.126L4.92201 1.90077Z"
                          fill={themeColor}
                        />
                      </svg>
                    </div>
                    <div
                      className={styles.contact_data}
                      style={{ color: themeColor }}
                    >
                      <a href={`tel:${socialLink.mobNo}`}>{socialLink.mobNo}</a>
                    </div>
                  </div>
                  {socialLink.email || socialLink.website ? (
                    <div className={styles.border_line}></div>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}

              {socialLink.email ? (
                <>
                  <div className={styles.mail_link}>
                    <div className={styles.mail_icon}>
                      <svg
                        width="16"
                        height="14"
                        viewBox="0 0 14 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.6667 0.666687H2.33337C1.80294 0.666687 1.29423 0.877401 0.919161 1.25247C0.544088 1.62755 0.333374 2.13625 0.333374 2.66669V9.33335C0.333374 9.86379 0.544088 10.3725 0.919161 10.7476C1.29423 11.1226 1.80294 11.3334 2.33337 11.3334H11.6667C12.1971 11.3334 12.7058 11.1226 13.0809 10.7476C13.456 10.3725 13.6667 9.86379 13.6667 9.33335V2.66669C13.6667 2.13625 13.456 1.62755 13.0809 1.25247C12.7058 0.877401 12.1971 0.666687 11.6667 0.666687ZM2.33337 2.00002H11.6667C11.8435 2.00002 12.0131 2.07026 12.1381 2.19528C12.2631 2.32031 12.3334 2.48988 12.3334 2.66669L7.00004 5.92002L1.66671 2.66669C1.66671 2.48988 1.73695 2.32031 1.86197 2.19528C1.98699 2.07026 2.15656 2.00002 2.33337 2.00002ZM12.3334 9.33335C12.3334 9.51016 12.2631 9.67973 12.1381 9.80476C12.0131 9.92978 11.8435 10 11.6667 10H2.33337C2.15656 10 1.98699 9.92978 1.86197 9.80476C1.73695 9.67973 1.66671 9.51016 1.66671 9.33335V4.18669L6.65337 7.23335C6.75472 7.29187 6.86968 7.32267 6.98671 7.32267C7.10373 7.32267 7.21869 7.29187 7.32004 7.23335L12.3334 4.18669V9.33335Z"
                          fill={themeColor}
                        />
                      </svg>
                    </div>
                    <div
                      className={styles.contact_data}
                      style={{ color: themeColor }}
                    >
                      <a href={`mailto:${socialLink.email}`}>
                        {" "}
                        {socialLink.email}
                      </a>
                    </div>
                  </div>
                  {socialLink.website ? (
                    <div className={styles.border_line}></div>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}

              {socialLink.website ? (
                <>
                  <div className={styles.website_link}>
                    <div className={styles.mail_icon}>
                      <svg
                        width="16"
                        height="15"
                        viewBox="0 0 16 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.4286 7.35716C14.4286 10.9076 11.5504 13.7857 7.99998 13.7857M14.4286 7.35716C14.4286 3.80676 11.5504 0.928589 7.99998 0.928589M14.4286 7.35716H1.57141M7.99998 13.7857C4.44958 13.7857 1.57141 10.9076 1.57141 7.35716M7.99998 13.7857C9.60795 12.0254 10.5218 9.74085 10.5714 7.35716C10.5218 4.97347 9.60795 2.68896 7.99998 0.928589M7.99998 13.7857C6.39202 12.0254 5.47821 9.74085 5.42855 7.35716C5.47821 4.97347 6.39202 2.68896 7.99998 0.928589M1.57141 7.35716C1.57141 3.80676 4.44958 0.928589 7.99998 0.928589"
                          stroke={themeColor}
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className={styles.contact_data}
                      style={{ color: themeColor }}
                    >
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          socialLink.website.split("", 4).join("") === "www."
                            ? `https://${socialLink.website}`
                            : socialLink.website.split("", 8).join("") ===
                                "https://" || "http://"
                            ? `${socialLink.website}`
                            : `${socialLink.website}`
                        }
                      >
                        <div> {socialLink.website}</div>
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            <div className={styles.social_connection}>
              {socialLink.fb ||
              socialLink.insta ||
              socialLink.twitter ||
              socialLink.yt ||
              socialLink.linkedin ||
              socialLink.pinterest ? (
                <div className={styles.connect_with_us}>Connect with us</div>
              ) : (
                ""
              )}
              &nbsp;&nbsp;
              <div>
                {socialLink.fb ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={
                      socialLink.fb.split("", 4).join("") === "www."
                        ? `https://${socialLink.fb}`
                        : socialLink.fb.split("", 8).join("") === "https://" ||
                          "http://"
                        ? `${socialLink.fb}`
                        : `${socialLink.fb}`
                    }
                  >
                    {" "}
                    <Image src={facebookIcon} alt="/" />
                    &nbsp;
                  </a>
                ) : (
                  ""
                )}

                {socialLink.insta ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={
                      socialLink.insta.split("", 4).join("") === "www."
                        ? `https://${socialLink.insta}`
                        : socialLink.insta.split("", 8).join("") ===
                            "https://" || "http://"
                        ? `${socialLink.insta}`
                        : `${socialLink.insta}`
                    }
                  >
                    <Image src={instagramIcon} alt="/" />
                    &nbsp;
                  </a>
                ) : (
                  ""
                )}
                {socialLink.twitter ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={
                      socialLink.twitter.split("", 4).join("") === "www."
                        ? `https://${socialLink.twitter}`
                        : socialLink.twitter.split("", 8).join("") ===
                            "https://" || "http://"
                        ? `${socialLink.twitter}`
                        : `${socialLink.twitter}`
                    }
                  >
                    <Image src={twitterIcon} alt="/" />
                    &nbsp;
                  </a>
                ) : (
                  ""
                )}
                {socialLink.yt ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={
                      socialLink.yt.split("", 4).join("") === "www."
                        ? `https://${socialLink.yt}`
                        : socialLink.yt.split("", 8).join("") === "https://" ||
                          "http://"
                        ? `${socialLink.yt}`
                        : `${socialLink.yt}`
                    }
                  >
                    <Image src={youtubeIcon} alt="/" height={28} width={28} />
                    &nbsp;
                  </a>
                ) : (
                  ""
                )}
                {socialLink.linkedin ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={
                      socialLink.linkedin.split("", 4).join("") === "www."
                        ? `https://${socialLink.linkedin}`
                        : socialLink.linkedin.split("", 8).join("") ===
                            "https://" || "http://"
                        ? `${socialLink.linkedin}`
                        : `${socialLink.linkedin}`
                    }
                  >
                    <Image src={linkedinIcon} alt="/" />
                    &nbsp;
                  </a>
                ) : (
                  ""
                )}
                {socialLink.pinterest ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={
                      socialLink.pinterest.split("", 4).join("") === "www."
                        ? `https://${socialLink.pinterest}`
                        : socialLink.pinterest.split("", 8).join("") ===
                            "https://" || "http://"
                        ? `${socialLink.pinterest}`
                        : `${socialLink.pinterest}`
                    }
                  >
                    <Image src={pinterestIcon} alt="/" height={28} width={28} />
                    &nbsp;
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {/* Responsive side navbar */}
          {openRightNav ? (
            <div className={styles.side_nav} id="sideNav">
              <a
                href="#"
                className={styles.close_btn}
                onClick={() => setOpenRightNav(false)}
              >
                &#10006;
              </a>
              <div className={styles.toggle_contact_link}>
                <div className={styles.phone_icon}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M1.07393 1.73988L1.13439 1.6767C2.74057 0.0703665 3.78654 -0.355407 4.90255 0.286352C5.22358 0.470957 5.52454 0.72936 5.93378 1.14501L7.18909 2.44669C7.88245 3.20327 8.04007 3.92898 7.8143 4.77888L7.7832 4.89139L7.74868 5.00327L7.58086 5.49562C7.22169 6.59977 7.37164 7.22273 8.64955 8.50032C9.97847 9.8289 10.5988 9.93759 11.7881 9.52199L12.0001 9.44831L12.2564 9.36507L12.3686 9.33394C13.2719 9.09292 14.035 9.28525 14.8443 10.094L15.8558 11.071L16.1535 11.3638C16.4836 11.7004 16.7018 11.9672 16.8629 12.2491C17.5007 13.3648 17.0744 14.4101 15.4219 16.0564L15.2647 16.2157C15.018 16.4535 14.7875 16.6239 14.4488 16.7847C13.8804 17.0546 13.2088 17.1563 12.4285 17.0478C10.5056 16.7804 8.0668 15.2632 4.97657 12.1737C4.72501 11.9222 4.48409 11.6756 4.25354 11.4337L3.80623 10.9563C-0.385314 6.40237 -0.755093 3.6049 0.962646 1.85042L1.07393 1.73988ZM4.92201 1.90077C4.65052 1.63311 4.4533 1.46995 4.27943 1.36996C3.89483 1.1488 3.47958 1.24229 2.71108 1.90373L2.46961 2.11945C2.42749 2.15833 2.3844 2.19869 2.34032 2.24057L2.06342 2.51026L2.03848 2.54143L1.85076 2.73003C1.39713 3.19337 1.18226 3.75886 1.36742 4.73139C1.67126 6.32724 3.06202 8.49211 5.86034 11.2897C8.77607 14.2047 10.9976 15.5868 12.6007 15.8097C13.5352 15.9397 14.0118 15.7133 14.498 15.2153L14.8687 14.8412C15.0425 14.6593 15.191 14.4944 15.3165 14.3438L15.4875 14.1283C15.9247 13.5459 15.9647 13.1965 15.7777 12.8694C15.7066 12.7449 15.6031 12.6085 15.4524 12.4417L15.248 12.2259L15.1271 12.1048L13.8511 10.8727C13.4246 10.4794 13.1332 10.4236 12.6908 10.5417L12.5631 10.5784L12.0345 10.7579C10.5011 11.2531 9.39483 11.013 7.76578 9.38431C6.07858 7.69754 5.8807 6.57114 6.44602 4.94931L6.48228 4.84509L6.58257 4.54295L6.63186 4.35036C6.71928 3.93122 6.61947 3.63898 6.16891 3.18834C6.15035 3.16979 6.12962 3.14888 6.10706 3.126L4.92201 1.90077Z"
                      fill={themeColor}
                    />
                  </svg>
                </div>
                <div
                  className={styles.contact_data}
                  style={{ color: themeColor }}
                >
                  <a href={`tel:${socialLink.mobNo}`}>{socialLink.mobNo}</a>
                </div>
              </div>
              <div className={styles.toggle_mail_link}>
                <div className={styles.mail_icon}>
                  <svg
                    width="16"
                    height="14"
                    viewBox="0 0 14 12"
                    fill="red"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.6667 0.666687H2.33337C1.80294 0.666687 1.29423 0.877401 0.919161 1.25247C0.544088 1.62755 0.333374 2.13625 0.333374 2.66669V9.33335C0.333374 9.86379 0.544088 10.3725 0.919161 10.7476C1.29423 11.1226 1.80294 11.3334 2.33337 11.3334H11.6667C12.1971 11.3334 12.7058 11.1226 13.0809 10.7476C13.456 10.3725 13.6667 9.86379 13.6667 9.33335V2.66669C13.6667 2.13625 13.456 1.62755 13.0809 1.25247C12.7058 0.877401 12.1971 0.666687 11.6667 0.666687ZM2.33337 2.00002H11.6667C11.8435 2.00002 12.0131 2.07026 12.1381 2.19528C12.2631 2.32031 12.3334 2.48988 12.3334 2.66669L7.00004 5.92002L1.66671 2.66669C1.66671 2.48988 1.73695 2.32031 1.86197 2.19528C1.98699 2.07026 2.15656 2.00002 2.33337 2.00002ZM12.3334 9.33335C12.3334 9.51016 12.2631 9.67973 12.1381 9.80476C12.0131 9.92978 11.8435 10 11.6667 10H2.33337C2.15656 10 1.98699 9.92978 1.86197 9.80476C1.73695 9.67973 1.66671 9.51016 1.66671 9.33335V4.18669L6.65337 7.23335C6.75472 7.29187 6.86968 7.32267 6.98671 7.32267C7.10373 7.32267 7.21869 7.29187 7.32004 7.23335L12.3334 4.18669V9.33335Z"
                      fill={themeColor}
                    />
                  </svg>
                </div>
                <div
                  className={styles.contact_data}
                  style={{ color: themeColor }}
                >
                  <a href={`mailto:${socialLink.email}`}> {socialLink.email}</a>
                </div>
              </div>

              {socialLink.website ? (
                <>
                  <div className={styles.toggle_website_link}>
                    <div className={styles.mail_icon}>
                      <svg
                        width="16"
                        height="15"
                        viewBox="0 0 16 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.4286 7.35716C14.4286 10.9076 11.5504 13.7857 7.99998 13.7857M14.4286 7.35716C14.4286 3.80676 11.5504 0.928589 7.99998 0.928589M14.4286 7.35716H1.57141M7.99998 13.7857C4.44958 13.7857 1.57141 10.9076 1.57141 7.35716M7.99998 13.7857C9.60795 12.0254 10.5218 9.74085 10.5714 7.35716C10.5218 4.97347 9.60795 2.68896 7.99998 0.928589M7.99998 13.7857C6.39202 12.0254 5.47821 9.74085 5.42855 7.35716C5.47821 4.97347 6.39202 2.68896 7.99998 0.928589M1.57141 7.35716C1.57141 3.80676 4.44958 0.928589 7.99998 0.928589"
                          stroke={themeColor}
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className={styles.contact_data}
                      style={{ color: themeColor }}
                    >
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          socialLink.website.split("", 4).join("") === "www."
                            ? `https://${socialLink.website}`
                            : socialLink.website.split("", 8).join("") ===
                                "https://" || "http://"
                            ? `${socialLink.website}`
                            : `${socialLink.website}`
                        }
                      >
                        <div> {socialLink.website}</div>
                      </a>
                    </div>
                  </div>
                  {/* <div className={styles.website_link}>
                    <div className={styles.mail_icon}>
                      <svg
                        width="16"
                        height="15"
                        viewBox="0 0 16 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.4286 7.35716C14.4286 10.9076 11.5504 13.7857 7.99998 13.7857M14.4286 7.35716C14.4286 3.80676 11.5504 0.928589 7.99998 0.928589M14.4286 7.35716H1.57141M7.99998 13.7857C4.44958 13.7857 1.57141 10.9076 1.57141 7.35716M7.99998 13.7857C9.60795 12.0254 10.5218 9.74085 10.5714 7.35716C10.5218 4.97347 9.60795 2.68896 7.99998 0.928589M7.99998 13.7857C6.39202 12.0254 5.47821 9.74085 5.42855 7.35716C5.47821 4.97347 6.39202 2.68896 7.99998 0.928589M1.57141 7.35716C1.57141 3.80676 4.44958 0.928589 7.99998 0.928589"
                          stroke={themeColor}
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className={styles.contact_data}
                      style={{ color: themeColor }}
                    >
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                         href={`https://${socialLink.website}`}
                      >
                        <div> {socialLink.website}</div>
                      </a>
                    </div>
                  </div> */}
                </>
              ) : (
                ""
              )}

              <div className={styles.toggle_social_connection}>
                <div style={{ columnGap: "10px", display: "flex" }}>
                  {socialLink.fb ? (
                    <a
                      href={
                        socialLink.fb.split("", 4).join("") === "www."
                          ? `https://${socialLink.fb}`
                          : socialLink.fb.split("", 8).join("") ===
                              "https://" || "http://"
                          ? `${socialLink.fb}`
                          : `${socialLink.fb}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      <Image src={facebookIcon} alt="/" />
                    </a>
                  ) : (
                    ""
                  )}
                  {socialLink.insta ? (
                    <a
                      href={
                        socialLink.insta.split("", 4).join("") === "www."
                          ? `https://${socialLink.insta}`
                          : socialLink.insta.split("", 8).join("") ===
                              "https://" || "http://"
                          ? `${socialLink.insta}`
                          : `${socialLink.insta}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image src={instagramIcon} alt="/" />
                    </a>
                  ) : (
                    ""
                  )}

                  {socialLink.twitter ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={
                        socialLink.twitter.split("", 4).join("") === "www."
                          ? `https://${socialLink.twitter}`
                          : socialLink.twitter.split("", 8).join("") ===
                              "https://" || "http://"
                          ? `${socialLink.twitter}`
                          : `${socialLink.twitter}`
                      }
                    >
                      <Image src={twitterIcon} alt="/" />
                      &nbsp;
                    </a>
                  ) : (
                    ""
                  )}
                  {socialLink.yt ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={
                        socialLink.yt.split("", 4).join("") === "www."
                          ? `https://${socialLink.yt}`
                          : socialLink.yt.split("", 8).join("") ===
                              "https://" || "http://"
                          ? `${socialLink.yt}`
                          : `${socialLink.yt}`
                      }
                    >
                      <Image src={youtubeIcon} alt="/" height={28} width={28} />
                      &nbsp;
                    </a>
                  ) : (
                    ""
                  )}
                  {socialLink.linkedin ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={
                        socialLink.linkedin.split("", 4).join("") === "www."
                          ? `https://${socialLink.linkedin}`
                          : socialLink.linkedin.split("", 8).join("") ===
                              "https://" || "http://"
                          ? `${socialLink.linkedin}`
                          : `${socialLink.linkedin}`
                      }
                    >
                      <Image src={linkedinIcon} alt="/" />
                      &nbsp;
                    </a>
                  ) : (
                    ""
                  )}
                  {socialLink.pinterest ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={
                        socialLink.pinterest.split("", 4).join("") === "www."
                          ? `https://${socialLink.pinterest}`
                          : socialLink.pinterest.split("", 8).join("") ===
                              "https://" || "http://"
                          ? `${socialLink.pinterest}`
                          : `${socialLink.pinterest}`
                      }
                    >
                      <Image
                        src={pinterestIcon}
                        alt="/"
                        height={28}
                        width={28}
                      />
                      &nbsp;
                    </a>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Header;

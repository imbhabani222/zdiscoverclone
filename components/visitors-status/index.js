import React from "react";
import { Badge } from "antd";
import styles from "../visitors-status/styles.module.css";
import footerImg1 from "../../assets/images/store-footer1.svg";
import footerImg2 from "../../assets/images/store-footer2.svg";
import Image from "next/image";
const VisitorStatus = () => {
  const visitorsData = {
    allTimeVisitors: 125,
    onlineNow: 15,
    todayVisitors: 20,
  };
  return (
    <>
      <div className="visitor-count-footer">
        <span className="store-footer">
        <Image src={footerImg1} alt="side image"/>
        </span>
        <div className={styles.main_div}>
          <div className={styles.all_time_visitors}>
            <div className={styles.numbers}>{visitorsData.allTimeVisitors}</div>
            <div className={styles.visitor_text}>All time visitors</div>
          </div>
          <div className={styles.online_now}>
            <Badge dot={true} color={"#3BB77E"}>
              <div className={styles.online_numbers}>
                {visitorsData.onlineNow}
              </div>
              <div className={styles.visitor_text}>Online Now</div>
            </Badge>
            {/* <div className={styles.online_numbers}>{visitorsData.onlineNow}</div> */}
            {/* <div className={styles.visitor_text}>Online Now</div> */}
          </div>
          <div className={styles.today_visitors}>
            <div className={styles.numbers}>{visitorsData.todayVisitors}</div>
            <div className={styles.visitor_text}>Today Visitors</div>
          </div>
        </div>
        <span className="store-footer">
        <Image src={footerImg2} alt="side image"/>
        </span>
      </div>
    </>
  );
};

export default VisitorStatus;

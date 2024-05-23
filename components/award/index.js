import React from "react";
import { Col, Row } from "antd";
import Image from "next/image";
import styles from "../award/styles.module.css";
import award1 from "../../assets/images/award1.svg";
import award2 from "../../assets/images/award2.svg";
import award3 from "../../assets/images/award3.svg";
const Award = (props) => {
  // console.log(props.themeColor);
  const awardData = [
    {
      id: 1,
      awardImg: award1,
    },
    {
      id: 2,
      awardImg: award2,
    },
    {
      id: 3,
      awardImg: award3,
    },
    {
      id: 4,
      awardImg: award2,
    },
    // {
    //   id: 5,
    //   awardImg: award2,
    // },
    // {
    //   id: 6,
    //   awardImg: award3,
    // },
  ];
  const style_ = {
    inputStyle: {
      background: " rgba(246, 140, 31, 0.1)",
    },
  };

  return (
    <div className={styles.section_wrapper} style={style_.inputStyle}>
      <div className={styles.section_content_wrapper}>
        <h1 className={styles.section_heading}>Awards and Certificates</h1>
        <Row gutter={[16, 16]} justify={"center"}>
          {props.award.map((ele) => (
            <Col xs={12} sm={12} md={8} lg={6} xl={6} key={ele.id}>
              <div className={styles.award_wrapper}>
                <Image
                  src={`${ele?.url}`}
                  alt="client_image"
                  width={200}
                  height={200}
            //       fill
            //       sizes="(max-width: 768px) 100vw,
            // (max-width: 1200px) 50vw,
            // 33vw"
                objectFit="contain"
                />
                {/* <Image alt="alt" {...ele.awardImg} /> */}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Award;

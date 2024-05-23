import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Form,
  Input,
  Progress,
  Button,
  Avatar,
  List,
  Modal,
  Rate,
  message,
} from "antd";
import "antd/dist/antd.css";
import styles from "../rateReview/styles.module.css";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("loginToken");
const { TextArea } = Input;

const RateReview = (props) => {
  // console.log(props.id);

  const style_ = {
    textColor: {
      color: props.themeColor,
    },
    bgColor: {
      background: props.themeColor,
    },
    avatarColor: {
      color: "#ffffff",
      background: props.themeColor,
    },
  };

  const [form] = Form.useForm();
  const [count, setCount] = useState(3);
  const [data, setData] = useState([]);
  const [reviewCount, setReviewCount] = useState(data.slice(0, 3));
  const [open, setOpen] = useState(false);
  const [reviewBtn, setReviewBtn] = useState("View more helpful reviews");

  const eachRate = props.review.map((ele) => parseInt(ele.rating));

  const fiveStarCount = eachRate.filter((ele) => ele === 5);
  const fourStarCount = eachRate.filter((ele) => ele === 4);
  const threeStarCount = eachRate.filter((ele) => ele === 3);
  const twoStarCount = eachRate.filter((ele) => ele === 2);
  const oneStarCount = eachRate.filter((ele) => ele === 1);
  //console.log(fiveStarCount);
  useEffect(() => {
    let temp = [];

    props.review.map((item) => {
      const eventCreate = new Date(item.createdAt).toLocaleDateString("en-us", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const eventmodify = new Date(item.createdAt).toLocaleDateString("en-us", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      // console.log(eventCreate);

      temp.push({
        _id: item._id,
        name: item.name,
        rating: item.rating,
        comments: item.comments,
        storeId: item.storeId,
        createdAt: eventCreate,
        modifiedAt: eventmodify,
        __v: item._v,
        reply: item.reply ? [{ comment: item.reply }] : [],
      });
    });
    setData([...temp]);
  }, [props.review]);

  // const ReviewData = [
  //   {
  //     id: "1",
  //     authorName: "Ramesh Patel",
  //     rateValue: 3,
  //     reviewDate: "April 9, 2022",
  //     reviewComment:
  //       "Very good collection for dining table and office chair. I purchased office chair and marble top dining set good price and collections",
  //     reviewReply: [],
  //   },
  //   {
  //     id: "2",
  //     authorName: "Ishan Desai",
  //     rateValue: 2,
  //     reviewDate: "April 9, 2022",
  //     reviewComment:
  //       "I purchased bedroom set. They have good customisation option available. I recommended to others also.",
  //     reviewReply: [],
  //   },
  //   {
  //     id: "3",
  //     authorName: "Rajguru Shah",
  //     rateValue: 1,
  //     reviewDate: "April 9, 2022",
  //     reviewComment:
  //       "Great experience, proffessional staff, with wide range of products... Must visit once, if u r looking for comfy furniture yet stylish, n along with dedicated service like cherry on the top",
  //     reviewReply: [
  //       {
  //         id: "1",
  //         authorName: "Decor Furniture",
  //         replyDate: "April 9, 2022",
  //         replyComment:
  //           "Great experience, proffessional staff, with wide range of products... Must visit once, if u r looking for comfy furniture yet stylish, n along with dedicated service like cherry on the top",
  //       },
  //     ],
  //   },
  // ];
  // console.log(eachRate);
  // console.log(fiveStarCount.length);
  // console.log(fourStarCount.length);
  // console.log(threeStarCount.length);
  // console.log(twoStarCount.length);
  // console.log(oneStarCount.length);

  const initialValue = 0;
  const sumRate = eachRate.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
  const avgStarRate =
    eachRate.length == 0 ? 0 : (sumRate / eachRate.length).toFixed(1);

  const updateEachRate = eachRate.filter(Boolean);
  const updatesumRate = updateEachRate.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
  const updateAvgStarRate =
    updateEachRate.length == 0
      ? 0
      : (updatesumRate / updateEachRate.length).toFixed(1);
  // console.log(updateEachRate);
  // console.log(updatesumRate);
  // console.log(eachRate);
  // console.log(sumRate);
  // console.log(avgStarRate);
  // console.log(updateAvgStarRate);
  const rateData = [
    {
      id: 1,
      rateNum: 5,
      rateCount: fiveStarCount.length,
    },
    {
      id: 2,
      rateNum: 4,
      rateCount: fourStarCount.length,
    },
    {
      id: 3,
      rateNum: 3,
      rateCount: threeStarCount.length,
    },
    {
      id: 4,
      rateNum: 2,
      rateCount: twoStarCount.length,
    },
    {
      id: 5,
      rateNum: 1,
      rateCount: oneStarCount.length,
    },
  ];
  const onLoadMore = () => {
    // console.log("welcome");
    setReviewCount(data.slice(0, data.length));
    setReviewBtn("View less helpful reviews");
  };
  const onLoadLess = () => {
    setReviewCount(data.slice(0, 3));
    setReviewBtn("View more helpful reviews");
  };
  const loadMore = (
    <div
      style={{
        textAlign: "center",
        marginTop: 12,
        height: 32,
        lineHeight: "32px",
      }}
    >
      <Button
        type="text"
        className={styles.view_btn}
        style={style_.textColor}
        onClick={
          reviewBtn === "View more helpful reviews" ? onLoadMore : onLoadLess
        }
      >
        {reviewBtn}
      </Button>
    </div>
  );
  const onFinish = async (values) => {
    // console.log(values);
    const payload = {
      storeid: props.id,
      name: values.name,
      rating: values.rating,
      comments: values.comments,
    };

    let data = await fetch(`/api/createReview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    let res = await data.json();
    if (res.status) {
      message.success(res?.data?.message);
      form.resetFields();
      setOpen(false);
      props.getStoreFront();
    } else {
      message.error("Internal Server Error");
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    // setOpen(false);
  };

  const showModal = () => {
    form.resetFields();
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div className={styles.section_wrapper} style={{marginBottom: "2rem"}}>
      <div className={styles.section_content_wrapper}>
        <div className={styles.section_header_wrapper}>
          <h1 className={styles.section_heading}>Rating & Reviews</h1>
          <Button
            type="text"
            onClick={showModal}
            className={styles.section_mobile_review_btn}
            style={style_.textColor}
          >
            Write a review
          </Button>
        </div>
        <div className={styles.section_rating_wrapper}>
          <Row>
            <Col xs={5} sm={5} md={4} lg={4} xl={4}>
              <div>
                <span
                  className={styles.section_total_view}
                  style={style_.textColor}
                >
                  {avgStarRate !== NaN ? updateAvgStarRate : avgStarRate}
                </span>{" "}
                <Rate
                  className={styles.section_total_star}
                  disabled
                  allowHalf
                  defaultValue={5}
                  count={1}
                />
              </div>

              <div className={styles.section_review_count}>
                {data.length} Reviews
              </div>
            </Col>
            <Col xs={19} sm={19} md={16} lg={16} xl={16}>
              {rateData.map((ele) => (
                <Row
                  gutter={[8, 8]}
                  key={ele.id}
                  style={{ alignItems: "center" }}
                >
                  <Col xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Rate
                      className={styles.section_progress_star}
                      disabled
                      defaultValue={5}
                      count={ele.rateNum}
                      allowHalf
                    />
                  </Col>
                  <Col xs={10} sm={10} md={16} lg={16} xl={16}>
                    <Progress
                      className={styles.section_progressbar}
                      showInfo={false}
                      percent={
                        sumRate !== NaN
                          ? (ele.rateCount / updatesumRate) * 100
                          : (ele.rateCount / sumRate) * 100
                      }
                      strokeColor={
                        ele.rateNum === 5 || ele.rateNum === 4
                          ? "#3BB77E"
                          : ele.rateNum === 3
                          ? "#F3B64C"
                          : ele.rateNum === 2
                          ? "#EB7F44"
                          : "#F65B6B"
                      }
                    />
                  </Col>
                  <Col xs={2} sm={2} md={4} lg={4} xl={4}>
                    <div className={styles.section_max_rate_count}>
                      {ele.rateCount}
                    </div>
                  </Col>
                </Row>
              ))}
            </Col>
            <Col
              xs={24}
              sm={24}
              md={4}
              lg={4}
              xl={4}
              style={{ textAlign: "end" }}
            >
              <Button
                onClick={showModal}
                className={styles.section_review_btn}
                style={style_.bgColor}
              >
                Write a review
              </Button>
              <Modal
                className={styles.section_modal}
                open={open}
                title="Write a review"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
              >
                <Form
                  requiredMark={false}
                  name="review_details"
                  form={form}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item
                    label="Rating* : "
                    name="rating"
                    rules={[
                      {
                        required: true,
                        message: "Please input your ratings",
                      },
                    ]}
                  >
                    <Rate />
                  </Form.Item>
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your name",
                        pattern: /^[a-zA-Z\s]*$/,
                      },
                    ]}
                  >
                    <Input placeholder="Name*" className={styles.inputStyle} />
                  </Form.Item>
                  <Form.Item
                    name="comments"
                    rules={[
                      {
                        required: true,
                        message: "Please input your comments",
                      },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Write your comments here*"
                      className={styles.inputStyle}
                    />
                  </Form.Item>
                  <Row>
                    <Col span={5}>
                      <Button
                        htmlType="submit"
                        style={style_.bgColor}
                        className={styles.modal_review_btn}
                      >
                        Submit Review
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Modal>
            </Col>
          </Row>
          <List
            itemLayout="horizontal"
            // loadMore={loadMore}
            pagination={
              data.length <= 3
                ? false
                : {
                    alignment: "center",
                    pageSize: 3,
                  }
            }
            dataSource={data}
            renderItem={(item) =>
              item.reply.length == 0 ? (
                <List.Item className={styles.section_rating_list}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        className={styles.rating_avatar}
                        style={style_.avatarColor}
                      >
                        {item.name.split("", 1)}
                      </Avatar>
                    }
                    title={
                      <>
                        <div className={styles.reviewer_name}>{item.name}</div>
                        <div>
                          <Rate disabled value={item.rating} />
                        </div>
                      </>
                    }
                    description={
                      <>
                        <div className={styles.reviwer_comment}>
                          {item.comments}
                        </div>
                      </>
                    }
                  />
                  <div className={styles.reviewer_date}>
                    {" "}
                    {/* const event = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
                    console.log(event.toLocaleDateString('de-DE', options)); */}
                    {item.createdAt.split("T")[0]}
                  </div>
                </List.Item>
              ) : (
                <>
                  <List.Item className={styles.section_rating_list}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          className={styles.rating_avatar}
                          style={style_.avatarColor}
                        >
                          {item.name.split("", 1)}
                        </Avatar>
                      }
                      title={
                        <>
                          <div className={styles.reviewer_date_wrapper}>
                            <div>
                              <div className={styles.reviewer_name}>
                                {item.name}
                              </div>

                              <div>
                                <Rate disabled value={item.rating} />
                              </div>
                            </div>
                            <div className={styles.reviewer_date}>
                              {item.modifiedAt.split("T")[0]}
                            </div>
                          </div>
                        </>
                      }
                      description={
                        <>
                          <div className={styles.reviwer_comment}>
                            {item.comments}
                          </div>

                          <List
                            className={styles.reply_wrapper}
                            itemLayout="horizontal"
                            dataSource={item.reply}
                            renderItem={(item2) => (
                              <List.Item>
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      className={styles.rating_avatar}
                                      style={style_.avatarColor}
                                    >
                                      {props.store.split("", 1)}
                                    </Avatar>
                                  }
                                  title={
                                    <>
                                      <div className={styles.reviewer_name}>
                                        {props.store}
                                      </div>
                                      <div className={styles.reviewer_date}>
                                        Replied On{" "}
                                        {item.modifiedAt.split("T")[0]}
                                      </div>
                                    </>
                                  }
                                  description={
                                    <>
                                      <div className={styles.reviwer_comment}>
                                        {item2.comment}
                                      </div>
                                    </>
                                  }
                                />
                                {/* <div className={styles.reviewer_date}>
                                  {item.modifiedAt.split("T")[0]}
                                   
                                </div> */}
                              </List.Item>
                            )}
                          />
                        </>
                      }
                    />

                    {/* <div className={styles.reviewer_date}>
                      {item.reviewDate}
                    </div> */}
                  </List.Item>
                </>
              )
            }
          />
        </div>
      </div>
    </div>
  );
};
export default RateReview;

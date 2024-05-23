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
  Upload,
} from "antd";
import "antd/dist/antd.css";
import styles from "./rating.module.css";
import Cookies from "universal-cookie";
import axios from "axios";
import { Spin } from "antd";
import Icon, { Loading3QuartersOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const antIcon = (
  <Loading3QuartersOutlined style={{ fontSize: 50, color: "#5902b3" }} spin />
);
const cookies = new Cookies();
const token = cookies.get("loginToken");
const storeid = cookies.get("storeid");

const { TextArea } = Input;
const RatingReview = () => {
  const router = useRouter();

  useEffect(() => {
    let is_subscribed = cookies.get("is_subscribed");
    if (is_subscribed == "false") {
      router.push("/404");
    }
  }, []);

  const storeName = cookies.get("storeName");
  const [count, setCount] = useState(3);
  const [data, setData] = useState([]);
  const [reviewCount, setReviewCount] = useState(data.slice(0, 3));
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [_id, setId] = useState("");
  const [comment, setComment] = useState("");
  const [isReply, setIsReply] = useState(false);
  const [reviewBtn, setReviewBtn] = useState(" View more helpful reviews");
  console.log(comment);
  useEffect(() => {
    getReviews();
  }, []);
  const getReviews = async () => {
    const storeid = cookies.get("storeid");
    if (storeid != "null") {
      let subData = JSON.parse(
        JSON.stringify(cookies.get("subscription_data"))
      );
      let sId = cookies.get("subscrition_id");
      if (subData != "undefined") {
        let temp = subData.filter((e) => e._id == sId);
        const x = temp[0]?.planDetails?.responsetoReviews?.flag;
        setIsReply(x);
      }
    }
    setLoading(true);
    let datas = await fetch(`/api/getreviews`, {
      method: "POST",
      body: JSON.stringify({ storeid: storeid }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let res = await datas.json();
    if (res.status) {
      let temp = [];
      res.data.data.map((item) => {
        const eventCreate = new Date(item.createdAt).toLocaleDateString(
          "en-us",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
        const eventmodify = new Date(item.createdAt).toLocaleDateString(
          "en-us",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
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
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const updateReview = async () => {
    let body = {
      id: _id,
      reply: comment,
    };
    let datas = await fetch(`/api/updatereview`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let res = await datas.json();
    if (res.status) {
      setOpen(false);
      setComment("");
      getReviews();
    } else {
      setOpen(false);
      getReviews();
    }
  };
  const commentChange = (e) => {
    setComment(e.target.value);
  };

  const showModal = (id) => {
    setId(id);
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setOpen(false);
  };
  const handleCancel = () => {
    setId("");
    setComment("");
    setOpen(false);
  };
  const fileRequestHandle = async (e) => {
    const form = new FormData();
    form.set("file", e.file);
    const response = await axios.post(
      "https://discover.zlite.in/dev/v1/upload-logo",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // console.log(response, "response");
  };
  return (
    <Spin spinning={isLoading} indicator={antIcon}>
      <div>
        {/* <Upload customRequest={fileRequestHandle}>sfsfdssdfdsffd</Upload> */}
        <List
          itemLayout="horizontal"
          dataSource={data}
          pagination={
            data.length <= 3
              ? false
              : {
                  alignment: "center",
                  pageSize: 3,
                }
          }
          renderItem={(item) =>
            item.reply.length == 0 ? (
              <List.Item className={styles.section_rating_list}>
                <List.Item.Meta
                  avatar={
                    <Avatar className={styles.rating_avatar}>
                      {item?.name?.split("", 1)}
                    </Avatar>
                  }
                  title={
                    <>
                      <div className={styles.reviewer_name}>
                        {item.name}&nbsp;&nbsp;
                        <span className={styles.reviewer_date}>
                          {item.createdAt.split("T")[0]}
                        </span>
                      </div>
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
                {isReply ? (
                  <div
                    onClick={() => showModal(item._id)}
                    className={styles.reviewer_reply}
                  >
                    Reply
                  </div>
                ) : (
                  ""
                )}
              </List.Item>
            ) : (
              <>
                <List.Item className={styles.section_rating_list}>
                  <List.Item.Meta
                    avatar={
                      <Avatar className={styles.rating_avatar}>
                        {item?.name?.split("", 1)}
                      </Avatar>
                    }
                    title={
                      <>
                        <div className={styles.reviewer_name}>
                          {item.name}&nbsp;&nbsp;
                          <span className={styles.reviewer_date}>
                            {item.createdAt}
                          </span>
                        </div>
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
                        <List
                          className={styles.reply_wrapper}
                          itemLayout="horizontal"
                          dataSource={item.reply}
                          renderItem={(item2) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={
                                  <Avatar className={styles.rating_avatar}>
                                    {storeName?.split("", 1)}
                                  </Avatar>
                                }
                                title={
                                  <>
                                    <div className={styles.reviewer_name}>
                                      {storeName}
                                    </div>
                                    <div className={styles.reviewer_date}>
                                      Replied On {item.modifiedAt.split("T")[0]}
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
                            </List.Item>
                          )}
                        />
                      </>
                    }
                  />

                  <div className={styles.reviewer_reply}>
                    {/* {item.reviewDate} */}
                  </div>
                </List.Item>
              </>
            )
          }
        />
        <Modal
          className={styles.section_modal}
          open={open}
          title="Reply"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button
              className={styles.modal_review_btn}
              key="submit"
              type="primary"
              onClick={updateReview}
              disabled={comment ? false : true}
            >
              Submit
            </Button>,
          ]}
        >
          <Form requiredMark={false} name="review_details">
            <TextArea
              rows={4}
              placeholder="Write Your Comments Here*"
              className={styles.inputStyle}
              onChange={commentChange}
              value={comment}
            />
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};
export default RatingReview;

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button, Card, Avatar, Popconfirm, message, Empty } from "antd";
import editIcon from "../../assets/images/editIcon.svg";
import deleteImg from "../../assets/images/deleteicon.svg";
import styles from "./add-testimonial.module.css";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("loginToken");
const storeid = cookies.get("storeid");

const AddTestimonial = () => {
  const style_ = {
    avatarColor: {
      color: "#f56a00",
      background: "#fde3cf",
    },
  };
  const router = useRouter();
  const [testimonialData, setTestimonialData] = useState([]);
  const [storeId, setStoreId] = useState("");

  useEffect(() => {
    const storeid = cookies.get("storeid");
    setStoreId(storeid);
    if (storeid != "null") {
      getTestimonialData(storeid);
    }
  }, []);

  const getTestimonialData = async (id) => {
    const payload = {
      storeid: id,
    };
    let data = await fetch(`/api/getTestimonialDetail`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let res = await data.json();
    if (res.status) {
      setTestimonialData(res?.data?.data);
    } else {
      setTestimonialData([]);
    }
  };
  const handelDelete = async (id) => {
    let data = await fetch(`/api/deleteTestimonial/${id}`, {
      method: "DELETE",
      // body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let res = await data.json();
    if (res?.status) {
      getTestimonialData();
      message.success("Successfully Deleted");
    }
  };

  const cancel = (e) => {
    message.error("Cancel testimonial  ");
  };
  return (
    <div className={styles.section_wrapper}>
      <div className={styles.section_content_row}>
        <div className={styles.section_heading}>Testimonials</div>
        <div>
          <Button
            className="store-mgt-btn store-mgt-btn-color ml-1"
            disabled={storeId == "null" ? true : false}
          >
            <Link href={"/new-testimonial/add"}>+ Add New</Link>
          </Button>
        </div>
      </div>
      <div className={styles.section_content_row2}>
        {testimonialData.length === 0 ? (
          <div style={{ textAlign: "center", margin: "0 auto" }}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          testimonialData?.map((ele) => (
            <Card key={ele.id} className={styles.card_wrapper}>
              <div className={styles.edit_img}>
                <Image
                  src={editIcon}
                  alt="edit_image"
                  onClick={() => router.push(`/new-testimonial/${ele._id}`)}
                />
                <Popconfirm
                  title="Are you sure to delete this testimonial?"
                  onConfirm={() => handelDelete(ele._id)}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="text" danger>
                    <Image src={deleteImg} alt="delete_image" />
                  </Button>
                </Popconfirm>
              </div>

              <div className={styles.card_content_wrapper} key={ele._id}>
                <div className={styles.client_card_img_wrapper}>
                  {ele.url === undefined || ele.url === "" ? (
                    <Avatar
                      className={styles.rating_avatar}
                      style={style_.avatarColor}
                    >
                      {ele.name?.split("", 1)}
                    </Avatar>
                  ) : (
                    <>
                      <Image
                        className={styles.client_card_img}
                        src={`${ele?.url}`}
                        alt="testimonial_image"
                        width={"100%"}
                        height={"100%"}
                        fill
                        sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                      />
                    </>
                  )}
                </div>
                <div className={styles.client_name}>{ele.name}</div>
                <div className={styles.client_company}>{ele.designation}</div>
                <div className={styles.client_comment}>{ele.description}</div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AddTestimonial;

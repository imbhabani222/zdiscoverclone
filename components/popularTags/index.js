import React from "react";
import styles from "../popularTags/styles.module.css";
const PopularTags = (props) => {
  // console.log(props);
  return (
    <div className={styles.section_wrapper}>
      <div className={styles.section_content_wrapper}>
        <h1 className={styles.section_heading}>Popular Tags</h1>
        <div className={styles.section_tag_text_wrapper}>
          {props.tag?.map((ele) => (
            <div className={styles.section_tag_text} key={ele.id}>
              {ele}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularTags;

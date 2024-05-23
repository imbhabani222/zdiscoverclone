import React, { useEffect } from "react";
import Image from "next/image";
import greenTick from "../../assets/images/green-tick.svg";
import styles from "../shopping-options/styles.module.css";

const ShoppingOptions = (props) => {
  const shoppingOptionsData = [
    {
      id: "1",
      options: "In Store Shopping",
      value: props.storeShopping[0].shopping,
    },
    {
      id: "2",
      options: "In Store Pick Up",
      value: props.storeShopping[0].pickUp,
    },
    {
      id: "3",
      options: "Delivery",
      value: props.storeShopping[0].delivery,
    },
  ];

  useEffect(() => {
  }, [props]);
  return (
    <>
      <div className={styles.main_div}>
        <div className={styles.shopping_options}>{props.storeShopping[0].delivery || props.storeShopping[0].pickUp || props.storeShopping[0].shopping === true? "Shopping Options": ""} </div>
        <div className={styles.shopping_options_btn}>
          {shoppingOptionsData?.map((ele) =>
            ele.value !== false && ele.value !== undefined ? (
              <div className={styles.store_shopping} key={ele.id}>
                <Image src={greenTick} alt="/" />
                {/* {console.log(ele.shopping, "hhhh")} */}
                <div> {ele.options}</div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </>
  );
};

export default ShoppingOptions;

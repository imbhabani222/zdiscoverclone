/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { message } from "antd";
import successimg from "../../assets/images/payment-success.svg";
import errorimg from "../../assets/images/payment-error.png";
import styles from "./index.module.css";
import Cookies from "universal-cookie";
import moment from "moment";
function OrderSuccess() {
  const router = useRouter();
  const cookies = new Cookies();
  const token = cookies.get("loginToken");
  const [payloadData, setPayloadData] = useState();
  const [messageData, setMessageData] = useState("");
  const [dataCode, setDataCode] = useState(null);
  //http://localhost:3000/payment-success?subscriptionName=ZLite-Discover-Discovery&planName=Discovery&recurringChanges=Rs.1.18&nextBillingDate=14%2F02%2F2023&transactionID=pay_L42cBdm0CKPkHZ&invoiceNumber=INV-Zlite000015&paymentNumber=2&invoiceAmount=Rs.1.18&hostedpage_id=2-7ffed558adb63333074f4fb6a99f1cc12b7a85d634e2f747b56b11648a4908ca475f3dd0e734bdc3f7ace535ff234285
  //http://localhost:3000/payment-success?subscriptionName=ZLite-Discover-Discovery&planName=Discovery&recurringChanges=Rs.1.18&nextBillingDate=14%2F02%2F2023&transactionID=pay_L42cBdm0CKPkHZ&invoiceNumber=INV-Zlite000015&paymentNumber=2&invoiceAmount=Rs.1.18&hostedpage_id=2-7ffed558adb63333074f4fb6a99f1cc12b7a85d634e2f747b56b11648a4908ca475f3dd0e734bdc3f7ace535ff234285
  //http://localhost:3000/payment-success?subscriptionName=ZLite-Discover-Discovery&planName=Discovery&recurringChanges=Rs.1.18&nextBillingDate=16%2F02%2F2023&transactionID=pay_L4oom2Vlt1yps2&invoiceNumber=INV-Zlite000025&paymentNumber=3&invoiceAmount=Rs.1.18&hostedpage_id=2-7ffed558adb63333074f4fb6a99f1cc1df19483992284a74b6a163593bbdac2d6a6fc767071c9b88f7ace535ff234285
  useEffect(() => {
    if (router.query.planName) {
      (async () => {
        const dnew = new Date(
          router.query.nextBillingDate
        ).toLocaleDateString();

//   const myMomentObject = moment(, "DD-MM-YYYY");
//         const dateformat = moment(myMomentObject).format("DD-MM-YYYY");
        
        const payload = {
          hostedpage_id: router.query.hostedpage_id,
          subscriptionName: router.query.subscriptionName,
          planName: router.query.planName,
          recurringChanges: router.query.recurringChanges,
          nextBillingDate: router.query.nextBillingDate,
          transactionID: router.query.transactionID,
          invoiceNumber: router.query.invoiceNumber,
          paymentNumber: router.query.paymentNumber,
          invoiceAmount: router.query.invoiceAmount,
        };
        console.log(payload);

        let data = await fetch(`/api/addPayment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        });
        let res = await data.json();
        console.log(res);
        setDataCode(res?.data?.code);

        if (res?.data?.code === 200) {
          setMessageData(res?.data?.message);
          cookies.set("_id", res?.data?.data?._id);
          cookies.set("phone", res?.data?.data?.phoneNumber);
          cookies.set("email", res?.data?.data?.email);
          cookies.set("is_subscribed", true);
          cookies.set("isActive", res?.data?.data?.isActive);
          cookies.set("subscrition_id", res?.data?.data?.subscriptionId);
          cookies.set("expiryDate", res?.data?.data?.expiryDate);
          message.success(res?.data?.message);
          setTimeout(() => router.push("/store-management"), 5000);
        } else {
          message.error(res?.data?.message);
          setMessageData(res?.data?.message);
        }
      })();
    }
  }, [router.query.planName]);

  console.log(router.query.subscriptionName);
  return (
    <div className={styles.container}>
      <h3 className={styles.thank_you_text}>
        {dataCode === 200 ? (
          <>
            <div className={styles.img_wrapper}>
              <Image src={successimg} height={200} width={200} alt="" />
            </div>
            <b>Thank You!</b>
            &nbsp; {messageData}
          </>
        ) : (
          <>
            <div className={styles.img_wrapper}>
              <Image src={errorimg} height={200} width={200} alt="" />
            </div>
            <b>Oops...</b> {messageData}
          </>
        )}
      </h3>
    </div>
  );
}

export default OrderSuccess;

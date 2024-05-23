import React, {useEffect} from "react";
import AddTestimonial from "../../components/add-testimonial";
import AddClient from "../../components/add-client";
import AddAward from "../../components/add-award";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import axios from "axios";
import { baseUrl } from "../../util/baseUrl";
export default function AdditionalInfo() {
  const cookies = new Cookies();
  const token = cookies.get("loginToken");
  const router = useRouter();

  useEffect(() => {
    checkUserData();
  }, []);

  const checkUserData = async () => {
    let subData = await axios.get(`${baseUrl}get-user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let expiryTimeStamp = "";
    if (subData.data.code === 200) {
      let {isSubscribed, subscriptionId, expiryDate} = subData.data.data;
      let res = expiryDate ? await checkExpire(expiryDate) : false;
      if (isSubscribed === false) {
        Auth.removeToken();
        window.open("/login","_self");
      }else if(res === true){
        window.open("/subscription-plan","_self");
      }else{

      }
    }
  };

  const checkExpire = (expireDate) => {
    const eDate = expireDate?.split("T")[0];
    let one_day = 1000 * 60 * 60 * 24;
    let expiryDate_ = new Date(eDate);
    const currDate = new Date();
    const diffDay =
      Math.round(expiryDate_.getTime() - currDate.getTime()) / one_day;
    if (diffDay > 0) {
      return false;
    } else {
      return true;
    }
  };
  
  return (
    <>
      {/* <h1>Additional Information</h1> */}
      <AddClient />
      <AddAward />
      <AddTestimonial />
    </>
  );
}

import React from "react";
import Image from "next/image";
import cartLogo from "../../assets/images/zlite-logo.png";
import qrCode from "../../assets/images/qrcode.svg"
import styles from "../footer/styles.module.css";

const Footer = (props) => {
  return (
    <>
      <div className={styles.footer_section}>
        <div className={styles.powered_by}>
            <div><u>Powered by:</u></div>&nbsp;&nbsp;
            <div>
                <Image src={cartLogo} height={20} width={125} alt="logo" />
            </div>&nbsp;&nbsp;
            <div className={styles.qrcode_img}>
                <Image src={props.qrCode} height={45} width={45} alt="qrcode" />
            </div>
        </div>
        <div className={styles.copyright}>{"©Delcapers"  + "- All Rights Reserved"}</div>
      </div>
    </>
  );
};

export default Footer;

/* eslint-disable @next/next/no-html-link-for-pages */
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import style from "./MasterLayout.module.css";
import { React, useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Drawer } from "antd";
import logo from "../../assets/images/Vector.svg";
import logo2 from "../../assets/images/zlite-logo.png";
import storeManage from "../../assets/images/store-manage.svg";
import storeGallery from "../../assets/images/store-gallery.svg";
import rating from "../../assets/images/rating.svg";
import additionalInfo from "../../assets/images/additional-info.svg";
import z from "../../assets/images/z.svg";
import l from "../../assets/images/l.svg";
import i from "../../assets/images/i.svg";
import t from "../../assets/images/t.svg";
import e from "../../assets/images/e.svg";
import user from "../../assets/images/user_.png";
import menuIcon from "../../assets/images/menu.png";
import Auth from "../../util/auth";
import Cookies from "universal-cookie";
import Link from "next/link";

import { useRouter } from "next/router";

const { Header, Content, Sider, Footer } = Layout;
export default function MasterLayout(props) {
  const router = useRouter();
  const [pageTitle, setPageTitle] = useState("Store Management");
  const [phnNo, setphnNo] = useState("");
  const [email, setEmail] = useState("");
  const [superAdmin, setSuperAdmin] = useState("");
  const sideBarData = [
    { route: "store-management", imgSrc: storeManage, key: "1" },
    { route: "store-gallery", imgSrc: storeGallery, key: "2" },
    { route: "rating-review", imgSrc: rating, key: "3" },
    { route: "additional-information", imgSrc: additionalInfo, key: "4" },
  ];
  const sideBarDataAdmin = [
    { route: "admin-user", imgSrc: additionalInfo, key: "1" },
  ];
  const [storeId, setStoreId] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const cookies = new Cookies();
  const [selectedSideItem, setSelectedSideItem] = useState("");
  const [subscritionId, setSubscritionId] = useState("null");

  // useEffect(() => {
  //   const token = cookies.get("loginToken");
  //   if(token === undefined){
  //     router.push("/login");
  //   }
  // },[]);

  useEffect(() => {
    const phoneNo = cookies.get("phone");
    const emailId = cookies.get("email");
    const storeid = cookies.get("storeid");
    const superadmin = cookies.get("superadmin");
    const subscritionid = cookies.get("subscrition_id");
    setEmail(emailId);
    setphnNo(phoneNo);
    setStoreId(storeid);
    setSuperAdmin(superadmin);
    setSubscritionId(subscritionid ? subscritionid : "null");
    let url = router.pathname.split("/")[1];
    if (url == "subscription-plan") {
      setSelectedSideItem("");
    } else if (url == "admin-user") {
      setSelectedSideItem("");
    } else if (url == "subscription-data") {
      setSelectedSideItem("");
    }else {
      let temp = sideBarData.find((e) => e.route == url);
      setSelectedSideItem(temp ? temp.key : "4");
    }
    if (url == "store-management") {
      setSelectedSideItem("1");
    }
  }, [router.pathname]);
  const logout = () => {
    Auth.removeToken();
    // router.push("/");
    window.open("/login","_self");
  };
  const menu = (
    <Menu className={style.nav_menu_item}>
      {superAdmin == "true" ? (
        ""
      ) : (
        <Menu.Item key="1">
          <Link href="/subscription-plan">My Subscription</Link>
        </Menu.Item>
      )}
      {superAdmin == "true" ? "" : <Menu.Divider></Menu.Divider>}
      <Menu.Item key="2" onClick={() => logout()}>
        {/* <a href="/login"> */}
        <span className={style.logout_text}>Logout</span>
        {/* </a> */}
      </Menu.Item>
    </Menu>
  );
  const sidebarClicked = (e) => {
    setSelectedSideItem(e.key);
    setPageTitle(e.route.split("-").join(" "));
    router.push(`/${e.route}`);
    setOpenDrawer(false);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };
  const sideBarItems = () => {
    return (
      <>
        <div className="m-5">
          <Image src={logo2} alt="Logo" />
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[selectedSideItem]}>
          {sideBarData?.map((e) => (
            <Menu.Item key={e.key} onClick={() => sidebarClicked(e)}>
              <Image
                src={e.imgSrc}
                alt={e.title}
                objectFit={"contain"}
                width={"15px"}
                height={"15px"}
                className={style.sidebar_img}
              />
              <span className={style.sidebar_title}>
                {e.route.split("-").join(" ")}
              </span>
            </Menu.Item>
          ))}
        </Menu>
      </>
    );
  };
  return (
    <div className={styles.container}>
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          // className={
          //   router.pathname === "/subscription-plan"
          //     ? "sider " + style.disable_ms
          //     : "sider"
          // }
          className={
            subscritionId == "null" ||
            (subscritionId == "undefined" &&
              router.pathname === "/subscription-plan" || router.pathname === "/subscription-data")
              ? "sider " + style.disable_ms
              : "sider"
          }
          width="232"
          style={{
            height: "100vh",
            position: "sticky",
            top: 0,
            left: 0,
            background: "#001B39",
            zIndex: 2,
          }}
        >
          {sideBarItems()}
        </Sider>
        <Layout>
          <Header
            className={`site-layout-sub-header-background d-flex space-between-logo ${style.admin_navbar}`}
          >
            <div className="d-flex" style={{ paddingLeft: "0.5rem" }}>
              {/* <div
              className={
                (subscritionId == "null" && router.pathname === "/subscription-plan")
                  ? "menu-icon-wrapper " + style.disable_ms_mobile
                  : "menu-icon-wrapper cursor"
              }
            > */}
              <div
                className={
                  subscritionId == "null" ||
                  (subscritionId == "undefined" &&
                    router.pathname === "/subscription-plan")
                    ? "d-flex align-center ham-burger " +
                      style.disable_ms_mobile
                    : "d-flex align-center ham-burger cursor"
                }
              >
                <Image
                  src={menuIcon}
                  alt="Logo"
                  width={25}
                  height={25}
                  onClick={() => setOpenDrawer(true)}
                  objectFit="contain"
                />
              </div>
              {/* </div> */}
              <div
                style={{ alignSelf: "center", paddingLeft: "0.7rem" }}
                className="logo-display-nav"
              >
                <Image src={logo} alt="Logo" width={35} height={35} />
                <div
                  className="d-flex space-between"
                  style={{ marginTop: "-1.5rem" }}
                >
                  <Image src={z} alt="z" width={8} height={8} />
                  <Image src={l} alt="l" width={8} height={8} />
                  <Image src={i} alt="i" width={8} height={8} />
                  <Image src={t} alt="t" width={8} height={8} />
                  <Image src={e} alt="e" width={8} height={8} />
                </div>
              </div>
            </div>
            <div className="d-flex">
              <Dropdown
                overlay={menu}
                overlayClassName={style.profile_overlay_dropdown}
              >
                <Image
                  src={user}
                  alt="user"
                  className={style.header_img}
                  role="button"
                />
              </Dropdown>
              <span className="color-white plr-2">
                {phnNo
                  ? `+91-${phnNo.substring(0, 3) + "****" + phnNo.substring(7)}`
                  : email}
              </span>
            </div>
          </Header>
          <Drawer
            placement="left"
            closable={false}
            onClose={onClose}
            open={openDrawer}
            key={1}
            id="sidebar-drawer"
            width="280px"
            bodyStyle={{ background: "#001B39", padding: "0px" }}
          >
            {sideBarItems()}
          </Drawer>
          <Content
            style={{
              margin: "0% 4%",
            }}
          >
            {/* <div
              className={
                (subscritionId == "null" && router.pathname === "/subscription-plan")
                  ? "menu-icon-wrapper " + style.disable_ms_mobile
                  : "menu-icon-wrapper cursor"
              }
            >
              <Image
                src={menuIcon}
                alt="Logo"
                width={20}
                height={20}
                onClick={() => setOpenDrawer(true)}
              />
            </div> */}
            <p
              level={4}
              className={`mt-2 ml-store-title ${style.heading_subscription}`}
            >
              {router.pathname === "/new-testimonial/[testimonialData]"
                ? router.pathname.substring(1).split("-").join(" ").slice(0, 15)
                : router.pathname.substring(1).split("-").join(" ")}
            </p>
            <div className={style.site_layout_background}>{props.content}</div>
          </Content>

          <Footer className={style.admin_footer}>Copyright © 2022.</Footer>
        </Layout>
      </Layout>
    </div>
  );
}

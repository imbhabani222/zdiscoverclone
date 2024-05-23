/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Col, Row, Button, Modal, Divider } from "antd";
import "antd/dist/antd.css";
import Image from "next/image";
import styles from "../contactUs/styles.module.css";
import googleMap from "../../assets/images/inida-google-map.jpg";
import modalGoogleMap from "../../assets/images/modalMap.svg";
import redArrow from "../../assets/images/redArrow.svg";
import contactCall from "../../assets/images/contactCall.svg";
import contactMail from "../../assets/images/contactMail.svg";
import contactLocation from "../../assets/images/contantLocation.svg";
import contactBrowser from "../../assets/images/contantBrowser.svg";
import Geocode from "react-geocode";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const Contactus = (props) => {
  const [open, setOpen] = useState(false);
  const style_ = {
    textColor: {
      color: props.themeColor,
    },
    bgColor: {
      background: props.themeColor,
    },
  };
  const contactAdd = `${props.address[0]?.name},${props.address[0]?.city},${props.address[0]?.state},${props.address[0]?.pincode}`;
  const contactAdd2 =
    "https://www.google.com/maps/search/?api=1&query=" +
    props.address[0]?.latitude +
    "," +
    props.address[0]?.longitude;

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div className={styles.section_wrapper}>
      <div className={styles.section_content_wrapper}>
        <Row gutter={[48, 40]}>
          <Col xs={24} sm={24} md={10} lg={10} xl={10}>
            <h1 className={styles.section_heading}>Contact us</h1>

            {props.socialLink.mobNo && props.socialLink.mobNo !== "" ? (
              <div className={styles.contact_line_style}>
                <div style={{ width: "8%" }}>
                  <div
                    className={styles.section_icon_wrapper}
                    style={style_.bgColor}
                  >
                    <Image {...contactCall} alt="alt" width={15} height={15} />
                  </div>
                </div>
                <div style={{ width: "1%" }}></div>
                <div style={{ width: "90%" }}>
                  <a href={`tel:${props.socialLink.mobNo}`}>
                    <div
                      className={styles.section_modal_link}
                      //style={style_.textColor}
                    >
                      <span> {props.socialLink.mobNo}</span>
                    </div>
                  </a>
                </div>
              </div>
            ) : (
              ""
            )}
            {props.socialLink.email && props.socialLink.email !== "" ? (
              <div className={styles.contact_line_style}>
                <div style={{ width: "8%" }}>
                  <div
                    className={styles.section_icon_wrapper}
                    style={style_.bgColor}
                  >
                    <Image {...contactMail} alt="alt" width={15} height={15} />
                  </div>
                </div>
                <div style={{ width: "1%" }}></div>
                <div style={{ width: "90%" }}>
                  <a href={`mailto:${props.socialLink.email}`}>
                    <div
                      className={styles.section_modal_link}
                      // style={style_.textColor}
                    >
                      <span> {props.socialLink.email}</span>
                    </div>
                  </a>
                </div>
              </div>
            ) : (
              ""
            )}
            {props.webUrl && props.webUrl !== "" ? (
              <div className={styles.contact_line_style}>
                <div style={{ width: "8%" }}>
                  <div
                    className={styles.section_icon_wrapper}
                    style={style_.bgColor}
                  >
                    <Image
                      {...contactBrowser}
                      alt="alt"
                      width={15}
                      height={15}
                    />
                  </div>
                </div>
                <div style={{ width: "1%" }}></div>
                <div style={{ width: "90%" }}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://${props.webUrl}`}
                  >
                    <div
                      className={styles.section_modal_link}
                      //style={style_.textColor}
                    >
                      <span> {props.webUrl}</span>
                    </div>
                  </a>
                </div>
              </div>
            ) : (
              ""
            )}
            {contactAdd && contactAdd !== "" && contactAdd !== ",,," ? (
              <div className={styles.contact_line_style}>
                <div style={{ width: "8%" }}>
                  <div
                    className={styles.section_icon_wrapper}
                    style={style_.bgColor}
                  >
                    <Image
                      {...contactLocation}
                      alt="alt"
                      width={15}
                      height={15}
                    />
                  </div>
                </div>
                <div style={{ width: "1%" }}></div>
                <div style={{ width: "90%" }}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={contactAdd2}
                  >
                    <div
                      className={styles.section_modal_link}
                      //style={style_.textColor}
                    >
                      <div style={{ lineHeight: "1.5" }}>
                        {" "}
                        {props.address[0]?.storeName +
                          ", " +
                          props.address[0]?.addressline1 +
                          ", " +
                          props.address[0]?.addressline2 +
                          ", " +
                          contactAdd}
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            ) : (
              ""
            )}

            {props.address.length > 1 ? (
              <div
                type="text"
                onClick={showModal}
                className={styles.section_contact_link}
                style={style_.textColor}
              >
                <span>View More Locations </span>
                <div>
                  {" "}
                  <svg
                    width="7"
                    height="12"
                    viewBox="0 0 7 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 11L6 6L1 1"
                      stroke={props.themeColor}
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  {/* <Image {...redArrow} alt="alt" /> */}
                </div>
              </div>
            ) : (
              ""
            )}

            <Modal
              className={styles.section_modal}
              open={open}
              title="Store Locations"
              onOk={handleOk}
              onCancel={handleCancel}
              width={1027}
              bodyStyle={{ top: "70px" }}
              footer={[]}
            >
              <Row gutter={[16, 16]}>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  className={styles.section_left_col}
                >
                  {props.address.map((elem) => (
                    <div key={elem.id}>
                      <div className={styles.section_modal_name}>
                        {elem.storeName}
                      </div>
                      <div className={styles.section_modal_address}>
                        {elem.addressline1 +
                          ", " +
                          elem.addressline2 +
                          ", " +
                          elem?.name +
                          ", " +
                          elem?.city +
                          ", " +
                          elem?.state +
                          ", " +
                          elem?.pincode}
                      </div>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          "https://www.google.com/maps/search/?api=1&query=" +
                          elem?.latitude +
                          "," +
                          elem?.longitude
                        }
                      >
                        <div
                          className={styles.section_modal_link}
                          //style={style_.textColor}
                        >
                          <div> Get Store Direction</div>
                          <div>
                            <svg
                              width="7"
                              height="12"
                              viewBox="0 0 7 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 11L6 6L1 1"
                                stroke={props.themeColor}
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <Divider />
                    </div>
                  ))}
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  className={styles.section_modal_map}
                >
                  <Places
                    geoLoc={{
                      lat: props.address[0]?.latitude,
                      lng: props.address[0]?.longitude,
                    }}
                    geoAddress={props.address}
                  />
                </Col>
              </Row>
            </Modal>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={14}
            lg={14}
            xl={14}
            className={styles.right_side_col}
          >
            <div className={styles.right_side}>
              {/* <Image {...googleMap} alt="storelocation" /> */}
              <Places
                geoLoc={{
                  lat: props.address[0]?.latitude,
                  lng: props.address[0]?.longitude,
                }}
                geoAddress={props.address}
              />
              {contactAdd !== "" && contactAdd !== ",,," ? (
                <Button
                  className={styles.section_contact_btn}
                  style={style_.bgColor}
                  htmlType="submit"
                >
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={
                      "https://www.google.com/maps/search/?api=1&query=" +
                      props.address[0]?.latitude +
                      "," +
                      props.address[0]?.longitude
                    }
                  >
                    Get Directions
                  </a>
                </Button>
              ) : (
                ""
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const Places = ({ setDetailsHandler, geoLoc, geoAddress }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();
  const [selected, setSelected] = useState(geoLoc);
  const [selected2, setSelected2] = useState({
    lat: 13.0032681,
    lng: 77.7128353,
  });

  // useEffect(() => {
  //   //console.log(selected);
  // }, [selected]);

  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCsvXDft5BRwE1TiqtbFHyX2xoKWE3EC1c",
    libraries: ["places"],
  });

  useEffect(() => {
    // Geocode.setApiKey("AIzaSyCsvXDft5BRwE1TiqtbFHyX2xoKWE3EC1c");
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  const center = {
    lat: selected?.lat || 20.94092,
    lng: selected?.lng || 84.803467,
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    const results = await getGeocode({ address });
    if (ready) {
      const { place_id } = data[0];
      const place = await getGeocode({ placeId: place_id });
      setDetailsHandler(place[0]);
    }

    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
    localStorage.setItem("latLng", JSON.stringify({ lat, lng }));
  };

  const onMapClick = async (id) => {
    try {
      const { placeId } = id;
      const place = await getGeocode({ placeId });
      const address = await place[0].formatted_address;
      setDetailsHandler(place[0]);

      const result = await getGeocode({ address });
      const { lat, lng } = await getLatLng(result[0]);
      setSelected({ lat, lng });
    } catch (err) {
      console.log(err);
    }
  };

  const onDragEndFunction = async (e) => {
    //console.log(e, "values");
    try {
      const { latLng } = e;
      const lat = latLng.lat();
      const lng = latLng.lng();
      const latLngProps = {
        lat,
        lng,
      };
      const check = await Geocode.fromLatLng(lat.toString(), lng.toString());
      const data = await check?.results;
      const place = await getGeocode({ placeId: data[0].place_id });
      setDetailsHandler(place[0]);

      setSelected({ lat, lng });
    } catch (err) {
      console.log("err");
    }
  };

  return (
    <>
      {isLoaded ? (
        <div
          style={{ border: "10px solid #F1F1F1", backgroundColor: "#F1F1F1" }}
        >
          <div className="places-container">
            <Combobox onSelect={handleSelect}>
              <ComboboxPopover>
                <ComboboxList>
                  {status === "OK" &&
                    data.map(({ place_id, description }) => (
                      <ComboboxOption key={place_id} value={description} />
                    ))}
                </ComboboxList>
              </ComboboxPopover>
            </Combobox>
          </div>

          <GoogleMap
            zoom={4}
            center={center}
            mapContainerClassName={styles.map_container}
            // onClick={onMapClick}
          >
            {geoAddress.map((item) => (
              <MarkerF
                draggable={false}
                onDragEnd={(e) => onDragEndFunction(e)}
                position={{ lat: item.latitude, lng: item.longitude }}
              />
            ))}
          </GoogleMap>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Contactus;

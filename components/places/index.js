import { React, useState, useEffect } from "react";
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
import style from "../../pages/store-management/storeManagement.module.css";
const Places = ({ setDetailsHandler }) => {
    const {
      ready,
      value,
      setValue,
      suggestions: { status, data },
      clearSuggestions,
    } = usePlacesAutocomplete();
  
    const [selected, setSelected] = useState(null);
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
      console.log(address);
      clearSuggestions();
      const results = await getGeocode({ address });
      console.log(results[0]);
      const { lat, lng } = await getLatLng(results[0]);
      setSelected({ lat, lng });
      localStorage.setItem("latLng", JSON.stringify({ lat, lng }));
      if (ready) {
        const { place_id } = data[0];
        const place = await getGeocode({ placeId: place_id });
        // console.log(place)
        setDetailsHandler(results[0], lat, lng);
      }
  
      
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
      {isLoaded ? 
        <div style={{ border: "10px solid #F1F1F1", backgroundColor: "#F1F1F1" }}>
        <div className="places-container">
          <Combobox onSelect={handleSelect}>
            <ComboboxInput
              style={{
                // border: '1px solid red',
                // position: 'absolute',
                zIndex: "900000",
                width: "100%",
                // margin: '70px 20px',
                padding: "5px 10px",
                // borderRadius: '5px',
                outline: "none",
                background: "#fff",
                // padding: '5px',
                border: "2px solid rgba(0, 0, 0, 0.06)",
              }}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={!ready}
              placeholder="Search an address"
            />
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
          zoom={selected === null ? 4 : 20}
          center={center}
          mapContainerClassName={style.map_container}
          onClick={onMapClick}
        >
          <MarkerF
            draggable={true}
            onDragEnd={(e) => onDragEndFunction(e)}
            position={selected}
          />
        </GoogleMap>
      </div> : ""}
      </>
    );
  };

  export default Places;
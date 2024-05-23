import React, { useEffect } from "react";
import { useRouter } from "next/router";
/* eslint-disable camelcase */
import Cookies from "universal-cookie";
import Auth from "../util/auth";

export default function Home() {
  const router = useRouter();
  const cookies = new Cookies();

  const data = router.asPath;

  let result = data.replace("#accessToken", "accessToken");
  const tokens = Object.assign(
    {},
    ...result
      .substr(1)
      .split("&")
      .map((item) => ({
        [item.split("=")[0]]: item.split("=")[1],
      }))
  );
  useEffect(() => {
    if (tokens?.accessToken) {
      cookies.set("token", tokens?.accessToken, {
        path: "/",
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
      });
      router.push("/login");
    } else {
      router.push("/login");
    }
  }, [tokens?.accessToken]);

  useEffect(() => {
    router.push("/login");
  });

  useEffect(() => {
    const { pathname } = router;

    if (pathname !== pathname.toLowerCase()) {
      router.push(pathname.toLowerCase());
    }
  }, [router]);
}

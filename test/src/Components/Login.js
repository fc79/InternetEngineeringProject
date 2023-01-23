import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import styles from "./Login.module.css";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Login = function () {
  const [isSubmited, setIsSubmited] = useState(false);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      console.log("ggggggggggg", values.password);
      setData({
        username: values.username,
        password: values.password,
      });
      const back = JSON.stringify(data);
      axios
        .post("http://127.0.0.1:8000/login/", back, {
          headers: { "content-type": "application/json" },
        })
        .then(function (response) {
          console.log(response);
          //console.log(response.status);
          if (response.statusText === "OK") {
            //console.log(response.data.tokens['refresh'])

            Cookies.set("userId", response.data.id);

            navigate("/Chat");

            //console.log(response);
          } else {
            console.log(response);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  });
  //   useEffect(() => {
  //     if (isSubmited) {
  //        axios({
  //         method: 'POST',
  //         url: loginUrl,
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         data: data,
  //       })
  //         .then((res) => {
  //           if (res.status === 200) {
  //             dispatch(authActions.login({
  //               accessToken: res.data.access,
  //               refreshToken: res.data.refresh,
  //             }));
  //history.push("/Chat");

  //           }
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   }, [isSubmited, data, dispatch, navigate, loginUrl]);

  return (
    <main className={styles.auth}>
      <section>
        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <div className={styles.control}>
            <label htmlFor="username">Username</label>
            <input
              type="username"
              id="username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
          </div>
          <div className={styles.control}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
      </section>
    </main>
  );
};
export default Login;

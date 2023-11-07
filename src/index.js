import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CookieConsent from "react-cookie-consent";
import {NextUIProvider} from "@nextui-org/react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      cookieName="TechcastHaveBigDick"
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
      expires={150}
    >
      This website uses cookies to make you be slave of AI forever, If you are not stupid enough just ignore this and don't press the button.{" "}
      <span style={{ fontSize: "10px" }}>เงี่ยนนนน โว้ยยย เงี่ยนนนน</span>
    </CookieConsent>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </React.StrictMode>
);

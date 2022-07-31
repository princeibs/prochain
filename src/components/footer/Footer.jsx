import React from "react";
import "./footer.css";
import image from "../../assets/image.jpg";
const Footer = () => {
  return (
    <div className="footer section__padding">
      <img src={image} alt="logo" />
      <p>Track your goods on the blockchain today!</p>
    </div>
  );
};

export default Footer;

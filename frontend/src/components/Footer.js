import React from "react";

function Footer() {

  const newYearAuto = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer__copyright">©&nbsp;{newYearAuto} Mesto Russia</p>
    </footer>
  );
}

export default Footer;

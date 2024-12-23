import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="mb-0 text-center">
        <div className="d-flex align-items-center justify-content-center pb-5">
          <div className="col-md-6">
            <p className="mb-3 mb-md-0">
              Made with ❤️ by {" "}
              <a
                href="https://github.com/ahmedshawky7"
                className="text-decoration-underline text-dark fs-5"
                target="_blank"
                rel="noreferrer"
              >
                Ahmed
              </a>
              ,{" "}
              <a
                href="https://github.com/ashraf01012"
                className="text-decoration-underline text-dark fs-5"
                target="_blank"
                rel="noreferrer"
              >
                Ashraf
              </a>
              , and{" "}
              <a
                href="https://github.com/omarhefnawy"
                className="text-decoration-underline text-dark fs-5"
                target="_blank"
                rel="noreferrer"
              >
                Omar
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

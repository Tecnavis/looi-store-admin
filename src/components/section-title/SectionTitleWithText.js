import PropTypes from "prop-types";
import clsx from "clsx";

const SectionTitleWithText = ({ spaceTopClass, spaceBottomClass }) => {
  return (
    <div className={clsx("welcome-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="welcome-content text-center">
          <h5>Who Are We</h5>
          <h1>Welcome To Looi</h1>
          <p>
          Looi Clothing Store is more than just a fashion destination; it’s a brand committed to blending style, comfort, and quality to help you express yourself with confidence. At Looi, we believe that fashion should be both beautiful and functional, which is why our collections are crafted with attention to detail and a focus on timeless elegance and modern aesthetics.{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

SectionTitleWithText.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default SectionTitleWithText;

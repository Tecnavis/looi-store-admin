

// ------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axiosInstance from '../../config/axiosconfig'; // Adjust path as needed
import { BASE_URL} from '../../config/baseurlconfig';
import { getImageUrl } from "../../utils/imageUrl";

const HeroSliderTenSingle = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axiosInstance.get('/get-allbanner');
      if (response.data.success && response.data.banners.length > 0) {
        setBanners(response.data.banners);
      } else {
        setError('No banners found');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [banners.length]);

  if (loading) {
    return <div className="slider-height-5 d-flex align-items-center justify-content-center">
      Loading banners...
    </div>;
  }

  if (error) {
    return <div className="slider-height-5 d-flex align-items-center justify-content-center">
      {error}
    </div>;
  }

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentBannerIndex];
  const imageUrl = getImageUrl(currentBanner.images[0]);

  return (
    <div
      className="single-slider-3 slider-height-5 d-flex align-items-center bg-img ms-3 me-3"
      style={{ 
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
     
    </div>
  );
};

HeroSliderTenSingle.propTypes = {
  data: PropTypes.shape({})
};

export default HeroSliderTenSingle;


// ------------------------------------------------------------------


// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import axiosInstance from '../../config/axiosconfig'; // Adjust path as needed
// import '../../../src/wrappers/product/styles/HeroSliderTenSingle.css';

// const HeroSliderTenSingle = () => {
//   const [banners, setBanners] = useState([]);
//   const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   const fetchBanners = async () => {
//     try {
//       const response = await axiosInstance.get('/get-allbanner');
//       if (response.data.success && response.data.banners.length > 0) {
//         setBanners(response.data.banners);
//       } else {
//         setError('No banners found');
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || 'Error fetching banners');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (banners.length > 1) {
//       const timer = setInterval(() => {
//         setCurrentBannerIndex((prevIndex) => 
//           prevIndex === banners.length - 1 ? 0 : prevIndex + 1
//         );
//       }, 5000);

//       return () => clearInterval(timer);
//     }
//   }, [banners.length]);

//   if (loading) {
//     return <div className="slider-height-5 d-flex align-items-center justify-content-center">
//       Loading banners...
//     </div>;
//   }

//   if (error) {
//     return <div className="slider-height-5 d-flex align-items-center justify-content-center">
//       {error}
//     </div>;
//   }

//   if (banners.length === 0) {
//     return null;
//   }

//   const currentBanner = banners[currentBannerIndex];
//   const imageUrl = `http://localhost:8000/uploads/${currentBanner.images[0]);

//   return (
//     <div
//       className="single-slider-3 slider-height-5 d-flex align-items-center bg-img ms-3 me-3"
//       style={{ 
//         backgroundImage: `url(${imageUrl})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}
//     >
//       {/* Optional: Add content on top of the banner if needed */}
//     </div>
//   );
// };

// HeroSliderTenSingle.propTypes = {
//   data: PropTypes.shape({})
// };

// export default HeroSliderTenSingle;
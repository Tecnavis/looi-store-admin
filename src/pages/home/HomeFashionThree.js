// import React, { Fragment } from "react";
// import SEO from "../../components/seo";
// import LayoutOne from "../../layouts/LayoutOne";
// import FeatureIconTwo from "../../wrappers/feature-icon/FeatureIconTwo";
// import BlogFeatured from "../../wrappers/blog-featured/BlogFeatured";
// import HeroSliderTen from "../../wrappers/hero-slider/HeroSliderTen";
// import NewProductGrid from "../../wrappers/product/NewProductGrid";
// import TreadingGrid from "../../wrappers/product/TreadingGrid";
// import NewArrival from "../../wrappers/product/NewArrival";
// import TopRated from "../../wrappers/product/TopRated";
// import CategoryGrid from "../../wrappers/product/CategoryGrid";
// import TopSelling from "../../wrappers/product/TopSelling";
// import BestSellers from "../../wrappers/product/BestSellers";

// const HomeFashionThree = () => {
//   return (
//     <Fragment>
//       <SEO
//         titleTemplate="LOOI"
       
//       />
//       <LayoutOne
//         headerContainerClass="container-fluid"
//         headerPaddingClass="header-padding-2"
//         headerTop="visible"
//       >
//         {/* hero slider */}
//         <HeroSliderTen  />
       
//         {/* <NewProductGrid category="accessories" limit={10}   /> */}
//         <BestSellers/>
//         {/* <TreadingGrid/> */}
//         <CategoryGrid/>
//         <NewArrival/>
//         {/* <TopRated/> */}
        
//        {/* <TopSelling/> */}
//       </LayoutOne>
//     </Fragment>
//   );
// };

// export default HomeFashionThree;


import React, { useState, useEffect, Fragment } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import HeroSliderTen from "../../wrappers/hero-slider/HeroSliderTen";
import NewArrival from "../../wrappers/product/NewArrival";
import BestSellers from "../../wrappers/product/BestSellers";
import CategoryGrid from "../../wrappers/product/CategoryGrid";

const HomeFashionThree = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    setTimeout(() => {
      setLoading(false);
    }, 3000); // adjust the delay as needed
  }, []);

  return (
    <Fragment>
      <SEO titleTemplate="LOOI" />
      <LayoutOne
        headerContainerClass="container-fluid"
        headerPaddingClass="header-padding-2"
        headerTop="visible"
      >
        {/* Hero Slider */}
        {loading ? (
          <Skeleton height={400} />
        ) : (
          <HeroSliderTen />
        )}

        {/* Best Sellers Section */}
        {loading ? (
          <Skeleton height={300} count={1} />
        ) : (
          <BestSellers />
        )}

        {/* Category Grid Section */}
        {loading ? (
          <Skeleton height={300} count={1} />
        ) : (
          <CategoryGrid />
        )}

        {/* New Arrivals Section */}
        {loading ? (
          <Skeleton height={300} count={1} />
        ) : (
          <NewArrival />
        )}
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFashionThree;




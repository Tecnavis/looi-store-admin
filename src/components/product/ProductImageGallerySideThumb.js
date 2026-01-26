// import { Fragment, useState } from "react";
// import PropTypes from "prop-types";
// import clsx from "clsx";
// import { EffectFade, Thumbs } from 'swiper';
// import AnotherLightbox from "yet-another-react-lightbox";
// import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
// import Zoom from "yet-another-react-lightbox/plugins/zoom";
// import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
// import Swiper, { SwiperSlide } from "../../components/swiper";
// import image1 from '../../assets/images/logo/product/10011.jpg';
// import image2 from '../../assets/images/logo/product/10084.jpg';

// const ProductImageGalleryLeftThumb = ({ product, thumbPosition }) => {
//   const [thumbsSwiper, setThumbsSwiper] = useState(null);
//   const [index, setIndex] = useState(-1);
//   const [currentIndex, setCurrentIndex] = useState(0); // State to track the currently displayed image

//   // Array of local images for the main gallery
//   const slides = [image1, image2].map((img, i) => ({
//     src: img,
//     key: i,
//   }));

//   // swiper slider settings
//   const gallerySwiperParams = {
//     spaceBetween: 10,
//     loop: true,
//     effect: "fade",
//     fadeEffect: {
//       crossFade: true
//     },
//     thumbs: { swiper: thumbsSwiper },
//     modules: [EffectFade, Thumbs],
//   };

//   const thumbnailSwiperParams = {
//     onSwiper: setThumbsSwiper,
//     spaceBetween: 10,
//     slidesPerView: 4,
//     touchRatio: 0.2,
//     loop: true,
//     slideToClickedSlide: true,
//     direction: "vertical",
//     breakpoints: {
//       320: {
//         slidesPerView: 4,
//         direction: "horizontal"
//       },
//       640: {
//         slidesPerView: 4,
//         direction: "horizontal"
//       },
//       768: {
//         slidesPerView: 4,
//         direction: "horizontal"
//       },
//       992: {
//         slidesPerView: 4,
//         direction: "horizontal"
//       },
//       1200: {
//         slidesPerView: 4,
//         direction: "vertical"
//       }
//     }
//   };

//   const handleThumbnailClick = (key) => {
//     setCurrentIndex(key); // Update the current index when a thumbnail is clicked
//     setIndex(key); // Open the lightbox with the selected image
//   };

//   return (
//     <Fragment>
//       <div className="row row-5 test">
//         {/* one product main image */}
//         <div
//           className={clsx(thumbPosition && thumbPosition === "left"
//               ? "col-xl-10 order-1 order-xl-2"
//               : "col-xl-10")}
//         >
//           <div className="product-large-image-wrapper">
//             {/* {product.discount || product.new ? (
//               <div className="product-img-badges">
//                 {product.discount ? (
//                   <span className="pink">-{product.discount}%</span>
//                 ) : (
//                   ""
//                 )}
//                 {product.new ? <span className="purple">New</span> : ""}
//               </div>
//             ) : (
//               ""
//             )} */}
//             {slides.length ? (
//               <Swiper options={gallerySwiperParams}>
//                 {slides.map((single, key) => (
//                   <SwiperSlide key={key}>
//                     <button className="lightgallery-button" onClick={() => handleThumbnailClick(key)}>
//                       <i className="pe-7s-expand1"></i>
//                     </button>
//                     <div className="single-image">
//                       <img
//                         src={single.src}
//                         className="img-fluid"
//                         alt=""
//                       />
//                     </div>
//                   </SwiperSlide>
//                 ))}
//                 <AnotherLightbox
//                     open={index >= 0}
//                     index={index}
//                     close={() => setIndex(-1)}
//                     slides={slides}
//                     plugins={[Thumbnails, Zoom, Fullscreen]}
//                 />
//               </Swiper>
//             ) : null}
//           </div>
//         </div>
//         <div
//           className={clsx(thumbPosition && thumbPosition === "left"
//               ? "col-xl-2 order-2 order-xl-1"
//               : "col-xl-2")}
//         >

//           {/* side sub 4 images */}
//           <div className="product-small-image-wrapper product-small-image-wrapper--side-thumb">
//             {slides.length ? (
//               <Swiper options={thumbnailSwiperParams}>
//                 {slides.map((single, key) => (
//                   <SwiperSlide key={key}>
//                     <div className="single-image" onClick={() => handleThumbnailClick(key)}>
//                       <img
//                         src={single.src}
//                         className="img-fluid"
//                         alt=""
//                       />
//                     </div>
//                   </SwiperSlide>
//                 ))}
//               </Swiper>
//             ) : null }
            
//           </div>
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// ProductImageGalleryLeftThumb.propTypes = {
//   product: PropTypes.shape({}),
//   thumbPosition: PropTypes.string
// };

// export default ProductImageGalleryLeftThumb;



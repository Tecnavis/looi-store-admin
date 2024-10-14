// import React from 'react'
// import { Link } from 'react-router-dom'

// const PaginationSection = ({currentPage,totalPages,paginate,pageNumbers}) => {
//   return (
//     <div className="table-bottom-control">
//         <div className="dataTables_info">Showing {currentPage} to {totalPages} of {totalPages}</div>
//          <div className="dataTables_paginate paging_simple_numbers">
//             <Link 
//             className={`btn btn-primary previous ${currentPage === 1 ? 'disabled' : ''}`}
//             role='button'
//             onClick={() => paginate(currentPage - 1)}
//             disabled={currentPage === 1}
//             >
//                 <i className="fa-light fa-angle-left"></i>
//             </Link>
//             {pageNumbers.map((number, index) => (
//             <span key={index}>
//                 <Link 
//                 className={`btn btn-primary ${currentPage === number ? 'current' : ''}`}
//                 role='button'
//                 onClick={() => paginate(number)}
//                 >{number}</Link>
//             </span>
//                 ))}
//             <Link 
//             className={`btn btn-primary next disabled ${currentPage === totalPages ? 'disabled' : ''}`}
//             role='button'
//             onClick={() => paginate(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             >
//                 <i className="fa-light fa-angle-right"></i>
//             </Link>
//         </div>
//     </div>    
//   )
// }

// export default PaginationSection

import React from 'react';

const PaginationSection = ({ currentPage, totalPages, paginate, pageNumbers }) => {
  return (
    <div className="table-bottom-control">
      {/* Showing range of items info */}
      <div className="dataTables_info">
        Showing page {currentPage} of {totalPages}
      </div>
      
      {/* Pagination Controls */}
      <div className="dataTables_paginate paging_simple_numbers">
        
        {/* Previous Button */}
        <button
          className={`btn btn-primary previous ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className="fa-light fa-angle-left"></i>
        </button>
        
        {/* Page Numbers */}
        {pageNumbers.map((number, index) => (
          <span key={index}>
            <button
              className={`btn btn-primary ${currentPage === number ? 'current' : ''}`}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          </span>
        ))}
        
        {/* Next Button */}
        <button
          className={`btn btn-primary next ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <i className="fa-light fa-angle-right"></i>
        </button>
      </div>
    </div>
  );
};

export default PaginationSection;

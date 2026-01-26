import React from 'react';

const ProductPagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      // Show first page, last page, and pages around current page
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - 2 || 
        i === currentPage + 2
      ) {
        pages.push('...');
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pro-pagination-style text-center mt-20">
      <ul className="flex items-center justify-center gap-2">
        <li>
          <button 
            className="prev px-4 py-2 rounded border disabled:opacity-50"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fa fa-angle-double-left" />
          </button>
        </li>
        
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-4 py-2">...</span>
            ) : (
              <button
                className={`px-4 py-2 rounded border ${
                  currentPage === page 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        <li>
          <button 
            className="next px-4 py-2 rounded border disabled:opacity-50"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="fa fa-angle-double-right" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProductPagination;
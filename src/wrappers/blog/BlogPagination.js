

const BlogPagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pro-pagination-style text-center mt-20">
      <ul>
        <li>
          <button 
            className="prev" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fa fa-angle-double-left" />
          </button>
        </li>
        {[...Array(totalPages)].map((_, index) => (
          <li key={index}>
            <button
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li>
          <button 
            className="next"
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
export default BlogPagination;

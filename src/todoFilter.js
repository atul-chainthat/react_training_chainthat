import React, { memo } from "react";

const TodoFilter = ({ applyFilter, filter }) => {
  console.log("TodoFilter");
  return (
    <div className="filter-button-wrapper">
      <button type="button" style={{ borderColor: filter === 'all' ? 'red' : 'transparent'}} onClick={() => applyFilter("all")}>
        All
      </button>
      <button type="button" style={{ borderColor: filter === 'pending' ? 'red' : 'transparent'}} onClick={() => applyFilter("pending")}>
        Pending
      </button>
      <button type="button" style={{ borderColor: filter === 'completed' ? 'red' : 'transparent'}} onClick={() => applyFilter("completed")}>
        Completed
      </button>
    </div>
  );
};

export default memo(TodoFilter, (prevProps, nextProps) => {
    return prevProps.filter === nextProps.filter;
});

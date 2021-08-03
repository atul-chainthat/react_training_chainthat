import React, { useState, useEffect } from "react";

const useStatus = () => {
  const [status, setStatus] = useState([]);

  const updateStatus = (name, id) => {
    const matches = /(.*)_(request|success|fail)/.exec(name);

    const [, match, type] = matches;

    if (type === "request") {
      setStatus((s) => {
        const index = s.findIndex((x) => {
          if (x.id) {
            return x.match === match && x.id === id;
          }
          return x.match === match;
        });
        if (index === -1) {
          return [...s, { match, type, id }];
        }
        return [
          ...s.slice(0, index),
          { ...s[index], type },
          ...s.slice(index + 1),
        ];
      });
    }

    if (type === "success") {
      setStatus((s) =>
        s.filter((x) => {
          if (x.id) {
            return !(x.match === match && x.id === id);
          }
          return x.match !== match;
        })
      );
    }

    if (type === "fail") {
      setStatus((s) =>
        s.map((x) => {
          if (x.id) {
            return x.match === match && x.id === id ? { ...x, type } : x;
          }
          return x.match === match ? { ...x, type } : x;
        })
      );
    }
  };

  console.log("status", status);

  return { status, updateStatus };
};

export default useStatus;

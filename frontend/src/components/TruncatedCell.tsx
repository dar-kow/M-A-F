import React, { useRef, useState, useLayoutEffect, ReactNode } from "react";

interface TruncatedCellProps {
  text: string;
  className?: string;
  children?: ReactNode; // Dodaj children
}

const TruncatedCell: React.FC<TruncatedCellProps> = ({
  text,
  className,
  children,
}) => {
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const checkTruncation = () => {
    if (cellRef.current) {
      setIsTruncated(cellRef.current.scrollWidth > cellRef.current.clientWidth);
    }
  };

  useLayoutEffect(() => {
    checkTruncation();
    const handleResize = () => {
      checkTruncation();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [text]);

  return (
    <td ref={cellRef} className={className} title={isTruncated ? text : ""}>
      {children || text}{" "}
      {/* Wyświetl children, jeśli istnieją, w przeciwnym razie wyświetl text */}
    </td>
  );
};

export default TruncatedCell;

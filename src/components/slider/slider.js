import React, { useRef, useState, useEffect } from "react";
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import "./slider.scss";

const Slider = ({ children }) => {
  const containerRef = useRef(null);
  
  const isTouchDevice = useRef(false);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const raf = useRef(null);

  const dragged = useRef(false);
  const suppressClick = useRef(false);

  const [dragging, setDragging] = useState(false);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [showArrows, setShowArrows] = useState(false);

const checkScrollLimits = () => {
  const el = containerRef.current;
  if (!el) return;

  const atStart = currentScroll.current <= 1;
  const atEnd = currentScroll.current >= el.scrollWidth - el.clientWidth - 1;

  setCanScrollLeft(!atStart);
  setCanScrollRight(!atEnd);
};

  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpSpeed = useRef(0.12);

    const animate = () => {
        const el = containerRef.current;
        if (!el) return;

        currentScroll.current = lerp(
            currentScroll.current,
            targetScroll.current,
            lerpSpeed.current
        );

        el.scrollLeft = currentScroll.current;

        checkScrollLimits();

        if (isDown.current || Math.abs(targetScroll.current - currentScroll.current) > 0.5) {
            raf.current = requestAnimationFrame(animate);
        } else {
            raf.current = null;
        }
    };

    useEffect(() => {
        checkScrollLimits();
        
        const handleResize = () => checkScrollLimits();
        window.addEventListener('resize', handleResize);
        
        return () => {
            cancelAnimationFrame(raf.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [children]);

  const onPointerDown = (e) => {
    isDown.current = true;
    dragged.current = false;
    setDragging(true);

    isTouchDevice.current = e.pointerType === 'touch';

    startX.current = e.clientX;
    scrollStart.current = containerRef.current.scrollLeft;

    targetScroll.current = scrollStart.current;
    currentScroll.current = scrollStart.current;

    suppressClick.current = false;
    lerpSpeed.current = 0.12;

    if (!isTouchDevice.current) {
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(animate);
    }
  };

  const onPointerMove = (e) => {
    if (!isDown.current) return;

    const dx = e.clientX - startX.current;

    if (Math.abs(dx) > 5) {
      dragged.current = true;
    }

    if (isTouchDevice.current) {
        containerRef.current.scrollLeft = scrollStart.current - dx;
    } else {
        targetScroll.current = scrollStart.current - dx * 1.2;
    }
  };

  const end = () => {
    isDown.current = false;
    setDragging(false);

    if (dragged.current) {
      suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 0);
    }
    if (isTouchDevice.current) {
        currentScroll.current = containerRef.current.scrollLeft;
        targetScroll.current = containerRef.current.scrollLeft;
    }
  };

  const scrollByButton = (dir) => {
    const el = containerRef.current;
    if (!el) return;
    
    const amount = el.offsetWidth * 1;

    targetScroll.current = currentScroll.current + (dir === "left" ? -amount : amount);
    
    const maxScroll = el.scrollWidth - el.clientWidth;
    targetScroll.current = Math.max(0, Math.min(targetScroll.current, maxScroll));

    lerpSpeed.current = 0.05;

    if (!raf.current) {
      currentScroll.current = el.scrollLeft;
      raf.current = requestAnimationFrame(animate);
    }
  };

  const blockClick = (e) => {
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

    useEffect(() => {
    checkScrollLimits();
    
    const updateArrowsVisibility = () => {
        const childrenCount = React.Children.count(children);
        const isMobile = window.innerWidth < 768; // Bootstrap breakpoint per mobile
        
        // Mostra sempre su mobile, oppure su desktop solo se più di 4 elementi
        setShowArrows(isMobile || childrenCount > 4);
    };
    
    updateArrowsVisibility();
    
    const handleResize = () => {
        checkScrollLimits();
        updateArrowsVisibility();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
        cancelAnimationFrame(raf.current);
        window.removeEventListener('resize', handleResize);
    };
    }, [children]);

  return (
    <div className="position-relative w-100">
        {
            showArrows &&
        <div className="d-flex justify-content-end pb-2 gap-3">
            <button
            type="button"
            className="btn arrow-btn-slider"
            onClick={() => scrollByButton("left")}
            disabled={!canScrollLeft}
            style={{ zIndex: 2 }}
            >
            <WestIcon />
            </button>
            <button
            type="button"
            className="btn arrow-btn-slider"
            onClick={() => scrollByButton("right")}
            disabled={!canScrollRight}
            style={{ zIndex: 2 }}
            >
            <EastIcon />
            </button>
        </div>
        }

      {/* TRACK */}
      <div
        ref={containerRef}
        className="d-flex overflow-auto gap-1 row slider-row"
        style={{
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none", 
          msOverflowStyle: "none",
          touchAction: "pan-x",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerCancel={end}
        onClickCapture={blockClick}
      >
        {children}
      </div>
    </div>
  );
};

export default Slider;
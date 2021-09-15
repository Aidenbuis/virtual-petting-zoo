import React from "react";
import { motion } from "framer-motion";
import "./App.css";

const gifs = [
  {
    frames: 32,
    width: 245,
    height: 184,
  },
  {
    frames: 35,
    width: 320,
    height: 240,
  },
  {
    frames: 32,
    width: 480,
    height: 402,
  },
  {
    frames: 26,
    width: 220,
    height: 220,
  },
  {
    frames: 32,
    width: 220,
    height: 220,
  },
  {
    frames: 40,
    width: 220,
    height: 275,
  },
  {
    frames: 8,
    width: 400,
    height: 300,
  },
];

const setCursorCSS = (emoji = "👋") => ({
  cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>${emoji}</text></svg>") 16 0,auto`,
});

const App = () => {
  return (
    <div
      style={{
        backgroundSize: "200px",
        backgroundImage: `url("${
          process.env.PUBLIC_URL + `/pexels-photo-4588065.jpg`
        }")`,
        ...setCursorCSS("✌️"),
      }}
      className="flex flex-col items-center justify-center w-screen h-screen"
    >
      <div className="fixed top-0 left-0 z-10 w-screen h-screen bg-black opacity-40" />
      <h1
        className={`text-5xl font-bold cats-alphabet text-white z-50 ml-8 -mt-32`}
      >
        VIRTUAL PETTING ZOO
      </h1>
      <GifDisplay />
      <MadeBy />
    </div>
  );
};

const GifDisplay = () => {
  const imageContainerRef = React.useRef(null);
  const imageRef = React.useRef(null);

  /** Current Gif State */
  const setCurrentGifReducer = (state, action) => {
    switch (action.type) {
      case "increase":
        const gifIsLastGif = gifs.length === state + 1;
        if (gifIsLastGif) {
          return 0;
        } else {
          return state + 1;
        }
      case "decrease":
        const gifIsFirstGif = state === 0;
        if (gifIsFirstGif) {
          return gifs.length - 1;
        } else {
          return state - 1;
        }
      default:
        throw new Error();
    }
  };
  const [currentGif, setCurrentGif] = React.useReducer(setCurrentGifReducer, 0);

  /** Current Frame State */
  const setCurrentFrameReducer = (state, action) => {
    switch (action.type) {
      case "increase":
        const frameIsLastFrame = gifs[currentGif].frames === state + 1; // +1 to
        if (frameIsLastFrame) {
          return 0;
        } else {
          return state + 1;
        }
      case "reset":
        return 0;
      case "update":
        return action.state;
      default:
        throw new Error();
    }
  };

  const [currentFrame, setCurrentFrame] = React.useReducer(
    setCurrentFrameReducer,
    0
  );

  React.useEffect(() => {
    const imageContainer = imageContainerRef.current;
    setCurrentFrame({ type: "reset" });

    const handleMouseMove = (event) => {
      const { clientX, isTrusted } = event;

      if (!isTrusted || clientX % 2 === 0) return null;

      const imageContainerWidth = imageContainer.clientWidth;
      const { left } = imageContainer.getBoundingClientRect();

      const amountOfFramesInCurrentGif = gifs[currentGif].frames;

      // Pixels that the curser needs to move to go to the next frame of the Gif
      const oneFrame = Math.floor(
        imageContainerWidth / amountOfFramesInCurrentGif
      );

      const currentFrame = Math.floor((clientX - left) / oneFrame - 2);

      setCurrentFrame({ type: "update", state: currentFrame });
    };

    imageContainer.addEventListener("mousemove", handleMouseMove);

    return () =>
      imageContainer.removeEventListener("mousemove", handleMouseMove);
  }, [currentGif]);

  const handleClick = () => {
    setCurrentFrame({ type: "increase" });
    window.setTimeout(() => setCurrentFrame({ type: "increase" }), 75);
    if (gifs[currentGif].frames > 20) {
      window.setTimeout(() => setCurrentFrame({ type: "increase" }), 150);
    }
  };

  /** Evaluates to the url of the current animal Gif */
  const backgroundUrl = `url('${
    process.env.PUBLIC_URL + `/gifs/animal_${currentGif}.png`
  }')`;

  /** Calculate offset to display the current frame */
  const backgroundPosition = `-${
    currentFrame * gifs[currentGif].width * 2
  }px -0px`;

  const smallestWidthGif = 220;

  return (
    <div className="relative z-10 mt-4">
      <div
        className="overflow-hidden bg-gray-100 border-8 border-white rounded-lg shadow-2xl "
        ref={imageContainerRef}
        style={{ ...setCursorCSS() }}
      >
        <div
          style={{
            backgroundImage: backgroundUrl,
            backgroundPosition: backgroundPosition,
            width: gifs[currentGif].width * 2,
            height: gifs[currentGif].height * 2,
            transitionProperty: "width, height",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDuration: "150ms",
          }}
          className="overflow-hidden transition duration-200 ease-in bg-no-repeat bg-cover rounded-lg select-none w-96"
          ref={imageRef}
          alt="Animal Gif"
        />
      </div>
      <div
        className="fixed left-0 w-full h-screen"
        style={{ top: "calc(70vh)" }}
      >
        <div
          className="flex items-center justify-between mx-auto -mt-8"
          style={{ width: `${smallestWidthGif}px` }}
        >
          <Button onClick={() => setCurrentGif({ type: "decrease" })}>
            👈
          </Button>
          <Button onClick={handleClick}>❤️</Button>
          <Button onClick={() => setCurrentGif({ type: "increase" })}>
            👉
          </Button>
        </div>
      </div>
    </div>
  );
};

const Button = ({ onClick, className = "", children }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.99 }}
      style={setCursorCSS("👆")}
      className={`select-none cats-alphabet text-4xl  font-semibold p-3 bg-white-200 rounded-full flex items-center justify-center text-center text-xl shadow-lg uppercase tracking-wide rounded-lg border-gray-200 border-4 overflow-hidden shadow-2xl text-orange-500 ${className} hover:shadow-4xl transition-shadow duration-50 ease-in bg-white`}
      onClick={onClick}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        const enterKeyCode = 13;
        if (e.keyCode === enterKeyCode) {
          onClick();
        }
      }}
    >
      {children}
    </motion.div>
  );
};

const MadeBy = ({ onClick, className = "", children }) => {
  return (
    <div className="absolute bottom-0 left-0 flex items-center justify-center w-full">
      <motion.a
        style={{ ...setCursorCSS("🐦") }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 1 }}
        className={`bottom-0 mb-6 text-5xl font-bold cats-alphabet text-center text-white absolute z-10`}
        href="twitter.com/aidenbuis"
      >
        MADE BY AIDEN
      </motion.a>
      <motion.a
        style={{ ...setCursorCSS("🐦") }}
        className={`bottom-0 mb-6 text-5xl font-bold cats-alphabet text-center text-orange-700 absolute z-0 -mt-1 -ml-2`}
        href="twitter.com/aidenbuis"
      >
        MADE BY AIDEN
      </motion.a>
    </div>
  );
};

export default App;

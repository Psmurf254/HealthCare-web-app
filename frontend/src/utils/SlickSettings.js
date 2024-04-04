import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const CustomArrow = ({ onClick, icon }) => (
  <button
    className="slickbtn"
    onClick={onClick}
    style={{
      position: "absolute",
      border: "none",
      outline: "none",
      right: "5%",
      top: "-100px",
      zIndex: "1",
    }}
  >
    {icon}
  </button>
);

const customPrevArrow = (
  <CustomArrow
    icon={
      <KeyboardBackspaceIcon
        style={{ color: "red", width: "100%", marginRight: "150px" }}
      />
    }
  />
);

const customNextArrow = (
  <CustomArrow
    icon={
      <KeyboardBackspaceIcon
        style={{ color: "red", width: "100%", transform: "rotate(180deg)" }}
      />
    }
  />
);

export var settings = {
  dots: false,
  infinite: true,
  speed: 1000,
  slidesToShow: 5,
  slidesToScroll: 3,
  initialSlide: 0,
  autoplay: true,
  autoplaySpeed: 5000,
  prevArrow: customPrevArrow,
  nextArrow: customNextArrow,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
};

export var testimonialsettings = {
  dots: false,
  infinite: true,
  speed: 1000,
  slidesToShow: 3,
  slidesToScroll: 1,
  initialSlide: 0,
  autoplay: true,
  autoplaySpeed: 5000,
  prevArrow: customPrevArrow,
  nextArrow: customNextArrow,

  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};


export var specialistReview = {
  dots: false,
  infinite: true,
  speed: 1000,
  slidesToShow: 2,
  slidesToScroll: 1,
  initialSlide: 2,
  autoplay: true,
  autoplaySpeed: 5000,
  prevArrow: customPrevArrow,
  nextArrow: customNextArrow,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
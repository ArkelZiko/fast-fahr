import m5 from "../images/m5.jpg";
import rs7 from "../images/rs7.jpg";
import c63 from "../images/c63.jpg";
import turbos from "../images/turbos.jpg"

const listings = [
  {
    id: 1,
    title: "BMW M5",  
    make: "BMW",
    model: "M5",
    image: m5,
    year: "2023",
    mileage: "5,201",
    price: "114,999",
  },
  {
    id: 2,
    title: "Audi RS7",
    make: "Audi",
    model: "RS7",
    image: rs7,
    year: "2023",
    mileage: "3,821",
    price: "122,999",
  },
  {
    id: 3,
    title: "Mercedes-AMG C63",
    make: "Mercedes-Benz",
    model: "C63",
    image: c63,
    year: "2022",
    mileage: "8,243",
    price: "94,999",
  },
  {
    id: 4,
    title: "Porsche 911 Turbo S",
    make: "Porsche",
    model: "911 Turbo S",
    image: turbos,
    year: "2021",
    mileage: "2,251",
    price: "189,999",
  },
];

export default listings;

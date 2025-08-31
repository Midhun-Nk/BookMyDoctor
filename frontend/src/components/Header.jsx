import { assets } from "../assets/assets_frontend/assets";

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20">
      {/* Left Side */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className="text-3xl md:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight">
          Book Appointment <br />
          With Trusted Doctors
        </p>

        {/* Text + image row */}
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
          <img
            className="w-28"
            src={assets.group_profiles}
            alt="Patient group"
          />
          <p>
            Simply browse through our extensive list of trusted doctors,{" "}
            <br className="hidden sm:block" /> schedule your
          </p>
        </div>

        {/* Button BELOW */}
        <a
          className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm mt-4 hover:scale-105 transition-all duration-300"
          href="#speciality"
        >
          Book Appointment
          <img className="w-3" src={assets.arrow_icon} alt="Arrow icon" />
        </a>
      </div>

      {/* Right Side */}
      <div className="md:w-1/2 relative">
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-lg"
          src={assets.header_img}
          alt="Doctor consultation"
        />
      </div>
    </div>
  );
};

export default Header;

import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="m-5  max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5  gap-y-6 ">
        {doctors.map((item, index) => (
          <div
            className="border border-indigo-200 rounded-xl 
  max-w-56 overflow-hidden cursor-pointer group" // 👈 added group here
            key={index}
          >
            <img
              className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
              src={item.image}
              alt={item.name}
            />
            <div className="p-4 ">
              <p className="text-neutral-800 font-medium text-lg">
                {item.name}
              </p>
              <p className="text-zinc-600 text-sm">{item.speciality}</p>
            </div>
            <div
              className="mt-3 flex items-center gap-2 pl-3 
             text-sm pb-3"
            >
              <input
                type="checkbox"
                checked={item.available}
                onClick={() => changeAvailability(item._id)}
              />
              <p>Available</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DoctorsList;

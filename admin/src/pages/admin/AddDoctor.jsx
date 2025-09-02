import { assets } from "../../assets/assets";

const AddDoctor = () => {
  return (
    <form className="m-5  w-full">
      <p
        className="mb-3
       text-lg font-medium"
      >
        Add Doctor
      </p>
      <div className="bg-white px-8 py-4 border border-gray-200 rounded w-full max-w-4xl h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={assets.upload_area}
              alt=""
            />
          </label>
          <input type="file" id="doc-img" className="hidden" />
          <p>
            Upload doctor <br /> Picture
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Name</p>
              <input
                className="border rounded px-3 py-2"
                type="text "
                placeholder="Name"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                className="border rounded px-3 py-2"
                type="email "
                placeholder="Email"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                type="password"
                placeholder="Password"
                required
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select className="border rounded px-3 py-2" name="" id="">
                <option value="1Year">1Year</option>
                <option value="2Years">2Years</option>
                <option value="3Years">3Years</option>

                <option value="4Years">4Years</option>

                <option value="5Years">5Years</option>
                <option value="6Years">6Years</option>
                <option value="7Years">7Years</option>
                <option value="8Years">8Years</option>

                <option value="9Years">9Years</option>

                <option value="10Years">10Years</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input
                className="border rounded px-3 py-2"
                type="number"
                placeholder="Fees"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select className="border rounded px-3 py-2" name="" id="">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>

                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Education</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Education"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="address 1"
                required
              />
              <input
                className="border rounded px-3 py-2"
                type="text"
                placeholder="address 2"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            className="w-full px-4 pt-2 border rounded "
            placeholder="About Doctor"
            required
            rows={5}
          />
        </div>
        <button className="bg-primary px-10 py-3 mt-4 text-white rounded-full">
          Add Doctor
        </button>
      </div>
    </form>
  );
};
export default AddDoctor;

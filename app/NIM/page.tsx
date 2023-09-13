import Image from "next/image";
import Logo from "@/public/assets/images/prc_logo.svg";
import { RiSearchLine } from "react-icons/ri";

export default function NIM() {
  return (
    <div className="flex flex-col py-12">
      {/* Acknowledge NIM */}
      <div className="flex max-h-fit justify-center items-center px-6 py-4">
        <div className="w-full h-fit bg-white border border-[#D5D7D8] flex flex-col rounded-[10px] p-6 gap-2">
          <h1 className="font-monts font-bold text-lg text-darkerGray underline">
            Acknowledge NIM
          </h1>
          <div className="flex flex-col gap-1">
            <h6 className="font-monts font-semibold text-sm text-darkerGray">
              Check out the following requirement to comply:
            </h6>
            <ul>
              <li className=" list-disc ml-5 font-monts font-medium text-sm text-darkerGray">
                Copy of organizational structure indicating the names of its
                employees/staff and their corresponding duties and
                responsibilities
              </li>
              <li className=" list-disc ml-5 font-monts font-medium text-sm text-darkerGray">
                Copy of organizational structure indicating the names of its
                employees/staff and their corresponding duties and
                responsibilities
              </li>
              <li className=" list-disc ml-5 font-monts font-medium text-sm text-darkerGray">
                Copy of organizational structure indicating the names of its
                employees/staff and their corresponding duties and
                responsibilities
              </li>
              <li className=" list-disc ml-5 font-monts font-medium text-sm text-darkerGray">
                Copy of organizational structure indicating the names of its
                employees/staff and their corresponding duties and
                responsibilities
              </li>
            </ul>
          </div>
          <div className="flex flex-row items-start lg:items-center gap-2 mt-4">
            <input
              id="checkbox1"
              name=""
              title="s"
              value=""
              type="checkbox"
              className="cursor-pointer accent-primaryBlue"
            />

            <label
              className="font-monts font-semibold text-sm text-darkerGray cursor-pointer"
              htmlFor="checkbox1"
            >
              I confirm that I have read and understood the requirements and
              will comply with them.
            </label>
          </div>
        </div>
      </div>
      {/* Upload Files */}
      <div className="flex max-h-fit justify-center items-center px-6 py-4">
        <div className="w-full h-fit bg-white border border-[#D5D7D8] flex flex-col rounded-[10px] p-6 gap-2">
          <h1 className="font-monts font-bold text-lg text-darkerGray underline">
            Upload Files
          </h1>
          <div className="flex flex-col gap-1">
            <h6 className="font-monts font-semibold text-sm text-darkerGray">
              Files to upload:
            </h6>
            <ul>
              <li className=" list-disc ml-5 font-monts font-medium text-sm text-darkerGray">
                Copy of organizational structure indicating the names of its
                employees/staff and their corresponding duties and
                responsibilities
              </li>
              <li className=" list-disc ml-5 font-monts font-medium text-sm text-darkerGray">
                Copy of organizational structure indicating the names of its
                employees/staff and their corresponding duties and
                responsibilities
              </li>
              <li className=" list-disc ml-5 font-monts font-medium text-sm text-darkerGray">
                Copy of organizational structure indicating the names of its
                employees/staff and their corresponding duties and
                responsibilities
              </li>
              <li className=" list-disc ml-5 font-monts font-medium text-sm text-darkerGray">
                Copy of organizational structure indicating the names of its
                employees/staff and their corresponding duties and
                responsibilities
              </li>
            </ul>
          </div>
          <label
            htmlFor="dropzone-file"
            className="w-full h-full flex flex-col justify-center items-center mt-4 gap-2 px-14 py-16 border-2 border-dashed border-black/25 rounded-[10px] cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="font-monts font-semibold text-sm text-darkerGray">
                Click to upload files here
              </p>
              {/* <p className="font-monts font-normal text-sm text-darkerGray">
                IMPORTANT: The file name should be in the following format{" "}
                {`<Inspection No.>`}_travel_order.pdf
              </p> */}
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
          <div className="flex flex-row flex-wrap justify-end">
        <button
          type="button"
          className="w-full md:w-fit flex items-center justify-center gap-2 cursor-pointer text-gray border bg-primaryBlue border-primaryBlue rounded-lg font-monts font-semibold text-sm text-white h-fit p-2.5"
        >
          Submit
        </button>
      </div>
        </div>
      </div>
    </div>
  );
}

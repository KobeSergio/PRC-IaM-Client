"use client";

import Image from "next/image";
import Logo from "@/public/assets/images/prc_logo.svg";
import { RiSearchLine } from "react-icons/ri";

import Firebase from "@/lib/firebase";
import { useEffect, useState } from "react";
import { ExpiringLink } from "@/types/ExpiringLink";
import { Inspection } from "@/types/Inspection";
const firebase = new Firebase();

//Get server side props with the params.unique_id
export async function getServerSideProps({
  params,
}: {
  params: { unique_id: string };
}) {
  const linkId = params.unique_id;

  const link = await firebase.getLinkObjectById(linkId);

  if (!link?.exists) {
    return { props: { valid: false } };
  }

  const currentDate = new Date();

  if (currentDate > link.expiresAt.toDate()) {
    return { props: { valid: false } };
  }

  return { props: { valid: true, link: link as ExpiringLink } };
}

export default function NIM({
  valid,
  link,
}: {
  valid: boolean;
  link: ExpiringLink;
}) {
  if (!valid) {
    return (
      <div className="flex flex-col py-12">
        <div className="flex flex-col gap-2 justify-center items-center">
          <Image
            src={Logo}
            width={92}
            height={92}
            alt="PRC Logo"
            className="w-[62px] lg:w-[92px] h-[62px] lg:[92px]"
          />
          <div className="text-primaryBlue text-2xl text-center font-bold leading-tight lg:leading-loose tracking-tight">
            PRC Inspection and Monitoring System
          </div>
        </div>
        {/* Acknowledge NIM */}
        <div className="flex max-h-screen justify-center items-center px-6 py-4">
          <div className="w-full h-[60vh] bg-white border border-[#D5D7D8] flex items-center justify-center rounded-[10px] p-6 gap-2">
            <h1 className="font-monts font-bold text-lg text-darkerGray underline">
              Link is invalid or expired
            </h1>
          </div>
        </div>
      </div>
    );
  }

  const [inspectionData, setInspectionData] = useState<Inspection>(
    {} as Inspection
  );

  useEffect(() => {
    //Fetch inspection data from firebase via the link.inspection_id
    if (valid) {
      firebase.getInspection(link.inspection_id).then((inspection) => {
        setInspectionData(inspection as Inspection);
      });
    }
  }, [valid]);

  const onSubmit = () => {};

  const onFileUpload = () => {};

  return (
    <div className="flex flex-col py-12">
      <div className="flex flex-col gap-2 justify-center items-center">
        <Image
          src={Logo}
          width={92}
          height={92}
          alt="PRC Logo"
          className="w-[62px] lg:w-[92px] h-[62px] lg:[92px]"
        />
        <div className="text-primaryBlue text-2xl text-center font-bold leading-tight lg:leading-loose tracking-tight">
          PRC Inspection and Monitoring System
        </div>
      </div>
      {/* Acknowledge NIM */}
      <div className="flex max-h-fit justify-center items-center px-6 py-4">
        <div className="w-full h-fit bg-white border border-[#D5D7D8] flex flex-col rounded-[10px] p-6 gap-2">
          <h1 className="font-monts font-bold text-lg text-darkerGray underline">
            Acknowledge Notice of Inspection and Monitoring (NIM)
          </h1>
          <div className="flex flex-col gap-1">
            <h6 className="font-monts font-semibold text-sm text-darkerGray">
              The board has selected your HEI/Establishment for inspection.
              Please upload the required documents and acknowledge receipt of
              this notice of inspection.
              <br />
              <br />
              Kindly see the following requirements for inspection compliance:
            </h6>
            <ul>
              <li className=" list-disc ml-5 font-monts font-medium text-sm text-darkerGray">
                Copy of organizational structure indicating the names of its
                employees/staff and their corresponding duties and
                responsibilities
              </li>
              <label
                htmlFor="dropzone-file"
                className="w-full h-full flex flex-col justify-center items-center my-4 gap-2 px-14 py-16 border-2 border-dashed border-black/25 rounded-[10px] cursor-pointer"
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
              I confirm that I have read and understood the notice of
              inspection.
            </label>
          </div>
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

"use client";

import Image from "next/image";
import Logo from "@/public/assets/images/prc_logo.svg";

import Firebase from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Inspection } from "@/types/Inspection";
import { PageSpinner, Spinner } from "@/components/Spinner";
import { useDropzone } from "react-dropzone";
import Dropzone from "@/components/Dropzone";
import { ExpiringLink } from "@/types/ExpiringLink";

const firebase = new Firebase();

export default function NIM({ params }: { params: { unique_id: string } }) {
  const [inspectionData, setInspectionData] = useState({} as Inspection);
  const [expiringLink, setExpiringLink] = useState({} as ExpiringLink);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [files, setFiles] = useState({} as any);
  const [understood, setUnderstood] = useState(false);

  const [finished, setFinished] = useState(false);

  const handleFileChange = (requirement: string, files: File[] | File) => {
    setFiles((prevState: any) => ({
      ...prevState,
      [requirement]: files,
    }));
  };

  const onSubmit = async () => {
    //Check if all requirements are uploaded from files
    if (
      Object.keys(files).length !==
      Object.keys(inspectionData?.requirements).length
    ) {
      alert("Please upload all the requirements first.");
      return;
    }

    Object.keys(files).map((file: any) => {
      if (
        files[file].length == 0 ||
        files[file] == undefined ||
        files[file] == null
      ) {
        alert("Please upload all the requirements first.");
        return;
      }
    });

    //Check if confirmation checkbox is checked
    if (!understood) {
      alert("Please confirm that you have read and understood the notice.");
      return;
    }

    setIsLoading(true);

    //Gather all files to be uploaded and store them in a array to be Promised.all
    const filesToUpload = [] as any;
    Object.keys(files).map((fileKey: any) => {
      files[fileKey].map((file: File) => {
        filesToUpload.push(
          firebase.uploadFile(file, inspectionData.inspection_id, fileKey)
        );
      });
    });

    //Upload all files
    await Promise.all(filesToUpload)
      .then(async () => {
        alert("Successfully submitted");

        //Update inspection task to "Review Inspection Requirements"

        const newInspectionData = {
          ...inspectionData,
          inspection_task: "Review Inspection Requirements",
        };

        await firebase.updateInspection(inspectionData);

        setInspectionData(newInspectionData);

        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("An error occured while submitting. Please try again.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (Object.keys(inspectionData).length == 0) {
      setIsFetching(true);
      firebase.getLinkObjectById(params.unique_id).then((link) => {
        if (link == null || link == undefined) {
          setIsFetching(false);
          return;
        }

        const currentDate = new Date();

        //If currentDate is greater than the expiration date of the link, return false
        if (currentDate > new Date(link?.expiresAt)) {
          //Deletes the link object bc it is expired
          firebase.deleteLinkObjectById(params.unique_id);
          setIsFetching(false);
          return;
        }

        setExpiringLink(link as ExpiringLink);

        firebase
          .getInspection(link?.inspection_id as string)
          .then((inspection) => {
            if (inspection != null || inspection != undefined) {
              setInspectionData(inspection as Inspection);
            }
            setIsFetching(false);
          });
      });
    }
  }, []);

  if (Object.keys(inspectionData).length == 0 && !isFetching) {
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

  if (
    inspectionData?.inspection_task?.toLowerCase() != "sent nim" &&
    !isFetching
  ) {
    return (
      <>
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
              <h1 className="font-monts text-center text-lg text-darkerGray  ">
                Thank you for submitting your requirements.
                <br />
                <br />
                Expect the board to inspect your{" "}
                <b>{inspectionData?.client_details?.type} </b>on{" "}
                <b>{formatDate(inspectionData?.inspection_date)}</b>.
              </h1>
            </div>
          </div>
        </div>
      </>
    );
  }

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
          {isFetching ? (
            <div className="flex h-[60vh] flex-col items-center justify-center">
              <PageSpinner />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <h6 className="font-monts font-semibold text-sm text-darkerGray">
                  The board has selected your{" "}
                  {inspectionData?.client_details?.type} to be inspected at{" "}
                  {formatDate(inspectionData?.inspection_date)}. Please upload
                  the required documents and acknowledge receipt of this notice
                  of inspection before{" "}
                  {formatDate(expiringLink.expiresAt.split(",")[0])}
                  .
                  <br />
                  <br />
                  Kindly see the following requirements for inspection
                  compliance:
                </h6>
                <ul>
                  {Object.keys(inspectionData?.requirements || {}).map(
                    (requirement: string, index: any) => {
                      return (
                        <>
                          <li
                            key={index}
                            className=" list-disc ml-5 font-monts font-medium text-sm text-darkerGray"
                          >
                            {requirementTexts[requirement]}
                          </li>
                          <Dropzone
                            requirement={requirement}
                            handleFileChange={handleFileChange}
                            files={files[requirement]}
                          />
                          {/* <label
                            htmlFor="dropzone-file"
                            className="w-full h-full flex flex-col justify-center items-center my-4 gap-2 px-14 py-16 border-2 border-dashed border-black/25 rounded-[10px] cursor-pointer"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <p className="font-monts font-semibold text-sm text-darkerGray">
                                Click to upload files here
                              </p>
                              <p className="font-monts font-normal text-sm text-darkerGray">
                                IMPORTANT: The file name should be in the
                                following format {`<Inspection No.>`}
                                _travel_order.pdf
                              </p>
                            </div>
                            <input
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                            />
                          </label> */}
                        </>
                      );
                    }
                  )}
                </ul>
              </div>
              <div className="flex flex-row items-start lg:items-center gap-2 mt-4">
                <input
                  id="confirmation"
                  type="checkbox"
                  onChange={() => {
                    setUnderstood(!understood);
                  }}
                  checked={understood}
                  className="cursor-pointer accent-primaryBlue"
                />
                <label
                  className="font-monts font-semibold text-sm text-darkerGray cursor-pointer"
                  htmlFor="confirmation"
                >
                  I confirm that I have read and understood the notice of
                  inspection.
                </label>
              </div>
              <div className="flex flex-row flex-wrap justify-end">
                <button
                  onClick={() => (isLoading ? null : onSubmit())}
                  type="button"
                  className="w-full md:w-fit flex items-center justify-center gap-2 cursor-pointer text-gray border bg-primaryBlue border-primaryBlue rounded-lg font-monts font-semibold text-sm text-white h-fit p-2.5"
                >
                  {isLoading ? (
                    <div className="w-12 justify-center flex items-center">
                      <Spinner />
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const requirementTexts = {
  orgStructure:
    "Copy of organizational structure indicating the names of its employees/staff and their corresponding duties and responsibilities",
  qualsAndCreds:
    "Copies of qualifications and credentials, including professional credentials (PIC, CoR, APO/AIPO ID/COGS) of the employees/staff, if applicable",
  narrative:
    "Narrative or PowerPoint presentation of the institution's/establishment's profile, including relevant facilities, equipment, and resources",
  vidPres:
    "Video presentation and photos of the institution's/establishment's facilities, equipment, and resources",
  reInspection:
    "For monitoring (re-inspection), proof/evidence of the corrective actions taken relative to the findings during the previous inspection",
  procedureManual:
    "Documents relevant to the practice of profession: Procedures Manual",
  safetyManual:
    "Documents relevant to the practice of profession: Safety Manual",
  wasteManagement:
    "Documents relevant to the practice of profession: Waste Management",
} as any;

function formatDate(dateString: string) {
  // Create a new Date object from the date string
  const date = new Date(dateString);

  // Array of weekday names
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get the name of the day of the week
  const dayName = weekdays[date.getDay()];

  // Get the year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so +1
  const day = String(date.getDate()).padStart(2, "0");

  // Return formatted date string
  return `${dayName}, ${year}/${month}/${day}`;
}

"use client";

import Image from "next/image";
import Logo from "@/public/assets/images/prc_logo.svg";
import { RiSearchLine } from "react-icons/ri";
import { useState } from "react";
import { Spinner } from "@/components/Spinner";
import Firebase from "@/lib/firebase";
import { Inspection } from "@/types/Inspection";
import { formatDateToDash } from "@/lib/formatDates";

const firebase = new Firebase();

export default function Home() {
  const [record, setRecord] = useState<Inspection>({} as Inspection);
  const [records, setRecords] = useState<Inspection[]>([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState("");

  const onSubmit = async () => {
    if (id === "") {
      alert("Please enter an ID");
      return;
    }

    setIsLoading(true);

    await firebase.checkLatestInspection(id).then((inspections) => {
      if (inspections) {
        setRecord(inspections[inspections.length - 1]);
        setRecords(inspections);
      }
    });

    setSearched(true);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center max-md:gap-2 px-6 pt-12 lg:pt-24 pb-4">
        <div className="flex flex-col gap-2 justify-center items-center">
          <Image
            src={Logo}
            width={92}
            height={92}
            alt="PRC Logo"
            className="w-[62px] lg:w-[92px] h-[62px] lg:[92px]"
          />
          <div className="text-primaryBlue text-2xl lg:text-[40px] text-center font-bold leading-tight lg:leading-loose tracking-tight">
            PRC Inspection and Monitoring System
          </div>
        </div>
        <div className="w-full flex-col justify-center items-center gap-3 inline-flex">
          <div className="font-monts text-darkerGray text-sm text-center font-medium leading-tight tracking-tight">
            Fill out the text field with the establishment ID to verify
          </div>
          <div className="relative flex items-center w-full md:w-1/2 lg:w-1/3">
            <RiSearchLine className="absolute left-3 fill-[#7C7C7C]" />
            <input
              type="text"
              onChange={(e) => setId(e.target.value)}
              value={id}
              className="pl-10 p-2.5 outline-none bg-white border border-[#D5D7D8] rounded-lg font-monts font-medium text-sm text-gray text-inherit w-full"
              placeholder=""
            />
            <button
              onClick={() => onSubmit()}
              className="flex px-4 py-2 items-center justify-center bg-primaryBlue hover:bg-primaryBlue/90 rounded-lg font-monts font-medium text-sm text-white ml-2"
            >
              {isLoading ? (
                <>
                  <Spinner /> Searching
                </>
              ) : (
                <>Search</>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="flex max-h-fit justify-center items-center px-6 py-4">
        {searched ? (
          <>
            {" "}
            {record == null ? (
              <div className="w-full h-[30vh] bg-white p-6 rounded-[10px] border border-[#D5D7D8] flex-grow flex-col justify-center items-center gap-[15px] inline-flex">
                <div className="font-monts text-primaryBlue text-sm lg:text-xl font-bold leading-tight tracking-tight">
                  No records found
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {" "}
                <div className="w-full h-full lg:h-[30vh] bg-white border border-[#D5D7D8] flex flex-col  rounded-[10px] p-6 gap-4">
                  <h1 className="font-monts font-bold text-lg text-darkerGray">
                    Client Details
                  </h1>
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment Name
                      </h6>
                      <p className="font-monts text-sm font-semibold text-darkerGray">
                        {record.client_details.name}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment Type
                      </h6>
                      <p className="font-monts text-sm font-semibold text-darkerGray">
                        {record.client_details.type}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment address
                      </h6>
                      <p className="font-monts text-sm font-semibold text-darkerGray">
                        {record.client_details.address}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment Email
                      </h6>
                      <p className="font-monts text-sm font-semibold text-primaryBlue hover:underline">
                        {record.client_details.email}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Compliant Status
                      </h6>
                      <p className="font-monts text-sm font-semibold text-darkerGray">
                        {record.status == "compliant" ? (
                          <>
                            Compliant until:{" "}
                            {
                              //Add 5 years to the fulfilledAt date
                              formatDateToDash(
                                new Date(
                                  new Date(record.fulfilledAt).setFullYear(
                                    new Date(record.fulfilledAt).getFullYear() +
                                      5
                                  )
                                )
                              )
                            }
                          </>
                        ) : record.status == "non-compliant" ? (
                          "Non-Compliant"
                        ) : record.status == "pending" ? (
                          "Pending Inspection"
                        ) : (
                          "For Compliance"
                        )}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                {/* <div className="w-full h-full lg:h-[30vh] bg-white border border-[#D5D7D8] flex flex-col  rounded-[10px] p-6 gap-4">
                  <h1 className="font-monts font-bold text-lg text-darkerGray">
                    Inspection History
                  </h1>
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment Name
                      </h6>
                      <p className="font-monts text-sm font-semibold text-darkerGray">
                        {record.client_details.name}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment Type
                      </h6>
                      <p className="font-monts text-sm font-semibold text-darkerGray">
                        {record.client_details.type}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment address
                      </h6>
                      <p className="font-monts text-sm font-semibold text-darkerGray">
                        {record.client_details.address}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment Email
                      </h6>
                      <p className="font-monts text-sm font-semibold text-primaryBlue hover:underline">
                        {record.client_details.email}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Compliant Status
                      </h6>
                      <p className="font-monts text-sm font-semibold text-darkerGray">
                        {record.status == "compliant" ? (
                          <>
                            Compliant until:{" "}
                            {
                              //Add 5 years to the fulfilledAt date
                              formatDateToDash(
                                new Date(
                                  new Date(record.fulfilledAt).setFullYear(
                                    new Date(record.fulfilledAt).getFullYear() +
                                      5
                                  )
                                )
                              )
                            }
                          </>
                        ) : record.status == "non-compliant" ? (
                          "Non-Compliant"
                        ) : record.status == "pending" ? (
                          "Pending Inspection"
                        ) : (
                          "For Compliance"
                        )}
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

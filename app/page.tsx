"use client";

import Image from "next/image";
import Logo from "@/public/assets/images/prc_logo.svg";
import { RiSearchLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";
import Firebase from "@/lib/firebase";
import { Inspection } from "@/types/Inspection";
import { formatDateToDash } from "@/lib/formatDates";
import Select from "react-select";

const firebase = new Firebase();

type Option = {
  value: string;
  label: string;
};

export default function Home() {
  const [record, setRecord] = useState<Inspection>({} as Inspection);
  const [records, setRecords] = useState<Inspection[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searched, setSearched] = useState(false);
  const [options, setOptions] = useState<Option[]>([] as Option[]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    if (options.length > 0) return;
    setIsFetching(true);
    firebase.getInspections().then((inspections) => {
      //Get unique clients
      const uniqueInspections = inspections.filter(
        (v: any, i: any, a: any) =>
          a.findIndex((t: any) => t.clientId === v.clientId) === i
      );
      const options = uniqueInspections.map((inspection: any) => {
        //clientName, clientType, clientAddress, clientId
        return {
          value: inspection.clientId,
          label:
            inspection.clientName +
            " - " +
            inspection.clientType +
            " - " +
            inspection.clientAddress,
        };
      });
      setOptions(options);
      setIsFetching(false);
    });
  }, []);

  const handleChange = (option: any) => {
    if (isFetching) return;
    console.log(option);
    setSelectedOption(option);
    setId(option.value);
  };

  const onSubmit = async () => {
    if (id === "") {
      alert("Please enter an ID or the name of the establishment");
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
          <div className="text-primaryBlue text-2xl  text-center font-bold leading-tight lg:leading-loose -mt-6 mb-4 tracking-tight">
            NUTRITION AND DIETETICS
          </div>
        </div>
        <div className="w-full flex-col justify-center items-center gap-3 inline-flex">
          <div className="font-monts text-darkerGray text-sm text-center font-medium leading-tight tracking-tight">
            Fill out the text field with the establishment name to verify.
          </div>
          <div className="relative flex items-center w-full md:w-1/2 lg:w-1/3">
            <RiSearchLine className="absolute left-3 fill-[#7C7C7C]" />
            {/* <input
              type="text"
              onChange={(e) => setId(e.target.value)}
              value={id}
              className="pl-10 p-2.5 outline-none bg-white border border-[#D5D7D8] rounded-lg font-monts font-medium text-sm text-gray text-inherit w-full"
              placeholder=""
            /> */}
            <Select
              value={selectedOption}
              className="w-full"
              onInputChange={(e) => setInputValue(e)}
              onChange={handleChange}
              options={inputValue.length > 3 ? options : []}
              isSearchable={isFetching ? false : true}
              placeholder="Search..."
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
              <div className="flex w-[60vw] flex-col gap-4">
                {" "}
                <div className="w-full h-full lg:h-[30vh] bg-white border border-[#D5D7D8] flex flex-col  rounded-[10px] p-6 gap-4">
                  <h1 className="font-monts font-bold text-lg text-darkerGray">
                    Compliance Information
                  </h1>
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Compliance Status
                      </h6>
                      <p className="font-monts text-base font-semibold text-darkerGray">
                        {record.status.toLowerCase() == "compliant" ? (
                          <p className="text-green-700">
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
                          </p>
                        ) : record.status.toLowerCase() == "non-compliant" ? (
                          "Non-Compliant"
                        ) : record.status.toLowerCase() == "pending" ? (
                          "Pending Inspection"
                        ) : (
                          "For Compliance"
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment Name
                      </h6>
                      <p className="font-monts text-base font-semibold text-darkerGray">
                        {record.client_details?.name}
                      </p>
                    </div>
                    {/* <div className="flex flex-col gap-2">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment Type
                      </h6>
                      <p className="font-monts text-base font-semibold text-darkerGray">
                        {record.client_details?.type}
                      </p>
                    </div> */}
                    <div className="flex flex-col gap-2">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment address
                      </h6>
                      <p className="font-monts text-base font-semibold text-darkerGray">
                        {record.client_details?.address}
                      </p>
                    </div>
                    {/* <div className="flex flex-col gap-2">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment Email
                      </h6>
                      <p className="font-monts text-sm font-semibold text-primaryBlue hover:underline">
                        {record.client_details?.email}
                      </p>
                    </div> */}
                  </div>
                </div>{" "}
                {/* <div className="w-full h-full lg:h-[30vh] bg-white border border-[#D5D7D8] flex flex-col  rounded-[10px] p-6 gap-4">
                  <h1 className="font-monts font-bold text-lg text-darkerGray">
                    Inspection History
                  </h1>
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment Name
                      </h6>
                      <p className="font-monts text-base font-semibold text-darkerGray">
                        {record.client_details?.name}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment Type
                      </h6>
                      <p className="font-monts text-base font-semibold text-darkerGray">
                        {record.client_details?.type}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment address
                      </h6>
                      <p className="font-monts text-base font-semibold text-darkerGray">
                        {record.client_details?.address}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Establishment Email
                      </h6>
                      <p className="font-monts text-sm font-semibold text-primaryBlue hover:underline">
                        {record.client_details?.email}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Compliant Status
                      </h6>
                      <p className="font-monts text-base font-semibold text-darkerGray">
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

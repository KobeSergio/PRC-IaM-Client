"use client";

import Image from "next/image";
import Logo from "@/public/assets/images/prc_logo.svg";
import BOND from "@/public/assets/images/bond_logo.png";
import { RiSearchLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";
import Firebase from "@/lib/firebase";
import { Inspection } from "@/types/Inspection";
import { formatDateToDash } from "@/lib/formatDates";
import Select from "react-select";

import {
  BsFillPatchCheckFill,
  BsFillPatchMinusFill,
  BsFillPatchExclamationFill,
} from "react-icons/bs";

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
          <div className="lg:flex hidden gap-12">
            <Image src={Logo} width={120} height={120} alt="PRC Logo" />{" "}
            <Image src={BOND} width={120} height={120} alt="BOND Logo" />
          </div>
          <div className="flex lg:hidden gap-4">
            <Image src={Logo} width={60} height={60} alt="PRC Logo" />{" "}
            <Image src={BOND} width={60} height={60} alt="BOND Logo" />
          </div>

          <div className="text-primaryBlue text-2xl lg:text-[40px] text-center font-bold leading-tight lg:leading-loose tracking-tight">
            PRC Inspection and Monitoring System
          </div>
          <div className="text-primaryBlue text-2xl  text-center font-bold leading-tight lg:leading-loose lg:-mt-6 mb-4 tracking-tight">
            NUTRITION AND DIETETICS
          </div>
        </div>
        <div className="w-full flex-col justify-center items-center gap-3 inline-flex">
          <div className="font-monts text-darkerGray text-sm text-center font-medium leading-tight tracking-tight">
            Fill out the text field with the establishment name to verify.
          </div>
          <div className="relative flex items-center w-full md:w-1/2 lg:w-1/3">
            <RiSearchLine className="absolute left-3 fill-[#7C7C7C]" />

            <Select
              value={selectedOption}
              className="w-full"
              onInputChange={(e) => setInputValue(e)}
              onChange={handleChange}
              options={inputValue.length > 3 ? options : []}
              isSearchable={isFetching ? false : true}
              placeholder="Search..."
              styles={{
                dropdownIndicator: (base) => ({ ...base, display: "none" }),
              }}
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
              <div className="flex w-full lg:w-[60vw] flex-col gap-4">
                {" "}
                <div className="w-full h-full lg:h-[30vh] bg-white border border-[#D5D7D8] flex flex-col  rounded-[10px] p-6 gap-4">
                  <h1 className="font-monts font-bold text-lg text-darkerGray">
                    Compliance Information
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
                        Establishment address
                      </h6>
                      <p className="font-monts text-base font-semibold text-darkerGray">
                        {record.client_details?.address}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h6 className="font-monts text-sm font-semibold text-darkGray">
                        Compliance Status
                      </h6>
                      <div className="font-monts text-base font-semibold text-darkerGray">
                        {record.status.toLowerCase() == "compliant" ? (
                          <p className="flex items-center gap-2">
                            Compliant until:{" "}
                            {
                              //Add 3 years to the fulfilledAt date
                              formatDateToDash(
                                new Date(
                                  new Date(record.fulfilledAt).setFullYear(
                                    new Date(record.fulfilledAt).getFullYear() +
                                      3
                                  )
                                )
                              )
                            }
                            <span>
                              <BsFillPatchCheckFill color={"green"} size={24} />
                            </span>
                          </p>
                        ) : record.status.toLowerCase() == "non-compliant" ? (
                          "Non-Compliant"
                        ) : record.status.toLowerCase() == "additional" ||
                          record.status.toLowerCase() == "approved" ? (
                          <p className="flex items-center gap-2 ">
                            Pending Inspection{" "}
                            <span>
                              <BsFillPatchMinusFill size={24} />
                            </span>
                          </p>
                        ) : (
                          <p className="flex items-center gap-2 ">
                            For Compliance
                            <span>
                              <BsFillPatchExclamationFill
                                color={"red"}
                                size={24}
                              />
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>{" "}
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

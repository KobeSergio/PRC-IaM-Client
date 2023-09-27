import { useEffect } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone({
  requirement,
  handleFileChange,
  files,
}: {
  requirement: string;
  handleFileChange: any; // Usestate setter
  files: any; // Usestate
}) {
  const accepts =
    requirement == "vidPres"
      ? {
          "image/jpeg": [],
          "image/png": [],
          "image/jpg": [],
        }
      : {
          "application/pdf": [],
          docx: [],
          doc: [],
          "application/msword": [],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [],
          "application/vnd.ms-excel": [],
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            [],
          "application/vnd.ms-powerpoint": [],
          "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            [],
          "application/vnd.oasis.opendocument.text": [],
          "application/vnd.oasis.opendocument.spreadsheet": [],
          "application/vnd.oasis.opendocument.presentation": [],
        };

  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({
      accept: accepts as any,
    });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      handleFileChange(requirement, acceptedFiles);
    }
  }, [acceptedFiles]);

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    handleFileChange(requirement, newFiles);
  };

  return (
    <div className="mb-4">
      <div
        {...getRootProps({
          className: "dropzone",
        })}
        className="w-full h-full flex flex-col justify-center items-center my-4 gap-2 px-14 py-16 border-2 border-dashed border-black/25 rounded-[10px] cursor-pointer"
      >
        <div className="py-4 border-t-black/20">
          <div className="flex flex-col items-center justify-center dropzone">
            <input {...getInputProps()} />
            <p className="disable-text-selection text-sm w-full h-full text-black text-center text-semibold font-monts">
              {isDragActive
                ? "Drop the files here ..."
                : files == undefined || files.length == 0
                ? `Click to upload or drag and drop your files here. Accepts: ${
                    requirement == "vidPres"
                      ? "jpg, jpeg, png"
                      : "pdf, doc, docx, xls, xlsx, ppt, pptx, odt, ods, odp"
                  }`
                : "Files uploaded, check the list below."}
            </p>
          </div>
        </div>
      </div>
      {files && files.length > 0 && (
        <ul>
          {files.map((file: any, index: number) => (
            <li key={file.name}>
              {file.name}{" "}
              <button
                className="text-blue-900"
                onClick={() => removeFile(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

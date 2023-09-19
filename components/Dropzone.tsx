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
  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({
      // ... (rest of the dropzone configuration)
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
            <p className="disable-text-selection text-sm w-full h-full text-black text-center">
              {isDragActive
                ? "Drop the files here ..."
                : files == undefined || files.length == 0
                ? "Click to upload or drag and drop your files here."
                : "Files uploaded:"}
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

import React from "react";
import Alert, { AlertType } from "../Alert/Alert";

const FileInput = (props: {
  title: string;
  onChange: (file: File) => void;
  disabled: boolean;
  error: string;
  onCloseError?: () => void;
  accept?: string | undefined;
}) => {
  return (
    <div>
      <div className="text-sm">{props.title}</div>
      <input
        type={"file"}
        className={`px-3 py-2 text-sm w-full border bg-gray-100 ${
          props.error !== "" ? "border-red-600" : ""
        } rounded-md`}
        disabled={props.disabled}
        onChange={(e) => {
          if (e.target.files !== null && e.target.files.length > 0) {
            props.onChange(e.target.files[0]);
          }
        }}
        accept={props.accept}
      />
      {props.error !== "" && (
        <div>
          <Alert
            alertType={AlertType.DANGER}
            title={props.error}
            close={() => {
              props.onCloseError !== undefined && props.onCloseError();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FileInput;

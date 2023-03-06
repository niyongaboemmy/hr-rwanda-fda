import React from "react";
import Alert, { AlertType } from "../Alert/Alert";

const Textarea = (props: {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  value: string;
  error: string;
  onCloseError?: () => void;
  className?: string;
}) => {
  return (
    <div>
      <div className="text-sm">{props.title}</div>
      <textarea
        className={`px-3 py-2 text-sm w-full border bg-gray-100 ${
          props.error !== "" ? "border-red-600" : ""
        } rounded-md ${props.className !== undefined ? props.className : ""}`}
        disabled={props.disabled}
        value={props.value}
        onChange={props.onChange}
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

export default Textarea;

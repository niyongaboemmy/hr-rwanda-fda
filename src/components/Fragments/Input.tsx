import React from "react";
import Alert, { AlertType } from "../Alert/Alert";

const Input = (props: {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  value: string;
  error: string;
  onCloseError?: () => void;
  type: React.HTMLInputTypeAttribute;
}) => {
  return (
    <div>
      <div className="text-sm">{props.title}</div>
      <input
        type={props.type}
        className={`px-3 py-2 text-sm w-full border bg-gray-100 ${
          props.error !== "" ? "border-red-600" : ""
        } rounded-md`}
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

export default Input;

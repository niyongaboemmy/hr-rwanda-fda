export const NoResultFound = (props: {
  title?: string;
  description?: string;
  button?: JSX.Element;
  onClick?: () => void;
}) => {
  const ButtonSelected = props.button;
  return (
    <div className="bg-gray-100 rounded-md p-3 py-6 text-center">
      <div className="font-bold text-xl">
        {props.title === undefined ? "No result found!" : props.title}
      </div>
      <div className="text-sm text-gray-500">
        {props.description === undefined
          ? "Try another keyword to view the result!"
          : props.description}
      </div>
      <div className="flex flex-row items-center justify-center">
        {ButtonSelected !== undefined && (
          <div onClick={props.onClick}>{ButtonSelected}</div>
        )}
      </div>
    </div>
  );
};

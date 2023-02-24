import { BsArrowRightCircle } from "react-icons/bs";
import { ImUser } from "react-icons/im";

export const PositionItemLoading = (props: { className: string }) => {
  return (
    <div
      className={`mb-2 border-b border-gray-200 p-1 pb-2 cursor-pointer group ${props.className}`}
    >
      <div className="flex flex-row items-center justify-between w-full gap-2">
        <div className="flex flex-row items-center gap-4 w-full">
          <div>
            <div className="flex items-center justify-center h-16 w-16 rounded-md bg-gray-100">
              <ImUser className="text-5xl text-gray-300 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="text-sm font-semibold group-hover:text-primary-800 h-4 rounded-full bg-gray-200 w-4/5"></div>
            <div className="flex flex-row items-center text-xs text-gray-600 bg-gray-200 w-2/5 h-3 rounded-full mt-2"></div>
            <div className="flex flex-row items-center gap-3 mt-1">
              <div>
                <BsArrowRightCircle className="text-gray-200 animate-pulse text-lg" />
              </div>
              <div className="text-xs text-gray-600 bg-gray-100 w-1/5 h-3 rounded-full"></div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-gray-200 h-8 w-20 rounded-md font-bold text-sm cursor-pointer animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

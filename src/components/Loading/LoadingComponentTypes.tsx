export const InfoLoading = () => {
  return (
    <div className="grid grid-cols-12 gap-3 w-full py-3">
      <div className="col-span-6">
        <div className="w-full">
          <div className="w-3/4 h-4 rounded-full bg-gray-100 animate-pulse mb-2"></div>
          <div className="w-full h-7 rounded-lg bg-gray-100 animate-pulse"></div>
        </div>
        <div className="pt-6 w-full">
          <div className="w-3/4 h-4 rounded-full bg-gray-100 animate-pulse mb-2"></div>
          <div className="w-full h-7 rounded-lg bg-gray-100 animate-pulse"></div>
        </div>
        <div className="pt-6 w-full">
          <div className="w-3/4 h-4 rounded-full bg-gray-100 animate-pulse mb-2"></div>
          <div className="w-full h-7 rounded-lg bg-gray-100 animate-pulse"></div>
        </div>
        <div className="pt-6 w-full">
          <div className="w-3/4 h-4 rounded-full bg-gray-100 animate-pulse mb-2"></div>
          <div className="w-full h-7 rounded-lg bg-gray-100 animate-pulse"></div>
        </div>
      </div>
      <div className="col-span-6">
        <div className="w-full">
          <div className="w-3/4 h-4 rounded-full bg-gray-100 animate-pulse mb-2"></div>
          <div className="w-full h-7 rounded-lg bg-gray-100 animate-pulse"></div>
        </div>
        <div className="pt-6 w-full">
          <div className="w-3/4 h-4 rounded-full bg-gray-100 animate-pulse mb-2"></div>
          <div className="w-full h-7 rounded-lg bg-gray-100 animate-pulse"></div>
        </div>
        <div className="pt-6 w-full">
          <div className="w-3/4 h-4 rounded-full bg-gray-100 animate-pulse mb-2"></div>
          <div className="w-full h-7 rounded-lg bg-gray-100 animate-pulse"></div>
        </div>
        <div className="pt-6 w-full">
          <div className="w-3/4 h-4 rounded-full bg-gray-100 animate-pulse mb-2"></div>
          <div className="w-full h-7 rounded-lg bg-gray-100 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const AccessLoading = () => {
  return (
    <div className="grid grid-cols-12 gap-3 w-full py-3">
      <div className="col-span-12">
        {[1, 2, 3, 4].map((item, k) => (
          <div
            key={k + 1}
            className={`${
              item !== 1 ? "pt-4" : "pt-2"
            } flex flex-row items-center justify-center gap-3 w-full`}
          >
            <div>
              <div className="h-7 w-7 rounded-full bg-gray-100 animate-pulse"></div>
            </div>
            <div className="h-7 w-full rounded-lg bg-gray-100 animate-pulse"></div>
            {[1, 2, 3, 4, 5].map((itm, i) => (
              <div key={i + 1}>
                <div className="h-7 w-12 rounded-lg bg-gray-100 animate-pulse"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const EmployeeBehaviorLoading = () => {
  return (
    <div className="grid grid-cols-12 gap-3 w-full py-3">
      <div className="col-span-12">
        {[1, 2, 3, 4].map((item, k) => (
          <div
            key={k + 1}
            className={`${
              item !== 1 ? "pt-4" : "pt-2"
            } flex flex-row items-center justify-center gap-3 w-full`}
          >
            <div>
              <div className="h-7 w-7 rounded-full bg-gray-100 animate-pulse"></div>
            </div>
            <div className="h-7 w-full rounded-lg bg-gray-100 animate-pulse"></div>
            {[1, 2].map((itm, i) => (
              <div key={i + 1}>
                <div className="h-7 w-12 rounded-lg bg-gray-100 animate-pulse"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const PositionCompetencyLoading = () => {
  return (
    <div className="grid grid-cols-12 gap-3 w-full py-3">
      <div className="col-span-12">
        {[1, 2, 3].map((item, k) => (
          <div key={k + 1} className="mb-4 pb-4">
            <div className="w-1/2 h-5 bg-gray-100 animate-pulse rounded-full mb-2"></div>
            {[1, 2, 3].map((mm, m) => (
              <div
                key={m + 1}
                className={`${
                  item !== 1 ? "mb-1" : "mb-1"
                } flex flex-row items-center justify-center gap-3 ml-10`}
              >
                <div>
                  <div className="h-4 w-4 rounded-full bg-gray-100 animate-pulse"></div>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 animate-pulse"></div>
                {[1, 2].map((itm, i) => (
                  <div key={i + 1}>
                    <div className="h-3 w-6 rounded-lg bg-gray-100 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

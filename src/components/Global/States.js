const LoadingState = ({ height = "auto", message = "Loading..." }) => {
    return (
        <div className="text-center flex flex-col justify-center" style={{ height }}>
            {message}
        </div>
    );
};

const ErrorState = ({ height = "auto", message = "An error occurred. Please try again." }) => {
    return (
        <div className="text-center flex flex-col justify-center text-red-500" style={{ height }}>
            {message}
        </div>
    );
};

const EmptyState = ({ height = "auto", message = "No products available." }) => {
    return (
        <div className="text-center w-full flex flex-col justify-center text-gray-600" style={{ height }}>
            {message}
        </div>
    );
};

export { LoadingState, ErrorState, EmptyState };
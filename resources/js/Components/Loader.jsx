const Loader = () => {
    return (
        <div className="fixed start-0 top-0 z-30 flex h-dvh w-full items-center justify-center">
            <div className="absolute start-0 top-0 h-full w-full bg-black opacity-70"></div>
            <div className="overlow-hidden z-50 h-20 rounded-full border-2 border-white bg-sky-900 p-5">
                <img
                    src={'/assets/logo.png'}
                    className="h-full w-full object-contain"
                    alt=""
                />
            </div>
        </div>
    );
};
export default Loader;

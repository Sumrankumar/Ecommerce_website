const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="d-flex min-vh-25 flex-column align-items-center justify-content-center gap-2 py-5">
      <div className="spinner-border text-primary" role="status" />
      <p className="text-secondary mb-0">{text}</p>
    </div>
  );
};

export default LoadingSpinner;

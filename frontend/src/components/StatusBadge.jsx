const statusClassMap = {
  pending: "text-bg-warning",
  shipped: "text-bg-info",
  delivered: "text-bg-success",
};

const StatusBadge = ({ status = "pending" }) => {
  const className = statusClassMap[status] || "text-bg-secondary";

  return (
    <span className={`badge rounded-pill text-uppercase ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

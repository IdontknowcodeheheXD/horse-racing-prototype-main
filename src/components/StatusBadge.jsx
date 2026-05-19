const statusClass = {
  Pending: "badge badge-pending",
  Confirmed: "badge badge-success",
  Active: "badge badge-success",
  Official: "badge badge-success",
  Unofficial: "badge badge-pending",
  Published: "badge badge-success",
  Sent: "badge badge-success",
  Rejected: "badge badge-danger",
  Banned: "badge badge-danger",
  Expired: "badge badge-danger",
  Disqualified: "badge badge-danger",
  Suspended: "badge badge-danger",
  Ineligible: "badge badge-danger",
  Draft: "badge badge-info",
  "In Progress": "badge badge-info",
  "Open Registration": "badge badge-info",
  Submitted: "badge badge-success",
  Minor: "badge badge-pending",
  Major: "badge badge-danger",
  "In Recovery": "badge badge-pending",
};

export default function StatusBadge({ status }) {
  return <span className={statusClass[status] || "badge"}>{status}</span>;
}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function QuickStatsCard({ icon, title, value, color }) {
  return (
    <div className={`card shadow-sm border-0 bg-${color} text-white`}>
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <h6 className="text-uppercase fw-bold mb-2">{title}</h6>
          <h3 className="fw-bold mb-0">{value}</h3>
        </div>
        <div className="ms-3">
          <FontAwesomeIcon icon={icon} size="2x" />
        </div>
      </div>
    </div>
  );
}

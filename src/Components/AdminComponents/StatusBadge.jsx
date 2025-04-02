const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Active'
      },
      expired: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Expired'
      },
      revoked: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Revoked'
      },
      pending: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: 'Pending'
      }
    };
  
    const config = statusConfig[status] || statusConfig.pending;
  
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };
  
  export default StatusBadge;

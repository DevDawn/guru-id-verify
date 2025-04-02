// Generate unique GURU ID (format: GURU-XXXXXX-XXXX)
export const generateGuruID = () => {
    // Get last 6 digits of current timestamp
    const timestampPart = Date.now().toString().slice(-6);
    
    // Generate random 4-digit number
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    
    return `GURU-${timestampPart}-${randomPart}`;
  };
  
  // Optional: Add other utility functions you might need
  export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
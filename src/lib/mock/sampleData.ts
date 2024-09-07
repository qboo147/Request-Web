// Define types for the claim data
type Claim = {
  id: number;
  projectName: string;
  staffName: string;
  from: string;
  to: string;
  totalHour: number;
  totalAmount: number;
  status: 'Approved' | 'Paid';
};

// Define statuses and sample project and staff names
const statuses = ['Approved', 'Paid'] as const;
const projectNames = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta'] as const;
const staffNames = ['Alice Johnson', 'Bob Smith', 'Charlie Davis', 'Diana Miller'] as const;

// Function to generate sample data
const generateSampleData = (): Claim[] => {
  const sampleData: Claim[] = [];

  for (let i = 1; i <= 50; i++) {
    const id = i;
    const projectName = projectNames[Math.floor(Math.random() * projectNames.length)];
    const staffName = staffNames[Math.floor(Math.random() * staffNames.length)];
    const fromDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const toDate = new Date(fromDate);
    toDate.setDate(fromDate.getDate() + Math.floor(Math.random() * 10));
    const totalHour = Math.floor(Math.random() * 100) + 1;
    const totalAmount = parseFloat((totalHour * (Math.random() * 50 + 10)).toFixed(2));
    const status = statuses[Math.floor(Math.random() * statuses.length)] as 'Approved' | 'Paid';

    sampleData.push({
      id,
      projectName,
      staffName,
      from: fromDate.toISOString().split('T')[0],
      to: toDate.toISOString().split('T')[0],
      totalHour,
      totalAmount, // Ensure this is a number
      status,
    });
  }

  return sampleData;
};

// Export sample data
export const sampleData = generateSampleData();

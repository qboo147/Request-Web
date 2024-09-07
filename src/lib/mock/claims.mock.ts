const claims_data = [
  {
    id: 4,
    status: "draft",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Alpha",
    role: "Developer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 3,
    status: "pending",
    staff_name: "Jane Smith",
    staff_department: "Software Development",
    staff_id: 2,
    project_name: "Project Alpha",
    role: "Technical Lead",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Reviewed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Assisted with feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 2,
    status: "paid",
    staff_name: "Emily Johnson",
    staff_department: "Quality Assurance",
    staff_id: 3,
    project_name: "Project Delta",
    role: "QA Engineer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Tested initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Tested feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 1,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 5,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 6,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Delta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 7,
    status: "draft",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Delta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 8,
    status: "pending",
    staff_name: "Jane Smith",
    staff_department: "Software Development",
    staff_id: 2,
    project_name: "Project Alpha",
    role: "Technical Lead",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Reviewed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Assisted with feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 9,
    status: "paid",
    staff_name: "Emily Johnson",
    staff_department: "Quality Assurance",
    staff_id: 3,
    project_name: "Project Alpha",
    role: "QA Engineer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Tested initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Tested feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 10,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 11,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 12,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 13,
    status: "draft",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Alpha",
    role: "Developer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 14,
    status: "pending",
    staff_name: "Jane Smith",
    staff_department: "Software Development",
    staff_id: 2,
    project_name: "Project Alpha",
    role: "Technical Lead",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Reviewed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Assisted with feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 15,
    status: "paid",
    staff_name: "Emily Johnson",
    staff_department: "Quality Assurance",
    staff_id: 3,
    project_name: "Project Alpha",
    role: "QA Engineer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Tested initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Tested feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 16,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 17,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 18,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 19,
    status: "draft",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Alpha",
    role: "Developer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 20,
    status: "pending",
    staff_name: "Jane Smith",
    staff_department: "Software Development",
    staff_id: 2,
    project_name: "Project Alpha",
    role: "Technical Lead",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Reviewed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Assisted with feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 21,
    status: "paid",
    staff_name: "Emily Johnson",
    staff_department: "Quality Assurance",
    staff_id: 3,
    project_name: "Project Alpha",
    role: "QA Engineer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Tested initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Tested feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 22,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 23,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 24,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 25,
    status: "draft",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Alpha",
    role: "Developer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 26,
    status: "pending",
    staff_name: "Jane Smith",
    staff_department: "Software Development",
    staff_id: 2,
    project_name: "Project Alpha",
    role: "Technical Lead",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Reviewed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Assisted with feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 27,
    status: "paid",
    staff_name: "Emily Johnson",
    staff_department: "Quality Assurance",
    staff_id: 3,
    project_name: "Project Alpha",
    role: "QA Engineer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Tested initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Tested feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 28,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 29,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 30,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 31,
    status: "draft",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Alpha",
    role: "Developer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 32,
    status: "pending",
    staff_name: "Jane Smith",
    staff_department: "Software Development",
    staff_id: 2,
    project_name: "Project Alpha",
    role: "Technical Lead",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Reviewed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Assisted with feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 33,
    status: "paid",
    staff_name: "Emily Johnson",
    staff_department: "Quality Assurance",
    staff_id: 3,
    project_name: "Project Alpha",
    role: "QA Engineer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Tested initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Tested feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 34,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 35,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 36,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Delta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 37,
    status: "draft",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Delta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 38,
    status: "pending",
    staff_name: "Jane Smith",
    staff_department: "Software Development",
    staff_id: 2,
    project_name: "Project Delta",
    role: "Technical Lead",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Reviewed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Assisted with feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 39,
    status: "paid",
    staff_name: "Emily Johnson",
    staff_department: "Quality Assurance",
    staff_id: 3,
    project_name: "Project Alpha",
    role: "QA Engineer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Tested initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Tested feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 40,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 41,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 42,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 43,
    status: "draft",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Alpha",
    role: "Developer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 44,
    status: "pending",
    staff_name: "Jane Smith",
    staff_department: "Software Development",
    staff_id: 2,
    project_name: "Project Alpha",
    role: "Technical Lead",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Reviewed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Assisted with feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 45,
    status: "paid",
    staff_name: "Emily Johnson",
    staff_department: "Quality Assurance",
    staff_id: 3,
    project_name: "Project Alpha",
    role: "QA Engineer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Tested initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Tested feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 46,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 47,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 48,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 49,
    status: "draft",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Alpha",
    role: "Developer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 50,
    status: "pending",
    staff_name: "Jane Smith",
    staff_department: "Software Development",
    staff_id: 2,
    project_name: "Project Alpha",
    role: "Technical Lead",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Reviewed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Assisted with feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 51,
    status: "paid",
    staff_name: "Emily Johnson",
    staff_department: "Quality Assurance",
    staff_id: 3,
    project_name: "Project Alpha",
    role: "QA Engineer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Tested initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Tested feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 52,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 53,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 54,
    status: "approved",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Beta",
    role: "Developer",
    project_duration: {
      from: new Date("2023-02-01T00:00:00Z"),
      to: new Date("2023-07-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-02-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-02-02T09:00:00Z"),
        to: new Date("2023-02-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-02-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-02-03T09:00:00Z"),
        to: new Date("2023-02-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 5,
    status: "rejected",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Alpha",
    role: "Developer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
  {
    id: 6,
    status: "cancelled",
    staff_name: "John Doe",
    staff_department: "Software Development",
    staff_id: 1,
    project_name: "Project Alpha",
    role: "Developer",
    project_duration: {
      from: new Date("2023-01-01T00:00:00Z"),
      to: new Date("2023-06-01T23:59:59Z")
    },
    record: [
      {
        date: new Date("2023-01-02T00:00:00Z"),
        day: "Mon",
        from: new Date("2023-01-02T09:00:00Z"),
        to: new Date("2023-01-02T17:00:00Z"),
        remarks: "Completed initial setup"
      },
      {
        date: new Date("2023-01-03T00:00:00Z"),
        day: "Tue",
        from: new Date("2023-01-03T09:00:00Z"),
        to: new Date("2023-01-03T17:00:00Z"),
        remarks: "Implemented feature X"
      },
    ],
    remarks: "No issues encountered.",
  },
];

export type ClaimsDataType = typeof claims_data;
export type Claim = typeof claims_data[number];

export default claims_data;

import staff_data from "./staff.mock";

const projects_data = [
  {
    name: "Project Alpha",
    code: "PA001",
    from: new Date("2023-01-01T00:00:00Z"),
    to: new Date("2023-06-01T23:59:59Z"),
    project_manager: staff_data[4],
    quality_assurance: staff_data[2],
    technical_lead: [staff_data[1]],
    business_analyst: [staff_data[3]],
    developers: [staff_data[0], staff_data[1]],
    testers: [staff_data[2]],
    technical_consultant: [staff_data[5]]
  },
  {
    name: "Project Beta",
    code: "PB001",
    from: new Date("2023-02-01T00:00:00Z"),
    to: new Date("2023-07-01T23:59:59Z"),
    project_manager: staff_data[4],
    quality_assurance: staff_data[2],
    technical_lead: [staff_data[1]],
    business_analyst: [staff_data[3]],
    developers: [staff_data[0], staff_data[1]],
    testers: [staff_data[2]],
    technical_consultant: [staff_data[5]],
  },
  {
    name: "Project Gamma",
    code: "PG001",
    from: new Date("2023-03-01T00:00:00Z"),
    to: new Date("2023-08-01T23:59:59Z"),
    project_manager: staff_data[4],
    quality_assurance: staff_data[2],
    technical_lead: [staff_data[1]],
    business_analyst: [staff_data[3]],
    developers: [staff_data[0], staff_data[1]],
    testers: [staff_data[2]],
    technical_consultant: [staff_data[5]],
  },
];

export default projects_data;

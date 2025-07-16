export const groups = [
  { id: "customer", label: "CUSTOMER", color: "#f28b82", y: 0 },
  { id: "rm", label: "Relationship Manager", color: "#fbbc04", y: 100 },
  { id: "risk", label: "RISKS ASSESSMENT", color: "#d7aefb", y: 200 },
  { id: "ops", label: "OPERATIONS", color: "#ccff90", y: 300 },
];

export const nodes = [
  {
    id: "n1",
    label: "Submit loan\napplication + documents",
    group: "customer",
    x: 100,
  },
  { id: "n2", label: "Upload to system (LOS)", group: "rm", x: 100 },
  { id: "n3", label: "Check CIC (Credit Report)", group: "risk", x: 100 },
  { id: "n4", label: "Analyze DTI + scoring", group: "risk", x: 300 },
  {
    id: "n5",
    label: "Verify income\nemployment, collateral",
    group: "rm",
    x: 300,
  },
  { id: "n6", label: "Issue approval letter", group: "risk", x: 500 },
  { id: "n7", label: "Input into Core Lending", group: "ops", x: 300 },
  { id: "n8", label: "Disburse loan", group: "ops", x: 500 },
  { id: "n9", label: "Finish", group: "customer", x: 700 },
];

export const edges = [
  { from: "n1", to: "n2" },
  { from: "n2", to: "n3" },
  { from: "n3", to: "n4" },
  { from: "n4", to: "n5" },
  { from: "n5", to: "n4" },
  { from: "n4", to: "n6" },
  { from: "n6", to: "n7" },
  { from: "n7", to: "n8" },
  { from: "n8", to: "n9" },
];

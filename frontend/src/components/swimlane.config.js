export const nodeDataArray = [
  { key: "CUSTOMER", isGroup: true, label: "Customer", color: "#f8d7da" },
  { key: "RM", isGroup: true, label: "Relationship Manager", color: "#fff3cd" },
  { key: "RISK", isGroup: true, label: "Risk Assessment", color: "#d1ecf1" },
  { key: "OPS", isGroup: true, label: "Operations", color: "#d4edda" },

  { key: 1, text: "Submit loan application", group: "CUSTOMER", loc: "0 0" },
  { key: 2, text: "Upload to LOS", group: "RM", loc: "0 150" },
  { key: 3, text: "Check CIC (Credit Report)", group: "RISK", loc: "0 300" },
  { key: 4, text: "Analyze DTI + scoring", group: "RISK", loc: "300 300" },
  { key: 5, text: "Verify income, collateral", group: "RM", loc: "600 150" },
  { key: 6, text: "Issue approval letter", group: "OPS", loc: "600 450" },
  { key: 7, text: "Input into Core Lending", group: "OPS", loc: "300 450" },
  { key: 8, text: "Disburse loan", group: "OPS", loc: "900 450" },
  { key: 9, text: "Input into Core Lending", group: "RISK", loc: "900 300" },
  { key: 10, text: "Finish", group: "CUSTOMER", loc: "900 0" },
  { key: 11, text: "Flag if risk > threshold", loc: "600 300" },
];

export const linkDataArray = [
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 4, to: 7 },
  { from: 7, to: 6 },
  { from: 6, to: 8 },
  { from: 8, to: 9 },
  { from: 9, to: 10 },
  { from: 7, to: 11 },
  { from: 11, to: 5 },
  { from: 4, to: 11 },
  { from: 6, to: 11 },
];

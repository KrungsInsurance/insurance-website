import type { CustomerProfile, Policy } from "./types.ts";

export const policies: Policy[] = [
  {
    id: "policy-motor-01",
    planId: "motor-01",
    policyNumber: "DEMO-MTR-0001",
    startsOn: "2025-09-20",
    renewsOn: "2026-09-20",
    holder: "ผู้ใช้เดโม",
  },
  {
    id: "policy-health-02",
    planId: "health-02",
    policyNumber: "DEMO-HLT-0002",
    startsOn: "2026-03-01",
    renewsOn: "2027-03-01",
    holder: "ผู้ใช้เดโม",
  },
  {
    id: "policy-life-01",
    planId: "life-01",
    policyNumber: "DEMO-LIF-0003",
    startsOn: "2026-09-10",
    renewsOn: "2027-09-10",
    holder: "ผู้ใช้เดโม",
  },
  {
    id: "policy-accident-01",
    planId: "accident-01",
    policyNumber: "DEMO-ACC-0004",
    startsOn: "2025-09-01",
    renewsOn: "2026-09-01",
    holder: "ผู้ใช้เดโม",
  },
];

export const demoProfile: CustomerProfile = {
  id: "demo-customer",
  displayName: "ผู้ใช้เดโม",
  preferredCategory: "health",
  budgetTHB: 20000,
  goals: [],
  contactWindow: "evening",
};

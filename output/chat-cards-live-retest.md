# Live card retest after root-cause fix

Two genuine Live requests against rebuilt8787. No retries, credentials read, or source edits. Raw sanitized evidence in `chat-cards-live-retest.json`; original six-case findings remain intact.

| Case | HTTP / mode | Time | Manual result |
|---|---|---:|---|
| AXA SmartDrive1 motor-01 property liability |200 / live|4,679ms|PASS: plans card specifically selects `thirdPartyProperty`; message gives5,000,000THB per occurrence, matching canonical motor-01 cell. No contradictory fallback wording.|
| Same named plan with health context and health-01 selected |200 / live|3,810ms|PASS: category question proposes motor and asks confirmation; no unrelated health facts, no motor detail before user confirms, empty suggestedIDs and no handoff.|

Both messages meet500-character maximum. Card descriptors contain identifiers/field keys only; actual card amounts remain canonical. These are API-level results, not assertions that browser clicks were tested by this agent. Root owns integrated browser validation. No need to rerun the four already-passing independent cases.

Previously failed detail case is resolved in this bounded retest; two passing cases are not a general accuracy estimate.

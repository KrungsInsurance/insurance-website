# Insurance API availability — 12 September 2026

The project currently uses a locally researched canonical catalog. No verified public API returning all Thai insurers' current products, promotions, prices and images was found in the bounded search for this change. This is not proof that no such service exists.

AXA Partners publishes API documentation for partner insurance distribution. Its quickstart says final partner specifications follow agreed project planning and requires OAuth2/privateAPIkeys/session tokens. This is an integration option after obtaining the relevant partnership/access; it does not establish access to AXA Thailand SmartDrive or every Thai insurer.

Primary source: https://developers.axapartners.com/credit-lifestyle-protection/quickstart
Additional provider portal: https://developers.axapartners.com/

OIC Open Insurance documentation describes consent and policy-data exchange, including SubmitConsent/GetConsent/GetData. It must not be treated as an anonymous marketing catalog or accessed using customer data for this demo.

Primary source located: https://oiceservice.oic.or.th/document/File/Law/1509/71cd497a-cc4a-46da-9e68-6dacf1db5da5.pdf.pdf

Decision for this authorized refresh: use publicly published official product imagery with page provenance, retain the existing sourced catalog and server-only Live OpenAI integration, and add no unverified external insurance integration.

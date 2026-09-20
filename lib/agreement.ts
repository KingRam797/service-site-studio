export const AGREEMENT_VERSION = "2026-09-20";
export const AGREEMENT_PDF = "/documents/push2start-agreement-2026-09-20.pdf";

export function requireAgreement(formData: FormData) {
  if (formData.get("agreementAccepted") !== "yes" || formData.get("agreementVersion") !== AGREEMENT_VERSION) {
    throw new Error("Please read and accept the current build agreement before continuing.");
  }
}

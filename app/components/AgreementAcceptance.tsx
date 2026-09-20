import { AGREEMENT_PDF, AGREEMENT_VERSION } from "@/lib/agreement";

export default function AgreementAcceptance() {
  return <div className="agreement-acceptance">
    <input type="hidden" name="agreementVersion" value={AGREEMENT_VERSION} />
    <label><input type="checkbox" name="agreementAccepted" value="yes" required /> I am authorized to accept the build agreement and project scope for this client, and I agree to their terms.</label>
    <p><a href="/terms" target="_blank" rel="noopener noreferrer">Read the agreement</a> · <a href={AGREEMENT_PDF} target="_blank" rel="noopener noreferrer">Download PDF ({AGREEMENT_VERSION})</a></p>
  </div>;
}

import type { Metadata } from "next";
import LegalPage from "@/components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | Project Submission Dashboard",
  description:
    "Read the terms for using the project submission and review dashboard.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These terms apply when you access or use the project submission and review dashboard."
    >
      <section>
        <h2>Using the dashboard</h2>
        <p>
          The dashboard allows students to submit project details and mentors or
          admins to review them. You agree to use it only for lawful purposes
          and in accordance with these terms.
        </p>
      </section>

      <section>
        <h2>Your account</h2>
        <p>
          Keep your sign-in credentials secure and provide accurate information
          when creating an account. You are responsible for activity carried out
          through your account. Contact the service administrator if you believe
          your account has been accessed without permission.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>You must not:</p>
        <ul className="mt-3">
          <li>
            Use the platform to violate any law or another person&apos;s rights.
          </li>
          <li>
            Attempt to access accounts, records, or areas you are not authorized
            to use.
          </li>
          <li>
            Interfere with the platform, its security, or other users&apos;
            access.
          </li>
          <li>
            Upload content that is unlawful, harmful, or that you do not have
            permission to share.
          </li>
        </ul>
      </section>

      <section>
        <h2>Submitted content</h2>
        <p>
          You are responsible for the project details and URLs you submit and
          must have permission to share them. You allow the dashboard to store
          and display those details to authorized reviewers for submission
          review.
        </p>
      </section>

      <section>
        <h2>Availability and changes</h2>
        <p>
          Features may change over time, and the platform may occasionally be
          unavailable for maintenance or other reasons. We do not guarantee
          uninterrupted availability. We may update these terms when the service
          or its requirements change; the current version will be published on
          this page.
        </p>
      </section>

      <section>
        <h2>Suspension or termination</h2>
        <p>
          Access may be restricted or suspended when necessary to protect the
          platform or its users, or when these terms are violated. Contact the
          service administrator about account access or role-related decisions.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          For questions about your account or dashboard use, contact the service
          administrator.
        </p>
      </section>
    </LegalPage>
  );
}

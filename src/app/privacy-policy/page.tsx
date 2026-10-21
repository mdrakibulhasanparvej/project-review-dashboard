import type { Metadata } from "next";
import LegalPage from "@/components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Project Submission Dashboard",
  description:
    "Learn how the project submission dashboard handles account and submission information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy describes the information handled when you use the project submission and review dashboard."
    >
      <section>
        <h2>Information we handle</h2>
        <p>
          The dashboard handles information needed to support sign-in,
          submissions, and review. This may include:
        </p>
        <ul className="mt-3">
          <li>Account details such as your name and email address.</li>
          <li>
            Project details you submit, including repository and live URLs,
            descriptions, review status, and feedback.
          </li>
          <li>
            Information you provide when contacting or using features of the
            platform.
          </li>
        </ul>
      </section>

      <section>
        <h2>How information is used</h2>
        <p>
          Information is used to authenticate users, receive student project
          submissions, allow mentors or admins to review them, protect the
          service, and respond to account requests.
        </p>
      </section>

      <section>
        <h2>Sign-in</h2>
        <p>
          Authentication uses your account credentials and a secure session
          cookie. The dashboard does not provide third-party sign-in or payment
          processing.
        </p>
      </section>

      <section>
        <h2>Cookies and session information</h2>
        <p>
          The platform uses browser storage and/or cookies required to maintain
          your sign-in session and remember interface preferences. Disabling
          these may prevent sign-in or other features from working correctly.
        </p>
      </section>

      <section>
        <h2>Access and sharing</h2>
        <p>
          Submission details are visible to the student who submitted them and
          authorized mentors or admins reviewing submissions. Information may
          also be disclosed when required by law or necessary to protect the
          service and its users.
        </p>
      </section>

      <section>
        <h2>Retention and your choices</h2>
        <p>
          Information is retained as needed to provide the service and maintain
          account and submission records. For requests to access, correct, or
          delete account information, contact the service administrator.
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          This policy may be updated as the platform changes. The latest version
          and its update date will be published on this page.
        </p>
      </section>
    </LegalPage>
  );
}

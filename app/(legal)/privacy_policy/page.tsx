import Header from "@/components/header";

export default function PrivacyPolicyPage() {
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <div className="text-muted-foreground px-4 py-8 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-foreground">
            Privacy Policy
          </h1>

          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-foreground">Introduction</h2>
            <p className="text-sm">
              We take the protection of your personal data very seriously. This
              Privacy Policy explains how we collect, use, and protect your
              personal data in accordance with the EU General Data Protection
              Regulation (GDPR) and Austrian data protection law.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-foreground">
              Data Controller
            </h2>
            <p className="text-sm">
              <strong>
                START Wien - Verein zur Förderung von Unternehmertum
              </strong>
              <br />
              Canisiusgasse 21A/24
              <br />
              1090 Vienna, Austria
              <br />
              Email:{" "}
              <a href="mailto:circle@start-vienna.com" className="underline">
                circle@start-vienna.com
              </a>
            </p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-foreground">
              Types of Personal Data Collected
            </h2>
            <p className="text-sm mb-2">
              We may collect the following personal data:
            </p>
            <ul className="text-sm list-disc list-inside">
              <li>Contact information (name, email, phone)</li>
              <li>Usage data (IP address, browser type, pages visited)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-foreground">Legal Basis</h2>
            <p className="text-sm">
              Processing is based on your consent (Article 6(1)(a) GDPR) or our
              legitimate interests (Article 6(1)(f) GDPR).
            </p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-foreground">Your Rights</h2>
            <p className="text-sm">
              Under GDPR, you have the right to access, correct, delete, or port
              your personal data. To exercise these rights, please contact us at{" "}
              <a href="mailto:circle@start-vienna.com" className="underline">
                circle@start-vienna.com
              </a>
              .
            </p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-foreground">
              Data Retention
            </h2>
            <p className="text-sm">
              We retain personal data only as long as necessary to fulfill the
              purposes for which it was collected.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-foreground">Contact</h2>
            <p className="text-sm">
              For questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:circle@start-vienna.com" className="underline">
                circle@start-vienna.com
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

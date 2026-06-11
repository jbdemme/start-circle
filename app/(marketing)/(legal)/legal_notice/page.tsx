import Header from "@/components/header";

export default function LegalNoticePage() {
  return (
    <>
      <main className="text-muted-foreground px-4 py-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-foreground">
          Legal Notice (Impressum)
        </h1>

        <div className="mb-6">
          <p className="font-semibold text-foreground mb-2">
            This website is an offer by:
          </p>
          <p className="text-sm">
            <strong>
              START Wien - Verein zur Förderung von Unternehmertum
            </strong>
            <br />
            Canisiusgasse 21A/24
            <br />
            1090 Vienna, Austria
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-foreground">
            Represented by the Board (Vorstand)
          </h2>
          <p className="text-sm">
            President: Matheus Verweijen
            <br />
            Vice President: Judith Leonhard
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-foreground">Register Entry</h2>
          <p className="text-sm">
            Registering Authority: Federal Ministry of the Interior (Austria)
            <br />
            Registration Number (ZVR): 1286686737
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-foreground">Contact</h2>
          <p className="text-sm">
            Email:{" "}
            <a href="mailto:circle@start-vienna.com" className="underline">
              circle@start-vienna.com
            </a>
            <br />
            Phone: +43 664 2427191
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-foreground">VAT ID</h2>
          <p className="text-sm">VAT exempt</p>
        </div>

        <hr className="my-6" />

        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-foreground">
            EU Dispute Resolution / Consumer Protection
          </h2>
          <p className="text-sm mb-2">
            The European Commission provides a platform for online dispute
            resolution (ODR):{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . We are neither obliged nor willing to participate in dispute
            resolution proceedings before a consumer arbitration board.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-foreground">
            Liability for Content
          </h2>
          <p className="text-sm mb-2">
            We make every effort to keep the information on our website up to
            date, complete, and correct. However, we cannot accept any liability
            for it. According to § 7 para. 1 ECG, we are responsible for our own
            content on these pages under general law. However, according to §§ 8
            to 10 ECG, we are not obliged to monitor transmitted or stored
            third-party information or to investigate circumstances indicating
            illegal activity
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-foreground">
            Liability for Links
          </h2>
          <p className="text-sm mb-2">
            Our website contains links to external websites. We have no
            influence over the content of those websites. The respective
            provider or operator is always responsible for the content of linked
            sites. Illegal content was not recognizable at the time of linking.
            Permanent monitoring of linked sites is unreasonable without
            specific indications of a violation. Upon notification of
            violations, such links will be removed immediately.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-foreground">Copyright</h2>
          <p className="text-sm mb-2">
            The content and works on this website are subject to Austrian
            copyright law. Reproduction, editing, distribution, and any kind of
            use outside the limits of copyright require the prior written
            consent of the respective author or creator.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-foreground">
            Data Protection (GDPR)
          </h2>
          <p className="text-sm">
            We take the protection of your personal data very seriously.
            Processing of personal data on this website is carried out in
            accordance with the EU General Data Protection Regulation (GDPR) and
            Austrian data protection law. For details, please refer to our{" "}
            <a href="/privacy_policy" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
    </>
  );
}

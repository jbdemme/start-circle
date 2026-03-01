import TalentApplicationForm from "@/components/forms/talent_application_form";
import { submitTalentApplication } from "./_actions";

export default function TalentApplicationPage() {
  return (
    <div className="flex justify-center items-center p-10">
      {/* <TalentOnboardingForm /> */}
      <TalentApplicationForm onSubmit={submitTalentApplication} />
    </div>
  );
}

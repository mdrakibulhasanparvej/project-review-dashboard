import ProfileIdentityCard from "@/components/modules/profile/ProfileIdentityCard";
import StudentProfileForm from "@/components/modules/profile/StudentProfileForm";
import { Badge } from "@/components/ui/badge";

export default function StudentProfilePage() {
  return (
    <main className="flex flex-1 flex-col gap-6 bg-muted/20 p-4 md:p-8">
      <section>
        <Badge variant="outline" className="mb-3">
          Student workspace
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">My profile</h1>
        <p className="mt-2 text-muted-foreground">
          Keep your details up to date so mentors know who they are working
          with.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <ProfileIdentityCard />
        <StudentProfileForm />
      </div>
    </main>
  );
}

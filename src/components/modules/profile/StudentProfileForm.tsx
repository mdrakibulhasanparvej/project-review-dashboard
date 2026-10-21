"use client";

import { IconDeviceFloppy } from "@tabler/icons-react";
import type { FetchError } from "ofetch";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetProfile, useUpdateStudentProfile } from "@/hooks";
import type { StudentProfileUpdatePayload } from "@/types";
import triggerToast from "@/utils/triggerToast";
import ProfileFields, { type ProfileFieldsValues } from "./ProfileFields";

const emptyForm: ProfileFieldsValues = {
  date_of_birth: "",
  gender: "",
  phone: "",
  address: "",
  bio: "",
};

export default function StudentProfileForm() {
  const profileQuery = useGetProfile();
  const updateProfile = useUpdateStudentProfile();
  const [form, setForm] = useState(emptyForm);
  const profile = profileQuery.data?.data?.student;

  useEffect(() => {
    if (!profile) return;
    setForm({
      date_of_birth: profile.date_of_birth?.slice(0, 10) ?? "",
      gender: profile.gender ?? "",
      phone: profile.phone ?? "",
      address: profile.address ?? "",
      bio: profile.bio ?? "",
    });
  }, [profile]);

  const change = (patch: Partial<ProfileFieldsValues>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: StudentProfileUpdatePayload = {
      ...(form.date_of_birth && { date_of_birth: form.date_of_birth }),
      ...(form.gender && { gender: form.gender }),
      ...(form.phone.trim() && { phone: form.phone.trim() }),
      ...(form.address.trim() && { address: form.address.trim() }),
      ...(form.bio.trim() && { bio: form.bio.trim() }),
    };

    updateProfile.mutate(payload, {
      onSuccess: (response) => {
        triggerToast({
          type: response.success ? "success" : "error",
          title: response.success ? "Profile updated" : "Profile update failed",
          description: response.success
            ? "Your student profile was saved."
            : response.message || "Could not update your profile.",
        });
      },
      onError: (error: FetchError) => {
        triggerToast({
          type: "error",
          title: "Profile update failed",
          description: error.data?.message || "Could not update your profile.",
        });
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student details</CardTitle>
        <CardDescription>
          Update the student profile fields supported by the backend.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {profileQuery.isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading profile…
          </p>
        ) : profileQuery.isError || !profile ? (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            role="alert"
          >
            Could not load your student profile.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <ProfileFields values={form} onChange={change} idPrefix="student" />
            <div className="flex justify-end border-t pt-5">
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? <Spinner /> : <IconDeviceFloppy />}
                {updateProfile.isPending ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

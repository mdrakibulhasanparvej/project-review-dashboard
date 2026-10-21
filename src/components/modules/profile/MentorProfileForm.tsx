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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGetProfile, useUpdateMentorProfile } from "@/hooks";
import type { MentorProfileUpdatePayload } from "@/types";
import triggerToast from "@/utils/triggerToast";
import ProfileFields, { type ProfileFieldsValues } from "./ProfileFields";

interface MentorFormValues extends ProfileFieldsValues {
  designation: string;
  specialization: string;
  graduated_from: string;
  graduation_year: string;
}

const emptyForm: MentorFormValues = {
  designation: "",
  specialization: "",
  graduated_from: "",
  graduation_year: "",
  date_of_birth: "",
  gender: "",
  phone: "",
  address: "",
  bio: "",
};

export default function MentorProfileForm() {
  const profileQuery = useGetProfile();
  const updateProfile = useUpdateMentorProfile();
  const [form, setForm] = useState(emptyForm);
  const [graduationYearError, setGraduationYearError] = useState("");
  const profile = profileQuery.data?.data?.mentor;

  useEffect(() => {
    if (!profile) return;
    setForm({
      designation: profile.designation ?? "",
      specialization: profile.specialization ?? "",
      graduated_from: profile.graduated_from ?? "",
      graduation_year: profile.graduation_year?.toString() ?? "",
      date_of_birth: profile.date_of_birth?.slice(0, 10) ?? "",
      gender: profile.gender ?? "",
      phone: profile.phone ?? "",
      address: profile.address ?? "",
      bio: profile.bio ?? "",
    });
  }, [profile]);

  const change = (patch: Partial<MentorFormValues>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const changeMentorField = (field: keyof MentorFormValues, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      form.graduation_year &&
      (!Number.isInteger(Number(form.graduation_year)) ||
        Number(form.graduation_year) < 1)
    ) {
      setGraduationYearError("Enter a positive whole number");
      return;
    }
    setGraduationYearError("");

    const payload: MentorProfileUpdatePayload = {
      designation: form.designation.trim(),
      specialization: form.specialization.trim(),
      graduated_from: form.graduated_from.trim(),
      ...(form.graduation_year && {
        graduation_year: Number(form.graduation_year),
      }),
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
            ? "Your mentor profile was saved."
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
        <CardTitle>Professional details</CardTitle>
        <CardDescription>
          Update the mentor profile fields supported by the backend.
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
            Could not load your mentor profile.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="designation">Designation</FieldLabel>
                <Input
                  id="designation"
                  value={form.designation}
                  onChange={(event) =>
                    changeMentorField("designation", event.target.value)
                  }
                  placeholder="Senior Mentor"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="specialization">Specialization</FieldLabel>
                <Input
                  id="specialization"
                  value={form.specialization}
                  onChange={(event) =>
                    changeMentorField("specialization", event.target.value)
                  }
                  placeholder="Web Development"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="graduated-from">Graduated from</FieldLabel>
                <Input
                  id="graduated-from"
                  value={form.graduated_from}
                  onChange={(event) =>
                    changeMentorField("graduated_from", event.target.value)
                  }
                  placeholder="University or institution"
                />
              </Field>
              <Field data-invalid={Boolean(graduationYearError)}>
                <FieldLabel htmlFor="graduation-year">
                  Graduation year
                </FieldLabel>
                <Input
                  id="graduation-year"
                  type="number"
                  min={1}
                  step={1}
                  value={form.graduation_year}
                  onChange={(event) => {
                    setGraduationYearError("");
                    changeMentorField("graduation_year", event.target.value);
                  }}
                  aria-invalid={Boolean(graduationYearError)}
                />
                {graduationYearError && (
                  <FieldError>{graduationYearError}</FieldError>
                )}
              </Field>
            </div>

            <ProfileFields values={form} onChange={change} idPrefix="mentor" />

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

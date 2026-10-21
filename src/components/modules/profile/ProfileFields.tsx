"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Gender } from "@/types";

export interface ProfileFieldsValues {
  date_of_birth: string;
  gender: Gender | "";
  phone: string;
  address: string;
  bio: string;
}

interface ProfileFieldsProps {
  values: ProfileFieldsValues;
  onChange: (patch: Partial<ProfileFieldsValues>) => void;
  idPrefix?: string;
}

export default function ProfileFields({
  values,
  onChange,
  idPrefix = "profile",
}: ProfileFieldsProps) {
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field>
        <FieldLabel htmlFor={id("date-of-birth")}>Date of birth</FieldLabel>
        <Input
          id={id("date-of-birth")}
          type="date"
          value={values.date_of_birth}
          onChange={(event) => onChange({ date_of_birth: event.target.value })}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor={id("gender")}>Gender</FieldLabel>
        <Select
          value={values.gender || "UNSPECIFIED"}
          onValueChange={(value) =>
            onChange({
              gender:
                value === "MALE" ||
                value === "FEMALE" ||
                value === "KINDER" ||
                value === "OTHER"
                  ? value
                  : "",
            })
          }
        >
          <SelectTrigger id={id("gender")} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UNSPECIFIED">Not specified</SelectItem>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
            <SelectItem value="KINDER">Kinder</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor={id("phone")}>Phone</FieldLabel>
        <Input
          id={id("phone")}
          type="tel"
          value={values.phone}
          onChange={(event) => onChange({ phone: event.target.value })}
          placeholder="01712345678"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor={id("address")}>Address</FieldLabel>
        <Input
          id={id("address")}
          value={values.address}
          onChange={(event) => onChange({ address: event.target.value })}
          placeholder="City, Country"
        />
      </Field>

      <Field className="md:col-span-2">
        <FieldLabel htmlFor={id("bio")}>Bio</FieldLabel>
        <Textarea
          id={id("bio")}
          rows={4}
          value={values.bio}
          onChange={(event) => onChange({ bio: event.target.value })}
          placeholder="Share a short introduction."
        />
      </Field>
    </div>
  );
}

"use client";

import { IconCamera, IconDeviceFloppy, IconUpload } from "@tabler/icons-react";
import type { FetchError } from "ofetch";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  useGetProfile,
  useUpdateProfilePicture,
  useUpdateUserProfile,
} from "@/hooks";
import getInitials from "@/utils/getInitials";
import triggerToast from "@/utils/triggerToast";

const MAX_PICTURE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProfileIdentityCard() {
  const profileQuery = useGetProfile();
  const updateName = useUpdateUserProfile();
  const updatePicture = useUpdateProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = profileQuery.data?.data;
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pictureError, setPictureError] = useState("");

  const displayName = name || profile?.name || "";

  const handleNameChange = (value: string) => {
    setName(value);
    setNameError("");
  };

  const saveName = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }
    if (trimmed === profile?.name) {
      setName("");
      return;
    }

    updateName.mutate(
      { name: trimmed },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Name update failed",
              description: response.message || "Could not update your name.",
            });
            return;
          }
          triggerToast({
            type: "success",
            title: "Name updated",
            description: "Your display name has been saved.",
          });
          setName("");
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Name update failed",
            description: error.data?.message || "Could not update your name.",
          });
        },
      },
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPictureError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setPictureError("Choose a JPG, PNG or WebP image");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }
    if (file.size > MAX_PICTURE_SIZE_BYTES) {
      setPictureError("Image must be smaller than 5 MB");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const uploadPicture = () => {
    if (!selectedFile) {
      setPictureError("Choose an image first");
      return;
    }

    updatePicture.mutate(selectedFile, {
      onSuccess: (response) => {
        if (!response.success) {
          triggerToast({
            type: "error",
            title: "Picture update failed",
            description: response.message || "Could not upload the picture.",
          });
          return;
        }
        triggerToast({
          type: "success",
          title: "Picture updated",
          description: "Your profile picture has been saved.",
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      onError: (error: FetchError) => {
        triggerToast({
          type: "error",
          title: "Picture update failed",
          description: error.data?.message || "Could not upload the picture.",
        });
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Your display name and profile picture across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage
                src={profile?.profile_url ?? undefined}
                alt={profile?.name ?? "User profile"}
              />
              <AvatarFallback>
                {getInitials(profile?.name ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">
                {profile?.name ?? "Loading profile…"}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {profile?.email ?? ""}
              </p>
            </div>
          </div>

          <Field data-invalid={Boolean(nameError)}>
            <FieldLabel htmlFor="display-name">Display name</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="display-name"
                value={displayName}
                placeholder={profile?.name ?? "Your name"}
                onChange={(event) => handleNameChange(event.target.value)}
                aria-invalid={Boolean(nameError)}
              />
              <Button
                type="button"
                variant="outline"
                disabled={updateName.isPending || name.trim() === profile?.name}
                onClick={saveName}
              >
                {updateName.isPending ? <Spinner /> : <IconDeviceFloppy />}
                Save
              </Button>
            </div>
            {nameError ? (
              <FieldError>{nameError}</FieldError>
            ) : (
              <FieldDescription>
                This is the name mentors and admins see next to your work.
              </FieldDescription>
            )}
          </Field>

          <Field data-invalid={Boolean(pictureError)}>
            <FieldLabel htmlFor="profile-picture">Profile picture</FieldLabel>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                id="profile-picture"
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                onChange={handleFileChange}
                aria-invalid={Boolean(pictureError)}
              />
              <Button
                type="button"
                variant="outline"
                disabled={updatePicture.isPending || !selectedFile}
                onClick={uploadPicture}
              >
                {updatePicture.isPending ? <Spinner /> : <IconUpload />}
                Upload
              </Button>
            </div>
            {pictureError ? (
              <FieldError>{pictureError}</FieldError>
            ) : (
              <FieldDescription>
                <IconCamera
                  className="mr-1 inline size-3.5 align-text-bottom"
                  aria-hidden="true"
                />
                JPG, PNG or WebP up to 5 MB.
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

import type { LucideIcon } from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
};

export type Treatment = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  subTreatments: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  text: string;
  avatar: string; // Corresponds to placeholder image ID
};

export type WhyChooseUsItem = {
    title: string;
    description: string;
    icon: LucideIcon;
};

export type DoctorProfile = {
  name: string;
  title: string;
  bio: string;
  qualifications: string[];
  specializations: string[];
  certifications: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  imageHint: string;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  diagnosis: string;
  treatmentPlan: string;
  prescribedExercises: string;
  registrationDate: string;
  sessions: { date: string; amount: number; paid: boolean }[];
};

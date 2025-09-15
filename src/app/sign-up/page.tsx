import { Metadata } from "next";
import SignUpClient from "./SignUpClient";

export const metadata: Metadata = {
  title: "Sign Up - Evvalley",
  description: "Create your Evvalley account to start buying and selling electric vehicles",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignUpPage() {
  return <SignUpClient />;
}

import { Metadata } from "next";
import SignInClient from "./SignInClient";

export const metadata: Metadata = {
  title: "Sign In - Evvalley",
  description: "Sign in to your Evvalley account to access your electric vehicle marketplace",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignInPage() {
  return <SignInClient />;
}

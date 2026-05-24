import Image from "next/image"
import Link from "next/link"
import { createElement } from "react"

import { ResetPasswordForm } from "@/views/auth/reset-password/reset-password-form"

export default function ResetPasswordPage() {
  return createElement(
    "div",
    { className: "grid w-full min-h-svh lg:grid-cols-2" },
    createElement(
      "div",
      { className: "flex flex-col gap-4 p-6 md:p-10" },
      createElement(
        "div",
        { className: "hidden md:flex justify-start gap-2" },
        createElement(
          Link,
          { href: "/", className: "flex items-center gap-2 font-medium" },
          createElement(Image, {
            src: "/brand/logo-event-reco.png",
            alt: "Event Reco",
            width: 160,
            height: 46,
            className: "object-contain",
          }),
        ),
      ),
      createElement(
        "div",
        { className: "flex flex-col flex-1 items-start justify-center gap-4" },
        createElement(
          "div",
          { className: "md:hidden flex justify-center gap-2" },
          createElement(
            Link,
            { href: "/", className: "flex items-center gap-2 font-medium" },
            createElement(Image, {
              src: "/brand/logo-event-reco.png",
              alt: "Event Reco",
              width: 160,
              height: 46,
              className: "object-contain",
            }),
          ),
        ),
        createElement("div", { className: "w-full max-w-xs" }, createElement(ResetPasswordForm)),
      ),
      createElement(
        "div",
        { className: "text-xs text-muted-foreground" },
        "Copyright © 2026 - Event Reco Africa - ",
        createElement(
          "a",
          { href: "#", className: "underline underline-offset-4 hover:text-foreground" },
          "Conditions Générales d'Utilisation",
        ),
        " - Développé par ",
        createElement(
          "a",
          { href: "https://asterisk-technologies.com/", target: "_blank", rel: "noopener noreferrer", className: "underline underline-offset-4 hover:text-foreground" },
          "Asterisk Technologies",
        ),
      ),
    ),
    createElement(
      "div",
      { className: "bg-muted relative hidden lg:block" },
      createElement("img", {
        src: "/assets/auth-img/event-Reco-bg.avif",
        alt: "event Reco Background",
        className: "absolute inset-0 h-full w-full object-cover",
      }),
    ),
  )
}

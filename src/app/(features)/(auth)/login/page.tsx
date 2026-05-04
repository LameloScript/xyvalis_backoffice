import Image from "next/image"
import Link from "next/link"
import { createElement } from "react"

import { LoginForm } from "@/views/auth/login/login-form"

export default function LoginPage() {
  return createElement(
    "div",
    { className: "grid w-full min-h-svh lg:grid-cols-2" },
    createElement(
      "div",
      { className: "flex flex-col gap-4 p-6 md:p-10" },
      createElement(
        "div",
        { className: "flex justify-center gap-2 md:justify-start" },
        createElement(
          Link,
          { href: "/", className: "flex items-center gap-2 font-medium" },
          createElement(Image, {
            src: "/assets/logo-brand/logo.png",
            alt: "Xyvalis Delivery",
            width: 160,
            height: 46,
            className: "object-contain",
          }),
        ),
      ),
      createElement(
        "div",
        { className: "flex flex-1 items-center justify-center" },
        createElement("div", { className: "w-full max-w-xs" }, createElement(LoginForm)),
      ),
      createElement(
        "div",
        { className: "text-xs text-muted-foreground" },
        "Copyright © 2026 - Xyvalis Delivery - ",
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
        src: "/assets/auth-img/xyvalis-delivery-bg.avif",
        alt: "Xyvalis Delivery Background",
        className: "absolute inset-0 h-full w-full object-cover",
      }),
    ),
  )
}

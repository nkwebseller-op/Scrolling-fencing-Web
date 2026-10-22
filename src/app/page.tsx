import FrameScrubber from "@/components/FrameScrubber";

export default function Home() {
  return (
    <main>
      {/* Scroll-driven hero animation */}
      <FrameScrubber />

      {/* Content sections below the hero */}
      <section
        style={{
          background: "#0a0a0a",
          color: "#fff",
          padding: "6rem 2rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
          }}
        >
          Built to last a lifetime
        </h2>
        <p
          style={{
            fontSize: "1.125rem",
            color: "rgba(255,255,255,0.6)",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          From wood privacy panels to ornamental iron and vinyl, we install
          fences that protect your property and elevate your curb appeal.
        </p>
      </section>

      <section
        style={{
          background: "#111",
          color: "#fff",
          padding: "6rem 2rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
          }}
        >
          Get a free estimate
        </h2>
        <p
          style={{
            fontSize: "1.125rem",
            color: "rgba(255,255,255,0.6)",
            maxWidth: "520px",
            margin: "0 auto 2rem",
            lineHeight: 1.7,
          }}
        >
          Tell us about your project and we&apos;ll provide a detailed quote
          within 24 hours.
        </p>
        <a
          href="tel:+18005550100"
          style={{
            display: "inline-block",
            padding: "0.875rem 2.5rem",
            background: "#fff",
            color: "#000",
            borderRadius: "9999px",
            fontWeight: 600,
            fontSize: "1rem",
            textDecoration: "none",
          }}
        >
          Call us today
        </a>
      </section>
    </main>
  );
}

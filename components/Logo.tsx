export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl sm:text-5xl",
  };

  return (
    <span className={`font-display font-bold ${sizes[size]} tracking-tight`}>
      <span className="text-cream">EducaTurdi</span>{" "}
      <span className="italic font-semibold text-fossil">Languages</span>
    </span>
  );
}

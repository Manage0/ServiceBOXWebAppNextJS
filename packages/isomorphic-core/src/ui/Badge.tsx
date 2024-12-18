import cn from "@core/utils/class-names";

type BadgeProps = {
  text: string | "Új"; // Badge text TODO ezt vedd ki majd a munkalapból
  className?: string; // Optional custom classes
};

export default function Badge({ text, className }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-[#FFE2A5] px-3 py-1",
        className
      )}
    >
      {/* Dot */}
      <div className="h-[8px] w-[8px] rounded-full bg-[#0B9488] mr-2"></div>
      {/* Text */}
      <span className="text-[#0B9488] font-medium">{text}</span>
    </div>
  );
}

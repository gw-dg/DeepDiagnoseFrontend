import { ThemeController } from "./ThemeController";

export default function Header() {
  return (
    <div className="flex justify-center items-center mt-2 text-2xl md:text-3xl lg:text-5xl">
      DeepDiagnose
      <div className="absolute top-4 right-4">
        <ThemeController />
      </div>
    </div>
  );
}

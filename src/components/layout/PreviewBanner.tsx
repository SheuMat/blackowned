import { site } from "@/lib/site";

export function PreviewBanner() {
  if (!site.previewMode) return null;
  return (
    <div className="bg-espresso px-4 py-2 text-center text-xs font-medium text-cream sm:text-[13px]">
      <span className="mr-2 inline-block rounded-full bg-sunflower px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-espresso">
        Preview
      </span>
      Our new website is in preview. Anything marked “Sample” is for demonstration.
    </div>
  );
}

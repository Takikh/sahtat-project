import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

type ProjectImageInput = {
  image_url?: string | null;
  type?: string | null;
  name?: string | null;
  slug?: string | null;
};

export function resolveProjectImage(input: ProjectImageInput): string {
  if (input.image_url && input.image_url.trim().length > 0) {
    return input.image_url;
  }

  const key = `${input.slug || ""} ${input.name || ""}`.toLowerCase();

  if (key.includes("quimmah") || key.includes("quimma") || key.includes("el-quimmah")) {
    return project2;
  }

  if (key.includes("amir")) {
    return project1;
  }

  if (key.includes("commercial") || key.includes("locaux")) {
    return project3;
  }

  if ((input.type || "").toLowerCase() === "villa") {
    return project4;
  }

  if ((input.type || "").toLowerCase() === "commercial") {
    return project3;
  }

  return project1;
}

import { Database } from "./database";

export type Artifact = Database["public"]["Tables"]["artifact"]["Row"];
export type ArtifactInsert = Database["public"]["Tables"]["artifact"]["Insert"];
export type ArtifactUpdate = Database["public"]["Tables"]["artifact"]["Update"];
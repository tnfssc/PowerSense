type Value = {
  name: string;
  value: string;
  units: string;
};
type Soln = {
  questionFile: string;
  parameters: Array<Value>;
  solutions: Array<Value>;
};
type Paper = Array<Soln>;
export type SolutionFile = Record<string, Paper>;
type MCA = "a" | "b" | "c" | "d";
export type MCASolnFile = Record<string, Array<MCA>>;

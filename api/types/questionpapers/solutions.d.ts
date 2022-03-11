type Value = {
  name: string;
  value: number;
  units: string;
};
type Soln = {
  questionFile: string;
  parameters: Array<Value>;
  solutions: Array<Value>;
};
type Paper = Array<Soln>;
export type SolutionFile = Record<string, Paper>;

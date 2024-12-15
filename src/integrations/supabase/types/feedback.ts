export type Feedback = {
  id: number;
  name: string;
  mobile_number: string;
  fault_type: string;
  description: string | null;
  created_at: string | null;
};

export type FeedbackInsert = Omit<Feedback, "id" | "created_at">;
export type FeedbackUpdate = Partial<FeedbackInsert>;
export interface GameSession{
  id: number;
  startDate: string;
  endDate: string;
  correctAnswers: number;
  wrongAnswers: number;
  questionsCount: number;
}

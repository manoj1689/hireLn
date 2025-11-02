import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const getColor = (rating?: string) => {
  if (!rating) return "text-muted-foreground";

  switch (rating.toLowerCase()) {
    case "high":
      return "text-green-600";
    case "medium":
      return "text-yellow-600";
    case "low":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
};

export const EvaluationTabs = ({ evaluations }: { evaluations: any[] }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  return (
    <Tabs defaultValue="overview" className="mb-6">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="questions">Questions</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="transcript">Transcript</TabsTrigger>
        <TabsTrigger value="recordings">Recordings</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Interview Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {evaluations.length === 0 ? (
              <p>No evaluation summaries available.</p>
            ) : (
              evaluations.map((e, idx) => (
                <Card key={idx} className="bg-muted/50">
                  <CardContent className="p-4 space-y-2">
                    <p className="font-medium text-sm text-muted-foreground">
                      Q: {e.questionText}
                    </p>
                    <p className="text-sm">{e.finalEvaluation}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Questions Tab */}
      <TabsContent value="questions" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Evaluation by Question</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {evaluations.map((e, idx) => {
                const isOpen = openIndexes.includes(idx);

                return (
                  <Card key={idx}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold mb-1">
                            Q{idx + 1}:{" "}
                            <span className="text-primary">
                              {e.questionText}
                            </span>
                          </p>
                          <p>Score: {e.evaluation?.score}/5</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleIndex(idx)}
                          className="text-sm"
                        >
                          {isOpen ? (
                            <>
                              Hide Answer <ChevronUp className="ml-1 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Show Answer{" "}
                              <ChevronDown className="ml-1 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>

                      {isOpen && (
                        <div className="bg-muted p-3 rounded-md text-sm">
                          <p className="font-medium mb-1">
                            Candidate's Answer:
                          </p>
                          <p className="text-muted-foreground">
                            {e.answerText}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                        <div
                          className={getColor(e.evaluation?.factualAccuracy)}
                        >
                          <strong>Factual:</strong>{" "}
                          {e.evaluation?.factualAccuracy}
                        </div>
                        <div className={getColor(e.evaluation?.completeness)}>
                          <strong>Completeness:</strong>{" "}
                          {e.evaluation?.completeness}
                        </div>
                        <div className={getColor(e.evaluation?.relevance)}>
                          <strong>Relevance:</strong> {e.evaluation?.relevance}
                        </div>
                        <div className={getColor(e.evaluation?.coherence)}>
                          <strong>Coherence:</strong> {e.evaluation?.coherence}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Skills Tab */}
      <TabsContent value="skills" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Skill Evaluation (Based on Available Data)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="text-sm">
                All evaluations scored 1 out of 5 due to unanswered questions.
              </li>
              <Progress value={5} className="h-2" />
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Transcript Tab */}
      <TabsContent value="transcript" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            {evaluations.map((e, i) => (
              <div key={i} className="space-y-2 border-b pb-4 mb-4">
                <p className="text-sm font-medium">Q: {e.questionText}</p>
                <p className="text-sm text-muted-foreground">
                  A: {e.answerText}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Recordings Tab */}
      <TabsContent value="recordings">
        <Card>
          <CardHeader>
            <CardTitle>Interview Recording</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground">
              No recording available.
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notes Tab */}
      <TabsContent value="notes" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Enter notes..." rows={4} className="mb-3" />
            <Button>Save Note</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

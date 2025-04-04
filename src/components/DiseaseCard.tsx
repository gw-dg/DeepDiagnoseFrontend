import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DiseaseCard({ predictions }) {
  const cleanArrayString = (str: string | undefined) => {
    if (!str) return [];
    return str.replace(/[[\]']/g, "").split(", ");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {predictions.map((prediction, index) => (
          <Card key={index} className="overflow-hidden h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>{prediction.Disease}</CardTitle>
                <Badge variant={index === 0 ? "default" : "outline"}>
                  {Math.round(prediction.Probability * 100)}%
                </Badge>
              </div>
              <CardDescription className="mt-2">
                {prediction.Description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <Tabs defaultValue="precautions" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="precautions">Precautions</TabsTrigger>
                  <TabsTrigger value="diet">Diet</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                </TabsList>

                <TabsContent value="precautions" className="mt-4">
                  <ul className="list-disc pl-5 space-y-1">
                    {prediction.Precautions.slice(1).map((precaution, i) => (
                      <li key={i} className="text-sm">
                        {precaution}
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="diet" className="mt-4">
                  <ul className="list-disc pl-5 space-y-1">
                    {cleanArrayString(prediction.Diet[0]).map((diet, i) => (
                      <li key={i} className="text-sm">
                        {diet}
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="medications" className="mt-4">
                  <ul className="list-disc pl-5 space-y-1">
                    {cleanArrayString(prediction.Medications[0]).map(
                      (medication, i) => (
                        <li key={i} className="text-sm">
                          {medication}
                        </li>
                      )
                    )}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DiseaseCard;

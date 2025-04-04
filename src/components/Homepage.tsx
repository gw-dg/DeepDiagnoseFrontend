import { useState } from "react";
import Header from "./Header";
import Search from "./Search";
import DiseaseCard from "./DiseaseCard";

interface Prediction {
  Disease: string;
  Probability: number;
  Description: string;
  Precautions: string[];
  Diet: string[] | [string];
  Medications: string[] | [string];
}

function Homepage() {
  const [predictedDiseases, setPredictedDiseases] = useState<Prediction[]>([]);
  return (
    <div>
      <Header />
      <Search setPredictedDiseases={setPredictedDiseases} />
      <div className="mt-5 flex justify-center items-center mx-auto max-w-2xl md:max-w-4xl lg:max-w-5xl mb-5">
        {predictedDiseases.length > 0 && (
          <DiseaseCard predictions={predictedDiseases} />
        )}
      </div>
    </div>
  );
}

export default Homepage;

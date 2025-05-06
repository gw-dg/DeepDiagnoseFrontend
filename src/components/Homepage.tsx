import { useState } from "react";
import Header from "./Header";
import Search from "./Search";
import DiseaseCard from "./DiseaseCard";
import ChatBot from "./ChatBot";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Prediction {
  Disease: string;
  Probability: number;
  Description: string;
  Precautions: string[];
  Diet: string[] | [string];
  Medications: string[] | [string];
}

const botPfp =
  "https://about.fb.com/wp-content/uploads/2024/04/Meta-AI-Expasion_Header.gif?fit=1920%2C1080";

function Homepage() {
  const [predictedDiseases, setPredictedDiseases] = useState<Prediction[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      <Header />
      <Search setPredictedDiseases={setPredictedDiseases} />
      <div className="mt-5 flex justify-center items-center mx-auto max-w-2xl md:max-w-4xl lg:max-w-5xl mb-5">
        {predictedDiseases.length > 0 && (
          <DiseaseCard predictions={predictedDiseases} />
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-3 -top-3 rounded-full z-10 bg-background shadow-md"
              onClick={toggleChat}>
              <X className="h-4 w-4" />
            </Button>
            <div className="w-80 md:w-96 h-[70vh]  shadow-xl">
              <ChatBot />
            </div>
          </div>
        ) : (
          <Button
            onClick={toggleChat}
            size="icon"
            className="rounded-full h-14 w-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all p-0 overflow-hidden">
            <div className="h-14 w-14 rounded-full overflow-hidden">
              <img
                src={botPfp}
                alt="DeepDiagnose AI"
                className="h-full w-full object-cover"
              />
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}

export default Homepage;

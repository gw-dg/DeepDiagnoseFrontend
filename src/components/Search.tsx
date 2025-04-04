import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Prediction {
  Disease: string;
  Probability: number;
  Description: string;
  Precautions: string[];
  Diet: string[] | [string];
  Medications: string[] | [string];
}

interface SearchProps {
  setPredictedDiseases: React.Dispatch<React.SetStateAction<Prediction[]>>;
}

function Search({ setPredictedDiseases }: SearchProps) {
  const [input, setInput] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string[]>([]);

  const handleAdd = (): void => {
    console.log("clicked add");
    if (input.trim()) {
      const newInput = " " + input.trim();
      setSymptoms((prev) => {
        if (prev.includes(newInput)) return prev;

        return [...prev, newInput];
      });
      setInput("");
    }
    console.log(symptoms);
  };

  const handleRemoveSymptom = (symptom: string): void => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  };

  const predictDisease = async (): Promise<void> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/predict`,
        {
          symptoms: symptoms,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPredictedDiseases(response.data.predictions);
      console.log(response.data.predictions);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col max-w-lg md:max-w-2xl lg:max-w-3xl space-y-6 mt-20 mx-auto">
      <div className="flex justify-around w-full max-w-lg md:max-w-2xl lg:max-w-3xl space-x-2">
        <Input
          type="email"
          placeholder="Enter symptoms here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-400"
        />
        <Button
          type="submit"
          variant={"outline"}
          className="bg-black text-white hover:text-white hover:bg-black/90 dark:bg-white/90 dark:text-black dark:hover:bg-white/70"
          onClick={() => handleAdd()}>
          Add
        </Button>
      </div>

      {symptoms && (
        <div className="flex flex-wrap gap-2 mb-4">
          {symptoms.map((symptom, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1 dark:bg-zinc-800 dark:text-white dark:border-zinc-700">
              {symptom}
              <button
                className="ml-2 text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white"
                onClick={() => handleRemoveSymptom(symptom)}>
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-black text-white hover:bg-black/90 dark:bg-white/90 dark:text-black dark:hover:bg-white/70"
        onClick={() => predictDisease()}>
        Search
      </Button>
    </div>
  );
}

export default Search;

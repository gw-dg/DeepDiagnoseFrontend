import { useState } from "react";
import Header from "./Header";
import Search from "./Search";
import DiseaseCard from "./DiseaseCard";

function Homepage() {
  const [predictedDiseases, setPredictedDiseases] = useState([]);
  return (
    <div>
      <Header />
      <Search setPredictedDiseases={setPredictedDiseases} />
      <div className="mt-5 flex justify-center items-center mx-auto max-w-2xl md:max-w-4xl lg:max-w-5xl mb-5">
        {predictedDiseases && <DiseaseCard predictions={predictedDiseases} />}
      </div>
    </div>
  );
}

export default Homepage;

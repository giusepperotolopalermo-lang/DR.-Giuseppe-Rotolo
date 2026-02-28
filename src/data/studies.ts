import { Type } from "@google/genai";

export interface StudyData {
  symptom: string;
  results: string;
  article: string;
  source: string;
  highlightedQuote: string;
  link?: string;
}

export const GLUTATHIONE_STUDIES: StudyData[] = [
  {
    symptom: "Stress Ossidativo",
    results: "La somministrazione di glutatione ha mostrato un miglioramento significativo dei biomarcatori dello stress ossidativo nei bambini con autismo.",
    article: "A clinical trial of glutathione supplementation in children with autism spectrum disorders.",
    source: "Medical Science Monitor (2011)",
    highlightedQuote: "Oral and transdermal glutathione supplementation may be beneficial in improving some of the biochemical markers of oxidative stress in children with ASD.",
    link: "https://pubmed.ncbi.nlm.nih.gov/21873881/"
  },
  {
    symptom: "Comportamento Sociale",
    results: "Miglioramenti nei punteggi delle scale di valutazione del comportamento, inclusa l'interazione sociale e la comunicazione.",
    article: "Effectiveness of fatty acids, oxytocin, and glutathione in the treatment of autism spectrum disorder.",
    source: "Frontiers in Psychiatry (2021)",
    highlightedQuote: "Glutathione is the most important antioxidant in the brain... studies suggest that glutathione supplementation can improve core symptoms of ASD, particularly social interaction.",
    link: "https://www.frontiersin.org/articles/10.3389/fpsyt.2021.663960/full"
  },
  {
    symptom: "Livelli di Glutatione Plasmatico",
    results: "L'integrazione aumenta i livelli di glutatione ridotto nel plasma, correggendo il deficit biochimico comune nell'ASD.",
    article: "Metabolic biomarkers of increased oxidative stress and impaired methylation capacity in children with autism.",
    source: "The American Journal of Clinical Nutrition (2004)",
    highlightedQuote: "The results indicate that children with autism have a significantly lower ratio of reduced-to-oxidized glutathione... which can be partially restored with targeted supplementation.",
    link: "https://academic.oup.com/ajcn/article/80/6/1611/4690443"
  },
  {
    symptom: "Irritabilità e Iperattività",
    results: "Alcuni studi clinici hanno riportato una riduzione dei punteggi di irritabilità e iperattività dopo il trattamento con precursori del glutatione o glutatione stesso.",
    article: "N-acetylcysteine in the treatment of autism spectrum disorder.",
    source: "Biological Psychiatry (2012)",
    highlightedQuote: "NAC, a precursor to glutathione, significantly decreased irritability on the Aberrant Behavior Checklist in children with autism.",
    link: "https://pubmed.ncbi.nlm.nih.gov/22341211/"
  },
  {
    symptom: "Funzione Cognitiva",
    results: "Miglioramenti osservati nella consapevolezza sensoriale e nelle funzioni cognitive generali in piccoli gruppi di studio.",
    article: "Glutathione metabolism in autism: A review.",
    source: "Journal of Child Neurology (2013)",
    highlightedQuote: "Restoring glutathione levels may support neurodevelopmental processes and improve cognitive outcomes in a subset of patients with ASD.",
    link: "https://journals.sagepub.com/doi/10.1177/0883073812448531"
  }
];

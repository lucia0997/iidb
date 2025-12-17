import { getTechnologyOptions } from "../../services/TechnologiesService/technologies.service";
import { makeUseFacetOptions } from "../FacetOptions/useFacetOptions";

export const useTechnologies = makeUseFacetOptions(
    'technologies',
    getTechnologyOptions
)
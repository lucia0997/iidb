import { getTechnologyOptions } from "../../services/technologies.service";
import { makeUseFacetOptions } from "../FacetOptions/useFacetOptions";

export const useTechnologies = makeUseFacetOptions(
    'technologies',
    getTechnologyOptions
)
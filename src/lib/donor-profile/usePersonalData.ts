"use client";

import { useSyncExternalStore } from "react";
import { getPersonalData, subscribeToPersonalData } from "./personalData";
import type { DonorEditablePersonalData } from "./types";
import { INITIAL_PERSONAL_DATA } from "./data";

function getServerSnapshot(): DonorEditablePersonalData {
  return INITIAL_PERSONAL_DATA;
}

export function usePersonalData(): DonorEditablePersonalData {
  return useSyncExternalStore(subscribeToPersonalData, getPersonalData, getServerSnapshot);
}

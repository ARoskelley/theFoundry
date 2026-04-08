"use client";

import React, { createContext, useContext, useReducer, type ReactNode } from "react";
import type { SiteData, IndustryType } from "./types";
import { defaultSiteData } from "./defaults";

export interface WizardState {
  siteData: SiteData;
  industryType: IndustryType | null;
  selectedTemplate: string;
  currentStep: number;
}

type Action =
  | { type: "SET_FIELD"; path: string; value: unknown }
  | { type: "SET_INDUSTRY"; industry: IndustryType | null }
  | { type: "SET_TEMPLATE"; template: string }
  | { type: "SET_STEP"; step: number }
  | { type: "LOAD_DATA"; data: SiteData }
  | { type: "ADD_LIST_ITEM"; path: string; item: unknown }
  | { type: "REMOVE_LIST_ITEM"; path: string; index: number }
  | { type: "UPDATE_LIST_ITEM"; path: string; index: number; value: unknown };

const initialState: WizardState = {
  siteData: structuredClone(defaultSiteData),
  industryType: null,
  selectedTemplate: "service",
  currentStep: 0,
};

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const clone = structuredClone(obj) as Record<string, unknown>;
  const keys = path.split(".");
  let current = clone as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    if (current[keys[i]] === undefined || current[keys[i]] === null) {
      current[keys[i]] = {};
    }
    current = current[keys[i]] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
  return clone;
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case "SET_FIELD": {
      const newData = setNestedValue(
        state.siteData as unknown as Record<string, unknown>,
        action.path,
        action.value
      );
      return { ...state, siteData: newData as unknown as SiteData };
    }
    case "SET_INDUSTRY": {
      const newState = { ...state, industryType: action.industry };
      const data = structuredClone(state.siteData);
      // Clear all industry data, then set the active one
      data.restaurant = undefined;
      data.contractor = undefined;
      data.realEstate = undefined;
      data.service = undefined;
      if (action.industry === "restaurant") {
        data.restaurant = { menuSections: [], gallery: [] };
      } else if (action.industry === "contractor") {
        data.contractor = { beforeAfter: [], process: [], certifications: [] };
      } else if (action.industry === "realEstate") {
        data.realEstate = { featuredListings: [], agents: [], neighborhoods: [] };
      } else if (action.industry === "service") {
        data.service = { pricing: [], faqs: [], coverage: { areas: [], notes: "" } };
      }

      // Auto-select matching template
      let template = state.selectedTemplate;
      if (action.industry === "restaurant") template = "restaurant";
      else if (action.industry === "contractor") template = "contractor";
      else if (action.industry === "realEstate") template = "realestate";
      else if (action.industry === "service") template = "service";

      return { ...newState, siteData: data, selectedTemplate: template };
    }
    case "SET_TEMPLATE":
      return { ...state, selectedTemplate: action.template };
    case "SET_STEP":
      return { ...state, currentStep: action.step };
    case "LOAD_DATA":
      return { ...state, siteData: structuredClone(action.data) };
    case "ADD_LIST_ITEM": {
      const arr = [
        ...((getNestedValue(
          state.siteData as unknown as Record<string, unknown>,
          action.path
        ) as unknown[]) || []),
        action.item,
      ];
      const newData = setNestedValue(
        state.siteData as unknown as Record<string, unknown>,
        action.path,
        arr
      );
      return { ...state, siteData: newData as unknown as SiteData };
    }
    case "REMOVE_LIST_ITEM": {
      const currentArr = [
        ...((getNestedValue(
          state.siteData as unknown as Record<string, unknown>,
          action.path
        ) as unknown[]) || []),
      ];
      currentArr.splice(action.index, 1);
      const newData = setNestedValue(
        state.siteData as unknown as Record<string, unknown>,
        action.path,
        currentArr
      );
      return { ...state, siteData: newData as unknown as SiteData };
    }
    case "UPDATE_LIST_ITEM": {
      const currentArr2 = [
        ...((getNestedValue(
          state.siteData as unknown as Record<string, unknown>,
          action.path
        ) as unknown[]) || []),
      ];
      currentArr2[action.index] = action.value;
      const newData = setNestedValue(
        state.siteData as unknown as Record<string, unknown>,
        action.path,
        currentArr2
      );
      return { ...state, siteData: newData as unknown as SiteData };
    }
    default:
      return state;
  }
}

const WizardContext = createContext<{
  state: WizardState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}

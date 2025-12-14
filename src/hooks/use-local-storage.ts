"use client";

import { useState, useEffect, useCallback } from "react";

function getStorageValue<T>(key: string, defaultValue: T): T {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    if (saved !== null && saved !== 'undefined') {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Error parsing JSON from localStorage", error);
        return defaultValue;
      }
    }
  }
  return defaultValue;
}

export const useLocalStorage = <T,>(key: string, defaultValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    setValue(getStorageValue(key, defaultValue));
  }, [key, defaultValue]);

  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        if (typeof window !== "undefined") {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error("Error setting item to localStorage", error);
      }
    },
    [key, value]
  );

  return [value, setStoredValue];
};

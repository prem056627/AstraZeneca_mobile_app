import { createContext, useEffect, useMemo, useState, useContext } from 'react';
import { trefoil } from 'ldrs';

// Register the trefoil component
trefoil.register();

// Create the LoaderContext
export const LoaderContext = createContext();

// Custom hook to use the loader context
export const useLoader = () => useContext(LoaderContext);

export default function LoaderContextProvider({ children }) {
  const [isLoading, setLoading] = useState(false);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    // Keeps visibility in sync with loading
    setVisible(isLoading);
  }, [isLoading]);

  const contextValue = useMemo(() => {
    return { isVisible, isLoading, setLoading };
  }, [isVisible, isLoading]);

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-[1051]">
          <l-trefoil
            size="50"
            stroke="4"
            stroke-length="0.15"
            bg-opacity="0.1"
            speed="1.4"
            color="#7C084B"
          ></l-trefoil>
        </div>
      )}
    </LoaderContext.Provider>
  );
}
import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = sessionStorage.getItem('thapar_compare_properties');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem('thapar_compare_properties', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (property) => {
    if (compareItems.find((item) => item._id === property._id)) {
      return { success: false, message: 'Property is already in comparison list.' };
    }
    if (compareItems.length >= 4) {
      return { success: false, message: 'You can compare a maximum of 4 properties at once.' };
    }
    setCompareItems((prev) => [...prev, property]);
    return { success: true, message: 'Added to comparison list!' };
  };

  const removeFromCompare = (propertyId) => {
    setCompareItems((prev) => prev.filter((item) => item._id !== propertyId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (propertyId) => {
    return compareItems.some((item) => item._id === propertyId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        compareCount: compareItems.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);

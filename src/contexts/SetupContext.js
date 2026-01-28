
import React, { createContext, useContext } from 'react';

// Contexto simples para gerenciar o estado de setup
export const SetupContext = createContext({
    isReady: false,
    setSetupCompleted: () => { },
    resetSetup: () => { },
});

export const useSetup = () => useContext(SetupContext);

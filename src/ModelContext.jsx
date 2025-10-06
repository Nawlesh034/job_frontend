import { createContext, useContext, useState } from "react";


const ModelContext = createContext()


export function ModelProvider({children}){
    const [isOpen,setOpen] = useState(false)

   

    return(
        <ModelContext.Provider value={{isOpen,setOpen}}>
            {children}
        </ModelContext.Provider>
    )
}



export function useModel() {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error("useModel must be used within ModelProvider");

  const { isOpen, setOpen } = ctx;

  const open = () => setOpen(true);
  const close = () => setOpen(false);
  const toggle = () => setOpen((prev) => !prev);

  return { isOpen, open, close, toggle };
}
import { createContext, useContext, useState, type ReactNode } from "react";
import { initialMeetings, type Meeting } from "./meetings";

type Ctx = {
  meetings: Meeting[];
  addMeeting: (m: Meeting) => void;
};

const MeetingsContext = createContext<Ctx | null>(null);

export function MeetingsProvider({ children }: { children: ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);

  const addMeeting = (m: Meeting) => {
    setMeetings((prev) => [m, ...prev]);
  };

  return (
    <MeetingsContext.Provider value={{ meetings, addMeeting }}>
      {children}
    </MeetingsContext.Provider>
  );
}

export function useMeetings(): Ctx {
  const ctx = useContext(MeetingsContext);
  if (!ctx) throw new Error("useMeetings must be used inside MeetingsProvider");
  return ctx;
}

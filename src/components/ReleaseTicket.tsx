"use client";
import {api} from "../../convex/_generated/api"
import {Id} from "../../convex/_generated/dataModel"
import { useMutation } from 'convex/react';
import { useState } from 'react';
import {XCircle} from "lucide-react";



 
function ReleaseTicket({eventId,waitingListId}: {eventId:Id<"events">,waitingListId:Id<"waitingList">}) {
  const [isReleasing,setIsReleasing] = useState(false);
  const releaseTicket = useMutation(api.waitingList.releaseTicket);

  const handleRelease = async () => {
    if(!confirm("Are you sure you want to release this ticket offer?")) return;
    try{
      setIsReleasing(true);
      await releaseTicket({eventId,waitingListId});
    }catch(error){
      console.error("Error Releasing ticket",error);
    }finally{
      setIsReleasing(false);
    }
  }
  return (
   <button className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700
    rounded-lg hover:bg-red-200 transiton disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleRelease} disabled={isReleasing}>
      <XCircle className="w-4 h-4" />
      {isReleasing ? "Releasing..." : "Release Ticket Offer"}
    </button>
  )
}

export default ReleaseTicket

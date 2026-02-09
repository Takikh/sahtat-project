import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function getVisitorId() {
  let id = localStorage.getItem("visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitor_id", id);
  }
  return id;
}

export function usePageTracking() {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    if (location.pathname === lastPath.current) return;
    lastPath.current = location.pathname;

    supabase.from("page_views").insert({
      page_path: location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      visitor_id: getVisitorId(),
    });
  }, [location.pathname]);
}

export function trackProjectView(projectId: string) {
  supabase.from("project_views").insert({
    project_id: projectId,
    visitor_id: localStorage.getItem("visitor_id") || crypto.randomUUID(),
  });
}

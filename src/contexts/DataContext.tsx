"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type SiteData } from "@/types/commands";

// Static data imports as fallback
import { profile as staticProfile } from "@/data/profile";
import { projects as staticProjects } from "@/data/projects";
import { blogPosts as staticBlogPosts } from "@/data/blog";
import { skillCategories as staticSkillCategories } from "@/data/skills";
import { experiences as staticExperiences } from "@/data/experience";
import { educationList as staticEducationList, certificates as staticCertificates } from "@/data/education";
import { contact as staticContact } from "@/data/contact";
import { socials as staticSocials } from "@/data/socials";
import { announcements as staticAnnouncements } from "@/data/announcements";

interface DataContextValue {
  data: SiteData | null;
  loading: boolean;
}

const staticData: SiteData = {
  profile: staticProfile,
  projects: staticProjects,
  blogPosts: staticBlogPosts,
  skillCategories: staticSkillCategories,
  experiences: staticExperiences,
  educationList: staticEducationList,
  certificates: staticCertificates,
  contact: staticContact,
  socials: staticSocials,
  announcements: staticAnnouncements,
};

const DataContext = createContext<DataContextValue>({ data: staticData, loading: false });

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(staticData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/data")
      .then((res) => {
        if (!res.ok) throw new Error("API unavailable");
        return res.json();
      })
      .then((apiData) => {
        // Only use API data if it has content
        if (apiData.profile) {
          setData(apiData);
        }
      })
      .catch(() => {
        // Fallback to static data silently
      })
      .finally(() => setLoading(false));
  }, []);

  return <DataContext.Provider value={{ data, loading }}>{children}</DataContext.Provider>;
}

export function useSiteData() {
  return useContext(DataContext);
}

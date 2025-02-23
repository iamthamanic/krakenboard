
import { useQuery } from "@tanstack/react-query";
import { SocialMediaService, SocialMediaMetrics } from "@/services/integrations/SocialMediaService";

export const useSocialMediaMetrics = (platform: string) => {
  return useQuery({
    queryKey: ['social-media', platform],
    queryFn: () => SocialMediaService.getMetrics(platform),
    refetchInterval: 5 * 60 * 1000, // Alle 5 Minuten aktualisieren
  });
};
